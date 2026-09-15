#!/usr/bin/env node
/**
 * scripts/probe-safe-area.mjs · 信息安全区取证探针（已接进 gate-all）
 *
 * 核心目标：防止抖音发布后的横向裁边/侧边 UI 吃掉重要信息。
 * 用户口径：信息内容要完整显示，不要明显贴着边缘；重点硬约束是左右内容安全。
 *
 * 判据口径：
 *   - 左/右 120px：硬闸门，检查局部内容像素是否侵入。
 *   - 顶 120px：只做诊断记录，不作为硬失败；顶部不存在与抖音侧边裁切同等的风险，最终由真图审判断是否“明显贴边”。
 *   - 底 160px：不量（与字幕带 y1760~1920 重合，字幕按设计位于底部带）。
 *   - 字幕带：单独检查字形是否越左右 120px。
 *   - full-bleed 氛围层：连续两侧高覆盖行过滤；content-only probe 优先从渲染入口去掉合法全屏背景。
 *
 * 这不是“所有像素离边缘必须 120px”的审美尺子，而是捕捉明确会影响信息可见性的危险侵入。
 * 机器发现红灯后必须回真图确认是文字/实色信息，再决定是否修改；不为过机器而缩小整片。
 *
 * 用法：node scripts/probe-safe-area.mjs [--ink 100] outputs/gXX-行业/frames/*.png
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = join(ROOT, 'video/node_modules/ffmpeg-static/ffmpeg');
const W = 1080, H = 1920;
const SAFE = { side: 120, top: 120, bottom: 160 };
const SUB = { y0: 1760, y1: 1920 };
const BG_T = 24;
const FULL_BLEED_RATIO = 0.75;

const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const inkArg = process.argv.indexOf('--ink');
const INK_T = inkArg > -1 ? Number(process.argv[inkArg + 1]) : 100;
if (!files.length) { console.error('用法：node scripts/probe-safe-area.mjs [--ink 100] <png...>'); process.exit(2); }
if (!existsSync(FFMPEG)) { console.error(`❌ 找不到 ffmpeg：${FFMPEG}`); process.exit(2); }

function decode(p) {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-i', p,
    '-vf', `scale=${W}:${H}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
  if (r.status !== 0) { console.error(`❌ 解码失败：${p}`); process.exit(1); }
  return r.stdout;
}

function bgColor(px) {
  const b = [];
  for (let x = 0; x < W; x++) for (const y of [0, 1, 2, 3, H - 4, H - 3, H - 2, H - 1]) b.push([x, y]);
  for (let y = 4; y < H - 4; y++) for (const x of [0, 1, 2, 3, W - 4, W - 3, W - 2, W - 1]) b.push([x, y]);
  const med = (c) => b.map(([x, y]) => px[(y * W + x) * 3 + c]).sort((a, z) => a - z)[Math.floor(b.length / 2)];
  return [0, 1, 2].map(med);
}

const diff = (px, i, bg) => Math.max(
  Math.abs(px[i * 3] - bg[0]), Math.abs(px[i * 3 + 1] - bg[1]), Math.abs(px[i * 3 + 2] - bg[2]));

function runs(counts, min) {
  const out = [];
  let s = -1, peak = 0;
  for (let i = 0; i <= counts.length; i++) {
    const on = i < counts.length && counts[i] >= min;
    if (on) { if (s < 0) { s = i; peak = counts[i]; } else peak = Math.max(peak, counts[i]); continue; }
    if (s >= 0) { out.push({ from: s, to: i - 1, peak }); s = -1; peak = 0; }
  }
  return out;
}
const fmt = (rs, min) => rs.filter((r) => r.peak >= min)
  .map((r) => `${r.from}-${r.to}(峰值${r.peak})`).join(' ') || '—';

let anyFail = false;
console.log(`\n══════ 信息安全区探针 ══════\n硬闸门：左/右 ${SAFE.side}px（防抖音侧边裁切/遮挡）\n诊断：顶部 ${SAFE.top}px（不单独定罪，最终看真图是否明显贴边）\n底部 ${SAFE.bottom}px 不量｜字幕带：只查字形有没有越左右 ${SAFE.side}px 线\n判据：粗筛=与背景差>${BG_T}；定罪=局部墨级差>${INK_T}；full-bleed 连续行过滤\n`);

for (const p of files) {
  const px = decode(p), bg = bgColor(px);
  const loose = { left: 0, right: 0, top: 0 };
  const ink = { left: 0, right: 0, top: 0 };
  const rowL = new Int32Array(H), rowR = new Int32Array(H);
  const subRowL = new Int32Array(H), subRowR = new Int32Array(H);
  const colT = new Int32Array(W);
  let subWide = 0, subInk = 0, subFiltered = 0;

  for (let y = 0; y < H; y++) {
    const inSub = y >= SUB.y0 && y < SUB.y1;
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = diff(px, i, bg);
      if (d <= BG_T) continue;
      const outSide = x < SAFE.side || x >= W - SAFE.side;
      if (inSub) {
        if (outSide) {
          subWide++;
          if (d > INK_T) {
            if (x < SAFE.side) subRowL[y]++;
            else subRowR[y]++;
          }
        }
        continue;
      }
      if (x < SAFE.side) loose.left++;
      else if (x >= W - SAFE.side) loose.right++;
      if (y < SAFE.top) loose.top++;
      if (d <= INK_T) continue;
      if (x < SAFE.side) { ink.left++; rowL[y]++; }
      else if (x >= W - SAFE.side) { ink.right++; rowR[y]++; }
      if (y < SAFE.top) { ink.top++; colT[x]++; }
    }
  }

  let filteredLeft = 0, filteredRight = 0;
  for (let y = SAFE.top; y < SUB.y0; y++) {
    if (rowL[y] >= SAFE.side * FULL_BLEED_RATIO && rowR[y] >= SAFE.side * FULL_BLEED_RATIO) {
      filteredLeft += rowL[y];
      filteredRight += rowR[y];
      rowL[y] = 0;
      rowR[y] = 0;
    }
  }
  ink.left -= filteredLeft;
  ink.right -= filteredRight;

  for (let y = SUB.y0; y < SUB.y1; y++) {
    if (subRowL[y] >= SAFE.side * FULL_BLEED_RATIO && subRowR[y] >= SAFE.side * FULL_BLEED_RATIO) {
      subFiltered += subRowL[y] + subRowR[y];
      subRowL[y] = 0;
      subRowR[y] = 0;
    }
  }
  subInk = 0;
  for (let y = SUB.y0; y < SUB.y1; y++) subInk += subRowL[y] + subRowR[y];

  // 只有左右边带和字幕字形越线属于本探针硬失败；顶部保留诊断信息，交给真图审判断“明显贴边”。
  const fail = ink.left > 0 || ink.right > 0 || subInk > 0;
  anyFail ||= fail;
  const total = W * H;
  const pct = (n) => (n / total * 100).toFixed(3);
  console.log(`${fail ? '❌' : '✅'} ${p.split('/').pop().padEnd(26)}\n   粗筛 左${pct(loose.left)}% 右${pct(loose.right)}% 顶${pct(loose.top)}%（顶仅诊断）\n   墨级 左${pct(ink.left)}% 右${pct(ink.right)}% 顶${pct(ink.top)}%（顶仅诊断）\n   full-bleed 过滤 左${filteredLeft} 右${filteredRight}｜字幕带过滤 ${subFiltered}\n   左带行区间 ${fmt(runs(rowL, 2), 8)}\n   右带行区间 ${fmt(runs(rowR, 2), 8)}\n   顶带列区间 ${fmt(runs(colT, 2), 8)}\n   字幕带 ${subInk ? `❌ 局部字形越左右线 ${subInk} 墨级像素（粗筛 ${subWide}）` : `✅ 未见局部字形越左右线（粗筛 ${subWide} 像素；full-bleed 过滤 ${subFiltered}）`}\n`);
}

console.log(anyFail
  ? `\n❌ 至少一屏有信息内容侵入左右安全边带或字幕字形越线。请回真图确认后修正，不为过闸门盲目缩小整片。`
  : `\n✅ 全部样本未见信息内容侵入左右安全边带；顶部仅作诊断，最终由真图审确认是否明显贴边。`);
process.exit(anyFail ? 1 : 0);

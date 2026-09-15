#!/usr/bin/env node
/**
 * scripts/probe-safe-area.mjs · 文字安全区出界探针（**已接进 gate-all** 2026-09-14：对最新片静帧条件触发自动跑，无静帧跳过；仍可手动指定其它片静帧跑）
 *
 * 为什么要有它：`R3 §7.3` 定了「标题左右 padding ≥120px / 顶 ≥120px / 底 ≥160px」，
 * 而 `SKILL §三` 又要求「安全区达标与否量渲染像素，不靠读 CSS 推断」——此前没有任何工具量过像素，
 * 第十四轮那个"12 处出界"是读代码位置值读出来的，口径本身不成立。本探针补上这一量。
 * 2026-09-11 口径升级：左右 80px→120px——抖音 20:9 长屏全屏播放按屏比放大 1.18×、
 * 左右各实测裁约 82px（用户设备），iPhone 量级约 100px，80px 余量不足（教训见 project memory）。
 *
 * 判据口径（重要，别改成别的）：
 *   - 内容像素 = 与"边框背景色"RGB 任一通道差 > 24（与 check-motion 同一口径）
 *   - **底带不量**：R3 的"文字距底 ≥160px"与"字幕安全区 y1760~1920"是同一条 160px，
 *     字幕按设计就站在那里面。底带若照量，每一屏都出界，尺子立刻失去意义。
 *     字幕自己的问题改成单独一条：**字幕字形有没有越左右 120px 线**（越了会被抖音侧边 UI 挡）。
 *
 * 为什么光数边带像素不能定罪（第一版实测踩到的）：R3 这条量的是**文字**出界，而我们的背景是
 * 全幅铺满的纸纹素材，纹理、光晕、装饰件与背景的差都 >24，会全部计进边带，把"背景铺满"误判成
 * "标题越界"。因此本探针同时输出两组更保守的量：
 *   - 墨级像素：与背景最大通道差 > INK_T(100)，近似只有深色文字 / 高饱和实色块会命中
 *   - 剖面：对每条边带输出"有墨的连续行（或列）区间"，据此在真图上指认到底是哪个元素越界
 * 边带像素计数保留作粗筛，**结论以墨级 + 剖面 + 真图三者对齐为准**。
 *
 * 用法：node scripts/probe-safe-area.mjs [--ink 100] outputs/gXX-行业/frames/片N/*.png
 * 退出码：有**墨级**像素侵入左/右 120px 或顶 120px 边带，或字幕字形越左右线 → 1；否则 0。
 *         **仅供人判取证，不代表成片合格。**
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = join(ROOT, 'video/node_modules/ffmpeg-static/ffmpeg');
const W = 1080, H = 1920;
const SAFE = { side: 120, top: 120, bottom: 160 };
const SUB = { y0: 1760, y1: 1920 };   // 字幕带，整带排除
const BG_T = 24;

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

/** 边框背景色：取四边各 4 圈的像素，逐通道中位数 */
function bgColor(px) {
  const b = [];
  for (let x = 0; x < W; x++) for (const y of [0, 1, 2, 3, H - 4, H - 3, H - 2, H - 1]) b.push([x, y]);
  for (let y = 4; y < H - 4; y++) for (const x of [0, 1, 2, 3, W - 4, W - 3, W - 2, W - 1]) b.push([x, y]);
  const med = (c) => b.map(([x, y]) => px[(y * W + x) * 3 + c]).sort((a, z) => a - z)[Math.floor(b.length / 2)];
  return [0, 1, 2].map(med);
}

const diff = (px, i, bg) => Math.max(
  Math.abs(px[i * 3] - bg[0]), Math.abs(px[i * 3 + 1] - bg[1]), Math.abs(px[i * 3 + 2] - bg[2]));

/** 把"有内容的连续索引"压成区间列表（用于指认越界元素所在的行/列） */
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
console.log(`\n══════ 文字安全区探针 ══════
边带：左/右 ${SAFE.side}px｜顶 ${SAFE.top}px｜底 ${SAFE.bottom}px **不量**（与字幕带 y${SUB.y0}-${SUB.y1} 完全重合，R3 字幕本就站在那 160px 里）
字幕带：只查字形有没有越左右 ${SAFE.side}px 线
判据：粗筛=与背景差>${BG_T}（含背景纹理与装饰件，**不定罪**）；定罪=墨级 差>${INK_T}（近似文字与实色块）
`);

for (const p of files) {
  const px = decode(p), bg = bgColor(px);
  const loose = { left: 0, right: 0, top: 0 };
  const ink = { left: 0, right: 0, top: 0 };
  const rowL = new Int32Array(H), rowR = new Int32Array(H);
  const colT = new Int32Array(W);
  let subWide = 0, subInk = 0;

  for (let y = 0; y < H; y++) {
    const inSub = y >= SUB.y0 && y < SUB.y1;
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = diff(px, i, bg);
      if (d <= BG_T) continue;
      const outSide = x < SAFE.side || x >= W - SAFE.side;
      if (inSub) {
        if (outSide) { subWide++; if (d > INK_T) subInk++; }
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
  const fail = Object.values(ink).some((n) => n > 0) || subInk > 0;
  anyFail ||= fail;
  const total = W * H;
  const pct = (n) => (n / total * 100).toFixed(3);
  console.log(`${fail ? '❌' : '✅'} ${p.split('/').pop().padEnd(26)}
   粗筛 左${pct(loose.left)}% 右${pct(loose.right)}% 顶${pct(loose.top)}%（含背景纹理，不定罪）
   墨级 左${pct(ink.left)}% 右${pct(ink.right)}% 顶${pct(ink.top)}% 底 不计${fail ? '  ← 定罪' : ''}
   左带行区间 ${fmt(runs(rowL, 2), 8)}
   右带行区间 ${fmt(runs(rowR, 2), 8)}
   顶带列区间 ${fmt(runs(colT, 2), 8)}
   字幕带 ${subInk ? `❌ 字形越左右线 ${subInk} 墨级像素（粗筛 ${subWide}）` : `✅ 字形未越左右线（粗筛 ${subWide} 像素属背景纹理）`}
`);
}

console.log(anyFail
  ? `\n❌ 至少一屏有墨级像素侵入安全边带。行/列区间只告诉你"越界的东西在哪一条线上"，是标题、脚注还是角标须对真图看；小元素与标题出界处理方式不同，由用户拍板。`
  : `\n✅ 全部样本墨级四带零侵入（粗筛仍有背景纹理命中属正常）。不替代真图审。`);
process.exit(anyFail ? 1 : 0);

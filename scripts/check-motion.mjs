#!/usr/bin/env node
/**
 * scripts/check-motion.mjs · 画面效果尺子（量化"好不好看"里能被算的那部分）
 *
 * 为什么要有它：G04/G05 曾靠 AI 自评四维打勾通过（自评 4~4.5 分），实测却有 67% 时间画面几乎静止。
 * 能算的指标就不要留给自觉。
 *
 * 用法：
 *   node scripts/check-motion.mjs outputs/gXX-行业/gXX-成片.mp4           # 整片运动指标
 *   node scripts/check-motion.mjs outputs/bench/*.png ...            # 静态图只算画面占用率
 *   node scripts/check-motion.mjs <mp4> --json                            # 机器可读输出
 *
 * 指标与合格线（阈值属主＝`remotion-components` 包 §⑦B，RGB 口径）：静止占比 ≤45%｜中位帧间差 ≥0.35｜画面占用率 ≥70%
 * 参照（2026-08-29 实测）：我们 G04 = 67% / 0.12 / 63%；同事参考片 = 20% / 0.81 / 95%
 *
 * ⚠️ 占用率这把尺子的边界（2026-08-31 实测说清，别拿它当质量分）：它量的是"多少像素不是背景"，
 * 只防"空和死"。同日跑 `outputs/bench/*.png` 21 张——用户 08-29 **逐张认可过**的优秀排版样张——
 * 占用率 **11%~69%，21/21 全部低于 70%**；而 g06 片1 十二屏峰值静帧 74%~82%（仅 S8 69% 未达标，
 * 是已知待办）几乎全数过闸。也就是说这条线
 * **低于它不等于不合格、高于它更不等于好看**。禁止为过这条线加装饰（`SKILL.md` §四 末条 ❌对着指标凑画面）。
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = join(ROOT, 'video/node_modules/ffmpeg-static/ffmpeg');
const SIDE = 64;          // 分析分辨率（rgb24 64×64）
const FPS = 2;            // 采样率
const DEAD_T = 0.3;       // 死帧线：帧间差 ≤ 此值 = 画面基本没动（按两片实测校准，见下）
const CHANGE_T = 6;       // 帧间差 > 此值 = 一次明显画面变化
const BG_T = 24;          // 与背景色差 > 此值 = 算"内容像素"
const LIMITS = { staticPct: 45, medianDiff: 0.35, occupancy: 70 };
/**
 * 阈值怎么来的（2026-08-28 定标、2026-08-29 按 RGB 口径复测）：原先用绝对阈值 1.2，结果同一参考片在
 * 32×32 与 64×64 两种采样下算出 30% 与 77% —— 绝对阈值随采样分辨率漂移，不可信。改用两片实测分布定标：
 *   静止占比（死帧线 0.3）：G04（观感差）= 67%｜同事参考片（观感好）= 20%
 *   中位帧间差：G04 = 0.12｜参考片 = 0.81
 *   → 死帧线取 0.3（能稳定区分"没动"与"微动"）
 *   → 合格线：静止占比 ≤45%、中位帧间差 ≥0.35、画面占用率 ≥70%（占用率是防"空和死"的下限，不是质量分，见文件头）
 * 占用率 2026-08-29 由灰度改 RGB 三通道最大差：灰度会把"米白纸压浅蓝底"这类浅底浅卡画面严重低估
 * （G04 灰度 29% → RGB 63%；参考片 90% → 95%）。
 * 换设备/换采样后若数字漂移，重跑这两片重新定标，不要凭感觉调阈值。
 */

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const asJson = process.argv.includes('--json');
if (!args.length) { console.error('用法：node scripts/check-motion.mjs <mp4 | 图片...>'); process.exit(2); }
if (!existsSync(FFMPEG)) { console.error(`❌ 找不到 ffmpeg：${FFMPEG}`); process.exit(2); }

const videos = args.filter((p) => ['.mp4', '.mov', '.m4v', '.webm'].includes(extname(p).toLowerCase()));
const images = args.filter((p) => ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(p).toLowerCase()));

/** 从 ffmpeg 拿 RGB 帧序列（rawvideo rgb24），返回 [Buffer] */
function grabFrames(file) {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-i', file,
    '-vf', `fps=${FPS},scale=${SIDE}:${SIDE}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { maxBuffer: 1 << 28 });
  if (r.status !== 0) { console.error(`❌ ffmpeg 解码失败：${file}\n${r.stderr?.toString().slice(0, 300)}`); process.exit(1); }
  const buf = r.stdout, n = SIDE * SIDE * 3, frames = [];
  for (let i = 0; i + n <= buf.length; i += n) frames.push(buf.subarray(i, i + n));
  return frames;
}

/** 画面占用率：与"边框背景色"在 RGB 任一通道差异明显的像素占比
 *  （不用灰度：米白纸 #FBF7EF 压在浅蓝底上亮度几乎相同，灰度口径会低估一半） */
function occupancy(px) {
  const B = SIDE * SIDE, border = [];
  for (let i = 0; i < SIDE; i++) {
    for (const idx of [i, (SIDE - 1) * SIDE + i, i * SIDE, i * SIDE + SIDE - 1]) {
      border.push([px[idx * 3], px[idx * 3 + 1], px[idx * 3 + 2]]);
    }
  }
  const bg = [0, 1, 2].map((c) => border.map((p) => p[c]).sort((a, b) => a - b)[Math.floor(border.length / 2)]);
  let hit = 0;
  for (let i = 0; i < B; i++) {
    const d = Math.max(Math.abs(px[i * 3] - bg[0]), Math.abs(px[i * 3 + 1] - bg[1]), Math.abs(px[i * 3 + 2] - bg[2]));
    if (d > BG_T) hit++;
  }
  return hit / B * 100;
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
const results = [];

for (const v of videos) {
  const frames = grabFrames(v);
  if (frames.length < 4) { console.error(`❌ ${v} 采样帧过少（${frames.length}），拒绝在解析失败时判通过`); process.exit(1); }
  const diffs = [];
  for (let i = 1; i < frames.length; i++) {
    let s = 0; const a = frames[i - 1], b = frames[i];
    for (let k = 0; k < a.length; k++) s += Math.abs(a[k] - b[k]);
    diffs.push(s / a.length);
  }
  const sorted = diffs.slice().sort((a, b) => a - b);
  const staticPairs = diffs.filter((d) => d <= DEAD_T).length;
  const total = diffs.length / FPS;
  results.push({
    file: v, kind: 'video', seconds: +total.toFixed(1),
    staticPct: Math.round(staticPairs / diffs.length * 100),
    medianDiff: +sorted[Math.floor(sorted.length / 2)].toFixed(2),
    meanDiff: +mean(diffs).toFixed(2),
    changes: diffs.filter((d) => d > CHANGE_T).length,
    occupancy: +mean(frames.map((f) => occupancy(f))).toFixed(0),
  });
}

let imageFails = 0;
if (images.length) {
  const occ = images.map((p) => {
    const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-i', p,
      '-vf', `scale=${SIDE}:${SIDE}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 26 });
    if (r.status !== 0) { console.error(`❌ 解码失败：${p}`); process.exit(1); }
    return { file: p, occupancy: +occupancy(r.stdout).toFixed(0) };
  });
  if (asJson) console.log(JSON.stringify({ images: occ }, null, 1));
  else {
    console.log('\n══════════════ 画面占用率（静态图）══════════════');
    for (const o of occ) console.log(`${o.occupancy >= LIMITS.occupancy ? '✅' : '❌'} ${String(o.occupancy).padStart(3)}%  ${o.file}`);
    const bad = occ.filter((o) => o.occupancy < LIMITS.occupancy);
    imageFails = bad.length;
    console.log(bad.length ? `\n❌ ${bad.length}/${occ.length} 屏画面占用率低于 ${LIMITS.occupancy}%（不许拿空白当呼吸感）`
      : `\n✅ ${occ.length}/${occ.length} 屏画面占用率达标`);
  }
}

// 2026-08-30 修：图片模式占用率不达标必须反映到退出码（旧版写死 exit 0，红字绿码）
if (!videos.length) process.exit(imageFails ? 1 : 0);

if (asJson) { console.log(JSON.stringify(results, null, 1)); }
else {
  console.log('\n══════════════ 画面运动指标（check-motion）══════════════');
  console.log(`合格线：静止占比 ≤${LIMITS.staticPct}%｜中位帧间差 ≥${LIMITS.medianDiff}｜画面占用率 ≥${LIMITS.occupancy}%（死帧线 ${DEAD_T}，两片实测校准）`);
  for (const r of results) {
    console.log(`\n▸ ${r.file}（${r.seconds}s，采样 ${FPS}fps）`);
    console.log(`  ${r.staticPct <= LIMITS.staticPct ? '✅' : '❌'} 静止占比 ${r.staticPct}%\t${r.medianDiff >= LIMITS.medianDiff ? '✅' : '❌'} 中位帧间差 ${r.medianDiff}（持续微动强度）`);
    console.log(`  ${r.occupancy >= LIMITS.occupancy ? '✅' : '❌'} 画面占用率 ${r.occupancy}%\tℹ️ 明显画面变化 ${r.changes} 次｜均值 ${r.meanDiff}`);
  }
}
const fails = results.filter((r) => r.staticPct > LIMITS.staticPct || r.medianDiff < LIMITS.medianDiff
  || r.occupancy < LIMITS.occupancy);
if (!asJson) console.log(fails.length ? `\n❌ ${fails.length}/${results.length} 个文件未达合格线` : '\n✅ 全部达标');
process.exit(fails.length ? 1 : 0);

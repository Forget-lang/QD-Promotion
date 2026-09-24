#!/usr/bin/env node
/**
 * Negative test for 豁免收窄（CHANGE-20260924-057）：
 * 豁免只允许裁「判据红」，不允许裁「探针没跑起来」。
 *
 * 为什么需要它：旧版 `gate-all` 里 `if (!row.ok && waiver)` 一把梭——探针因为**环境问题**
 * 失败（找不到 ffmpeg、解码失败）时，红灯同样被转成"已裁放行"。2026-09-24 实测发生过：
 * 本机 `video/node_modules` 缺失导致探针报"找不到 ffmpeg"，那一行仍显示为已裁放行。
 *
 * 本测试用两条真实调用证明探针**自报状态**可区分这两类：
 *   ① 探针不可用（输入不存在）⇒ `PROBE_STATUS=UNAVAILABLE`，且退出码非 0；
 *   ② 探针真量过（拿已入库的成片）⇒ `PROBE_STATUS=VERDICT`（哪怕判据是红）。
 * `gate-all` 侧只认 `VERDICT` 才允许豁免——该分支由本契约保证可判（见 gate-all `probeStatusOf`）。
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..');
const statusOf = (out) => {
  const m = [...String(out).matchAll(/PROBE_STATUS=([A-Z_]+)/g)];
  return m.length ? m[m.length - 1][1] : 'UNKNOWN';
};
const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

// ① 输入不存在 ⇒ 探针不可用（不可裁）
const missing = path.join(ROOT, 'outputs', '__不存在的片__.mp4');
const a = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'check-motion.mjs'), missing], { encoding: 'utf8' });
const aOut = `${a.stdout}${a.stderr}`;
check(a.status !== 0, '① 输入不存在时 check-motion 竟然退出码 0');
check(statusOf(aOut) === 'UNAVAILABLE', `① 输入不存在时应自报 UNAVAILABLE，实得 ${statusOf(aOut)}`);

// ② 真量过 ⇒ VERDICT（判据红也算"可裁"）
const real = path.join(ROOT, 'outputs', 'g11-烧烤', 'g11-烧烤-有声成片.mp4');
if (!existsSync(real)) {
  failures.push(`② 找不到已入库成片：${real}（该用例依赖入库产物，不得静默跳过）`);
} else {
  const b = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'check-motion.mjs'), real], { encoding: 'utf8' });
  const bOut = `${b.stdout}${b.stderr}`;
  check(statusOf(bOut) === 'VERDICT', `② 真量过的探针应自报 VERDICT，实得 ${statusOf(bOut)}`);
  check(/静止占比 \d+%/.test(bOut), '② VERDICT 却没有任何读数 —— 状态与证据不符');
}

// ③ 安全区探针同契约（输入不存在 ⇒ UNAVAILABLE）
const c = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'probe-safe-area.mjs'), path.join(ROOT, 'outputs', '__不存在__.png')], { encoding: 'utf8' });
check(statusOf(`${c.stdout}${c.stderr}`) === 'UNAVAILABLE', `③ 安全区探针输入不存在时应自报 UNAVAILABLE，实得 ${statusOf(`${c.stdout}${c.stderr}`)}`);

if (failures.length) {
  console.error('PROBE-WAIVER NEGATIVE TEST FAIL:');
  for (const f of failures) console.error(`   - ${f}`);
  process.exit(1);
}
console.log('PROBE-WAIVER NEGATIVE TEST PASS: 探针自报 VERDICT/UNAVAILABLE 可区分；不可用态不可被豁免。');

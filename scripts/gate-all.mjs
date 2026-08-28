#!/usr/bin/env node
/**
 * scripts/gate-all.mjs · 五闸门一次跑完
 *
 * 为什么要它：闸门分散成五条命令时，新会话常常只跑其中一条（或干脆不跑），
 * 结果就是"规则在文档里、问题在成片里"。开工第 1 步跑这一个命令，**一开工就见红**。
 *
 * 用法：node scripts/gate-all.mjs          # 五闸门（红线/文档引用/事实/相似度/效果尺子）
 *      node scripts/gate-all.mjs --tsc   # 额外跑 video/ 的 tsc --noEmit
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GATES = [
  { key: 'redlines', label: '红线闸门（画面/口播硬禁）', args: ['scripts/check-redlines.mjs'] },
  { key: 'refs', label: '文档引用闸门（引用断链）', args: ['scripts/check-doc-references.mjs'] },
  { key: 'facts', label: '事实闸门（资产路径与素材对账）', args: ['scripts/check-facts.mjs'] },
  { key: 'similarity', label: '相似度闸门（整屏结构不得复用）', args: ['scripts/check-similarity.mjs'] },
];
const WITH_TSC = process.argv.includes('--tsc');
/** 效果尺子需要媒体文件：取 outputs 下最新的成片 mp4；没有就标跳过（不能假装通过） */
function newestVideo() {
  const { readdirSync, statSync } = require$fs();
  let best = null;
  for (const d of readdirSync(join(ROOT, 'outputs'))) {
    const dir = join(ROOT, 'outputs', d);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.mp4')) continue;
      const p = join(dir, f), m = statSync(p).mtimeMs;
      if (!best || m > best.m) best = { p, m };
    }
  }
  return best?.p ?? null;
}
function require$fs() { return createRequire(import.meta.url)('node:fs'); }

const run = (cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return { code: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}` };
};

const rows = [];
for (const g of GATES) {
  const { code, out } = run('node', g.args, ROOT);
  const last = out.trim().split('\n').filter(Boolean).pop() || '(无输出)';
  rows.push({ ok: code === 0, label: g.label, msg: last.replace(/^[\s✅❌⚠️]+/, '').slice(0, 96) });
}
if (WITH_TSC) {
  const { code, out } = run('npx', ['tsc', '--noEmit'], join(ROOT, 'video'));
  const err = out.split('\n').filter((l) => /error TS/.test(l));
  rows.push({ ok: code === 0, label: 'tsc --noEmit', msg: err.length ? err[0].slice(0, 96) : '零错误' });
}

const vid = newestVideo();
if (vid) {
  const { code, out } = run('node', ['scripts/check-motion.mjs', vid], ROOT);
  const m = out.match(/静止占比 (\d+)%/) , d = out.match(/中位帧间差 ([\d.]+)/), o = out.match(/画面占用率 (\d+)%/);
  rows.push({ ok: code === 0, label: '效果尺子（最新成片）',
    msg: `${code === 0 ? '达标' : '未达标'}｜${vid.split('/').slice(-2).join('/')}｜静止 ${m?.[1]}% 中位帧差 ${d?.[1]} 占用率 ${o?.[1]}%` });
} else {
  rows.push({ ok: true, label: '效果尺子', msg: '跳过（outputs 下暂无成片 mp4；出片后必跑）' });
}

console.log('\n══════════════ 五闸门总览（gate-all）══════════════');
for (const r of rows) console.log(`${r.ok ? '✅' : '❌'} ${r.label.padEnd(26)} ${r.msg}`);
const failed = rows.filter((r) => !r.ok);
console.log('\n──────────────────────────────────────────────────');
console.log(failed.length
  ? `❌ ${failed.length}/${rows.length} 个闸门未通过 —— 修完再开工/再交付；禁止带着红灯产出或改文档。`
  : `✅ ${rows.length}/${rows.length} 全通过，可以开工。`);
process.exit(failed.length ? 1 : 0);

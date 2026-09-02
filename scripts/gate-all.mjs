#!/usr/bin/env node
/**
 * scripts/gate-all.mjs · 全部闸门一次跑完（清单以下方 GATES 数组为准，不在注释里复述条数）
 *
 * 为什么要它：闸门分散成多条命令时，新会话常常只跑其中一条（或干脆不跑），
 * 结果就是"规则在文档里、问题在成片里"。开工第 1 步跑这一个命令，**一开工就见红**。
 *
 * 用法：node scripts/gate-all.mjs          # 全部门禁闸门 + 效果尺子
 *      node scripts/gate-all.mjs --tsc   # 额外跑 video/ 的 tsc --noEmit
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// 已裁项登记（scripts/ref-registry.json 的 motionWaivers）：用户逐张看过成片、认可「红灯是设计意图/交付终态」后登记，
// 令效果尺子不再每会话挡路——但数字照实打印、行标签标「已裁」。check-motion 本身仍是纯尺子，直接跑必报真值。
const REGISTRY = JSON.parse(createRequire(import.meta.url)('node:fs').readFileSync(join(ROOT, 'scripts/ref-registry.json'), 'utf8'));
const motionWaiver = (vidPath) => {
  const list = REGISTRY.motionWaivers || [];
  if (!list.length) return null;
  const m = /g\d{2}/i.exec(String(vidPath));
  const key = m ? m[0].toLowerCase() : null;
  return key ? (list.find((w) => String(w.video).toLowerCase() === key) || null) : null;
};
const GATES = [
  { key: 'redlines', label: '红线闸门（画面/口播硬禁）', args: ['scripts/check-redlines.mjs'] },
  { key: 'refs', label: '文档引用闸门（引用断链）', args: ['scripts/check-doc-references.mjs'] },
  { key: 'facts', label: '事实闸门（资产路径与素材对账）', args: ['scripts/check-facts.mjs'] },
  { key: 'similarity', label: '相似度闸门（整屏结构不得复用）', args: ['scripts/check-similarity.mjs'] },
  { key: 'uitruth', label: '上屏真实性闸门（字段名回源码）', args: ['scripts/check-ui-truth.mjs'] },
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
  const outLines = out.trim().split('\n').filter(Boolean);
  // 2026-08-31 修（补完第十四轮 A1/A2 的另一半）：摘要不取"末行"——末行常是收尾话术（红线闸门的"确认无误即可收口。"），
  // 改取最后一条 ✅/❌ 结果行；⚠️ 提醒除标题行外连带收其下逐条证据行（含 «token» 或 file:行号），话术行与"✅ 无"空结果不收。
  const statusLines = outLines.filter((l) => /^\s*[✅❌]/.test(l));
  const last = (statusLines.length ? statusLines[statusLines.length - 1] : outLines[outLines.length - 1]) || '(无输出)';
  const clean = (l) => l.replace(/^[\s✅❌⚠️]+/, '').trim();
  const warns = [];
  let capturing = false;
  for (const l of outLines) {
    if (/⚠️|需人工确认/.test(l) && !/✅\s*无/.test(l)) {
      warns.push(clean(l));
      capturing = true;
    } else if (capturing && /^\s{2,}\S/.test(l) && (/»/.test(l) || /[\w./-]+:\d+/.test(l))) {
      warns.push(clean(l));
    } else {
      capturing = false;
    }
  }
  rows.push({ ok: code === 0, label: g.label, msg: clean(last).slice(0, 96), warns });
}
if (WITH_TSC) {
  const { code, out } = run('npx', ['tsc', '--noEmit'], join(ROOT, 'video'));
  const err = out.split('\n').filter((l) => /error TS/.test(l));
  rows.push({ ok: code === 0, label: 'tsc --noEmit', msg: err.length ? err[0].slice(0, 96) : '零错误' });
}

const vid = newestVideo();
/** 遍历 video/src 取最新源码修改时间 */
function srcNewest() {
  const { readdirSync, statSync } = require$fs();
  const walk = (dir) => {
    let best = 0;
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) best = Math.max(best, walk(p));
      else if (/\.(tsx?|json)$/.test(name)) best = Math.max(best, st.mtimeMs);
    }
    return best;
  };
  return walk(join(ROOT, 'video', 'src'));
}
if (vid) {
  const wv = motionWaiver(vid);
  const vidM = require$fs().statSync(vid).mtimeMs;
  const srcM = srcNewest();
  let row;
  if (srcM > vidM) {
    const diffMs = srcM - vidM;
    // 2026-08-31 修：不足 1 分钟（含 14ms 这种"同批写出/批量重置 mtime"）不能打「旧 0 分钟」——说明可疑并保守判过期
    const age = diffMs < 1000
      ? `仅旧 ${Math.round(diffMs)} 毫秒`
      : diffMs < 60000
        ? `仅旧 ${Math.round(diffMs / 1000)} 秒`
        : `旧 ${Math.round(diffMs / 60000)} 分钟`;
    const note = diffMs < 60000 ? '（疑似与源码同批写出或 mtime 被批量重置，无法证明是最新渲染）' : '';
    row = { ok: false, label: '效果尺子（最新成片）',
      msg: `过期证据｜${vid.split('/').slice(-2).join('/')} 比 video/src 最新改动${age}${note}：这份数字测的可能是已作废版本，不算通过（设计阶段可带此红继续，交付前必须重渲重测）` };
  } else {
    const { code, out } = run('node', ['scripts/check-motion.mjs', vid], ROOT);
    const m = out.match(/静止占比 (\d+)%/), d = out.match(/中位帧间差 ([\d.]+)/), o = out.match(/画面占用率 (\d+)%/);
    row = { ok: code === 0, label: '效果尺子（最新成片）',
      msg: `${code === 0 ? '达标' : '未达标'}｜${vid.split('/').slice(-2).join('/')}｜静止 ${m?.[1]}% 中位帧差 ${d?.[1]} 占用率 ${o?.[1]}%` };
  }
  if (!row.ok && wv) {
    row.ok = true;
    row.skipped = true;
    row.label = '效果尺子（最新成片·已裁）';
    row.msg = `已裁放行（${wv.approvedBy || '未记批准人'}）· 原判照旧显示 ｜${row.msg}｜理由：${wv.reason || '已登记例外'}`;
  }
  rows.push(row);
} else {
  rows.push({ ok: true, skipped: true, label: '效果尺子', msg: '跳过（outputs 下暂无成片 mp4；出片后必跑）' });
}

console.log('\n══════════════ 闸门总览（gate-all）══════════════');
for (const r of rows) console.log(`${r.ok ? (r.skipped ? '⏭️' : '✅') : '❌'} ${r.label.padEnd(26)} ${r.msg}`);
const warnRows = rows.filter((r) => r.warns?.length);
if (warnRows.length) {
  console.log('\n⚠️ 需人工确认（不计闸门红绿，但必须逐条看过，不许直接跳过）：');
  for (const r of warnRows) for (const w of r.warns) console.log(`   [${r.label}] ${w}`);
}
const failed = rows.filter((r) => !r.ok);
const skipped = rows.filter((r) => r.skipped).length;
console.log('\n──────────────────────────────────────────────');
console.log(failed.length
  ? `❌ ${failed.length}/${rows.length} 个闸门未通过 —— 修完再开工/再交付；禁止带着红灯产出或改文档。`
  : `✅ ${rows.length - skipped}/${rows.length} 通过、${skipped} 项跳过（见上方 ⏭️ 行说明）——无红灯，可以开工。`);
process.exit(failed.length ? 1 : 0);

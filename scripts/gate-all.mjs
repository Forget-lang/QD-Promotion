#!/usr/bin/env node
/**
 * scripts/gate-all.mjs · 全部闸门一次跑完（清单以下方 GATES 数组为准，不在注释里复述条数）
 *
 * 为什么要它：闸门分散成多条命令时，新会话常常只跑其中一条（或干脆不跑），
 * 结果就是“规则在文档里、问题在成片里”。开工第 1 步跑这一个命令，**一开工就见红**。
 *
 * 按内容线取目标（CHANGE-20260920-031 B3.6）：
 *   - 目标选择不再靠全局 mtime 猜“最新片”：先按 contentLines 判线，再在该线内按片号取最新；
 *   - 行业线保持既有标签与 APPLY 判定（对阶段 A 基线零漂移）；其他线按 gateApplicability 走
 *     OBSERVE（照测不判红）/ N/A（显式声明＋来源）/ OWNER_PENDING（硬失败）；
 *   - 观察态只落在本汇总层：**不写 motionWaivers／safeAreaWaivers、不借用 skipped+ok:true**；
 *   - 判线失败 / 未声明 industry / 无法归因的产物目录 → 一律响亮失败，不静默跳过。
 *
 * 用法：node scripts/gate-all.mjs [--tsc] [--line g|f|<内容线id>]
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineOf, gateAppliesFor } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'gate-all' });
if (!industryLine) {
  console.error('❌ gate-all：ref-registry 未声明 industry 内容线 —— 拒绝把“无本线目标”误判为“基线为空”');
  process.exit(1);
}
const NON_PIECE = (REGISTRY.pieceDirs && Array.isArray(REGISTRY.pieceDirs.nonPiecePatterns))
  ? REGISTRY.pieceDirs.nonPiecePatterns.map((p) => new RegExp(p, 'i'))
  : (() => {
      console.error('❌ gate-all：ref-registry 未声明 pieceDirs.nonPiecePatterns —— 拒绝猜哪些目录不是产物目录');
      process.exit(1);
    })();
const motionWaiver = (vidPath) => {
  const list = REGISTRY.motionWaivers || [];
  if (!list.length) return null;
  const m = /g\d{2}/i.exec(String(vidPath));
  const key = m ? m[0].toLowerCase() : null;
  return key ? (list.find((w) => String(w.video).toLowerCase() === key) || null) : null;
};
const safeAreaWaiver = (framePaths) => {   // CHANGE-20260918-029：与 motionWaiver 同构；豁免在汇总层，probe-safe-area 本体不动
  const list = REGISTRY.safeAreaWaivers || [];
  if (!list.length) return null;
  const m = /g\d{2}/i.exec(framePaths.join('/'));
  const key = m ? m[0].toLowerCase() : null;
  return key ? (list.find((w) => String(w.video).toLowerCase() === key) || null) : null;
};
const GATES = [
  { key: 'changecontract', label: '变更收敛闸门（Change Contract）', args: ['scripts/check-change-contract.mjs'] },
  { key: 'visualshot', label: '视觉导演闸门（R9 Shot Contract）', args: ['scripts/check-visual-shot-contract.mjs'] },
  { key: 'redlines', label: '红线闸门（画面/口播硬禁）', args: ['scripts/check-redlines.mjs'] },
  { key: 'refs', label: '文档引用闸门（引用断链）', args: ['scripts/check-doc-references.mjs'] },
  { key: 'facts', label: '事实闸门（资产路径与素材对账）', args: ['scripts/check-facts.mjs'] },
  { key: 'similarity', label: '相似度闸门（整屏结构不得复用）', args: ['scripts/check-similarity.mjs'] },
  { key: 'layout', label: '布局指纹闸门（新片不得复用上一条布局）', args: ['scripts/check-layout-diversity.mjs'] },
  { key: 'bg', label: '背景底闸门（每片必用背景图）', args: ['scripts/check-bg.mjs'] },
  { key: 'motifcard', label: '母题卡闸门（视觉定位卡四栏+素材张数）', args: ['scripts/check-motif-card.mjs'] },
  { key: 'uitruth', label: '上屏真实性闸门（字段名回源码）', args: ['scripts/check-ui-truth.mjs'] },
  { key: 'voicediscipline', label: '口播纪律闸门（数字中文）', args: ['scripts/check-voice-discipline.mjs'] },
  { key: 'voicebrand', label: '口播品牌点检（画面零品牌·口播必提一次）', args: ['scripts/check-voice-brand.mjs'] },
  { key: 'releasefeedback', label: '发布后验回填闸门（已发布片必回填后台四数）', args: ['scripts/check-release-feedback.mjs'] },
];
const WITH_TSC = process.argv.includes('--tsc');
function require$fs() { return createRequire(import.meta.url)('node:fs'); }

/** outputs 下按内容线归类的产物目录（判定优先来自 contentLines；白名单只登记非产物目录） */
function collectOutputDirs() {
  const { readdirSync, statSync } = require$fs();
  const byLine = new Map();
  const unknown = [];
  for (const d of readdirSync(join(ROOT, 'outputs'))) {
    const p = join(ROOT, 'outputs', d);
    if (!statSync(p).isDirectory()) continue;
    if (NON_PIECE.some((re) => re.test(d))) continue;
    const l = lineOf(d, LINES);
    if (!l) { unknown.push(d); continue; }
    if (!byLine.has(l.id)) byLine.set(l.id, { line: l, dirs: [] });
    byLine.get(l.id).dirs.push({ name: d, path: p, n: Number((d.match(new RegExp(`^${l.outputPrefix}(\\d+)`, 'i')) || [])[1] || 0) });
  }
  for (const v of byLine.values()) v.dirs.sort((a, b) => a.n - b.n);
  return { byLine, unknown };
}

/** 本线内含 mp4 的最大编号目录 → 取该目录内 mtime 最新的一支（同一片可有多支，如无声/有声） */
function newestVideoIn(dirs) {
  const { readdirSync, statSync } = require$fs();
  for (let i = dirs.length - 1; i >= 0; i--) {
    const files = readdirSync(dirs[i].path).filter((f) => f.endsWith('.mp4'));
    if (!files.length) continue;
    let best = null;
    for (const f of files) {
      const p = join(dirs[i].path, f), m = statSync(p).mtimeMs;
      if (!best || m > best.m) best = { p, m };
    }
    return best.p;
  }
  return null;
}

/** 本线内含 frames/*.png 的最大编号目录 → 返回该目录全部 png 路径 */
function newestFramesIn(dirs) {
  const { readdirSync, statSync } = require$fs();
  for (let i = dirs.length - 1; i >= 0; i--) {
    const fd = join(dirs[i].path, 'frames');
    let st;
    try { st = statSync(fd); } catch { continue; }
    if (!st.isDirectory()) continue;
    const pngs = readdirSync(fd).filter((f) => f.endsWith('.png'));
    if (!pngs.length) continue;
    return pngs.map((f) => join(fd, f));
  }
  return [];
}

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
const run = (cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return { code: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}` };
};
const rows = [];
for (const g of GATES) {
  const { code, out } = run('node', g.args, ROOT);
  const outLines = out.trim().split('\n').filter(Boolean);
  const statusLines = outLines.filter((l) => /^\s*[✅❌]/.test(l));
  const last = (statusLines.length ? statusLines[statusLines.length - 1] : outLines[outLines.length - 1]) || '(无输出)';
  const clean = (l) => l.replace(/^[\s✅❌⚠️]+/, '').trim();
  const warns = [];
  let capturing = false;
  for (const l of outLines) {
    if (/⚠️|需人工确认/.test(l) && !/✅\s*无/.test(l)) {
      warns.push(clean(l)); capturing = true;
    } else if (capturing && /^\s{2,}\S/.test(l) && (/»/.test(l) || /[\w./-]+:\d+/.test(l) || /\.(tsx?|md|json)\s{2,}\S/.test(l))) {
      warns.push(clean(l));
    } else capturing = false;
  }
  rows.push({ ok: code === 0, label: g.label, msg: clean(last).slice(0, 96), warns });
}
if (WITH_TSC) {
  const { code, out } = run('npx', ['tsc', '--noEmit'], join(ROOT, 'video'));
  const err = out.split('\n').filter((l) => /error TS/.test(l));
  rows.push({ ok: code === 0, label: 'tsc --noEmit', msg: err.length ? err[0].slice(0, 96) : '零错误' });
}
// ── 按内容线取目标（B3.6）：先判线，再线内取最新（不再用全局 mtime 猜“最新片”）──
const lineArg = (() => {
  const i = process.argv.indexOf('--line');
  if (i < 0) return null;
  const raw = (process.argv[i + 1] || '').trim();
  const hit = raw && LINES.find((l) => l.id.toLowerCase() === raw.toLowerCase() || (l.outputPrefix || '').toLowerCase() === raw.toLowerCase());
  if (!hit) {
    console.error(`❌ gate-all：--line 取值非法（收到 "${raw}"）—— 合法值：${LINES.map((l) => `${l.id}(${l.outputPrefix})`).join(' / ')}`);
    process.exit(1);
  }
  return hit;
})();
const applicabilityOf = (gateKey, line) => {
  try { return gateAppliesFor(REGISTRY, gateKey, line); }
  catch (e) { console.error(`❌ gate-all：内容线适用性声明问题 —— ${e.message}`); process.exit(1); }
};

const { byLine, unknown } = collectOutputDirs();
const targetProblems = unknown.map((d) => `${d}/｜outputs 下无法判定内容线，且不在 pieceDirs.nonPiecePatterns 白名单 —— 拒绝静默忽略（是产物目录请补内容线声明，是工具目录请登记白名单）`);

if (targetProblems.length) {
  // 目标不可靠时不跑探针/尺子（可能对错对象出读数），先报归因问题
  rows.push({ ok: false, label: '内容线适用性 / 目录归因', msg: `${targetProblems.length} 处（未执行探针与效果尺）：${targetProblems.join('；')}`.slice(0, 96), warns: [] });
} else {
  let anyFrames = false, anyVid = false;
  for (const l of LINES) {
    if (lineArg && l.id !== lineArg.id) continue;
    const group = byLine.get(l.id);
    if (!group || !group.dirs.length) continue;
    const isIndustry = l.id === industryLine.id;
    const frames = newestFramesIn(group.dirs);
    const vid = newestVideoIn(group.dirs);
    if (!frames.length && !vid) continue;

    if (frames.length) {
      anyFrames = true;
      const ap = applicabilityOf('gate-all-safearea-observation', l);
      const label = isIndustry ? '文字安全区探针（最新静帧）' : `文字安全区探针（${l.label}·最新静帧）`;
      const runProbe = () => {
        const { out } = run('node', ['scripts/probe-safe-area.mjs', ...frames], ROOT);
        return (out.trim().split('\n').filter(Boolean).pop() || '(无输出)').replace(/^[\s✅❌⚠️]+/, '').trim();
      };
      if (ap === 'APPLY') {
        const { code, out } = run('node', ['scripts/probe-safe-area.mjs', ...frames], ROOT);
        const lastLine = out.trim().split('\n').filter(Boolean).pop() || '(无输出)';
        const prow = { ok: code === 0, label, msg: lastLine.replace(/^[\s✅❌⚠️]+/, '').trim().slice(0, 96), warns: [] };
        const swv = safeAreaWaiver(frames);
        if (!prow.ok && swv) { prow.ok = true; prow.skipped = true; prow.label = `${label.slice(0, -1)}·已裁）`; prow.msg = `已裁放行（${swv.approvedBy || '未记批准人'}）· 原判照旧显示 ｜${prow.msg}｜理由：${swv.reason || '已登记例外'}`; }
        rows.push(prow);
      } else if (ap === 'OBSERVE') {
        rows.push({ ok: true, observed: true, label: `${label.slice(0, -1)}·观察）`, msg: `已测·观察（不判红）｜${runProbe()}`.slice(0, 96) });
      } else if (ap === 'N/A') {
        rows.push({ ok: true, declared: true, label, msg: `N/A（声明源：ref-registry.gateApplicability.gateOverrides['gate-all-safearea-observation']['${l.id}']）—— 未执行本线判据` });
      } else {
        rows.push({ ok: false, label, msg: 'OWNER_PENDING —— 该线安全区判据的权威 Owner 未建立，先立 Owner 再产出（未执行本线判据）' });
      }
    }

    if (vid) {
      anyVid = true;
      const ap = applicabilityOf('gate-all-motion-observation', l);
      const label = isIndustry ? '效果尺子（最新成片）' : `效果尺子（${l.label}·最新成片）`;
      const rel = vid.split('/').slice(-2).join('/');
      if (ap === 'APPLY') {
        const wv = motionWaiver(vid);
        const vidM = require$fs().statSync(vid).mtimeMs;
        const srcM = srcNewest();
        let row;
        if (srcM > vidM) {
          const diffMs = srcM - vidM;
          const age = diffMs < 1000 ? `仅旧 ${Math.round(diffMs)} 毫秒` : diffMs < 60000 ? `仅旧 ${Math.round(diffMs / 1000)} 秒` : `旧 ${Math.round(diffMs / 60000)} 分钟`;
          const note = diffMs < 60000 ? '（疑似与源码同批写出或 mtime 被批量重置，无法证明是最新渲染）' : '';
          row = { ok: false, label, msg: `过期证据｜${rel} 比 video/src 最新改动${age}${note}：这份数字测的可能是已作废版本，不算通过（设计阶段可带此红继续，交付前必须重渲重测）` };
        } else {
          const { code, out } = run('node', ['scripts/check-motion.mjs', vid], ROOT);
          const m = out.match(/静止占比 (\d+)%/), d = out.match(/中位帧间差 ([\d.]+)/), o = out.match(/画面占用率 (\d+)%/);
          row = { ok: code === 0, label, msg: `${code === 0 ? '达标' : '未达标'}｜${rel}｜静止 ${m?.[1]}% 中位帧差 ${d?.[1]} 占用率 ${o?.[1]}%` };
        }
        if (!row.ok && wv) { row.ok = true; row.skipped = true; row.label = `${label.slice(0, -1)}·已裁）`; row.msg = `已裁放行（${wv.approvedBy || '未记批准人'}）· 原判照旧显示 ｜${row.msg}｜理由：${wv.reason || '已登记例外'}`; }
        rows.push(row);
      } else if (ap === 'OBSERVE') {
        // 观察态：照测照出读数、不判红；不查豁免表、不写 motionWaivers、不用 skipped 通道
        const { out } = run('node', ['scripts/check-motion.mjs', vid], ROOT);
        const m = out.match(/静止占比 (\d+)%/), d = out.match(/中位帧间差 ([\d.]+)/), o = out.match(/画面占用率 (\d+)%/);
        rows.push({ ok: true, observed: true, label: `${label.slice(0, -1)}·观察）`, msg: `已测·观察（不判红）｜${rel}｜静止 ${m?.[1]}% 中位帧差 ${d?.[1]} 占用率 ${o?.[1]}%` });
      } else if (ap === 'N/A') {
        rows.push({ ok: true, declared: true, label, msg: `N/A（声明源：ref-registry.gateApplicability.gateOverrides['gate-all-motion-observation']['${l.id}']）—— 未执行本线判据` });
      } else {
        rows.push({ ok: false, label, msg: 'OWNER_PENDING —— 该线效果尺判据的权威 Owner 未建立，先立 Owner 再产出（未执行本线判据）' });
      }
    }
  }
  if (!anyFrames) rows.push({ ok: true, skipped: true, label: '文字安全区探针', msg: '跳过（outputs 下暂无静帧 png；出静帧后必跑）' });
  if (!anyVid) rows.push({ ok: true, skipped: true, label: '效果尺子', msg: '跳过（outputs 下暂无成片 mp4；出片后必跑）' });
}
console.log('\n══════════════ 闸门总览（gate-all）══════════════');
for (const r of rows) console.log(`${r.ok ? (r.skipped ? '⏭️' : r.observed ? '👁️' : r.declared ? '📤' : '✅') : '❌'} ${r.label.padEnd(26)} ${r.msg}`);
const warnRows = rows.filter((r) => r.warns?.length);
if (warnRows.length) {
  console.log('\n⚠️ 需人工确认（不计闸门红绿，但必须逐条看过，不许直接跳过）：');
  for (const r of warnRows) for (const w of r.warns) console.log(`   [${r.label}] ${w}`);
}
const failed = rows.filter((r) => !r.ok);
const skipped = rows.filter((r) => r.skipped).length;
const observed = rows.filter((r) => r.observed).length;
const declared = rows.filter((r) => r.declared).length;
const passed = rows.filter((r) => r.ok && !r.skipped && !r.observed && !r.declared).length;
console.log('\n──────────────────────────────────────────────');
console.log(failed.length
  ? `❌ ${failed.length}/${rows.length} 个闸门未通过 —— 修完再开工/再交付；禁止带着红灯产出或改文档。`
  : `✅ ${passed}/${rows.length} 通过、${skipped} 项跳过${observed ? `、${observed} 项观察（不判红）` : ''}${declared ? `、${declared} 项声明不适用` : ''}（见上方 ⏭️ 行说明）——无红灯，可以开工。`);
process.exit(failed.length ? 1 : 0);

#!/usr/bin/env node
/**
 * scripts/check-style-rotation.mjs · 风格轮换闸门（行业线：同风格不得连续复用）
 *
 * 依据：`SKILL.md` 第 4.5 步「先选风格」＋各风格包 ⑩「同风格不得连续复用」（039 §三.6 立规，当时定为
 * "先记录、后机检"——本脚本把机检补上，CHANGE-20260924-054）。
 *
 * 判据：
 *   ① 片风格由**片目录内的 `styleId` 声明**认领（与 check-visual-shot-contract 的"新架构片"口径一致）；
 *   ② 取**最新两条已声明 styleId 的片**比较：同风格 ⇒ 硬失败；
 *      确有理由连用的，在 `scripts/ref-registry.json` 的 `styleRotationWaivers` 逐条登记
 *      {video, styleId, reason(非空), approvedBy}（片首声明"连续复用例外＋理由"的机器落点）。
 *   ③ 已声明 styleId 的片不足两条 ⇒ ⏭️（接线就位、待对照；历史片不回溯）。
 *
 * 用法：node scripts/check-style-rotation.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineNumericId } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTROOT = join(ROOT, 'outputs');
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'check-style-rotation' });
if (!industryLine) { console.error('❌ check-style-rotation：ref-registry 未声明 industry 内容线'); process.exit(1); }
const NON_PIECE = (REGISTRY.pieceDirs?.nonPiecePatterns || []).map((p) => new RegExp(p, 'i'));

const pieces = readdirSync(OUTROOT)
  .filter((d) => { try { return statSync(join(OUTROOT, d)).isDirectory(); } catch { return false; } })
  .filter((d) => !NON_PIECE.some((re) => re.test(d)))
  .filter((d) => new RegExp(`^${industryLine.outputPrefix}\\d+`, 'i').test(d))
  .map((d) => ({ dir: d, n: Number((d.match(new RegExp(`^${industryLine.outputPrefix}(\\d+)`, 'i')) || [])[1] || 0) }))
  .sort((a, b) => a.n - b.n);

/** 片目录内声明的 styleId（扫 .md） */
function declaredStyle(pieceDir) {
  const dir = join(OUTROOT, pieceDir);
  let names = [];
  try { names = readdirSync(dir); } catch { return null; }
  for (const n of names.filter((x) => x.endsWith('.md'))) {
    let text = '';
    try { text = readFileSync(join(dir, n), 'utf8'); } catch { continue; }
    const m = text.match(/styleId\s*[:：=]\s*[`"']?([A-Za-z0-9_-]+)/);
    if (m) return m[1];
  }
  return null;
}

const declared = pieces.map((p) => ({ ...p, styleId: declaredStyle(p.dir) })).filter((p) => p.styleId);
console.log('\n══════════════ 风格轮换闸门（行业线：同风格不得连续复用）══════════════\n');
if (declared.length < 2) {
  console.log(`⏭️ 接线就位：已声明 styleId 的片 ${declared.length} 条（不足两条，无对照可比）——历史片（无 styleId）不回溯。`);
  process.exit(0);
}
const newest = declared[declared.length - 1];
const prev = declared[declared.length - 2];
console.log(`比对：最新 ${newest.dir}（styleId=${newest.styleId}） vs 上一条 ${prev.dir}（styleId=${prev.styleId}）`);
if (newest.styleId !== prev.styleId) {
  console.log(`✅ 通过：${newest.dir} 换用了新风格（${prev.styleId} → ${newest.styleId}）。`);
  process.exit(0);
}
const waivers = REGISTRY.styleRotationWaivers || [];
const w = waivers.find((x) => x.video === newest.dir.split('-')[0] && x.styleId === newest.styleId && typeof x.reason === 'string' && x.reason.trim());
if (w) {
  console.log(`✅ 通过（连续复用已登记例外：${w.approvedBy || '未记批准人'} —— ${w.reason}）`);
  process.exit(0);
}
console.log(`❌ 硬失败：${newest.dir} 与上一条 ${prev.dir} 同为风格「${newest.styleId}」——「同风格不得连续复用」（SKILL 第 4.5 步／各包 ⑩）。`);
console.log('   修法：本片改用其它已登记风格；确需连用的，在 ref-registry.json 的 styleRotationWaivers 登记 {video, styleId, reason, approvedBy} 并在片首声明理由。');
process.exit(1);

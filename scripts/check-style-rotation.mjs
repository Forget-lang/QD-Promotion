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
 *   ④ 历史片隔离对账（CHANGE-20260924-056 §三.6）：`legacyPieces.items` 登记的每一片，
 *      其承载文件必须真实存在且含 `marker`——**登记与实物不一致即硬失败**（防隔离标记被清理后无人发现）。
 *
 * styleId 读取与值域校验走 `content-lines` 唯一实现（多值冲突／未登记 id ⇒ 硬失败）。
 *
 * 用法：node scripts/check-style-rotation.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineNumericId, declaredStyleIdOf, assertRegisteredStyleId } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTROOT = join(ROOT, 'outputs');
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'check-style-rotation' });
if (!industryLine) { console.error('❌ check-style-rotation：ref-registry 未声明 industry 内容线'); process.exit(1); }
const NON_PIECE = (REGISTRY.pieceDirs?.nonPiecePatterns || []).map((p) => new RegExp(p, 'i'));

// ── ④ 历史片隔离对账（CHANGE-20260924-056 §三.6）────────────────────────────
// 登记表说某片是历史交付并带隔离标记 ⇒ 实物必须真的带着；不一致即硬失败（防标记被悄悄删掉）。
const legacy = REGISTRY.legacyPieces || null;
if (legacy && Array.isArray(legacy.items) && legacy.items.length) {
  const marker = String(legacy.marker || '').trim();
  if (!marker) {
    console.error('❌ check-style-rotation：ref-registry.legacyPieces 未声明 marker —— 无标记 token 无法核对，拒绝空跑');
    process.exit(1);
  }
  const problems = [];
  for (const item of legacy.items) {
    const rel = String(item?.file || '').trim();
    if (!rel) { problems.push(`${item?.piece || '(缺 piece)'}｜未声明承载文件`); continue; }
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) { problems.push(`${rel}｜文件不存在（历史片被移动/改名后须同步更新登记）`); continue; }
    if (!readFileSync(abs, 'utf8').includes(marker)) problems.push(`${rel}｜缺隔离标记「${marker}」`);
  }
  if (problems.length) {
    console.error(`\n❌ 历史片隔离对账失败（${problems.length} 处）—— 登记表与实物不一致：`);
    for (const p of problems) console.error(`   - ${p}`);
    console.error(`   修法：补回标记，或在 ${legacy.declaration || 'outputs/LEGACY-ISOLATION.md'} 与 ref-registry.legacyPieces 同步登记（登记只出不进）。`);
    process.exit(1);
  }
  console.log(`\n══════════════ 历史片隔离对账（${legacy.items.length} 片）══════════════`);
  // 前缀用 🛡️（不是 ✅）：本行的作用是留痕，不该顶掉本闸门汇总行里真正的轮换判据（gate-all 取最后一条 ✅/❌）
  console.log(`🛡️ ${legacy.items.map((x) => x.piece).join('／')} 均带隔离标记「${marker}」（声明件：${legacy.declaration || '-'}）。`);
}

const pieces = readdirSync(OUTROOT)
  .filter((d) => { try { return statSync(join(OUTROOT, d)).isDirectory(); } catch { return false; } })
  .filter((d) => !NON_PIECE.some((re) => re.test(d)))
  .filter((d) => new RegExp(`^${industryLine.outputPrefix}\\d+`, 'i').test(d))
  .map((d) => ({ dir: d, n: Number((d.match(new RegExp(`^${industryLine.outputPrefix}(\\d+)`, 'i')) || [])[1] || 0) }))
  .sort((a, b) => a.n - b.n);

/**
 * 片目录内声明的 styleId —— 读取与值域校验都走 content-lines 的唯一实现
 * （CHANGE-20260924-056 §三.4：格式唯一、值必须是已登记风格；冲突/未登记一律硬失败）。
 */
const declared = [];
for (const p of pieces) {
  let hit;
  try {
    hit = declaredStyleIdOf(join(OUTROOT, p.dir));
  } catch (e) {
    console.error(`❌ check-style-rotation：${e.message}`);
    process.exit(1);
  }
  if (!hit.styleId) continue;
  try {
    assertRegisteredStyleId(REGISTRY, hit.styleId, `片 ${p.dir}（${hit.sources.map((s) => s.file).join('、')}）`);
  } catch (e) {
    console.error(`❌ check-style-rotation：${e.message}`);
    process.exit(1);
  }
  declared.push({ ...p, styleId: hit.styleId });
}
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

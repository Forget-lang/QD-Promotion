#!/usr/bin/env node
/**
 * scripts/check-motif-card.mjs · 母题卡强制闸门（SKILL 第 2 步：新片母题一页必须含「视觉定位卡四栏 + 背景素材张数」）
 *
 * 为什么要它（2026-09-14 用户拍板，防"改了文档、新会话仍漏执行"）：今天把「视觉定位卡」「素材最小化+程序化质感」
 * 两条规则吸收进 SKILL 第 2 步，但它们都是软尺——只改规则文档、没有机检承接，新会话大概率不填、又滑回"一张卡片堆字段"。
 * 本闸把"母题一页必须把情绪契约 + 素材纪律落回产出物"变成可计算的硬判据：缺栏 / 缺张数 = 红灯，交不了母题页。
 *
 * 判据（对 outputs 下**最新一个** gXX 的 `03-母题一页.md`）：
 *   ① 必须同时含四栏字段：`核心痛点` / `情绪关键词` / `视觉关键词` / `禁止出现`；
 *   ② 必须含一行 `背景素材张数`。
 * 任一不满足 = 硬失败。历史片（gXX < 最新）按 old 口径渲过、不回改，不扫描（与 check-bg 豁免思路一致）；最新片暂无母题一页 = 提示需补、不算红灯（可能还没到第 2 步）。
 *
 * 用法（项目根运行）：node scripts/check-motif-card.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineOf, gateAppliesFor } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTROOT = join(ROOT, 'outputs');
const MUST_FIELDS = ['核心痛点', '情绪关键词', '视觉关键词', '禁止出现'];
const ASSET_MARK = '背景素材张数';
// 统一诊断边界 + 早置守卫（CHANGE-20260920-031 §3.2.1、负向 18）
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'check-motif-card' });
if (!industryLine) {
  console.error('❌ check-motif-card：ref-registry 未声明 industry 内容线 —— 拒绝把"无本线目录"误判为"基线为空"');
  process.exit(1);
}
// 非产物目录白名单同样来自声明源，缺失即失败（不写死在脚本里造成第二口径）
const NON_PIECE = (REGISTRY.pieceDirs && Array.isArray(REGISTRY.pieceDirs.nonPiecePatterns))
  ? REGISTRY.pieceDirs.nonPiecePatterns.map((p) => new RegExp(p, 'i'))
  : (() => {
      console.error('❌ check-motif-card：ref-registry 未声明 pieceDirs.nonPiecePatterns —— 拒绝猜哪些目录不是产物目录');
      process.exit(1);
    })();
const isNonPiece = (name) => NON_PIECE.some((re) => re.test(name));

/** outputs 下按内容线归类的产物目录 */
function classifyDirs() {
  const byLine = new Map();
  const unknown = [];
  for (const d of readdirSync(OUTROOT)) {
    const p = join(OUTROOT, d);
    if (!statSync(p).isDirectory()) continue;
    if (isNonPiece(d)) continue;
    const l = lineOf(d, LINES);
    if (!l) { unknown.push(d); continue; }
    if (!byLine.has(l.id)) byLine.set(l.id, { line: l, dirs: [] });
    byLine.get(l.id).dirs.push({ name: d, path: p, n: Number((d.match(new RegExp(`^${l.outputPrefix}(\\d+)`, 'i')) || [])[1] || 0) });
  }
  for (const v of byLine.values()) v.dirs.sort((a, b) => a.n - b.n);
  return { byLine, unknown };
}

function findMotif(dir) {
  for (const f of readdirSync(dir)) {
    if (/母题一页/.test(f) && f.endsWith('.md')) return join(dir, f);
  }
  return null;
}

console.log('\n══════════════ 母题卡强制闸门（SKILL 第 2 步：视觉定位卡四栏 + 素材张数）══════════════\n');

const { byLine, unknown } = classifyDirs();

// B3.5 三防线之 1/3：非产物目录之外的未知目录不得静默忽略
const gateFailures = [];
for (const d of unknown) {
  gateFailures.push(`${d}/｜outputs 下的目录无法判定内容线，且不在 pieceDirs.nonPiecePatterns 白名单 —— 拒绝静默忽略（是产物目录请补内容线声明，是工具目录请登记白名单）`);
}
// B3.5 三防线之 2：只对 APPLY 线执行判据；不可适用线输出带声明源的显式状态，不进入判据
for (const [lineId, group] of byLine) {
  if (lineId === industryLine.id) continue;
  const applies = gateAppliesFor(REGISTRY, 'check-motif-card', group.line);
  const names = group.dirs.map((x) => x.name).join('、');
  if (applies === 'APPLY') {
    gateFailures.push(`${names}｜内容线「${group.line.label}」被声明为 APPLY，但「视觉定位卡四栏 + 背景素材张数」是行业线第 2 步条款 —— 拒绝机械继承，请为该线定义自己的视觉卡判据`);
  } else if (applies === 'OWNER_PENDING') {
    gateFailures.push(`${names}｜内容线「${group.line.label}」在本闸门为 OWNER_PENDING —— 先立 Owner 再产出（不放行、不静默跳过）`);
  } else {
    console.log(`📤 ${names}｜${applies}（声明源：ref-registry.gateApplicability.gateOverrides['check-motif-card']['${lineId}']）—— 不进入本闸门判据`);
  }
}
if (gateFailures.length) {
  console.log(`\n④ 内容线适用性 / 目录归因  ❌ 硬失败 —— ${gateFailures.length} 处（未执行任何母题卡判据）：`);
  for (const x of gateFailures) console.log(`   ❌ ${x}`);
  console.log('   依据：CHANGE-20260920-031 §3.2.1 门状态即执行边界与硬顺序。');
  process.exit(1);
}

const industryGroup = byLine.get(industryLine.id);
const gg = industryGroup && industryGroup.dirs.length
  ? industryGroup.dirs[industryGroup.dirs.length - 1]
  : null;
if (!gg) {
  console.log(`✅ ${industryLine.label}暂无 gXX 产物目录，母题卡基线为空——新片建母题一页时必含四栏 + 素材张数。`);
  process.exit(0);
}
const motif = findMotif(gg.path);
if (!motif) {
  console.log(`⏭️ ${gg.name} 暂无母题一页，跳过（未到第 2 步产出；到产出时必含四栏 + 背景素材张数，否则本闸转红）。`);
  process.exit(0);
}
const src = readFileSync(motif, 'utf8');
const missing = MUST_FIELDS.filter((f) => !src.includes(f));
const hasAsset = src.includes(ASSET_MARK);

let hardFail = 0;
console.log(`扫描 ${gg.name} → ${motif.split('/').slice(-2).join('/')}`);
for (const f of MUST_FIELDS) {
  const ok = src.includes(f);
  console.log(`${ok ? '✅' : '❌'} 栏位「${f}」 ${ok ? '已写回' : '缺失——母题一页必须把视觉定位卡四栏原样写回（SKILL 第 2 步）'}`);
  if (!ok) hardFail++;
}
console.log(`${hasAsset ? '✅' : '❌'} 字段「${ASSET_MARK}」 ${hasAsset ? '已写回' : '缺失——母题一页必须写一行「背景素材张数」承接素材最小化纪律（SKILL 第 2 步）'}`);
if (!hasAsset) hardFail++;

console.log('\n────────────────────────────────────────────');
if (hardFail) {
  console.log(`❌ 母题一页缺 ${hardFail} 处（缺栏 / 缺素材张数）——按 SKILL 第 2 步把「视觉定位卡」四栏 + 「背景素材张数」写回 ${motif}，写不出=素材/情绪契约没定，禁止带着缺口进第 3 步。`);
  process.exit(1);
} else {
  console.log(`✅ ${gg.name} 母题一页含视觉定位卡四栏 + 背景素材张数，情绪契约已落产出物，可进第 3 步。`);
  process.exit(0);
}
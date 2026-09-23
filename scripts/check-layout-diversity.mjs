#!/usr/bin/env node
/**
 * scripts/check-layout-diversity.mjs · 布局指纹闸门（SKILL 第2步 C-16 / §三 布局指纹）
 *
 * 为什么要有它：`check-similarity` 的结构指纹 = type+ui，只防"照抄上一片的 ui 名"——
 *   换掉 gXX- 前缀、把牌匾换成磁条卡、把暖色换成冷色，重做一副一模一样的"顶部大卡+下方大圆角清单卡"，
 *   它永远绿灯（2026-08-30 负向测试证实）。结果就是每次新会话"悄悄复用上一条行业的画面"，
 *   非得用户看真图才发现、要求返工——这个坑被强调过太多次（2026-09-07 治理轮）。
 *   这道闸门把"呈现架构"抽成每屏一个 layoutKind 标签，强制新片与上一条**同 type 屏不得同 layoutKind**，
 *   要么真换布局，要么在 ref-registry.json 的 layoutWaivers 登记非空 structuralDiff 证据（= 换语言五轴证据门的闸门工件）。
 *
 * 判据：只比对"最新一片 vs 紧邻上一条"（每条新片必须区别于它前面那条，逐步逼出多样性；历史片不回溯）。
 *   CHANGE-20260923-039 批 4-2 / A2 方案 C：比较按「片→风格认领」（`ref-registry.styles.items[].piecePatterns`）
 *   分风格组——**组内比较（最新 vs 组内紧邻上一条）、跨风格不比较**；风格位声明非 APPLY 的组显式列出（带声明源）。
 *   ① 最新一片每个 type 屏都必须有 layoutKind（缺 = 硬失败，逼新片标注）。
 *   ② 最新一片某屏的 (type, layoutKind) 若在上一条同 type 屏里出现过 = 碰撞：
 *      有 layoutWaivers[video][type][layoutKind] 且 structuralDiff 非空 → ⚠️ 已豁免（列出，须人过目）；否则 ❌ 硬失败。
 *
 * 用法：node scripts/check-layout-diversity.mjs
 * 退出码：0 = 通过；1 = 有硬失败（缺标注 / 未豁免的同布局碰撞）。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineOf, lineNumericId, gateAppliesFor, claimStyleOfPiece, styleAppliesFor, outputsDirsOf } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'video', 'src', 'data');

// CHANGE-20260920-031：registry 只解析一次（由 initContentLines 负责读盘与失败诊断），
// 本脚本不再自行 readFileSync + JSON.parse —— 否则声明源损坏时会从这里抛出未捕获堆栈。
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({
  label: 'check-layout-diversity',
});
const waivers = REGISTRY.layoutWaivers || [];

// 片号身份由声明决定，不写死 g 前缀；非本线目标不得被 filter 抹掉（详见契约 §3.2.1 五态）。
if (!industryLine) {
  console.error('❌ check-layout-diversity：ref-registry 未声明 industry 内容线 —— 拒绝退回硬编码 g 前缀');
  process.exit(1);
}

const lineProblems = [];   // 硬失败：判不了线 / Owner 未建立
const lineSkips = [];      // 显式声明：N/A（带声明源，不是静默跳过）
const classified = readdirSync(DATA)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .map((f) => ({ file: f, id: f.replace(/\.ts$/, '') }))
  .map((v) => ({ ...v, line: lineOf(v.id, LINES) }));

for (const v of classified) {
  if (v.line) continue;
  lineProblems.push(`${v.file}｜无法判定内容线（ref-registry.contentLines 未覆盖该片号形态）—— 拒绝静默过滤，请补声明或改名`);
}
// 声明本身写错（非法态、缺 defaultApplicability）时：响亮报错并 exit 1，
// 但不抛未捕获堆栈——让 gate-all 与人都能读到一句可诊断的话（配置错 ≠ 代码崩）。
try {
  for (const l of LINES) {
    if (l.id === industryLine.id) continue;
    const items = classified.filter((v) => v.line && v.line.id === l.id);
    if (!items.length) continue;
    const applies = gateAppliesFor(REGISTRY, 'check-layout-diversity', l);
    if (applies === 'OWNER_PENDING') {
      lineProblems.push(`${items.map((i) => i.file).join('、')}｜内容线「${l.label}」在本闸门为 OWNER_PENDING —— 该线布局判据的权威 Owner 尚未建立，先立 Owner 再产出（不放行、不过滤、不静默跳过）`);
    } else if (applies === 'N/A') {
      lineSkips.push(`${items.map((i) => i.file).join('、')}｜N/A（声明源：ref-registry.gateApplicability.gateOverrides['check-layout-diversity']['${l.id}']）`);
    } else if (applies === 'APPLY') {
      lineProblems.push(`${items.map((i) => i.file).join('、')}｜内容线「${l.label}」被声明为 APPLY，但本闸门现行判据只实现于行业线 —— 拒绝假装跨线通用，请补该线判据或改判 OWNER_PENDING`);
    }
  }
} catch (e) {
  console.error(`❌ check-layout-diversity：内容线适用性声明问题 —— ${e.message}`);
  console.error('   修法：核对 ref-registry.gateApplicability —— 每个闸门对每条线须显式声明（APPLY/OBSERVE/N/A）；取值须在已注册枚举内。');
  process.exit(1);
}

/** 解析一个数据文件的场景序列 → [{type, layoutKind}]（type 与 layoutKind 同行，窗口内配对） */
function parseScenes(text) {
  const out = [];
  const re = /(^|[{,\s])type:\s*'([a-z]+)'[\s\S]{0,60}?layoutKind:\s*'([a-z-]+)'/g;
  let m;
  while ((m = re.exec(text))) out.push({ type: m[2], layoutKind: m[3] });
  return out;
}
const countTypes = (text) => (text.match(/(^|[{,\s])type:\s*'[a-z]+',/g) || []).length;

const vids = classified
  .filter((v) => v.line && v.line.id === industryLine.id)
  .map((v) => ({ ...v, n: lineNumericId(v.file, LINES), line: industryLine.id }))
  .sort((a, b) => a.n - b.n);

// 片→风格认领（CHANGE-20260923-039 批 4-2 / A2 方案 C）：按 ref-registry.styles.items[].piecePatterns
// 分风格组——**组内比较（最新 vs 组内紧邻上一条）、跨风格不比较**；非 APPLY 的风格组显式列出（带声明源）。
const styleGroups = new Map();
const styleClaimProblems = [];
for (const v of vids) {
  let claimed;
  try {
    claimed = claimStyleOfPiece(REGISTRY, { id: v.id, dirNames: outputsDirsOf(v.id) });
  } catch (e) {
    styleClaimProblems.push(`片 ${v.id} 风格认领失败：${e.message}`);
    continue;
  }
  if (!styleGroups.has(claimed.style.id)) styleGroups.set(claimed.style.id, { style: claimed.style, items: [] });
  styleGroups.get(claimed.style.id).items.push(v);
}

if (lineProblems.length) {
  console.log(`③ 内容线适用性  ❌ 硬失败 —— ${lineProblems.length} 处：`);
  for (const x of lineProblems) console.log(`   ❌ ${x}`);
}
if (lineSkips.length) {
  console.log(`③′ 内容线显式声明不适用（非静默跳过）：`);
  for (const x of lineSkips) console.log(`   📤 ${x}`);
}
if (styleClaimProblems.length) {
  console.log(`③″ 片风格认领  ❌ 硬失败 —— ${styleClaimProblems.length} 处：`);
  for (const x of styleClaimProblems) console.log(`   ❌ ${x}`);
}

let fail = lineProblems.length > 0 || styleClaimProblems.length > 0;
let judged = 0;
let waivedTotal = 0;
console.log('\n══════════════ 布局指纹闸门（check-layout-diversity）══════════════\n');
for (const { style, items } of styleGroups.values()) {
  const declSrc = `ref-registry.styles.items[id=${style.id}].gateApplicability['check-layout-diversity']`;
  let applies;
  try { applies = styleAppliesFor(REGISTRY, 'check-layout-diversity', style); } catch (e) {
    console.error(`❌ check-layout-diversity：风格适用性声明问题 —— ${e.message}`);
    process.exit(1);
  }
  if (applies === 'OWNER_PENDING') {
    fail = true;
    console.log(`❌ 风格「${style.label}」在本闸门为 OWNER_PENDING（声明源：${declSrc}）—— 先立 Owner 再产出（不放行、不过滤、不静默跳过）`);
    continue;
  }
  if (applies !== 'APPLY') {
    console.log(`📤 ${items.map((i) => i.id).join('、')}｜风格「${style.label}」在本闸门为 ${applies}（声明源：${declSrc}）—— 不进入本闸门判据`);
    continue;
  }
  if (items.length < 2) {
    console.log(`⏭️ 风格「${style.label}」不足两条已产出视频，组内无上一条可比（首片开工时正常）。`);
    continue;
  }
  judged++;
  const newest = items[items.length - 1];
  const prev = items[items.length - 2];
  const newText = readFileSync(join(DATA, newest.file), 'utf8');
  const prevText = readFileSync(join(DATA, prev.file), 'utf8');
  const newScenes = parseScenes(newText);
  const prevScenes = parseScenes(prevText);
  const newTypeCount = countTypes(newText);

  console.log(`── 风格「${style.label}」（${style.id}）｜组内比较、跨风格不比较 ──`);
  console.log(`比对：最新一片 ${newest.id}（${newTypeCount} 屏） vs 上一条 ${prev.id}（${prevScenes.length} 屏已标注）`);

  const missing = [];
  const collisions = [];
  const waived = [];

  // ① 最新一片每屏必须标注 layoutKind
  if (newScenes.length < newTypeCount) {
    missing.push(`${newest.id} 有 ${newTypeCount - newScenes.length} 屏未标 layoutKind（新片每屏必填，见 SKILL C-16）`);
  }

  // 上一条：type → Set(layoutKind)
  const prevByType = new Map();
  for (const s of prevScenes) {
    if (!prevByType.has(s.type)) prevByType.set(s.type, new Set());
    prevByType.get(s.type).add(s.layoutKind);
  }

  // ② 最新一片某屏 (type, layoutKind) 撞上一条同 type → 需豁免证据
  for (const s of newScenes) {
    const pk = prevByType.get(s.type);
    if (pk && pk.has(s.layoutKind)) {
      const w = waivers.find(
        (x) => x.video === newest.id && x.type === s.type && x.layoutKind === s.layoutKind
          && typeof x.structuralDiff === 'string' && x.structuralDiff.trim().length > 0,
      );
      if (w) waived.push({ ...s, diff: w.structuralDiff });
      else collisions.push(s);
    }
  }
  waivedTotal += waived.length;

  if (missing.length) {
    fail = true;
    console.log(`\n① 新片缺布局标注  ❌ 硬失败 —— ${missing.length} 处：`);
    for (const x of missing) console.log(`   ${x}`);
    console.log('   修法：给最新一片每个 Scene 补 layoutKind（card-list/form/two-column/flow/hero-object/compare-list/hero-focus/mechanism-diagram/cta-statement/layered-stage）。');
  }

  if (collisions.length) {
    fail = true;
    console.log(`\n② 与上一条同 type 屏同布局  ❌ 硬失败 —— ${collisions.length} 处（换皮同构，正是"悄悄复用上一条画面"）：`);
    for (const c of collisions) console.log(`   ${newest.id}  type=${c.type}  layoutKind=${c.layoutKind}  —— 上一条 ${prev.id} 同 type 屏也用了 ${c.layoutKind}`);
    console.log('   修法：要么真换呈现架构（改 layoutKind 并改组件），要么在 scripts/ref-registry.json 的 layoutWaivers 登记 {video,type,layoutKind,structuralDiff(≥3条非颜色结构差异),approvedBy}。');
  }

  if (waived.length) {
    console.log(`\n②′ 同布局已带证据豁免  ⚠️ 需人过目 —— ${waived.length} 处（不计失败，但每条 structuralDiff 必须真看过）：`);
    for (const w of waived) console.log(`   ${newest.id}  type=${w.type}  layoutKind=${w.layoutKind}  差异：${w.diff}`);
  }
}

console.log('\n──────────────────────────────────────────────');
if (fail) {
  console.log('❌ 布局指纹闸门未过：存在缺标注或未豁免的同布局碰撞。这道闸专治"新片复用上一条画面"——修完再声明通过。');
  process.exit(1);
}
if (!judged) {
  console.log('⏭️ 无「声明 APPLY 且已产出 ≥2 条」的风格组，本闸门当前无适用目标（声明源见上方 📤 行）。');
  process.exit(0);
}
if (!waivedTotal) {
  console.log('✅ 通过：各组内最新一片 layoutKind 与组内上一条同 type 屏零碰撞（呈现架构真换了）；跨风格不比较。');
} else {
  console.log(`✅ 通过（含 ${waivedTotal} 条带 structuralDiff 证据的豁免，已列出供过目）。`);
}
process.exit(0);

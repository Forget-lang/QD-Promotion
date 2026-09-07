#!/usr/bin/env node
/**
 * scripts/check-layout-diversity.mjs · 布局指纹闸门（SKILL 第2步 C-16 / §三 布局指纹）
 *
 * 为什么要有它：`check-similarity` 的结构指纹 = type+ui，只防"照抄上一片的 ui 名"——
 *   换掉 gXX- 前缀、把牌匾换成磁条卡、把暖色换成冷色，重做一副一模一样的"顶部大卡+下方大圆角清单卡"，
 *   它永远绿灯（2026-08-30 负向测试证实）。结果就是每次新会话"悄悄复用上一条行业的画面"，
 *   非得用户看真图才发现、要求返工——这个坑被强调过太多次（见 changelog 2026-09-07 治理轮）。
 *   这道闸门把"呈现架构"抽成每屏一个 layoutKind 标签，强制新片与上一条**同 type 屏不得同 layoutKind**，
 *   要么真换布局，要么在 ref-registry.json 的 layoutWaivers 登记非空 structuralDiff 证据（= 换语言五轴证据门的闸门工件）。
 *
 * 判据：只比对"最新一片 vs 紧邻上一条"（每条新片必须区别于它前面那条，逐步逼出多样性；历史片不回溯）。
 *   ① 最新一片每个 type 屏都必须有 layoutKind（缺 = 硬失败，逼新片标注）。
 *   ② 最新一片某屏的 (type, layoutKind) 若在上一条同 type 屏里出现过 = 碰撞：
 *      有 layoutWaivers[video][type][layoutKind] 且 structuralDiff 非空 → ⚠️ 已豁免（列出，须人过目）；否则 ❌ 硬失败。
 *
 * 用法：node scripts/check-layout-diversity.mjs
 * 退出码：0 = 通过；1 = 有硬失败（缺标注 / 未豁免的同布局碰撞）。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'video', 'src', 'data');
const REG = join(ROOT, 'scripts', 'ref-registry.json');

const waivers = existsSync(REG) ? (JSON.parse(readFileSync(REG, 'utf8')).layoutWaivers || []) : [];

// 只认 gNN.ts 数据文件，按编号排序，取最新一片 + 紧邻上一条
const vids = readdirSync(DATA)
  .filter((f) => /^g\d+\.ts$/.test(f))
  .map((f) => ({ id: f.replace(/\.ts$/, ''), n: parseInt(f.match(/\d+/)[0], 10), file: f }))
  .sort((a, b) => a.n - b.n);

if (vids.length < 2) {
  console.log('\n══════════════ 布局指纹闸门（check-layout-diversity）══════════════\n');
  console.log('⏭️ 跳过 —— 不足两条已产出视频，无上一条可比（首片开工时正常）。');
  process.exit(0);
}
const newest = vids[vids.length - 1];
const prev = vids[vids.length - 2];

/** 解析一个数据文件的场景序列 → [{type, layoutKind}]（type 与 layoutKind 同行，窗口内配对） */
function parseScenes(text) {
  const out = [];
  const re = /(^|[{,\s])type:\s*'([a-z]+)'[\s\S]{0,60}?layoutKind:\s*'([a-z-]+)'/g;
  let m;
  while ((m = re.exec(text))) out.push({ type: m[2], layoutKind: m[3] });
  return out;
}
const countTypes = (text) => (text.match(/(^|[{,\s])type:\s*'[a-z]+',/g) || []).length;

const newText = readFileSync(join(DATA, newest.file), 'utf8');
const prevText = readFileSync(join(DATA, prev.file), 'utf8');
const newScenes = parseScenes(newText);
const prevScenes = parseScenes(prevText);
const newTypeCount = countTypes(newText);

console.log('\n══════════════ 布局指纹闸门（check-layout-diversity）══════════════\n');
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

let fail = false;
if (missing.length) {
  fail = true;
  console.log(`\n① 新片缺布局标注  ❌ 硬失败 —— ${missing.length} 处：`);
  for (const x of missing) console.log(`   ${x}`);
  console.log('   修法：给最新一片每个 Scene 补 layoutKind（card-list/form/two-column/flow/hero-object/compare-list/hero-focus/mechanism-diagram/cta-statement）。');
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

console.log('\n──────────────────────────────────────────────');
if (fail) {
  console.log('❌ 布局指纹闸门未过：存在缺标注或未豁免的同布局碰撞。这道闸专治"新片复用上一条画面"——修完再声明通过。');
  process.exit(1);
}
if (!waived.length) {
  console.log(`✅ 通过：${newest.id} 各屏 layoutKind 与上一条 ${prev.id} 同 type 屏零碰撞（呈现架构真换了）。`);
} else {
  console.log(`✅ 通过（含 ${waived.length} 条带 structuralDiff 证据的豁免，已列出供过目）。`);
}
process.exit(0);

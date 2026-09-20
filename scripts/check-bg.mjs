#!/usr/bin/env node
/**
 * scripts/check-bg.mjs · 背景底强制闸门（SKILL 第 2 步 / §五：每条视频必须真用一张背景图打底）
 *
 * 为什么要它（2026-09-04 用户拍板）：g07/g08 都跳过了 §五「选背景底」——没设 style.bgImage、
 * 各自手写同系深棕程序化 Ambient，导致跨片视觉重复；而「换语言五轴」与 check-similarity 只查结构、
 * 不查背景底，这类问题反复出现且机器查不出。本闸把「每片必须设 bgImage 且指向真实存在的图片」变成可计算的硬判据。
 *
 * 判据（对 data/index.ts 里每一条视频）：
 *   ① style 块必须声明非空 `bgImage: '...'`；
 *   ② 该路径（相对 video/public，即 staticFile 根）指向的文件必须真实存在、且是图片扩展名。
 * 任一不满足 = 硬失败（红灯不产出、不交付）。
 * 例外：已交付/已裁、当时未用背景图的历史片，在 scripts/ref-registry.json 的 bgExemptions 里登记
 *   { video, reason, approvedBy } 转「已豁免」不阻断（数字照实打印）；新片不得走豁免。
 *
 * 用法（项目根运行）：node scripts/check-bg.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineOf, gateAppliesFor } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'video/src/data');
const PUBLIC_DIR = join(ROOT, 'video/public');
const IMG_EXT = /\.(png|jpe?g|webp)$/i;
// 统一诊断边界（CHANGE-20260920-031 §3.2.1）：本脚本不再自行 JSON.parse 声明源
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'check-bg' });

/**
 * 返回 { registered, unregistered }（B3.4 三防线之 3：未注册 data/*.ts 不得静默不可见）
 * 行业线"每条视频"的枚举仍以 data/index.ts 导出为准，顺序语义不变。
 */
function loadVideos() {
  const idx = readFileSync(join(DATA_DIR, 'index.ts'), 'utf8');
  const order = [...idx.matchAll(/export\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/([\w.-]+)'/g)]
    .map((m) => ({ key: m[1], file: m[2] }));
  const registered = order.map(({ key, file }) => {
    const src = readFileSync(join(DATA_DIR, `${file}.ts`), 'utf8');
    const id = (src.match(/\bid:\s*'([^']+)'/) || [, key])[1];
    const bg = (src.match(/\bbgImage:\s*'([^']*)'/) || [])[1]; // undefined = 未声明；'' = 声明了但空
    return { key, id, bg };
  });
  const registeredFiles = new Set(order.map((o) => `${o.file}.ts`));
  const unregistered = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !registeredFiles.has(f))
    .map((f) => ({ id: f.replace(/\.ts$/, ''), file: f }));
  return { registered, unregistered };
}

const { registered: videos, unregistered } = loadVideos();
const exemptions = new Map((REGISTRY.bgExemptions || []).map((e) => [String(e.video).toLowerCase(), e]));

/** 判线：id 优先，退化到导出名 */
const classifyLine = (v) => lineOf(v.id, LINES) || lineOf(v.key, LINES);

console.log('\n══════════════ 背景底强制闸门（SKILL 第 2 步 / §五）══════════════\n');

// B3.4 返修：industry 声明缺失必须在**任何判定之前**硬失败。
// 它原先被放在后面，且当 industry 被删时 `l.id === industryLine?.id` 恒不成立、
// 非行业线循环又被整体跳过 → 教程文件也不再被归因 → 可能给出"基线为空"的假绿。
if (!industryLine) {
  console.error('❌ check-bg：ref-registry 未声明 industry 内容线 —— 拒绝把行业数据误判为"基线为空"');
  process.exit(1);
}

// B3.4 三防线之 1/2：判线在前 → 只对 APPLY 线执行判据；不可适用即停，不跑判据。
const gateFailures = [];
const gateNotes = [];
const traversed = new Set();
for (const v of videos) {
  if (!classifyLine(v)) {
    gateFailures.push(`${v.id}（导出名 ${v.key}）｜无法判定内容线 —— ref-registry.contentLines 未覆盖该片号形态，拒绝猜线`);
  }
}
for (const l of LINES) {
  if (!l || l.id === industryLine.id) continue;
  traversed.add(l.id);
  const group = videos.filter((v) => { const c = classifyLine(v); return c && c.id === l.id; });
  if (!group.length) continue;
  const applies = gateAppliesFor(REGISTRY, 'check-bg', l);
  if (applies === 'APPLY') {
    gateFailures.push(`${group.map((i) => i.id).join('、')}｜内容线「${l.label}」被声明为 APPLY，但「每片必设 bgImage」是行业线视觉条款 —— 拒绝机械继承，请为该线显式判定（APPLY 需先补该线判据，否则改 N/A/OWNER_PENDING）`);
  } else if (applies === 'OWNER_PENDING') {
    gateFailures.push(`${group.map((i) => i.id).join('、')}｜内容线「${l.label}」在本闸门为 OWNER_PENDING —— 先立 Owner 再产出（不放行、不静默跳过）`);
  } else {
    gateNotes.push(`📤 ${group.map((i) => i.id).join('、')}｜${applies}（声明源：ref-registry.gateApplicability.gateOverrides['check-bg']['${l.id}']）`);
  }
}
for (const u of unregistered) {
  const l = lineOf(u.id, LINES);
  gateFailures.push(`${u.file}｜存在于 data/ 但未注册进 data/index.ts（线：${l ? l.label : '无法判定'}）—— 拒绝静默不可见；完成注册链或移走该文件`);
}
// 兜底：能判线、但该线未被本闸门遍历过（例如 LINES 被删成只剩 industry）→ 也不得静默放过
for (const v of videos) {
  const l = classifyLine(v);
  if (!l || l.id === industryLine.id || traversed.has(l.id)) continue;
  gateFailures.push(`${v.id}｜已判为内容线「${l.label}」，但该线未被本闸门遍历（contentLines 声明不完整或被删）—— 拒绝静默放过`);
}
// 防线 3 的极端形态：index 为空但 data/ 有文件 —— 不能当成"基线为空"直接绿
if (!videos.length && unregistered.length) {
  gateFailures.push(`data/index.ts 无任何导出，但 data/ 存在 ${unregistered.length} 个数据文件（${unregistered.map((u) => u.file).join('、')}）—— 注册链断裂，不得判为"基线为空"`);
}
if (gateFailures.length) {
  for (const n of gateNotes) console.log(n);
  console.log(`\n④ 内容线适用性 / 注册链  ❌ 硬失败 —— ${gateFailures.length} 处（未执行任何 bgImage 判据）：`);
  for (const x of gateFailures) console.log(`   ❌ ${x}`);
  console.log('   依据：CHANGE-20260920-031 §3.2.1 门状态即执行边界与硬顺序。');
  process.exit(1);
}
for (const n of gateNotes) console.log(n);

const industryVideos = videos.filter((v) => { const c = classifyLine(v); return c && c.id === industryLine?.id; });
if (!industryVideos.length) {
  console.log('✅ 行业线暂无已产出视频（data/index.ts 无本线导出），背景底基线为空——新片建数据文件时必设 bgImage。');
  process.exit(0);
}

let hardFail = 0;
let exempted = 0;
for (const v of industryVideos) {
  const ex = exemptions.get(v.id.toLowerCase());
  if (v.bg && v.bg.trim()) {
    const abs = join(PUBLIC_DIR, v.bg);
    const exists = existsSync(abs);
    const isImg = IMG_EXT.test(v.bg);
    if (exists && isImg) {
      console.log(`✅ ${v.id.padEnd(8)} bgImage = ${v.bg}`);
    } else {
      console.log(`❌ ${v.id.padEnd(8)} bgImage = ${v.bg} —— ${!isImg ? '非图片扩展名' : '文件不存在（video/public 下找不到）'}`);
      hardFail++;
    }
  } else if (ex) {
    console.log(`⏭️ ${v.id.padEnd(8)} 未设 bgImage —— 已登记豁免（${ex.approvedBy || '未记批准人'}）：${ex.reason}`);
    exempted++;
  } else {
    console.log(`❌ ${v.id.padEnd(8)} 未声明 bgImage —— 每条视频必须选一张背景图打底（写进 data/${v.key}.ts 的 style.bgImage，指向 video/public 下真实存在的图片）；不得用手写程序化纯色/渐变底替代。`);
    hardFail++;
  }
}

console.log('\n────────────────────────────────────────────');
if (hardFail) {
  console.log(`❌ ${hardFail} 条视频背景底不合规。处理：回 SKILL 第 2 步/§五 选一张背景底入库并写 bgImage；`);
  console.log('   仅已交付/已裁的历史片可在 scripts/ref-registry.json 的 bgExemptions 登记豁免（须用户批准），新片不得走豁免。');
  process.exit(1);
} else {
  console.log(`✅ 全部 ${industryVideos.length} 条行业线视频背景底合规${exempted ? `（含 ${exempted} 条已登记豁免的历史片）` : ''}。`);
  process.exit(0);
}

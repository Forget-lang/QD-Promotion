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
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTROOT = join(ROOT, 'outputs');
const MUST_FIELDS = ['核心痛点', '情绪关键词', '视觉关键词', '禁止出现'];
const ASSET_MARK = '背景素材张数';

/** outputs 下的 gXX 目录（编号最大者 = 当前片） */
function newestGammaDir() {
  let best = null;
  for (const d of readdirSync(OUTROOT)) {
    const p = join(OUTROOT, d);
    if (!statSync(p).isDirectory()) continue;
    const m = /^g(\d+)/i.exec(d);
    if (m && (!best || Number(m[1]) > best.n)) best = { n: Number(m[1]), path: p, name: d };
  }
  return best;
}

function findMotif(dir) {
  for (const f of readdirSync(dir)) {
    if (/母题一页/.test(f) && f.endsWith('.md')) return join(dir, f);
  }
  return null;
}

console.log('\n══════════════ 母题卡强制闸门（SKILL 第 2 步：视觉定位卡四栏 + 素材张数）══════════════\n');

const gg = newestGammaDir();
if (!gg) {
  console.log('✅ outputs 下暂无 gXX 目录，母题卡基线为空——新片建母题一页时必含四栏 + 素材张数。');
  process.exit(0);
}
if (!existsSync(join(gg.path, '03-母题一页.md')) && !findMotif(gg.path)) {
  console.log(`⏭️ ${gg.name} 暂无母题一页，跳过（未到第 2 步产出；到产出时必含四栏 + 背景素材张数，否则本闸转红）。`);
  process.exit(0);
}

const motif = findMotif(gg.path);
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
#!/usr/bin/env node
/**
 * check-facts.mjs —— 事实守门脚本（磁盘事实 vs 登记声称）
 *
 * 规则：promotion 仓库内资产必须真实存在；外部事实源/外部截图库由 R10 定义，不把
 * Agent 本机的相对路径伪装成仓库内资产。外部项仍会被显式列出，但不计为仓库事实缺失。
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = JSON.parse(readFileSync(join(__dirname, 'ref-registry.json'), 'utf8'));
const ASSETS = JSON.parse(readFileSync(join(ROOT, 'spec', 'assets.json'), 'utf8'));
const fails = [];
const passes = [];
const external = [];

// ── ① 关键资产存在性 ──
for (const c of REGISTRY.factChecks || []) {
  // APPLET 是 R10 定义的外部产品事实源，不属于 promotion 仓库磁盘资产。
  if (String(c.path).startsWith('../applet/')) {
    external.push({ ...c, stage: '①', reason: 'APPLET external product truth (R10)' });
    continue;
  }
  (existsSync(join(ROOT, c.path)) ? passes : fails).push({ ...c, stage: '①' });
}

// ── ② 素材登记一致性 ──
const registered = [];
for (const bg of ASSETS.A.abstract) registered.push({ desc: `${bg.id} ${bg.name}`, path: bg.path });
for (const f of ASSETS.A.flat) registered.push({ desc: `${f.id} ${f.name}`, path: f.path });
for (const t of ASSETS.A.texture) registered.push({ desc: `${t.id} ${t.name}`, path: t.path });
for (const g of ASSETS.A.geometric) registered.push({ desc: `${g.id} ${g.name}`, path: g.path });
for (const x of ASSETS.A.xhs) registered.push({ desc: `${x.id} ${x.name}`, path: x.path });
for (const cv of ASSETS.A.coverBackground) registered.push({ desc: `${cv.id} ${cv.name}`, path: cv.path });
for (const b of ASSETS.B) registered.push({ desc: `${b.id} ${b.name}`, path: b.path });
for (const f of ASSETS.C) registered.push({ desc: `字体 ${f.font}`, path: f.path });

const assetFails = [];
const assetPasses = [];
for (const r of registered) {
  // 图鱼库是历史外部素材库；没有将整套素材复制进 promotion 仓库的要求。
  if (String(r.path).startsWith('图标素材/图鱼素材/')) {
    external.push({ ...r, stage: '②', reason: 'external asset library' });
    continue;
  }
  (existsSync(join(ROOT, r.path)) ? assetPasses : assetFails).push(r);
}

// D 级截图是外部速查库；仓库只保存登记表，不把截图库复制进 CI checkout。
const dDir = join(ROOT, ASSETS.D.dir);
const diskFiles = existsSync(dDir) ? readdirSync(dDir).filter((f) => !f.startsWith('.')) : [];
const registeredD = new Set([
  ...ASSETS.D.categories.flatMap((c) => c.files),
  ...ASSETS.D.banned.wecom.files,
  ...ASSETS.D.banned.wechatSearch.files,
]);
if (!existsSync(dDir)) {
  external.push({ desc: `D 级截图速查库（${registeredD.size} 项登记）`, path: ASSETS.D.dir, stage: '②', reason: 'external screenshot library' });
} else {
  const unregisteredOnDisk = diskFiles.filter((f) => !registeredD.has(f));
  const registeredMissing = [...registeredD].filter((f) => !diskFiles.includes(f));
  for (const f of unregisteredOnDisk) console.log(`   ⚠️ 磁盘有但未登记：${ASSETS.D.dir}${f}（请补登记或移走）`);
  for (const f of registeredMissing) console.log(`   ❌ 已登记但磁盘缺失：${ASSETS.D.dir}${f}`);
  if (registeredMissing.length) fails.push({ desc: 'D 级截图登记项', path: ASSETS.D.dir, stage: '②' });
}

console.log('\n══════════════ 事实守门扫描结果 ════════════\n');
console.log(`① 关键资产存在性  ${fails.filter((f) => f.stage === '①').length === 0 ? '✅ 通过' : '❌ 硬失败'} —— 仓库内通过 ${passes.length}/${passes.length + fails.filter((f) => f.stage === '①').length}`);
for (const c of passes) console.log(`   ✅ ${c.desc}`);
for (const c of fails.filter((f) => f.stage === '①')) console.log(`   ❌ ${c.desc} — 路径不存在：${c.path}`);
console.log(`   ↳ 外部 APPLET/事实源 ${external.filter((x) => x.stage === '①').length} 项：按 R10 不计仓库缺失`);

console.log(`② 素材登记一致性（spec/assets.json）  ${assetFails.length === 0 && !fails.some((f) => f.stage === '②') ? '✅ 通过' : '❌ 硬失败'} —— 仓库内 A/B/C 路径存在 ${assetPasses.length}/${assetPasses.length + assetFails.length}`);
for (const r of assetFails) console.log(`   ❌ ${r.desc} — 登记路径不存在：${r.path}`);
console.log(`   ↳ 外部素材/截图库 ${external.filter((x) => x.stage === '②').length} 项：只保留登记，不复制进 promotion checkout`);

console.log('\n────────────────────────────────────────────');
if (fails.length || assetFails.length) {
  console.log(`❌ 存在 ${fails.length + assetFails.length} 个仓库内事实缺失项。补齐文件或修正登记后重跑。\n`);
  process.exit(1);
}
console.log('✅ 仓库内关键事实全部在位；外部事实源均按 R10 显式标记，未被伪装成仓库资产。\n');
process.exit(0);

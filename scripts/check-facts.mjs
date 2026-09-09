#!/usr/bin/env node
/**
 * check-facts.mjs —— 事实守门脚本（磁盘事实 vs 登记声称）
 *
 * 用途：验证文档/登记依赖的关键路径在磁盘上真实存在（防"登记了不存在的素材/文件"）。
 * 数据源：
 *   ① ref-registry.json 的 factChecks 列表（关键基础设施路径）
 *   ② spec/assets.json 素材登记（A/B/C 级登记路径必须存在；D 级磁盘数量对账 + 未登记文件检出）
 * 用法（项目根运行）：
 *   node scripts/check-facts.mjs
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = JSON.parse(readFileSync(join(__dirname, 'ref-registry.json'), 'utf8'));
const ASSETS = JSON.parse(readFileSync(join(ROOT, 'spec', 'assets.json'), 'utf8'));

const fails = [];

// ── ① 关键资产存在性（ref-registry.factChecks）──
const checks = REGISTRY.factChecks || [];
const passes = [];
for (const c of checks) {
  (existsSync(join(ROOT, c.path)) ? passes : fails).push({ ...c, stage: '①' });
}

// ── ② 素材登记一致性（spec/assets.json）──
const registered = []; // 所有登记路径 → 存在性检查
for (const bg of ASSETS.A.abstract) registered.push({ desc: `${bg.id} ${bg.name}`, path: bg.path });
for (const x of ASSETS.A.xhs) registered.push({ desc: `${x.id} ${x.name}`, path: x.path });
for (const cv of ASSETS.A.coverBackground) registered.push({ desc: `${cv.id} ${cv.name}`, path: cv.path });
for (const b of ASSETS.B) registered.push({ desc: `${b.id} ${b.name}`, path: b.path });
for (const f of ASSETS.C) registered.push({ desc: `字体 ${f.font}`, path: f.path });

const assetFails = [];
const assetPasses = [];
for (const r of registered) {
  (existsSync(join(ROOT, r.path)) ? assetPasses : assetFails).push(r);
}

// D 级：磁盘数量对账 + 未登记文件检出
const dDir = join(ROOT, ASSETS.D.dir);
const diskFiles = existsSync(dDir) ? readdirSync(dDir).filter((f) => !f.startsWith('.')) : [];
const registeredD = new Set([
  ...ASSETS.D.categories.flatMap((c) => c.files),
  ...ASSETS.D.banned.wecom.files,
  ...ASSETS.D.banned.wechatSearch.files,
]);
const unregisteredOnDisk = diskFiles.filter((f) => !registeredD.has(f));
const registeredMissing = [...registeredD].filter((f) => !diskFiles.includes(f));
const dCountOK = diskFiles.length === registeredD.size && unregisteredOnDisk.length === 0 && registeredMissing.length === 0;

console.log('\n══════════════ 事实守门扫描结果 ════════════\n');

console.log(`① 关键资产存在性  ${fails.filter((f) => f.stage === '①').length === 0 ? '✅ 通过' : '❌ 硬失败'} —— 通过 ${passes.length}/${checks.length}`);
for (const c of passes) console.log(`   ✅ ${c.desc}`);
for (const c of fails.filter((f) => f.stage === '①')) console.log(`   ❌ ${c.desc} — 路径不存在：${c.path}`);

console.log(`② 素材登记一致性（spec/assets.json）  ${assetFails.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— A/B/C 级登记路径存在 ${assetPasses.length}/${registered.length}`);
for (const r of assetFails) console.log(`   ❌ ${r.desc} — 登记路径不存在：${r.path}`);
console.log(`   D 级截图对账：磁盘 ${diskFiles.length} 张 / 登记 ${registeredD.size} 张 ${dCountOK ? '✅' : '❌'}`);
for (const f of unregisteredOnDisk) console.log(`   ⚠️ 磁盘有但未登记：${ASSETS.D.dir}${f}（请补登记或移走）`);
for (const f of registeredMissing) console.log(`   ❌ 已登记但磁盘缺失：${ASSETS.D.dir}${f}`);

console.log('\n────────────────────────────────────────────');
// 未登记文件仅警告不算硬失败；登记路径不存在/登记了磁盘缺失 = 硬失败
if (fails.length || assetFails.length || registeredMissing.length) {
  console.log(`❌ 存在 ${fails.length + assetFails.length + registeredMissing.length} 个缺失项。补齐文件或修正登记后重跑。\n`);
  process.exit(1);
} else {
  console.log('✅ 关键资产全部在位，素材登记与磁盘一致。\n');
  process.exit(0);
}

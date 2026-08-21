#!/usr/bin/env node
/**
 * check-facts.mjs —— 事实守门脚本（磁盘事实 vs 文档声称）
 *
 * 用途：验证文档依赖的关键路径/文件在磁盘上真实存在（防"文档引用了不存在的素材/文件"）。
 * 数据源：ref-registry.json 的 factChecks 列表（维护规则：新增关键资产时在注册表登记）。
 * 用法（项目根运行）：
 *   node scripts/check-facts.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = JSON.parse(readFileSync(join(__dirname, 'ref-registry.json'), 'utf8'));

const checks = REGISTRY.factChecks || [];
const fails = [];
const passes = [];

for (const c of checks) {
  const full = join(ROOT, c.path);
  if (existsSync(full)) {
    passes.push(c);
  } else {
    fails.push(c);
  }
}

console.log('\n══════════════ 事实守门扫描结果 ════════════\n');
console.log(`① 关键资产存在性  ${fails.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— 通过 ${passes.length}/${checks.length}`);
for (const c of passes) console.log(`   ✅ ${c.desc}`);
for (const c of fails) console.log(`   ❌ ${c.desc} — 路径不存在：${c.path}`);
console.log('\n────────────────────────────────────────────');
if (fails.length > 0) {
  console.log(`❌ 存在 ${fails.length} 个缺失资产。补齐文件或修正 ref-registry.json 后重跑。\n`);
  process.exit(1);
} else {
  console.log('✅ 关键资产全部在位。\n');
  process.exit(0);
}

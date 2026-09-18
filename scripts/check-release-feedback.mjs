#!/usr/bin/env node
/**
 * scripts/check-release-feedback.mjs · 发布后验回填闸门（2026-09-14 新增）
 *
 * 为什么：SKILL 第 7 步「发布后验闭环」的「必回填台账」升级前是自觉条款（只能靠 AI 打勾、
 * 无机检、无真图可判）——新会话一漏就永远漏。本闸门把「已发布片必须有后验回填」钉成开工必拦：
 * 数据源是 outputs/archive/发布后验台账.json（片进「已发布」由 AI 连机加行）。
 *
 * 判据：
 *  - 状态=历史豁免 → ⏭️ 跳过（协议生效前已发布片，不回改）
 *  - 状态=已发布-待回填 → ⚠️ 提示列出（刚发布、正等 24h/7d 数据属正常，不锁死开工；见下「已回填必红」）
 *  - 状态=已回填 → 按「类型」取指标组校验 + 变量假设齐全 → ✅；缺任一项 → ❌（这是真正的硬拦）：
 *      视频[缺省] = 四数【播放量/封面CTR/2秒跳出/完播】（SKILL 第 7 步）；
 *      图文 = 三指标【进入率/翻完率/赞藏评】（SKILL 图文线后验口径，2026-09-18 CHANGE-20260918-028 接入）
 *  - 「类型」非法值 → ❌；历史行无「类型」字段按视频处理（零改动向后兼容）
 *  - 台账空 → ✅（尚未有协议内发布，发布即启用）
 *  - 状态非法 / 台账文件缺失 / JSON 损坏 → ❌（闸门不假装通过）
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(ROOT, 'outputs', 'archive', '发布后验台账.json');
/** 指标字段按行「类型」分支（CHANGE-20260918-028）：视频四数｜图文三指标（键名与 SKILL 图文线口径逐字一致） */
const METRIC_FIELDS = {
  '视频': ['播放量', '封面CTR', '2秒跳出', '完播'],
  '图文': ['进入率', '翻完率', '赞藏评'],
};
const print = (mark, m) => console.log(`${mark} ${m}`);
const fail = (m) => { print('❌', m); return false; };

if (!existsSync(LEDGER)) {
  fail(`发布后验台账缺失：${LEDGER} —— 机检数据源没了，不许假装通过`);
  console.log(`\n❌ 发布后验回填闸门 未通过（台账文件不存在）`);
  process.exit(1);
}
let rows;
try { rows = JSON.parse(readFileSync(LEDGER, 'utf8')).rows || []; }
catch { fail('发布后验台账 JSON 解析失败'); console.log(`\n❌ 发布后验回填闸门 未通过（JSON 损坏）`); process.exit(1); }

const allowed = ['历史豁免', '已发布-待回填', '已回填'];
let exempt = 0, pending = [], okFilled = 0;
const bad = [];

for (const r of rows) {
  const id = r.片号 || '(无片号)';
  const st = r.状态;
  if (!allowed.includes(st)) { bad.push(`《${id}》状态非法「${st}」，只能是 ${allowed.join('/')}`); continue; }
  const type = r.类型 === undefined || r.类型 === '' ? '视频' : r.类型;   // 缺省=视频：仅兼容 028 之前的历史行，新行必须显式写
  if (!METRIC_FIELDS[type]) { bad.push(`《${id}》类型非法「${type}」，只能是 视频/图文`); continue; }
  if (st === '历史豁免') { exempt++; continue; }
  if (st === '已发布-待回填') {
    pending.push(`《${id}》已发布待回填${r.变量假设 ? `，单变量假设「${r.变量假设}」` : ''}`);
    continue;
  }
  // st === '已回填'
  const empty = METRIC_FIELDS[type].filter((f) => r[f] === null || r[f] === undefined || r[f] === '');
  if (!r.变量假设) empty.push('变量假设');
  if (empty.length) bad.push(`《${id}》状态已回填但缺：${empty.join('/')}`);
  else okFilled++;
}

for (const m of pending) print('⚠️', `发布后验待回填：${m}`);   // 刚发布待数据属预期，不掐断；超窗靠人工盯台账
for (const m of bad) fail(m);

if (rows.length === 0) {
  console.log(`\n✅ 发布后验回填闸门 通过（台账已就位，暂无协议内发布——发布即启用，每条片进「已发布」即待回填）`);
  process.exit(0);
}
console.log(`\n发布后验台账：${rows.length} 行（历史豁免 ${exempt}、已回填 ${okFilled}、待回填 ${pending.length}）`);
if (bad.length === 0) {
  print('✅', `发布后验回填闸门 通过`);
  process.exit(0);
} else {
  console.log(`❌ 发布后验回填闸门 未通过`);
  process.exit(1);
}
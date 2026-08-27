#!/usr/bin/env node
/**
 * check-redlines.mjs —— 券到卡包短视频红线守门脚本
 *
 * 唯一数据源：spec/redlines.json（机检四层 = 其中带 scope 的层；_meta/rules 为规则全量，不参与扫描）
 * 用途：改完任何红线/CTA 口径后运行，作为「全量对齐」的收口闸门。
 * 用法（项目根运行）：
 *   node scripts/check-redlines.mjs
 *
 * 四层检查（按严格程度递减）：
 *   1. codeBanned    — 画面层硬禁（video/src 所有 ts/tsx），命中 = 硬失败
 *   2. voiceBanned   — 口播/文案层硬禁（data/*.ts + outputs/*.md），命中 = 硬失败
 *   3. outputsReview — 文案层需确认（outputs/*.md），命中 = 列出人工确认
 *   4. docsInfo      — 文档层仅提示（docs/** + skill），命中 = 信息提示
 *
 * 注意：本脚本只读取文件、不删除任何东西，不受 WorkBuddy safe-delete 拦截影响。
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONFIG = JSON.parse(readFileSync(join(__dirname, '..', 'spec', 'redlines.json'), 'utf8'));

// 把 scope 里的 glob（**/*.tsx 等）展开成具体文件
function expand(scopeList, excludeList = []) {
  // excludeList 支持目录形式：如 "outputs/archive" / "outputs/archive/**" / "outputs/archive/**/*.md"
  const excludeDirs = excludeList
    .map(ex => join(ROOT, ex.replace(/\/\*.*$/, '')).replace(/\/$/, ''))
    .filter(p => exists(p));
  const out = new Set();
  for (const pat of scopeList) {
    const parts = pat.split('/**/');
    const baseDir = join(ROOT, parts[0]);
    const ext = parts[1] || null; // e.g. "*.md"
    if (!exists(baseDir)) continue;
    collect(baseDir, ext, excludeDirs, out);
  }
  return [...out];
}

function exists(p) {
  try { return statSync(p).isDirectory() || statSync(p).isFile(); } catch { return false; }
}

function collect(dir, ext, excludeDirs, out) {
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (excludeDirs.some(d => full === d || full.startsWith(d + '/'))) continue;
    if (e.isDirectory()) collect(full, ext, excludeDirs, out);
    else if (!ext || full.endsWith(ext.replace('*', ''))) out.add(full);
  }
}

// 剥离 .tsx 注释（行注释 // 与块注释 /* */），避免规则说明注释误报
function stripComments(text) {
  let inBlock = false;
  const lines = text.split('\n');
  return lines.map((raw) => {
    let line = raw;
    if (inBlock) {
      const end = line.indexOf('*/');
      if (end === -1) return '';
      line = line.slice(end + 2);
      inBlock = false;
    }
    const start = line.indexOf('/*');
    if (start !== -1) {
      const end = line.indexOf('*/', start + 2);
      if (end === -1) { inBlock = true; return line.slice(0, start); }
      line = line.slice(0, start) + line.slice(end + 2);
    }
    const ci = line.indexOf('//');
    return ci === -1 ? line : line.slice(0, ci);
  }).join('\n');
}

function scan(files, tokens) {
  const hits = [];
  for (const f of files) {
    let content;
    try { content = readFileSync(f, 'utf8'); } catch { continue; }
    const isCode = f.endsWith('.tsx') || f.endsWith('.ts');
    const text = isCode ? stripComments(content) : content;
    const rel = f.replace(ROOT + '/', '');
    for (const tok of tokens) {
      if (text.includes(tok)) {
        // 记录命中行号（仅首个）
        const idx = text.indexOf(tok);
        const lineNo = text.slice(0, idx).split('\n').length;
        hits.push({ file: rel, line: lineNo, token: tok });
      }
    }
  }
  return hits;
}

let hardFail = false;
const report = [];

for (const [key, cfg] of Object.entries(CONFIG)) {
  if (!cfg.scope) continue;
  const files = expand(cfg.scope, cfg.exclude || []);
  const hits = scan(files, cfg.tokens);
  report.push({ key, note: cfg.note, hits });
  if (cfg.exitOnHit && hits.length > 0) hardFail = true;
}

// 输出
console.log('\n══════════════ 红线守门扫描结果 ════════════\n');
const keyLabels = {
  codeBanned: '① 画面层硬禁',
  voiceBanned: '② 口播/文案层硬禁',
  outputsReview: '③ 文案层需确认',
  docsInfo: '④ 文档层仅提示',
};
for (const r of report) {
  const label = keyLabels[r.key] || r.key;
  const tag = r.hits.length === 0 ? '✅ 通过' : (CONFIG[r.key]?.exitOnHit ? '❌ 硬失败' : '⚠️ 需确认');
  console.log(`${label}  ${tag} —— 命中 ${r.hits.length} 处`);
  if (r.hits.length) {
    for (const h of r.hits) console.log(`   ${h.file}:${h.line}  «${h.token}»`);
  }
}
console.log('\n────────────────────────────────────────────');
const hardFailCount = report.filter(r => CONFIG[r.key]?.exitOnHit && r.hits.length > 0).length;
if (hardFailCount > 0) {
  console.log(`❌ 存在 ${hardFailCount} 个硬失败层级（画面/口播违禁词）。未修复前不得声明「已对齐/已完成」。`);
  console.log('   请修改对应文件，移除违禁词后重跑本脚本。\n');
  process.exit(1);
} else {
  console.log('✅ 硬禁层零命中（画面 + 口播均合规）。');
  const reviewCount = report.find(r => r.key === 'outputsReview')?.hits.length || 0;
  if (reviewCount > 0) {
    console.log(`⚠️ 文案层有 ${reviewCount} 处需人工确认，请逐条判断是否为「规则说明句」。`);
    console.log('   三平台文章/视频均禁用微信搜索/小程序导流，无合规导流例外。');
  }
  console.log('   确认无误即可收口。\n');
  process.exit(0);
}

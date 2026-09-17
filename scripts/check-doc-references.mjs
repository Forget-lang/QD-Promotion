#!/usr/bin/env node
/**
 * check-doc-references.mjs —— 文档引用守门脚本
 *
 * 用途：改完任何权威文档后运行，自动验证「文件名/章节名」引用是否失效（防残留旧方案、防引用断链）。
 * 用法（项目根运行）：
 *   node scripts/check-doc-references.mjs
 *
 * 检查内容：
 *   1. 文档间文件名引用（如 `R2-业务流程.md`、`SKILL.md`）→ 被引文件必须是注册文档（docs/internal/ + AGENTS.md + 战略简报 + AI使用手册）
 *   2. 章节引用（如 §2.9、§布局模式库、§5.9.7）→ 解析到被引文档（§ 前最近出现的文档名；无则视为本文档自引用）并验证锚点存在
 *   3. 归档注记（如「原 13 §5.9」）与反例代码块 → 跳过，不误报
 *   4. 资源路径存在性：反引号内以 outputs/ spec/ docs/ scripts/ video/ 或素材库目录开头的路径，磁盘上必须真实存在（占位符如 XX、NN、波浪号、竖线、星号 与 git 历史溯源行豁免）——2026-08-29 锚图散位、H5 旧路线两次"文档指路失效"的机检化
 *
 * 规则：失效引用 = 硬失败（exit 1）。无法判定归属的章节引用记入「需人工确认」，不算硬失败。
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = JSON.parse(readFileSync(join(__dirname, 'ref-registry.json'), 'utf8'));

const docsDir = join(ROOT, REGISTRY.docsDir);
const docFiles = readdirSync(docsDir).filter((f) => f.endsWith('.md') && !f.startsWith('.'));
const allDocs = new Map();
for (const f of docFiles) allDocs.set(f, join(docsDir, f));
for (const f of REGISTRY.extraDocs || []) {
  const p = join(ROOT, f);
  if (existsSync(p)) allDocs.set(f, p);
}

const aliasMap = new Map();
for (const [alias, file] of Object.entries(REGISTRY.aliases || {})) {
  aliasMap.set(alias, file);
  aliasMap.set(alias + '.md', file);
}
for (const file of allDocs.keys()) {
  aliasMap.set(file, file);
  aliasMap.set(file.replace(/\.md$/, ''), file);
}

function extractAnchors(filePath) {
  const anchors = [];
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (!m) continue;
    const raw = m[2].replace(/`/g, '');
    const numM = raw.match(/^(\d+(?:\.\d+)*)[\s·\-—]*([^\s].*)?$/);
    anchors.push({ raw, num: numM ? numM[1] : null, name: numM ? (numM[2] || '').trim() : raw.trim() });
  }
  return anchors;
}
const anchorsByFile = new Map();
for (const [file, path] of allDocs) anchorsByFile.set(file, extractAnchors(path));

const hardFails = [];
const reviews = [];

const docNames = [...allDocs.keys()].flatMap((k) => [k, k.split('/').pop()]);
for (const v of Object.values(REGISTRY.aliases || {})) docNames.push(v, v.split('/').pop());
const uniqNames = [...new Set(docNames)].filter(Boolean).sort((a, b) => b.length - a.length);
const nameAlt = uniqNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const fileRefRe = new RegExp('`?(' + nameAlt + ')`?', 'g');
// 旧编号文档名：只在 token 边界处识别。必须阻止 R10-xxx 中的「10-xxx」被误判为旧 10-xxx 文档。
const legacyRefRe = /(?<![A-Za-z0-9])`?((?:[A-Z]\d|\d{2})-[^`\s，。；：、()（）"']+\.md|素材索引表\.md)`?/g;
const legacyNameRe = /\b(?:M[123]|R[0145])-(?:内容策划手册|视频制作手册|平台发布手册|业务深度图谱|产品事实表|最佳实践库|内容红线)/g;
const provenanceRe = /迁入|迁移合并|原文存档|存档可查|最后校验/;
const aliasKeys = Object.keys(REGISTRY.aliases || {}).sort((a, b) => b.length - a.length);
const aliasRe = aliasKeys.length
  ? new RegExp('(?:^|[^A-Za-z0-9])(' + aliasKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?:[^A-Za-z0-9]|$)', 'g')
  : null;

for (const [file, path] of allDocs) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const rel = relative(ROOT, path);
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    const docHits = [];
    let m;
    fileRefRe.lastIndex = 0;
    while ((m = fileRefRe.exec(line)) !== null) {
      const name = allDocs.has(m[1]) ? m[1] : [...allDocs.keys()].find((k) => k === m[1] || k.split('/').pop() === m[1]);
      if (name) docHits.push({ idx: m.index, file: name });
    }
    legacyRefRe.lastIndex = 0;
    while ((m = legacyRefRe.exec(line)) !== null) {
      if (m[1].includes('归档')) continue;
      if (/`outputs\/[^`]*$/.test(line.slice(0, m.index))) continue;
      if (!allDocs.has(m[1])) hardFails.push({ file: rel, line: lineNo, ref: m[1], why: '被引文档不存在（旧手册已清理删除，原文在 git 历史；请改指 spec/ 或 SKILL 新真源）' });
    }
    if (!provenanceRe.test(line)) {
      legacyNameRe.lastIndex = 0;
      while ((m = legacyNameRe.exec(line)) !== null) hardFails.push({ file: rel, line: lineNo, ref: m[0], why: '引用已归档旧文档（编号-名称形态，无 .md 也断链；请改指 spec/ 或 SKILL 新真源）' });
    }
    if (aliasRe) {
      aliasRe.lastIndex = 0;
      while ((m = aliasRe.exec(line)) !== null) {
        const file2 = aliasMap.get(m[1]);
        if (file2) docHits.push({ idx: m.index + 1, file: file2 });
      }
    }
    docHits.sort((a, b) => a.idx - b.idx);
    const isArchivalNote = /(?:原\s*[^，。；：]*|(?:0\d|1[0-4])-[^，。；：]*)\s*§/.test(line) || /最后校验/.test(line);
    const isCounterExample = /(❌|错：|禁止|不使用|不用「)/.test(line);
    if (!isArchivalNote && !isCounterExample) {
      const secRe = /§([0-9]+(?:\.[0-9]+)*|[^§\s，。；：、（）)」』"`]+)/g;
      while ((m = secRe.exec(line)) !== null) {
        const sec = m[1].replace(/[/"'，。]+$/, '');
        if (/[a-zA-Z]/.test(sec)) continue;
        let target = null;
        for (const d of docHits) { if (d.idx < m.index) target = d.file; else break; }
        const self = target === null;
        const doc = target || file;
        if (!anchorsByFile.has(doc)) { reviews.push({ file: rel, line: lineNo, ref: `§${sec}`, why: `无法判定被引文档（§${sec} 前未识别到文档名）` }); continue; }
        const anchors = anchorsByFile.get(doc);
        const isNum = /^\d/.test(sec);
        const hit = anchors.some((a) => isNum ? (a.num === sec || (a.num && a.num.startsWith(sec + '.'))) : (a.raw.includes(sec) || (a.name && a.name.includes(sec))));
        if (!hit) hardFails.push({ file: rel, line: lineNo, ref: `§${sec}`, why: `在 ${self ? '本文档' : doc} 中找不到章节「§${sec}」` });
      }
    }
  });
}

const RES_ROOTS = ['outputs/', 'spec/', 'docs/', 'scripts/', 'video/', '背景素材/', '插图库/', '图标素材/', '截图素材/', '商用字体/'];
const placeholderRe = /(XX|NN|\*|\||~|…|\.\.|node_modules|\{[^}]*\})/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    let bm;
    const btRe = /`([^`\s]+)`/g;
    while ((bm = btRe.exec(line)) !== null) {
      const raw = bm[1].replace(/[，。、）)"'：;]+$/, '');
      const tok = raw.startsWith('promotion/') ? raw.slice('promotion/'.length) : raw;
      if (!RES_ROOTS.some((r) => tok.startsWith(r))) continue;
      if (placeholderRe.test(tok)) continue;
      const p = join(ROOT, tok);
      if (!existsSync(p)) hardFails.push({ file: rel, line: i + 1, ref: raw, why: '文档指路的资源路径在磁盘上不存在（挪动/改名后未同步）' });
    }
  });
}

const GATE_LABELS = ['红线', '文档引用', '事实', '相似度', '效果尺子', '上屏真实性', '布局指纹', '背景底', '口播纪律', '口播品牌'];
const countRe = /[0-9一二两三四五六七八九十]+\s*(?:大|条|个)?闸门|(?:闸门|检查项)[^。\n]{0,4}[0-9一二三四五六七八九十]+\s*项|\b\d\s*\/\s*\d\s*(?:绿|通过)|[0-9一二两三四五六七八九十]+\s*层\s*(?:机检|机验|检查)/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (countRe.test(line)) hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '复述了闸门条数/检查层数：增减时必然漏改，改成"以脚本输出为准"' });
    const named = GATE_LABELS.filter((g) => line.includes(g)).length;
    if (named >= 3 && line.includes('闸门')) hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '逐项列出了闸门清单：同样会过期，改成指向脚本输出' });
  });
}

const stampRe = /^>?\s*(最后校验|更新|版本)\s*[：:]/;
// R10 是当前有效 Owner，不属于历史 R1x 编号扫描；历史轮次仍以 R11-R19 为对象。
const histRe = /第[一二三四五六七八九十0-9]{1,3}轮|\bR1[1-9]\b/;
const constitutionScan = (rel, text) => {
  let inCodeBlock = false;
  text.split('\n').forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (stampRe.test(line) && line.length > 120) hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '宪法铁律二：校验戳超 120 字——戳内复述改动摘要，改为「日期（变更史见 docs/changes/）」' });
    if (histRe.test(line) && !/docs\/changes/.test(line)) hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '宪法铁律一：正文写了审计轮次叙事——改动史归 docs/changes/，此处只留规则 +「详见对应变更事务」指针' });
  });
};
for (const [, p] of allDocs) constitutionScan(relative(ROOT, p), readFileSync(p, 'utf8'));
{
  const specDir = join(ROOT, 'spec');
  for (const jf of readdirSync(specDir).filter((n) => n.endsWith('.json'))) constitutionScan(`spec/${jf}`, readFileSync(join(specDir, jf), 'utf8'));
}

const caliberOwners = REGISTRY.caliberOwners || [];
const caliberExemptRe = /(❌|错：|禁止|不使用)/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock || caliberExemptRe.test(line)) return;
    for (const c of caliberOwners) {
      if (file === c.owner) continue;
      const re = new RegExp(c.pattern, 'i');
      if (re.test(line)) hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: `高危口径重复定义：Owner=${c.owner}；属主外只允许指针/引用` });
    }
  });
}

// 旧话头（已登记废弃口径）回流拦截 —— 2026-09-17 CHANGE-20260917-021 接入。
// 背景：deprecatedTerms 此前只登记、无消费端（CHANGE-020 §十三 实测记录），"清旧"名义上机器强制、实际靠自觉。
// 匹配规则：term 字面匹配，前后不得紧邻拉丁字母/数字——防子串误伤，判例见 docs/internal/整改作战总纲.md
// 「典型反例：合法 R10-产品事实源解析协议.md 被旧正则误识别为 10-...。此时应修检查器，而不是改掉合法文件名」。
// 中文无字符级边界，故 term 必须足够精确（各条精确性要求见 ref-registry.json 对应 desc）。
const deprecatedRules = (REGISTRY.deprecatedTerms || []).map((t) => ({
  term: t.term,
  desc: t.desc,
  re: new RegExp(`(?<![A-Za-z0-9])${t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9])`),
}));
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    for (const d of deprecatedRules) {
      if (d.re.test(line)) hardFails.push({ file: rel, line: i + 1, ref: d.term, why: `旧口径话头回流（已登记 deprecatedTerms）——改用当前口径；登记理由：${d.desc}` });
    }
  });
}

// 已退役文件名守门（2026-09-17 CHANGE-20260917-009 立，CHANGE-20260917-011 扩）：
// 文件删除后若不显式登记，闸门会因「它不再是已知文件名」而对其引用静默放行——
// 这正是本项目反复出现的失效模式（闸门失去检查对象即默认放行），故在此硬拦。
// 2026-09-17 CHANGE-20260917-011：changelog 全系退役（主文件 + 2026-08 分卷），两个名字都拦；
// 此处按**行内文件名**判，不依赖路径解析，故裸文件名（无 outputs/archive/ 前缀）同样拦得住。
const RETIRED_DOC_RE = /(?<![\w-])`?changelog(?:-2026-08)?\.md`?/;
for (const [file, p] of allDocs) {
  readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (RETIRED_DOC_RE.test(line)) {
      hardFails.push({ file: relative(ROOT, p), line: i + 1, ref: line.trim().slice(0, 48), why: '引用已退役的 changelog 账本（主文件 / 2026-08 分卷均已退役）——变更史见 docs/changes/' });
    }
  });
}

console.log('\n══════════════ 文档引用守门扫描结果 ══════════════\n');
if (hardFails.length) {
  console.log(`① 引用断链 / 资源路径失效 / 计数型复述  ❌ 硬失败 —— ${hardFails.length} 处`);
  for (const x of hardFails) console.log(`   ${x.file}:${x.line}  «${x.ref}» — ${x.why}`);
} else {
  console.log('① 引用断链 / 资源路径失效 / 计数型复述  ✅ 通过 —— 0 处');
}
if (reviews.length) {
  console.log(`② 无法判定（需人工确认）  ⚠️ —— ${reviews.length} 处`);
  for (const x of reviews) console.log(`   ${x.file}:${x.line}  «${x.ref}» — ${x.why}`);
} else {
  console.log('② 无法判定（需人工确认）  ✅ 无');
}
console.log('\n────────────────────────────────────────────\n');
if (hardFails.length) {
  console.log('❌ 存在失效引用。修复后重跑本脚本，全部通过才能声明「文档对齐」。');
  process.exit(1);
}
console.log('✅ 文档引用与结构扫描通过。');

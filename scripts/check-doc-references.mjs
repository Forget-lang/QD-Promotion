#!/usr/bin/env node
/**
 * check-doc-references.mjs —— 文档引用守门脚本
 *
 * 用途：改完任何权威文档后运行，自动验证「文件名/章节名」引用是否失效（防残留旧方案、防引用断链）。
 * 用法（项目根运行）：
 *   node scripts/check-doc-references.mjs
 *
 * 检查内容：
 *   1. 文档间文件名引用（如 `workflow/pipeline.md`、`R2-业务流程.md`）→ 被引文件必须是注册文档（docs/internal/ + workflow/ + AGENTS.md + 战略简报）
 *   2. 章节引用（如 §2.9、§布局模式库、§5.9.7）→ 解析到被引文档（§ 前最近出现的文档名；无则视为本文档自引用）并验证锚点存在
 *   3. 归档注记（如「原 13 §5.9」）与反例代码块 → 跳过，不误报
 *
 * 规则：失效引用 = 硬失败（exit 1）。无法判定归属的章节引用记入「需人工确认」，不算硬失败。
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = JSON.parse(readFileSync(join(__dirname, 'ref-registry.json'), 'utf8'));

// ── 1. 收集权威文档 ──
const docsDir = join(ROOT, REGISTRY.docsDir);
const docFiles = readdirSync(docsDir).filter((f) => f.endsWith('.md') && !f.startsWith('.'));
const allDocs = new Map(); // 文件名 → 绝对路径
for (const f of docFiles) allDocs.set(f, join(docsDir, f));
for (const f of REGISTRY.extraDocs || []) {
  const p = join(ROOT, f);
  if (existsSync(p)) allDocs.set(f, p);
}

// 别名（M1/R1/AGENTS…）→ 文件名；含 .md 与不含 .md 两种写法
const aliasMap = new Map();
for (const [alias, file] of Object.entries(REGISTRY.aliases || {})) {
  aliasMap.set(alias, file);
  aliasMap.set(alias + '.md', file);
}
for (const file of allDocs.keys()) {
  aliasMap.set(file, file);
  aliasMap.set(file.replace(/\.md$/, ''), file);
}

// ── 2. 提取章节锚点 ──
function extractAnchors(filePath) {
  const anchors = [];
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (!m) continue;
    const raw = m[2].replace(/`/g, '');
    const numM = raw.match(/^(\d+(?:\.\d+)*)[\s·\-—]*([^\s].*)?$/);
    anchors.push({
      raw,
      num: numM ? numM[1] : null,
      name: numM ? (numM[2] || '').trim() : raw.trim(),
    });
  }
  return anchors;
}
const anchorsByFile = new Map();
for (const [file, path] of allDocs) anchorsByFile.set(file, extractAnchors(path));

// ── 3. 扫描 ──
const hardFails = [];
const reviews = [];

// 文件名引用正则：从注册文档动态构建（全路径与基名都可识别，长名优先）
const docNames = [...allDocs.keys()].flatMap((k) => [k, k.split('/').pop()]);
for (const v of Object.values(REGISTRY.aliases || {})) docNames.push(v, v.split('/').pop());
const uniqNames = [...new Set(docNames)].filter(Boolean).sort((a, b) => b.length - a.length);
const nameAlt = uniqNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const fileRefRe = new RegExp('`?(' + nameAlt + ')`?', 'g');
// 旧编号文档名（M1-/R5-/00-…/素材索引表）：未注册 = 已归档，命中即报断链
const legacyRefRe = /`?((?:[A-Z]\d|\d{2})-[^`\s，。；：、()（）"']+\.md|素材索引表\.md)`?/g;
// 08-27 审计补：无 .md 后缀的旧文档「编号-名称」引用（如 M1-内容策划手册 / R5-内容红线）同样算断链
const legacyNameRe = /\b(?:M[123]|R[0145])-(?:内容策划手册|视频制作手册|平台发布手册|业务深度图谱|产品事实表|最佳实践库|内容红线)/g;
// 迁移溯源注记行（迁入/迁移合并/原文存档/存档可查）与「最后校验」头部：属历史说明，不算引用
const provenanceRe = /迁入|迁移合并|原文存档|存档可查|最后校验/;
// 别名引用（AGENTS/R2/R3/pipeline/craft 等，不带 .md）
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
    if (inCodeBlock) return; // 代码块内不检查（含反例）

    // 行内所有文档引用（文件名/别名），记录位置
    const docHits = [];
    let m;
    fileRefRe.lastIndex = 0;
    while ((m = fileRefRe.exec(line)) !== null) {
      const name = allDocs.has(m[1]) ? m[1] : [...allDocs.keys()].find((k) => k === m[1] || k.split('/').pop() === m[1]);
      if (name) docHits.push({ idx: m.index, file: name });
    }
    legacyRefRe.lastIndex = 0;
    while ((m = legacyRefRe.exec(line)) !== null) {
      if (!allDocs.has(m[1])) {
        hardFails.push({ file: rel, line: lineNo, ref: m[1], why: '被引文档不存在（旧手册已清理删除，原文在 git 历史；请改指 spec/ 或 workflow/ 新真源）' });
      }
    }
    if (!provenanceRe.test(line)) {
      legacyNameRe.lastIndex = 0;
      while ((m = legacyNameRe.exec(line)) !== null) {
        hardFails.push({ file: rel, line: lineNo, ref: m[0], why: '引用已归档旧文档（编号-名称形态，无 .md 也断链；请改指 spec/ 或 workflow/ 新真源）' });
      }
    }
    if (aliasRe) {
      aliasRe.lastIndex = 0;
      while ((m = aliasRe.exec(line)) !== null) {
        const file2 = aliasMap.get(m[1]);
        if (file2) docHits.push({ idx: m.index + 1, file: file2 });
      }
    }
    docHits.sort((a, b) => a.idx - b.idx);

    // 归档注记模式：「原 13 §x」「原 07-渠道与执行 §3」——跳过；「最后校验」头部溯源行——跳过
    const isArchivalNote = /(?:原\s*[^，。；：]*|(?:0\d|1[0-4])-[^，。；：]*)\s*§/.test(line) || /最后校验/.test(line);
    // 反例/规则说明行（举例"错"或"禁止/不使用"）——跳过章节引用检查
    const isCounterExample = /(❌|错：|禁止|不使用|不重复|不用「)/.test(line);

    if (!isArchivalNote && !isCounterExample) {
      // 章节引用
      const secRe = /§([0-9]+(?:\.[0-9]+)*|[^§\s，。；：、）)」』"]+)/g;
      while ((m = secRe.exec(line)) !== null) {
        const sec = m[1].replace(/[/"'，。]+$/, '');
        // 占位符（§x.y 含字母）跳过
        if (/[a-zA-Z]/.test(sec)) continue;
        // 找 § 前最近的行内文档引用
        let target = null;
        for (const d of docHits) {
          if (d.idx < m.index) target = d.file;
          else break;
        }
        const self = target === null; // 无前文文档 → 本文档自引用
        const doc = target || file;
        if (!anchorsByFile.has(doc)) {
          reviews.push({ file: rel, line: lineNo, ref: `§${sec}`, why: `无法判定被引文档（§${sec} 前未识别到文档名）` });
          continue;
        }
        const anchors = anchorsByFile.get(doc);
        const isNum = /^\d/.test(sec);
        const hit = anchors.some((a) =>
          isNum ? (a.num === sec || (a.num && a.num.startsWith(sec + '.'))) : (a.raw.includes(sec) || (a.name && a.name.includes(sec)))
        );
        if (!hit) {
          hardFails.push({ file: rel, line: lineNo, ref: `§${sec}`, why: `在 ${self ? '本文档' : doc} 中找不到章节「§${sec}」` });
        }
      }
    }
  });
}

// ── 3.5 计数/旧号扫描（防纯文字计数漂移与"锚点仍在、语义已变"；ref-registry.json counts 登记） ──
const countFails = [];
const countInfo = [];
for (const item of REGISTRY.counts || []) {
  const srcPath = allDocs.get(item.source.file) || join(ROOT, item.source.file);
  let srcLines = readFileSync(srcPath, 'utf8').split('\n');
  if (item.source.from || item.source.to) {
    const start = item.source.from ? srcLines.findIndex((l) => l.startsWith('#') && l.includes(item.source.from)) : 0;
    const end = item.source.to ? srcLines.findIndex((l, i) => i > start && l.startsWith('#') && l.includes(item.source.to)) : -1;
    srcLines = srcLines.slice(start === -1 ? 0 : start, end === -1 ? srcLines.length : end);
  }
  const srcRe = new RegExp(item.source.regex);
  const actual = srcLines.filter((l) => srcRe.test(l)).length;
  countInfo.push(`${item.name} 真源实际 ${actual}（${item.source.file}）`);
  for (const file of allDocs.keys()) {
    const lines = readFileSync(allDocs.get(file), 'utf8').split('\n');
    for (const claim of item.claims || []) {
      const cre = new RegExp(claim.regex, 'g');
      lines.forEach((line, i) => {
        let m;
        cre.lastIndex = 0;
        while ((m = cre.exec(line)) !== null) {
          const claimed = Number(m[1]);
          if (claimed !== actual) {
            countFails.push({ file: relative(ROOT, allDocs.get(file)), line: i + 1, ref: `${item.name}/${claim.label}`, why: `声称 ${claimed}，真源实际 ${actual}（${item.source.file}）` });
          }
        }
      });
    }
    for (const pat of item.stale || []) {
      const sre = new RegExp(pat);
      lines.forEach((line, i) => {
        if (sre.test(line)) {
          countFails.push({ file: relative(ROOT, allDocs.get(file)), line: i + 1, ref: pat, why: `命中已淘汰旧值「${pat}」（${item.name} 现为 ${actual}）` });
        }
      });
    }
  }
}

// ── 4. 输出 ──
const distinctHard = [...new Map(hardFails.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
const distinctRev = [...new Map(reviews.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
const distinctCount = [...new Map(countFails.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
console.log('\n══════════════ 文档引用守门扫描结果 ════════════\n');
console.log(`① 文件/章节引用失效  ${distinctHard.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— ${distinctHard.length} 处`);
for (const h of distinctHard) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log(`② 无法判定（需人工确认）  ${distinctRev.length === 0 ? '✅ 无' : '⚠️ ' + distinctRev.length + ' 处'}`);
for (const h of distinctRev) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log(`③ 计数/旧号扫描  ${distinctCount.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— ${distinctCount.length} 处`);
for (const info of countInfo) console.log(`   · ${info}`);
for (const h of distinctCount) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log('\n────────────────────────────────────────────');
if (distinctHard.length > 0 || distinctCount.length > 0) {
  console.log('❌ 存在失效引用或计数漂移。修复后重跑本脚本，全部通过才能声明「文档对齐」。\n');
  process.exit(1);
} else {
  console.log('✅ 文档引用检查通过（失效引用 0 处、计数漂移 0 处）。\n');
  process.exit(0);
}

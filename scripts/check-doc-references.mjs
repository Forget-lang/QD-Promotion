#!/usr/bin/env node
/**
 * check-doc-references.mjs —— 文档引用守门脚本
 *
 * 用途：改完任何权威文档后运行，自动验证「文件名/章节名」引用是否失效（防残留旧方案、防引用断链）。
 * 用法（项目根运行）：
 *   node scripts/check-doc-references.mjs
 *
 * 检查内容：
 *   1. 文档间文件名引用（如 `R1-产品事实表.md`、`M2-视频制作手册.md`）→ 被引文件必须存在于 docs/internal/
 *   2. 章节引用（如 §2.9、§布局模式库、§5.9.7）→ 解析到被引文档（§ 前最近出现的文档名；无则视为本文档自引用）并验证锚点存在
 *   3. 归档注记（如「原 13 §5.9」）与反例代码块 → 跳过，不误报
 *
 * 规则：失效引用 = 硬失败（exit 1）。无法判定归属的章节引用记入「需人工确认」，不算硬失败。
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
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

for (const [file, path] of allDocs) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const rel = file === 'AGENTS.md' ? file : `${REGISTRY.docsDir}/${file}`;
  let inCodeBlock = false;

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return; // 代码块内不检查（含反例）

    // 行内所有文档引用（文件名/别名），记录位置
    const docHits = [];
    const fileRefRe = /`?([A-Z]\d-[^`\s，。；：、()（）"']+\.md|AGENTS\.md)`?/g;
    let m;
    while ((m = fileRefRe.exec(line)) !== null) {
      const name = m[1];
      if (!allDocs.has(name)) {
        hardFails.push({ file: rel, line: lineNo, ref: name, why: '被引文档不存在（docs/internal/ 中无此文件，或已归档）' });
      } else {
        docHits.push({ idx: m.index, file: name });
      }
    }
    // 别名引用（M1/R1 等，不带 .md）
    const aliasRe = /(?:^|[^A-Za-z0-9])(M[123]|R[1-5]|AGENTS)(?:[^A-Za-z0-9]|$)/g;
    while ((m = aliasRe.exec(line)) !== null) {
      const file = aliasMap.get(m[1]);
      if (file) docHits.push({ idx: m.index + 1, file });
    }

    // 归档注记模式：「原 13 §x」「原 07-渠道与执行 §3」「13-Remotion技术规范 §5.9」——跳过
    const isArchivalNote = /(?:原\s*[^，。；：]*|(?:0\d|1[0-4])-[^，。；：]*)\s*§/.test(line);
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

// ── 4. 输出 ──
const distinctHard = [...new Map(hardFails.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
const distinctRev = [...new Map(reviews.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
console.log('\n══════════════ 文档引用守门扫描结果 ════════════\n');
console.log(`① 文件/章节引用失效  ${distinctHard.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— ${distinctHard.length} 处`);
for (const h of distinctHard) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log(`② 无法判定（需人工确认）  ${distinctRev.length === 0 ? '✅ 无' : '⚠️ ' + distinctRev.length + ' 处'}`);
for (const h of distinctRev) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log('\n────────────────────────────────────────────');
if (distinctHard.length > 0) {
  console.log('❌ 存在失效引用。修复后重跑本脚本，全部通过才能声明「文档对齐」。\n');
  process.exit(1);
} else {
  console.log('✅ 文档引用检查通过（失效引用 0 处）。\n');
  process.exit(0);
}

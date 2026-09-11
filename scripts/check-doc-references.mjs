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
// 别名引用（AGENTS/R2/R3/R6/SKILL 等，不带 .md）
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
      if (m[1].includes('归档')) continue; // 指向 outputs/archive/ 的溯源路径合法，不算断链
      if (/`outputs\/[^`]*$/.test(line.slice(0, m.index))) continue; // outputs/ 反引号路径内的每片工件名（00-系列规划.md 等）归 3.5 资源路径检查管，不算旧手册引用
      if (!allDocs.has(m[1])) {
        hardFails.push({ file: rel, line: lineNo, ref: m[1], why: '被引文档不存在（旧手册已清理删除，原文在 git 历史；请改指 spec/ 或 SKILL 新真源）' });
      }
    }
    if (!provenanceRe.test(line)) {
      legacyNameRe.lastIndex = 0;
      while ((m = legacyNameRe.exec(line)) !== null) {
        hardFails.push({ file: rel, line: lineNo, ref: m[0], why: '引用已归档旧文档（编号-名称形态，无 .md 也断链；请改指 spec/ 或 SKILL 新真源）' });
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
    // 2026-08-30 修：移除"不重复"——它把 R6 头部导航行整行豁免，藏住了 craft §8 死指路
    const isCounterExample = /(❌|错：|禁止|不使用|不用「)/.test(line);

    if (!isArchivalNote && !isCounterExample) {
      // 章节引用
      const secRe = /§([0-9]+(?:\.[0-9]+)*|[^§\s，。；：、（）)」』"`]+)/g; // 2026-09-02 补：（ 与反引号入排除集，防「§二（第 7 步）」「§三`」式吞字
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

// ── 3.5 资源路径存在性（反引号内指向仓库真实文件/目录的路径，防挪动/改名后文档指路失效——2026-08-29 锚图散位教训的机检化）──
const RES_ROOTS = ['outputs/', 'spec/', 'docs/', 'scripts/', 'video/', '背景素材/', '插图库/', '图标素材/', '截图素材/', '商用字体/'];
const placeholderRe = /(XX|NN|\*|\||~|…|\.\.|node_modules|\{[^}]*\})/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    // 2026-08-30 修：删除"整行含'已删除/git 历史'即跳过"的豁免——负向测试证实该洞可让真断链隐身。
    // 历史溯源行靠占位符规则与 RES_ROOTS 前缀白名单天然豁免，无需整行豁免。
    let bm;
    const btRe = /`([^`\s]+)`/g;
    while ((bm = btRe.exec(line)) !== null) {
      const raw = bm[1].replace(/[，。、）)"'：;]+$/, '');
      // 2026-08-30 修：带 promotion/ 前缀的写法也要查（旧版前缀不在白名单 = 永不查）
      const tok = raw.startsWith('promotion/') ? raw.slice('promotion/'.length) : raw;
      if (!RES_ROOTS.some((r) => tok.startsWith(r))) continue;
      if (placeholderRe.test(tok)) continue;
      const p = join(ROOT, tok);
      if (!existsSync(p)) {
        hardFails.push({ file: rel, line: i + 1, ref: raw, why: '文档指路的资源路径在磁盘上不存在（挪动/改名后未同步）' });
      }
    }
  });
}

// ── 3.6 计数型复述（2026-08-30 实证教训：闸门增减时文档里的条数复述必然漏改——新增 check-ui-truth 后，AGENTS/SKILL/AI使用手册/启动提示词共 6 处"五闸门 / 5/6 绿"当场过期。人不知道要改哪几份，所以直接禁掉复述）──
const GATE_LABELS = ['红线', '文档引用', '事实', '相似度', '效果尺子', '上屏真实性', '布局指纹', '背景底', '口播纪律'];
// 2026-08-31 补：检查层数复述（「四层机检」）与闸门条数同病——层数一变必漏改（check-ui-truth 已五层而文档仍写四层即活例）。
// 注：「第③层机检」这类指向具体某层的注记不命中（③ 不在数字字符类），只有数量断言才被禁。
const countRe = /[0-9一二两三四五六七八九十]+\s*(?:大|条|个)?闸门|(?:闸门|检查项)[^。\n]{0,4}[0-9一二三四五六七八九十]+\s*项|\b\d\s*\/\s*\d\s*(?:绿|通过)|[0-9一二两三四五六七八九十]+\s*层\s*(?:机检|机验|检查)/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (countRe.test(line)) {
      hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '复述了闸门条数/检查层数：增减时必然漏改，改成"以脚本输出为准"' });
    }
    const named = GATE_LABELS.filter((g) => line.includes(g)).length;
    if (named >= 3 && line.includes('闸门')) {
      hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '逐项列出了闸门清单：同样会过期，改成指向脚本输出' });
    }
  });
}

// ── 3.7 文档宪法层（2026-09-01 用户拍板，条文见 `AGENTS.md` §二「文档宪法」）──
// 铁律一：改动史只住 changelog——规则文档正文出现「第N轮 / R1x」式审计轮次叙事 = 硬失败；含"changelog"的指针行豁免。
// 铁律二：校验戳只写日期与指针——「最后校验/更新/版本」起始行超 120 字符 = 戳里塞了改动摘要，硬失败。
// 扫描面：注册文档（allDocs）+ spec/*.json（机器表同样禁嵌叙事）。
const stampRe = /^>?\s*(最后校验|更新|版本)\s*[：:]/;
const histRe = /第[一二三四五六七八九十0-9]{1,3}轮|\bR1[0-9]\b/;
const constitutionScan = (rel, text) => {
  let inCodeBlock = false;
  text.split('\n').forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (stampRe.test(line) && line.length > 120) {
      hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '宪法铁律二：校验戳超 120 字——戳内复述改动摘要，改为「日期（变更史见 changelog）」' });
    }
    if (histRe.test(line) && !/changelog/.test(line)) {
      hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: '宪法铁律一：正文写了审计轮次叙事——改动史归 changelog，此处只留规则 +「详见 changelog」指针' });
    }
  });
};
for (const [, p] of allDocs) constitutionScan(relative(ROOT, p), readFileSync(p, 'utf8'));
{
  const specDir = join(ROOT, 'spec');
  for (const jf of readdirSync(specDir).filter((n) => n.endsWith('.json'))) {
    constitutionScan(`spec/${jf}`, readFileSync(join(specDir, jf), 'utf8'));
  }
}

// ── 3.8 口径唯一性（2026-09-02 用户拍板：高危口径只许一个属主，属主外复述数值 = 硬失败。
// 注册表 ref-registry.json caliberOwners：pattern（数值特征）+ owner（属主文件名）+ desc。
// 设计：模式只匹配「数值本体」（带比较符/单位），指针行（"见 SKILL"不含数值）天然不命中；
// changelog 不在扫描面（历史留痕）；仅反例行（❌/错：/禁止/不使用）豁免——「已废止」注记带数值同样算复述
//（宪法写法是「旧法已废止，详见 changelog」，不带数值）。踩一次漂移坑加一条，不建口径大全。──
const caliberOwners = REGISTRY.caliberOwners || [];
const caliberExemptRe = /(❌|错：|禁止|不使用)/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (caliberExemptRe.test(line)) return;
    for (const c of caliberOwners) {
      if (file === c.owner) continue;
      if (new RegExp(c.pattern).test(line)) {
        hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: `口径唯一性：复述了「${c.desc}」，属主是 ${c.owner}——改指针不抄数值` });
      }
    }
  });
}

// ── 3.9 废弃话头（2026-09-09 用户拍板：替代型决策须同轮清旧；正文命中被替代旧话头 = 硬失败，防新旧口径并存误导新会话）──
const deprecatedTerms = REGISTRY.deprecatedTerms || [];
const depExemptRe = /(替代|取代|废止|旧法|反例|❌|错：|禁止|不使用)/;
for (const [file, path] of allDocs) {
  const rel = relative(ROOT, path);
  const lines = readFileSync(path, 'utf8').split('\n');
  let inCodeBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock) return;
    if (depExemptRe.test(line)) return;
    for (const d of deprecatedTerms) {
      if (line.includes(d.term)) {
        hardFails.push({ file: rel, line: i + 1, ref: line.trim().slice(0, 48), why: `废弃话头残留：「${d.desc}」——新口径已定，清掉旧表述` });
      }
    }
  });
}

// ── 4. 输出 ──
const distinctHard = [...new Map(hardFails.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
const distinctRev = [...new Map(reviews.map((h) => [`${h.file}:${h.line}:${h.ref}`, h])).values()];
console.log('\n══════════════ 文档引用守门扫描结果 ════════════\n');
console.log(`① 引用断链 / 资源路径失效 / 计数型复述  ${distinctHard.length === 0 ? '✅ 通过' : '❌ 硬失败'} —— ${distinctHard.length} 处`);
for (const h of distinctHard) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log(`② 无法判定（需人工确认）  ${distinctRev.length === 0 ? '✅ 无' : '⚠️ ' + distinctRev.length + ' 处'}`);
for (const h of distinctRev) console.log(`   ${h.file}:${h.line}  «${h.ref}» — ${h.why}`);
console.log('\n────────────────────────────────────────────');
if (distinctHard.length > 0) {
  console.log('❌ 存在失效引用。修复后重跑本脚本，全部通过才能声明「文档对齐」。\n');
  process.exit(1);
} else {
  console.log('✅ 文档引用 / 计数复述 / 宪法层检查通过（失效引用 0 处）。\n');
  process.exit(0);
}

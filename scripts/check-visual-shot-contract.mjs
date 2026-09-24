#!/usr/bin/env node
/**
 * R9 visual shot contract gate.
 * Validates every `08-R9视觉决策卡.md` companion ledger under outputs.
 * The purpose is to prevent a storyboard from jumping directly from VO/text
 * into Remotion without Visual Metaphor + Peak Frame + State Change decisions.
 *
 * 导演稿接线（CHANGE-20260924-047 批 1；依据 R9 §十五）：
 *   凡**声明了 `styleId`** 的片（039 新架构下的片），其决策卡必须含「导演稿」节——
 *   节内须逐项含 叙事结构／观看动力／悬念／转折／情绪曲线／信息释放顺序 六项判据关键词，并声明 `styleId`。
 *   未声明 `styleId` 的片＝g06–g11 历史片，按旧口径**跳过、不回溯**；尚无新架构片时输出"接线就位、待首片"。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputs = path.join(root, 'outputs');
const requiredColumns = ['Shot', 'Visual Subject', 'Visual Metaphor', 'Peak Frame', 'State Change', 'Exit'];
const DIRECTOR_ITEMS = ['叙事结构', '观看动力', '悬念', '转折', '情绪曲线', '信息释放顺序'];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name === '08-R9视觉决策卡.md') out.push(p);
  }
  return out;
}

/** 该片是否声明了 styleId（扫同目录 md；新架构片的判据） */
function pieceDeclaresStyleId(file) {
  const dir = path.dirname(file);
  let names = [];
  try { names = fs.readdirSync(dir); } catch { return false; }
  for (const n of names) {
    if (!n.endsWith('.md')) continue;
    try { if (/styleId/.test(fs.readFileSync(path.join(dir, n), 'utf8'))) return true; } catch { /* 忽略不可读 */ }
  }
  return false;
}

/** 取「导演稿」节正文（从其标题到下一个同级或更高级标题） */
function directorSection(text) {
  const lines = text.split('\n');
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s*(.+)$/);
    if (m && /导演稿/.test(m[2])) { start = i; level = m[1].length; break; }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s*/);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n');
}

const files = walk(outputs);
if (!files.length) {
  console.log('VISUAL-SHOT-CONTRACT PASS: no R9 visual decision ledgers found.（空转提示：本闸门当前没有检查对象——若这非预期，说明 R9 视觉决策台账缺失）');
  process.exit(0);
}

let errors = 0;
let newArch = 0;
let legacy = 0;
for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  const tableHead = text.split('\n').find((line) => line.startsWith('| Shot |')) || '';
  for (const col of requiredColumns) {
    if (!tableHead.includes(col)) {
      errors += 1;
      console.error(`${rel}: missing ${col}`);
    }
  }
  const rows = text.split('\n').filter((line) => /^\| S\d+-\d+ \|/.test(line));
  if (!rows.length) {
    errors += 1;
    console.error(`${rel}: no Shot rows found`);
  } else {
    for (const row of rows) {
      const cells = row.split('|').slice(1, -1).map((x) => x.trim());
      if (cells.length < requiredColumns.length || cells.slice(1, 6).some((x) => !x || x === '—' || x === '-')) {
        errors += 1;
        console.error(`${rel}: incomplete visual decision row: ${row}`);
      }
    }
  }

  // ── 导演稿接线（批 1）──
  if (!pieceDeclaresStyleId(file)) { legacy += 1; continue; }
  newArch += 1;
  const sec = directorSection(text);
  if (!sec) {
    errors += 1;
    console.error(`${rel}: 本片声明了 styleId，但决策卡缺「导演稿」节（R9 §十五：逐片《导演稿》落本卡，含六项判据＋styleId）`);
    continue;
  }
  const miss = DIRECTOR_ITEMS.filter((k) => !sec.includes(k));
  if (miss.length) {
    errors += 1;
    console.error(`${rel}: 导演稿节缺判据关键词 —— ${miss.join('、')}`);
  }
  if (!/styleId/.test(sec)) {
    errors += 1;
    console.error(`${rel}: 导演稿节未声明 styleId（本片所选风格包）`);
  }
}

if (errors) {
  console.error(`VISUAL-SHOT-CONTRACT FAIL: ${errors} issue(s)`);
  process.exit(1);
}
console.log(
  `VISUAL-SHOT-CONTRACT PASS: checked ${files.length} R9 ledger(s).` +
    (newArch ? `（新架构片 ${newArch}：含导演稿节校验）` : '（接线就位：尚无声明 styleId 的片，待首个新架构片）') +
    (legacy ? `｜历史片跳过 ${legacy}（无 styleId，按旧口径不回溯）` : ''),
);

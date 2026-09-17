#!/usr/bin/env node
/**
 * R9 visual shot contract gate.
 * Validates every `08-R9视觉决策卡.md` companion ledger under outputs.
 * The purpose is to prevent a storyboard from jumping directly from VO/text
 * into Remotion without Visual Metaphor + Peak Frame + State Change decisions.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputs = path.join(root, 'outputs');
const requiredColumns = ['Shot', 'Visual Subject', 'Visual Metaphor', 'Peak Frame', 'State Change', 'Exit'];

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

const files = walk(outputs);
if (!files.length) {
  console.log('VISUAL-SHOT-CONTRACT PASS: no R9 visual decision ledgers found.（空转提示：本闸门当前没有检查对象——若这非预期，说明 R9 视觉决策台账缺失）');
  process.exit(0);
}

let errors = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const tableHead = text.split('\n').find((line) => line.startsWith('| Shot |')) || '';
  for (const col of requiredColumns) {
    if (!tableHead.includes(col)) {
      errors += 1;
      console.error(`${path.relative(root, file)}: missing ${col}`);
    }
  }
  const rows = text.split('\n').filter((line) => /^\| S\d+-\d+ \|/.test(line));
  if (!rows.length) {
    errors += 1;
    console.error(`${path.relative(root, file)}: no Shot rows found`);
    continue;
  }
  for (const row of rows) {
    const cells = row.split('|').slice(1, -1).map((x) => x.trim());
    if (cells.length < requiredColumns.length || cells.slice(1, 6).some((x) => !x || x === '—' || x === '-')) {
      errors += 1;
      console.error(`${path.relative(root, file)}: incomplete visual decision row: ${row}`);
    }
  }
}

if (errors) {
  console.error(`VISUAL-SHOT-CONTRACT FAIL: ${errors} issue(s)`);
  process.exit(1);
}
console.log(`VISUAL-SHOT-CONTRACT PASS: checked ${files.length} R9 ledger(s).`);

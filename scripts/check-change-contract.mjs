#!/usr/bin/env node
/**
 * Change Contract gate.
 *
 * Purpose: prevent a global change from being declared complete while its
 * migration contract is incomplete. This check is intentionally structural;
 * semantic review and real-frame review remain separate gates.
 *
 * Important: section numbers are presentation, not identity. Governance
 * sections may be inserted without invalidating the contract shape.
 * Fresh verification marker: 2026-09-16.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const changesDir = path.join(root, 'docs', 'changes');
const activeDir = path.join(changesDir, 'active');
const closedDir = path.join(changesDir, 'closed');

const requiredHeadingNames = [
  '基本信息', 'Goal', '新口径 New Policy', 'Replace', 'Remove', 'Preserve',
  'Impact Map', 'Migration Plan', 'Mechanical Checks',
  'Negative / Semantic Counterexample', 'Real Output Verification', 'Closure Report',
];

const allowedStates = new Set(['PROPOSED', 'APPROVED', 'MIGRATING', 'VERIFYING', 'CLOSED']);

function fail(message) {
  console.error(`CHANGE-CONTRACT FAIL: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(changesDir)) {
  console.log('CHANGE-CONTRACT PASS: no change directory.');
  process.exit(0);
}

const rootTransactionFiles = fs.readdirSync(changesDir).filter((name) => /^CHANGE-.*\.md$/.test(name));
let errors = 0;
for (const file of rootTransactionFiles) {
  errors += 1;
  console.error(`docs/changes/${file}: change transaction must live under active/ or closed/`);
}

function listTransactions(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.md') && name !== 'template.md')
    .sort();
}

const activeFiles = listTransactions(activeDir);
const closedFiles = listTransactions(closedDir);
const transactions = [
  ...activeFiles.map((file) => ({ file, dir: activeDir, state: 'active' })),
  ...closedFiles.map((file) => ({ file, dir: closedDir, state: 'closed' })),
];

if (transactions.length === 0 && rootTransactionFiles.length === 0) {
  console.log('CHANGE-CONTRACT PASS: no change transactions.');
  process.exit(0);
}

for (const transaction of transactions) {
  const fullPath = path.join(transaction.dir, transaction.file);
  const text = fs.readFileSync(fullPath, 'utf8');
  const location = `${transaction.state}/${transaction.file}`;

  for (const headingName of requiredHeadingNames) {
    const escaped = headingName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingRe = new RegExp(`^##\\s+(?:[^\\s、]+、)?${escaped}\\s*$`, 'm');
    if (!headingRe.test(text)) {
      errors += 1;
      console.error(`${location}: missing heading ${headingName}`);
    }
  }

  const statusMatch = text.match(/- 状态：`([^`]+)`/);
  if (!statusMatch) {
    errors += 1;
    console.error(`${location}: missing status`);
  } else if (!allowedStates.has(statusMatch[1])) {
    errors += 1;
    console.error(`${location}: invalid status ${statusMatch[1]}`);
  } else if (transaction.state === 'active' && statusMatch[1] === 'CLOSED') {
    errors += 1;
    console.error(`${location}: active transaction cannot have CLOSED status`);
  } else if (transaction.state === 'closed' && statusMatch[1] !== 'CLOSED') {
    errors += 1;
    console.error(`${location}: closed transaction must have CLOSED status`);
  }

  const impactMatch = text.match(/^##\s+(?:[^\s、]+、)?Impact Map\s*$/m);
  const impactStart = impactMatch ? impactMatch.index + impactMatch[0].length : -1;
  const impactTail = impactStart >= 0 ? text.slice(impactStart) : '';
  const nextHeadingIndex = impactTail.search(/^##\s+/m);
  const impactBody = nextHeadingIndex >= 0 ? impactTail.slice(0, nextHeadingIndex) : impactTail;
  const pendingImpactRows = impactBody.split('\n')
    .filter((line) => line.trim().startsWith('|') && /\|\s*\*{0,2}PENDING\*{0,2}\s*\|\s*$/.test(line));
  if (pendingImpactRows.length) {
    errors += pendingImpactRows.length;
    console.error(`${location}: impact map still contains ${pendingImpactRows.length} PENDING row(s)`);
  }

  if (/\*\*结论：CLOSED\*\*/.test(text)) {
    const mustPass = ['旧口径扫描：PASS', '机械检查：PASS', '负向测试：PASS', '语义反例：PASS', '本次新增红：0'];
    for (const marker of mustPass) {
      if (!text.includes(marker)) {
        errors += 1;
        console.error(`${location}: CLOSED but missing ${marker}`);
      }
    }
    if (!/- 状态：`CLOSED`/.test(text)) {
      errors += 1;
      console.error(`${location}: conclusion is CLOSED but status is not CLOSED`);
    }
  }
}

if (errors > 0) {
  fail(`${errors} structural issue(s)`);
} else {
  console.log(`CHANGE-CONTRACT PASS: checked ${transactions.length} transaction(s).`);
}

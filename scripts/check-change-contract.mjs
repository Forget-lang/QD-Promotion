#!/usr/bin/env node
/**
 * Change Contract gate.
 *
 * Purpose: prevent a global change from being declared complete while its
 * migration contract is incomplete. This check is intentionally structural;
 * semantic review and real-frame review remain separate gates.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const activeDir = path.join(root, 'docs', 'changes', 'active');

const requiredHeadings = [
  '## 一、基本信息',
  '## 二、Goal',
  '## 三、新口径 New Policy',
  '## 四、Replace',
  '## 五、Remove',
  '## 六、Preserve',
  '## 七、Impact Map',
  '## 八、Migration Plan',
  '## 九、Mechanical Checks',
  '## 十、Negative / Semantic Counterexample',
  '## 十一、Real Output Verification',
  '## 十二、Closure Report',
];

const allowedStates = new Set(['PROPOSED', 'APPROVED', 'MIGRATING', 'VERIFYING', 'CLOSED']);

function fail(message) {
  console.error(`CHANGE-CONTRACT FAIL: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(activeDir)) {
  console.log('CHANGE-CONTRACT PASS: no active change transactions.');
  process.exit(0);
}

const files = fs
  .readdirSync(activeDir)
  .filter((name) => name.endsWith('.md') && name !== 'template.md')
  .sort();

if (files.length === 0) {
  console.log('CHANGE-CONTRACT PASS: no active change transactions.');
  process.exit(0);
}

let errors = 0;
for (const file of files) {
  const fullPath = path.join(activeDir, file);
  const text = fs.readFileSync(fullPath, 'utf8');

  for (const heading of requiredHeadings) {
    if (!text.includes(heading)) {
      errors += 1;
      console.error(`${file}: missing ${heading}`);
    }
  }

  const statusMatch = text.match(/- 状态：`([^`]+)`/);
  if (!statusMatch) {
    errors += 1;
    console.error(`${file}: missing status`);
  } else if (!allowedStates.has(statusMatch[1])) {
    errors += 1;
    console.error(`${file}: invalid status ${statusMatch[1]}`);
  }

  const impactSection = text.match(/## 七、Impact Map([\s\S]*?)(?=\n## 八、|$)/)?.[1] ?? '';
  const pendingImpactRows = impactSection
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && /\|\s*PENDING\s*\|\s*$/.test(line));
  if (pendingImpactRows.length) {
    errors += pendingImpactRows.length;
    console.error(`${file}: impact map still contains ${pendingImpactRows.length} PENDING row(s)`);
  }

  if (/\*\*结论：CLOSED\*\*/.test(text)) {
    const mustPass = ['旧口径扫描：PASS', '机械检查：PASS', '负向测试：PASS', '语义反例：PASS', '本次新增红：0'];
    for (const marker of mustPass) {
      if (!text.includes(marker)) {
        errors += 1;
        console.error(`${file}: CLOSED but missing ${marker}`);
      }
    }
    if (!/- 状态：`CLOSED`/.test(text)) {
      errors += 1;
      console.error(`${file}: conclusion is CLOSED but status is not CLOSED`);
    }
  }
}

if (errors > 0) {
  fail(`${errors} structural issue(s)`);
} else {
  console.log(`CHANGE-CONTRACT PASS: checked ${files.length} active transaction(s).`);
}

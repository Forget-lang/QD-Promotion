#!/usr/bin/env node
/**
 * Negative test for check-change-contract.mjs.
 * Creates one intentionally incomplete transaction containing both plain and
 * bold PENDING Impact Map rows, proving the gate rejects both spellings.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check-change-contract.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-change-contract-'));
const activeDir = path.join(tempRoot, 'docs', 'changes', 'active');
fs.mkdirSync(activeDir, { recursive: true });

const headings = `# Change Contract\n\n## 一、基本信息\n- 状态：\`MIGRATING\`\n\n## 二、Goal\n- test\n## 三、新口径 New Policy\n- test\n## 四、Replace\n- test\n## 五、Remove\n- test\n## 六、Preserve\n- test\n## 七、Impact Map\n| 资产 | 类型 | 动作 | 验收方式 | 状态 |\n|---|---|---|---|---|\n`;
const tail = `## 八、Migration Plan\n1. test\n## 九、Mechanical Checks\n- test\n## 十、Negative / Semantic Counterexample\n- test\n## 十一、Real Output Verification\n- test\n## 十二、Closure Report\n- test\n`;

const fixture = `${headings}| bad-plain | rule | REPLACE | negative test | PENDING |\n| bad-bold | rule | REPLACE | negative test | **PENDING** |\n${tail}`;
fs.writeFileSync(path.join(activeDir, 'CHANGE-negative-both-styles.md'), fixture);

const result = spawnSync(process.execPath, [checker], { cwd: tempRoot, encoding: 'utf8' });
fs.rmSync(tempRoot, { recursive: true, force: true });

if (result.status === 0) {
  console.error('NEGATIVE TEST FAIL: checker accepted intentionally incomplete transactions.');
  process.exit(1);
}

const output = `${result.stdout}${result.stderr}`;
if (!/impact map still contains 2 PENDING row\(s\)/.test(output)) {
  console.error('NEGATIVE TEST FAIL: checker did not reject both plain and bold PENDING rows.');
  console.error(output);
  process.exit(1);
}

console.log('NEGATIVE TEST PASS: plain and bold PENDING Impact Map rows were rejected.');

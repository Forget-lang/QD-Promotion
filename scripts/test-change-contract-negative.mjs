#!/usr/bin/env node
/**
 * Negative test for check-change-contract.mjs.
 * Creates an intentionally incomplete transaction in a temp workspace and
 * proves that the gate rejects a PENDING Impact Map row.
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

const fixture = `# Change Contract\n\n## 一、基本信息\n- 状态：\`MIGRATING\`\n\n## 二、Goal\n- test\n## 三、新口径 New Policy\n- test\n## 四、Replace\n- test\n## 五、Remove\n- test\n## 六、Preserve\n- test\n## 七、Impact Map\n| 资产 | 类型 | 动作 | 验收方式 | 状态 |\n|---|---|---|---|---|\n| bad | rule | REPLACE | negative test | PENDING |\n## 八、Migration Plan\n1. test\n## 九、Mechanical Checks\n- test\n## 十、Negative / Semantic Counterexample\n- test\n## 十一、Real Output Verification\n- test\n## 十二、Closure Report\n- test\n`;

fs.writeFileSync(path.join(activeDir, 'CHANGE-negative.md'), fixture);
const result = spawnSync(process.execPath, [checker], { cwd: tempRoot, encoding: 'utf8' });
fs.rmSync(tempRoot, { recursive: true, force: true });

if (result.status === 0) {
  console.error('NEGATIVE TEST FAIL: checker accepted an intentionally incomplete transaction.');
  process.exit(1);
}

if (!`${result.stdout}${result.stderr}`.includes('PENDING')) {
  console.error('NEGATIVE TEST FAIL: checker rejected, but not for the intended PENDING impact row.');
  process.exit(1);
}

console.log('NEGATIVE TEST PASS: PENDING Impact Map row was rejected.');

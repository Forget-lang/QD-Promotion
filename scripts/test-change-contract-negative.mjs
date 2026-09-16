#!/usr/bin/env node
/**
 * Negative tests for check-change-contract.mjs.
 * Proves the gate rejects incomplete active transactions, illegal root-level
 * transactions, and closed transactions without a valid CLOSED conclusion.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check-change-contract.mjs');

function runFixture(setup, assertions, failureMessage) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-change-contract-'));
  try {
    setup(tempRoot);
    const result = spawnSync(process.execPath, [checker], { cwd: tempRoot, encoding: 'utf8' });
    const output = `${result.stdout}${result.stderr}`;
    assertions(result.status, output);
  } catch (error) {
    console.error(`NEGATIVE TEST FAIL: ${failureMessage}`);
    console.error(error);
    process.exit(1);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

runFixture((tempRoot) => {
  const activeDir = path.join(tempRoot, 'docs', 'changes', 'active');
  fs.mkdirSync(activeDir, { recursive: true });

  const headings = `# Change Contract\n\n## 一、基本信息\n- 状态：\`MIGRATING\`\n\n## 二、Goal\n- test\n## 三、新口径 New Policy\n- test\n## 四、Replace\n- test\n## 五、Remove\n- test\n## 六、Preserve\n- test\n## 七、Impact Map\n| 资产 | 类型 | 动作 | 验收方式 | 状态 |\n|---|---|---|---|---|\n`;
  const tail = `## 八、Migration Plan\n1. test\n## 九、Mechanical Checks\n- test\n## 十、Negative / Semantic Counterexample\n- test\n## 十一、Real Output Verification\n- test\n## 十二、Closure Report\n- test\n`;
  const fixture = `${headings}| bad-plain | rule | REPLACE | negative test | PENDING |\n| bad-bold | rule | REPLACE | negative test | **PENDING** |\n${tail}`;
  fs.writeFileSync(path.join(activeDir, 'CHANGE-negative-both-styles.md'), fixture);
}, (status, output) => {
  if (status === 0 || !/active\/CHANGE-negative-both-styles\.md: impact map still contains 2 PENDING row\(s\)/.test(output)) {
    console.error('NEGATIVE TEST FAIL: checker did not reject both plain and bold PENDING rows.');
    console.error(output);
    process.exit(1);
  }
});

runFixture((tempRoot) => {
  const changesDir = path.join(tempRoot, 'docs', 'changes');
  fs.mkdirSync(changesDir, { recursive: true });
  fs.writeFileSync(path.join(changesDir, 'CHANGE-illegal-root.md'), '# Intentionally illegal root transaction\n');
}, (status, output) => {
  if (status === 0 || !/docs\/changes\/CHANGE-illegal-root\.md: change transaction must live under active\/ or closed\//.test(output)) {
    console.error('NEGATIVE TEST FAIL: checker accepted a transaction scattered at docs/changes root.');
    console.error(output);
    process.exit(1);
  }
});

runFixture((tempRoot) => {
  const closedDir = path.join(tempRoot, 'docs', 'changes', 'closed');
  fs.mkdirSync(closedDir, { recursive: true });
  const fixture = '# Change Contract\n\n## 基本信息\n- 状态：`CLOSED`\n\n## Closure Report\n- 关闭记录缺失结论\n';
  fs.writeFileSync(path.join(closedDir, 'CHANGE-invalid-closed.md'), fixture);
}, (status, output) => {
  if (status === 0 || !/closed\/CHANGE-invalid-closed\.md: closed transaction missing CLOSED conclusion/.test(output)) {
    console.error('NEGATIVE TEST FAIL: checker accepted a closed transaction without a CLOSED conclusion.');
    console.error(output);
    process.exit(1);
  }
});

console.log('NEGATIVE TEST PASS: active pending rows, illegal root transactions, and invalid closed transactions were rejected.');

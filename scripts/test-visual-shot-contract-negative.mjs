#!/usr/bin/env node
/**
 * Negative test for check-visual-shot-contract.mjs.
 * Injects a visual ledger row with missing Peak Frame and proves rejection.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check-visual-shot-contract.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-visual-contract-'));
const outputs = path.join(tempRoot, 'outputs', 'g99-test');
fs.mkdirSync(outputs, { recursive: true });
fs.writeFileSync(path.join(outputs, '08-R9视觉决策卡.md'), `# test\n\n| Shot | Visual Subject | Visual Metaphor | Peak Frame | State Change | Exit |\n|---|---|---|---|---|---|\n| S1-01 | 手机 | 转移 | — | A→B | 切换 |\n`);
const result = spawnSync(process.execPath, [checker], { cwd: tempRoot, encoding: 'utf8' });
fs.rmSync(tempRoot, { recursive: true, force: true });
if (result.status === 0) {
  console.error('NEGATIVE TEST FAIL: incomplete R9 row was accepted.');
  process.exit(1);
}
if (!`${result.stdout}${result.stderr}`.includes('incomplete visual decision row')) {
  console.error('NEGATIVE TEST FAIL: rejection was not for the intended incomplete row.');
  process.exit(1);
}
console.log('NEGATIVE TEST PASS: incomplete Peak Frame row was rejected.');

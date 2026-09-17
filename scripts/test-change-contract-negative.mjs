#!/usr/bin/env node
/**
 * Negative / regression tests for check-change-contract.mjs.
 *
 * Seven logical groups; each group holds several assertions. The group is the
 * logic, the assertions are the format variants. Every fixture runs in an
 * isolated temp root — CHANGE-20260916-005 never proves itself with its own
 * repository state.
 *
 * Covered logic: current-compliant / current-violating / legacy-compliant /
 * legacy-violating / forged CLOSED / illegal exemption registry / stray root
 * transaction / status-directory consistency.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check-change-contract.mjs');

let failures = 0;
let checks = 0;

function assert(label, condition, detail) {
  checks += 1;
  if (condition) return;
  failures += 1;
  console.error(`  FAIL ${label}`);
  if (detail) console.error(String(detail).split('\n').map((line) => `       ${line}`).join('\n'));
}

function run(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qd-cc-'));
  try {
    for (const [rel, content] of Object.entries(files)) {
      const full = path.join(root, rel);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
    const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
    return { status: result.status, out: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const L = (...lines) => `${lines.join('\n')}\n`;
const OMIT = '__OMIT__';
const NO_SECTION = '__NO_SECTION__';

function activeDoc({ status = 'MIGRATING', impactStatus = 'DONE', realOutput = null, omitHeading = null } = {}) {
  const declaration = realOutput === null
    ? '- Real Output 声明：`not-applicable`\n- 理由：治理变更，不产出视频'
    : realOutput;
  const headings = [
    ['一、基本信息', `- 状态：\`${status}\``],
    ['二、Goal', '- test'],
    ['三、新口径 New Policy', '- test'],
    ['四、Replace', '- test'],
    ['五、Remove', '- test'],
    ['六、Preserve', '- test'],
    ['七、Impact Map', `| 资产 | 类型 | 动作 | 验收方式 | 状态 |\n|---|---|---|---|---|\n| a | rule | REPLACE | x | ${impactStatus} |`],
    ['八、Migration Plan', '1. test'],
    ['九、Mechanical Checks', '- test'],
    ['十、Negative / Semantic Counterexample', '- test'],
    ['十一、Real Output Verification', declaration],
    ['十二、Closure Report', '- 结论：NOT CLOSED'],
  ];
  const parts = ['# Change Contract', ''];
  for (const [name, body] of headings) {
    if (omitHeading && name.includes(omitHeading)) continue;
    parts.push(`## ${name}`, body, '');
  }
  return L(...parts);
}

const EVIDENCE_KEYS = [
  ['旧口径扫描', 'PASS'],
  ['机械检查', 'PASS'],
  ['负向测试', 'PASS'],
  ['语义反例', 'PASS'],
  ['本次新增红', '0'],
];

function closedDoc({ status = 'CLOSED', conclusion = '结论：CLOSED', evidence = {}, realOutput = null, bullet = true } = {}) {
  const prefix = bullet ? '- ' : '';
  const lines = ['# Change Contract', '', '## 一、基本信息', `- 状态：\`${status}\``, '', '## 十二、Closure Report'];
  for (const [key, fallback] of EVIDENCE_KEYS) {
    const value = key in evidence ? evidence[key] : fallback;
    if (value === OMIT) continue;
    lines.push(`${prefix}${key}：${value}`);
  }
  lines.push('', conclusion, '');
  const realOutputBody = realOutput === null
    ? '- 真图/成片：N/A（fixture：本事务不改变成片）'
    : realOutput;
  if (realOutputBody !== NO_SECTION) {
    lines.push('## 十一、Real Output Verification', realOutputBody, '');
  }
  return L(...lines);
}

const closedIn = (name, content) => ({ [`docs/changes/closed/${name}.md`]: content });
const activeIn = (name, content) => ({ [`docs/changes/active/${name}.md`]: content });
const registry = (entries) => ({
  'docs/changes/legacy-compatibility.json': `${JSON.stringify({ description: 'test registry', entries }, null, 2)}\n`,
});

const legacyEntry = {
  changeId: 'CHANGE-20200101-001',
  legacyReason: 'fixture reason',
  legacyFormat: 'fixture format',
  scopeOfExemption: ['本次新增红'],
};

const groups = [
  {
    name: 'group 1 · active：当前完整 schema',
    cases: [
      { label: 'valid active passes', files: activeIn('CHANGE-20200101-001', activeDoc()), expect: 0 },
      {
        label: 'missing heading fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ omitHeading: 'Goal' })),
        expect: 1, match: 'missing heading Goal',
      },
      {
        label: 'unfinished impact row fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ impactStatus: 'PENDING' })),
        expect: 1, match: 'unfinished row',
      },
      {
        label: 'bold PENDING impact row fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ impactStatus: '**PENDING**' })),
        expect: 1, match: 'unfinished row',
      },
      {
        label: 'pending token with trailing words still fails (closes the CHANGE-004 evasion)',
        files: activeIn('CHANGE-20200101-001', activeDoc({ impactStatus: 'PENDING CLOSURE NOTE' })),
        expect: 1, match: 'unfinished row',
      },
      {
        label: 'missing Real Output declaration fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ realOutput: '- 适用证据：略' })),
        expect: 1, match: 'missing Real Output 声明',
      },
      {
        label: 'not-applicable with empty reason fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ realOutput: '- Real Output 声明：`not-applicable`\n- 理由：' })),
        expect: 1, match: 'not-applicable but 理由 is empty',
      },
      {
        label: 'applicable without evidence items fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ realOutput: '- Real Output 声明：`applicable`\n- 适用证据：' })),
        expect: 1, match: 'applicable but 适用证据 is empty',
      },
      {
        label: 'applicable with pending evidence item fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ realOutput: '- Real Output 声明：`applicable`\n- 适用证据：\n  - 关键帧 PENDING' })),
        expect: 1, match: 'unsatisfied item',
      },
      {
        label: 'unknown declaration value fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ realOutput: '- Real Output 声明：`maybe`\n- 理由：x' })),
        expect: 1, match: 'invalid Real Output 声明 value',
      },
      {
        label: 'active with CLOSED status fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ status: 'CLOSED' })),
        expect: 1, match: 'active transaction cannot have CLOSED status',
      },
      {
        label: 'unknown status fails',
        files: activeIn('CHANGE-20200101-001', activeDoc({ status: 'DONE' })),
        expect: 1, match: 'invalid status DONE',
      },
      { label: 'no change directory passes', files: {}, expect: 0 },
    ],
  },
  {
    name: 'group 2 · closed 合规：宽容格式，不放宽语义',
    cases: [
      { label: 'plain PASS passes', files: closedIn('CHANGE-20200101-001', closedDoc()), expect: 0 },
      {
        label: 'bold **PASS** / **0** pass',
        files: closedIn('CHANGE-20200101-001', closedDoc({
          evidence: { 旧口径扫描: '**PASS**', 机械检查: '**PASS**', 负向测试: '**PASS**', 语义反例: '**PASS**', 本次新增红: '**0**' },
        })),
        expect: 0,
      },
      {
        label: 'backticked values pass',
        files: closedIn('CHANGE-20200101-001', closedDoc({
          evidence: { 旧口径扫描: '`PASS`', 机械检查: '`PASS`', 负向测试: '`PASS`', 语义反例: '`PASS`', 本次新增红: '`0`' },
        })),
        expect: 0,
      },
      {
        label: 'R8 §十 text-block form without bullets passes',
        files: closedIn('CHANGE-20200101-001', closedDoc({ bullet: false })),
        expect: 0,
      },
      {
        label: 'trailing annotation after 0 passes',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: '0（未引入新的内容/视觉红线）' } })),
        expect: 0,
      },
      {
        label: 'quantity word after 0 passes',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: '**0 个阻塞性红点**' } })),
        expect: 0,
      },
      {
        label: 'PASS with evidence citation passes',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 机械检查: 'PASS（node scripts/gate-all.mjs）' } })),
        expect: 0,
      },
      {
        label: 'closed with a valid Real Output declaration passes',
        files: closedIn('CHANGE-20200101-001', closedDoc({ realOutput: '- Real Output 声明：`not-applicable`\n- 理由：治理变更' })),
        expect: 0,
      },
    ],
  },
  {
    name: 'group 3 · closed 非法：当前关闭证据强制',
    cases: [
      {
        label: 'forged CLOSED with pending evidence fails — the original regression',
        files: closedIn('CHANGE-20200101-001', closedDoc({
          evidence: { 机械检查: 'PENDING', 负向测试: 'PENDING', 语义反例: 'PENDING', 本次新增红: '3' },
        })),
        expect: 1, match: 'closure evidence 机械检查 not satisfied (PENDING)',
      },
      {
        label: 'NOT VERIFIED fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 负向测试: 'NOT VERIFIED' } })),
        expect: 1, match: 'closure evidence 负向测试 not satisfied (NOT VERIFIED)',
      },
      {
        label: '待验证 fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 语义反例: '待验证' } })),
        expect: 1, match: 'closure evidence 语义反例 not satisfied (待验证)',
      },
      {
        label: 'N/A is never a verdict',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 旧口径扫描: 'N/A' } })),
        expect: 1, match: 'closure evidence 旧口径扫描 not satisfied (N/A)',
      },
      {
        label: 'missing evidence line fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 机械检查: OMIT } })),
        expect: 1, match: 'closure evidence 机械检查 missing',
      },
      {
        label: 'non-zero new red fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: '3' } })),
        expect: 1, match: 'non-zero',
      },
      {
        label: 'non-numeric new red fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: '几乎没有' } })),
        expect: 1, match: 'not a number',
      },
      {
        label: 'PENDING new red fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: 'PENDING' } })),
        expect: 1, match: 'closure evidence 本次新增红 not satisfied',
      },
      {
        label: 'missing CLOSED conclusion fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ conclusion: '结论：NOT CLOSED' })),
        expect: 1, match: 'missing CLOSED conclusion',
      },
      {
        label: 'closed transaction with non-CLOSED status fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ status: 'MIGRATING' })),
        expect: 1, match: 'closed transaction must have CLOSED status',
      },
      {
        label: 'closed without Real Output section fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ realOutput: NO_SECTION })),
        expect: 1, match: 'missing heading Real Output Verification',
      },
      {
        label: 'closed with invalid Real Output declaration fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ realOutput: '- Real Output 声明：`not-applicable`\n- 理由：' })),
        expect: 1, match: 'not-applicable but 理由 is empty',
      },
    ],
  },
  {
    name: 'group 4 · 历史兼容：只豁免登记项',
    cases: [
      {
        label: 'registered legacy missing only exempted items passes',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc({ realOutput: NO_SECTION, evidence: { 本次新增红: OMIT } })),
          ...registry([{ ...legacyEntry, scopeOfExemption: ['本次新增红', 'Real Output Verification 章节'] }]),
        },
        expect: 0,
      },
      {
        label: 'registered legacy still fails on a non-exempted gap',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: OMIT, 机械检查: 'PENDING' } })),
          ...registry([legacyEntry]),
        },
        expect: 1, match: 'closure evidence 机械检查 not satisfied (PENDING)',
      },
    ],
  },
  {
    name: 'group 5 · 未登记历史不得绕过当前标准',
    cases: [
      {
        label: 'unregistered closed with forged evidence fails',
        files: closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 机械检查: 'PENDING', 本次新增红: '3' } })),
        expect: 1, match: 'closure evidence 机械检查 not satisfied (PENDING)',
      },
      {
        label: 'empty registry disables nothing',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc({ evidence: { 本次新增红: OMIT } })),
          ...registry([]),
        },
        expect: 1, match: 'closure evidence 本次新增红 missing',
      },
    ],
  },
  {
    name: 'group 6 · 豁免清单自身受检（防黑箱）',
    cases: [
      {
        label: 'unknown changeId fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          ...registry([{ ...legacyEntry, changeId: 'CHANGE-20990101-999' }]),
        },
        expect: 1, match: 'is not present in closed/',
      },
      {
        label: 'exempting an active transaction fails',
        files: {
          ...activeIn('CHANGE-20200102-002', activeDoc()),
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          ...registry([{ ...legacyEntry, changeId: 'CHANGE-20200102-002' }]),
        },
        expect: 1, match: 'is still active and cannot be exempted',
      },
      {
        label: 'duplicate changeId fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          ...registry([legacyEntry, { ...legacyEntry }]),
        },
        expect: 1, match: 'duplicate changeId',
      },
      {
        label: 'unknown exemption item fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc({ realOutput: NO_SECTION })),
          ...registry([{ ...legacyEntry, scopeOfExemption: ['随便写写'] }]),
        },
        expect: 1, match: 'unknown exemption item',
      },
      {
        label: 'blanket exemption is not expressible (empty scope) fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          ...registry([{ ...legacyEntry, scopeOfExemption: [] }]),
        },
        expect: 1, match: 'missing scopeOfExemption',
      },
      {
        label: 'missing legacyReason fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          ...registry([{ ...legacyEntry, legacyReason: '' }]),
        },
        expect: 1, match: 'missing legacyReason',
      },
      {
        label: 'invalid registry JSON fails',
        files: {
          ...closedIn('CHANGE-20200101-001', closedDoc()),
          'docs/changes/legacy-compatibility.json': '{ not json',
        },
        expect: 1, match: 'invalid JSON',
      },
    ],
  },
  {
    name: 'group 7 · 结构位置与状态一致性',
    cases: [
      {
        label: 'transaction stray at docs/changes root fails',
        files: { 'docs/changes/CHANGE-20200101-001-illegal-root.md': '# stray\n', 'docs/changes/README.md': '# lib\n' },
        expect: 1, match: 'must live under active/ or closed/',
      },
      {
        label: 'template.md and README are never treated as transactions',
        files: { 'docs/changes/template.md': '# Change Contract\n', 'docs/changes/README.md': '# lib\n' },
        expect: 0,
      },
      {
        label: 'valid active and closed coexist',
        files: {
          ...activeIn('CHANGE-20200102-002', activeDoc()),
          ...closedIn('CHANGE-20200101-001', closedDoc()),
        },
        expect: 0,
      },
    ],
  },
];

for (const group of groups) {
  console.log(group.name);
  for (const testCase of group.cases) {
    const { status, out } = run(testCase.files);
    assert(
      `${testCase.label} (expect ${testCase.expect === 0 ? 'PASS' : 'FAIL'})`,
      status === testCase.expect,
      `expected exit ${testCase.expect}, got ${status}\n${out.trim()}`,
    );
    if (testCase.match) {
      assert(`  ↳ message contains "${testCase.match}"`, out.includes(testCase.match), out.trim());
    }
  }
}

console.log('');
if (failures > 0) {
  console.error(`NEGATIVE TEST FAIL: ${failures}/${checks} assertion(s) failed.`);
  process.exit(1);
}
console.log(`NEGATIVE TEST PASS: ${checks} assertion(s) across ${groups.length} logical groups.`);

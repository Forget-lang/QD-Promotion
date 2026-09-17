#!/usr/bin/env node
/**
 * Change Contract gate.
 *
 * active/ : current full Change Contract schema + machine-readable Real Output declaration.
 * closed/ : current closure evidence, minus explicitly registered legacy exemptions.
 * legacy  : docs/changes/legacy-compatibility.json — explicit, enumerable, self-checked.
 *
 * Boundaries (owner: docs/changes/README.md + R8 §十):
 * - Section numbers are presentation, not identity. Governance sections may be
 *   inserted without invalidating the contract shape.
 * - Historical closed transactions are NOT retro-fitted to today's schema.
 * - Historical compatibility never lowers the current CLOSED evidence standard.
 * - Evidence is verified OFFLINE only. This gate never claims to verify a remote
 *   CI run. "Is this evidence really about this transaction's final state?" is a
 *   human judgement and is deliberately not faked here.
 * - Format tolerance is not semantic tolerance: PENDING / NOT VERIFIED never
 *   counts as PASS.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const changesDir = path.join(root, 'docs', 'changes');
const activeDir = path.join(changesDir, 'active');
const closedDir = path.join(changesDir, 'closed');
const legacyPath = path.join(changesDir, 'legacy-compatibility.json');

const requiredHeadingNames = [
  '基本信息', 'Goal', '新口径 New Policy', 'Replace', 'Remove', 'Preserve',
  'Impact Map', 'Migration Plan', 'Mechanical Checks',
  'Negative / Semantic Counterexample', 'Real Output Verification', 'Closure Report',
];

const allowedStates = new Set(['PROPOSED', 'APPROVED', 'MIGRATING', 'VERIFYING', 'CLOSED']);

const CLOSURE_EVIDENCE_ITEMS = ['旧口径扫描', '机械检查', '负向测试', '语义反例'];
const RED_COUNT_ITEM = '本次新增红';
const REAL_OUTPUT_SECTION_ITEM = 'Real Output Verification 章节';
const ALLOWED_EXEMPTION_ITEMS = new Set([
  ...CLOSURE_EVIDENCE_ITEMS,
  RED_COUNT_ITEM,
  REAL_OUTPUT_SECTION_ITEM,
]);

const PENDING_PATTERN = /(PENDING|TODO|TBD|待办|待验证|未完成|NOT[\s-]*VERIFIED)/i;
const NOT_APPLICABLE_PATTERN = /^(N\/A|NA|不适用)\b/i;

const errors = [];
function fail(message) {
  errors.push(message);
  console.error(message);
}

const stripMarks = (value) => String(value).replace(/\*\*/g, '').replace(/`/g, '');
const escapeRe = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tidy = (value) => String(value).trim().replace(/[。．.\s]+$/, '');

function getSectionBody(text, headingName) {
  const headingRe = new RegExp(`^##\\s+(?:[^\\s、]+、)?${escapeRe(headingName)}\\s*$`, 'm');
  const match = text.match(headingRe);
  if (!match) return null;
  const tail = text.slice(match.index + match[0].length);
  const next = tail.search(/^##\s+/m);
  return next >= 0 ? tail.slice(0, next) : tail;
}

// Field lines appear in two legitimate shapes in this repo:
//   `- 机械检查：PASS`           (docs/changes/template.md §十二 — list form)
//   `机械检查：PASS`             (R8 §十 — fenced text-block form)
// Both are accepted; the leading bullet is optional.
function getFieldValue(text, fieldName) {
  const fieldRe = new RegExp(`^\\s*(?:[-*]\\s*)?${escapeRe(fieldName)}\\s*[：:]\\s*(.+?)\\s*$`, 'm');
  const match = text.match(fieldRe);
  return match ? match[1].trim() : null;
}

function evidenceProblem(stripped, item) {
  const raw = getFieldValue(stripped, item);
  if (raw === null) return 'missing';
  const value = tidy(raw);
  if (PENDING_PATTERN.test(value)) return `not satisfied (${value})`;
  if (NOT_APPLICABLE_PATTERN.test(value)) return `not satisfied (${value})`;
  if (!/^PASS/i.test(value)) return `not satisfied (${value})`;
  return null;
}

function redCountProblem(stripped) {
  const raw = getFieldValue(stripped, RED_COUNT_ITEM);
  if (raw === null) return 'missing';
  const value = tidy(raw);
  if (PENDING_PATTERN.test(value)) return `not satisfied (${value})`;
  const digits = value.match(/-?\d+/);
  if (!digits) return `not satisfied (not a number: ${value})`;
  if (Number(digits[0]) !== 0) return `not satisfied (non-zero: ${value})`;
  return null;
}

function realOutputProblems(stripped, { requireDeclaration }) {
  const problems = [];
  const body = getSectionBody(stripped, 'Real Output Verification');
  if (body === null) return { sectionPresent: false, problems };
  const declRaw = getFieldValue(body, 'Real Output 声明');
  if (declRaw === null) {
    if (requireDeclaration) problems.push('missing Real Output 声明 (applicable / not-applicable)');
    return { sectionPresent: true, problems };
  }
  const value = tidy(declRaw);
  if (/^applicable/i.test(value)) {
    const items = [];
    const block = body.match(/^\s*[-*]\s*适用证据\s*[：:]\s*(.*)$/m);
    if (block) {
      if (block[1].trim()) items.push(block[1].trim());
      const after = body.slice(block.index + block[0].length);
      for (const line of after.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (!/^[-*]\s+/.test(trimmed)) break;
        const item = trimmed.replace(/^[-*]\s+/, '').trim();
        if (/^(理由|原因)\s*[：:]/.test(item)) break;
        items.push(item);
      }
    }
    if (items.length === 0) {
      problems.push('applicable but 适用证据 is empty');
    } else if (items.some((item) => PENDING_PATTERN.test(item) || NOT_APPLICABLE_PATTERN.test(item))) {
      problems.push('applicable but 适用证据 still contains an unsatisfied item');
    }
    return { sectionPresent: true, problems };
  }
  if (/^not-applicable/i.test(value)) {
    const reason = getFieldValue(body, '理由');
    if (reason === null || tidy(reason).length === 0) {
      problems.push('not-applicable but 理由 is empty');
    }
    return { sectionPresent: true, problems };
  }
  problems.push(`invalid Real Output 声明 value (${value})`);
  return { sectionPresent: true, problems };
}

if (!fs.existsSync(changesDir)) {
  console.log('CHANGE-CONTRACT PASS: no change directory.');
  process.exit(0);
}

const rootTransactionFiles = fs
  .readdirSync(changesDir)
  .filter((name) => /^CHANGE-.*\.md$/.test(name));
for (const file of rootTransactionFiles) {
  fail(`docs/changes/${file}: change transaction must live under active/ or closed/`);
}

function listTransactions(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md') && name !== 'template.md')
    .sort();
}

const activeFiles = listTransactions(activeDir);
const closedFiles = listTransactions(closedDir);
const idOf = (file) => (String(file).match(/^CHANGE-\d{8}-\d{3}/) || [''])[0];

let legacyEntries = [];
if (fs.existsSync(legacyPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
    legacyEntries = Array.isArray(parsed.entries) ? parsed.entries : [];
    if (!Array.isArray(parsed.entries)) {
      fail('legacy-compatibility.json: entries must be an array');
    }
  } catch (error) {
    fail(`legacy-compatibility.json: invalid JSON (${error.message})`);
  }
}

const seenLegacyIds = new Set();
for (const entry of legacyEntries) {
  const changeId = String(entry.changeId || '').trim();
  if (!changeId) {
    fail('legacy-compatibility.json: entry is missing changeId');
    continue;
  }
  if (seenLegacyIds.has(changeId)) {
    fail(`legacy-compatibility.json: duplicate changeId ${changeId}`);
  }
  seenLegacyIds.add(changeId);
  if (!closedFiles.some((file) => file.includes(changeId))) {
    fail(`legacy-compatibility.json: ${changeId} is not present in closed/`);
  }
  if (activeFiles.some((file) => file.includes(changeId))) {
    fail(`legacy-compatibility.json: ${changeId} is still active and cannot be exempted`);
  }
  for (const field of ['legacyReason', 'legacyFormat']) {
    if (!String(entry[field] || '').trim()) {
      fail(`legacy-compatibility.json: ${changeId} is missing ${field}`);
    }
  }
  const scope = entry.scopeOfExemption;
  if (!Array.isArray(scope) || scope.length === 0) {
    fail(`legacy-compatibility.json: ${changeId} is missing scopeOfExemption`);
    continue;
  }
  for (const item of scope) {
    if (!ALLOWED_EXEMPTION_ITEMS.has(item)) {
      fail(`legacy-compatibility.json: ${changeId} has unknown exemption item ${item}`);
    }
  }
}

const exemptionsByChangeId = new Map(
  legacyEntries
    .filter((entry) => String(entry.changeId || '').trim())
    .map((entry) => [
      String(entry.changeId).trim(),
      new Set(Array.isArray(entry.scopeOfExemption) ? entry.scopeOfExemption : []),
    ]),
);

const transactions = [
  ...activeFiles.map((file) => ({ file, dir: activeDir, state: 'active' })),
  ...closedFiles.map((file) => ({ file, dir: closedDir, state: 'closed' })),
];

if (transactions.length === 0 && rootTransactionFiles.length === 0) {
  console.log('CHANGE-CONTRACT PASS: no change transactions.（空转提示：active/ 与 closed/ 均无事务——若这非预期，说明事务库目录缺失）');
  process.exit(0);
}

for (const transaction of transactions) {
  const stripped = stripMarks(
    fs.readFileSync(path.join(transaction.dir, transaction.file), 'utf8'),
  );
  const location = `${transaction.state}/${transaction.file}`;

  const statusValue = getFieldValue(stripped, '状态');
  if (statusValue === null) {
    fail(`${location}: missing status`);
    continue;
  }
  const status = tidy(statusValue);
  if (!allowedStates.has(status)) {
    fail(`${location}: invalid status ${status}`);
    continue;
  }
  if (transaction.state === 'active' && status === 'CLOSED') {
    fail(`${location}: active transaction cannot have CLOSED status`);
  }
  if (transaction.state === 'closed' && status !== 'CLOSED') {
    fail(`${location}: closed transaction must have CLOSED status`);
  }

  if (transaction.state === 'active') {
    for (const headingName of requiredHeadingNames) {
      const headingRe = new RegExp(`^##\\s+(?:[^\\s、]+、)?${escapeRe(headingName)}\\s*$`, 'm');
      if (!headingRe.test(stripped)) {
        fail(`${location}: missing heading ${headingName}`);
      }
    }

    const impactBody = getSectionBody(stripped, 'Impact Map');
    if (impactBody !== null) {
      const unfinished = impactBody
        .split('\n')
        .filter((line) => line.trim().startsWith('|'))
        .map((line) => line.trim().replace(/^\||\|$/g, '').split('|'))
        .filter((cells) => cells.length >= 2 && PENDING_PATTERN.test(cells[cells.length - 1]));
      if (unfinished.length) {
        fail(`${location}: impact map still contains ${unfinished.length} unfinished row(s)`);
      }
    }

    for (const problem of realOutputProblems(stripped, { requireDeclaration: true }).problems) {
      fail(`${location}: ${problem}`);
    }
    continue;
  }

  if (!/结论\s*[：:]\s*CLOSED/.test(stripped)) {
    fail(`${location}: closed transaction missing CLOSED conclusion`);
  }

  // Closure evidence verdicts live in the Closure Report block. Reading them from
  // the whole document would pick up the same-named prose in §十 Negative /
  // Semantic Counterexample, where "语义反例" is a narrative field, not a verdict.
  const closureBody = getSectionBody(stripped, 'Closure Report') || stripped;
  const exempt = exemptionsByChangeId.get(idOf(transaction.file)) || new Set();

  for (const item of CLOSURE_EVIDENCE_ITEMS) {
    if (exempt.has(item)) continue;
    const problem = evidenceProblem(closureBody, item);
    if (problem) fail(`${location}: closure evidence ${item} ${problem}`);
  }

  if (!exempt.has(RED_COUNT_ITEM)) {
    const problem = redCountProblem(closureBody);
    if (problem) fail(`${location}: closure evidence ${RED_COUNT_ITEM} ${problem}`);
  }

  const realOutput = realOutputProblems(stripped, { requireDeclaration: false });
  if (!realOutput.sectionPresent && !exempt.has(REAL_OUTPUT_SECTION_ITEM)) {
    fail(`${location}: missing heading Real Output Verification`);
  }
  for (const problem of realOutput.problems) {
    fail(`${location}: ${problem}`);
  }
}

if (errors.length > 0) {
  console.error(`CHANGE-CONTRACT FAIL: ${errors.length} structural issue(s)`);
  process.exitCode = 1;
} else {
  console.log(`CHANGE-CONTRACT PASS: checked ${transactions.length} transaction(s).`);
}

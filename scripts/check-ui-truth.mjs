#!/usr/bin/env node
/**
 * scripts/check-ui-truth.mjs · 上屏真实性闸门（字段名回源码取证）
 *
 * 为什么要有它：2026-08-30 g06 被否的根因之一，是画面上出现了"看起来像后台"的字段名，
 * 商家照着找不到对应格子，整片的教学价值归零。这条口径以前只写在 SKILL 里靠 AI 自觉，
 * 换会话就会重犯——所以升成机检：上屏的字段名必须逐字存在于 ../applet/ 源码。
 *
 * 约定（关键）：数据文件里 **`k:` 属性 = 产品真实字段名**，必须能在 applet 源码逐字命中（硬失败）。
 *   其它键（act/desc/res/mark/title/sub…）是本片文案，不参与硬检。
 *   文案里用「」引起来、声称是产品界面说法的词，列入"需人工确认"层（不计失败，但必须看过）。
 *
 * 七层（⑦ 为 CHANGE-20260918-030 新增）：
 *   ① 字段名逐字取证 —— `k:` 必须在 applet 源码出现（硬失败）
 *   ② 「」声称是界面说法但源码查不到（⚠️ 人工确认）
 *   ③ 分组归属 —— 组标题若照抄页面原生组名，其下每一行必须真在那一组里（硬失败）。
 *      为什么单独立一层：2026-08-30 S5 把「到期提醒」挂进「领券顾客信息」组，
 *      字段名 ① 全过、归属是错的，商家翻后台会卡在"这一组里没这行"——① 拦不住这类错。
 *      我方自述的分步标题（「① 券面」「③ 期限」）不是原生组名，不参与本层判定。
 *   ④ 表外字段 —— 源码里有、真值表（优惠券/次卡/积分/会员权益 四表）没登记（⚠️ 提醒回写，不计失败）
 *   ⑤ 真值表自证 —— 双表里每个行名/组名，必须逐字命中它自己 `src` 所指的源码；历史 src 行号允许漂移，但**目标源码中全局查不到才硬失败**。
 *      为什么单独立一层：SKILL 第 4 步要求「字段名逐字取自这张表」，**表本身错了就会污染后续每一片**，
 *      而 ①③④ 都只拿表当尺子量画面、不量表自己。行号是证据定位，不是产品文案的第二份真源；源文件增长/插行后，旧行号可以漂移，
 *      只要同一目标源码文件里仍存在原话，就记录为 advisory，不把机械的行号漂移误判成产品事实错误。
 *      豁免：`onScreen: false` 的条目（按定义不上屏，是我方描述名）；createGroups 中若引用同一条 retired field，也同样豁免。
 *   ⑥ 券种↔面额字段配对 —— 制券屏须声明 `couponType: '满减券'` 等；本层校验该屏用到的面额字段
 *      （原价/券面额/优惠金额/折扣/兑换内容/随机最小·最大金额）全属该券种的 `couponTypes[key].faceFields`，
 *      且该券种要求的面额字段都在（硬失败）。为什么单独立一层：2026-09-03 g07 把满减券的"减 X"挂到代金券名下——
 *      "券面额"是真名、① 全过，但券种与字段集配错，①③⑤ 都拦不住。未声明 couponType 却用了面额字段的屏 → ❌ 硬失败（补上 couponType 才能过关）。
 *   ⑦ 图文机检（CHANGE-20260918-030）—— video/src/graphic/*.ts 的图内字段名（images[].k / k: 单值）必须逐字命中
 *      spec 四表字段名/组行名、券种名，或 applet 源码原话（非 spec 表内条目类，如「券码」）；onScreen:false 的字段名
 *      出现在图内 = 硬失败（「行名不上屏」对图文同样生效）。019 §三.5「机检覆盖随首篇落地」的落点。
 *
 * 用法：node scripts/check-ui-truth.mjs
 * 退出码：0 = 通过；1 = 有硬失败（① 未取证的字段名 / ③ 分组归属错误 / ⑤ 真值表行名源码全局查无 / ⑥ 券种↔字段配对错或未声明 couponType）。
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLET = join(ROOT, '..', 'applet');
const DATA_DIR = join(ROOT, 'video', 'src', 'data');

/** 递归收集 applet 里可能承载 UI 文案的文件（跳过第三方模块） */
function collectSources(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'uni_modules' || name === 'node_modules' || name === 'unpackage' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) collectSources(p, out);
    else if (/\.(vue|js|json)$/.test(name)) out.push(p);
  }
  return out;
}

/** 读取并去掉换行，让"跨行写的 label"也能被逐字命中 */
function loadAppletCorpus() {
  return collectSources(APPLET).map((p) => ({
    p,
    // 归一化：全角/半角引号统一，压掉空白，避免源码里换行缩进导致假失配
    text: readFileSync(p, 'utf8').replace(/\s+/g, '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
  }));
}
const norm = (s) => s.replace(/\s+/g, '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

/** 提取形如 k: '优惠券名称' 的字段名（键名单词边界，防 mark: 被当成 k:） */
function extractKeys(fileText) {
  const hits = [];
  const re = /(?:^|[{,\s])k:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(fileText))) hits.push(m[1]);
  return hits;
}

/** 按出现顺序把数据文件切成「组标题 → 该组字段行」，用于分组归属检查 */
function extractGroups(fileText) {
  const re = /(?:^|[{,\s])(head|k):\s*'([^']+)'/g;
  const groups = [];
  let m;
  while ((m = re.exec(fileText))) {
    if (m[1] === 'head') groups.push({ head: m[2], rows: [] });
    else if (groups.length) groups[groups.length - 1].rows.push(m[2]);
  }
  return groups;
}

/** 按 `ui: 'gXX-名字'` 把数据文件切成一屏一段，用于 ⑥ 券种↔字段配对（把 couponType 限定在它所在屏） */
function extractScenes(fileText) {
  const marks = [];
  const re = /ui:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(fileText))) marks.push({ ui: m[1], start: m.index });
  const scenes = [];
  for (let i = 0; i < marks.length; i++) {
    const block = fileText.slice(marks[i].start, i + 1 < marks.length ? marks[i + 1].start : fileText.length);
    const ct = (block.match(/couponType:\s*'([^']+)'/) || [])[1] || null;
    scenes.push({ ui: marks[i].ui, couponType: ct, keys: extractKeys(block) });
  }
  return scenes;
}

/** 提取文案里「」包起来的说法（声称是产品界面原话的那一类，交人工确认） */
function extractQuoted(fileText) {
  const hits = new Set();
  const re = /「([^」]{2,14})」/g;
  let m;
  while ((m = re.exec(fileText))) hits.add(m[1]);
  return [...hits];
}

if (!existsSync(APPLET)) {
  console.error(`❌ 找不到产品源码目录：${APPLET}`);
  process.exit(1);
}
if (!existsSync(DATA_DIR)) {
  console.error(`❌ 找不到数据目录：${DATA_DIR}`);
  process.exit(1);
}

const corpus = loadAppletCorpus();
const dataFiles = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts'));

/** 分组归属真值 + ⑤ 层自证真值：优惠券 + 次卡 + 积分 + 会员权益 四表（CHANGE-20260917-017 扩容） */
const TABLES = [
  { path: join(ROOT, 'spec', 'coupon-fields.json'), tag: '优惠券', nativeGroupEligible: true },
  { path: join(ROOT, 'spec', 'card-fields.json'), tag: '次卡' },
  { path: join(ROOT, 'spec', 'point-fields.json'), tag: '积分' },
  { path: join(ROOT, 'spec', 'member-fields.json'), tag: '会员权益' },
].filter((t) => existsSync(t.path)).map((t) => ({ ...t, json: JSON.parse(readFileSync(t.path, 'utf8')) }));
const TABLE = TABLES[0] ? TABLES[0].json : {}; // 优惠券表（⑥ 券种↔字段仍只用它）
const nativeGroups = new Map();
const allRows = new Set();
/** 明确标记为不上屏的字段：createGroups 若仍保留该历史机制名，也不得把它重新变成硬失败 */
const retiredRows = new Set();
/** 行名 → 它在真值表里真正所属的组（③ 层报错时指出该挪去哪儿，而不是重复报已知的组名） */
const rowHome = new Map();
for (const { json, tag, nativeGroupEligible } of TABLES) {
  for (const f of json.fields || []) {
    if (typeof f.label === 'string') allRows.add(f.label);
    if (f.onScreen === false && typeof f.label === 'string') retiredRows.add(f.label);
  }
  for (const g of json.createGroups || []) {
    for (const r of g.rows || []) {
      allRows.add(r);
      if (!rowHome.has(r)) rowHome.set(r, `${tag}·${g.title || `无标题组 ${g.range}`}`);
    }
    // nativeGroups 只收有 title 的组：次卡页全部 title:null，不进入 ③ 原生组判定。
    // 017 起：仅 nativeGroupEligible 表（优惠券）供给 ③——积分/会员表无分组行结构，
    // 若混入会凭组名 includes() 误匹配视频分镜的组标题。
    if (g.title && nativeGroupEligible) nativeGroups.set(g.title, g.rows || []);
  }
}
/** 剥掉「① 」「⑤ 」这类步进前缀，得到实际组名（覆盖 ①-⑳，不手写子集） */
const stripStep = (s) => s.replace(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]\s*/, '').trim();
const inList = (row, list) => list.some((a) => a === row || a.startsWith(row) || row.startsWith(a) || a.includes(row));

/** ⑥ 面额字段全集（券种专属，区别于消费门槛这类所有券种都有的基础字段） */
const FACE_FIELDS = new Set(['原价', '券面额', '优惠金额', '折扣', '兑换内容', '随机最小金额', '随机最大金额']);
/** 券种 label → 该券种允许/要求的面额字段集（真源 = coupon-fields.json 的 couponTypes.faceFields） */
const couponTypeMap = new Map();
for (const t of TABLE.couponTypes || []) couponTypeMap.set(t.label, new Set(t.faceFields || []));

const missing = [];
const unverified = [];
const misfiled = [];
const unknownRow = [];
const typeMismatch = [];   // ⑥ 用了不属于声明券种的面额字段（硬失败）
const typeMissing = [];    // ⑥ 声明券种要求的面额字段缺失（硬失败）
const undeclared = [];     // ⑥ 用了面额字段却没声明 couponType（❌ 硬失败）
const unknownType = [];    // ⑥ 声明的 couponType 不在表里（⚠️ 提醒）
let fieldTotal = 0;

for (const f of dataFiles) {
  const full = join(DATA_DIR, f);
  const text = readFileSync(full, 'utf8');
  const fields = extractKeys(text);
  fieldTotal += fields.length;
  for (const label of fields) {
    const n = norm(label);
    const where = corpus.find((c) => c.text.includes(n));
    if (!where) missing.push({ file: f, label });
  }
  for (const q of extractQuoted(text)) {
    const n = norm(q);
    // 只报"疑似界面说法"：含动作/字段/页面特征词的，其余是场景文案
    if (!/(券|码|号|知|量|取|发放|页|栏|提醒|模板|领取|核销|时长|有效期|门槛|名称)/.test(q)) continue;
    if (corpus.some((c) => c.text.includes(n))) continue;
    unverified.push({ file: f, term: q });
  }
  // ③ 分组归属：组标题若声称是页面原生那一组，行就必须真在那一组里
  if (nativeGroups.size) {
    for (const g of extractGroups(text)) {
      if (!g.rows.length) continue;
      const name = stripStep(g.head);
      const nativeKey = [...nativeGroups.keys()].find((t) => name === t || name.includes(t));
      for (const row of g.rows) {
        if (retiredRows.has(row)) continue;
        if (nativeKey) {
          if (!inList(row, nativeGroups.get(nativeKey))) misfiled.push({ file: f, head: g.head, row, nativeKey, home: rowHome.get(row) || '（表里没登记这一行）' });
        } else if (!inList(row, [...allRows])) {
          unknownRow.push({ file: f, head: g.head, row });
        }
      }
    }
  }
}

/* ──  券种↔面额字段配对：每屏声明的 couponType 决定该屏允许/要求哪些面额字段 ── */
for (const f of dataFiles) {
  const text = readFileSync(join(DATA_DIR, f), 'utf8');
  for (const sc of extractScenes(text)) {
    const faceUsed = sc.keys.filter((k) => FACE_FIELDS.has(k));
    if (!sc.couponType) {
      if (faceUsed.length) undeclared.push({ file: f, ui: sc.ui, faceUsed });
      continue;
    }
    const allowed = couponTypeMap.get(sc.couponType);
    if (!allowed) { unknownType.push({ file: f, ui: sc.ui, couponType: sc.couponType }); continue; }
    const wrong = faceUsed.filter((k) => !allowed.has(k));
    if (wrong.length) typeMismatch.push({ file: f, ui: sc.ui, couponType: sc.couponType, wrong });
    const miss = [...allowed].filter((k) => !faceUsed.includes(k));
    if (miss.length) typeMissing.push({ file: f, ui: sc.ui, couponType: sc.couponType, miss });
  }
}

/* ── ⑤ 真值表自证：表里每个要上屏的名字，必须逐字命中它自己 src 所指的源码文件 ── */
/** 裸文件名 → applet 真实路径（applet 里 create.vue 有两份，制券页在 pages_coupon 下） */
const byBase = new Map();
for (const c of corpus) {
  const b = c.p.split('/').pop();
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(c.p);
}
const resolveSrc = (base) => {
  // 带目录的完整路径（次卡表用，如 pages_card/card/create.vue）：直接相对 APPLET 解析
  if (base.includes('/')) {
    const p = join(APPLET, base);
    return existsSync(p) ? p : null;
  }
  // 裸文件名（优惠券表用，create.vue 在 pages_coupon / pages_card 各有一份）：按 pages_coupon 优先消歧
  const list = byBase.get(base) || [];
  return list.find((p) => p.includes('pages_coupon')) || list[0] || null;
};
const lineCache = new Map();
/** 取某文件某行段的归一化文本（前后各留 PAD 行容差）；行段仅用于定位，源码全局命中才是硬真值 */
const PAD = 10;
function sourceText(base) {
  const p = resolveSrc(base);
  if (!p) return null;
  if (!lineCache.has(p)) lineCache.set(p, readFileSync(p, 'utf8').split('\n'));
  return { path: p, lines: lineCache.get(p) };
}
function srcWindow(base, a, b) {
  const src = sourceText(base);
  if (!src) return null;
  const lines = src.lines;
  return norm(lines.slice(Math.max(0, a - 1 - PAD), Math.min(lines.length, b + PAD)).join(''));
}
/** 「A / B」「A + B」这类复合名拆开各自取证；纯说明句（含标点或纯数字）另计 */
const nameParts = (label) => String(label).split(/\s*[/＋+]\s*/)
  .map((s) => s.trim()).filter((s) => s.length >= 2 && !/[，。；>≤≥]/.test(s) && !/^\d+$/.test(s));

const tableBad = [];
const tableMoved = [];
const tableUnresolved = [];
let tableTotal = 0;
{
  const items = [];
  for (const { json, tag, nativeGroupEligible } of TABLES) {
    for (const f of json.fields || []) {
      if (f.onScreen === false) continue;
      items.push({ where: `${tag}·fields`, name: f.label, src: f.src });
    }
    for (const g of json.createGroups || []) {
      for (const r of g.rows || []) {
        if (retiredRows.has(r)) continue;
        items.push({ where: `${tag}·createGroups「${g.title || '无标题'}」`, name: r, src: g.range });
      }
    }
  }
  for (const it of items) {
    const m = String(it.src || '').match(/^([\w./-]+?):(\d+)(?:-(\d+))?/);
    const src = m ? sourceText(m[1]) : null;
    const win = m ? srcWindow(m[1], +m[2], m[3] ? +m[3] : +m[2]) : null;
    if (!src || !win) { tableUnresolved.push({ ...it, why: 'src 定位不到源码文件' }); continue; }
    const parts = nameParts(it.name);
    if (!parts.length) { tableUnresolved.push({ ...it, why: '不是可取证的界面文案（疑似说明句）' }); continue; }
    tableTotal++;
    const missInWindow = parts.filter((p) => !win.includes(norm(p)));
    if (missInWindow.length) {
      const globalMiss = parts.filter((p) => !norm(src.lines.join('')).includes(norm(p)));
      if (globalMiss.length) tableBad.push({ ...it, miss: globalMiss, src: it.src });
      else tableMoved.push({ ...it, moved: missInWindow, src: it.src });
    }
  }
}

const rel = (p) => relative(ROOT, p);
console.log('\n══════════════ 上屏真实性闸门（check-ui-truth）══════════════\n');
console.log(`取证范围：${corpus.length} 个 applet 源文件（已排除 uni_modules / node_modules / unpackage）`);
console.log(`数据文件：${dataFiles.map((f) => rel(join(DATA_DIR, f))).join(', ') || '（暂无，首片开工时建立）'}\n`);

if (missing.length) {
  console.log(`① 字段名逐字取证  ❌ 硬失败 —— ${missing.length} 个上屏字段名在 applet 源码中找不到：`);
  for (const x of missing) console.log(`   ${x.file}  k:'${x.label}'`);
  console.log('   修法：回 ../applet/ 读该页 label / title / placeholder 原文改成真名，或这本来就不是字段名（换掉 k: 键）。');
} else {
  console.log(`① 字段名逐字取证  ✅ 通过 —— 命中 ${fieldTotal} 个字段名，全部逐字存在于 applet 源码`);
}

console.log('');
if (unverified.length) {
  console.log(`② 文案里「」声称是界面说法、但源码查不到  ⚠️ 需人工确认 —— ${unverified.length} 处（不计失败）`);
  for (const x of unverified.slice(0, 20)) console.log(`   ${x.file}  «${x.term}»`);
  if (unverified.length > 20) console.log(`   ……另有 ${unverified.length - 20} 处`);
  console.log('   逐个回源码看一眼：是产品原话就留着，是场景说法就换掉引号。');
} else {
  console.log('② 文案里「」声称是界面说法、但源码查不到  ✅ 无');
}

console.log('');
if (!nativeGroups.size) {
  console.log('③ 分组归属（行挂在哪一组）  ⏭ 跳过 —— 未找到 spec/coupon-fields.json 的 createGroups');
} else if (misfiled.length) {
  console.log(`③ 分组归属  ❌ 硬失败 —— ${misfiled.length} 行被挂到了别组的原生组名下（字段名对、归属错，商家照样找不到）：`);
  for (const x of misfiled) console.log(`   ${x.file}  「${x.head}」组里的 k:'${x.row}' —— 这一行在表里真属于「${x.home}」，别挂在这儿`);
  console.log(`   修法：照 spec/coupon-fields.json 的 createGroups 改组标题，或把该行移回真组；我方自述的分步标题（① ② ③…）不参与本层判定。`);
} else {
  console.log(`③ 分组归属  ✅ 通过 —— 声称是页面原生组（${[...nativeGroups.keys()].join('/')}）的组，行都对得上`);
}
if (unknownRow.length) {
  console.log('');
  console.log(`④ 字段在源码里有、但制券页真值表没登记  ⚠️ 需回写 —— ${unknownRow.length} 处（不计失败）`);
  for (const x of unknownRow.slice(0, 20)) console.log(`   ${x.file}  「${x.head}」组 k:'${x.row}'`);
  if (unknownRow.length > 20) console.log(`   ……另有 ${unknownRow.length - 20} 处`);
  console.log('   回源码确认它属于哪一页/哪一组，把带 `src` 行号的新行补进 spec/coupon-fields.json，别让它游离在表外。');
}

console.log('');
if (!TABLES.length) {
  console.log('⑤ 真值表自证（表里的名字逐字回源码）  ⏭ 跳过 —— TABLES 四表一个都没找到');
} else if (tableBad.length) {
  console.log(`⑤ 真值表自证  ❌ 硬失败 —— 表里 ${tableBad.length} 个名字在目标源码文件中全局查无此文案：`);
  for (const x of tableBad) console.log(`   ${x.where}  «${x.name}»  src=${x.src}  — 源码查无：${x.miss.join(' / ')}`);
  console.log('   这类错比画面错更严重：SKILL 第 4 步要求字段名「逐字取自这张表」，表里的假名字会被后续每一片照抄。');
  console.log('   修法：回 ../applet/ 取该行真正的 title/label 原话改表；页面确实没有这一行就删掉它，或标 `onScreen: false` 并写明理由。');
} else {
  const fieldNames = TABLES.reduce((n, { json }) => n + (json.fields || []).filter((f) => f.onScreen !== false).length, 0);
  const groupRows = TABLES.reduce((n, { json }) => n + (json.createGroups || []).reduce((m, g) => m + (g.rows || []).filter((r) => !retiredRows.has(r)).length, 0), 0);
  console.log(`⑤ 真值表自证  ✅ 通过 —— ${TABLES.map((t) => t.tag).join('+')}（共 ${TABLES.length} 表）内 ${fieldNames} 个字段名 + ${groupRows} 个有效分组行名，逐字命中各自目标源码文件`);
}
if (tableMoved.length) {
  console.log('');
  console.log(`⑤b 真值表 src 行号漂移  ⚠️ 证据定位已过期但产品原话仍在源码中 —— ${tableMoved.length} 处（不计失败）：`);
  for (const x of tableMoved.slice(0, 20)) console.log(`   ${x.where}  «${x.name}» 旧src=${x.src}  — 原话已在目标源码文件中找到，建议下次回写最新行号`);
  if (tableMoved.length > 20) console.log(`   ……另有 ${tableMoved.length - 20} 处`);
}
if (tableUnresolved.length) {
  console.log('');
  console.log(`⑤c 真值表里 src 无法自动取证的条目  ⚠️ 需人看一眼 —— ${tableUnresolved.length} 处（不计失败）`);
  for (const x of tableUnresolved.slice(0, 15)) console.log(`   ${x.where}  «${x.name}» src=${x.src} — ${x.why}`);
  if (tableUnresolved.length > 15) console.log(`   ……另有 ${tableUnresolved.length - 15} 处`);
  console.log('   复合名（A / B）会自动拆开取证；仍查不到的多半是我方描述名，建议改成页面原话或标 `onScreen: false`。');
}

console.log('');
if (!couponTypeMap.size) {
  console.log('⑥ 券种↔面额字段配对  ⏭ 跳过 —— 未找到 spec/coupon-fields.json 的 couponTypes');
} else {
  const typeFails = typeMismatch.length + typeMissing.length + undeclared.length;
  if (typeFails) {
    console.log(`⑥ 券种↔面额字段配对  ❌ 硬失败 —— ${typeFails} 处：`);
    for (const x of typeMismatch) console.log(`   ${x.file}  ${x.ui} 声明「${x.couponType}」却用了别券种的面额字段：${x.wrong.join(' / ')}（该券种只允许：${[...couponTypeMap.get(x.couponType)].join(' / ') || '无'}）`);
    for (const x of typeMissing) console.log(`   ${x.file}  ${x.ui} 声明「${x.couponType}」但缺它要求的面额字段：${x.miss.join(' / ')}`);
    for (const x of undeclared) console.log(`   ${x.file}  ${x.ui}  用了面额字段却没声明 couponType：${x.faceUsed.join(' / ')}`);
    console.log('   修法：券种决定面额字段集——改对券种，或把字段换成该券种 faceFields 里的真名（见 coupon-fields.json）；没声明 couponType 的制券屏补上声明。');
  } else {
    const declared = dataFiles.reduce((n, f) => n + extractScenes(readFileSync(join(DATA_DIR, f), 'utf8')).filter((s) => s.couponType).length, 0);
    console.log(`⑥ 券种↔面额字段配对  ✅ 通过 —— ${declared} 个声明了券种的制券屏，面额字段都与券种对得上`);
  }
  if (unknownType.length) {
    console.log(`   ⚠️ 声明的 couponType 不在表里 —— ${unknownType.length} 处：`);
    for (const x of unknownType) console.log(`   ${x.file}  ${x.ui}  «${x.couponType}»`);
  }
}

console.log('');

/* ── ⑦ 图文机检（CHANGE-20260918-030）：video/src/graphic/*.ts 图内字段名逐字回源 ── */
const GRAPHIC_DIR = join(ROOT, 'video', 'src', 'graphic');
const graphicFiles = existsSync(GRAPHIC_DIR) ? readdirSync(GRAPHIC_DIR).filter((f) => f.endsWith('.ts')) : [];
const extractGraphicNames = (text) => {
  const names = new Set();
  for (const m of text.matchAll(/k:\s*\[([^\]]*)\]/g)) for (const s of m[1].matchAll(/'([^']+)'/g)) names.add(s[1]);
  for (const m of text.matchAll(/(?:^|[{,\s])k:\s*'([^']+)'/g)) names.add(m[1]);
  return [...names];
};
const graphicBad = [];
const graphicHidden = [];
let graphicNameTotal = 0;
for (const f of graphicFiles) {
  const text = readFileSync(join(GRAPHIC_DIR, f), 'utf8');
  for (const name of extractGraphicNames(text)) {
    graphicNameTotal++;
    if (retiredRows.has(name)) { graphicHidden.push({ file: f, name }); continue; }
    if (allRows.has(name) || couponTypeMap.has(name)) continue;
    if (corpus.some((c) => c.text.includes(norm(name)))) continue;
    graphicBad.push({ file: f, name });
  }
}
if (!graphicFiles.length) {
  console.log('⑦ 图文机检  ⏭ 跳过 —— video/src/graphic 下暂无数据文件');
} else if (graphicHidden.length || graphicBad.length) {
  console.log(`⑦ 图文机检  ❌ 硬失败 —— ${graphicHidden.length + graphicBad.length} 处：`);
  for (const x of graphicHidden) console.log(`   ${x.file}  图内出现 onScreen:false 字段名 «${x.name}» —— 「行名不上屏」对图文同样生效，改用数值或界面原话`);
  for (const x of graphicBad) console.log(`   ${x.file}  «${x.name}» —— spec 四表与 applet 源码都查无，疑似编造字段名`);
  console.log('   修法：字段名逐字取自 spec/*-fields.json 或回 ../applet/ 取界面原话；实在是我方描述名就不上屏。');
} else {
  console.log(`⑦ 图文机检  ✅ 通过 —— ${graphicFiles.length} 个图文数据文件、${graphicNameTotal} 个图内字段名，逐字命中 spec/券种/applet 源码，无 onScreen:false 名上屏`);
}

console.log('\n────────────────────────────────────────────');
if (missing.length) {
  console.log(`❌ 存在 ${missing.length} 个未取证字段名。商家在后台找不到它，这一屏就等于没教。修完再声明通过。`);
  process.exit(1);
}
if (misfiled.length) {
  console.log(`❌ 存在 ${misfiled.length} 处分组归属错误。字段名逐字对、组名张冠李戴，商家翻后台会卡在"这一组里没这行"。修完再声明通过。`);
  process.exit(1);
}
if (tableBad.length) {
  console.log(`❌ 真值表里有 ${tableBad.length} 个名字在目标产品源码中全局查无此文案（见 ⑤）。这张表是后续每一片抄字段名的源头，它错一片错一片。修完再声明通过。`);
  process.exit(1);
}
if (typeMismatch.length || typeMissing.length || undeclared.length) {
  console.log(`❌ 存在 ${typeMismatch.length + typeMissing.length + undeclared.length} 处券种↔面额字段配对错误（见 ⑥）。券种选错或没声明，商家在后台找不到对应的金额栏，这一屏白教。修完再声明通过。`);
  process.exit(1);
}
if (graphicBad.length || graphicHidden.length) {
  console.log(`❌ 图文机检存在 ${graphicBad.length + graphicHidden.length} 处问题（见 ⑦）。图内字段名直接印给商家看，错一个名字就等于教错。修完再声明通过。`);
  process.exit(1);
}
console.log(`✅ 通过：上屏字段名全部回源码取到原话、分组归属对得上制券页、真值表自证 ${tableTotal} 个有效名字逐字命中目标源码文件、券种↔面额字段配对无误、图文机检 ${graphicNameTotal} 个图内字段名全过。`);
process.exit(0);

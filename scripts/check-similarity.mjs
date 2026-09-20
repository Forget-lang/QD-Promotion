#!/usr/bin/env node
/**
 * scripts/check-similarity.mjs · 整屏结构相似度机检（SKILL 第 2 步主判据：一条视频一套专属 UI 语言）
 *
 * 为什么要有这个脚本：G05 首版设计稿 9 屏里 4 屏复刻上一条 G04 的组件+变体，
 * 而当时 §2.2 的四类指标全是"下限式"（≥3 处不同 / ≤ 屏数−4 / ≥2 屏不同 / "多数屏"才判雷同），
 * 逐条自评全部 ✅ —— 靠人自觉的相似度检查拦不住复用。本脚本把判定改成可计算的数。
 *
 * 口径（2026-08-30 实测校正）：指纹 = `type + #ui`。
 *   ✅ 拦得住：本片某屏照抄了上一片**同名**的 ui（`g07` 直接写 `ui:'g06-make-basic'`）——指纹碰撞判红；
 *      以及"声明了 ui 但 videos/gXX/ 里没有实组件"（防伪层）。
 *   ❌ 拦不住：换掉 `gXX-` 前缀、重做一副一模一样的骨架。因为 ui 按约定必须带前缀，**跨片指纹在数学上永不碰撞**。
 *      负向测试已证实：把 g06 的 12 屏逐屏照抄、只把前缀换成 g07 → 输出「同结构屏 0/12 ✅ 通过」。
 *      （旧口径里的 `layout`/`cardVariant` 两键已随 2026-08-29 共享场景删除，脚本仍保留其归一化分支以防历史数据文件。）
 *   → **跨片结构雷同的真判据是「一屏标杆」**：先做 1 屏渲真图交用户认可才许铺全片。这道机检只是最后一道名字闸。
 *
 * 配色文案不同不算差异（换皮）。所以数据层指纹足以判"结构是否复用"。
 *
 * 用法：node scripts/check-similarity.mjs            # 校验最新一条（data/index.ts 最后一个导出）
 *      node scripts/check-similarity.mjs --all     # 列出全部已产出视频两两重叠（基线取证用）
 *
 * 放行条件：最新一条与任何已产出视频的「同结构屏数」= 0。
 * 例外：在 scripts/ref-registry.json 的 similarityExemptions 里逐条登记
 *      { video, fingerprint, reason, approvedBy }（复用例外提案，须用户批准并登记）。
 */
import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initContentLines, lineOf, gateAppliesFor } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'video/src/data');
const SHOW_ALL = process.argv.includes('--all');
// 统一诊断边界（CHANGE-20260920-031 §3.2.1）：本脚本不再自行解析 ref-registry，
// 声明源不可用/非法一律由 initContentLines 给可读报错 + exit=1。
const { reg: REGISTRY, lines: LINES, industry: industryLine } = initContentLines({ label: 'check-similarity' });

/**
 * 返回 { registered, unregistered }
 *  - registered：按 data/index.ts 的导出顺序（行业线"最新一条"仍以这里最后一个为准）
 *  - unregistered：data/ 里存在但没进注册链的 .ts —— B3.3 返修点 2：
 *    旧实现只读 index，未注册的 f*.ts 对本闸门**完全不可见**，
 *    会让 §3.2.1 的硬顺序与负向测试 11 落空（放进去却无人报警）。
 */
function loadVideos() {
  const idx = readFileSync(join(DATA_DIR, 'index.ts'), 'utf8');
  const order = [...idx.matchAll(/export\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/([\w.-]+)'/g)]
    .map((m) => ({ key: m[1], file: m[2] }));
  const registered = order.map(({ key, file }) => {
    const src = readFileSync(join(DATA_DIR, `${file}.ts`), 'utf8');
    const id = (src.match(/\bid:\s*'([^']+)'/) || [, key])[1];
    const hookStyle = (src.match(/hookStyle:\s*'([\w-]+)'/) || [])[1] ?? null;
    // 按 `type: '...'` 出现的位置切块：每块 = 该屏到下一屏之间的文本（不依赖缩进层级）
    const marks = [...src.matchAll(/^\s*type:\s*'([\w-]+)'/gm)].map((m) => ({ i: m.index, type: m[1] }));
    const screens = marks.map((mk, n) => {
      const b = src.slice(mk.i, marks[n + 1] ? marks[n + 1].i : src.length);
      const layoutRaw = (b.match(/\blayout:\s*'([\w-]+)'/) || [])[1];
      const cardVariantRaw = (b.match(/\bcardVariant:\s*'([\w-]+)'/) || [])[1];
      // 规范化：'vertical' / 'border-left' 是各组件的缺省分支，显式写出来与不写是同一种结构
      //（不归一会被"多写一个冗余 layout"绕过闸门）
      const layout = layoutRaw === 'vertical' ? undefined : layoutRaw;
      const cardVariant = cardVariantRaw === 'border-left' ? undefined : cardVariantRaw;
      const ui = (b.match(/\bui:\s*'([\w-]+)'/) || [])[1];
      const t = mk.type === 'hook' && hookStyle ? `hook:${hookStyle}` : mk.type;
      // ui = 本片专属渲染器名（SKILL §三工程约定）：有 ui 时画面结构由它决定，type 只是叙事槽位 → 参与指纹
      const fp = [t, ui ? `#${ui}` : null, layout, cardVariant].filter(Boolean).join('/');
      return { fp, type: mk.type, ui };
    });
    if (!screens.length) { console.error(`❌ ${file}.ts 未解析到任何屏（type: 字段没匹配上）——拒绝在解析失败时放行`); process.exit(1); }
    return { key, id, screens };
  });
  const registeredFiles = new Set(order.map((o) => `${o.file}.ts`));
  const unregistered = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !registeredFiles.has(f))
    .map((f) => ({ id: f.replace(/\.ts$/, ''), file: f }));
  return { registered, unregistered };
}

const { registered: videos, unregistered } = loadVideos();
if (!videos.length) {
  // 防伪：只有 data/ 确实没有视频文件才算"基线为空"；有文件却解析出 0 屏 = 解析 bug，必须报错
  const dataFiles = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  if (dataFiles.length) { console.error(`❌ data/ 有 ${dataFiles.length} 个文件却一屏都没解析出来（格式变了？），拒绝静默放行`); process.exit(1); }
  console.log('✅ 暂无已产出视频（2026-08-29 清零重启），结构重复基线为空——新视频之间自当比对');
  process.exit(0);
}

/** 按 ref-registry.contentLines 给每条视频判线；判不了 = 硬失败（拒绝"猜成行业线"或静默排除） */
function classifyLine(v) {
  return lineOf(v.id, LINES) || lineOf(v.key, LINES);
}
function applySimCheck(vs) {
  const newest = vs[vs.length - 1];
  const others = vs.slice(0, -1);
  const exemptions = new Map((REGISTRY.similarityExemptions || [])
    .filter((e) => e.video === newest.id).map((e) => [e.fingerprint, e]));

  const seen = new Map();
  others.forEach((v) => v.screens.forEach((s) => {
    if (!seen.has(s.fp)) seen.set(s.fp, []);
    seen.get(s.fp).push(`${v.id}`);
  }));
  return { newest, others, exemptions, seen };
}

/**
 * 内容线门状态检查（B3.3 返修点 1：抽成单一函数，--all 与主判定共用同一道判定）。
 * CHANGE-20260920-031 B3.3：现行指纹（`type + #ui`）、"index 最后一个导出 = 最新一条"、
 * 防伪组件层与 similarityExemptions 全部长在**行业线生产方法**上（一条视频一套专属 UI 语言）。
 * 因此只对声明为 APPLY 的线执行；其他线一律显式暴露状态——
 * 既不得被 filter 静默丢弃（等于把教程片放进比对却不吭声），也不得机械套行业判据去裁教程内容。
 */
function collectGateFailures(items) {
  const failures = [];
  for (const v of items) {
    if (!classifyLine(v)) {
      failures.push(`${v.id}（导出名 ${v.key || v.file}）｜无法判定内容线 —— ref-registry.contentLines 未覆盖该片号形态，拒绝猜线`);
    }
  }
  for (const l of LINES) {
    if (!industryLine || l.id === industryLine.id) continue;
    const group = items.filter((v) => { const c = classifyLine(v); return c && c.id === l.id; });
    if (!group.length) continue;
    const applies = gateAppliesFor(REGISTRY, 'check-similarity', l);
    if (applies === 'APPLY') {
      failures.push(`${group.map((i) => i.id).join('、')}｜内容线「${l.label}」被声明为 APPLY，但本闸门的跨片指纹约定（ui 必须带 gXX- 前缀）与防伪层只实现于行业线 —— 拒绝假装跨线通用，请为该线定义自己的结构判据`);
    } else if (applies === 'OWNER_PENDING') {
      failures.push(`${group.map((i) => i.id).join('、')}｜内容线「${l.label}」在本闸门为 OWNER_PENDING —— 该线防换皮判据的权威 Owner 尚未建立，先立 Owner 再产出（不放行、不静默跳过）`);
    } else {
      console.log(`📤 ${group.map((i) => i.id).join('、')}｜${applies}（声明源：ref-registry.gateApplicability.gateOverrides['check-similarity']['${l.id}']）`);
    }
  }
  for (const u of unregistered) {
    const l = lineOf(u.id, LINES);
    failures.push(`${u.file}｜存在于 data/ 但未注册进 data/index.ts（线：${l ? l.label : '无法判定'}）—— 拒绝让它对本闸门静默不可见；要么完成注册链，要么移走该文件`);
  }
  return failures;
}

const gateFailures = collectGateFailures(videos);

// --all 是基线取证模式，但同样不得跨内容线比较（返修点 1）：按线分组输出。
if (SHOW_ALL) {
  console.log('=== 全部已产出视频的整屏结构指纹（按内容线分组） ===');
  for (const v of videos) console.log(`${v.id.padEnd(24)} ${v.screens.length} 屏: ${v.screens.map(s => s.fp).join(' → ')}`);
  const groups = new Map();
  for (const v of videos) {
    const l = classifyLine(v);
    if (!l) continue;                       // 判不了线由 gateFailures 报告
    if (!groups.has(l.id)) groups.set(l.id, { label: l.label, items: [] });
    groups.get(l.id).items.push(v);
  }
  for (const [lineId, g] of groups) {
    const vs = g.items;
    console.log(`\n=== 两两同结构屏｜内容线：${g.label}（${lineId}）—— 跨线不比较 ===`);
    for (let i = 0; i < vs.length; i++)
      for (let j = i + 1; j < vs.length; j++) {
        const prev = new Map(); vs[i].screens.forEach((s, n) => prev.set(s.fp, (prev.get(s.fp) || []).concat(n + 1)));
        const hits = vs[j].screens.map((s, n) => [s.fp, n + 1, prev.get(s.fp)]).filter(([, , p]) => p);
        if (hits.length)
          console.log(`${vs[j].id} vs ${vs[i].id}: ${hits.map(([fp, n, p]) => `S${n}=${fp}(对 ${vs[i].id} S${p.join('/')})`).join('; ')}`);
      }
  }
  if (gateFailures.length) {
    console.log('\n④ 内容线适用性 / 注册链  ❌ 硬失败：');
    for (const x of gateFailures) console.log(`   ❌ ${x}`);
  }
  process.exit(gateFailures.length ? 1 : 0);
}

if (gateFailures.length) {
  console.log(`\n══════════════ 整屏结构相似度机检（SKILL 第 2 步）══════════════`);
  console.log(`\n④ 内容线适用性  ❌ 硬失败 —— ${gateFailures.length} 处：`);
  for (const x of gateFailures) console.log(`   ❌ ${x}`);
  console.log('   依据：CHANGE-20260920-031 §3.2.1 五态与硬顺序（先立 Owner，再出现该线数据文件）。');
  process.exit(1);
}
if (!industryLine) { console.error('❌ check-similarity：ref-registry 未声明 industry 内容线'); process.exit(1); }

/** 防伪：声明了 ui 就必须有真组件（只改 ui 名仍指回共享组件 = 绕过闸门） */
function checkBespoke(video) {
  const needs = video.screens.map((s, i) => ({ ...s, n: i + 1 })).filter((s) => s.ui);
  if (!needs.length) return { missing: [], noDir: false };
  const dir = join(ROOT, 'video/src/videos', video.key);
  let idx = '';
  try { idx = readFileSync(join(dir, 'index.tsx'), 'utf8'); }
  catch { return { missing: needs.map((s) => s.ui), noDir: true }; }
  return { missing: needs.filter((s) => !new RegExp(`\\b${s.ui.replaceAll('-', '\\-')}\\b`).test(idx)), noDir: false };
}

// 行业线内部语义保持不变：仍按 data/index.ts 的导出顺序取"本线最新一条"（registry 已声明
// dataIndexOrderIsLineOrder=true for industry），基线 = 同线其余全部 → 与 Stage A 基线逐字一致。
const industryVideos = videos.filter((v) => { const c = classifyLine(v); return c && c.id === industryLine.id; });
if (!industryVideos.length) {
  console.log('✅ 行业线暂无已产出视频（2026-08-29 清零重启），结构重复基线为空——新视频之间自当比对');
  process.exit(0);
}
const { newest, others, exemptions, seen } = applySimCheck(industryVideos);
const dups = newest.screens.map((s, i) => ({ ...s, n: i + 1 })).filter((s) => seen.has(s.fp));
const unexempted = dups.filter((d) => !exemptions.has(d.fp));

console.log(`\n══════════════ 整屏结构相似度机检（SKILL 第 2 步）══════════════`);
console.log(`待检: ${newest.id}（${newest.screens.length} 屏）｜基线: ${others.map((v) => v.id).join(' / ') || '无'}`);
console.log(`结构指纹: ${newest.screens.map((s, i) => `S${i + 1} ${s.fp}`).join('  ')}`);
console.log(`\n同结构屏（与任一已产出视频）: ${dups.length} / ${newest.screens.length}`);
for (const d of dups) {
  const ex = exemptions.get(d.fp);
  console.log(`  S${d.n}  ${d.fp.padEnd(26)} 与 ${[...new Set(seen.get(d.fp))].join(' / ')}` +
    (ex ? `  ⚠️ 已登记例外（${ex.approvedBy || '未记批准人'}：${ex.reason}）` : '  ❌ 未批例外'));
}
console.log('\n────────────────────────────────────────────');
const bespoke = checkBespoke(newest);
if (newest.screens.some((s) => s.ui)) {
  if (bespoke.noDir) console.log(`❌ 防伪：${newest.screens.filter((s) => s.ui).length} 屏声明了 ui，但 video/src/videos/${newest.key}/index.tsx 不存在（只写 ui 名没有真组件 = 绕过闸门）`);
  else if (bespoke.missing.length) console.log(`❌ 防伪：ui 名在 video/src/videos/${newest.key}/index.tsx 中找不到 → ${bespoke.missing.join(', ')}`);
  else console.log(`✅ 防伪：${newest.screens.filter((s) => s.ui).length} 个 ui 渲染器均有实组件（videos/${newest.key}/）`);
} else {
  console.log(`❌ 本片有数据但一屏都没写 ui——ui 必填（2026-08-29 起共享场景已删、无回退）；每屏写 ui:'gXX-名字' 并在 scenes/index.tsx 的 VIDEO_RENDERERS 注册`);
}
const noUiFail = newest.screens.length > 0 && !newest.screens.some((s) => s.ui);
const bespokeFail = bespoke.noDir || bespoke.missing.length > 0;
if (unexempted.length || bespokeFail || noUiFail) {
  if (unexempted.length) {
    console.log(`❌ 不通过：${unexempted.length} 屏复用了已有视频的结构。`);
    console.log('   处理：回 SKILL 第 2 步定本片视觉基线 → 新建本片专属场景组件（videos/gXX/ + 屏上 ui）重做这些屏；');
  }
  if (bespokeFail) console.log('❌ 不通过：声明了 ui 却没有对应实组件（见上）。');
  console.log('   确实不可替代的，在 scripts/ref-registry.json similarityExemptions 逐条登记理由并经用户批准。');
  process.exit(1);
}
console.log(dups.length
  ? `✅ 通过（${dups.length} 处重复均已登记例外批准）`
  : others.length
    ? '✅ 通过：与全部已产出视频零同结构屏'
    : '✅ 通过（注意：基线只有本片一支，无对照物，此绿不证明跨片不雷同——结构像不像按一屏标杆逐张看真图判，见 SKILL §三）');

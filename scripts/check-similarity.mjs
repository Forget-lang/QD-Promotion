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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'video/src/data');
const REGISTRY = JSON.parse(readFileSync(join(ROOT, 'scripts/ref-registry.json'), 'utf8'));
const SHOW_ALL = process.argv.includes('--all');

/** 按 data/index.ts 的导出顺序返回 [{ key, file, id, screens[] }] —— 最后一个 = 最新一条 */
function loadVideos() {
  const idx = readFileSync(join(DATA_DIR, 'index.ts'), 'utf8');
  const order = [...idx.matchAll(/export\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/([\w.-]+)'/g)]
    .map((m) => ({ key: m[1], file: m[2] }));
  return order.map(({ key, file }) => {
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
}

const videos = loadVideos();
if (!videos.length) {
  // 防伪：只有 data/ 确实没有视频文件才算"基线为空"；有文件却解析出 0 屏 = 解析 bug，必须报错
  const dataFiles = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  if (dataFiles.length) { console.error(`❌ data/ 有 ${dataFiles.length} 个文件却一屏都没解析出来（格式变了？），拒绝静默放行`); process.exit(1); }
  console.log('✅ 暂无已产出视频（2026-08-29 清零重启），结构重复基线为空——新视频之间自当比对');
  process.exit(0);
}

if (SHOW_ALL) {
  console.log('=== 全部已产出视频的整屏结构指纹 ===');
  for (const v of videos) console.log(`${v.id.padEnd(24)} ${v.screens.length} 屏: ${v.screens.map(s => s.fp).join(' → ')}`);
  console.log('\n=== 两两同结构屏 ===');
  for (let i = 0; i < videos.length; i++)
    for (let j = i + 1; j < videos.length; j++) {
      const prev = new Map(); videos[i].screens.forEach((s, n) => prev.set(s.fp, (prev.get(s.fp) || []).concat(n + 1)));
      const hits = videos[j].screens.map((s, n) => [s.fp, n + 1, prev.get(s.fp)]).filter(([, , p]) => p);
      if (hits.length)
        console.log(`${videos[j].id} vs ${videos[i].id}: ${hits.map(([fp, n, p]) => `S${n}=${fp}(对 ${videos[i].id} S${p.join('/')})`).join('; ')}`);
    }
  process.exit(0);
}

const newest = videos[videos.length - 1];
const others = videos.slice(0, -1);
const exemptions = new Map((REGISTRY.similarityExemptions || [])
  .filter((e) => e.video === newest.id).map((e) => [e.fingerprint, e]));

const seen = new Map();
others.forEach((v) => v.screens.forEach((s) => {
  if (!seen.has(s.fp)) seen.set(s.fp, []);
  seen.get(s.fp).push(`${v.id}`);
}));

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
  : '✅ 通过：与全部已产出视频零同结构屏');

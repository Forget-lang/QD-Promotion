#!/usr/bin/env node
/**
 * check-voice-brand.mjs —— 口播品牌点检（画面零品牌 · 口播必提一次）
 *
 * 判据（2026-09-11 用户三次拍板，见 spec/redlines.json rules.brand_display）：
 *   g10 及以后新片：品牌名「券到卡包」画面/结构层 = 0 次、口播字幕（subtitles[].text，口播真源）= 1 次。
 *   历史 g06-g09 已发布片豁免、不回改。
 *   「画面零品牌」靠 C-18 判据 + 验收帧人工闸门兜底，本脚本只补机检：
 *     - 画面/结构层（注释与 subtitles 之外）出现品牌名 → 硬失败；
 *     - 口播字幕一次不出现 → 硬失败（引流归零）；
 *     - 口播字幕出现 >1 次 → 软提示（重复强调，不计硬失败）。
 *   未落 subtitles 的片（尚在有声制作前）只查「画面零品牌」，口播必提在「做字幕」那一步兜住。
 * 用法：node scripts/check-voice-brand.mjs
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getContentLines, lineOf, loadRegistry, gateAppliesFor } from './content-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(ROOT, 'video', 'src', 'data');
const BRAND = '券到卡包';
const EXEMPT = new Set(['g06', 'g07', 'g08', 'g09']);
const LINES = getContentLines();
const REG = loadRegistry();

const files = readdirSync(dataDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .sort();

const hardFails = [];
const softNotes = [];
const exemptLogs = [];
const declared = [];
let checked = 0;

for (const f of files) {
  // CHANGE-20260920-031：原写法 `key = /g\d{2}/.exec(f); if (!key) continue;`
  // 会把非行业内容线**静默排除**出本闸门——现改为按声明判线：
  // 判不了线 = 硬失败（不再猜成"不归我管"）；未建立 Owner 的线 = 显式 OWNER_PENDING。
  const base = f.replace(/\.ts$/i, '');
  const line = lineOf(base, LINES);
  if (!line) {
    hardFails.push(`${f}｜无法判定内容线（ref-registry.contentLines 未覆盖该片号形态）—— 拒绝静默跳过，请补声明或改名`);
    continue;
  }
  let applies;
  try {
    applies = gateAppliesFor(REG, 'check-voice-brand', line);
  } catch (e) {
    // 声明非法（枚举外取值等）：报可读错误并停，不抛未捕获堆栈——让 gate-all 能显示可诊断的一行
    console.error(`❌ check-voice-brand：内容线声明非法 —— ${e.message}`);
    console.error('   修法：校正 ref-registry.gateApplicability / contentLines，取值须在 gateApplicability.values 已注册枚举内。');
    process.exit(1);
  }
  if (applies === 'OWNER_PENDING') {
    hardFails.push(`${f}｜本闸门对内容线「${line.label}」为 OWNER_PENDING —— 该线画面/口播品牌口径的权威 Owner 尚未建立，先立 Owner 再产出，不放行也不静默跳过`);
    continue;
  }
  if (applies === 'N/A') {
    declared.push(`${f}｜N/A（声明源：ref-registry.gateApplicability.gateOverrides['check-voice-brand']['${line.id}']）`);
    continue;
  }
  const key = base.toLowerCase();  // 片号即文件名去扩展名；不再用 /g\d{2}/ 在文件名里"捞"编号

  const src = readFileSync(join(dataDir, f), 'utf8');
  // 剥离注释，避免注释里的引文误判画面层
  const noComment = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // 口播字幕真值：subtitles 块内所有 text
  const blocks = [...noComment.matchAll(/subtitles\s*:\s*\[([\s\S]*?)\]/g)].map((m) => m[1]);
  let voiceCount = 0;
  for (const block of blocks) {
    for (const m of block.matchAll(/text\s*:\s*['"`]([^'"`]*)['"`]/g)) {
      voiceCount += (m[1].match(new RegExp(BRAND, 'g')) || []).length;
    }
  }

  // 画面/结构层 = 去注释后、去 subtitles 块后的剩余源码
  const uiSrc = noComment.replace(/subtitles\s*:\s*\[[\s\S]*?\]/g, '');
  const uiCount = (uiSrc.match(new RegExp(BRAND, 'g')) || []).length;

  if (EXEMPT.has(key)) {
    exemptLogs.push(`${f}（历史片，豁免不回改；画面层命中 ${uiCount}、口播命中 ${voiceCount} 仅记账）`);
    continue;
  }

  checked += 1;
  if (uiCount > 0) {
    hardFails.push(`${f}｜画面/结构层出现品牌名「${BRAND}」 ${uiCount} 次（画面零品牌，见 C-18）`);
  }
  if (blocks.length === 0) continue; // 还没做字幕，口播必提后置到做字幕那一步
  if (voiceCount === 0) {
    hardFails.push(`${f}｜口播字幕「${BRAND}」零提及（引流归零，C-18 硬义务：口播必提一次）`);
  } else if (voiceCount > 1) {
    softNotes.push(`${f}｜口播字幕「${BRAND}」出现 ${voiceCount} 次（超出「仅一次」，重复强调，建议收敛）`);
  }
}

if (hardFails.length) {
  console.log(`❌ 口播品牌点检（画面零品牌 · 口播必提一次）硬失败：`);
  for (const x of hardFails) console.log(`   ❌ ${x}`);
  process.exit(1);
}
if (softNotes.length) {
  console.log('⚠️ 口播品牌点检软提示（不计硬失败）：');
  for (const x of softNotes) console.log(`   ${x}`);
}
if (declared.length) {
  console.log('📤 显式声明不适用于本闸门的内容线（非静默跳过）：');
  for (const x of declared) console.log(`   ${x}`);
}
if (exemptLogs.length) {
  console.log('⏭️ 历史片豁免（不回改）：');
  for (const x of exemptLogs) console.log(`   ${x}`);
}
console.log(`✅ 口播品牌点检通过：新片（g10+）画面零品牌名、口播必提「${BRAND}」一次${checked ? `（已检 ${checked} 片）` : '（暂无声字幕片，口播必提在做字幕时兜住）'}。`);
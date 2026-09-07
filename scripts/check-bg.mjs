#!/usr/bin/env node
/**
 * scripts/check-bg.mjs · 背景底强制闸门（SKILL 第 2 步 / §五：每条视频必须真用一张背景图打底）
 *
 * 为什么要它（2026-09-04 用户拍板）：g07/g08 都跳过了 §五「选背景底」——没设 style.bgImage、
 * 各自手写同系深棕程序化 Ambient，导致跨片视觉重复；而「换语言五轴」与 check-similarity 只查结构、
 * 不查背景底，这类问题反复出现且机器查不出。本闸把「每片必须设 bgImage 且指向真实存在的图片」变成可计算的硬判据。
 *
 * 判据（对 data/index.ts 里每一条视频）：
 *   ① style 块必须声明非空 `bgImage: '...'`；
 *   ② 该路径（相对 video/public，即 staticFile 根）指向的文件必须真实存在、且是图片扩展名。
 * 任一不满足 = 硬失败（红灯不产出、不交付）。
 * 例外：已交付/已裁、当时未用背景图的历史片，在 scripts/ref-registry.json 的 bgExemptions 里登记
 *   { video, reason, approvedBy } 转「已豁免」不阻断（数字照实打印）；新片不得走豁免。
 *
 * 用法（项目根运行）：node scripts/check-bg.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'video/src/data');
const PUBLIC_DIR = join(ROOT, 'video/public');
const REGISTRY = JSON.parse(readFileSync(join(ROOT, 'scripts/ref-registry.json'), 'utf8'));
const IMG_EXT = /\.(png|jpe?g|webp)$/i;

/** 按 data/index.ts 导出顺序读每条视频的 bgImage 声明 */
function loadVideos() {
  const idx = readFileSync(join(DATA_DIR, 'index.ts'), 'utf8');
  const order = [...idx.matchAll(/export\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/([\w.-]+)'/g)]
    .map((m) => ({ key: m[1], file: m[2] }));
  return order.map(({ key, file }) => {
    const src = readFileSync(join(DATA_DIR, `${file}.ts`), 'utf8');
    const id = (src.match(/\bid:\s*'([^']+)'/) || [, key])[1];
    const bg = (src.match(/\bbgImage:\s*'([^']*)'/) || [])[1]; // undefined = 未声明；'' = 声明了但空
    return { key, id, bg };
  });
}

const videos = loadVideos();
const exemptions = new Map((REGISTRY.bgExemptions || []).map((e) => [String(e.video).toLowerCase(), e]));

console.log('\n══════════════ 背景底强制闸门（SKILL 第 2 步 / §五）══════════════\n');

if (!videos.length) {
  console.log('✅ 暂无已产出视频（data/index.ts 无导出），背景底基线为空——新片建数据文件时必设 bgImage。');
  process.exit(0);
}

let hardFail = 0;
let exempted = 0;
for (const v of videos) {
  const ex = exemptions.get(v.id.toLowerCase());
  if (v.bg && v.bg.trim()) {
    const abs = join(PUBLIC_DIR, v.bg);
    const exists = existsSync(abs);
    const isImg = IMG_EXT.test(v.bg);
    if (exists && isImg) {
      console.log(`✅ ${v.id.padEnd(8)} bgImage = ${v.bg}`);
    } else {
      console.log(`❌ ${v.id.padEnd(8)} bgImage = ${v.bg} —— ${!isImg ? '非图片扩展名' : '文件不存在（video/public 下找不到）'}`);
      hardFail++;
    }
  } else if (ex) {
    console.log(`⏭️ ${v.id.padEnd(8)} 未设 bgImage —— 已登记豁免（${ex.approvedBy || '未记批准人'}）：${ex.reason}`);
    exempted++;
  } else {
    console.log(`❌ ${v.id.padEnd(8)} 未声明 bgImage —— 每条视频必须选一张背景图打底（写进 data/${v.key}.ts 的 style.bgImage，指向 video/public 下真实存在的图片）；不得用手写程序化纯色/渐变底替代。`);
    hardFail++;
  }
}

console.log('\n────────────────────────────────────────────');
if (hardFail) {
  console.log(`❌ ${hardFail} 条视频背景底不合规。处理：回 SKILL 第 2 步/§五 选一张背景底入库并写 bgImage；`);
  console.log('   仅已交付/已裁的历史片可在 scripts/ref-registry.json 的 bgExemptions 登记豁免（须用户批准），新片不得走豁免。');
  process.exit(1);
} else {
  console.log(`✅ 全部 ${videos.length} 条视频背景底合规${exempted ? `（含 ${exempted} 条已登记豁免的历史片）` : ''}。`);
  process.exit(0);
}

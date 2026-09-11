#!/usr/bin/env node
/**
 * check-voice-discipline.mjs —— 口播文字纪律机检（数字中文）
 *
 * 判据：口播数字一律中文（"三天"非"3 天"）。多音字歧义改词避开属人判软尺，不在本脚本范围。
 * 扫描面：video/src/data/*.ts 的 subtitles[].text（口播真源）。画面 payload 里的数字（示例值、
 * 上限、次数）不属于口播层，不扫——本脚本只守"嘴上念出来的数字"。
 * 用法：node scripts/check-voice-discipline.mjs
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(ROOT, 'video', 'src', 'data');

const files = readdirSync(dataDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .sort();

const fails = [];
for (const f of files) {
  const src = readFileSync(join(dataDir, f), 'utf8');
  // subtitles 是每个 scene 的最后一个字段（后紧跟 ]），非贪婪提块后取块内 text
  const blocks = [...src.matchAll(/subtitles\s*:\s*\[([\s\S]*?)\]/g)].map((m) => m[1]);
  for (const block of blocks) {
    for (const m of block.matchAll(/text\s*:\s*['"`]([^'"`]*)['"`]/g)) {
      const text = m[1];
      if (/[0-9]/.test(text)) fails.push(`${f}｜${text.trim()}`);
    }
  }
}

if (fails.length) {
  console.log('❌ 口播文字纪律（数字中文）硬失败——口播数字须写中文：');
  for (const x of fails) console.log(`   ❌ ${x}`);
  process.exit(1);
}
console.log(`✅ 口播文字纪律（数字中文）通过：${files.length} 个 data 文件口播字幕数字均为中文。`);
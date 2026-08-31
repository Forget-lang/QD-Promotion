#!/usr/bin/env node
/**
 * list-assets.mjs —— 视频视觉资产盘点（真源 = 代码）
 *
 * 用途：新会话开工 / 设计稿创建前运行一次，获取当前全量资产清单。
 *   组件/变体/手法落地状态以本脚本输出为准——文档里的静态状态列是快照，会落后于代码。
 * 用法（项目根运行）：
 *   node scripts/list-assets.mjs
 *
 * 输出（stdout，Markdown）：
 *   1. 场景组件（共享场景层 08-29 起冻结删除，此节常态为空；每片屏组件在 videos/gXX/）
 *   2. 原子组件（动画 / UI / 氛围）
 *   3. 风格维度（色板键 / 图标键）
 *   4. 已产出视频数据（场景序列 + 风格键值，相似度比对基线从这里取）
 *   5. 封面组件与排版参照图
 *   6. 每条视频的专属屏（video/src/videos/gXX/，一条视频一套 UI 语言的落点）
 *   7. 排版参照图（outputs/样本库/，分镜设计借排版用）
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const videoSrc = join(root, 'video', 'src');
const read = (p) => readFileSync(p, 'utf8');

const lines = [];
const out = (s = '') => lines.push(s);

// ── 1. 场景组件（注册表）──
const indexSrc = read(join(videoSrc, 'scenes', 'index.tsx'));
const registered = [...indexSrc.matchAll(/case\s+'([^']+)':\s*content\s*=\s*<(\w+)/g)]
  .map(([, type, comp]) => ({ type, comp }));

out('# 视频视觉资产盘点（真源 = 代码）');
out();
out(`> 生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })} ｜ 生成方式：\`node scripts/list-assets.mjs\``);
out('> 设计稿「组件核对」以本清单为准；文档静态状态列仅为快照。');
out();
out('## 1. 场景组件（SceneRenderer 已注册）');
out();
// 2026-08-31 修：共享场景层已随 08-29 清零删除（ui 必填、无按 type 回退），此表常态为空；
// 空表不再打已废止的 layout/cardVariant 变体列头，改输出冻结说明，避免误读"还有共享场景件"
if (!registered.length) {
  out('（无）——共享场景层已冻结删除（2026-08-29 清零：ui 必填、缺了直接抛错，无按 type 回退）。');
  out('每条视频的屏组件在 `video/src/videos/gXX/`（见下方 §6），不在共享层注册。');
} else {
  out('| type | 组件 |');
  out('|---|---|');
  for (const { type, comp } of registered) out(`| \`${type}\` | ${comp} |`);
}

out();

// ── 2. 原子组件 ──
const exportsOf = (file) => {
  const src = read(join(videoSrc, 'components', `${file}.tsx`));
  return [...new Set([...src.matchAll(/export\s+(?:const|function)\s+(\w+)/g)].map(([, n]) => n))]
    .filter((n) => !/^[A-Z_]+$/.test(n) || file !== 'ui'); // ui.tsx 的全大写常量单列
};
const constsOf = (file) => {
  const src = read(join(videoSrc, 'components', `${file}.tsx`));
  return [...new Set([...src.matchAll(/export\s+const\s+([A-Z_][A-Z0-9_]*)\s*=/g)].map(([, n]) => n))];
};

out();
out('## 2. 原子组件（components/）');
out();
out(`- **动画**（animations.tsx）：${exportsOf('animations').map((n) => `\`${n}\``).join('、')}`);
out(`- **UI**（ui.tsx）：${exportsOf('ui').map((n) => `\`${n}\``).join('、')}`);
out(`- **氛围**（background.tsx）：${exportsOf('background').map((n) => `\`${n}\``).join('、')}`);
const uiConsts = constsOf('ui');
if (uiConsts.length) out(`- **UI 常量**（ui.tsx）：${uiConsts.map((n) => `\`${n}\``).join('、')}`);

// ── 3. 风格维度 ──
const paletteSrc = read(join(videoSrc, 'palette.ts'));
const palettesBlock = paletteSrc.slice(paletteSrc.indexOf('export const PALETTES'));
const palettes = [...palettesBlock.matchAll(/^\s*'([^']+)'\s*:\s*\{/gm)].map(([, k]) => k);
const iconsSrc = read(join(videoSrc, 'components', 'icons.tsx'));
const iconUnion = iconsSrc.match(/export type IconKey\s*=\s*([\s\S]*?);/);
const icons = iconUnion ? [...iconUnion[1].matchAll(/'([^']+)'/g)].map(([, v]) => v) : [];

out();
out('## 3. 风格维度');
out();
out(`- **色板**（palette.ts PALETTES，${palettes.length} 套）：${palettes.map((k) => `\`${k}\``).join('、')}`);
out(`- **图标**（icons.tsx IconKey，${icons.length} 个）：${icons.map((k) => `\`${k}\``).join('、')}`);

// ── 4. 已产出视频数据 ──
out();
out('## 4. 已产出视频（data/，相似度比对基线取最新一条）');
out();
const dataDir = join(videoSrc, 'data');
const dataFiles = readdirSync(dataDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort();
for (const f of dataFiles) {
  const src = read(join(dataDir, f));
  const pick = (re) => (src.match(re) || [])[1] || '?';
  const id = pick(/id:\s*'([^']+)'/);
  const sceneTypes = [...src.matchAll(/type:\s*'([^']+)'/g)].map(([, t]) => t);
  const style = ['palette', 'motion', 'transition', 'hookStyle']
    .map((k) => `${k}=${pick(new RegExp(`${k}:\\s*'([^']+)'`))}`)
    .join('，');
  out(`- **${id}**（\`data/${f}\`）：${style}`);
  out(`  - 场景序列（${sceneTypes.length} 屏）：${sceneTypes.join(' → ')}`);
}

// ── 5. 封面与参照图 ──
out();
out('## 5. 封面组件与排版参照图');
out();
const coversDir = join(videoSrc, 'covers');
if (existsSync(coversDir)) {
  for (const f of readdirSync(coversDir).filter((f) => f.endsWith('.tsx')).sort()) {
    const comps = [...read(join(coversDir, f)).matchAll(/export\s+const\s+(\w+)/g)].map(([, n]) => n);
    out(`- \`covers/${f}\`：${comps.join('、')}`);
  }
}
const refDir = join(root, 'outputs', 'archive', '排版参考');
if (existsSync(refDir)) {
  const refs = readdirSync(refDir).filter((f) => !f.startsWith('.')).sort();
  out(`- **排版参照图**（outputs/archive/排版参考/，${refs.length} 张）：${refs.join('、')}`);
}

// ── 6. 每条视频的专属屏（一条视频一套 UI 语言）──
out();
out('## 6. 每条视频的专属屏（videos/gXX/）');
out();
const videosDir = join(videoSrc, 'videos');
if (existsSync(videosDir)) {
  for (const d of readdirSync(videosDir).sort()) {
    const dir = join(videosDir, d);
    const files = readdirSync(dir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts')).sort();
    out(`- **${d}**（${files.length} 个文件）：${files.join('、')}`);
  }
} else {
  out('（videos/ 目录未建）');
}

// ── 7. 排版参照图 ──
out();
out('## 7. 排版参照图（outputs/样本库/，只借排版不取内容）');
out();
const sampleDir = join(root, 'outputs', '样本库');
if (existsSync(sampleDir)) {
  const refs = readdirSync(sampleDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  out(`${refs.length} 张：${refs.join('、')}`);
} else {
  out('（outputs/样本库/ 未建）');
}

// ── 8. 素材登记视图（真源 = spec/assets.json）──
out();
out('## 8. 素材登记视图（真源 = spec/assets.json）');
out();
const assetsFile = join(root, 'spec', 'assets.json');
if (existsSync(assetsFile)) {
  const assets = JSON.parse(read(assetsFile));
  out('### A 级 · 抽象背景模板（视频背景优先用）');
  out();
  out('| 编号 | 名称 | 色系 | 深字 | 状态 |');
  out('|---|---|---|---|---|');
  for (const bg of assets.A.abstract) {
    out(`| ${bg.id} | ${bg.name} | ${bg.colorScheme} | ${bg.darkText ? '是（浅底）' : '否'} | ${bg.status} |`);
  }
  for (const d of assets.A.abstractDeleted) out(`> 🚫 ${d.id} ${d.name} 已删除（${d.deletedAt}），${d.ban}；替代：${d.replacement}`);
  out();
  const caution = assets.A.xhs.filter((x) => x.caution);
  out(`- **A 级 · 小红书风格背景**：${assets.A.xhs.length} 张已登记（图文封面/配图氛围用）${caution.length ? `；⚠️ 慎用：${caution.map((x) => `${x.id}（${x.caution}）`).join('、')}` : ''}`);
  out(`- **B 级**：${assets.B.map((b) => `${b.id} ${b.name}（${b.status}）`).join('、')}`);
  out(`- **C 级字体**（已 bundle）：${assets.C.map((f) => f.font).join('、')}`);
  const dTotal = assets.D.categories.reduce((n, c) => n + c.files.length, 0) + assets.D.banned.wecom.files.length + assets.D.banned.wechatSearch.files.length;
  out(`- **D 级截图**（${assets.D.dir}${dTotal} 张登记）：配图先查分类表；🚫 企微系 ${assets.D.banned.wecom.files.length} 张 + 微信搜索 ${assets.D.banned.wechatSearch.files.length} 张三平台禁用`);
} else {
  out('（spec/assets.json 未建）');
}

console.log(lines.join('\n'));

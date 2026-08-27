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
 *   1. 场景组件（已注册 type + 各文件实现的 layout/cardVariant 变体）
 *   2. 原子组件（动画 / UI / 氛围）
 *   3. 风格维度（色板键 / 图标键）
 *   4. 已产出视频数据（场景序列 + 风格五维，相似度比对基线从这里取）
 *   5. 封面组件与排版参照图
 *   6. 模板库（video/src/templates/，设计稿环节"选模板 + 填内容"的选型清单）
 *   7. 样本库（outputs/样本库/，认可帧 = 模板设计的审美锚点，含孤儿文件检查）
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const videoSrc = join(root, 'video', 'src');
const read = (p) => readFileSync(p, 'utf8');

const lines = [];
const out = (s = '') => lines.push(s);

// ── 1. 场景组件（注册表 + 变体）──
const indexSrc = read(join(videoSrc, 'scenes', 'index.tsx'));
const registered = [...indexSrc.matchAll(/case\s+'([^']+)':\s*content\s*=\s*<(\w+)/g)]
  .map(([, type, comp]) => ({ type, comp }));

const variantsIn = (file) => {
  const p = join(videoSrc, 'scenes', `${file}.tsx`);
  if (!existsSync(p)) return { layouts: [], variants: [] };
  const src = read(p);
  const layouts = [...new Set([...src.matchAll(/\blayout\s*(?:===|!==)\s*'([^']+)'/g)].map(([, v]) => v))];
  const variants = [...new Set([...src.matchAll(/\bcardVariant\s*(?:===|!==)\s*'([^']+)'/g)].map(([, v]) => v))];
  return { layouts, variants };
};

out('# 视频视觉资产盘点（真源 = 代码）');
out();
out(`> 生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })} ｜ 生成方式：\`node scripts/list-assets.mjs\``);
out('> 设计稿「组件核对」以本清单为准；文档静态状态列仅为快照。');
out();
out('## 1. 场景组件（SceneRenderer 已注册）');
out();
out('| type | 组件 | layout 变体 | cardVariant 变体 |');
out('|---|---|---|---|');
for (const { type, comp } of registered) {
  const { layouts, variants } = variantsIn(comp);
  out(`| \`${type}\` | ${comp} | ${layouts.map((v) => `\`${v}\``).join(' ') || '—'} | ${variants.map((v) => `\`${v}\``).join(' ') || '—'} |`);
}

// types.ts 的联合类型是变体字段的类型上限
const typesSrc = read(join(videoSrc, 'types.ts'));
const unionOf = (name) => {
  const m = typesSrc.match(new RegExp(`\\b${name}\\??:\\s*([^;]+);`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map(([, v]) => v) : [];
};
out();
out(`types.ts 变体上限：layout ∈ { ${unionOf('layout').join(' / ')} }；cardVariant ∈ { ${unionOf('cardVariant').join(' / ')} }`);

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
  const style = ['palette', 'motion', 'typography', 'transition', 'hookStyle']
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

// ── 6. 模板库 ──
out();
out('## 6. 模板库（templates/，设计稿环节 = 选模板 + 填内容）');
out();
const tplDir = join(videoSrc, 'templates');
if (existsSync(tplDir)) {
  const tplFiles = readdirSync(tplDir).filter((f) => /^T\d+.*\.ts$/.test(f)).sort();
  if (!tplFiles.length) {
    out('（空）');
  } else {
    out('| 模板 | 名称 | 提炼来源 | 风格预设（motion/typography/transition/hook） | 屏序列 |');
    out('|---|---|---|---|---|');
    for (const f of tplFiles) {
      const src = read(join(tplDir, f));
      const pick = (re) => (src.match(re) || [])[1] || '?';
      const id = pick(/id:\s*'([^']+)'/);
      const name = pick(/name:\s*'([^']+)'/);
      const source = pick(/source:\s*'([^']+)'/);
      const preset = ['motion', 'typography', 'transition', 'hookStyle']
        .map((k) => pick(new RegExp(`${k}:\\s*'([^']+)'`))).join(' / ');
      const slots = [...src.matchAll(/\{\s*role:\s*'([^']+)',\s*type:\s*'([^']+)'/g)]
        .map(([, role, type]) => `${role}:${type}`);
      out(`| ${id} | ${name} | ${source} | ${preset} | ${slots.join(' → ')} |`);
    }
    out();
    out('> 用法：设计稿按玩法选模板 → 逐屏填 `fill` 槽（内容来自 pipeline.md 步骤 3.5 干货提取）→ palette 按背景图色调选定（预设不含 palette）；模板覆盖不了的屏按 R3-Remotion技术参考 §五 扩展流程标 new:xxx。');
  }
} else {
  out('（templates/ 目录未建）');
}

// ── 7. 样本库 ──
out();
out('## 7. 样本库（outputs/样本库/，认可帧 = 模板设计的审美锚点）');
out();
const sampleDir = join(root, 'outputs', '样本库');
const sampleIndexFile = join(sampleDir, 'index.json');
if (existsSync(sampleIndexFile)) {
  const samples = JSON.parse(read(sampleIndexFile));
  out('| 文件 | 模板 | 屏 | 角色 | 说明 |');
  out('|---|---|---|---|---|');
  for (const s of samples) {
    out(`| ${s.file} | ${s.template} | ${s.screen} | ${s.role} | ${s.note} |`);
  }
  const indexed = new Set(samples.map((s) => s.file));
  const orphans = readdirSync(sampleDir).filter((f) => /\.(png|jpe?g)$/i.test(f) && !indexed.has(f));
  for (const f of orphans) out(`> ⚠️ 孤儿文件（在库但未登记 index.json）：${f}`);
} else {
  out('（样本库未建）');
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

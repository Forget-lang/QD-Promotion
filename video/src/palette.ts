// 设计常量：配色 / 字体 / 帧率（2026-08-15 组件库化重构，G02 值与原 VTemplate 一致）

export const FPS = 30;

// 语义色（跨行业通用：红=痛点 绿=解法 橙=强调 青=科技）
// 2026-08-30 删 6 个零引用语义色常量（ACCENT_* / GREEN / NAV_RED）：注释焊着单片决策（S7/G02），违反共享层中立；
// 顶栏红等真值在 docs/internal/R6 §8，本片需要时从 palette 主题或 R6 真值取色。

export const INK = '#1a1a1a';
export const PAPER = '#ffffff';
export const BG_LIGHT = '#f5f6f8';
export const BG_DARK = '#16182a';
export const BG_DARK2 = '#1f2238';

export const FONT_TITLE = "'DeyiHei', sans-serif";
export const FONT_BODY = "'Alibaba PuHuiTi 3', sans-serif";
export const FONT_ROUND = "'Alimama FangYuan', sans-serif";

// 字体性格映射（typography 维度落地，2026-08-17）
// impact=得意黑超粗冲击 / clean=普惠体清爽现代 / friendly=方圆体亲和圆润
import type { TypographyKey } from './types';

export interface TypographyConfig {
  family: string;       // 标题字体
  titleWeight: number;
  bodyFamily: string;   // 正文字体（impact 时正文仍用普惠体保可读性）
  bodyWeight: number;
}

export const TYPOGRAPHY: Record<TypographyKey, TypographyConfig> = {
  impact:   { family: FONT_TITLE, titleWeight: 900, bodyFamily: FONT_BODY,  bodyWeight: 500 },
  clean:    { family: FONT_BODY,  titleWeight: 800, bodyFamily: FONT_BODY,  bodyWeight: 500 },
  // 方圆体仅 400 单一字重，friendly 性格靠圆润字形而非字重区分，层级靠字号
  friendly: { family: FONT_ROUND, titleWeight: 400, bodyFamily: FONT_ROUND, bodyWeight: 400 },
};

// 行业风格配色（风格轮换方案 P1-P7 落地；G02 用 mint-cool，值与原 VTemplate 一致）
export type PaletteKey =
  | 'mint-cool'
  | 'warm-orange'
  | 'berry-purple'
  | 'deep-blue'
  | 'caramel'
  | 'ink-green'
  | 'neon';

export interface Palette {
  bg: string;
  bgDark: string;
  bgDark2: string;
  accent: string;
  accentDark: string;
  ink: string;
  paper: string;
}

export const PALETTES: Record<PaletteKey, Palette> = {
  'mint-cool': {
    bg: BG_LIGHT, bgDark: BG_DARK, bgDark2: BG_DARK2,
    accent: '#07C160', accentDark: '#06A048', ink: INK, paper: PAPER,
  },
  'warm-orange': {
    bg: '#fdf6f0', bgDark: '#2a1a12', bgDark2: '#3a2518',
    accent: '#FF7043', accentDark: '#e85d2f', ink: '#1a1a1a', paper: '#ffffff',
  },
  'berry-purple': {
    bg: '#faf5fb', bgDark: '#24152b', bgDark2: '#331c3d',
    accent: '#AB47BC', accentDark: '#8e24aa', ink: '#1a1a1a', paper: '#ffffff',
  },
  'deep-blue': {
    bg: '#f2f6fb', bgDark: '#101c2e', bgDark2: '#182940',
    accent: '#1E88E5', accentDark: '#1565C0', ink: '#1a1a1a', paper: '#ffffff',
  },
  'caramel': {
    bg: '#faf4ec', bgDark: '#241a10', bgDark2: '#332716',
    accent: '#8D6E63', accentDark: '#6d4c41', ink: '#1a1a1a', paper: '#ffffff',
  },
  'ink-green': {
    bg: '#f1f6f2', bgDark: '#12221a', bgDark2: '#1a3024',
    accent: '#2E7D32', accentDark: '#1B5E20', ink: '#1a1a1a', paper: '#ffffff',
  },
  'neon': {
    bg: '#f6f6ff', bgDark: '#14142a', bgDark2: '#1e1e3a',
    accent: '#E91E63', accentDark: '#c2185b', ink: '#1a1a1a', paper: '#ffffff',
  },
};

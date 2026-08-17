// 设计常量：配色 / 字体 / 帧率（2026-08-15 组件库化重构，G02 值与原 VTemplate 一致）

export const FPS = 30;

// 语义色（跨行业通用：红=痛点 绿=解法 橙=强调 青=科技）
export const ACCENT_RED = '#EF5350';
export const ACCENT_GREEN = '#43A047';
export const ACCENT_ORANGE = '#FF7043';
export const ACCENT_CYAN = '#26C6DA';
export const GREEN = '#07C160'; // 解法绿 / S7 CTA 背景（G02 设计稿显式锁定，非品牌色假定）

export const INK = '#1a1a1a';
export const PAPER = '#ffffff';
export const BG_LIGHT = '#f5f6f8';
export const BG_DARK = '#16182a';
export const BG_DARK2 = '#1f2238';

export const FONT_TITLE = "'DeyiHei', sans-serif";
export const FONT_BODY = "'Alibaba PuHuiTi 3', sans-serif";
export const FONT_ROUND = "'Alimama FangYuan', sans-serif";

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

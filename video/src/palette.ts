// 设计常量：配色 / 字体 / 帧率（2026-08-15 组件库化重构；共享层保持单片中立，不写某片用了哪套）

export const FPS = 30;

// 基础色（纸/墨/深浅底）
// 2026-08-30 删 6 个零引用语义色常量（ACCENT_* / GREEN / NAV_RED）：注释焊着单片决策（S7/G02），违反共享层中立；
// 顶栏红等真值在 docs/internal/R6 §8，需要时从 palette 主题或 R6 真值取色，不在本文件私设常量。

export const INK = '#1a1a1a';
export const PAPER = '#ffffff';
export const BG_LIGHT = '#f5f6f8';
export const BG_DARK = '#16182a';
export const BG_DARK2 = '#1f2238';

export const FONT_TITLE = "'DeyiHei', sans-serif";
export const FONT_IMPACT = "'Alimama ShuHei', sans-serif"; // 数黑体：端正超重海报字（封面大字专用）
export const FONT_BODY = "'Alibaba PuHuiTi 3', sans-serif";
export const FONT_ROUND = "'Alimama FangYuan', sans-serif";

// 2026-08-31 删 typography「字体性格」维度（TypographyKey/TYPOGRAPHY 表）：注释曾声称"维度落地"，实际全库零消费者——
// VTemplate 与各渲染器从不读 style.typography，g06 数据里的 'friendly' 声明同删。字体直接用下方 FONT_* 常量；
// 真要做"性格"维度时按一屏标杆重新设计，别照旧表复活。

// 行业风格配色 7 套（每片在数据文件 `style.palette` 选一套，渲染器从 PALETTES 取主题变量；清单见 R3 §3.5）
// 现状如实：专属屏内仍有硬编码色值（g06/index.tsx 实测 38 处 hex），是否收口到主题变量属设计决策，未拍板前别把本行读成"已收口"。
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

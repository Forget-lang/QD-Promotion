// 数据驱动核心：Scene 内容类型 + StyleConfig 风格配置（2026-08-18 时间线版）
import type { PaletteKey } from './palette';
import type { IconKey } from './components/icons';

export type SceneType =
  | 'hook' | 'pain' | 'solution' | 'flow' | 'grid' | 'panel' | 'cta'
  | 'timeline' | 'transfer';

// 风格配置五维（style 五维：配色/动画性格/字体/转场/钩子）
export type MotionKey = 'bouncy' | 'snappy' | 'buttery' | 'heavy';
export type TypographyKey = 'impact' | 'clean' | 'friendly';
export type TransitionKey = 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'pop';
export type HookStyleKey = 'contrast' | 'number' | 'question' | 'story' | 'challenge' | 'clock';

export interface SceneItem {
  icon: IconKey;
  color: string;
  title: string;
  desc: string;
}

export interface SceneNode {
  icon: IconKey;
  color: string;
  title: string;
}

export interface SceneMetric {
  icon: IconKey;
  color: string;
  title: string;
  dir: '↑' | '↓';
  desc: string;
}

// ── 时间线场景 ──
export interface TimelinePoint {
  hour: number;    // 0-24
  traffic: number; // 0-100（100=爆满，0=空店）
}

export interface TimelineCoupon {
  hour: number;     // 落点时间
  icon: IconKey;
  label: string;
  color: string;
  lift: number;     // 把客流抬升多少（0-100）
}

export interface Scene {
  type: SceneType;
  dur: number;
  /** 语音起点偏移（秒）：画面先出现，延迟 X 秒后开口说话。默认 0。 */
  voiceOffset?: number;
  /** 字幕文本（底部安全区显示，建议每行不超 16 字） */
  subtitle?: string;
  title?: string;
  sub?: string;
  layout?: 'vertical' | 'horizontal';
  // pain
  leftTitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightSub?: string;
  // solution
  items?: SceneItem[];
  // flow
  nodes?: SceneNode[];
  footnote?: string;
  // grid
  cards?: SceneItem[];
  // panel
  metrics?: SceneMetric[];
  // timeline（新）
  timelinePoints?: TimelinePoint[];
  timelineCoupons?: TimelineCoupon[];
  timelineMode?: 'problem' | 'solution';
  timelineHighlight?: { startHour: number; endHour: number; label: string };
  // transfer（新）
  transferFrom?: string;
  transferTo?: string;
}

export interface StyleConfig {
  palette: PaletteKey;
  motion: MotionKey;
  typography: TypographyKey;
  transition: TransitionKey;
  hookStyle: HookStyleKey;
  /** 行业专属背景图路径（B 方案，public 下相对路径，如 'backgrounds/g02/bg.jpg'） */
  bgImage?: string;
}

export interface VideoData {
  id: string;
  style: StyleConfig;
  scenes: Scene[];
}

// 数据驱动核心：Scene 内容类型 + StyleConfig 风格配置（2026-08-15）
import type { PaletteKey } from './palette';
import type { IconKey } from './components/icons';

export type SceneType = 'hook' | 'pain' | 'solution' | 'flow' | 'grid' | 'panel' | 'cta';

// 风格配置六大维度（风格轮换方案落地：配色/版式/转场/钩子/动画/字体）
export type MotionKey = 'bouncy' | 'snappy' | 'buttery' | 'heavy';
export type TypographyKey = 'impact' | 'clean' | 'friendly';
export type TransitionKey = 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'pop';
export type HookStyleKey = 'contrast' | 'number' | 'question' | 'story' | 'challenge';

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

export interface Scene {
  type: SceneType;
  dur: number; // 秒
  title?: string;
  sub?: string;
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
}

export interface StyleConfig {
  palette: PaletteKey;
  motion: MotionKey;
  typography: TypographyKey;
  transition: TransitionKey;
  hookStyle: HookStyleKey;
}

export interface VideoData {
  id: string;
  style: StyleConfig;
  scenes: Scene[];
}

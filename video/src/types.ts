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
  /** 步骤补充说明（可选，无则不显示） */
  sub?: string;
}

export interface SceneMetric {
  icon: IconKey;
  color: string;
  title: string;
  dir: '↑' | '↓';
  desc: string;
  /** 焦点数字（可选）：填了用 StatCounter 滚动显示；**禁止虚构营销数据**——无真实可述数字时不填 */
  value?: number;
  /** 数字单位（如「张」「次」），随 value 显示 */
  suffix?: string;
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

export interface SubtitleLine {
  /** 字幕文本（单行，建议 10-20 字） */
  text: string;
  /** 字幕出现帧（相对本屏起点，0 为屏首帧） */
  startFrame: number;
  /** 字幕消失帧（相对本屏起点） */
  endFrame: number;
}

export interface Scene {
  type: SceneType;
  dur: number;
  /** 语音起点偏移（秒）：画面先出现，延迟 X 秒后开口说话。默认 0。 */
  voiceOffset?: number;
  /** 语音实测时长（秒，ffprobe 回填）：淡出从语音实际结束点开始，尾字零削波；不填退回固定 12 帧淡出 */
  voiceDur?: number;
  /** 字幕多行数组（口播全文，按语义断句分行，每行有独立起止帧；无声版均匀分布占位，有声版按 TTS 实测精修） */
  subtitles?: SubtitleLine[];
  /** number 型钩子：数字部分（如 "10"），不传则降级为普通标题 */
  hookNumber?: string;
  /** number 型钩子：单位部分（如 "次"） */
  hookUnit?: string;
  title?: string;
  sub?: string;
  /** 浅色背景适配：true = 背景较浅，标题用深色 ink（默认 false = 深底白字）。背景图为浅色系时必须设 true */
  darkText?: boolean;
  /** 卡片样式变体（防连续屏卡片千篇一律，R4 E-011）：border-left=左边框卡（默认）/ center-icon=无边框大图标卡 / numbered=编号圆卡 */
  cardVariant?: 'border-left' | 'center-icon' | 'numbered';
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
  /** 背景图模糊程度（px，毛玻璃微虚化效果，推荐 2-6），0 = 不模糊 */
  bgBlur?: number;
}

export interface VideoData {
  id: string;
  style: StyleConfig;
  scenes: Scene[];
  /** 是否已生成语音文件（无声版=false，有声版=true） */
  hasAudio?: boolean;
}

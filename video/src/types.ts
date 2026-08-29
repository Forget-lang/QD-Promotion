// 数据驱动核心：Scene 内容类型 + StyleConfig 风格配置（2026-08-18 时间线版）
import type * as React from 'react';
import type { PaletteKey } from './palette';
import type { IconKey } from './components/icons';

/** 场景渲染器统一入参（共享 scenes/ 与本片专属 videos/gXX/ 都用它） */
export interface SceneRenderProps {
  scene: Scene;
  style: StyleConfig;
  index: number;
  total: number;
}

export type SceneType =
  | 'hook' | 'pain' | 'solution' | 'flow' | 'grid' | 'panel' | 'cta'
  | 'timeline' | 'transfer' | 'cardface' | 'bracket-group' | 'usetips';

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
  /** 表单式字段明细行（solution numbered 变体：icon + label:value，值 ≥32px；有 fields 时不显示 desc） */
  fields?: { icon?: IconKey; label: string; value: string }[];
}

export interface SceneNode {
  icon: IconKey;
  color: string;
  title: string;
  /** 步骤补充说明（可选，无则不显示） */
  sub?: string;
}

// ── 次卡磁条卡面（cardface，R3 §5.4）──
export interface CardField {
  icon: IconKey;
  label: string;   // 字段名（如「核销间隔」）
  value: string;   // 字段值（如「3 天」），渲染 ≥32px
}

// ── 括号分组（bracket-group，R3 §5.6 呈现手法：左竖排标签 + 大括号 + 右明细）──
export interface BracketGroup {
  index: string;        // 编号（如「1」）
  label: string;        // 左侧竖排标签（如「说送卡」）
  detail: string;       // 右侧明细（单行或多行，`|` 分隔换行）
  highlight?: boolean;  // 重点高亮（黄色）
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
  /**
   * 本片专属渲染器名（「一条视频一套 UI 语言」）。**必填**：
   * 用 `scenes/index.tsx` 里 `VIDEO_RENDERERS[视频id][ui]` 注册的组件渲染；缺失或没注册直接抛错（2026-08-29 共享场景回退已删除，无旁路）。
   * **组件不写在数据文件里**（数据要能序列化，函数会丢），只在分发器按视频 id 注册一次。
   * type 描述**叙事槽位**（痛点/步骤/字段…），ui 描述**画面结构**——两者分开，才能既复用叙事骨架又不复用画面。
   * 整屏结构指纹 = type + ui（+ layout/cardVariant），机检见 `scripts/check-similarity.mjs`。
   */
  ui: string;
  /** 本片专属渲染器（scene.ui）的数据载荷；结构由 `video/src/videos/gXX/types.ts` 定义，组件内用 pick<T>() 取型。共享 scenes/ 不读这个字段 */
  payload?: Record<string, unknown>;
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
  /** story 型钩子：场景锚点胶囊文字（如 "上周三 · 下午四点"）；challenge 型钩子：徽章文字（如 "敢不敢"，缺省 "敢不敢"） */
  hookTag?: string;
  title?: string;
  sub?: string;
  /** 浅色背景适配：true = 背景较浅，标题用深色 ink（默认 false = 深底白字）。背景图为浅色系时必须设 true */
  darkText?: boolean;
  /** 卡片样式变体（防连续屏卡片千篇一律，R4 E-011）：border-left=左边框卡（默认）/ center-icon=无边框大图标卡 / numbered=编号圆卡 / number-focus=数字焦点卡（grid 专用，title=数字大字主色） */
  cardVariant?: 'border-left' | 'center-icon' | 'numbered' | 'number-focus';
  /** 结构变体：pain 用 numbered-list；solution 用 numbered；grid 用 multi-section；panel 用 ranking；flow 用 horizontal（横向节点串联 + 连接线，缺省为纵向大步骤卡）。其余值忽略 */
  layout?: 'vertical' | 'horizontal' | 'numbered-list' | 'multi-section' | 'ranking';
  // pain
  leftTitle?: string;
  leftItems?: string[];
  /** 痛点深挖副行（numbered-list 变体：每条痛点的后果/为什么，小字显示，填满画面/干货直接显示） */
  leftItemsSub?: string[];
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
  // cardface（次卡磁条卡面，R3 §5.4）
  /** 卡名（如「六次养护卡」） */
  cardName?: string;
  /** 底部类型徽章（如「次卡」） */
  cardType?: string;
  /** 卡面右上商户名（行业泛称，如「美容院」） */
  merchantName?: string;
  /** 次数焦点大字（如 6） */
  times?: number;
  /** 总次数（"/ 共 {total} 次"） */
  total?: number;
  /** 底部有效期文案（如「有效期 90 天」） */
  validLabel?: string;
  /** 卡面主题底色（9 色深色系，如御紫 #3E2060，applet utils/theme.js） */
  cardTheme?: string;
  /** 卡面焦点块（可选，泛化自次卡的「次数」）：券包/优惠券等无「次」概念的卡面用它，如 value=3 unit=种 note='/ 各 1 张'。不传则回退 times/total 次卡写法 */
  faceFocus?: { value: string | number; unit?: string; note?: string };
  /** 附加字段（≤4 项；次数/有效期已在卡面主体，不重复） */
  cardFields?: CardField[];
  /** 卡面下使用说明（按使用场景，R1 真实功能；如「到店出示：顾客出示卡，店员扫码核销」）；group 可选，传了在该行左上角显示分组角标 */
  useTips?: { icon: IconKey; text: string; group?: string }[];
  // bracket-group（括号分组，R3 §5.6）
  bracketGroups?: BracketGroup[];
  // transfer/通用：操作要点列表（编号 ①②③ + 文字，填满画面/信息密度用）
  points?: string[];
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

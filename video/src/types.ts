// 数据驱动核心：Scene 入口卡 + StyleConfig 风格配置（2026-08-29 大瘦身版）
// 背景：12 个共享场景组件与 9 个"统一外观"业务组件已删除，无 type→渲染器回退。
// Scene 因此瘦成「入口卡」：只描述 分发/时长/字幕/钩子形态 等通用字段；
// 每屏真正的业务数据放 payload，形状由各片 `video/src/videos/gXX/types.ts` 自定义（组件内 pick 取型）。
// 旧版在这里堆的 leftItems/metrics/cardFields/bracketGroups… 专属字段随其渲染器一并删除（git 历史可查）。
import type * as React from 'react';
import type { PaletteKey } from './palette';

/** 场景渲染器统一入参（本片专属组件用，scenes/index.tsx 分发时传入） */
export interface SceneRenderProps {
  scene: Scene;
  style: StyleConfig;
  index: number;
  total: number;
}

/** 叙事槽位（SKILL 第 4 步九分类）——type 描述"这屏讲什么职责"，ui 描述"这屏长什么样"，两者分开 */
export type SceneType =
  | 'hook'        // 钩子
  | 'pain'        // 痛点
  | 'idea'        // 思路
  | 'steps'       // 步骤
  | 'fields'      // 字段
  | 'cardface'    // 卡面
  | 'advance'     // 进阶
  | 'mechanism'   // 机制
  | 'cta';        // 收尾

// 风格配置四维（style：配色/动画性格/转场/钩子；2026-08-31 删 typography 维度——声明了从未有渲染器消费）
export type MotionKey = 'bouncy' | 'snappy' | 'buttery' | 'heavy';
export type TransitionKey = 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'pop';
export type HookStyleKey = 'contrast' | 'number' | 'question' | 'story' | 'challenge' | 'clock';

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
   * 整屏结构指纹 = `type + ui`（机检见 `scripts/check-similarity.mjs`）。
   * ⚠️ 别再往 payload 里加 `layout`/`cardVariant` 想"改指纹"：那两个键随 2026-08-29 共享场景一起删了，
   * 现在脚本只认 type + ui，且 ui 带 `gXX-` 前缀 → 换前缀重做同款骨架永不碰撞。结构雷同靠一屏标杆人判。
   */
  ui: string;
  /** 本片本屏的业务数据载荷；形状由 `video/src/videos/gXX/types.ts` 定义，专属组件内取型。分发器不读 */
  payload?: Record<string, unknown>;
  dur: number;
  /** 语音起点偏移（秒）：画面先出现，延迟 X 秒后开口说话。默认 0。 */
  voiceOffset?: number;
  /** 语音实测时长（秒，ffprobe 回填）：淡出从语音实际结束点开始，尾字零削波；不填退回固定 12 帧淡出 */
  voiceDur?: number;
  /** 字幕多行数组（口播全文，按语义断行；无声版均匀分布占位，有声版按 TTS 实测精修） */
  subtitles?: SubtitleLine[];
  /** 浅色背景适配标记。⚠️ 已知短板（R3 §7.3）：Subtitle 尚未消费此字段（恒白字黑描边），接线须走组件提案；在那之前它只是数据标注 */
  darkText?: boolean;
  // ── 钩子屏通用便捷字段（专属组件可选读取；其余内容一律进 payload）──
  title?: string;
  sub?: string;
  /** number 型钩子：数字部分（如 "10"）/ 单位（如 "次"），供大字弹入 */
  hookNumber?: string;
  hookUnit?: string;
  /** story 型钩子：场景锚点胶囊文字（如 "上周三 · 下午四点"）；challenge 型：徽章文字（缺省 "敢不敢"） */
  hookTag?: string;
  /** 编号要点列表（①②③ + 文字，多屏通用的"干货条"形态，专属组件可选渲染） */
  points?: string[];
  /** 页脚一句话（数据口径 / 免责小字） */
  footnote?: string;
}

export interface StyleConfig {
  palette: PaletteKey;
  motion: MotionKey;
  transition: TransitionKey;
  hookStyle: HookStyleKey;
  /** 行业专属背景图路径（public 下相对路径，如 'backgrounds/g06/bg.jpg'） */
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

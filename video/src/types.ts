// 数据驱动核心：Scene 入口卡 + StyleConfig 风格配置（2026-08-29 大瘦身版）
// 背景：12 个共享场景组件与 9 个"统一外观"业务组件已删除，无 type→渲染器回退。
// Scene 因此瘦成「入口卡」：只描述 分发/时长/字幕/语音偏移 等通用字段；
// 每屏真正的业务数据放 payload，形状由各片 `video/src/videos/gXX/types.ts` 自定义（组件内 pick 取型）。
// 旧版在这里堆的 leftItems/metrics/cardFields/bracketGroups… 专属字段随其渲染器一并删除（git 历史可查）；title/sub/hookNumber/hookUnit/hookTag/points 等零读取便捷字段 2026-09-02 Q4 清理删除。
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
export type TransitionKey = 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'pop' | 'reveal';
export type HookStyleKey = 'contrast' | 'number' | 'question' | 'story' | 'challenge' | 'clock';

/**
 * 布局指纹（粗粒度呈现架构类别，2026-09-07 加，供 `check-layout-diversity` 拦"新片与上一条同 type 屏同布局"）。
 * 补 `type+ui` 结构指纹只防照抄 ui 名、防不住"换色换皮的同构"。新片每屏必填（闸门强制）。
 */
export type LayoutKind =
  | 'card-list'      // 顶部承载物 + 一张大圆角卡装竖排「字段名左/值右」清单（g08 制券屏那套）
  | 'form'           // 手机表单：值进输入框 + 开关药丸 + 左对齐分区（复刻真实创建页）
  | 'two-column'     // 两栏对照（顾客/商家、方案A/B）
  | 'flow'           // 横向流程 / 链路 / 步骤条
  | 'hero-object'    // 单个实物特写为主 + 少量标注/引线
  | 'compare-list'   // 现状→失效 编号对照清单
  | 'hero-focus'     // 单一焦点大数字 / 大对象居中
  | 'mechanism-diagram' // 机制图解（连线/象限/因果）
  | 'cta-statement'; // 主张大字 + 品牌落章

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
   * 准确构成（对齐脚本）：普通屏 type 段就是 `type`；钩子屏 type 段带风格前缀 `hook:<hookStyle>`；有 ui 时再拼 `#ui`。脚本另保留 `layout`/`cardVariant` 的归一化分支（'vertical'/'border-left' 视同缺省），但这两个键随 2026-08-29 共享场景已删、新片不要再用。
   * ⚠️ 无论怎么拼，ui 都带 `gXX-` 前缀 → 换前缀重做同款骨架永不碰撞，这道机检只防"照抄上一片的 ui 名"。结构雷同一律靠一屏标杆人判。
   */
  ui: string;
  /**
   * 布局指纹（呈现架构类别，见 LayoutKind）。新片每屏必填——`check-layout-diversity` 用它拦"新片与上一条同 type 屏用了同 layoutKind"（换皮同构）。
   * 类型上可选只为不破坏历史片编译；闸门对最新一片强制要求每屏都有，缺失即红灯。
   */
  layoutKind?: LayoutKind;
  /** 本片本屏的业务数据载荷；形状由 `video/src/videos/gXX/types.ts` 定义，专属组件内取型。分发器不读 */
  payload?: Record<string, unknown>;
  dur: number;
  /** 语音起点偏移（秒）：画面先出现，延迟 X 秒后开口说话。默认 0。 */
  voiceOffset?: number;
  /** 语音实测时长（秒，ffprobe 回填）：淡出从语音实际结束点开始，尾字零削波；不填退回固定 12 帧淡出 */
  voiceDur?: number;
  /** 字幕多行数组（口播全文，按语义断行；无声版均匀分布占位，有声版按 TTS 实测精修） */
  subtitles?: SubtitleLine[];
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

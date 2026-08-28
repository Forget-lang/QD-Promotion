// 模板体系：预打磨的屏序列骨架（设计稿环节 = 选模板 + 填内容）
// 模板不参与渲染，是设计稿阶段的规格真源；模板状态由 scripts/list-assets.mjs 从本目录实时盘点
// 提炼自 G02-G04 三条已交付视频：共享 8 屏叙事链（钩子→痛点→方案→步骤→证明→进阶→数据→收尾），差异在每屏表现变体
import type { MotionKey, TypographyKey, TransitionKey, HookStyleKey } from '../types';

/** 屏叙事角色（三条已验证视频的共同骨架） */
export type SlotRole =
  | 'hook'      // 钩子
  | 'pain'      // 痛点
  | 'solution'  // 方案 / 产品物件
  | 'steps'     // 操作步骤
  | 'proof'     // 为什么好使
  | 'advance'   // 进阶玩法
  | 'data'      // 数据佐证
  | 'cta';      // 品牌收尾

export interface TemplateSceneSlot {
  role: SlotRole;
  /** 场景 type（SceneRenderer 已注册类型） */
  type: string;
  /** 变体说明（layout / cardVariant / 钩子样式） */
  variant?: string;
  /** 呈现手法（R3 §5.6 手法库） */
  technique?: string;
  /** 内容参数槽：设计稿从 M1 干货提取填入的项 */
  fill: string[];
  /** 时长建议区间（秒；最终值以阶段二语音实测回填为准） */
  durRange: [number, number];
}

export interface VideoTemplate {
  id: string;
  name: string;
  /** 提炼来源视频 */
  source: string;
  /** 适用场景（玩法 / 行业特征） */
  applicable: string;
  /** 风格预设：不含 palette——palette 跟随背景图（M2 §2.2），设计稿时按背景色调选定 */
  stylePreset: {
    motion: MotionKey;
    typography: TypographyKey;
    transition: TransitionKey;
    hookStyle: HookStyleKey;
  };
  /** 背景图槽位要求（色系 / 明暗底 / darkText 影响） */
  bgRequirement: string;
  /** 口播字数闸门 */
  voiceBudget: string;
  scenes: TemplateSceneSlot[];
}

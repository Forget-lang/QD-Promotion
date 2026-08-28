// G05 本片专属屏的数据载荷类型（pipeline §2.1.0：一条视频一套 UI 语言）
// 约定：type 只描述叙事槽位，画面结构由 ui + 本文件的 payload 类型决定。
import type { IconKey } from '../../components/icons';
import type { Scene } from '../../types';

/** 从 scene.payload 取本片某屏的载荷（编译期在本目录内定型，运行期缺失即报错而非静默画空屏） */
export const pick = <T>(scene: Scene, screen: string): T => {
  if (!scene.payload) throw new Error(`G05 ${screen}: scene.payload 缺失，该屏无法渲染`);
  return scene.payload as T;
};

/** S1 速写纸 + 展签 */
export interface SceneCardPayload {
  tag: string;
  title: string;
  sub: string;
}

/** S2 便签墙 */
export interface NoteWallPayload {
  notes: { text: string; sub?: string; paper: 'yellow' | 'blue' | 'cream'; fasten: 'pin' | 'clip' }[];
  conclusion: string;
}

/** S3 分叉路径 */
export interface ForkPathPayload {
  left: { label: string; note: string };
  right: { label: string; note: string };
}

/** S4 画架三步 */
export interface EaselStepsPayload {
  steps: { no: string; title: string; detail: string }[];
  sticker: string;
}

/** S5 表单纸 */
export interface FormSheetPayload {
  rows: { label: string; value: string; sticker?: string; mark?: boolean; note?: string }[];
}

/** S6 三券并排 */
export interface BundleFacesPayload {
  bundleName: string;
  claimNote: string;
  tickets: { band: 'red' | 'yellow' | 'blue'; name: string; value: string; valid: string }[];
  chosen: number;
  footer: string;
}

/** S7 名册漏斗 */
export interface SievePayload {
  roster: { rows: number; sticker: string };
  actions: { no: string; label: string; detail: string; highlight?: boolean }[];
}

/** S8 调色盘引线 */
export interface PalettePayload {
  wells: { color: 'blue' | 'yellow' | 'grey'; icon: IconKey; title: string; desc: string }[];
  footnote: string;
}

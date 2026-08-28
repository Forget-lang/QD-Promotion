// G05 本片专属屏渲染器表（pipeline §2.1.0：一条视频一套 UI 语言）
// data/g05.ts 里每屏写 `ui: 'g05-xxx'`，由 scenes/index.tsx 优先查本表；表里没有的名字会直接抛错。
// S9 品牌收尾走共享 CtaScene（用户 2026-08-28 拍板：CTA 屏允许例外，已登记 ref-registry similarityExemptions）
import type { SceneRenderProps } from '../../types';
import { SceneCard } from './SceneCard';
import { NoteWall } from './NoteWall';
import { ForkPath } from './ForkPath';
import { EaselSteps } from './EaselSteps';
import { FormSheet } from './FormSheet';
import { BundleFaces } from './BundleFaces';
import { Sieve } from './Sieve';
import { Palette } from './Palette';

export const g05Renderers: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g05-scene-card': SceneCard,
  'g05-note-wall': NoteWall,
  'g05-fork-path': ForkPath,
  'g05-easel-steps': EaselSteps,
  'g05-form-sheet': FormSheet,
  'g05-bundle-faces': BundleFaces,
  'g05-sieve': Sieve,
  'g05-palette': Palette,
};

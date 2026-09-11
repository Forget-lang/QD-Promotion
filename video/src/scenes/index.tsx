// 场景分发器：每屏按 ui 名路由到本片专属组件（数据驱动核心）
// 2026-08-29：12 个共享场景组件与 type 回退分支已删除——"一条视频一套专属 UI"没有旁路，ui 必填。
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { SceneRenderProps } from '../types';
import { Subtitle } from '../components/ui';
import { G06_RENDERERS } from '../videos/g06';
import { G07_RENDERERS } from '../videos/g07';
import { G08_RENDERERS } from '../videos/g08';
import { G09_RENDERERS } from '../videos/g09';
import { G10_RENDERERS } from '../videos/g10';

/**
 * 本片专属渲染器注册表：按视频 id 索引。
 * 组件**不能**写在 data 文件里（VideoData 会进 Composition defaultProps 的序列化链路，函数会丢），
 * 所以数据文件只写 `ui: '名字'`，实组件在这里注册。新增一条视频 = 加一行 import + 加一个键。
 */
const VIDEO_RENDERERS: Record<string, Record<string, React.ComponentType<SceneRenderProps>>> = {
  g06: G06_RENDERERS,
  g07: G07_RENDERERS,
  g08: G08_RENDERERS,
  g09: G09_RENDERERS,
  g10: G10_RENDERERS,
};

export const SceneRenderer: React.FC<SceneRenderProps & { videoId: string }> = ({
  scene, style, index, total, videoId,
}) => {
  if (!scene.ui) {
    throw new Error(`SceneRenderer: ${videoId} 屏 ${index + 1} 未声明 ui——每屏必须写 ui:'gXX-名字' 并在本文件 VIDEO_RENDERERS 注册（共享场景回退已删除）`);
  }
  const Bespoke = VIDEO_RENDERERS[videoId]?.[scene.ui];
  if (!Bespoke) {
    throw new Error(`SceneRenderer: ${videoId} 屏 ${index + 1} 声明了 ui='${scene.ui}'，但该视频的注册表里没有这个渲染器（检查 videos/gXX/index.tsx 与本文件的 VIDEO_RENDERERS 是否同名）`);
  }
  return (
    <AbsoluteFill>
      <Bespoke scene={scene} style={style} index={index} total={total} />
      {scene.subtitles && scene.subtitles.length > 0 && <Subtitle lines={scene.subtitles} motion={style.motion} />}
    </AbsoluteFill>
  );
};

// 场景分发器：按 scene.type 路由到对应渲染器（数据驱动核心）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { SceneRenderProps } from '../types';
import { HookScene } from './HookScene';
import { PainScene } from './PainScene';
import { SolutionScene } from './SolutionScene';
import { FlowScene } from './FlowScene';
import { GridScene } from './GridScene';
import { PanelScene } from './PanelScene';
import { CtaScene } from './CtaScene';
import { TimelineScene } from './TimelineScene';
import { TransferScene } from './TransferScene';
import { CardFaceScene } from './CardFaceScene';
import { BracketGroupScene } from './BracketGroupScene';
import { UseTipsScene } from './UseTipsScene';
import { Subtitle } from '../components/ui';
import { g05Renderers } from '../videos/g05';

/**
 * 本片专属渲染器注册表：按视频 id 索引。
 * 组件**不能**写在 data 文件里（VideoData 会进 Composition defaultProps 的序列化链路，函数会丢），
 * 所以数据文件只写 `ui: '名字'`，实组件在这里注册。新增一条视频 = 加一行 import + 加一个键。
 */
const VIDEO_RENDERERS: Record<string, Record<string, React.ComponentType<SceneRenderProps>>> = {
  'G05-KidsArt-SelfPick': g05Renderers,
};

export const SceneRenderer: React.FC<SceneRenderProps & { videoId: string }> = ({
  scene, style, index, total, videoId,
}) => {
  const props: SceneRenderProps = { scene, style, index, total };
  let content: React.ReactNode = null;
  // 先看本片专属渲染器（pipeline §2.1.0「一条视频一套 UI 语言」），再回退共享场景组件
  if (scene.ui) {
    const Bespoke = VIDEO_RENDERERS[videoId]?.[scene.ui];
    if (!Bespoke) {
      // 拼错 ui 名若静默回退共享组件，会把旧结构悄悄渲出来、骗过相似度机检 → 必须直接报错
      throw new Error(`SceneRenderer: ${videoId} 屏 ${index + 1} 声明了 ui='${scene.ui}'，但该视频的注册表里没有这个渲染器（检查 videos/gXX/index.tsx 与本文件的 VIDEO_RENDERERS 是否同名）`);
    }
    content = <Bespoke {...props} />;
  } else switch (scene.type) {
    case 'hook': content = <HookScene {...props} />; break;
    case 'pain': content = <PainScene {...props} />; break;
    case 'solution': content = <SolutionScene {...props} />; break;
    case 'flow': content = <FlowScene {...props} />; break;
    case 'grid': content = <GridScene {...props} />; break;
    case 'panel': content = <PanelScene {...props} />; break;
    case 'cta': content = <CtaScene {...props} />; break;
    case 'timeline': content = <TimelineScene {...props} />; break;
    case 'transfer': content = <TransferScene {...props} />; break;
    case 'cardface': content = <CardFaceScene {...props} />; break;
    case 'bracket-group': content = <BracketGroupScene {...props} />; break;
    case 'usetips': content = <UseTipsScene {...props} />; break;
    default: content = null;
  }

  return (
    <AbsoluteFill>
      {content}
      {scene.subtitles && scene.subtitles.length > 0 && <Subtitle lines={scene.subtitles} />}
    </AbsoluteFill>
  );
};

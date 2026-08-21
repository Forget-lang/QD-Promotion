// 场景分发器：按 scene.type 路由到对应渲染器（数据驱动核心）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Scene, StyleConfig } from '../types';
import { HookScene } from './HookScene';
import { PainScene } from './PainScene';
import { SolutionScene } from './SolutionScene';
import { FlowScene } from './FlowScene';
import { GridScene } from './GridScene';
import { PanelScene } from './PanelScene';
import { CtaScene } from './CtaScene';
import { TimelineScene } from './TimelineScene';
import { TransferScene } from './TransferScene';
import { Subtitle } from '../components/ui';

export const SceneRenderer: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const props = { scene, style, index, total };
  let content: React.ReactNode = null;
  switch (scene.type) {
    case 'hook': content = <HookScene {...props} />; break;
    case 'pain': content = <PainScene {...props} />; break;
    case 'solution': content = <SolutionScene {...props} />; break;
    case 'flow': content = <FlowScene {...props} />; break;
    case 'grid': content = <GridScene {...props} />; break;
    case 'panel': content = <PanelScene {...props} />; break;
    case 'cta': content = <CtaScene {...props} />; break;
    case 'timeline': content = <TimelineScene {...props} />; break;
    case 'transfer': content = <TransferScene {...props} />; break;
    default: content = null;
  }

  return (
    <AbsoluteFill>
      {content}
      {scene.subtitles && scene.subtitles.length > 0 && <Subtitle lines={scene.subtitles} />}
    </AbsoluteFill>
  );
};

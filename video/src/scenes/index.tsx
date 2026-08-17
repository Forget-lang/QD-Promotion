// 场景分发器：按 scene.type 路由到对应渲染器（数据驱动核心）
import React from 'react';
import type { Scene, StyleConfig } from '../types';
import { HookScene } from './HookScene';
import { PainScene } from './PainScene';
import { SolutionScene } from './SolutionScene';
import { FlowScene } from './FlowScene';
import { GridScene } from './GridScene';
import { PanelScene } from './PanelScene';
import { CtaScene } from './CtaScene';

export const SceneRenderer: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const props = { scene, style, index, total };
  switch (scene.type) {
    case 'hook': return <HookScene {...props} />;
    case 'pain': return <PainScene {...props} />;
    case 'solution': return <SolutionScene {...props} />;
    case 'flow': return <FlowScene {...props} />;
    case 'grid': return <GridScene {...props} />;
    case 'panel': return <PanelScene {...props} />;
    case 'cta': return <CtaScene {...props} />;
    default: return null;
  }
};

// S1 钩子屏（深色冲击）· 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, PALETTES } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn } from '../components/animations';
import { SlideTag } from '../components/ui';

export const HookScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const f = useCurrentFrame();
  const float = Math.sin(f / 10) * 8;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.bgDark} 0%, ${p.bgDark2} 100%)` }}>
      <SlideTag cur={index + 1} total={total} dark />
      {/* 装饰：右上咖啡杯浮动 */}
      <div style={{ position: 'absolute', top: 120, right: 70, width: 120, height: 120, opacity: 0.85, transform: `translateY(${float}px)` }}>
        {Ico.cup(p.accent)}
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <ScaleIn delay={4}>
          <div style={{
            fontFamily: FONT_TITLE, fontSize: 124, fontWeight: 900, color: p.paper,
            textAlign: 'center', lineHeight: 1.1,
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}>
            {scene.title}
          </div>
        </ScaleIn>
        <FadeInUp delay={18}>
          <div style={{
            marginTop: 36, fontFamily: FONT_BODY, fontSize: 40,
            color: 'rgba(255,255,255,0.78)', textAlign: 'center', lineHeight: 1.5,
          }}>
            {scene.sub}
          </div>
        </FadeInUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

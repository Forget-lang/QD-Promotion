// S7 结束语（抖音/小红书合规：绝口不提微信/搜索/小程序/关注/收藏）· 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_ROUND, FONT_TITLE, PALETTES } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn } from '../components/animations';

export const CtaScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const f = useCurrentFrame();
  const ring = interpolate(f, [10, 40], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: p.accent, justifyContent: 'center', alignItems: 'center' }}>
      <ScaleIn delay={4}>
        <div style={{
          fontFamily: FONT_TITLE, fontSize: 104, fontWeight: 900, color: '#fff',
          textAlign: 'center', lineHeight: 1.25, padding: '0 60px',
        }}>
          {scene.title}
        </div>
      </ScaleIn>
      <FadeInUp delay={18}>
        <div style={{
          marginTop: 40, fontFamily: FONT_ROUND, fontSize: 42,
          color: 'rgba(255,255,255,0.97)', textAlign: 'center',
          padding: '0 80px', lineHeight: 1.6,
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
      <div style={{
        position: 'absolute', bottom: 120, width: `${ring * 70}%`, height: 5,
        backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3,
      }} />
    </AbsoluteFill>
  );
};

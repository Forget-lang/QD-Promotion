// S7 结束语 · 2026-08-17 专业级优化
// - 品牌装饰线改为从中心向两侧 draw-on（原 width% 从左展开）
// - 标题入场后加一次微脉冲（品牌锁定感）
// - motion 透传 style.motion
// - 合规：绝口不提微信/搜索/小程序/关注/收藏
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn, Pulse, EASE_OUT } from '../components/animations';
import { GlowOrb } from '../components/background';

export const CtaScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  // 装饰线从中心向两侧展开（scaleX 0→1，transformOrigin center）
  const lineGrow = interpolate(f, [18, 48], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: p.accent, justifyContent: 'center', alignItems: 'center' }}>
      <GlowOrb x={140} y={560} size={800} color="rgba(255,255,255,0.15)" />
      <ScaleIn delay={4} motion={style.motion}>
        <Pulse delay={24} intensity={0.04} duration={28}>
          <div style={{
            fontFamily: typo.family, fontSize: 104, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.25, padding: '0 60px',
          }}>
            {scene.title}
          </div>
        </Pulse>
      </ScaleIn>
      <FadeInUp delay={20} motion={style.motion}>
        <div style={{
          marginTop: 40, fontFamily: typo.bodyFamily, fontSize: 42,
          color: 'rgba(255,255,255,0.97)', textAlign: 'center',
          padding: '0 80px', lineHeight: 1.6,
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
      {/* 品牌装饰线：从中心 draw-on */}
      <div style={{
        position: 'absolute', bottom: 140, left: '50%',
        width: 280, height: 5, transform: `translateX(-50%) scaleX(${lineGrow})`,
        backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3,
      }} />
    </AbsoluteFill>
  );
};

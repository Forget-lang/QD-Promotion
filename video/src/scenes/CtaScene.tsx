// S8 结尾·品牌大字 · 2026-08-21 v4 视觉红线版
// - 品牌名超大（130px）做绝对焦点
// - 加装饰线条和光效，不单薄
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn, Pulse, EASE_OUT } from '../components/animations';
import { CharReveal } from '../components/ui';

export const CtaScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const typo = TYPOGRAPHY[style.typography];
  const p = PALETTES[style.palette];
  const f = useCurrentFrame();

  const lineGrow = interpolate(f, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });

  return (
    <AbsoluteFill style={{ background: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      {/* 装饰光晕 */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${p.accent}25 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
      }} />

      {/* 上装饰线 */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        width: 400, height: 4, transform: `translateX(-50%) scaleX(${lineGrow})`,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
        borderRadius: 2, transformOrigin: 'center',
      }} />

      {/* 品牌名 */}
      <ScaleIn delay={6} motion={style.motion} startScale={0.8}>
        <Pulse delay={30} intensity={0.05} duration={30}>
          <div style={{
            fontFamily: typo.family, fontSize: 140, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.2, padding: '0 60px',
            letterSpacing: '0.02em',
            textShadow: `0 0 60px ${p.accent}40, 0 6px 30px rgba(0,0,0,0.5)`,
          }}>
            <CharReveal text={scene.title ?? ''} delay={10} stagger={5} />
          </div>
        </Pulse>
      </ScaleIn>

      {/* 副标题 */}
      <FadeInUp delay={28} motion={style.motion}>
        <div style={{
          marginTop: 48, fontFamily: FONT_BODY, fontSize: 48,
          color: 'rgba(255,255,255,0.9)', textAlign: 'center',
          padding: '0 80px', lineHeight: 1.5,
          textShadow: '0 2px 16px rgba(0,0,0,0.4)',
        }}>
          {scene.sub}
        </div>
      </FadeInUp>

      {/* 下装饰线 */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '50%',
        width: 300, height: 4, transform: `translateX(-50%) scaleX(${lineGrow})`,
        background: `linear-gradient(90deg, transparent, ${p.accent}99, transparent)`,
        borderRadius: 2, transformOrigin: 'center',
      }} />
    </AbsoluteFill>
  );
};

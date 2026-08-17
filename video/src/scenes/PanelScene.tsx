// S6 价值·数据面板 · 2026-08-17 专业级优化
// - 方向箭头 ↑/↓ 加入场脉冲（对齐设计稿「数字/箭头 direction 滚动强调」）
// - motion 透传 style.motion
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PALETTES, PAPER, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, EASE_OUT } from '../components/animations';
import { SlideTag } from '../components/ui';
import { GlowOrb } from '../components/background';

export const PanelScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${p.bgDark} 0%, ${p.bgDark2} 100%)`, justifyContent: 'center' }}>
      <SlideTag cur={index + 1} total={total} dark />
      <GlowOrb x={-80} y={-60} size={450} color={`${p.accent}30`} />
      <GlowOrb x={650} y={1100} size={380} color={`${p.accent}20`} delay={12} />
      <div style={{ position: 'absolute', top: 130, width: '100%', padding: '0 56px' }}>
        <FadeInUp motion={style.motion}>
          <div style={{ fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight, color: PAPER, textAlign: 'center' }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26, paddingTop: 200 }}>
        {(scene.metrics ?? []).map((m, i) => {
          const baseDelay = 10 + i * 12;
          // 箭头入场后做一次 translateY 脉冲（↑ 向上弹，↓ 向下弹）
          const arrowBounce = interpolate(
            f - baseDelay - 15,
            [0, 12, 24],
            [0, m.dir === '↑' ? -14 : 14, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT },
          );
          return (
            <ScaleIn key={i} delay={baseDelay} motion={style.motion}>
              <div style={{
                width: 300, height: 360, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 26,
                border: `2px solid ${m.color}55`, padding: 30,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
              }}>
                <div style={{ width: 64, height: 64 }}>{Ico[m.icon](m.color)}</div>
                <div style={{
                  fontFamily: typo.family, fontSize: 90, fontWeight: typo.titleWeight, color: m.color,
                  transform: `translateY(${arrowBounce}px)`,
                  lineHeight: 1,
                }}>{m.dir}</div>
                <div style={{ fontFamily: typo.family, fontSize: 40, fontWeight: typo.titleWeight, color: PAPER }}>{m.title}</div>
                <div style={{ fontFamily: typo.bodyFamily, fontSize: 24, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            </ScaleIn>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

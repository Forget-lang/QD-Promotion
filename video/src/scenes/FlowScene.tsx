// S4 裂变·流程图 · 2026-08-17 专业级优化
// - 修复节点点亮：原 boolean `lit = f > threshold` 导致颜色/透明度瞬切；
//   改为 interpolate + interpolateColors 平滑过渡
// - 箭头缓动统一 EASE_OUT
// - motion 透传 style.motion
import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from 'remotion';
import { INK, PALETTES, PAPER, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, EASE_OUT } from '../components/animations';
import { CharReveal } from '../components/ui';
import { GlowOrb } from '../components/background';

const ArrowNode: React.FC<{ i: number; color: string }> = ({ i, color }) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [20 + i * 22 + 10, 20 + i * 22 + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div style={{
      width: 48, height: 48, opacity: lit,
      transform: `translateX(${interpolate(lit, [0, 1], [-16, 0])}px)`,
    }}>{Ico.arrow(color)}</div>
  );
};

export const FlowScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  const nodes = scene.nodes ?? [];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${p.bgDark}b3 0%, ${p.bgDark2}b3 100%)`, justifyContent: 'center' }}>
      <GlowOrb x={-80} y={-60} size={450} color={`${p.accent}30`} />
      <GlowOrb x={650} y={1100} size={380} color={`${p.accent}20`} delay={12} />
      <div style={{ position: 'absolute', top: 130, width: '100%', padding: '0 56px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight, color: PAPER,
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
          }}
        />
      </div>

      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 150 }}>
        {nodes.map((n, i) => {
          // 平滑点亮：0→1 在 15 帧内过渡，而非 boolean 瞬切
          const litProgress = interpolate(f, [20 + i * 22, 20 + i * 22 + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
          });
          const bgColor = interpolateColors(litProgress, [0, 1], ['rgba(255,255,255,0.08)', '#ffffff']);
          const borderColor = interpolateColors(litProgress, [0, 1], ['rgba(255,255,255,0.15)', n.color]);
          const textColor = interpolateColors(litProgress, [0, 1], ['rgba(255,255,255,0.5)', INK]);
          const iconColor = interpolateColors(litProgress, [0, 1], ['rgba(255,255,255,0.4)', n.color]);
          const opacity = interpolate(litProgress, [0, 1], [0.5, 1]);

          return (
            <React.Fragment key={i}>
              <ScaleIn delay={18 + i * 22} motion={style.motion}>
                <div style={{
                  width: 210, height: 210, borderRadius: 26,
                  backgroundColor: bgColor,
                  border: `3px solid ${borderColor}`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                  opacity,
                }}>
                  <div style={{ width: 70, height: 70 }}>{Ico[n.icon](iconColor)}</div>
                  <div style={{
                    fontFamily: typo.bodyFamily, fontSize: 27, fontWeight: typo.bodyWeight,
                    color: textColor,
                  }}>{n.title}</div>
                </div>
              </ScaleIn>
              {i < nodes.length - 1 && <ArrowNode i={i} color={p.accent} />}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
        <FadeInUp delay={110} motion={style.motion}>
          <div style={{
            fontFamily: typo.bodyFamily, fontSize: 34, color: 'rgba(255,255,255,0.85)',
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 32px', borderRadius: 999,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            {scene.footnote}
          </div>
        </FadeInUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

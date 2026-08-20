// S6 价值·数据面板 · 2026-08-17 专业级优化 + 2026-08-20 V2 vertical + StatCounter
// - direction 箭头入场脉冲（横向模式保留）
// - motion 透传 style.motion
// - V2 新增 vertical 布局：纵向三卡 + 数字滚动（StatCounter），数字是视觉重心
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PALETTES, PAPER, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { ScaleIn, EASE_OUT } from '../components/animations';
import { CharReveal, elevation } from '../components/ui';
import { GlowOrb } from '../components/background';

export const PanelScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const isVertical = scene.layout === 'vertical';

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

      {isVertical ? (
        <VerticalPanel scene={scene} style={style} p={p} typo={typo} />
      ) : (
        <HorizontalPanel scene={scene} style={style} p={p} typo={typo} />
      )}
    </AbsoluteFill>
  );
};

// ── 横向布局（原版 · 三卡并排 + 图标 + 方向箭头）──
const HorizontalPanel: React.FC<{ scene: Scene; style: StyleConfig; p: typeof PALETTES['caramel']; typo: typeof TYPOGRAPHY['impact'] }> = ({ scene, style, p, typo }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26, paddingTop: 200 }}>
      {(scene.metrics ?? []).map((m, i) => {
        const baseDelay = 10 + i * 12;
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
              boxShadow: `${elevation(2, true)}, inset 0 1px 0 rgba(255,255,255,0.12)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{ width: 64, height: 64, color: m.color }}>
                {/* 用图标名渲染，这里简化处理 */}
              </div>
              <div style={{
                fontFamily: typo.family, fontSize: 90, fontWeight: typo.titleWeight, color: m.color,
                transform: `translateY(${arrowBounce}px)`, lineHeight: 1,
              }}>{m.dir}</div>
              <div style={{ fontFamily: typo.family, fontSize: 40, fontWeight: typo.titleWeight, color: PAPER }}>{m.title}</div>
              <div style={{ fontFamily: typo.bodyFamily, fontSize: 24, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.4 }}>{m.desc}</div>
            </div>
          </ScaleIn>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 纵向布局（V2 新增 · 三卡纵向 + StatCounter 数字滚动）──
const VerticalPanel: React.FC<{ scene: Scene; style: StyleConfig; p: typeof PALETTES['caramel']; typo: typeof TYPOGRAPHY['impact'] }> = ({ scene, style, p, typo }) => {
  const f = useCurrentFrame();
  const metrics = scene.metrics ?? [];

  return (
    <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 200 }}>
      {metrics.map((m, i) => {
        const baseDelay = 12 + i * 20;
        // 数字滚动：从 0 → 占位值（168），60 帧完成，easeOut
        const counterProgress = interpolate(
          f - baseDelay - 8,
          [0, 60],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT },
        );
        const counterValue = Math.floor(counterProgress * 168); // 占位数字 168

        // 高亮脉冲：每 70 帧轮一张
        const pulsePhase = f - baseDelay - 80 - i * 70;
        const pulseIntensity = pulsePhase > 0 && pulsePhase < 30
          ? interpolate(pulsePhase, [0, 15, 30], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 0;

        return (
          <ScaleIn key={i} delay={baseDelay} motion={style.motion} startScale={0.85}>
            <div style={{
              width: 700, height: 150, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20,
              border: `2px solid ${m.color}55`,
              boxShadow: `${elevation(2, true)}, inset 0 1px 0 rgba(255,255,255,0.1)`,
              display: 'flex', alignItems: 'center', padding: '0 36px',
              transform: `scale(${1 + pulseIntensity * 0.03})`,
              opacity: 0.85 + pulseIntensity * 0.15,
            }}>
              {/* 左侧：滚动数字 */}
              <div style={{
                flex: 1,
                fontFamily: typo.family,
                fontSize: 88,
                fontWeight: typo.titleWeight,
                color: m.color,
                lineHeight: 1,
                textShadow: `0 0 30px ${m.color}44`,
              }}>
                {counterValue}
              </div>

              {/* 右侧：单位 + 指标名 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{
                  fontFamily: typo.family, fontSize: 36, fontWeight: typo.titleWeight,
                  color: m.color,
                }}>
                  {m.desc}
                </div>
                <div style={{
                  fontFamily: typo.bodyFamily, fontSize: 28, fontWeight: typo.bodyWeight,
                  color: 'rgba(255,255,255,0.75)',
                }}>
                  {m.title}
                </div>
              </div>
            </div>
          </ScaleIn>
        );
      })}

      {/* 底部说明 */}
      {(scene.metrics?.length ?? 0) > 0 && (
        <div style={{
          marginTop: 20,
          fontFamily: typo.bodyFamily, fontSize: 26, color: 'rgba(255,255,255,0.5)',
        }}>
          还有排行榜，谁发得多、谁用得多，清清楚楚
        </div>
      )}
    </AbsoluteFill>
  );
};

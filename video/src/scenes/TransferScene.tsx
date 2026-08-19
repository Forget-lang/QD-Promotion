// S4 转赠裂变场景 · 2026-08-18 全新组件
// 老客持卡 → 卡片复制飞向右 → 新客持卡
// 深底 + 暖光，左右对称构图，中间飞卡动画
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { FPS, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, EASE_OUT, SPRING_CONFIG } from '../components/animations';
import { GlowOrb } from '../components/background';

export const TransferScene: React.FC<{
  scene: Scene; style: StyleConfig; index: number; total: number;
}> = ({ scene, style, index, total }) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();

  // 飞卡动画：第二张卡从左飞到右
  const flySpr = spring({
    frame: f - 45, fps: FPS,
    config: SPRING_CONFIG[style.motion],
  });
  const cardX = interpolate(flySpr, [0, 1], [0, 580]);

  // 右人随卡到达而出现
  const rightPersonOpacity = interpolate(f, [70, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const rightPersonScale = interpolate(f, [70, 90], [0.5, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });

  // 中间箭头绘制
  const arrowOpacity = interpolate(f, [85, 105], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const arrowScaleX = interpolate(f, [85, 110], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(150deg, ${p.bgDark}b3 0%, ${p.bgDark2}b3 100%)`,
    }}>
      <GlowOrb x={-80} y={-60} size={450} color={`${p.accent}30`} />
      <GlowOrb x={650} y={1100} size={380} color={`${p.accent}20`} delay={12} />

      {/* 标题 */}
      <div style={{ position: 'absolute', top: 130, width: '100%', padding: '0 56px' }}>
        <FadeInUp motion={style.motion}>
          <div style={{
            fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight,
            color: '#fff', textAlign: 'center',
          }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      {/* 主动画区 */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 880, height: 560 }}>

          {/* ── 左：老客 ── */}
          <div style={{ position: 'absolute', left: 40, top: 80, textAlign: 'center' }}>
            <ScaleIn delay={10} motion={style.motion}>
              <div style={{
                width: 140, height: 140, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: `3px solid ${p.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <div style={{ width: 64, height: 64 }}>{Ico.users('#fff')}</div>
              </div>
            </ScaleIn>
            <FadeInUp delay={25} motion={style.motion}>
              <div style={{
                fontFamily: typo.family, fontSize: 36, color: '#fff', fontWeight: typo.titleWeight,
              }}>
                {scene.transferFrom ?? '老客'}
              </div>
            </FadeInUp>
          </div>

          {/* ── 右：新客 ── */}
          <div style={{
            position: 'absolute', right: 40, top: 80, textAlign: 'center',
            opacity: rightPersonOpacity,
            transform: `scale(${rightPersonScale})`,
          }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '3px solid #43A047',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <div style={{ width: 64, height: 64 }}>{Ico.users('#fff')}</div>
            </div>
            <div style={{
              fontFamily: typo.family, fontSize: 36, color: '#fff', fontWeight: typo.titleWeight,
            }}>
              {scene.transferTo ?? '新客'}
            </div>
          </div>

          {/* ── 中间箭头 ── */}
          <div style={{
            position: 'absolute', left: 200, right: 200, top: 150,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: arrowOpacity,
            transform: `scaleX(${arrowScaleX})`,
            transformOrigin: 'center',
          }}>
            <div style={{
              flex: 1, height: 3,
              background: `linear-gradient(90deg, ${p.accent}00, ${p.accent}, #43A047)`,
              borderRadius: 2,
            }} />
            <div style={{ marginLeft: -5, color: '#43A047' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* ── "转赠" 标签 ── */}
          <div style={{
            position: 'absolute', left: '50%', top: 195,
            transform: `translateX(-50%) scale(${interpolate(flySpr, [0.3, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
            opacity: interpolate(flySpr, [0.3, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#fff', fontFamily: typo.family, fontSize: 28,
              padding: '8px 24px', borderRadius: 999, whiteSpace: 'nowrap',
            }}>
              转赠
            </div>
          </div>

          {/* ── 卡片（左，不动） ── */}
          <ScaleIn delay={20} motion={style.motion}>
            <div style={{
              position: 'absolute', left: 70, top: 380,
              width: 130, height: 80, borderRadius: 16,
              backgroundColor: '#fff',
              boxShadow: `0 8px 30px ${p.accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${p.accent}`,
            }}>
              <div style={{ width: 36, height: 36 }}>{Ico.cup(p.accent)}</div>
            </div>
          </ScaleIn>

          {/* ── 卡片（右，飞入） ── */}
          <div style={{
            position: 'absolute', left: 70 + cardX, top: 380,
            width: 130, height: 80, borderRadius: 16,
            backgroundColor: '#fff',
            boxShadow: '0 8px 30px rgba(67,160,71,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #43A047',
            opacity: flySpr,
          }}>
            <div style={{ width: 36, height: 36 }}>{Ico.gift('#43A047')}</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* 底部说明 */}
      {scene.sub && (
        <div style={{ position: 'absolute', bottom: 160, width: '100%', padding: '0 80px' }}>
          <FadeInUp delay={100} motion={style.motion}>
            <div style={{
              fontFamily: typo.bodyFamily, fontSize: 38, fontWeight: typo.bodyWeight,
              color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.5,
            }}>
              {scene.sub}
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

// S6 转赠裂变·大号人物卡 · 2026-08-21 v4 视觉红线版
// - 人物头像放大到 200px，卡片放大
// - "1杯→10杯"关键数字放大做焦点
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { FPS, FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, EASE_OUT, SPRING_CONFIG } from '../components/animations';

export const TransferScene: React.FC<{
  scene: Scene; style: StyleConfig; index: number; total: number;
}> = ({ scene, style }) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();

  const flySpr = spring({
    frame: f - 40, fps: FPS,
    config: SPRING_CONFIG[style.motion],
  });
  const cardX = interpolate(flySpr, [0, 1], [0, 620]);

  const rightOpacity = interpolate(f, [65, 85], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const rightScale = interpolate(f, [65, 85], [0.5, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 top: 120（安全区 ≥120px） */}
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 60px' }}>
        <FadeInUp motion={style.motion}>
          <div style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight,
            color: scene.darkText ? p.ink : '#fff', textAlign: 'center',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      {/* 主动画区：从 y:260 开始 */}
      <div style={{
        position: 'absolute', top: 260, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60,
      }}>
        {/* 左：老客 */}
        <ScaleIn delay={8} motion={style.motion}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 200, height: 200, borderRadius: '50%',
              background: `linear-gradient(135deg, ${p.accent}30, ${p.accent}10)`,
              border: `4px solid ${p.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 12px 40px ${p.accent}30`,
            }}>
              <div style={{ width: 100, height: 100 }}>{Ico.users('#fff')}</div>
            </div>
            <div style={{
              fontFamily: typo.family, fontSize: 44, color: '#fff', fontWeight: typo.titleWeight,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {scene.transferFrom ?? '老客'}
            </div>
          </div>
        </ScaleIn>

        {/* 中间：飞卡动画 */}
        <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* 箭头线 */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '50%', height: 4,
            background: `linear-gradient(90deg, ${p.accent}00, ${p.accent}, ${p.accent})`,
            borderRadius: 2, transform: 'translateY(-50%)',
            opacity: flySpr,
          }} />
          <div style={{
            position: 'absolute', right: 0, top: '50%', transform: `translateY(-50%) translateX(${interpolate(flySpr, [0.5, 1], [-20, 0], { extrapolateLeft: 'clamp' })}px)`,
            opacity: flySpr, color: p.accent,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          {/* 飞卡 */}
          <div style={{
            position: 'absolute', left: 0, top: '50%', transform: `translate(${cardX}px, -50%)`,
            width: 160, height: 100, borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: `0 12px 30px ${p.accent}66, 0 4px 12px rgba(0,0,0,0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            opacity: flySpr,
          }}>
            <div style={{ width: 48, height: 48 }}>{Ico.gift(p.accent)}</div>
          </div>
        </div>

        {/* 右：新客 */}
        <div style={{
          textAlign: 'center',
          opacity: rightOpacity,
          transform: `scale(${rightScale})`,
        }}>
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: `linear-gradient(135deg, ${p.accent}4d, ${p.accent}1a)`,
            border: `4px solid ${p.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: `0 12px 40px ${p.accent}4d`,
          }}>
            <div style={{ width: 100, height: 100 }}>{Ico.users('#fff')}</div>
          </div>
          <div style={{
            fontFamily: typo.family, fontSize: 44, color: '#fff', fontWeight: typo.titleWeight,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            {scene.transferTo ?? '新客'}
          </div>
        </div>
      </div>

      {/* 底部大说明卡 */}
      {scene.sub && (
        <div style={{ position: 'absolute', bottom: 200, left: 60, right: 60 }}>
          <FadeInUp delay={80} motion={style.motion}>
            <div style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 32,
              padding: '36px 48px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: typo.family, fontSize: 42, fontWeight: typo.titleWeight,
                color: '#fff', lineHeight: 1.4,
                textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}>
                {scene.sub}
              </div>
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

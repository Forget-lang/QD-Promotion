// S4 使用说明屏（usetips，2026-08-25 · 从卡面屏拆出）
// - 按使用场景展示次卡使用说明（R1 真实功能：核销/间隔/转赠/到期提醒）
// - 图标 + 文字条（无卡片边框，区别于卡片流；背景 003 网格呼应）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp } from '../components/animations';
import { CharReveal } from '../components/ui';
import { Ico } from '../components/icons';

export const UseTipsScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const tips = scene.useTips ?? [];
  const dark = scene.darkText ?? false;

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题 */}
      <div style={{ position: 'absolute', top: 220, width: '100%', padding: '0 80px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight,
            color: dark ? p.ink : '#fff', textAlign: 'center', lineHeight: 1.2,
            textShadow: dark ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
        {scene.sub && (
          <FadeInUp delay={16} motion={style.motion}>
            <div style={{
              marginTop: 12, fontFamily: FONT_BODY, fontSize: 32,
              color: dark ? 'rgba(26,26,26,0.75)' : 'rgba(255,255,255,0.85)',
              textAlign: 'center', lineHeight: 1.4,
            }}>{scene.sub}</div>
          </FadeInUp>
        )}
      </div>

      {/* 使用说明条（图标 + 文字，无卡片边框，居中集中 y:420-1420） */}
      <div style={{
        position: 'absolute', top: 420, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {tips.map((t, i) => (
          <FadeInUp key={i} delay={24 + i * 12} motion={style.motion} dist={36}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 24,
              background: dark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)', borderRadius: 22,
              padding: '26px 34px',
              border: dark ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18, flexShrink: 0,
                background: `linear-gradient(135deg, ${p.accent}30, ${p.accent}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 36, height: 36 }}>{Ico[t.icon](p.accent)}</div>
              </div>
              <div style={{
                fontFamily: typo.bodyFamily, fontSize: 38, fontWeight: 500,
                color: dark ? '#222' : '#fff', lineHeight: 1.5,
              }}>{t.text}</div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </AbsoluteFill>
  );
};

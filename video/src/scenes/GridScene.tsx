// S5 优势理由·三卡纵向排列 · 2026-08-21 深底版优化
// - 统一深色渐变背景，与整体墨绿风格一致
// - 三卡纵向居中排列，内容集中在 y:280-1100 区域
// - 白色卡片 + 左侧 accent 色条，深底上浮层次分明
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { ScaleIn } from '../components/animations';
import { CharReveal, IconBadge, elevation } from '../components/ui';
export const GridScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const cards = scene.cards ?? [];

  return (
    <AbsoluteFill style={{ background: 'transparent', justifyContent: 'center' }}>

      {/* 标题 */}
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 56px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: '0 3px 20px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* 三卡纵向排列 · 居中 */}
      <AbsoluteFill style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        paddingTop: 140,
      }}>
        {cards.map((c, i) => (
          <ScaleIn key={i} delay={10 + i * 12} motion={style.motion}>
            <div style={{
              width: 820,
              height: 180,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 24,
              boxShadow: elevation(2),
              borderLeft: `8px solid ${c.color}`,
              padding: '0 40px',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
            }}>
              {/* 左侧图标徽章 */}
              <IconBadge icon={c.icon} color={c.color} size={72} pad={16} radius={18} />

              {/* 右侧文字 */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: typo.family,
                  fontSize: 40,
                  fontWeight: typo.titleWeight,
                  color: p.ink,
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}>
                  {c.title}
                </div>
                <div style={{
                  fontFamily: typo.bodyFamily,
                  fontSize: 28,
                  color: '#666',
                  lineHeight: 1.5,
                }}>
                  {c.desc}
                </div>
              </div>
            </div>
          </ScaleIn>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

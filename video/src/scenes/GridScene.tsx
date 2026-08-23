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
            fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight, color: scene.darkText ? p.ink : '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: scene.darkText ? '0 2px 10px rgba(255,255,255,0.4)' : '0 3px 20px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* 三卡纵向排列 · 顶部对齐（与其他屏一致，top:280） */}
      <div style={{
        position: 'absolute', top: 280, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        {cards.map((c, i) => (
          <ScaleIn key={i} delay={10 + i * 12} motion={style.motion}>
            <div style={{
              width: 920,
              minHeight: 230,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 28,
              boxShadow: elevation(2),
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}>
              {/* 左侧图标徽章（居中卡片无左边框，靠图标+阴影区分，区别于 solution/panel 的左边框卡） */}
              <IconBadge icon={c.icon} color={c.color} size={84} pad={18} radius={22} />

              {/* 右侧文字 */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: typo.family,
                  fontSize: 44,
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
      </div>
    </AbsoluteFill>
  );
};

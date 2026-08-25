// S5 优势理由·三卡纵向排列 · 2026-08-21 深底版优化
// - 统一深色渐变背景，与整体墨绿风格一致
// - 三卡纵向居中排列，内容集中在 y:280-1100 区域
// - 白色卡片 + 左侧 accent 色条，深底上浮层次分明
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn } from '../components/animations';
import { CharReveal, IconBadge, elevation } from '../components/ui';
export const GridScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const cards = scene.cards ?? [];

  // 多层分区变体（R3 §5.6 呈现手法 ref-03，S5 用）：丝带标题 + 虚线圆角分区 + 数字锚点
  if (scene.layout === 'multi-section') {
    return <MultiSectionGrid scene={scene} style={style} typo={typo} p={p} />;
  }

  return (
    <AbsoluteFill style={{ background: 'transparent', justifyContent: 'center' }}>

      {/* 标题 */}
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 80px' }}>
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
              width: 880,
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
              {/* 数字焦点卡（number-focus 变体）：title=数字大字做视觉锚点，区别于图标卖点卡 */}
              {scene.cardVariant === 'number-focus' ? (
                <div style={{
                  fontFamily: typo.family, fontSize: 64, fontWeight: typo.titleWeight,
                  color: c.color, lineHeight: 1.1, flexShrink: 0, width: 200,
                  letterSpacing: '-0.01em',
                }}>
                  {c.title}
                </div>
              ) : (
                /* 左侧图标徽章（居中卡片无左边框，靠图标+阴影区分，区别于 solution/panel 的左边框卡） */
                <IconBadge icon={c.icon} color={c.color} size={84} pad={18} radius={22} />
              )}

              {/* 右侧文字（number-focus 时 title 已在左侧数字区，右侧只放说明） */}
              <div style={{ flex: 1 }}>
                {scene.cardVariant !== 'number-focus' && (
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
                )}
                <div style={{
                  fontFamily: typo.bodyFamily,
                  fontSize: scene.cardVariant === 'number-focus' ? 32 : 28,
                  color: scene.cardVariant === 'number-focus' ? '#555' : '#666',
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


// ── 多层分区变体（R3 §5.6 ref-03：丝带横幅标题 + 虚线圆角分区 + 数字锚点）──
const MultiSectionGrid: React.FC<{
  scene: Scene; style: StyleConfig;
  typo: { family: string; titleWeight: number; bodyWeight: number; bodyFamily: string };
  p: (typeof PALETTES)['berry-purple'];
}> = ({ scene, style, typo, p }) => {
  const cards = scene.cards ?? [];
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 丝带横幅标题（ref-03 丝带标题容器感） */}
      <div style={{ position: 'absolute', top: 240, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <FadeInUp motion={style.motion}>
          <div style={{
            background: `linear-gradient(135deg, ${p.accent} 0%, ${p.accentDark} 100%)`,
            borderRadius: 18, padding: '24px 64px', boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
          }}>
            <span style={{
              fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight,
              color: '#fff', lineHeight: 1.2, letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>{scene.title ?? ''}</span>
          </div>
        </FadeInUp>
      </div>

      {/* 2×2 虚线圆角分区（2px 主题色虚线边框，数字锚点） */}
      <div style={{
        position: 'absolute', top: 440, left: 80, right: 80, height: 1000,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 40,
      }}>
        {cards.map((c, i) => (
          <ScaleIn key={i} delay={10 + i * 8} motion={style.motion} startScale={0.94}>
            <div style={{
              border: `3px dashed ${p.accent}66`, borderRadius: 28,
              background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)',
              padding: '36px 32px', height: '100%', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            }}>
              {/* 大数字锚点（ref-03 数字锚点，56px 主题色） */}
              <div style={{
                fontFamily: typo.family, fontSize: 64, fontWeight: 900,
                color: c.color, lineHeight: 1.1, letterSpacing: '-0.01em',
              }}>{c.title}</div>
              <div style={{
                fontFamily: typo.bodyFamily, fontSize: 32, fontWeight: 500,
                color: scene.darkText ? '#333' : '#fff', lineHeight: 1.45, marginTop: 14,
              }}>{c.desc}</div>
            </div>
          </ScaleIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};

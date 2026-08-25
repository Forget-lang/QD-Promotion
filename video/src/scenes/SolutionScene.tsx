// S3/S5 解决方案·纵向大卡 · 2026-08-21 v4 视觉红线版
// - 纵向全宽大卡片，填满上 2/3
// - 每卡高 280px，宽 960px，左图标右文字
// - 透明背景，白色玻璃卡
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp } from '../components/animations';
import { CharReveal, IconBadge, elevation } from '../components/ui';
import { Ico } from '../components/icons';

export const SolutionScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const items = scene.items ?? [];

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 top: 120（安全区 ≥120px） */}
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 80px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight, color: scene.darkText ? p.ink : '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: scene.darkText ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
        {scene.sub && (
          <FadeInUp delay={18} motion={style.motion}>
            <div style={{
              marginTop: 16, fontFamily: FONT_BODY, fontSize: 34,
              color: scene.darkText ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.4,
              textShadow: scene.darkText ? 'none' : '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {scene.sub}
            </div>
          </FadeInUp>
        )}
      </div>

      {/* 卡片区：从 y:280 开始，纵向排列 */}
      <div style={{
        position: 'absolute', top: 280, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
      }}>
        {items.map((it, i) => {
          const cardColor = it.color || p.accent;
          const variant = scene.cardVariant ?? 'border-left';
          const cardRadius = variant === 'numbered' ? 32 : 36;
          return (
            <FadeInUp key={i} delay={12 + i * 16} motion={style.motion} dist={40}>
              <div style={{
                width: 920, minHeight: 230,
                backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: cardRadius,
                boxShadow: `${elevation(3)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
                display: 'flex', alignItems: 'center', gap: 36, padding: '36px 48px',
                backdropFilter: 'blur(12px)',
                // 变体差异：border-left=左边框 / center-icon=无边框 / numbered=无边框+编号圆
                borderLeft: variant === 'border-left' ? `10px solid ${cardColor}` : 'none',
              }}>
                {/* 编号圆（numbered 变体） */}
                {variant === 'numbered' && (
                  <div style={{
                    width: 76, height: 76, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${cardColor}, ${cardColor}dd)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 24px ${cardColor}55`,
                    fontFamily: typo.family, fontSize: 40, fontWeight: 900, color: '#fff',
                  }}>
                    {i + 1}
                  </div>
                )}
                {/* 表单式：有 fields 时不放大图标徽章（字段行自带小图标），像填表不像卖点卡 */}
                {!it.fields && <IconBadge icon={it.icon} color={cardColor} size={120} pad={26} radius={32} />}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: typo.family, fontSize: 44, fontWeight: typo.titleWeight,
                    color: '#1a1a1a', lineHeight: 1.3,
                  }}>
                    {it.title}
                  </div>
                  {/* 字段明细行（label:value，值 ≥32px，表单式操作清单专用） */}
                  {it.fields ? (
                    <div style={{ marginTop: 12 }}>
                      {it.fields.map((f, j) => (
                        <FadeInUp key={j} delay={20 + i * 16 + j * 6} motion={style.motion} dist={16}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                            {f.icon && (
                              <div style={{ width: 32, height: 32, flexShrink: 0 }}>
                                {Ico[f.icon]('#888')}
                              </div>
                            )}
                            <span style={{
                              fontFamily: FONT_BODY, fontSize: 26, color: '#666',
                              flexShrink: 0, lineHeight: 1.4,
                            }}>{f.label}</span>
                            <span style={{
                              fontFamily: FONT_BODY, fontSize: 32, fontWeight: 700, color: cardColor,
                              lineHeight: 1.4,
                            }}>{f.value}</span>
                          </div>
                        </FadeInUp>
                      ))}
                    </div>
                  ) : it.desc && (
                    <div style={{
                      fontFamily: FONT_BODY, fontSize: 28, fontWeight: typo.bodyWeight,
                      color: '#666', marginTop: 10, lineHeight: 1.5,
                    }}>
                      {it.desc}
                    </div>
                  )}
                </div>
              </div>
            </FadeInUp>
          );
        })}
      </div>

      {/* 底部脚注（表单式操作清单等需要补充口径时使用，样式与 FlowScene 一致） */}
      {scene.footnote && (
        <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 80px', textAlign: 'center' }}>
          <FadeInUp delay={100} motion={style.motion}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 32, color: scene.darkText ? 'rgba(26,26,26,0.85)' : 'rgba(255,255,255,0.92)',
              background: scene.darkText ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)',
              padding: '18px 44px', borderRadius: 999,
              display: 'inline-block',
              backdropFilter: 'blur(8px)',
              border: scene.darkText ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.25)',
            }}>
              {scene.footnote}
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

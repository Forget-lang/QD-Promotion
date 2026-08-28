// S3 次卡磁条卡面屏（cardface，R3 §5.4 · 2026-08-25 两区域版）
// - 上区域：深色磁条卡面（缩短 660×520，产品原型 m-card-magnetic-face：卡名+次数大字+字段+徽章/有效期）
// - 下区域：使用说明（商家自定义使用须知文本，R1 真实字段 ≤500 字；4 条使用规则直接显示）
// - 磁卡质感 = 右上光晕 + 主题色渐变蒙层（代码模拟）；次数大字是画面焦点
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn } from '../components/animations';
import { CharReveal, elevation } from '../components/ui';
import { Ico } from '../components/icons';

/** 十六进制颜色转 rgba（与产品 m-card-magnetic-face 同款转换） */
const hexToRgba = (hex: string, alpha: number): string => {
  const value = String(hex || '').replace('#', '');
  if (value.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const CardFaceScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const theme = scene.cardTheme ?? '#3E2060';
  const fields = scene.cardFields ?? [];
  const tips = scene.useTips ?? [];
  const dark = scene.darkText ?? false;

  // 卡面焦点块（C2）：faceFocus 优先（券包/优惠券等无「次」概念的载体）→ 回退次卡 times/total → 两者都无则整块不渲染
  const focus = scene.faceFocus;
  const hasFocus = focus != null || scene.times != null;
  const focusValue = focus ? focus.value : scene.times;
  const focusUnit = focus ? focus.unit ?? '' : '次';
  const focusNote = focus ? focus.note : `/ 共 ${scene.total} 次`;

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 y:180-340 */}
      <div style={{ position: 'absolute', top: 180, width: '100%', padding: '0 80px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight,
            color: dark ? p.ink : '#fff', textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: dark ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
        {scene.sub && (
          <FadeInUp delay={16} motion={style.motion}>
            <div style={{
              marginTop: 10, fontFamily: FONT_BODY, fontSize: 32,
              color: dark ? 'rgba(26,26,26,0.75)' : 'rgba(255,255,255,0.85)',
              textAlign: 'center', lineHeight: 1.4,
            }}>{scene.sub}</div>
          </FadeInUp>
        )}
      </div>

      {/* 上区域 · 磁条卡面 y:380-900（660×520 缩短，两区域布局） */}
      <div style={{ position: 'absolute', top: 380, left: 210, width: 660, height: 520 }}>
        <ScaleIn delay={8} motion={style.motion} startScale={0.85}>
          <div style={{
            width: 660, height: 520, borderRadius: 32,
            backgroundColor: theme,
            boxShadow: `${elevation(3)}, 0 24px 64px ${hexToRgba(theme, 0.45)}`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* 磁卡质感层 1：右上角光晕 */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(circle at 88% 6%, rgba(255,255,255,0.22) 0%, transparent 54%)',
            }} />
            {/* 磁卡质感层 2：主题色渐变蒙层 */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `linear-gradient(165deg, ${hexToRgba(theme, 0.15)} 0%, transparent 42%, rgba(0,0,0,0.16) 100%)`,
            }} />

            {/* 右上角商户名 */}
            <FadeInUp delay={20} motion={style.motion} dist={20}>
              <div style={{
                position: 'absolute', top: 30, right: 36,
                fontFamily: FONT_BODY, fontSize: 22, fontWeight: 500,
                color: 'rgba(255,255,255,0.72)', textAlign: 'right', lineHeight: 1.4,
              }}>{scene.merchantName}</div>
            </FadeInUp>

            {/* 卡面内容（产品结构：卡名 → 次数焦点 → 字段 → 底部徽章/有效期） */}
            <div style={{
              position: 'relative', height: '100%', boxSizing: 'border-box',
              padding: '36px 44px 40px', display: 'flex', flexDirection: 'column',
            }}>
              <FadeInUp delay={24} motion={style.motion} dist={24}>
                <div style={{
                  fontFamily: typo.family, fontSize: 44, fontWeight: 700, color: '#fff',
                  lineHeight: 1.3, paddingRight: 150,
                }}>{scene.cardName}</div>
              </FadeInUp>

              {/* 卡面焦点大字（faceFocus 优先，无 times 的载体不渲染，避免空「次 / 共 次」） */}
              {hasFocus && (
                <FadeInUp delay={30} motion={style.motion} dist={28}>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 18 }}>
                    <span style={{
                      fontFamily: typo.family, fontSize: 84, fontWeight: 700, color: '#fff',
                      lineHeight: 1, letterSpacing: '-0.02em',
                    }}>{focusValue}</span>
                    {focusUnit && (
                      <span style={{
                        fontFamily: typo.family, fontSize: 44, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginLeft: 8,
                      }}>{focusUnit}</span>
                    )}
                    {focusNote && (
                      <span style={{
                        fontFamily: FONT_BODY, fontSize: 26, color: 'rgba(255,255,255,0.72)', marginLeft: 10,
                      }}>{focusNote}</span>
                    )}
                  </div>
                </FadeInUp>
              )}

              {/* 附加字段区（核销间隔 / 发放方式，小字） */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26 }}>
                {fields.map((f, i) => (
                  <ScaleIn key={i} delay={36 + i * 6} motion={style.motion} startScale={0.92}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 30, height: 30, flexShrink: 0 }}>{Ico[f.icon]('rgba(255,255,255,0.85)')}</div>
                      <span style={{
                        fontFamily: FONT_BODY, fontSize: 22, color: 'rgba(255,255,255,0.6)',
                        flexShrink: 0, width: 96,
                      }}>{f.label}</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 28, fontWeight: 700, color: '#fff' }}>{f.value}</span>
                    </div>
                  </ScaleIn>
                ))}
              </div>

              {/* 底部：左类型徽章 + 右有效期 */}
              <FadeInUp delay={60} motion={style.motion} dist={16}>
                <div style={{
                  marginTop: 'auto', paddingTop: 28, display: 'flex', alignItems: 'flex-end',
                  justifyContent: 'space-between', gap: 20,
                }}>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 24, color: 'rgba(255,255,255,0.88)',
                    padding: '6px 16px', border: '2px solid rgba(255,255,255,0.35)',
                    borderRadius: 10, flexShrink: 0,
                  }}>{scene.cardType}</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 24, color: 'rgba(255,255,255,0.72)',
                    textAlign: 'right', lineHeight: 1.4,
                  }}>{scene.validLabel}</div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </ScaleIn>
      </div>

      {/* 下区域 · 使用说明 y:960-1560（商家自定义使用须知文本区，R1 ≤500 字） */}
      <div style={{
        position: 'absolute', top: 960, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <FadeInUp delay={70} motion={style.motion}>
          <div style={{
            fontFamily: typo.family, fontSize: 36, fontWeight: 700,
            color: dark ? p.ink : '#fff', textAlign: 'center', marginBottom: 6,
          }}>使用说明</div>
        </FadeInUp>
        {tips.map((t, i) => (
          <FadeInUp key={i} delay={76 + i * 10} motion={style.motion}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: dark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)', borderRadius: 18,
              padding: '14px 24px',
              border: dark ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ width: 32, height: 32, flexShrink: 0 }}>{Ico[t.icon](p.accent)}</div>
              <div style={{
                fontFamily: typo.bodyFamily, fontSize: 30, fontWeight: 500,
                color: dark ? '#222' : '#fff', lineHeight: 1.4,
              }}>{t.text}</div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </AbsoluteFill>
  );
};

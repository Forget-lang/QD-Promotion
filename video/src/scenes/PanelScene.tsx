// S7 数据面板·大图标数据卡 · 2026-08-21 v4 视觉红线版
// - 纵向全宽数据卡，大图标做焦点
// - 每卡高 280px，宽 960px
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn } from '../components/animations';
import { CharReveal, elevation } from '../components/ui';

export const PanelScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const metrics = scene.metrics ?? [];

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 top: 100 */}
      <div style={{ position: 'absolute', top: 100, width: '100%', padding: '0 60px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* 数据卡片区：从 y:280 开始 */}
      <div style={{
        position: 'absolute', top: 280, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
      }}>
        {metrics.map((m, i) => {
          const delay = 12 + i * 20;
          const mColor = m.color || p.accent;
          return (
            <ScaleIn key={i} delay={delay} motion={style.motion} startScale={0.88}>
              <div style={{
                width: 960, height: 280,
                backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 36,
                boxShadow: `${elevation(3)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
                display: 'flex', alignItems: 'center', gap: 40, padding: '0 48px',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${mColor}`,
              }}>
                {/* 大图标 */}
                <div style={{
                  width: 140, height: 140, borderRadius: 36,
                  background: `linear-gradient(135deg, ${mColor}25, ${mColor}08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 72, height: 72 }}>{Ico[m.icon](mColor)}</div>
                </div>

                {/* 文字区 */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: typo.family, fontSize: 52, fontWeight: typo.titleWeight,
                      color: '#1a1a1a', lineHeight: 1.2,
                    }}>
                      {m.title}
                    </span>
                    {m.dir === '↑' && (
                      <span style={{
                        fontSize: 40, color: '#43A047', fontWeight: 'bold',
                      }}>↑</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 30, color: '#666', lineHeight: 1.5,
                  }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            </ScaleIn>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 60px', textAlign: 'center' }}>
        <FadeInUp delay={90} motion={style.motion}>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 30, color: 'rgba(255,255,255,0.85)',
            background: 'rgba(255,255,255,0.12)', padding: '16px 40px', borderRadius: 999,
            display: 'inline-block',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            后台清清楚楚，每一分钱花在哪都看得见
          </div>
        </FadeInUp>
      </div>
    </AbsoluteFill>
  );
};

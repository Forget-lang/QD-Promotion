// S7 数据面板·大图标数据卡 · 2026-08-21 v4 视觉红线版
// - 纵向全宽数据卡，大图标做焦点
// - 每卡高 280px，宽 960px
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, Pulse } from '../components/animations';
import { CharReveal, StatCounter, elevation } from '../components/ui';

export const PanelScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const metrics = scene.metrics ?? [];

  // 排行条变体（R3 §5.6/§5.5：参考产品统计页排行榜 pages_card/stat，区别于 G03 白卡数据列表）
  if (scene.layout === 'ranking') {
    return <RankingPanel scene={scene} style={style} typo={typo} p={p} />;
  }

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
      </div>

      {/* 数据卡片区：从 y:280 开始 */}
      <div style={{
        position: 'absolute', top: 280, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
      }}>
        {metrics.map((m, i) => {
          const delay = 12 + i * 20;
          const mColor = m.color || p.accent;
          return (
            <ScaleIn key={i} delay={delay} motion={style.motion} startScale={0.88}>
              <div style={{
                width: 920, height: 280,
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <span style={{
                      fontFamily: typo.family, fontSize: 52, fontWeight: typo.titleWeight,
                      color: '#1a1a1a', lineHeight: 1.2,
                    }}>
                      {m.title}
                    </span>
                    {m.dir === '↑' && (
                      <Pulse delay={delay + 14} intensity={0.35} duration={18}>
                        <span style={{
                          fontSize: 36, color: '#43A047', fontWeight: 'bold',
                          display: 'inline-block',
                        }}>↑</span>
                      </Pulse>
                    )}
                  </div>
                  {/* 焦点数字（可选）：真实可述口径才填，禁止虚构营销数据 */}
                  {m.value != null && (
                    <StatCounter
                      value={m.value}
                      suffix={m.suffix}
                      delay={delay + 6}
                      color={mColor}
                      size={76}
                    />
                  )}
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 30, color: '#666', lineHeight: 1.5,
                    marginTop: m.value != null ? 4 : 8,
                  }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            </ScaleIn>
          );
        })}
      </div>

      {/* 底部说明（从数据读取，禁止硬编码） */}
      {scene.footnote && (
        <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 80px', textAlign: 'center' }}>
          <FadeInUp delay={90} motion={style.motion}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 30, color: scene.darkText ? 'rgba(26,26,26,0.85)' : 'rgba(255,255,255,0.85)',
              background: scene.darkText ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.12)',
              padding: '16px 40px', borderRadius: 999,
              display: 'inline-block',
              backdropFilter: 'blur(8px)',
              border: scene.darkText ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
              textShadow: scene.darkText ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              {scene.footnote}
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};


// ── 排行条变体（产品统计页排行榜样式：排名块 + 指标名 + 趋势 + 说明）──
const RankingPanel: React.FC<{
  scene: Scene; style: StyleConfig;
  typo: { family: string; titleWeight: number; bodyWeight: number; bodyFamily: string };
  p: (typeof PALETTES)['berry-purple'];
}> = ({ scene, style, typo, p }) => {
  const metrics = scene.metrics ?? [];
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题 */}
      <div style={{ position: 'absolute', top: 200, width: '100%', padding: '0 80px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight,
            color: scene.darkText ? p.ink : '#fff', textAlign: 'center', lineHeight: 1.2,
            textShadow: scene.darkText ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* 排行条区 y:400-1400：排名块 + 指标名 + 趋势 + 说明（产品排行榜样式） */}
      <div style={{
        position: 'absolute', top: 400, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 30,
      }}>
        {metrics.map((m, i) => {
          const delay = 12 + i * 18;
          const mColor = m.color || p.accent;
          return (
            <FadeInUp key={i} delay={delay} motion={style.motion} dist={40}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 30,
                background: scene.darkText ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(8px)', borderRadius: 24,
                padding: '28px 36px',
                border: scene.darkText ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: scene.darkText ? '0 10px 30px rgba(0,0,0,0.08)' : 'none',
              }}>
                {/* 排名块（1/2/3，主题色圆角方块，产品排行榜风格） */}
                <div style={{
                  width: 92, height: 92, borderRadius: 22, flexShrink: 0,
                  background: `linear-gradient(135deg, ${mColor} 0%, ${mColor}cc 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${mColor}55`,
                }}>
                  <span style={{
                    fontFamily: typo.family, fontSize: 56, fontWeight: 900, color: '#fff',
                    lineHeight: 1,
                  }}>{i + 1}</span>
                </div>
                {/* 指标名 + 趋势 */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{
                      fontFamily: typo.family, fontSize: 52, fontWeight: typo.titleWeight,
                      color: scene.darkText ? '#1a1a1a' : '#fff', lineHeight: 1.2,
                    }}>{m.title}</span>
                    {m.dir === '↑' && (
                      <span style={{ fontSize: 40, color: '#43A047', fontWeight: 'bold' }}>↑</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: typo.bodyFamily, fontSize: 30, color: scene.darkText ? '#666' : 'rgba(255,255,255,0.75)',
                    lineHeight: 1.5, marginTop: 6,
                  }}>{m.desc}</div>
                </div>
                {/* 图标（右侧弱化） */}
                <div style={{ width: 56, height: 56, flexShrink: 0, opacity: 0.6 }}>
                  {Ico[m.icon](mColor)}
                </div>
              </div>
            </FadeInUp>
          );
        })}
      </div>

      {/* 底部说明 */}
      {scene.footnote && (
        <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 80px', textAlign: 'center' }}>
          <FadeInUp delay={90} motion={style.motion}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 30, color: scene.darkText ? 'rgba(26,26,26,0.85)' : 'rgba(255,255,255,0.85)',
              background: scene.darkText ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.12)',
              padding: '16px 40px', borderRadius: 999, display: 'inline-block',
              backdropFilter: 'blur(8px)',
              border: scene.darkText ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
            }}>{scene.footnote}</div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

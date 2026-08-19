// S3 解决方案·三特性卡 · 2026-08-17 视觉升级
// - 版式变体：vertical（纵向通栏，默认）/ horizontal（三卡横排）
// - typography 落地：读取 style.typography
// - 浅底增加 DotGrid 点阵纹理
// - 卡片增加 accent 色顶部装饰条，强化视觉层次
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
// FONT_BODY 保留用于 fallback；正文实际使用 typo.bodyFamily
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp } from '../components/animations';
import { SectionTitle } from '../components/ui';
import { DotGrid } from '../components/background';

export const SolutionScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const isHorizontal = scene.layout === 'horizontal';

  return (
    <AbsoluteFill style={{ background: `${p.paper}bf`, justifyContent: 'center' }}>
      <DotGrid color={`${p.accent}10`} spacing={44} size={3} />
      <div style={{ position: 'absolute', top: 110, width: '100%', padding: '0 56px' }}>
        <SectionTitle text={scene.title ?? ''} color={p.ink} size={60} underline={p.accent} />
      </div>

      {isHorizontal ? (
        // 横向三卡排列
        <AbsoluteFill style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28, paddingTop: 200 }}>
          {(scene.items ?? []).map((it, i) => (
            <FadeInUp key={i} delay={10 + i * 12} motion={style.motion}>
              <div style={{
                width: 300, height: 460, backgroundColor: '#fff', borderRadius: 28,
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                borderTop: `6px solid ${p.accent}`,
                padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20,
              }}>
                <div style={{
                  width: 90, height: 90, backgroundColor: `${p.accent}15`,
                  borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {Ico[it.icon](p.accent)}
                </div>
                <div style={{
                  fontFamily: typo.family, fontSize: 38, fontWeight: typo.titleWeight, color: p.ink, lineHeight: 1.3,
                }}>
                  {it.title}
                </div>
                <div style={{
                  fontFamily: typo.bodyFamily, fontSize: 26, fontWeight: typo.bodyWeight,
                  color: '#888', lineHeight: 1.55,
                }}>
                  {it.desc}
                </div>
              </div>
            </FadeInUp>
          ))}
        </AbsoluteFill>
      ) : (
        // 纵向通栏（默认）
        <AbsoluteFill style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26, paddingTop: 200 }}>
          {(scene.items ?? []).map((it, i) => (
            <FadeInUp key={i} delay={10 + i * 12} motion={style.motion}>
              <div style={{
                width: 860, height: 140, backgroundColor: '#fff', borderRadius: 24,
                display: 'flex', alignItems: 'center', gap: 32, padding: '0 40px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                borderLeft: `6px solid ${it.color}`,
              }}>
                <div style={{
                  width: 72, height: 72, backgroundColor: `${it.color}26`,
                  borderRadius: 18, padding: 16, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {Ico[it.icon](it.color)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: typo.family, fontSize: 40, fontWeight: typo.titleWeight, color: p.ink, lineHeight: 1.2,
                  }}>
                    {it.title}
                  </div>
                  <div style={{
                    fontFamily: typo.bodyFamily, fontSize: 28, fontWeight: typo.bodyWeight,
                    color: '#888', marginTop: 6,
                  }}>
                    {it.desc}
                  </div>
                </div>
              </div>
            </FadeInUp>
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

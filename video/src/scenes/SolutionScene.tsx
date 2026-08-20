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
import { FadeInUp } from '../components/animations';
import { SectionTitle, IconBadge, elevation } from '../components/ui';
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
                boxShadow: `${elevation(2)}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                borderTop: `6px solid ${p.accent}`,
                padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20,
              }}>
                <IconBadge icon={it.icon} color={p.accent} size={90} pad={20} radius={24} />
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
                boxShadow: elevation(1),
                borderLeft: `6px solid ${it.color}`,
              }}>
                <IconBadge icon={it.icon} color={it.color} size={72} pad={16} radius={18} />
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

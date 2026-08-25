// S4 括号分组屏（bracket-group，R3 §5.6 呈现手法 ref-05 · 2026-08-25）
// - 左侧竖排分类标签（大编号 + 步骤名，主题色）→ 大括号聚合 → 右侧字段明细
// - 重点字段黄色高亮（ref-05 重点行高亮）
// - 信息组织方式与卡片/节点完全不同（非卡片流）
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp } from '../components/animations';
import { CharReveal } from '../components/ui';

export const BracketGroupScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const groups = scene.bracketGroups ?? [];
  const dark = scene.darkText ?? false;

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 y:240-400 */}
      <div style={{ position: 'absolute', top: 240, width: '100%', padding: '0 80px' }}>
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

      {/* 主体区 y:460-1400：左标签（260px）→ 大括号（60px）→ 右明细（flex:1） */}
      <div style={{
        position: 'absolute', top: 460, left: 80, right: 80, height: 940,
        display: 'flex',
      }}>
        {/* 左侧竖排分类标签 */}
        <div style={{ width: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {groups.map((g, i) => (
            <FadeInUp key={i} delay={10 + i * 12} motion={style.motion} dist={40}>
              <div>
                <div style={{
                  fontFamily: typo.family, fontSize: 60, fontWeight: 900,
                  color: p.accent, lineHeight: 1,
                }}>{g.index}</div>
                <div style={{
                  marginTop: 10, fontFamily: typo.family, fontSize: 44, fontWeight: 700,
                  color: dark ? p.ink : '#fff', lineHeight: 1.3,
                }}>{g.label}</div>
              </div>
            </FadeInUp>
          ))}
        </div>

        {/* 中间大括号（SVG draw-on 聚合，ref-05 括号分组核心） */}
        <div style={{ width: 70, position: 'relative', flexShrink: 0 }}>
          <BraceSvg accent={p.accent} delay={20} />
        </div>

        {/* 右侧字段明细（与左标签逐行对应） */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingLeft: 20 }}>
          {groups.map((g, i) => (
            <FadeInUp key={i} delay={30 + i * 14} motion={style.motion}>
              <div>
                {g.detail.split('|').map((line, j) => (
                  <div key={j} style={{
                    fontFamily: typo.bodyFamily, fontSize: 34, fontWeight: 500,
                    color: g.highlight ? '#8a6d00' : (dark ? 'rgba(26,26,26,0.88)' : 'rgba(255,255,255,0.92)'),
                    background: g.highlight ? 'rgba(255,215,0,0.30)' : 'transparent',
                    display: 'inline-block', padding: '2px 12px', borderRadius: 8,
                    lineHeight: 1.6, marginBottom: 6,
                  }}>{line}</div>
                ))}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 右侧大括号（SVG 路径 + draw-on 动画） */
const BraceSvg: React.FC<{ accent: string; delay: number }> = ({ accent, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <svg width="70" height="100%" viewBox="0 0 70 900" style={{ position: 'absolute', inset: 0 }}>
      <path
        d="M30 0 C 58 0, 58 60, 58 140 L 58 360 C 58 420, 70 450, 58 450 C 70 450, 58 480, 58 540 L 58 760 C 58 840, 58 900, 30 900"
        fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round"
        strokeDasharray="1400"
        strokeDashoffset={1400 * (1 - p)}
      />
    </svg>
  );
};

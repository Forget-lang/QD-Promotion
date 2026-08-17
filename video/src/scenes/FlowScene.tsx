// S4 裂变·流程图 · 读 scene/style 数据渲染
// M5 修复：箭头动画由 CSS transition（Remotion 帧渲染不生效）改为 interpolate 驱动
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_ROUND, FONT_TITLE, INK, PALETTES, PAPER } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn } from '../components/animations';
import { SlideTag } from '../components/ui';

const ArrowNode: React.FC<{ i: number; color: string }> = ({ i, color }) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [20 + i * 22 + 10, 20 + i * 22 + 16], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      width: 48, height: 48, opacity: lit,
      transform: `translateX(${interpolate(lit, [0, 1], [-16, 0])}px)`,
    }}>{Ico.arrow(color)}</div>
  );
};

export const FlowScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const f = useCurrentFrame();
  const nodes = scene.nodes ?? [];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${p.bgDark} 0%, ${p.bgDark2} 100%)`, justifyContent: 'center' }}>
      <SlideTag cur={index + 1} total={total} dark />
      <div style={{ position: 'absolute', top: 130, width: '100%', padding: '0 56px' }}>
        <FadeInUp>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 58, fontWeight: 900, color: PAPER, textAlign: 'center' }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 150 }}>
        {nodes.map((n, i) => {
          const lit = f > 20 + i * 22; // 节点依次亮起
          return (
            <React.Fragment key={i}>
              <ScaleIn delay={18 + i * 22}>
                <div style={{
                  width: 210, height: 210, borderRadius: 26,
                  backgroundColor: lit ? '#fff' : 'rgba(255,255,255,0.08)',
                  border: `3px solid ${lit ? n.color : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                  opacity: lit ? 1 : 0.5,
                }}>
                  <div style={{ width: 70, height: 70 }}>{Ico[n.icon](lit ? n.color : 'rgba(255,255,255,0.4)')}</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 27, fontWeight: 700,
                    color: lit ? INK : 'rgba(255,255,255,0.5)',
                  }}>{n.title}</div>
                </div>
              </ScaleIn>
              {i < nodes.length - 1 && <ArrowNode i={i} color={p.accent} />}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
        <FadeInUp delay={110}>
          <div style={{
            fontFamily: FONT_ROUND, fontSize: 34, color: 'rgba(255,255,255,0.85)',
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 32px', borderRadius: 999,
          }}>
            {scene.footnote}
          </div>
        </FadeInUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

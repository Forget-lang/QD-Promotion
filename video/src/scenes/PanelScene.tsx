// S6 价值·数据面板 · 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, FONT_TITLE, PALETTES, PAPER } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn } from '../components/animations';
import { SlideTag } from '../components/ui';

export const PanelScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
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
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26, paddingTop: 200 }}>
        {(scene.metrics ?? []).map((m, i) => (
          <ScaleIn key={i} delay={10 + i * 12}>
            <div style={{
              width: 300, height: 360, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 26,
              border: `2px solid ${m.color}55`, padding: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{ width: 64, height: 64 }}>{Ico[m.icon](m.color)}</div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 78, fontWeight: 900, color: m.color }}>{m.dir}</div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 40, fontWeight: 900, color: PAPER }}>{m.title}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.4 }}>{m.desc}</div>
            </div>
          </ScaleIn>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

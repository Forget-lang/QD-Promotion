// S5 手气券·卡片网格 2×2 · 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, FONT_TITLE, INK, PALETTES } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn } from '../components/animations';
import { SlideTag } from '../components/ui';

export const GridScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  return (
    <AbsoluteFill style={{ background: p.bg, justifyContent: 'center' }}>
      <SlideTag cur={index + 1} total={total} />
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 56px' }}>
        <FadeInUp>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 58, fontWeight: 900, color: INK, textAlign: 'center' }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>
      <AbsoluteFill style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 26, paddingTop: 200 }}>
        {(scene.cards ?? []).map((c, i) => (
          <ScaleIn key={i} delay={10 + i * 10}>
            <div style={{
              width: 400, height: 220, backgroundColor: '#fff', borderRadius: 24,
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)', padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10,
            }}>
              <div style={{ width: 56, height: 56, backgroundColor: `${c.color}1a`, borderRadius: 14, padding: 12 }}>{Ico[c.icon](c.color)}</div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 38, fontWeight: 900, color: INK }}>{c.title}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: '#888' }}>{c.desc}</div>
            </div>
          </ScaleIn>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

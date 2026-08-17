// S3 解法·次卡锁客（PPT 幻灯片式）· 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BG_LIGHT, FONT_BODY, FONT_TITLE, INK, PALETTES } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp } from '../components/animations';
import { SectionTitle, SlideTag } from '../components/ui';

export const SolutionScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  return (
    <AbsoluteFill style={{ background: p.paper, justifyContent: 'center' }}>
      <SlideTag cur={index + 1} total={total} />
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 56px' }}>
        <SectionTitle text={scene.title ?? ''} color={p.ink} size={64} underline={p.accent} />
      </div>

      <AbsoluteFill style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30, paddingTop: 210 }}>
        {(scene.items ?? []).map((it, i) => (
          <FadeInUp key={i} delay={12 + i * 14}>
            <div style={{
              width: 860, height: 150, backgroundColor: BG_LIGHT, borderRadius: 24,
              display: 'flex', alignItems: 'center', gap: 32, padding: '0 40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            }}>
              <div style={{ width: 80, height: 80, flexShrink: 0, backgroundColor: '#fff', borderRadius: 18, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {Ico[it.icon](it.color)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_TITLE, fontSize: 44, fontWeight: 900, color: INK }}>{it.title}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: '#777', marginTop: 4 }}>{it.desc}</div>
              </div>
            </div>
          </FadeInUp>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

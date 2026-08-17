// S2 痛点·红绿对比 · 读 scene/style 数据渲染
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ACCENT_RED, FONT_BODY, FONT_TITLE, PALETTES } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, SlideInLeft, SlideInRight } from '../components/animations';
import { SlideTag } from '../components/ui';

export const PainScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  return (
    <AbsoluteFill style={{ background: p.bg, justifyContent: 'center' }}>
      <SlideTag cur={index + 1} total={total} />
      <div style={{ position: 'absolute', top: 110, width: '100%', padding: '0 56px' }}>
        <FadeInUp>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 56, fontWeight: 900, color: p.ink, textAlign: 'center', lineHeight: 1.25 }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, paddingTop: 120 }}>
        {/* 左：红卡·痛点 */}
        <SlideInLeft delay={10}>
          <div style={{
            width: 460, height: 560, backgroundColor: '#fff', borderRadius: 28,
            boxShadow: '0 18px 50px rgba(239,83,80,0.18)', border: '3px solid #FFCDD2',
            padding: 40, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, backgroundColor: ACCENT_RED, borderRadius: 12, padding: 9 }}>{Ico.x('#fff')}</div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 38, fontWeight: 900, color: ACCENT_RED }}>{scene.leftTitle}</div>
            </div>
            {(scene.leftItems ?? []).map((t, i) => (
              <FadeInUp key={i} delay={20 + i * 12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 34, height: 34, flexShrink: 0 }}>{Ico.x(ACCENT_RED)}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 34, fontWeight: 500, color: '#555' }}>{t}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </SlideInLeft>

        {/* 中：VS */}
        <div style={{ fontFamily: FONT_TITLE, fontSize: 40, fontWeight: 900, color: '#bbb' }}>VS</div>

        {/* 右：绿卡·悬念（先暗后亮） */}
        <SlideInRight delay={14}>
          <ScaleIn delay={40}>
            <div style={{
              width: 460, height: 560, borderRadius: 28,
              background: `linear-gradient(150deg, ${p.accent} 0%, ${p.accentDark} 100%)`,
              boxShadow: '0 18px 50px rgba(7,193,96,0.28)',
              padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, marginBottom: 24 }}>{Ico.check('#fff')}</div>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 46, fontWeight: 900, color: '#fff', lineHeight: 1.3 }}>
                {scene.rightTitle}
              </div>
              <div style={{ marginTop: 22, fontFamily: FONT_BODY, fontSize: 30, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                {scene.rightSub}
              </div>
            </div>
          </ScaleIn>
        </SlideInRight>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

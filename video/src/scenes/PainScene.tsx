// S2 痛点·红绿对比 · 2026-08-17 专业级优化
// - 修复嵌套时序 Bug：原 <SlideInRight delay=14><ScaleIn delay=40> 导致右卡滑入时不可见、
//   第 40 帧才弹出（slide 动画白做）。改为 SlideInRight 单层 + 内联 scale spring。
// - motion 全部透传 style.motion
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { ACCENT_RED, PALETTES, TYPOGRAPHY } from '../palette';
import { FPS } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, SlideInLeft, SlideInRight, SPRING_CONFIG } from '../components/animations';
import { SlideTag } from '../components/ui';
import { DotGrid } from '../components/background';

export const PainScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  // 右卡：slide + scale 合并到同一 spring 起点，避免时序错位
  const rightSpr = spring({
    frame: f - 14, fps: FPS, config: SPRING_CONFIG[style.motion],
  });

  return (
    <AbsoluteFill style={{ background: p.bg, justifyContent: 'center' }}>
      <DotGrid color={`${p.accent}0d`} spacing={44} size={3} />
      <SlideTag cur={index + 1} total={total} />
      <div style={{ position: 'absolute', top: 110, width: '100%', padding: '0 56px' }}>
        <FadeInUp motion={style.motion}>
          <div style={{ fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight, color: p.ink, textAlign: 'center', lineHeight: 1.25 }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, paddingTop: 120 }}>
        {/* 左：红卡·痛点 */}
        <SlideInLeft delay={10} motion={style.motion}>
          <div style={{
            width: 460, height: 560, backgroundColor: '#fff', borderRadius: 28,
            boxShadow: '0 18px 50px rgba(239,83,80,0.18)', border: '3px solid #FFCDD2',
            padding: 40, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, backgroundColor: ACCENT_RED, borderRadius: 12, padding: 9 }}>{Ico.x('#fff')}</div>
              <div style={{ fontFamily: typo.family, fontSize: 38, fontWeight: typo.titleWeight, color: ACCENT_RED }}>{scene.leftTitle}</div>
            </div>
            {(scene.leftItems ?? []).map((t, i) => (
              <FadeInUp key={i} delay={20 + i * 12} motion={style.motion}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 34, height: 34, flexShrink: 0 }}>{Ico.x(ACCENT_RED)}</div>
                  <div style={{ fontFamily: typo.bodyFamily, fontSize: 34, fontWeight: typo.bodyWeight, color: '#555' }}>{t}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </SlideInLeft>

        {/* 中：VS */}
        <div style={{ fontFamily: typo.family, fontSize: 40, fontWeight: typo.titleWeight, color: '#bbb' }}>VS</div>

        {/* 右：绿卡·解法（slide + scale 同步） */}
        <div style={{
          opacity: rightSpr,
          transform: `translateX(${(1 - rightSpr) * 90}px) scale(${0.82 + rightSpr * 0.18})`,
        }}>
          <div style={{
            width: 460, height: 560, borderRadius: 28,
            background: `linear-gradient(150deg, ${p.accent} 0%, ${p.accentDark} 100%)`,
            boxShadow: '0 18px 50px rgba(7,193,96,0.28)',
            padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, marginBottom: 24 }}>{Ico.check('#fff')}</div>
            <div style={{ fontFamily: typo.family, fontSize: 46, fontWeight: typo.titleWeight, color: '#fff', lineHeight: 1.3 }}>
              {scene.rightTitle}
            </div>
            <div style={{ marginTop: 22, fontFamily: typo.bodyFamily, fontSize: 30, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
              {scene.rightSub}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

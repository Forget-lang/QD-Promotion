// S1 钩子屏 · 2026-08-21 v4 视觉红线版
// - 数字超大做唯一焦点（180px）
// - 标题整体居中，去掉碎装饰
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ACCENT_GREEN, FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { FadeInUp, ScaleIn, WipeIn, Pulse } from '../components/animations';
import { CharReveal, HighLightText } from '../components/ui';

export const HookScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];

  return (
    <AbsoluteFill style={{ background: 'transparent', justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
      {style.hookStyle === 'number' && <NumberHook scene={scene} style={style} typo={typo} p={p} />}
      {style.hookStyle === 'contrast' && <ContrastHook scene={scene} style={style} typo={typo} p={p} />}
      {style.hookStyle === 'question' && <QuestionHook scene={scene} style={style} typo={typo} p={p} />}
      {style.hookStyle === 'clock' && <ClockHook scene={scene} style={style} typo={typo} p={p} />}
    </AbsoluteFill>
  );
};

const NumberHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  const hasNumber = scene.hookNumber && scene.hookNumber.length > 0;
  const title = scene.title ?? '';

  if (!hasNumber) {
    return (
      <>
        <WipeIn delay={2} duration={20}>
          <div style={{
            fontFamily: typo.family, fontSize: 110, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}>
            <CharReveal text={title} delay={2} />
          </div>
        </WipeIn>
        <FadeInUp delay={24} motion={style.motion}>
          <div style={{
            marginTop: 40, fontFamily: FONT_BODY, fontSize: 42,
            color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.5,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            {scene.sub}
          </div>
        </FadeInUp>
      </>
    );
  }

  const parts = title.split(scene.hookNumber!);
  return (
    <>
      <WipeIn delay={2} duration={20}>
        <div style={{
          fontFamily: typo.family, fontSize: 78, fontWeight: typo.titleWeight, color: '#fff',
          textAlign: 'center', lineHeight: 1.25,
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          {parts[0]}
        </div>
      </WipeIn>
      <ScaleIn delay={10} motion={style.motion} startScale={0.2}>
        <Pulse delay={30} intensity={0.1} duration={28}>
          <div style={{
            fontFamily: typo.family, fontSize: 200, fontWeight: typo.titleWeight,
            color: p.accent, lineHeight: 1.1, textAlign: 'center',
            textShadow: `0 0 50px ${p.accent}60, 0 6px 30px rgba(0,0,0,0.4)`,
            margin: '20px 0',
          }}>
            {scene.hookNumber}
            {scene.hookUnit && <span style={{ fontSize: 90 }}>{scene.hookUnit}</span>}
          </div>
        </Pulse>
      </ScaleIn>
      <WipeIn delay={20} duration={18}>
        <div style={{
          fontFamily: typo.family, fontSize: 78, fontWeight: typo.titleWeight, color: '#fff',
          textAlign: 'center', lineHeight: 1.25,
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          {parts[1] ?? ''}
        </div>
      </WipeIn>
      <FadeInUp delay={36} motion={style.motion}>
        <div style={{
          marginTop: 36, fontFamily: FONT_BODY, fontSize: 40,
          color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.5,
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

const ClockHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  return (
    <>
      <ScaleIn delay={2} motion={style.motion} startScale={0.3}>
        <Pulse delay={20} intensity={0.06} duration={24}>
          <svg width="220" height="220" viewBox="0 0 240 240" style={{ marginBottom: 30 }}>
            <circle cx="120" cy="120" r="108" fill="none" stroke={p.accent} strokeWidth="2" opacity="0.2" />
            <circle cx="120" cy="120" r="92" fill="none" stroke={p.accent} strokeWidth="4" opacity="0.5" />
            <circle cx="120" cy="120" r="82" fill="rgba(255,255,255,0.08)" stroke={p.accent} strokeWidth="5" />
            {[0, 90, 180, 270].map((deg) => (
              <line key={deg} x1="120" y1="44" x2="120" y2="56"
                stroke={p.accent} strokeWidth="4" strokeLinecap="round"
                transform={`rotate(${deg} 120 120)`} />
            ))}
            <line x1="120" y1="120" x2="172" y2="120" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            <line x1="120" y1="120" x2="120" y2="58" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <circle cx="120" cy="120" r="10" fill={p.accent} />
          </svg>
        </Pulse>
      </ScaleIn>
      <WipeIn delay={14} duration={18}>
        <div style={{
          fontFamily: typo.family, fontSize: 88, fontWeight: typo.titleWeight,
          color: '#fff', textAlign: 'center', lineHeight: 1.2,
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          <CharReveal text={scene.title ?? ''} delay={14} />
        </div>
      </WipeIn>
      <FadeInUp delay={32} motion={style.motion}>
        <div style={{
          marginTop: 32, fontFamily: FONT_BODY, fontSize: 38,
          color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.5,
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

const ContrastHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  const dark = scene.darkText ?? false;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* 主标题（主题引入，VS 对比仍是焦点） */}
      {scene.title && (
        <div style={{ marginBottom: 64 }}>
          <CharReveal
            text={scene.title}
            delay={2}
            style={{
              fontFamily: typo.family, fontSize: 76, fontWeight: typo.titleWeight,
              color: dark ? p.ink : '#fff', textAlign: 'center', lineHeight: 1.25,
              textShadow: dark ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 30px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 40 }}>
        <HighLightText
          text={scene.leftTitle ?? '降价'}
          color="#EF5350" textColor="#EF5350"
          fontSize={120} delay={2} motion={style.motion}
        />
        <div style={{
          fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight,
          color: dark ? 'rgba(26,26,26,0.45)' : 'rgba(255,255,255,0.5)',
          textShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          VS
        </div>
        <HighLightText
          text={scene.rightTitle ?? '锁客'}
          color={ACCENT_GREEN} textColor={ACCENT_GREEN}
          fontSize={120} delay={2} motion={style.motion}
        />
      </div>
      <FadeInUp delay={30} motion={style.motion}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 40, color: dark ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.85)',
          textAlign: 'center', lineHeight: 1.5,
          textShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </div>
  );
};

const QuestionHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  return (
    <>
      <ScaleIn delay={2} motion={style.motion} startScale={0.2}>
        <Pulse delay={20} intensity={0.08} duration={20}>
          <div style={{
            fontFamily: typo.family, fontSize: 200, fontWeight: typo.titleWeight,
            color: p.accent, lineHeight: 1, marginBottom: 24,
            textShadow: `0 0 50px ${p.accent}60, 0 6px 30px rgba(0,0,0,0.4)`,
          }}>
            ?
          </div>
        </Pulse>
      </ScaleIn>
      <WipeIn delay={14} duration={18}>
        <div style={{
          fontFamily: typo.family, fontSize: 88, fontWeight: typo.titleWeight,
          color: scene.darkText ? p.ink : '#fff', textAlign: 'center', lineHeight: 1.2,
          textShadow: scene.darkText ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          <CharReveal text={scene.title ?? ''} delay={14} />
        </div>
      </WipeIn>
      <FadeInUp delay={30} motion={style.motion}>
        <div style={{
          marginTop: 32, fontFamily: FONT_BODY, fontSize: 38,
          color: scene.darkText ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.5,
          textShadow: scene.darkText ? 'none' : '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

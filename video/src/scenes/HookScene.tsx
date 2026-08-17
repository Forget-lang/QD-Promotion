// S1 钩子屏 · 2026-08-17 视觉升级
// - 支持 hookStyle: number / contrast / question 三种钩子型
// - typography 落地：读取 style.typography 选择字体字重
// - 深底增加 GlowOrb 柔光层，营造视觉深度
// - number 型：数字 spring 弹入 + Pulse 强调
// - contrast 型：左右红绿对比大字冲击
// - question 型：大问号 + 提问文字
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, PALETTES, TYPOGRAPHY } from '../palette';
import { FPS } from '../palette';
import type { Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, WipeIn, Pulse, EASE_OUT, SPRING_CONFIG } from '../components/animations';
import { SlideTag } from '../components/ui';
import { GlowOrb } from '../components/background';

export const HookScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style, index, total,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  const float = Math.sin(f / 15) * 8;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.bgDark} 0%, ${p.bgDark2} 100%)` }}>
      {/* 柔光层 */}
      <GlowOrb x={-100} y={-80} size={500} color={`${p.accent}40`} />
      <GlowOrb x={700} y={1200} size={400} color={`${p.accent}25`} delay={10} />

      <SlideTag cur={index + 1} total={total} dark />

      {/* 装饰：右上浮动图标 */}
      <div style={{
        position: 'absolute', top: 120, right: 70, width: 120, height: 120,
        opacity: 0.85, transform: `translateY(${float}px)`,
      }}>
        {Ico.cup(p.accent)}
      </div>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        {style.hookStyle === 'number' && <NumberHook scene={scene} style={style} typo={typo} p={p} />}
        {style.hookStyle === 'contrast' && <ContrastHook scene={scene} style={style} typo={typo} p={p} />}
        {style.hookStyle === 'question' && <QuestionHook scene={scene} style={style} typo={typo} p={p} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 数字型钩子：标题中拆出数字，accent 色弹入 + Pulse
const NumberHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  const title = scene.title ?? '';
  const splitIdx = title.indexOf('十次');
  const before = splitIdx >= 0 ? title.slice(0, splitIdx) : title;
  const after = splitIdx >= 0 ? title.slice(splitIdx + 2) : '';

  return (
    <>
      <WipeIn delay={2} duration={18}>
        <div style={{
          fontFamily: typo.family, fontSize: 108, fontWeight: typo.titleWeight, color: p.paper,
          textAlign: 'center', lineHeight: 1.15,
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          {before}
          {splitIdx >= 0 && (
            <ScaleIn delay={8} motion={style.motion} startScale={0.3}>
              <Pulse delay={28} intensity={0.08} duration={24}>
                <span style={{
                  fontSize: 148, color: p.accent,
                  textShadow: `0 0 40px ${p.accent}55`,
                }}>
                  10<span style={{ fontSize: 80 }}>次</span>
                </span>
              </Pulse>
            </ScaleIn>
          )}
          {after}
        </div>
      </WipeIn>
      <FadeInUp delay={20} motion={style.motion}>
        <div style={{
          marginTop: 36, fontFamily: FONT_BODY, fontSize: 40,
          color: 'rgba(255,255,255,0.78)', textAlign: 'center', lineHeight: 1.5,
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

// 反差型钩子：左红词 vs 右绿词，中间 VS 冲击
const ContrastHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  const f = useCurrentFrame();
  const leftSpr = spring({ frame: f - 4, fps: FPS, config: SPRING_CONFIG[style.motion] });
  const rightSpr = spring({ frame: f - 14, fps: FPS, config: SPRING_CONFIG[style.motion] });
  const vsSpr = spring({ frame: f - 24, fps: FPS, config: { damping: 12, stiffness: 120 } });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 40 }}>
        <div style={{
          fontFamily: typo.family, fontSize: 120, fontWeight: typo.titleWeight,
          color: '#EF5350', opacity: leftSpr,
          transform: `translateX(${interpolate(leftSpr, [0, 1], [-60, 0])}px)`,
          textShadow: '0 4px 30px rgba(239,83,80,0.4)',
        }}>
          {scene.leftTitle ?? '降价'}
        </div>
        <div style={{
          fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight,
          color: 'rgba(255,255,255,0.4)', transform: `scale(${vsSpr}) rotate(${interpolate(vsSpr, [0, 1], [-20, 0])}deg)`,
        }}>
          VS
        </div>
        <div style={{
          fontFamily: typo.family, fontSize: 120, fontWeight: typo.titleWeight,
          color: p.accent, opacity: rightSpr,
          transform: `translateX(${interpolate(rightSpr, [0, 1], [60, 0])}px)`,
          textShadow: `0 4px 30px ${p.accent}55`,
        }}>
          {scene.rightTitle ?? '锁客'}
        </div>
      </div>
      <FadeInUp delay={30} motion={style.motion}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 40, color: 'rgba(255,255,255,0.78)',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

// 提问型钩子：大问号 + 提问文字
const QuestionHook: React.FC<{ scene: Scene; style: StyleConfig; typo: { family: string; titleWeight: number; bodyWeight: number }; p: typeof PALETTES['mint-cool'] }> = ({ scene, style, typo, p }) => {
  const f = useCurrentFrame();
  const qSpr = spring({ frame: f - 2, fps: FPS, config: { damping: 10, stiffness: 80 } });
  const qPulse = interpolate(f - 20, [0, 20], [1, 1.08], { extrapolateRight: 'clamp', easing: EASE_OUT });

  return (
    <>
      <ScaleIn delay={2} motion={style.motion} startScale={0.2}>
        <div style={{
          fontFamily: typo.family, fontSize: 180, fontWeight: typo.titleWeight,
          color: p.accent, lineHeight: 1, marginBottom: 20,
          transform: `scale(${qSpr * qPulse})`,
          textShadow: `0 0 50px ${p.accent}66`,
        }}>
          ?
        </div>
      </ScaleIn>
      <WipeIn delay={12} duration={16}>
        <div style={{
          fontFamily: typo.family, fontSize: 88, fontWeight: typo.titleWeight,
          color: p.paper, textAlign: 'center', lineHeight: 1.2,
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}>
          {scene.title}
        </div>
      </WipeIn>
      <FadeInUp delay={28} motion={style.motion}>
        <div style={{
          marginTop: 36, fontFamily: FONT_BODY, fontSize: 38,
          color: 'rgba(255,255,255,0.72)', textAlign: 'center', lineHeight: 1.5,
        }}>
          {scene.sub}
        </div>
      </FadeInUp>
    </>
  );
};

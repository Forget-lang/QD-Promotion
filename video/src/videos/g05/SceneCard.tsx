// S1 钩子 · 速写纸 + 大字主标（G05 专属结构，pipeline §2.1.0）
// 左：斜贴的速写纸（校门拱 / 两个人 / 挥手弧线 / 红叉，全代码 SVG，不引外部插画——插图库无少儿美术类，B 类按 §4.1 代码替代）
// 右：主标题 + 蜡笔线 + 场景胶囊 + 副标题；焦点在标题
// 展签系统（ExhibitTag）从 S2 起承载内容屏标题，钩子屏不挂展签以免与主标重复
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import { FPS } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp, ScaleIn, SPRING_CONFIG } from '../../components/animations';
import { CharReveal } from '../../components/ui';
import {
  ActDots, CrayonLine, DropIn, PAD_L, PAPER, PAPER_EDGE, PAPER_SHADOW,
  PENCIL, PencilMark, Pin, TAPE,
} from './parts';
import { pick, type SceneCardPayload } from './types';

/** 校门口速写：每条路径按 draw-on 依次画出来，像现场画给孩子看 */
const Sketch: React.FC<{ delay: number }> = ({ delay }) => {
  const f = useCurrentFrame();
  const d = interpolate(f - delay, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const pen = (dash: number) => ({
    strokeDasharray: dash, strokeDashoffset: dash * (1 - d), opacity: d > 0.01 ? 1 : 0,
  });
  return (
    <svg width="420" height="500" viewBox="0 0 420 500" fill="none">
      <path d="M70 320 V170 A140 140 0 01350 170 V320" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" style={pen(700)} />
      <path d="M40 320 H380" stroke={PENCIL} strokeWidth="5" strokeLinecap="round" style={pen(360)} />
      <circle cx="150" cy="360" r="22" stroke="#1565C0" strokeWidth="6" style={pen(150)} />
      <path d="M150 382 V442" stroke="#1565C0" strokeWidth="6" strokeLinecap="round" style={pen(70)} />
      <circle cx="238" cy="384" r="16" stroke="#E4572E" strokeWidth="6" style={pen(120)} />
      <path d="M238 400 V442" stroke="#E4572E" strokeWidth="6" strokeLinecap="round" style={pen(60)} />
      <path d="M182 352 q26 -22 48 -2" stroke={PENCIL} strokeWidth="5" strokeLinecap="round" style={pen(120)} />
      <path d="M196 322 l16 -14 M214 334 l20 -6" stroke={PENCIL} strokeWidth="5" strokeLinecap="round" style={pen(90)} />
      <path d="M300 400 l58 58 M358 400 l-58 58" stroke="#E4572E" strokeWidth="12" strokeLinecap="round" style={pen(190)} />
    </svg>
  );
};

export const SceneCard: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<SceneCardPayload>(scene, 'S1');
  const m = style.motion;
  const f = useCurrentFrame();
  const tapeS = spring({ frame: f - 22, fps: FPS, config: SPRING_CONFIG[m] });
  // 主标按 5 字断行（画面字号大，长行会顶到左右安全区）
  const head = [p.title.slice(0, 5), p.title.slice(5)].filter(Boolean);
  return (
    <AbsoluteFill>
      <div style={{
        position: 'absolute', left: PAD_L, top: 178, fontFamily: FONT_BODY,
        fontSize: 26, letterSpacing: '0.2em', color: PENCIL,
      }}>01 / 09 · 开学季</div>

      {/* 左：速写纸 */}
      <div style={{ position: 'absolute', left: PAD_L, top: 356, width: 470 }}>
        <DropIn motion={m} delay={2} from={-70} rotate={-2.5}>
          <div style={{
            position: 'relative', background: PAPER, border: `2px solid ${PAPER_EDGE}`,
            borderRadius: 10, boxShadow: PAPER_SHADOW, padding: '26px 20px 20px', width: 470,
          }}>
            <div style={{
              position: 'absolute', left: 156, top: -16, opacity: tapeS,
              transform: `scale(${interpolate(tapeS, [0, 1], [0.5, 1])}) rotate(-38deg)`,
            }}>
              <div style={{ width: 140, height: 30, background: TAPE, borderRadius: 2 }} />
            </div>
            <Sketch delay={18} />
            <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 24, color: PENCIL, letterSpacing: '0.06em' }}>
              递出去的体验课单子
            </div>
            <div style={{ position: 'absolute', right: 24, top: 20 }}>{<Pin size={12} color="#1565C0" />}</div>
          </div>
        </DropIn>
      </div>

      {/* 右：主标题 + 蜡笔线 + 场景胶囊 + 副标题 */}
      <div style={{ position: 'absolute', left: 604, top: 512, width: 396 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 74, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.22 }}>
          {head.map((t, i) => <CharReveal key={i} text={t} delay={30 + i * 10} />)}
        </div>
        <div style={{ marginTop: 12 }}>
          <CrayonLine delay={48} width={300} thick={11} />
        </div>
        <FadeInUp delay={58} motion={m} dist={24}>
          <div style={{
            display: 'inline-block', marginTop: 30, padding: '12px 26px', borderRadius: 999,
            border: `2px solid #1E88E5`, background: 'rgba(255,255,255,0.6)',
            fontFamily: FONT_BODY, fontSize: 31, color: '#1a1a1a',
          }}>{p.tag}</div>
        </FadeInUp>
        <FadeInUp delay={68} motion={m} dist={24}>
          <div style={{ marginTop: 24, fontFamily: FONT_BODY, fontSize: 33, lineHeight: 1.52, color: 'rgba(26,26,26,0.8)' }}>
            {p.sub}
          </div>
        </FadeInUp>
      </div>

      <ScaleIn delay={82} motion={m} startScale={0.86}>
        <div style={{ position: 'absolute', left: 96, top: 1150 }}><PencilMark width={170} /></div>
      </ScaleIn>
      <ActDots active={0} />
    </AbsoluteFill>
  );
};

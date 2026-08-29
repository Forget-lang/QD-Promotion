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
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type SceneCardPayload } from './types';

// 节拍：0 = 左速写纸（场景），1 = 大字主标，2 = 胶囊 + 副标（判断句）
const BEAT_MAP = [0, 0, 1, 2, 2, 2];

/** 校门抽象构成：拱门 + 一张被拒的传单 + 大红叉（禁具象火柴人，全部几何形） */
const Sketch: React.FC<{ delay: number }> = ({ delay }) => {
  const f = useCurrentFrame();
  const d = interpolate(f - delay, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const pen = (dash: number) => ({
    strokeDasharray: dash, strokeDashoffset: dash * (1 - d), opacity: d > 0.01 ? 1 : 0,
  });
  return (
    <svg width="440" height="560" viewBox="0 0 440 560" fill="none">
      {/* 校门拱 + 地平线 */}
      <path d="M70 380 V180 A150 150 0 01370 180 V380" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" style={pen(760)} />
      <path d="M30 380 H410" stroke={PENCIL} strokeWidth="5" strokeLinecap="round" style={pen(380)} />
      {/* 立着的传单纸（抽象：色块 + 文字条），轻旋像被塞在校门口 */}
      <g transform="rotate(-6 210 452)" opacity={d}>
        <rect x="150" y="392" width="128" height="168" rx="6" fill="#fff" stroke="rgba(0,0,0,0.14)" strokeWidth="3" />
        <rect x="166" y="410" width="96" height="14" rx="7" fill="#1565C0" opacity="0.85" />
        <rect x="166" y="436" width="96" height="8" rx="4" fill="rgba(20,40,70,0.28)" />
        <rect x="166" y="452" width="76" height="8" rx="4" fill="rgba(20,40,70,0.22)" />
        <rect x="166" y="468" width="88" height="8" rx="4" fill="rgba(20,40,70,0.22)" />
        <rect x="166" y="492" width="60" height="22" rx="4" fill="#F4C430" opacity="0.75" />
      </g>
      {/* 大红叉压住传单 = 被拒 */}
      <path d="M286 402 l86 86 M372 402 l-86 86" stroke="#E4572E" strokeWidth="14" strokeLinecap="round" style={pen(260)} />
    </svg>
  );
};

export const SceneCard: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<SceneCardPayload>(scene, 'S1');
  const m = style.motion;
  const f = useCurrentFrame();
  const tapeS = spring({ frame: f - 22, fps: FPS, config: SPRING_CONFIG[m] });
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(252);
  const sSketch = regionState(BEAT_MAP, beat, 0);
  const sTitle = regionState(BEAT_MAP, beat, 1);
  const sSub = regionState(BEAT_MAP, beat, 2);
  // 主标按 5 字断行（画面字号大，长行会顶到左右安全区）
  const head = [p.title.slice(0, 5), p.title.slice(5)].filter(Boolean);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <div style={{
        position: 'absolute', left: PAD_L, top: 178, fontFamily: FONT_BODY,
        fontSize: 26, letterSpacing: '0.2em', color: PENCIL,
      }}>01 / 09 · 开学季</div>

      {/* 左：速写纸（讲到"校门口/单子"时被指：蓝描边提亮；持续轻摆） */}
      <div style={{
        position: 'absolute', left: PAD_L, top: 330, width: 520,
        transform: `rotate(${mm.sway * 0.35}deg)`,
        opacity: sSketch === 'idle' ? 0.9 : 1,
      }}>
        <DropIn motion={m} delay={2} from={-70} rotate={-2.5}>
          <div style={{
            position: 'relative', background: PAPER,
            border: `2px solid ${sSketch === 'active' ? '#1565C0' : PAPER_EDGE}`,
            boxShadow: sSketch === 'active' ? '0 14px 30px rgba(21,101,192,0.22)' : PAPER_SHADOW,
            borderRadius: 10, padding: '26px 20px 20px', width: 520,
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

      {/* 右：主标题 + 蜡笔线 + 场景胶囊 + 副标题（主标句到点换深蓝重） */}
      <div style={{ position: 'absolute', left: 604, top: 470, width: 400 }}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 76, fontWeight: 800, lineHeight: 1.24,
          color: sTitle === 'idle' ? '#1a1a1a' : '#0D47A1',
        }}>
          {head.map((t, i) => <CharReveal key={i} text={t} delay={30 + i * 10} />)}
        </div>
        <div style={{ marginTop: 12 }}>
          <CrayonLine delay={48} width={300} thick={11} />
        </div>
        <FadeInUp delay={52} motion={m} dist={24}>
          <div style={{
            display: 'inline-block', marginTop: 30, padding: '12px 26px', borderRadius: 999,
            border: `2px solid ${sSub === 'active' ? '#1565C0' : '#1E88E5'}`,
            background: sSub === 'active' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
            fontFamily: FONT_BODY, fontSize: 31, color: '#1a1a1a',
          }}>{p.tag}</div>
        </FadeInUp>
        <FadeInUp delay={58} motion={m} dist={24}>
          <div style={{
            marginTop: 24, fontFamily: FONT_BODY, fontSize: 34, lineHeight: 1.55,
            color: 'rgba(26,26,26,0.8)', opacity: sSub === 'idle' ? 0.85 : 1,
          }}>
            {p.sub}
          </div>
        </FadeInUp>
      </div>

      <ScaleIn delay={60} motion={m} startScale={0.86}>
        <div style={{ position: 'absolute', left: 96, top: 1140 }}><PencilMark width={170} /></div>
      </ScaleIn>

      {/* 底部信息条：钩子屏也摆全——三种常见推法预告（与 S2 三痛点一致），填住下半屏 */}
      <FadeInUp delay={62} motion={m} dist={22}>
        <div style={{ position: 'absolute', left: PAD_L, right: PAD_L, top: 1452 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 25, color: PENCIL, marginBottom: 14 }}>
            开学季美术班最常见的三种推法——
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {['发传单', '约体验课', '推课包'].map((t, i) => (
              <div key={t} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px',
                background: 'rgba(255,255,255,0.72)', border: '2px solid rgba(228,87,46,0.45)',
                borderRadius: 8, transform: `rotate(${i === 1 ? 0.8 : -0.8}deg)`,
                fontFamily: FONT_BODY, fontSize: 30, fontWeight: 700, color: '#1a1a1a',
              }}>
                {t}
                <span style={{ color: '#E4572E', fontSize: 32, fontWeight: 800 }}>✕</span>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>
      <ActDots active={0} />
    </AbsoluteFill>
      </Stage>
  );
};

// S4 具体步骤 · 画架三步（G05 专属结构）
// 三块小画架从左到右阶梯上升，每块面板 = 编号圆片 + 步骤名 + 参数小字；架间虚线箭头串联
// 合规锚点屏：红色贴纸承载「券包不支持公开扫码领取」，必须在画面
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL, Tape } from './parts';
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type EaselStepsPayload } from './types';

// 阶梯：面板底边依次下降（左低右高），架腿向下张开；面板撑大到 y≈1310 填住画面
const PANELS = [
  { x: 84, top: 760 }, { x: 386, top: 620 }, { x: 688, top: 480 },
];
const W = 318;
const H = 420;

// 节拍：0/1/2 = 三个画架（第一步/第二步/第三步），3 = 红色合规贴纸（讲到台卡时点亮）
const BEAT_MAP = [-1, 0, 0, 0, 0, 1, 1, 1, 2, 3, 2, 2];

const Legs: React.FC<{ delay: number }> = ({ delay }) => (
  <svg width={W} height={150} style={{ position: 'absolute', left: 0, top: H - 6 }} opacity={0.9}>
    <path d={`M56 0 L26 144 M${W - 56} 0 L${W - 26} 144 M${W / 2} 0 L${W / 2} 132`}
      stroke={PENCIL} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
    <path d={`M30 96 H${W - 30}`} stroke={PENCIL} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const EaselSteps: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<EaselStepsPayload>(scene, 'S4');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(480);
  const sStick = regionState(BEAT_MAP, beat, 3);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={4} total={9} title="具体三步" motion={m} delay={0} accent="#1565C0" size={54} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{ position: 'absolute', left: 80, top: 316, fontFamily: FONT_BODY, fontSize: 33, color: 'rgba(26,26,26,0.78)' }}>
          选券 → 组包设自选 → 私密发放
        </div>
      </FadeInUp>

      {/* 架间虚线箭头（虚线随呼吸轻漂移 = 持续微动） */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        {[0, 1].map((i) => {
          const a = PANELS[i], b = PANELS[i + 1];
          const d = interpolate(f - (60 + i * 34), [0, 20], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
          });
          const x1 = a.x + W - 6, y1 = a.top + H - 52, x2 = b.x + 10, y2 = b.top + H - 52;
          return (
            <g key={i} opacity={d > 0.01 ? 1 : 0}>
              <path d={`M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 46} ${x2} ${y2}`}
                stroke={PENCIL} strokeWidth="5" fill="none" strokeLinecap="round"
                strokeDasharray="18 14" strokeDashoffset={mm.drift * 3} opacity={d} />
              <path d={`M${x2 - 22} ${y2 - 14} L${x2} ${y2} L${x2 - 24} ${y2 + 10}`}
                stroke={PENCIL} strokeWidth="5" fill="none" strokeLinecap="round" opacity={d} />
            </g>
          );
        })}
      </svg>

      {p.steps.map((s, i) => {
        const g = PANELS[i];
        const last = i === p.steps.length - 1;
        const state = regionState(BEAT_MAP, beat, i);
        return (
          <div key={i} style={{
            position: 'absolute', left: g.x, top: g.top, width: W,
            opacity: state === 'idle' ? 0.9 : 1,
          }}>
            <DropIn motion={m} delay={16 + i * 20} from={-72} rotate={i % 2 ? 2.5 : -2.5}>
              <Legs delay={16 + i * 20} />
              {/* 呼吸：每块面板错相轻摆；被讲到 = 蓝描边提亮 */}
              <div style={{
                position: 'relative', width: W, height: H, background: PAPER,
                border: `2px solid ${state === 'active' || last ? '#1565C0' : PAPER_EDGE}`,
                boxShadow: state === 'active' ? '0 14px 30px rgba(21,101,192,0.24)' : PAPER_SHADOW,
                borderRadius: 10, padding: '34px 30px',
                transform: `rotate(${Math.sin(f / 26 + i * 1.1) * 0.4}deg)`,
              }}>
                <div style={{ position: 'absolute', left: W / 2 - 48, top: -15, opacity: 0.95 }}>
                  <Tape width={96} angle={0} />
                </div>
                <div style={{
                  width: 66, height: 66, borderRadius: '50%', background: last ? '#1565C0' : '#1E88E5',
                  color: '#fff', fontFamily: FONT_BODY, fontSize: 36, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: state === 'active' ? 'scale(1.12)' : 'scale(1)',
                }}>{s.no}</div>
                <div style={{ marginTop: 20, fontFamily: FONT_BODY, fontSize: 41, fontWeight: 800, color: state === 'active' ? '#0D47A1' : '#1a1a1a', lineHeight: 1.3 }}>
                  {s.title}
                </div>
                <div style={{ marginTop: 14, fontFamily: FONT_BODY, fontSize: 26, color: PENCIL, lineHeight: 1.55 }}>
                  {s.detail}
                </div>
              </div>
            </DropIn>
          </div>
        );
      })}

      {/* 合规锚点：红色贴纸（讲到"台卡上写清楚"时抖一下点亮） */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1450, display: 'flex', justifyContent: 'center' }}>
        <DropIn motion={m} delay={118} from={-30} rotate={-1}>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 33, fontWeight: 700, color: '#fff', background: '#E4572E',
            padding: '18px 40px', borderRadius: 8,
            transform: `rotate(${-1.2 + (sStick === 'active' ? Math.sin(f / 6) * 1.2 : 0)}deg)`,
            boxShadow: sStick === 'active' ? '0 10px 24px rgba(228,87,46,0.5)' : '0 6px 16px rgba(228,87,46,0.30)',
          }}>{p.sticker}</div>
        </DropIn>
      </div>
      <ActDots active={3} />
    </AbsoluteFill>
      </Stage>
  );
};

// S4 具体步骤 · 画架三步（G05 专属结构）
// 三块小画架从左到右阶梯上升，每块面板 = 编号圆片 + 步骤名 + 参数小字；架间虚线箭头串联
// 合规锚点屏：红色贴纸承载「券包不支持公开扫码领取」，必须在画面
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL, Tape } from './parts';
import { pick, type EaselStepsPayload } from './types';

// 阶梯：面板底边依次下降（左低右高），架腿向下张开
const PANELS = [
  { x: 88, top: 820 }, { x: 396, top: 700 }, { x: 704, top: 580 },
];
const W = 288;
const H = 348;

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
  return (
    <AbsoluteFill>
      <ExhibitTag no={4} total={9} title="具体三步" motion={m} delay={0} accent="#1565C0" size={54} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{ position: 'absolute', left: 80, top: 320, fontFamily: FONT_BODY, fontSize: 32, color: 'rgba(26,26,26,0.78)' }}>
          选券 → 组包设自选 → 私密发放
        </div>
      </FadeInUp>

      {/* 架间虚线箭头 */}
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
                strokeDasharray="18 14" opacity={d} />
              <path d={`M${x2 - 22} ${y2 - 14} L${x2} ${y2} L${x2 - 24} ${y2 + 10}`}
                stroke={PENCIL} strokeWidth="5" fill="none" strokeLinecap="round" opacity={d} />
            </g>
          );
        })}
      </svg>

      {p.steps.map((s, i) => {
        const g = PANELS[i];
        const last = i === p.steps.length - 1;
        return (
          <div key={i} style={{ position: 'absolute', left: g.x, top: g.top, width: W }}>
            <DropIn motion={m} delay={16 + i * 20} from={-72} rotate={i % 2 ? 2.5 : -2.5}>
              <Legs delay={16 + i * 20} />
              <div style={{
                position: 'relative', width: W, height: H, background: PAPER,
                border: `2px solid ${last ? '#1565C0' : PAPER_EDGE}`, borderRadius: 10,
                boxShadow: PAPER_SHADOW, padding: '30px 26px',
              }}>
                <div style={{ position: 'absolute', left: W / 2 - 48, top: -15, opacity: 0.95 }}>
                  <Tape width={96} angle={0} />
                </div>
                <div style={{
                  width: 62, height: 62, borderRadius: '50%', background: last ? '#1565C0' : '#1E88E5',
                  color: '#fff', fontFamily: FONT_BODY, fontSize: 34, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.no}</div>
                <div style={{ marginTop: 16, fontFamily: FONT_BODY, fontSize: 39, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.28 }}>
                  {s.title}
                </div>
                <div style={{ marginTop: 12, fontFamily: FONT_BODY, fontSize: 25, color: PENCIL, lineHeight: 1.5 }}>
                  {s.detail}
                </div>
              </div>
            </DropIn>
          </div>
        );
      })}

      {/* 合规锚点：红色贴纸 */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1450, display: 'flex', justifyContent: 'center' }}>
        <DropIn motion={m} delay={118} from={-30} rotate={-1}>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 32, fontWeight: 700, color: '#fff', background: '#E4572E',
            padding: '18px 40px', borderRadius: 8, transform: 'rotate(-1.2deg)',
            boxShadow: '0 6px 16px rgba(228,87,46,0.30)',
          }}>{p.sticker}</div>
        </DropIn>
      </div>
      <ActDots active={3} />
    </AbsoluteFill>
  );
};

// S3 核心思路 · 分叉路径（G05 专属结构）
// 一条铅笔主干线分上下两支：上支灰线通向揉皱的纸团（老做法 + 红叉），下支蓝线通向一张小券卡（本方案 + 黄圈）
// 焦点在下支；两支路径逐段 draw-on
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT } from '../../components/animations';
import { FadeInUp } from '../../components/animations';
import { ActDots, CrayonLine, DropIn, ExhibitTag, PAD_L, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL } from './parts';
import { pick, type ForkPathPayload } from './types';

const draw = (f: number, delay: number, len: number, frames = 24) => {
  const p = interpolate(f - delay, [0, frames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return { strokeDasharray: len, strokeDashoffset: len * (1 - p), opacity: p > 0.01 ? 1 : 0 };
};

export const ForkPath: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<ForkPathPayload>(scene, 'S3');
  const m = style.motion;
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ExhibitTag no={3} total={9} title="别塞课，给选择权" motion={m} delay={0} accent="#1565C0" size={52} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{
          position: 'absolute', left: PAD_L, top: 320, fontFamily: FONT_BODY,
          fontSize: 33, color: 'rgba(26,26,26,0.78)',
        }}>三张券装进一个券包，家长自选一种</div>
      </FadeInUp>

      {/* 路径层 */}
      <svg width="1080" height="1000" style={{ position: 'absolute', left: 0, top: 452 }}>
        <path d="M100 580 H440" stroke={PENCIL} strokeWidth="6" strokeLinecap="round" style={draw(f, 18, 340)} />
        <path d="M440 580 C560 580 560 300 700 300" stroke="#BDBDBD" strokeWidth="6"
          strokeLinecap="round" strokeDasharray="620" fill="none"
          style={draw(f, 32, 620)} />
        <path d="M440 580 C560 580 560 830 700 830" stroke="#1565C0" strokeWidth="7"
          strokeLinecap="round" fill="none" style={draw(f, 44, 620)} />
        {/* 焦点圈：下支末端画一个蜡笔黄圈 */}
        <ellipse cx="836" cy="828" rx="118" ry="82" fill="none" stroke="#F4C430" strokeWidth="9"
          opacity={0.85} style={draw(f, 80, 700)} />
        {/* 上支红叉 */}
        <path d="M690 236 l54 54 M744 236 l-54 54" stroke="#E4572E" strokeWidth="11"
          strokeLinecap="round" style={draw(f, 62, 170)} />
      </svg>

      {/* 上支：揉皱的纸团 + 文字 */}
      <div style={{ position: 'absolute', left: 700, top: 706, width: 300 }}>
        <DropIn motion={m} delay={56} from={-40} rotate={4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="86" height="80" viewBox="0 0 86 80" fill="none">
              <path d="M14 34 L30 8 L58 12 L78 34 L64 66 L28 72 Z" fill="#EDEDED" stroke="#BDBDBD" strokeWidth="3" />
              <path d="M30 8 L40 34 L14 34 M58 12 L40 34 L64 66" stroke="#CFCFCF" strokeWidth="2.4" />
            </svg>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 40, fontWeight: 700, color: '#9E9E9E' }}>{p.left.label}</div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 25, color: PENCIL, lineHeight: 1.4 }}>{p.left.note}</div>
            </div>
          </div>
        </DropIn>
      </div>

      {/* 下支：一张小券卡（本片第一次出现"券"的实物感） */}
      <div style={{ position: 'absolute', left: 716, top: 1186, width: 250 }}>
        <DropIn motion={m} delay={68} from={-46} rotate={-3}>
          <div style={{
            position: 'relative', background: PAPER, border: `2px solid ${PAPER_EDGE}`,
            borderRadius: 10, boxShadow: PAPER_SHADOW, padding: '24px 22px',
          }}>
            <div style={{ position: 'absolute', left: -1, top: 22, bottom: 22, width: 0, borderLeft: `3px dashed ${PENCIL}`, opacity: 0.5 }} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 39, fontWeight: 800, color: '#1565C0' }}>{p.right.label}</div>
            <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 25, color: '#1a1a1a', lineHeight: 1.42 }}>{p.right.note}</div>
            <div style={{ marginTop: 12 }}><CrayonLine delay={88} width={150} thick={8} /></div>
          </div>
        </DropIn>
      </div>

      <ActDots active={2} />
    </AbsoluteFill>
  );
};

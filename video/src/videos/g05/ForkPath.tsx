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
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type ForkPathPayload } from './types';

const draw = (f: number, delay: number, len: number, frames = 24) => {
  const p = interpolate(f - delay, [0, frames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return { strokeDasharray: len, strokeDashoffset: len * (1 - p), opacity: p > 0.01 ? 1 : 0 };
};

// 节拍：0=上支（塞课包·老做法），1=下支（自己挑·本方案），2=引句"三张券装进券包"
const BEAT_MAP = [-1, 0, 1, 2, 2, 1, 1];

export const ForkPath: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<ForkPathPayload>(scene, 'S3');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(276);
  const sL = regionState(BEAT_MAP, beat, 0);
  const sR = regionState(BEAT_MAP, beat, 1);
  const sLead = regionState(BEAT_MAP, beat, 2);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={3} total={9} title="别塞课，给选择权" motion={m} delay={0} accent="#1565C0" size={52} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{
          position: 'absolute', left: PAD_L, top: 316, fontFamily: FONT_BODY, fontSize: 34,
          color: sLead === 'active' ? '#0D47A1' : 'rgba(26,26,26,0.78)', fontWeight: sLead === 'active' ? 700 : 400,
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
        {/* 焦点圈：下支末端蜡笔黄圈（持续呼吸缩放，不靠指向也有微动） */}
        <ellipse cx="836" cy="828" rx={118 * (1 + mm.breathe * 0.02)} ry={82 * (1 + mm.breathe * 0.02)} fill="none"
          stroke="#F4C430" strokeWidth="9" opacity={0.85} style={draw(f, 62, 700)} />
        {/* 上支红叉 */}
        <path d="M690 236 l54 54 M744 236 l-54 54" stroke="#E4572E" strokeWidth="11"
          strokeLinecap="round" style={draw(f, 62, 170)} />
      </svg>

      {/* 上支：揉皱的纸团 + 文字（讲到"别把课塞给家长"点亮灰字） */}
      <div style={{ position: 'absolute', left: 700, top: 700, width: 320, opacity: sL === 'idle' ? 0.88 : 1 }}>
        <DropIn motion={m} delay={56} from={-40} rotate={4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="86" height="80" viewBox="0 0 86 80" fill="none">
              <path d="M14 34 L30 8 L58 12 L78 34 L64 66 L28 72 Z" fill="#EDEDED" stroke="#BDBDBD" strokeWidth="3" />
              <path d="M30 8 L40 34 L14 34 M58 12 L40 34 L64 66" stroke="#CFCFCF" strokeWidth="2.4" />
            </svg>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 42, fontWeight: 700, color: sL === 'active' ? '#8D6E63' : '#9E9E9E' }}>{p.left.label}</div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 26, color: PENCIL, lineHeight: 1.4 }}>{p.left.note}</div>
            </div>
          </div>
        </DropIn>
      </div>

      {/* 下支：一张小券卡（讲到"挑自己想要那张"提亮放大） */}
      <div style={{
        position: 'absolute', left: 700, top: 1170, width: 300,
        transform: sR === 'active' ? 'scale(1.04)' : 'scale(1)', opacity: sR === 'idle' ? 0.9 : 1,
      }}>
        <DropIn motion={m} delay={68} from={-46} rotate={-3}>
          <div style={{
            position: 'relative', background: PAPER,
            border: `2px solid ${sR === 'active' ? '#1565C0' : PAPER_EDGE}`,
            borderRadius: 10, boxShadow: sR === 'active' ? '0 14px 30px rgba(21,101,192,0.24)' : PAPER_SHADOW,
            padding: '28px 26px',
          }}>
            <div style={{ position: 'absolute', left: -1, top: 26, bottom: 26, width: 0, borderLeft: `3px dashed ${PENCIL}`, opacity: 0.5 }} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 42, fontWeight: 800, color: '#1565C0' }}>{p.right.label}</div>
            <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 26, color: '#1a1a1a', lineHeight: 1.42 }}>{p.right.note}</div>
            <div style={{ marginTop: 12 }}><CrayonLine delay={68} width={180} thick={8} /></div>
          </div>
        </DropIn>
      </div>

      <ActDots active={2} />
    </AbsoluteFill>
      </Stage>
  );
};

// S2 痛点 · 便签墙（G05 专属结构）
// 三张不同色不同尺寸的便签错落钉在墙上（图钉 ×2 + 回形针 ×1），每张 = 痛点 + 后果小字
// 底部提示条承载结论（红蜡笔线 + 一句），不做大色块
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { BottomNote, Clip, CRAYON_RED, DropIn, ExhibitTag, PAD_L, PAPER, PAPER_EDGE, PAPER_SHADOW,
  PENCIL, Pin, Tape, ActDots } from './parts';
import { pick, type NoteWallPayload } from './types';

type Geo = { x: number; y: number; w: number; h: number; rot: number };
// 错落几何：A 左上小黄纸 / B 右中蓝白纸（面积占优 = 焦点）/ C 左下大米纸
const GEO: Geo[] = [
  { x: PAD_L, y: 372, w: 424, h: 214, rot: -3 },
  { x: 520, y: 548, w: 470, h: 262, rot: 2 },
  { x: 148, y: 906, w: 502, h: 246, rot: -1.5 },
];
const BG: Record<string, string> = {
  yellow: '#FDF0C6', blue: '#EEF5FC', cream: PAPER,
};

export const NoteWall: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<NoteWallPayload>(scene, 'S2');
  const m = style.motion;
  return (
    <AbsoluteFill>
      <ExhibitTag no={2} total={9} title="三种常见推法，都会卡" motion={m} delay={0} accent="#1565C0" size={52} />

      {p.notes.map((n, i) => {
        const g = GEO[i];
        return (
          <div key={i} style={{ position: 'absolute', left: g.x, top: g.y, width: g.w }}>
            <DropIn motion={m} delay={12 + i * 12} from={-72} rotate={g.rot * 2} dist={0}>
              <div style={{ transform: `rotate(${g.rot}deg)` }}>
              <div style={{
                position: 'relative', background: BG[n.paper], border: `2px solid ${PAPER_EDGE}`,
                borderRadius: 10, boxShadow: PAPER_SHADOW, padding: '34px 32px 28px', minHeight: g.h,
              }}>
                {/* 固定件：前两枚图钉、第三枚回形针 */}
                {n.fasten === 'pin'
                  ? <div style={{ position: 'absolute', left: g.w / 2 - 20, top: -16 }}>{<Pin size={14} color={i === 1 ? '#1565C0' : CRAYON_RED} />}</div>
                  : <div style={{ position: 'absolute', right: 22, top: -26 }}><Clip /></div>}
                {/* 左上角一小段胶带 */}
                <div style={{ position: 'absolute', left: -18, top: 18, transform: 'rotate(-32deg)', opacity: 0.9 }}>
                  <Tape width={96} angle={0} />
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 42, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.36 }}>
                  {n.text}
                </div>
                {n.sub && (
                  <div style={{
                    marginTop: 14, fontFamily: FONT_BODY, fontSize: 27, color: PENCIL, lineHeight: 1.4,
                    borderBottom: i === 1 ? `5px solid ${CRAYON_RED}` : 'none', paddingBottom: i === 1 ? 6 : 0,
                  }}>{n.sub}</div>
                )}
              </div>
              </div>
            </DropIn>
          </div>
        );
      })}

      <BottomNote text={p.conclusion} delay={62} motion={m} color={CRAYON_RED} size={46} />
      <ActDots active={1} />
    </AbsoluteFill>
  );
};

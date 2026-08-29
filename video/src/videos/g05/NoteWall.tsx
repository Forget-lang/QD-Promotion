// S2 痛点 · 便签墙（G05 专属结构）
// 三张不同色不同尺寸的便签错落钉在墙上（图钉 ×2 + 回形针 ×1），每张 = 痛点 + 后果小字
// 底部提示条承载结论（红蜡笔线 + 一句），不做大色块
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { BottomNote, Clip, CRAYON_RED, DropIn, ExhibitTag, PAD_L, PAPER, PAPER_EDGE, PAPER_SHADOW,
  PENCIL, Pin, Tape, ActDots } from './parts';
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type NoteWallPayload } from './types';

type Geo = { x: number; y: number; w: number; h: number; rot: number };
// 错落几何：A 左上小黄纸 / B 右中蓝白纸（面积占优 = 焦点）/ C 左下大米纸（撑大到 y≈1420）
const GEO: Geo[] = [
  { x: PAD_L, y: 368, w: 450, h: 236, rot: -3 },
  { x: 524, y: 552, w: 476, h: 282, rot: 2 },
  { x: 148, y: 916, w: 528, h: 262, rot: -1.5 },
];
const BG: Record<string, string> = {
  yellow: '#FDF0C6', blue: '#EEF5FC', cream: PAPER,
};
// 节拍：前两句引子不指向；2-3→便签A，4-5→便签B，6-8→便签C，9→红结论条
const BEAT_MAP = [-1, -1, 0, 0, 1, 1, 2, 2, 2, 3];

export const NoteWall: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<NoteWallPayload>(scene, 'S2');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(345);
  const sEnd = regionState(BEAT_MAP, beat, 3);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={2} total={9} title="三种常见推法，都会卡" motion={m} delay={0} accent="#1565C0" size={52} />

      {p.notes.map((n, i) => {
        const g = GEO[i];
        const s = regionState(BEAT_MAP, beat, i);
        return (
          <div key={i} style={{ position: 'absolute', left: g.x, top: g.y, width: g.w, opacity: s === 'idle' ? 0.9 : 1 }}>
            <DropIn motion={m} delay={12 + i * 12} from={-72} rotate={g.rot * 2} dist={0}>
              {/* 呼吸：错相轻摆（底层持续微动，帧间差不归零） */}
              <div style={{ transform: `rotate(${g.rot + Math.sin(f / 26 + i * 0.9) * 0.4}deg)` }}>
              <div style={{
                position: 'relative', background: BG[n.paper],
                border: `2px solid ${s === 'active' ? '#1565C0' : PAPER_EDGE}`,
                boxShadow: s === 'active' ? '0 14px 30px rgba(21,101,192,0.22)' : PAPER_SHADOW,
                borderRadius: 10, padding: '34px 32px 28px', minHeight: g.h,
              }}>
                {/* 固定件：前两枚图钉、第三枚回形针 */}
                {n.fasten === 'pin'
                  ? <div style={{ position: 'absolute', left: g.w / 2 - 20, top: -16 }}>{<Pin size={14} color={i === 1 ? '#1565C0' : CRAYON_RED} />}</div>
                  : <div style={{ position: 'absolute', right: 22, top: -26 }}><Clip /></div>}
                {/* 左上角一小段胶带 */}
                <div style={{ position: 'absolute', left: -18, top: 18, transform: 'rotate(-32deg)', opacity: 0.9 }}>
                  <Tape width={96} angle={0} />
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 43, fontWeight: 700, color: s === 'active' ? '#0D47A1' : '#1a1a1a', lineHeight: 1.36 }}>
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

      {/* 结论条：第 10 句"续费没了下文"到点提亮放大 */}
      <div style={{ transform: sEnd === 'active' ? 'scale(1.03)' : 'scale(1)', transformOrigin: '50% 100%' }}>
        <BottomNote text={p.conclusion} delay={62} motion={m} color={CRAYON_RED} size={46} />
      </div>
      <ActDots active={1} />
    </AbsoluteFill>
      </Stage>
  );
};

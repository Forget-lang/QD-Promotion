// S8 为什么有用 · 调色盘引线（G05 专属结构，替代 v1 的 panel 白卡列表）
// 左下调色盘（三个色窝）→ 每条铅笔引线接到右侧一行机制说明；右侧无容器，天然杜绝"卡片流"
// 合规：整屏没有任何数字指标、没有百分比、没有上升箭头（机制与层级说服，禁虚构营销数据）
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, PALETTES } from '../../palette';
import { Ico } from '../../components/icons';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, BottomNote, CrayonLine, CRAYON_RED, CRAYON_YELLOW, DropIn, ExhibitTag, PENCIL } from './parts';
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type PalettePayload } from './types';

const WELL = { blue: '#1E88E5', yellow: CRAYON_YELLOW, grey: '#90A4AE' };
// 色窝中心（画面绝对坐标）与右侧三行的起点
const WELLS = [
  { cx: 236, cy: 700 }, { cx: 372, cy: 900 }, { cx: 208, cy: 1080 },
];
const ROWS = [540, 900, 1260];

// 节拍：0~2 = 右侧三行机制，3 = 底部提示；前三句讲"抵触的不是优惠"不指向
const BEAT_MAP = [-1, -1, -1, 1, 1, 2, 2, 2, 2, 3];

export const Palette: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<PalettePayload>(scene, 'S8');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(420);
  const ink = PALETTES[style.palette].ink;
  const sEnd = regionState(BEAT_MAP, beat, 3);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={8} total={9} title="为什么家长更容易答应" motion={m} delay={0} accent="#1565C0" size={50} />

      {/* 调色盘（整体轻摆 + 色窝呼吸 = 持续微动） */}
      <div style={{
        position: 'absolute', left: 64, top: 588, width: 420, height: 620,
        transform: `rotate(${mm.sway * 0.5}deg) scale(1.08)`, transformOrigin: '50% 50%',
      }}>
        <DropIn motion={m} delay={12} from={-66} rotate={-3}>
          <svg width="420" height="620" viewBox="0 0 420 620" fill="none">
            <path d="M210 20 C330 20 400 120 400 250 C400 360 340 420 300 470 C268 510 280 560 236 580 C170 606 60 520 30 380 C0 240 70 20 210 20 Z"
              fill="#FBF7EF" stroke="rgba(0,0,0,0.14)" strokeWidth="4" />
            {/* 拇指孔 */}
            <ellipse cx="150" cy="500" rx="46" ry="34" fill="rgba(20,40,70,0.07)" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
            {p.wells.map((w, i) => {
              const s = regionState(BEAT_MAP, beat, i);
              return (
                <g key={i}>
                  <circle cx={WELLS[i].cx - 64} cy={WELLS[i].cy - 588} r={34 + mm.breathe * (i === 1 ? 1.6 : 0.8)}
                    fill={WELL[w.color]} opacity={s === 'idle' ? 0.78 : 0.95} />
                  {s === 'active' && (
                    <circle cx={WELLS[i].cx - 64} cy={WELLS[i].cy - 588} r="48" fill="none"
                      stroke={WELL[w.color]} strokeWidth="5" opacity="0.5" />
                  )}
                </g>
              );
            })}
          </svg>
        </DropIn>
      </div>

      {/* 引线：色窝 → 右侧行（虚线轻漂移） */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        {p.wells.map((_, i) => {
          const d = interpolate(f - (34 + i * 18), [0, 22], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
          });
          const x1 = WELLS[i].cx, y1 = WELLS[i].cy, x2 = 540, y2 = ROWS[i];
          return (
            <g key={i} opacity={d}>
              <path d={`M${x1} ${y1} C ${x1 + 130} ${y1} ${x2 - 130} ${y2} ${x2} ${y2}`}
                stroke={PENCIL} strokeWidth="3.5" fill="none" strokeDasharray="12 10"
                strokeDashoffset={mm.drift * 4} opacity={0.75} />
              <circle cx={x2} cy={y2} r="9" fill="#1565C0" />
            </g>
          );
        })}
      </svg>

      {/* 右侧三行机制说明（无容器）——讲到哪行，标题换深蓝重并放大 */}
      {p.wells.map((w, i) => {
        const s = regionState(BEAT_MAP, beat, i);
        return (
          <div key={i} style={{
            position: 'absolute', left: 572, top: ROWS[i] - 60, width: 428,
            opacity: s === 'idle' ? 0.88 : 1, transform: s === 'active' ? 'scale(1.03)' : 'scale(1)',
          }}>
            <FadeInUp delay={44 + i * 18} motion={m} dist={26}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 62, height: 62, flexShrink: 0 }}>{Ico[w.icon](WELL[w.color])}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 45, fontWeight: 800, lineHeight: 1.28,
                    color: s === 'active' ? '#0D47A1' : ink,
                  }}>
                    {w.title}
                  </div>
                  <div style={{ marginTop: 10, fontFamily: FONT_BODY, fontSize: 28, color: i === 2 ? ink : PENCIL, lineHeight: 1.46 }}>
                    {w.desc}
                  </div>
                  {i === 0 && <div style={{ marginTop: 10 }}><CrayonLine delay={60} width={250} thick={9} /></div>}
                </div>
              </div>
            </FadeInUp>
          </div>
        );
      })}

      <div style={{ transform: sEnd === 'active' ? 'scale(1.03)' : 'scale(1)', transformOrigin: '50% 100%' }}>
        <BottomNote text={p.footnote} delay={96} motion={m} color={CRAYON_RED} size={36} />
      </div>
      <ActDots active={7} />
    </AbsoluteFill>
      </Stage>
  );
};

/** 第一行焦点下划的蜡笔线由 parts.CrayonLine 承载 */

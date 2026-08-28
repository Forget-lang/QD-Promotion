// S5 干货字段 · 表单纸（样板屏：三层运动 + 画面填满 + 信息全景）
// 底层：整屏缓推 + 纸面轻微呼吸（帧间差不归零，消灭死寂）
// 中层：口播讲到哪一行，那一行提亮放大 + 蜡笔线划出（节拍=字幕句，见 beats.ts）
// 顶层：五行字段一次全摆上（含口播没念的"库存"），观众自己读，不占时长
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT } from '../../components/animations';
import { ActDots, CrayonLine, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL } from './parts';
import { regionState, useBeatIndex } from './beats';
import { pick, type FormSheetPayload } from './types';

/** 每句字幕指向哪一行（-1 = 不指向；行数 = 字幕句数） */
const BEAT_MAP = [-1, 0, 2, 1, 1, 3, 3, 4, -1, -1];

/** 底层持续微动：整屏缓推 + 纸面呼吸 */
const useMicroMotion = () => {
  const f = useCurrentFrame();
  return {
    zoom: 1 + interpolate(f, [0, 440], [0, 0.022], { extrapolateRight: 'clamp' }),
    breathe: Math.sin(f / 26) * 0.28,
    drift: Math.sin(f / 34) * 6,
  };
};

export const FormSheet: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<FormSheetPayload>(scene, 'S5');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion();
  return (
    <AbsoluteFill>
      <ExhibitTag no={5} total={9} title="几个细节别漏" motion={m} delay={0} accent="#1565C0" size={54} />
      <div style={{ position: 'absolute', left: 80, top: 316, fontFamily: FONT_BODY, fontSize: 31, color: 'rgba(26,26,26,0.78)' }}>
        字段就按这样填，家长看完知道怎么用
      </div>

      {/* 表单纸：占满 y:380-1520，宽度到安全区边缘 */}
      <div style={{
        position: 'absolute', left: 80, top: 388, width: 920,
        transform: `scale(${mm.zoom}) rotate(${mm.breathe * 0.18}deg)`, transformOrigin: '50% 40%',
      }}>
        <DropIn motion={m} delay={10} from={-70} rotate={1.2}>
          <div style={{
            position: 'relative', background: PAPER, border: `2px solid ${PAPER_EDGE}`,
            borderRadius: 10, boxShadow: PAPER_SHADOW, padding: '46px 52px 40px 66px', minHeight: 1080,
          }}>
            {/* 装订孔 + 左侧铅笔引线（持续微动：随呼吸轻漂移） */}
            {[190, 540, 890].map((y) => (
              <div key={y} style={{
                position: 'absolute', left: 24, top: y, width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(20,40,70,0.10)', border: '2px solid rgba(0,0,0,0.10)',
              }} />
            ))}
            <div style={{
              position: 'absolute', left: 34, top: 210, width: 2, height: 680,
              background: 'rgba(107,107,107,0.25)', transform: `translateX(${mm.drift * 0.2}px)`,
            }} />

            {p.rows.map((r, i) => {
              const state = regionState(BEAT_MAP, beat, i);
              const reveal = interpolate(f - (26 + i * 10), [0, 14], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
              });
              return (
                <div key={i} style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 20,
                  minHeight: 168, marginBottom: i === p.rows.length - 1 ? 0 : 24,
                  opacity: reveal * (state === 'idle' ? 0.88 : 1),
                  transform: `translateY(${(1 - reveal) * 20}px)`,
                  borderBottom: `2px dashed rgba(107,107,107,0.32)`, paddingBottom: 22,
                }}>
                  {/* 当前指向行：左侧蓝条 + 底色 */}
                  <div style={{
                    position: 'absolute', left: -18, top: 6, bottom: 26, width: 6, borderRadius: 3,
                    background: '#1565C0', opacity: state === 'active' ? 1 : 0,
                  }} />
                  {r.sticker && (
                    <div style={{
                      position: 'absolute', left: -6, top: -22, fontFamily: FONT_BODY, fontSize: 25,
                      fontWeight: 700, color: r.sticker === '字段' ? '#8a6d00' : '#0D47A1',
                      background: r.sticker === '字段' ? 'rgba(244,196,48,0.55)' : 'rgba(30,136,229,0.16)',
                      padding: '5px 18px', borderRadius: 8, transform: 'rotate(-2deg)',
                    }}>{r.sticker}</div>
                  )}
                  <div style={{ width: 216, flexShrink: 0, fontFamily: FONT_BODY, fontSize: 30, color: PENCIL }}>
                    {r.label}
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                      display: 'inline-block', position: 'relative',
                      transform: state === 'active' ? 'scale(1.03)' : 'scale(1)', transformOrigin: 'left center',
                    }}>
                      {state === 'active' && (
                        <div style={{ position: 'absolute', left: -6, right: -6, bottom: -14, zIndex: 0 }}>
                          <CrayonLine delay={Math.max(0, beat)} width={r.value.length * 40 + 14} thick={13} wobble={4} />
                        </div>
                      )}
                      <span style={{
                        position: 'relative', zIndex: 1, fontFamily: FONT_BODY,
                        fontSize: 42, fontWeight: 800,
                        color: state === 'active' ? '#0D47A1' : '#1a1a1a',
                      }}>{r.value}</span>
                    </div>
                  </div>
                  {r.note && (
                    <div style={{ width: 210, textAlign: 'right', fontFamily: FONT_BODY, fontSize: 24, color: PENCIL, lineHeight: 1.35 }}>
                      {r.note}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 纸底：一行提示 + 铅笔角饰，把画面填到 y≈1470 */}
            <div style={{ marginTop: 34, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: PENCIL, maxWidth: 620, lineHeight: 1.45 }}>
                使用须知只是文字说明，家长看完知道怎么用就行
              </div>
              <div style={{
                width: 150, height: 42, borderRadius: 6,
                background: 'linear-gradient(90deg, rgba(30,136,229,0.16), rgba(30,136,229,0.04))',
                border: '2px solid rgba(21,101,192,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_BODY, fontSize: 22, color: '#0D47A1', fontWeight: 700,
              }}>示例值</div>
            </div>
          </div>
        </DropIn>
      </div>
      <ActDots active={4} />
    </AbsoluteFill>
  );
};

// S6 券包 · 三券并排自选（G05 专属结构，替代 v1 的单块磁条卡面）
// 三张竖版票券（顶部色带 + 齿孔虚线 + 券名 + 内容大字 + 有效期）并排；中间那张上浮 + 蓝描边 + 「这张」贴纸
// 产品形态可辨识（V-R09）：一眼看出是"券"，且不画真实产品界面截图（redlines video_visual）
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL } from './parts';
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type BundleFacesPayload } from './types';

const BAND = { red: '#E4572E', yellow: '#F4C430', blue: '#1E88E5' };
const X = [80, 390, 700];
const W = 300;
const H = 660;

// 节拍：0 = 券包名行，1 = 三张票券组（口播不逐张念，整组被指），2 = 底部拆券说明
const BEAT_MAP = [0, 1, 1, 1, 2, 2, 2, 2];

export const BundleFaces: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<BundleFacesPayload>(scene, 'S6');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(285);
  const sHead = regionState(BEAT_MAP, beat, 0);
  const sTickets = regionState(BEAT_MAP, beat, 1);
  const sFoot = regionState(BEAT_MAP, beat, 2);
  // 选中的那张上浮
  const lift = interpolate(f - 62, [0, 22], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={6} total={9} title="家长打开券包" motion={m} delay={0} accent="#1565C0" size={54} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{
          position: 'absolute', left: 80, top: 314, fontFamily: FONT_BODY, fontSize: 31,
          color: sHead === 'active' ? '#0D47A1' : 'rgba(26,26,26,0.78)', fontWeight: sHead === 'active' ? 700 : 400,
        }}>
          {p.bundleName} · {p.claimNote}
        </div>
      </FadeInUp>

      {p.tickets.map((t, i) => {
        const chosen = i === p.chosen;
        return (
          <div key={i} style={{
            position: 'absolute', left: X[i], top: 464 - (chosen ? lift : 0) + Math.sin(f / 26 + i * 1.2) * 3,
            width: W, opacity: sTickets === 'idle' ? 0.92 : 1,
          }}>
            <DropIn motion={m} delay={16 + i * 12} from={-72} rotate={i === 1 ? 0 : (i === 0 ? -2.5 : 2.5)}>
              <div style={{
                position: 'relative', width: W, height: H, background: PAPER,
                border: `2px solid ${chosen || sTickets === 'active' ? '#1565C0' : PAPER_EDGE}`, borderRadius: 10,
                boxShadow: chosen ? `0 14px 30px rgba(21,101,192,0.22)` : PAPER_SHADOW,
                overflow: 'hidden',
              }}>
                <div style={{ height: 30, background: BAND[t.band] }} />
                {/* 齿孔 + 虚线撕口 */}
                {[56, 106, 156, 206, 256, 306, 356, 406, 456, 506, 556, 600].map((y) => (
                  <div key={y} style={{
                    position: 'absolute', left: 58, top: y, width: 10, height: 10, borderRadius: '50%',
                    background: 'rgba(20,40,70,0.10)',
                  }} />
                ))}
                <div style={{ padding: '40px 24px 0 84px' }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 29, color: PENCIL, lineHeight: 1.3 }}>{t.name}</div>
                  <div style={{ marginTop: 24, fontFamily: FONT_BODY, fontSize: 43, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {t.value}
                  </div>
                  <div style={{ marginTop: 26, fontFamily: FONT_BODY, fontSize: 25, color: PENCIL }}>
                    {t.valid}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', left: 58, top: 556, right: 22, borderTop: `2px dashed rgba(107,107,107,0.4)`,
                }} />
                {chosen && (
                  <div style={{
                    position: 'absolute', right: -16, bottom: 52, background: '#1565C0', color: '#fff',
                    fontFamily: FONT_BODY, fontSize: 27, fontWeight: 700, padding: '10px 26px',
                    borderRadius: 8, transform: `rotate(${-6 + Math.sin(f / 14) * 1}deg)`,
                    boxShadow: '0 6px 14px rgba(21,101,192,0.3)',
                  }}>{'这张'}</div>
                )}
              </div>
            </DropIn>
          </div>
        );
      })}

      <FadeInUp delay={58} motion={m} dist={24}>
        <div style={{
          position: 'absolute', left: 80, right: 80, top: 1240, textAlign: 'center',
          fontFamily: FONT_BODY, fontSize: 33, color: sFoot === 'active' ? '#0D47A1' : '#1a1a1a',
          fontWeight: sFoot === 'active' ? 700 : 400, opacity: sFoot === 'idle' ? 0.85 : 1,
        }}>{p.footer}</div>
      </FadeInUp>
      <ActDots active={5} />
    </AbsoluteFill>
      </Stage>
  );
};

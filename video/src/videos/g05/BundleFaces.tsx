// S6 券包 · 三券并排自选（G05 专属结构，替代 v1 的单块磁条卡面）
// 三张竖版票券（顶部色带 + 齿孔虚线 + 券名 + 内容大字 + 有效期）并排；中间那张上浮 + 蓝描边 + 「这张」贴纸
// 产品形态可辨识（V-R09）：一眼看出是"券"，且不画真实产品界面截图（redlines video_visual）
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL } from './parts';
import { pick, type BundleFacesPayload } from './types';

const BAND = { red: '#E4572E', yellow: '#F4C430', blue: '#1E88E5' };
const X = [88, 402, 716];
const W = 276;
const H = 566;

export const BundleFaces: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<BundleFacesPayload>(scene, 'S6');
  const m = style.motion;
  const f = useCurrentFrame();
  // 选中的那张上浮
  const lift = interpolate(f - 62, [0, 22], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <ExhibitTag no={6} total={9} title="家长打开券包" motion={m} delay={0} accent="#1565C0" size={54} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{ position: 'absolute', left: 80, top: 318, fontFamily: FONT_BODY, fontSize: 30, color: 'rgba(26,26,26,0.78)' }}>
          {p.bundleName} · {p.claimNote}
        </div>
      </FadeInUp>

      {p.tickets.map((t, i) => {
        const chosen = i === p.chosen;
        return (
          <div key={i} style={{ position: 'absolute', left: X[i], top: 470 - (chosen ? lift : 0), width: W }}>
            <DropIn motion={m} delay={16 + i * 12} from={-72} rotate={i === 1 ? 0 : (i === 0 ? -2.5 : 2.5)}>
              <div style={{
                position: 'relative', width: W, height: H, background: PAPER,
                border: `2px solid ${chosen ? '#1565C0' : PAPER_EDGE}`, borderRadius: 10,
                boxShadow: chosen ? `0 14px 30px rgba(21,101,192,0.22)` : PAPER_SHADOW,
                overflow: 'hidden',
              }}>
                <div style={{ height: 30, background: BAND[t.band] }} />
                {/* 齿孔 + 虚线撕口 */}
                {[52, 96, 140, 184, 228, 272, 316, 360, 404, 448, 492].map((y) => (
                  <div key={y} style={{
                    position: 'absolute', left: 56, top: y, width: 10, height: 10, borderRadius: '50%',
                    background: 'rgba(20,40,70,0.10)',
                  }} />
                ))}
                <div style={{ padding: '34px 24px 0 78px' }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 27, color: PENCIL, lineHeight: 1.3 }}>{t.name}</div>
                  <div style={{ marginTop: 20, fontFamily: FONT_BODY, fontSize: 38, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {t.value}
                  </div>
                  <div style={{ marginTop: 24, fontFamily: FONT_BODY, fontSize: 24, color: PENCIL }}>
                    {t.valid}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', left: 56, top: 476, right: 20, borderTop: `2px dashed rgba(107,107,107,0.4)`,
                }} />
                {chosen && (
                  <div style={{
                    position: 'absolute', right: -16, bottom: 46, background: '#1565C0', color: '#fff',
                    fontFamily: FONT_BODY, fontSize: 26, fontWeight: 700, padding: '10px 26px',
                    borderRadius: 8, transform: 'rotate(-6deg)', boxShadow: '0 6px 14px rgba(21,101,192,0.3)',
                  }}>{'这张'}</div>
                )}
              </div>
            </DropIn>
          </div>
        );
      })}

      <FadeInUp delay={82} motion={m} dist={24}>
        <div style={{
          position: 'absolute', left: 80, right: 80, top: 1130, textAlign: 'center',
          fontFamily: FONT_BODY, fontSize: 32, color: '#1a1a1a',
        }}>{p.footer}</div>
      </FadeInUp>
      <ActDots active={5} />
    </AbsoluteFill>
  );
};

// S7 进阶唤醒 · 名册漏斗（G05 专属结构，替代 v1 的括号分组）
// 左：名册纸（灰色姓名条，不写具体人名）→ 中：漏斗（条件贴纸「60 天没来」）→ 右：四条动作，④ 高亮
// 数据口径全部来自 facts：领取记录按时间筛 / 15 天 / 一次最多 10 张 / 提前 3 天
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, CrayonLine, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL, Pin } from './parts';
import { pick, type SievePayload } from './types';

export const Sieve: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<SievePayload>(scene, 'S7');
  const m = style.motion;
  const f = useCurrentFrame();
  const funnel = interpolate(f - 34, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <ExhibitTag no={7} total={9} title="老学员怎么喊回来" motion={m} delay={0} accent="#1565C0" size={52} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{ position: 'absolute', left: 80, top: 320, fontFamily: FONT_BODY, fontSize: 30, color: 'rgba(26,26,26,0.78)' }}>
          领取记录导出来，名单不用猜
        </div>
      </FadeInUp>

      {/* 左：名册纸 */}
      <div style={{ position: 'absolute', left: 80, top: 400, width: 300 }}>
        <DropIn motion={m} delay={12} from={-64} rotate={-2}>
          <div style={{
            position: 'relative', background: PAPER, border: `2px solid ${PAPER_EDGE}`,
            borderRadius: 10, boxShadow: PAPER_SHADOW, padding: '30px 24px', height: 720,
          }}>
            <div style={{ position: 'absolute', left: 128, top: -14 }}>{<Pin size={13} color="#E4572E" />}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: PENCIL, letterSpacing: '0.1em' }}>领取记录</div>
            {Array.from({ length: p.roster.rows }).map((_, i) => {
              const d = interpolate(f - (20 + i * 3), [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{
                  marginTop: i === 0 ? 22 : 16, height: 26, borderRadius: 4,
                  background: i % 3 === 1 ? 'rgba(228,87,46,0.22)' : 'rgba(20,40,70,0.10)',
                  width: `${72 + ((i * 13) % 26)}%`, opacity: d,
                }} />
              );
            })}
          </div>
        </DropIn>
      </div>

      {/* 中：漏斗 */}
      <svg width="300" height="820" style={{ position: 'absolute', left: 386, top: 380 }}>
        <path d="M18 60 H282 L176 400 V560 H124 V400 Z" fill="rgba(30,136,229,0.14)"
          stroke="#1565C0" strokeWidth="5" strokeLinejoin="round" opacity={funnel} />
        {[0, 1, 2].map((i) => {
          const d = interpolate(f - (56 + i * 10), [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <path key={i} d={`M150 ${588 + i * 30} v${18 * d}`} stroke="#1565C0" strokeWidth="5" strokeLinecap="round" opacity={d} />;
        })}
      </svg>
      <DropIn motion={m} delay={44} from={-30} rotate={-3}>
        <div style={{
          position: 'absolute', left: 404, top: 356, fontFamily: FONT_BODY, fontSize: 29, fontWeight: 700,
          color: '#8a6d00', background: 'rgba(244,196,48,0.6)', padding: '10px 24px', borderRadius: 8,
          transform: 'rotate(-2deg)', boxShadow: PAPER_SHADOW,
        }}>{p.roster.sticker}</div>
      </DropIn>

      {/* 右：四条动作（引线式，无卡片容器） */}
      {p.actions.map((a, i) => (
        <div key={i} style={{ position: 'absolute', left: 700, top: 424 + i * 250, width: 300 }}>
          <FadeInUp delay={30 + i * 16} motion={m} dist={26}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0, fontFamily: FONT_BODY,
                fontSize: 26, fontWeight: 800, color: '#fff', background: a.highlight ? '#E4572E' : '#1565C0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{a.no}</div>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {a.highlight && (
                    <div style={{ position: 'absolute', left: -6, right: -6, bottom: -16, zIndex: 0 }}>
                      <CrayonLine delay={100} width={a.label.length * 38 + 20} thick={15} wobble={4} />
                    </div>
                  )}
                  <span style={{ position: 'relative', zIndex: 1, fontFamily: FONT_BODY, fontSize: 38, fontWeight: 800, color: '#1a1a1a' }}>
                    {a.label}
                  </span>
                </div>
                <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 26, color: a.highlight ? '#1a1a1a' : PENCIL, lineHeight: 1.42 }}>
                  {a.detail}
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      ))}
      <ActDots active={6} />
    </AbsoluteFill>
  );
};

// S7 进阶唤醒 · 名册漏斗（G05 专属结构，替代 v1 的括号分组）
// 左：名册纸（灰色姓名条，不写具体人名）→ 中：漏斗（条件贴纸「60 天没来」）→ 右：四条动作，④ 高亮
// 数据口径全部来自 facts：领取记录按时间筛 / 15 天 / 一次最多 10 张 / 提前 3 天
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../../palette';
import type { SceneRenderProps } from '../../types';
import { EASE_OUT, FadeInUp } from '../../components/animations';
import { ActDots, CrayonLine, DropIn, ExhibitTag, PAPER, PAPER_EDGE, PAPER_SHADOW, PENCIL, Pin } from './parts';
import { regionState, useBeatIndex, useMicroMotion } from './beats';
import { Stage } from './Stage';
import { pick, type SievePayload } from './types';

// 节拍：0 = 名册纸，1~4 = 四条动作（筛名单/限时券/私发/到期提醒），口播讲到哪条哪条亮
const BEAT_MAP = [-1, 0, 0, 0, 1, 1, 2, 2, 4, 3, 3];

export const Sieve: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = pick<SievePayload>(scene, 'S7');
  const m = style.motion;
  const f = useCurrentFrame();
  const beat = useBeatIndex(scene);
  const mm = useMicroMotion(387);
  const sRoster = regionState(BEAT_MAP, beat, 0);
  return (
    <Stage>
    <AbsoluteFill style={{ transform: `scale(${mm.zoom})`, transformOrigin: '50% 45%' }}>
      <ExhibitTag no={7} total={9} title="老学员怎么喊回来" motion={m} delay={0} accent="#1565C0" size={52} />
      <FadeInUp delay={12} motion={m} dist={22}>
        <div style={{
          position: 'absolute', left: 80, top: 316, fontFamily: FONT_BODY, fontSize: 31,
          color: sRoster === 'active' ? '#0D47A1' : 'rgba(26,26,26,0.78)', fontWeight: sRoster === 'active' ? 700 : 400,
        }}>
          领取记录导出来，名单不用猜
        </div>
      </FadeInUp>

      {/* 左：名册纸（"很久不来/不是退班"讲到即点亮；行条波浪呼吸 = 持续微动） */}
      <div style={{ position: 'absolute', left: 80, top: 396, width: 330, opacity: sRoster === 'idle' ? 0.9 : 1 }}>
        <DropIn motion={m} delay={12} from={-64} rotate={-2}>
          <div style={{
            position: 'relative', background: PAPER,
            border: `2px solid ${sRoster === 'active' ? '#1565C0' : PAPER_EDGE}`,
            boxShadow: sRoster === 'active' ? '0 14px 30px rgba(21,101,192,0.22)' : PAPER_SHADOW,
            borderRadius: 10, padding: '30px 26px', height: 860,
          }}>
            <div style={{ position: 'absolute', left: 140, top: -14 }}>{<Pin size={13} color="#E4572E" />}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: PENCIL, letterSpacing: '0.1em' }}>领取记录</div>
            {Array.from({ length: p.roster.rows }).map((_, i) => {
              const d = interpolate(f - (20 + i * 3), [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{
                  marginTop: i === 0 ? 24 : 19, height: 28, borderRadius: 4,
                  background: i % 3 === 1 ? 'rgba(228,87,46,0.22)' : 'rgba(20,40,70,0.10)',
                  width: `${72 + ((i * 13) % 26)}%`, opacity: d,
                  transform: `translateY(${Math.sin(f / 20 + i * 0.7) * 1.6}px)`,
                }} />
              );
            })}
          </div>
        </DropIn>
      </div>

      {/* 中：漏斗（整体轻摆，滴落线循环下探 = 持续微动） */}
      <svg width="310" height="860" style={{ position: 'absolute', left: 420, top: 376, transform: `rotate(${mm.sway * 0.4}deg)` }}>
        <path d="M18 60 H292 L182 420 V590 H130 V420 Z" fill="rgba(30,136,229,0.14)"
          stroke="#1565C0" strokeWidth="5" strokeLinejoin="round" opacity={funnelP(f)} />
        {[0, 1, 2].map((i) => {
          const cyc = ((f - 56 - i * 10) % 60) / 60;
          const d = interpolate(f - (56 + i * 10), [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <path key={i} d={`M156 ${618 + cyc * 40} v${18}`} stroke="#1565C0" strokeWidth="5" strokeLinecap="round" opacity={d * (1 - cyc * 0.6)} />;
        })}
      </svg>
      <DropIn motion={m} delay={44} from={-30} rotate={-3}>
        <div style={{
          position: 'absolute', left: 436, top: 352, fontFamily: FONT_BODY, fontSize: 30, fontWeight: 700,
          color: '#8a6d00', background: 'rgba(244,196,48,0.6)', padding: '10px 24px', borderRadius: 8,
          transform: `rotate(${-2 + mm.breathe * 0.5}deg)`, boxShadow: PAPER_SHADOW,
        }}>{p.roster.sticker}</div>
      </DropIn>

      {/* 右：四条动作（引线式，无卡片容器）——讲到哪条，序号圆放大 + 标题换深蓝重 */}
      {p.actions.map((a, i) => {
        const s = regionState(BEAT_MAP, beat, i + 1);
        return (
          <div key={i} style={{
            position: 'absolute', left: 740, top: 400 + i * 272, width: 250,
            opacity: s === 'idle' ? 0.88 : 1,
          }}>
            <FadeInUp delay={30 + i * 16} motion={m} dist={26}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 46 + (s === 'active' ? 8 : 0), height: 46 + (s === 'active' ? 8 : 0), borderRadius: '50%',
                  flexShrink: 0, fontFamily: FONT_BODY,
                  fontSize: 26, fontWeight: 800, color: '#fff', background: a.highlight ? '#E4572E' : '#1565C0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `translateY(${s === 'active' ? -2 : 0}px)`,
                }}>{a.no}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {a.highlight && (
                      <div style={{ position: 'absolute', left: -6, right: -6, bottom: -16, zIndex: 0 }}>
                        <CrayonLine delay={100} width={a.label.length * 38 + 20} thick={15} wobble={4} />
                      </div>
                    )}
                    <span style={{
                      position: 'relative', zIndex: 1, fontFamily: FONT_BODY, fontSize: 38, fontWeight: 800,
                      color: s === 'active' ? '#0D47A1' : '#1a1a1a',
                    }}>
                      {a.label}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 26, color: a.highlight || s === 'active' ? '#1a1a1a' : PENCIL, lineHeight: 1.42 }}>
                    {a.detail}
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        );
      })}
      <ActDots active={6} />
    </AbsoluteFill>
      </Stage>
  );
};

/** 漏斗入场进度（纯函数，避免在 svg 内联重复 interpolate 配置） */
const funnelP = (f: number) =>
  interpolate(f - 34, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });

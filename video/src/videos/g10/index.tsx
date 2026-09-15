// g10 美容沙龙 · 老带新裂变 · 专属屏组件（一条视频一套 UI 语言）
// 母题：护理邀请卡（缎带顶 + 撕齿 + 磁条底 + 右侧引线）· berry-purple · 粉晕光弧底（由 VTemplate 垫，屏组件透明叠内容）
// 禁跨行业 import 其它片组件；入场/节拍内联本文件。
// 安全区：内容一律落在 x[120,960]——抖音全屏播放按屏比放大裁边（20:9 实测放大 1.18×、左右各裁约 82px，2026-09-11），口径属主 R3 §7.3。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import type { SceneRenderProps } from '../../types';
import { FONT_BODY, FONT_TITLE, FPS } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import { Ico } from '../../components/icons';
import type { HookPayload, IdeaPayload, MakeBasicPayload, FieldKV, MakeGiftPayload, FlowPayload, CtaPayload } from './types';

const ACCENT = '#AB47BC';
const ACCENT_DK = '#8e24aa';
const INK = '#2a1830';
const MUTED = 'rgba(42,24,48,0.55)';
const CARD = '#ffffff';
const RIBBON = 'rgba(171,71,188,0.12)';
const LINE = 'rgba(171,71,188,0.4)';
const GREY = 'rgba(42,24,48,0.06)';



// ── 擦入包装 ──
const In: React.FC<{ delay: number; from?: number; children: React.ReactNode }> = ({ delay, from = 12, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * from}px)` }}>{children}</div>;
};

// ── 底层光晕漂移（SKILL 第5步「底层持续微动」认可项：光晕漂移只动氛围层，不动主体/文字；帧驱动确定性）──
const AmbientGlow: React.FC = () => {
  const f = useCurrentFrame();
  const x1 = 150 + Math.sin(f / 45) * 150;
  const y1 = 1180 + Math.cos(f / 38) * 95;
  const x2 = 760 + Math.cos(f / 55) * 130;
  const y2 = 1480 + Math.sin(f / 42) * 105;
  const x3 = 430 + Math.sin(f / 58 + 2) * 110;
  const y3 = 880 + Math.cos(f / 50 + 1) * 85;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x1, top: y1, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(142,36,168,0.16), transparent 70%)' }} />
      <div style={{ position: 'absolute', left: x2, top: y2, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)' }} />
      <div style={{ position: 'absolute', left: x3, top: y3, width: 470, height: 470, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,94,158,0.2), transparent 70%)' }} />
    </AbsoluteFill>
  );
};

// ════════════════ S1 · 钩子+痛点（hero-focus）════════════════
const HookScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const f = useCurrentFrame();
  const ph = interpolate(f - 8, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const pulse = 0.5 + 0.5 * Math.sin((f - 40) / 12);
  // 高亮词：按 titleBHi 切成前/后段，中间渲染强调色词
  const cut = p.titleB.split(p.titleBHi);
  const bpre = cut[0] ?? '';
  const bpost = cut[1] ?? '';
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      {/* 左上：钩子大字 */}
      <div style={{ position: 'absolute', left: 120, top: 330, width: 620 }}>
        <In delay={16} from={18}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 88, color: INK, lineHeight: 1.16, letterSpacing: 2 }}>{p.titleA}</div>
        </In>
        <In delay={34} from={18}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 88, color: INK, lineHeight: 1.16, letterSpacing: 2, marginTop: 6 }}>
            {bpre}<span style={{ color: ACCENT }}>{p.titleBHi}</span>{bpost}
          </div>
        </In>
      </div>
      {/* 左中：认知缺口副钩 */}
      <In delay={56}>
        <div style={{ position: 'absolute', left: 120, top: 620, width: 560, fontSize: 37, color: MUTED, lineHeight: 1.55, letterSpacing: 1 }}>{p.sub}</div>
      </In>
      {/* 下：手机卡包（放大居中压满中下带，递卡微倾；券卡磁条与 S3 邀请卡同母题） */}
      <div style={{ position: 'absolute', left: 230, top: 790, opacity: ph, transform: `translateX(${(1 - ph) * 80}px) rotate(-2deg)` }}>
        <div style={{ width: 620, borderRadius: 52, border: '4px solid rgba(42,24,48,0.85)', background: 'rgba(255,255,255,0.94)', padding: '48px 44px 52px', boxShadow: '0 34px 80px rgba(120,60,140,0.32)' }}>
          <div style={{ textAlign: 'center', fontSize: 26, color: MUTED, letterSpacing: 4, marginBottom: 28 }}>卡包</div>
          <div style={{ borderRadius: 26, overflow: 'hidden', border: '1px solid rgba(171,71,188,0.2)' }}>
            <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`, padding: '44px 40px 46px' }}>
              <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', letterSpacing: 4 }}>护理体验 · 邀请卡</div>
              <div style={{ fontSize: 46, color: '#fff', fontFamily: FONT_TITLE, marginTop: 14, letterSpacing: 2 }}>{p.cardName}</div>
            </div>
            <div style={{ padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 25, color: ACCENT_DK, background: RIBBON, borderRadius: 10, padding: '8px 18px', fontWeight: 700 }}>{p.cardTag}</span>
              <span style={{ fontSize: 25, color: MUTED }}>{p.validHint}</span>
            </div>
            <div style={{ height: 60, background: `repeating-linear-gradient(90deg, ${ACCENT_DK} 0 10px, transparent 10px 18px)`, opacity: 0.5 }} />
          </div>
          <div style={{ marginTop: 52 }}>
            <div style={{
              height: 140, borderRadius: 24, background: ACCENT, color: '#fff', fontSize: 44, fontWeight: 700,
              fontFamily: FONT_TITLE, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4,
              boxShadow: `0 0 ${(8 + pulse * 24).toFixed(0)}px rgba(171,71,188,${(0.35 + pulse * 0.4).toFixed(2)})`,
            }}>{p.buttonLabel}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S2 · 讲道理（two-column）════════════════
const IdeaScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as IdeaPayload;
  const Col: React.FC<{ side: 'left' | 'right'; delay: number }> = ({ side, delay }) => {
    const d = side === 'left' ? p.left : p.right;
    const hi = side === 'right';
    return (
      <div style={{
        flex: 1, background: hi ? CARD : GREY, borderRadius: 24, padding: '40px 22px 36px',
        border: hi ? `2px solid ${ACCENT}` : '1px solid rgba(42,24,48,0.08)',
        boxShadow: hi ? '0 18px 44px rgba(120,60,140,0.2)' : 'none',
      }}>
        <div style={{ fontSize: 38, color: hi ? ACCENT_DK : MUTED, fontFamily: FONT_TITLE, letterSpacing: 2 }}>{d.head}</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {d.lines.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, marginTop: 6, display: 'inline-block', flexShrink: 0 }}>{hi ? Ico.check(ACCENT) : Ico.x('rgba(42,24,48,0.4)')}</span>
              <div>
                <div style={{ fontSize: 28, color: hi ? INK : 'rgba(42,24,48,0.72)', lineHeight: 1.32, fontWeight: 700 }}>{r.t}</div>
                <div style={{ marginTop: 6, fontSize: 24, color: MUTED, lineHeight: 1.38 }}>{r.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 34, borderRadius: 14, padding: '18px 20px', fontSize: 28, fontWeight: 800, fontFamily: FONT_TITLE,
          background: hi ? RIBBON : 'rgba(42,24,48,0.05)', color: hi ? ACCENT_DK : MUTED, textAlign: 'center', letterSpacing: 1,
        }}>{hi ? p.rightVerdict : p.leftVerdict}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <In delay={12} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 236, fontFamily: FONT_TITLE, fontSize: 72, color: INK, letterSpacing: 2 }}>{p.title}</div>
      </In>
      <div style={{ position: 'absolute', left: 120, right: 120, top: 400, display: 'flex', gap: 26, alignItems: 'stretch' }}>
        <In delay={26}><Col side="left" delay={26} /></In>
        <In delay={48}><Col side="right" delay={48} /></In>
      </div>
      {/* 底部结论条（本片第 1/2 次，给机制屏，C-09）*/}
      <In delay={84}>
        <div style={{ position: 'absolute', left: 120, right: 120, top: 1160 }}>
          <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 18, padding: '28px 32px', background: 'rgba(171,71,188,0.07)', display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 38, height: 38, flexShrink: 0, display: 'inline-block' }}>{Ico.gift(ACCENT_DK)}</span>
            <div style={{ fontSize: 32, color: INK, lineHeight: 1.4, fontFamily: FONT_TITLE, letterSpacing: 1 }}>{p.bottom}</div>
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S3 · 制券① 体验券券面（hero-object）════════════════
const CardIn: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translate(${(1 - p) * -60}px, ${(1 - p) * -40}px) rotate(${(1 - p) * -5}deg)` }}>{children}</div>;
};
const Field: React.FC<{ fx: FieldKV; delay: number }> = ({ fx, delay }) => (
  <In delay={delay} from={12}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '25px 0', borderTop: '1px solid rgba(171,71,188,0.14)' }}>
      <span style={{ fontSize: 30, color: MUTED, letterSpacing: 1 }}>{fx.k}</span>
      <span style={{
        fontSize: fx.hero ? 33 : 30, fontWeight: 700, color: fx.hero ? '#fff' : INK,
        background: fx.hero ? ACCENT : RIBBON, padding: fx.hero ? '10px 22px' : '8px 18px',
        borderRadius: 12, letterSpacing: 1, fontFamily: FONT_TITLE,
      }}>{fx.v}</span>
    </div>
  </In>
);
const Callout: React.FC<{ delay: number; top: number; t: string; b: string; hi: string }> = ({ delay, top, t, b, hi }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const cut = b.split(hi);
  return (
    <div style={{ position: 'absolute', right: 120, top, width: 300, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <svg width="52" height="2" style={{ position: 'absolute', left: -64, top: 18 }}><line x1="0" y1="1" x2="52" y2="1" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" /></svg>
      <div style={{ fontSize: 25, color: ACCENT_DK, fontWeight: 800, letterSpacing: 0.5, marginBottom: 6, fontFamily: FONT_TITLE }}>{t}</div>
      <div style={{ fontSize: 27, color: INK, lineHeight: 1.44 }}>{cut[0] ?? ''}<span style={{ color: ACCENT_DK, fontWeight: 700 }}>{hi}</span>{cut[1] ?? ''}</div>
    </div>
  );
};

const MakeBasicScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakeBasicPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <In delay={6} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 210, fontFamily: FONT_TITLE, fontSize: 82, color: INK, letterSpacing: 3, lineHeight: 1.08 }}>先做这张体验邀请卡</div>
        <div style={{ position: 'absolute', left: 120, top: 314, width: 520, height: 3, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, borderRadius: 2 }} />
      </In>
      {/* HERO 邀请卡 */}
      <div style={{ position: 'absolute', left: 120, top: 356, width: 520 }}>
        <CardIn delay={18}>
          <div style={{ background: CARD, borderRadius: 26, boxShadow: '0 22px 54px rgba(120,60,140,0.24)', overflow: 'hidden', border: '1px solid rgba(171,71,188,0.18)' }}>
            <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`, padding: '30px 38px 34px', position: 'relative' }}>
              <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', letterSpacing: 3 }}>{p.ribbon}</div>
              <div style={{ marginTop: 8, fontSize: 46, color: '#fff', fontFamily: FONT_TITLE, letterSpacing: 2 }}>{p.cardName}</div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 16, background: 'radial-gradient(circle at 8px 16px, transparent 8px, #fff 8px) repeat-x', backgroundSize: '20px 16px' }} />
            </div>
            <div style={{ padding: '28px 38px 6px' }}>
              <Field fx={p.fields[0]} delay={42} />
              <In delay={60} from={12}>
                <div style={{ padding: '20px 0 6px', borderTop: '1px solid rgba(171,71,188,0.14)' }}>
                  <div style={{ fontSize: 30, color: MUTED, letterSpacing: 1, marginBottom: 10 }}>{p.noticeK}</div>
                  {p.noticeLines.map((t, i) => <div key={i} style={{ fontSize: 27, color: INK, lineHeight: 1.7, letterSpacing: 0.5 }}>{t}</div>)}
                </div>
              </In>
              <Field fx={p.fields[1]} delay={102} />
              <Field fx={p.fields[2]} delay={120} />
              <Field fx={p.fields[3]} delay={136} />
            </div>
            <div style={{ marginTop: 20, height: 58, background: `repeating-linear-gradient(90deg, ${ACCENT_DK} 0 10px, transparent 10px 18px)`, opacity: 0.85 }} />
          </div>
        </CardIn>
      </div>
      {/* 引线标注 */}
      <Callout delay={52} top={560} t={p.notes[0].t} b={p.notes[0].b} hi={p.notes[0].hi} />
      <Callout delay={108} top={920} t={p.notes[1].t} b={p.notes[1].b} hi={p.notes[1].hi} />
      <Callout delay={142} top={1180} t={p.notes[2].t} b={p.notes[2].b} hi={p.notes[2].hi} />
      {/* 注意卡 */}
      <In delay={166} from={14}>
        <div style={{ position: 'absolute', left: 120, right: 120, top: 1400 }}>
          <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 18, padding: '26px 32px', background: 'rgba(171,71,188,0.07)', display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 38, height: 38, flexShrink: 0, display: 'inline-block' }}>{Ico.users(ACCENT_DK)}</span>
            <div style={{ fontSize: 30, color: INK, lineHeight: 1.42 }}>{p.caution}</div>
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S4 · 制券② 转赠+转赠奖励（mechanism-diagram）════════════════
// 开关药丸：knob 随 delay 从左滑到右、轨道由灰转紫（真机 toggle 的运动语言）
const SwitchPill: React.FC<{ on: number }> = ({ on }) => (
  <div style={{
    width: 106, height: 58, borderRadius: 29, flexShrink: 0, position: 'relative',
    background: `rgba(171,71,188,${0.1 + on * 0.9})`, boxShadow: `inset 0 0 0 2px rgba(171,71,188,${0.2 + on * 0.5})`,
  }}>
    <div style={{
      position: 'absolute', left: 5 + on * 44, top: 5, width: 48, height: 48, borderRadius: '50%',
      background: '#fff', boxShadow: '0 4px 10px rgba(42,24,48,0.28)',
    }} />
  </div>
);

const MakeGiftScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakeGiftPayload;
  const f = useCurrentFrame();
  const sw = (delay: number) => interpolate(f - delay, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const rowDelays = [30, 62, 96];
  let rowY = 440;
  const rowTops = p.rows.map((r) => {
    const top = rowY;
    rowY += (r.switchOn ? 176 : 250) + 30;
    return top;
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <In delay={6} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 210, fontFamily: FONT_TITLE, fontSize: 82, color: INK, letterSpacing: 3, lineHeight: 1.08 }}>{p.title}</div>
        <div style={{ position: 'absolute', left: 120, top: 318, width: 520, height: 3, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, borderRadius: 2 }} />
      </In>
      {/* 左列：三行开关药丸（字段名逐字回 create.vue） */}
      {p.rows.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: 120, top: rowTops[i], width: 430 }}>
          <In delay={rowDelays[i]} from={14}>
            <div style={{
              height: r.switchOn ? 176 : 250, background: 'rgba(255,255,255,0.9)', border: `1.5px solid ${LINE}`,
              borderRadius: 22, padding: '36px 34px', boxShadow: '0 14px 34px rgba(120,60,140,0.14)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 34, color: INK, fontFamily: FONT_TITLE, letterSpacing: 1 }}>{r.k}</span>
                {r.switchOn ? <SwitchPill on={sw(rowDelays[i] + 14)} /> : (
                  <span style={{
                    fontSize: 28, color: '#fff', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`,
                    padding: '10px 24px', borderRadius: 12, letterSpacing: 1, fontFamily: FONT_TITLE,
                  }}>{r.v}</span>
                )}
              </div>
              {!r.switchOn && r.note && (
                <div style={{ marginTop: 22, fontSize: 19, color: MUTED, lineHeight: 1.5, letterSpacing: 0.5 }}>{r.note}</div>
              )}
            </div>
          </In>
        </div>
      ))}
      {/* 右列：机制图（体验券 —转赠→ 闺蜜 —核销→ 老客得奖励券） */}
      <In delay={90} from={18}>
        <div style={{
          position: 'absolute', left: 574, top: 440, width: 386, background: 'rgba(255,255,255,0.72)',
          border: `1.5px solid ${LINE}`, borderRadius: 26, padding: '36px 34px', boxShadow: '0 18px 44px rgba(120,60,140,0.16)',
        }}>
          <div style={{ fontSize: 26, color: ACCENT_DK, fontFamily: FONT_TITLE, letterSpacing: 6, textAlign: 'center' }}>{p.mechTitle}</div>
          {[0, 1, 2].map((i) => {
            const n = p.mechNodes[i];
            const nodeDelay = 118 + i * 34;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <In delay={nodeDelay - 17} from={0}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0' }}>
                      <div style={{ width: 3, height: 26, background: LINE, borderRadius: 2 }} />
                      <span style={{
                        fontSize: 22, color: ACCENT_DK, background: CARD, border: `1.5px solid ${LINE}`,
                        borderRadius: 999, padding: '5px 20px', margin: '6px 0', letterSpacing: 2, fontFamily: FONT_TITLE,
                      }}>{p.mechArrows[i - 1]}</span>
                      <div style={{ width: 3, height: 26, background: LINE, borderRadius: 2 }} />
                    </div>
                  </In>
                )}
                <In delay={nodeDelay} from={14}>
                  <div style={{
                    height: 118, background: n.hi ? RIBBON : CARD, borderRadius: 16,
                    border: n.hi ? `2px solid ${ACCENT}` : '1px solid rgba(171,71,188,0.18)',
                    boxShadow: n.hi ? '0 12px 30px rgba(120,60,140,0.3)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px',
                  }}>
                    <span style={{ width: 62, height: 62, borderRadius: '50%', background: n.hi ? ACCENT : RIBBON, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                      <span style={{ width: 34, height: 34, display: 'inline-block' }}>{[Ico.gift, Ico.users, Ico.bolt][i]((n.hi ? '#fff' : ACCENT_DK))}</span>
                    </span>
                    <div>
                      <div style={{ fontSize: 29, color: INK, fontFamily: FONT_TITLE, letterSpacing: 1 }}>{n.t}</div>
                      <div style={{ marginTop: 6, fontSize: 21, color: n.hi ? ACCENT_DK : MUTED, letterSpacing: 0.5 }}>{n.s}</div>
                    </div>
                  </div>
                </In>
              </React.Fragment>
            );
          })}
          <In delay={216} from={12}>
            <div style={{
              marginTop: 20, height: 58, borderRadius: 14, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`,
              color: '#fff', fontSize: 23, fontFamily: FONT_TITLE, letterSpacing: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(120,60,140,0.36)',
            }}>{p.timingNote}</div>
          </In>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S5 · 顾客侧流转（flow · 纵向一条线）════════════════
// 「串起来就一条线」字面化：磁条纹竖轨（母题呼应卡底磁条）自标题下生长，串起五站；
// 文本块左右交错挂站（去阵列感）；末站紫渐变 + 脉冲 +「你不用追客」。
const FlowScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as FlowPayload;
  const f = useCurrentFrame();
  const icons = [Ico.gift, Ico.users, Ico.check, Ico.search, Ico.bolt];
  const RAIL_X = 540;
  const STATION_Y = [480, 706, 932, 1158, 1384];
  const railP = interpolate(f - 6, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const pulse = 0.5 + 0.5 * Math.sin((f - 150) / 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <In delay={6} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 210, fontFamily: FONT_TITLE, fontSize: 82, color: INK, letterSpacing: 3, lineHeight: 1.08 }}>{p.title}</div>
        <div style={{ position: 'absolute', left: 120, top: 318, width: 520, height: 3, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, borderRadius: 2 }} />
      </In>
      {/* 磁条纹竖轨：一条线本体，自上而下生长 */}
      <div style={{
        position: 'absolute', left: RAIL_X - 8, top: 380, width: 16, height: 1066 * railP,
        background: `repeating-linear-gradient(180deg, ${ACCENT_DK} 0 10px, transparent 10px 18px)`, opacity: 0.5, borderRadius: 8,
      }} />
      {p.nodes.map((n, i) => {
        const d = 26 + i * 20;
        const hi = !!n.hi;
        const y = STATION_Y[i];
        const sc = spring({ frame: f - d, fps: FPS, config: { damping: 11, stiffness: 190, mass: 0.8 } });
        const op = interpolate(f - d, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const tx = interpolate(f - (d + 6), [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
        const right = i % 2 === 0;
        return (
          <React.Fragment key={i}>
            {/* 站与站之间的下行箭头 */}
            {i < p.nodes.length - 1 && (
              <div style={{ position: 'absolute', left: RAIL_X, top: (y + STATION_Y[i + 1]) / 2, transform: `translate(-50%, -50%) rotate(90deg) scale(${sc})`, opacity: op }}>
                <span style={{ width: 22, height: 22, display: 'inline-block' }}>{Ico.arrow(ACCENT)}</span>
              </div>
            )}
            {/* 站点圆（末站渐变脉冲） */}
            <div style={{ position: 'absolute', left: RAIL_X, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: op }}>
              <div style={{
                width: hi ? 124 : 108, height: hi ? 124 : 108, borderRadius: '50%',
                background: hi ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})` : CARD,
                border: hi ? 'none' : `2.5px solid ${LINE}`,
                boxShadow: hi
                  ? `0 ${(14 + pulse * 10).toFixed(0)}px ${(34 + pulse * 12).toFixed(0)}px rgba(120,60,140,${(0.3 + pulse * 0.16).toFixed(2)})`
                  : '0 10px 24px rgba(120,60,140,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ width: hi ? 54 : 48, height: hi ? 54 : 48, display: 'inline-block' }}>{icons[i](hi ? '#fff' : ACCENT_DK)}</span>
              </div>
            </div>
            {/* 文本块：左右交错挂站 */}
            <div style={{
              position: 'absolute', ...(right ? { left: 624 } : { right: 624 }), top: y - 36,
              opacity: tx, transform: `translateX(${(right ? -1 : 1) * (1 - tx) * 30}px)`,
              textAlign: right ? 'left' : 'right',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: right ? 'flex-start' : 'flex-end' }}>
                <span style={{ fontSize: 23, color: ACCENT_DK, background: RIBBON, borderRadius: 999, padding: '6px 16px', letterSpacing: 2, fontFamily: FONT_TITLE, fontWeight: 700 }}>{n.t1}</span>
                <span style={{ fontSize: 44, color: hi ? ACCENT_DK : INK, fontFamily: FONT_TITLE, letterSpacing: 2 }}>{n.t2}</span>
              </div>
              {hi ? (
                <div style={{ marginTop: 14, display: 'flex', justifyContent: right ? 'flex-start' : 'flex-end' }}>
                  <span style={{ fontSize: 24, color: '#fff', background: ACCENT, borderRadius: 999, padding: '10px 24px', fontFamily: FONT_TITLE, letterSpacing: 1, boxShadow: `0 6px ${(12 + pulse * 12).toFixed(0)}px rgba(171,71,188,${(0.32 + pulse * 0.18).toFixed(2)})` }}>{n.note}</span>
                </div>
              ) : (
                <div style={{ marginTop: 12, fontSize: 23, color: MUTED, letterSpacing: 0.5 }}>{n.note}</div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ════════════════ S6 · 金句收尾（cta-statement）════════════════
const CtaScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      {/* 大字主张（逐行擦入，末行强调） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {p.lines.map((l, i) => {
          const cut = l.hi ? l.text.split(l.hi) : null;
          return (
            <In key={i} delay={10 + i * 22} from={20}>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 88, color: INK, lineHeight: 1.32, letterSpacing: 3, marginTop: i === 0 ? 0 : 8 }}>
                {cut ? <>{cut[0] ?? ''}<span style={{ color: ACCENT }}>{l.hi}</span>{cut[1] ?? ''}</> : l.text}
              </div>
            </In>
          );
        })}
      </div>
      {/* 邀请卡缩略（呼应 S1/S3 母题：缎带头 + 券名 + 标签行 + 磁条底；零品牌名 C-18） */}
      <div style={{ position: 'absolute', left: 305, top: 1010, width: 470 }}>
        <CardIn delay={104}>
          <div style={{ background: CARD, borderRadius: 26, boxShadow: '0 26px 60px rgba(120,60,140,0.28)', overflow: 'hidden', border: '1px solid rgba(171,71,188,0.18)', transform: 'rotate(-2deg)' }}>
            <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`, padding: '32px 36px 36px', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', letterSpacing: 3 }}>{p.cardRibbon}</div>
              <div style={{ marginTop: 10, fontSize: 46, color: '#fff', fontFamily: FONT_TITLE, letterSpacing: 2 }}>{p.cardName}</div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 16, background: 'radial-gradient(circle at 8px 16px, transparent 8px, #fff 8px) repeat-x', backgroundSize: '20px 16px' }} />
            </div>
            <div style={{ padding: '30px 36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <span style={{ fontSize: 25, color: ACCENT_DK, background: RIBBON, borderRadius: 10, padding: '8px 18px', fontWeight: 700 }}>{p.cardTag}</span>
              <span style={{ fontSize: 25, color: MUTED }}>{p.validHint}</span>
            </div>
            <div style={{ height: 46, background: `repeating-linear-gradient(90deg, ${ACCENT_DK} 0 10px, transparent 10px 18px)`, opacity: 0.85 }} />
          </div>
        </CardIn>
      </div>
    </AbsoluteFill>
  );
};

export const G10_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g10-hook': HookScreen,
  'g10-idea': IdeaScreen,
  'g10-make-basic': MakeBasicScreen,
  'g10-make-gift': MakeGiftScreen,
  'g10-flow': FlowScreen,
  'g10-cta': CtaScreen,
};

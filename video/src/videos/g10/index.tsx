// g10 美容沙龙 · 老带新裂变 · 专属屏组件（一条视频一套 UI 语言）
// 母题：护理邀请卡（缎带顶 + 撕齿 + 磁条底 + 右侧引线）· berry-purple · 粉晕光弧底（由 VTemplate 垫，屏组件透明叠内容）
// 禁跨行业 import 其它片组件；入场/节拍内联本文件。
import React from 'react';
import {
  AbsoluteFill, interpolate, useCurrentFrame,
} from 'remotion';
import type { SceneRenderProps } from '../../types';
import { FONT_BODY, FONT_TITLE } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import { Ico } from '../../components/icons';
import type { HookPayload, IdeaPayload, MakeBasicPayload, FieldKV } from './types';

const ACCENT = '#AB47BC';
const ACCENT_DK = '#8e24aa';
const INK = '#2a1830';
const MUTED = 'rgba(42,24,48,0.55)';
const CARD = '#ffffff';
const RIBBON = 'rgba(171,71,188,0.12)';
const LINE = 'rgba(171,71,188,0.4)';
const GREY = 'rgba(42,24,48,0.06)';

// ── 通用：顶部面包屑 + 合规标注（C-11 挂顶部，屏底无页脚）──
const Eyebrow: React.FC<{ eyebrow: string; sampleTag: string; delay?: number }> = ({ eyebrow, sampleTag, delay = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 64, right: 64, top: 128, opacity: p, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 32, height: 32, display: 'inline-block' }}>{Ico.gift(ACCENT)}</span>
        <span style={{ fontSize: 25, color: ACCENT_DK, letterSpacing: 4, fontWeight: 700 }}>{eyebrow}</span>
      </div>
      <span style={{ fontSize: 21, color: MUTED, border: `1.5px solid ${LINE}`, borderRadius: 999, padding: '6px 18px' }}>{sampleTag}</span>
    </div>
  );
};

// ── 擦入包装 ──
const In: React.FC<{ delay: number; from?: number; children: React.ReactNode }> = ({ delay, from = 12, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * from}px)` }}>{children}</div>;
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
      <Eyebrow eyebrow={p.eyebrow} sampleTag={p.sampleTag} />
      {/* 左：钩子大字 + 认知缺口副钩 + 三条为什么不开口 */}
      <div style={{ position: 'absolute', left: 64, top: 330, width: 580 }}>
        <In delay={14} from={18}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 86, color: INK, lineHeight: 1.16, letterSpacing: 2 }}>{p.titleA}</div>
        </In>
        <In delay={30} from={18}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 86, color: INK, lineHeight: 1.16, letterSpacing: 2, marginTop: 4 }}>
            {bpre}<span style={{ color: ACCENT }}>{p.titleBHi}</span>{bpost}
          </div>
        </In>
        <In delay={52}>
          <div style={{ marginTop: 36, fontSize: 35, color: MUTED, lineHeight: 1.5, letterSpacing: 1 }}>{p.sub}</div>
        </In>
      </div>
      {/* 右：手机卡包里的券 + 转赠按钮 */}
      <div style={{ position: 'absolute', right: 64, top: 330, opacity: ph, transform: `translateX(${(1 - ph) * 80}px)` }}>
        <div style={{ width: 348, borderRadius: 44, border: '3px solid rgba(42,24,48,0.85)', background: 'rgba(255,255,255,0.92)', padding: '26px 24px 30px', boxShadow: '0 24px 60px rgba(120,60,140,0.28)' }}>
          <div style={{ textAlign: 'center', fontSize: 22, color: MUTED, letterSpacing: 2, marginBottom: 18 }}>卡包</div>
          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(171,71,188,0.2)' }}>
            <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`, padding: '20px 22px' }}>
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', letterSpacing: 2 }}>护理体验 · 邀请卡</div>
              <div style={{ fontSize: 27, color: '#fff', fontFamily: FONT_TITLE, marginTop: 6, letterSpacing: 1 }}>{p.cardName}</div>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 19, color: ACCENT_DK, background: RIBBON, borderRadius: 8, padding: '4px 12px', fontWeight: 700 }}>{p.cardTag}</span>
              <span style={{ fontSize: 19, color: MUTED }}>15 天内有效</span>
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{
              height: 76, borderRadius: 16, background: ACCENT, color: '#fff', fontSize: 30, fontWeight: 700,
              fontFamily: FONT_TITLE, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 2,
              boxShadow: `0 0 ${(6 + pulse * 16).toFixed(0)}px rgba(171,71,188,${(0.35 + pulse * 0.4).toFixed(2)})`,
            }}>{p.buttonLabel}</div>
          </div>
        </div>
      </div>
      {/* 通栏：为什么她不开口（三行痛点卡，填右下洞）*/}
      <div style={{ position: 'absolute', left: 64, right: 64, top: 810, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {p.pains.map((pain, i) => (
          <In key={i} delay={64 + i * 14} from={16}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(171,71,188,0.18)', borderRadius: 20, padding: '30px 32px', boxShadow: '0 10px 26px rgba(120,60,140,0.08)' }}>
              <span style={{ width: 38, height: 38, display: 'inline-block', flexShrink: 0, marginTop: 4 }}>{i === 0 ? Ico.users(ACCENT_DK) : i === 1 ? Ico.cash(ACCENT_DK) : Ico.bolt(ACCENT_DK)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: INK, fontFamily: FONT_TITLE, letterSpacing: 1 }}>{pain.t}</div>
                <div style={{ marginTop: 10, fontSize: 26, color: MUTED, lineHeight: 1.45 }}>{pain.s}</div>
              </div>
            </div>
          </In>
        ))}
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
        flex: 1, background: hi ? CARD : GREY, borderRadius: 24, padding: '40px 34px 36px',
        border: hi ? `2px solid ${ACCENT}` : '1px solid rgba(42,24,48,0.08)',
        boxShadow: hi ? '0 18px 44px rgba(120,60,140,0.2)' : 'none',
      }}>
        <div style={{ fontSize: 38, color: hi ? ACCENT_DK : MUTED, fontFamily: FONT_TITLE, letterSpacing: 2 }}>{d.head}</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {d.lines.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ width: 28, height: 28, marginTop: 6, display: 'inline-block', flexShrink: 0 }}>{hi ? Ico.check(ACCENT) : Ico.x('rgba(42,24,48,0.4)')}</span>
              <div>
                <div style={{ fontSize: 32, color: hi ? INK : 'rgba(42,24,48,0.72)', lineHeight: 1.32, fontWeight: 700 }}>{r.t}</div>
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
      <Eyebrow eyebrow={p.eyebrow} sampleTag={p.sampleTag} />
      <In delay={12} from={16}>
        <div style={{ position: 'absolute', left: 64, top: 236, fontFamily: FONT_TITLE, fontSize: 72, color: INK, letterSpacing: 2 }}>{p.title}</div>
      </In>
      <div style={{ position: 'absolute', left: 64, right: 64, top: 400, display: 'flex', gap: 26, alignItems: 'stretch' }}>
        <In delay={26}><Col side="left" delay={26} /></In>
        <In delay={48}><Col side="right" delay={48} /></In>
      </div>
      {/* 底部结论条（本片第 1/2 次，给机制屏，C-09）*/}
      <In delay={84}>
        <div style={{ position: 'absolute', left: 64, right: 64, top: 1160 }}>
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
    <div style={{ position: 'absolute', right: 56, top, width: 372, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <svg width="76" height="2" style={{ position: 'absolute', left: -80, top: 18 }}><line x1="0" y1="1" x2="76" y2="1" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" /></svg>
      <div style={{ fontSize: 25, color: ACCENT_DK, fontWeight: 800, letterSpacing: 0.5, marginBottom: 6, fontFamily: FONT_TITLE }}>{t}</div>
      <div style={{ fontSize: 27, color: INK, lineHeight: 1.44 }}>{cut[0] ?? ''}<span style={{ color: ACCENT_DK, fontWeight: 700 }}>{hi}</span>{cut[1] ?? ''}</div>
    </div>
  );
};

const MakeBasicScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakeBasicPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Eyebrow eyebrow={p.eyebrow} sampleTag={p.sampleTag} />
      <In delay={6} from={16}>
        <div style={{ position: 'absolute', left: 64, top: 210, fontFamily: FONT_TITLE, fontSize: 82, color: INK, letterSpacing: 3, lineHeight: 1.08 }}>先做这张体验邀请卡</div>
        <div style={{ position: 'absolute', left: 64, top: 314, width: 520, height: 3, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, borderRadius: 2 }} />
      </In>
      {/* HERO 邀请卡 */}
      <div style={{ position: 'absolute', left: 64, top: 356, width: 548 }}>
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
        <div style={{ position: 'absolute', left: 64, right: 64, top: 1400 }}>
          <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 18, padding: '26px 32px', background: 'rgba(171,71,188,0.07)', display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 38, height: 38, flexShrink: 0, display: 'inline-block' }}>{Ico.users(ACCENT_DK)}</span>
            <div style={{ fontSize: 30, color: INK, lineHeight: 1.42 }}>{p.caution}</div>
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

export const G10_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g10-hook': HookScreen,
  'g10-idea': IdeaScreen,
  'g10-make-basic': MakeBasicScreen,
};

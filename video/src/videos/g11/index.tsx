// g11 烧烤夜宵 · 锁客裂变 · 专属屏组件（一条视频一套 UI 语言）
// 母题：炭火虚焦底 + 深色毛玻璃块 + 粗黑大标题 + 手气券卡（炭火暖橙系）· snappy 入场 · dissolve 转场
// 禁跨行业 import 其它片组件；入场/节拍内联本文件。
// 安全区：内容一律落在 x[120,960]——抖音全屏播放按屏比放大裁边（20:9 实测放大 1.18×、左右各裁约 82px，2026-09-11），口径属主 R3 §7.3。
// ════════════════ S1 · 钩子（hero-focus · 信息密度+流式排版 v9 2026-09-14）════════════════
// 布局规范（R3 §7.3）：核心内容集中带 y:200-1100；标题距顶 ≥200px；活动区硬底线 y:120-1760。
// 排版原则：单列左对齐流式栅格（left:120 内容宽800），间距走统一刻度本（GUT），
// 层级靠字号+色阶区分不靠空洞间距；分区用卡面/分隔线界定，绝不用超大留白冒充分区。
// 色彩规范（R3 §7.4）：语义色从 PALETTES['warm-orange'] 取，禁硬编码 hex。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SceneRenderProps } from '../../types';
import { FONT_BODY, FONT_TITLE, FPS, PALETTES } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import type { HookPayload, IdeaPayload, ProofPayload, FieldsPayload, MechanismPayload, CtaPayload, FieldPair, MechanismStep } from './types';

const PA = PALETTES['warm-orange'];
const ACCENT = PA.accent;
const ACCENT_DARK = PA.accentDark;
const ACCENT_GOLD = '#FFB347';
const INK = PA.paper;
const MUTED = 'rgba(255,255,255,0.62)';
const GLASS_BG = 'rgba(26, 17, 10, 0.74)';
const GLASS_BORDER = 'rgba(255, 112, 67, 0.28)';
const CARD_BG = 'rgba(32, 20, 12, 0.86)';
const CARD_ACCENT = ACCENT;
const LINE = 'rgba(255, 179, 71, 0.18)';
const GUT = { xs: 16, s: 24, m: 44, l: 60 };

const In: React.FC<{ delay: number; from?: number; children: React.ReactNode }> = ({ delay, from = 16, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * from}px)` }}>{children}</div>;
};

const LandIn: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const t = f - delay;
  const p = interpolate(t, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const y = interpolate(t, [0, 8, 16], [34, -3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: p, transform: `translateY(${y}px)` }}>{children}</div>;
};

// 装饰粒子必须服从与内容一致的像素安全边界：不能因为氛围元素让 probe-safe-area 失败。
const EmberParticles: React.FC = () => {
  const f = useCurrentFrame();
  const particles = Array.from({ length: 26 }, (_, i) => {
    const seed = i * 37 + 11;
    const xBase = 140 + ((seed * 53) % 760);
    const baseY = 1600 - (seed % 420);
    const speed = 0.5 + (seed % 12) * 0.09;
    const sway = 12 + (seed % 14);
    const size = 2 + (seed % 5);
    const delay = (seed * 13) % 90;
    const actualF = f + delay;
    const up = (actualF * speed) % 900;
    const y = Math.max(180, baseY - up);
    const x = Math.min(900 - size, Math.max(140, xBase + Math.sin(actualF * 0.02 + seed) * sway));
    const twinkle = 0.35 + 0.3 * Math.abs(Math.sin((actualF + seed) * 0.06));
    return { x, y, size, opacity: twinkle, i };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT_GOLD}, transparent 70%)`,
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 3}px ${ACCENT}`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const FlameIcon: React.FC<{ size?: number; color?: string }> = ({ size = 36, color = ACCENT_GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 7 8 7 13C7 16 9 19 12 21C15 19 17 16 17 13C17 8 12 2 12 2Z" fill={color} opacity="0.9" />
    <path d="M12 7C12 7 9 11 9 14C9 16 10 18 12 19.5" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5" />
  </svg>
);

const TicketLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', background: 'rgba(255,255,255,0.05)', borderLeft: `3px solid ${ACCENT}`, borderRadius: 4 }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT_GOLD, flexShrink: 0 }} />
    <span style={{ fontSize: 28, color: INK, lineHeight: 1.4 }}>{children}</span>
  </div>
);

export const HookScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const cut = p.titleMain.split(p.titleHi);
  const pre = cut[0] ?? '';
  const post = cut[1] ?? '';
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />
      <LandIn delay={6}>
        <div style={{ position: 'absolute', left: 160, top: 200, width: 760, background: 'linear-gradient(115deg, #3d2818 0%, #54331d 45%, #452b19 100%)', borderRadius: '18px 18px 8px 8px', padding: '46px 52px 40px 52px', boxShadow: '0 18px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.08)', borderBottom: '14px solid #2b1a0e' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 'inherit', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 9px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 22, top: 18, transform: 'rotate(8deg)' }}><FlameIcon size={34} /></div>
          <div style={{ position: 'absolute', left: 22, top: 20, width: 12, height: 12, borderRadius: 6, background: '#1c1007', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25)' }} />
          <div style={{ position: 'absolute', left: 54, top: 20, width: 12, height: 12, borderRadius: 6, background: '#1c1007', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25)' }} />
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(0,0,0,0.28)', borderLeft: `4px solid ${ACCENT_GOLD}`, fontSize: 26, color: ACCENT_GOLD, fontWeight: 700, letterSpacing: 1, borderRadius: 4 }}>{p.painLead}</div>
          <div style={{ marginTop: GUT.m - 8, fontFamily: FONT_TITLE, fontSize: 80, color: '#fff7e6', lineHeight: 1.12, letterSpacing: 1, textShadow: '0 3px 18px rgba(0,0,0,0.5)' }}>{pre}<span style={{ color: ACCENT_GOLD, textDecoration: 'underline rgba(255,179,71,0.4) 6px' }}>{p.titleHi}</span>{post}</div>
          <div style={{ marginTop: GUT.s, fontSize: 30, color: 'rgba(255,247,230,0.72)', lineHeight: 1.5, fontFamily: 'Kaiti SC, STKaiti, KaiTi, serif' }}>{p.subTitle}</div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: -14, height: 14, background: '#2b1a0e', borderRadius: '0 0 8px 8px' }} />
        </div>
      </LandIn>
      <div style={{ position: 'absolute', left: 150, top: 620, width: 320, display: 'flex', flexDirection: 'column', gap: GUT.s }}>
        {p.miniPoints?.slice(0, 1).map((pt, i) => <In key={i} delay={26 + i * 10} from={14}><div style={{ background: 'rgba(250, 242, 230, 0.96)', borderRadius: 3, padding: '14px 20px', boxShadow: '0 6px 22px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ width: 4, height: 26, background: 'repeating-linear-gradient(180deg, transparent 0 4px, #b54a1f 4px 8px)', marginLeft: -20, marginRight: 2 }} /><div style={{ width: 8, height: 8, borderRadius: 4, background: '#b54a1f', flexShrink: 0 }} /><span style={{ fontSize: 27, color: '#3a2a18', fontWeight: 600 }}>{pt}</span></div></In>)}
      </div>
      <LandIn delay={42}><div style={{ position: 'absolute', right: 145, top: 600, width: 440, background: 'linear-gradient(160deg, rgba(48,28,16,0.96), rgba(34,20,12,0.96))', border: `3px solid ${ACCENT_GOLD}`, borderRadius: 14, padding: '30px 34px 26px 34px', boxShadow: '0 16px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,179,71,0.2)', transform: 'rotate(1.5deg)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: GUT.s - 6 }}><div style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(255,179,71,0.16)', border: `1px solid rgba(255,179,71,0.5)`, borderRadius: 4, fontSize: 23, color: ACCENT_GOLD, fontWeight: 700, letterSpacing: 1 }}>{p.cardTag}</div><span style={{ fontSize: 24, color: 'rgba(255,255,255,0.66)', fontFamily: 'Kaiti SC, KaiTi, serif' }}>{p.cardSlogan}</span></div><div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: FONT_TITLE }}><span style={{ fontSize: 40, color: ACCENT_GOLD, opacity: 0.9 }}>¥</span><span style={{ fontSize: 64, color: ACCENT_GOLD, lineHeight: 1 }}>{p.cardMin}</span><span style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)' }}>~</span><span style={{ fontSize: 64, color: ACCENT_GOLD, lineHeight: 1 }}>¥{p.cardMax}</span><span style={{ fontSize: 29, color: '#fff7e6', marginLeft: 8, fontWeight: 700 }}>{p.cardName}</span></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: GUT.s - 2, paddingTop: GUT.s - 8, borderTop: `1px dashed rgba(255,179,71,0.45)`, fontSize: 24, color: 'rgba(255,255,255,0.7)' }}><span>{p.cardThreshold}</span><span>{p.cardValid}</span><span style={{ color: ACCENT_GOLD, fontWeight: 700 }}>{p.cardTime}</span></div></div></LandIn>
      <In delay={50} from={10}><div style={{ position: 'absolute', left: 120, top: 1024, display: 'flex', alignItems: 'center', gap: 10, fontSize: 25, color: 'rgba(255,255,255,0.72)' }}><div style={{ width: 26, height: 26, borderRadius: 4, border: `2px solid ${ACCENT_GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: ACCENT_GOLD }}>扫</div><span>桌上扫码即领 · {p.actionHint}</span></div></In>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, rgba(255,112,67,0.16), transparent)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export const IdeaScreen: React.FC<SceneRenderProps> = ({ scene }) => { const p = scene.payload as unknown as IdeaPayload; return <AbsoluteFill style={{ fontFamily: FONT_BODY }}><EmberParticles /><In delay={8} from={16}><div style={{ position: 'absolute', left: 120, top: 100, right: 120 }}><div style={{ fontSize: 32, color: ACCENT_GOLD, marginBottom: 12, fontWeight: 600, letterSpacing: 2 }}>反常识</div><div style={{ fontFamily: FONT_TITLE, fontSize: 60, color: INK, lineHeight: 1.2 }}>{p.title}</div></div></In><div style={{ position: 'absolute', left: 120, right: 120, top: 320, display: 'flex', gap: 24 }}><In delay={20} from={20}><div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${GLASS_BORDER}`, borderRadius: 14, padding: '32px 28px' }}><div style={{ fontSize: 28, color: MUTED, marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>✕ 老办法 · 没用</div>{p.wrongItems.map((item, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < p.wrongItems.length - 1 ? 22 : 0, fontSize: 30, color: MUTED }}><div style={{ width: 24, height: 24, border: `2px solid ${MUTED}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: MUTED, opacity: 0.6 }}>✕</div><span>{item}</span></div>)}</div></In><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48 }}><div style={{ width: 48, height: 48, borderRadius: '50%', background: `rgba(255, 107, 53, 0.15)`, border: `1.5px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: ACCENT, fontWeight: 700 }}>VS</div></div><In delay={36} from={20}><div style={{ flex: 1, background: CARD_BG, border: `2px solid ${CARD_ACCENT}`, borderRadius: 14, padding: '32px 28px', boxShadow: `0 4px 40px rgba(255, 107, 53, 0.2)` }}><div style={{ fontSize: 28, color: ACCENT_GOLD, marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>✓ 真锁客 · 有效</div>{p.rightItems.map((item, i) => <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: i < p.rightItems.length - 1 ? 22 : 0, fontSize: 30, color: INK, lineHeight: 1.4 }}><div style={{ width: 24, height: 24, marginTop: 6, background: ACCENT_GOLD, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#1a0f0a', fontWeight: 700, flexShrink: 0 }}>✓</div><span>{item}</span></div>)}</div></In></div><In delay={56}><div style={{ position: 'absolute', left: 120, right: 120, bottom: 120, padding: '24px 32px', background: `linear-gradient(90deg, rgba(255, 107, 53, 0.1), rgba(255, 179, 71, 0.1))`, borderLeft: `4px solid ${ACCENT_GOLD}`, borderRadius: 8, fontSize: 32, color: INK, fontWeight: 500, lineHeight: 1.5 }}>{p.conclusion}</div></In></AbsoluteFill>;
};

export const ProofScreen: React.FC<SceneRenderProps> = ({ scene }) => { const p = scene.payload as unknown as ProofPayload; return <AbsoluteFill style={{ fontFamily: FONT_BODY }}><EmberParticles /><In delay={8} from={16}><div style={{ position: 'absolute', left: 120, top: 80, right: 120 }}><div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: FONT_TITLE }}><span style={{ fontSize: 96, color: ACCENT_GOLD, lineHeight: 1 }}>{p.bigNumber}</span><span style={{ fontSize: 36, color: MUTED }}>{p.bigUnit}</span></div><div style={{ fontSize: 30, color: INK, marginTop: 8 }}>{p.subTitle}</div></div></In><In delay={28} from={24}><div style={{ position: 'absolute', left: '50%', top: 300, transform: 'translateX(-50%)', width: 520 }}><div style={{ background: 'rgba(20, 15, 12, 0.95)', borderRadius: 32, padding: '24px 20px', border: `2px solid rgba(255,255,255,0.08)`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255, 107, 53, 0.15)` }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: MUTED, marginBottom: 30 }}><span>21:30</span><span>●●●●</span></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, color: ACCENT_GOLD, fontWeight: 600, letterSpacing: 4, marginBottom: 12 }}>✓ 核销成功</div><div style={{ fontSize: 48, color: INK, fontFamily: FONT_TITLE, marginBottom: 8 }}>夜宵手气券</div><div style={{ fontSize: 24, color: MUTED, marginBottom: 24 }}>已核销 · 满 100 减 18 元</div></div><div style={{ height: 1, background: LINE, margin: '20px 0' }} /><div style={{ background: `rgba(255, 107, 53, 0.12)`, border: `1px solid ${CARD_ACCENT}`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ width: 48, height: 48, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎁</div><div style={{ flex: 1 }}><div style={{ fontSize: 24, color: INK, fontWeight: 500 }}>奖励券已到账</div><div style={{ fontSize: 20, color: MUTED, marginTop: 2 }}>核销后赠券 · 夜宵手气券 × 1</div></div><div style={{ fontSize: 22, color: ACCENT_GOLD }}>→</div></div></div></div></In><In delay={56}><div style={{ position: 'absolute', left: 120, right: 120, bottom: 100, textAlign: 'center', fontSize: 26, color: MUTED }}>{p.caseSource}</div></In></AbsoluteFill>;
};

export const BasicScreen: React.FC<SceneRenderProps> = ({ scene }) => { const p = scene.payload as unknown as FieldsPayload; return <AbsoluteFill style={{ fontFamily: FONT_BODY }}><EmberParticles /><In delay={8} from={16}><div style={{ position: 'absolute', left: 120, top: 100, right: 120 }}><div style={{ display: 'inline-block', padding: '6px 18px', background: `rgba(255, 107, 53, 0.15)`, border: `1px solid ${ACCENT}`, borderRadius: 20, fontSize: 26, color: ACCENT_GOLD, fontWeight: 600, marginBottom: 16 }}>{p.tag}</div><div style={{ fontFamily: FONT_TITLE, fontSize: 56, color: INK, lineHeight: 1.2 }}>{p.title}</div></div></In><In delay={24} from={20}><div style={{ position: 'absolute', left: 120, right: 120, top: 280, background: CARD_BG, border: `2px solid ${CARD_ACCENT}`, borderRadius: 14, padding: '8px 0', boxShadow: `0 8px 40px rgba(255, 107, 53, 0.15)` }}>{p.fields.map((field, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 32px', borderBottom: i < p.fields.length - 1 ? `1px solid ${LINE}` : 'none' }}><span style={{ fontSize: 28, color: MUTED }}>{field.label}</span><span style={{ fontSize: 30, color: ACCENT_GOLD, fontWeight: 600 }}>{field.value}</span></div>)}</div></In><In delay={60}><div style={{ position: 'absolute', left: 120, right: 120, bottom: 100, display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 24px', background: 'rgba(255, 179, 71, 0.08)', borderLeft: `3px solid ${ACCENT_GOLD}`, borderRadius: 6 }}><span style={{ fontSize: 28 }}>💡</span><span style={{ fontSize: 26, color: INK, lineHeight: 1.6 }}>{p.tip}</span></div></In></AbsoluteFill>;
};

export const MechanismScreen: React.FC<SceneRenderProps> = ({ scene }) => { const p = scene.payload as unknown as MechanismPayload; return <AbsoluteFill style={{ fontFamily: FONT_BODY }}><EmberParticles /><In delay={8} from={16}><div style={{ position: 'absolute', left: 120, top: 90, right: 120 }}><div style={{ display: 'inline-block', padding: '6px 18px', background: `rgba(255, 107, 53, 0.15)`, border: `1px solid ${ACCENT}`, borderRadius: 20, fontSize: 26, color: ACCENT_GOLD, fontWeight: 600, marginBottom: 16 }}>{p.tag}</div><div style={{ fontFamily: FONT_TITLE, fontSize: 52, color: INK, lineHeight: 1.2 }}>{p.title}</div></div></In><div style={{ position: 'absolute', left: 120, right: 120, top: 260, bottom: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>{p.steps.map((step, i) => <In key={i} delay={20 + i * 12} from={16}><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ width: 680, padding: '18px 28px', background: step.highlight ? `linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 179, 71, 0.15))` : 'rgba(255,255,255,0.05)', border: step.highlight ? `2px solid ${ACCENT_GOLD}` : `1px solid ${GLASS_BORDER}`, borderRadius: 12, boxShadow: step.highlight ? `0 0 30px rgba(255, 107, 53, 0.25)` : 'none', display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: step.highlight ? ACCENT_GOLD : 'rgba(255,255,255,0.1)', color: step.highlight ? '#1a0f0a' : MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>{step.num}</div><div style={{ flex: 1, fontSize: 28, color: INK, lineHeight: 1.4 }}>{step.text}</div>{step.icon && <div style={{ fontSize: 32 }}>{step.icon}</div>}</div>{i < p.steps.length - 1 && <div style={{ fontSize: 24, color: ACCENT_GOLD, margin: '4px 0', opacity: 0.6 }}>↓</div>}</div></In>)}</div></AbsoluteFill>;
};

export const CtaScreen: React.FC<SceneRenderProps> = ({ scene }) => { const p = scene.payload as unknown as CtaPayload; const parts = p.sentence.split(p.highlight); const pre = parts[0] ?? ''; const post = parts[1] ?? ''; return <AbsoluteFill style={{ fontFamily: FONT_BODY }}><EmberParticles /><div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 100px' }}><In delay={10} from={20}><div style={{ fontFamily: FONT_TITLE, fontSize: 64, color: INK, lineHeight: 1.4, textAlign: 'center', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>{pre}<span style={{ color: ACCENT_GOLD }}>{p.highlight}</span>{post}</div></In><In delay={40} from={16}><div style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', background: CARD_BG, border: `1px solid ${CARD_ACCENT}`, borderRadius: 10, opacity: 0.8 }}><FlameIcon size={24} color={ACCENT} /><span style={{ fontSize: 26, color: MUTED }}>夜宵手气券 · ¥3 ~ ¥30</span><div style={{ fontSize: 22, color: ACCENT_GOLD, padding: '2px 10px', background: 'rgba(255, 179, 71, 0.1)', borderRadius: 12 }}>扫码即领</div></div></In></div><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(255, 107, 53, 0.15), transparent)', pointerEvents: 'none' }} /></AbsoluteFill>;
};

export const G11_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g11-hook': HookScreen,
  'g11-idea': IdeaScreen,
  'g11-proof': ProofScreen,
  'g11-basic': BasicScreen,
  'g11-mechanism': MechanismScreen,
  'g11-cta': CtaScreen,
};

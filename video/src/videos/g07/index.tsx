// g07 咖啡茶饮 · 片1 · 九屏（一屏一组件，禁止跨行业 import）
// 母题「一张刚打印出来的点单小票」：热敏小票上下撕齿 / 咖啡渍水印 / 拿铁纸感 / 打印出票入场
// 色板 caramel（陶土咖啡红 #B5502A + 浓缩咖墨 + 纯白小票）——整套与教培那条（暖橙 + 回执左打孔 + 盖章对勾）不同。
// 屏序与分镜见 outputs/g07-咖啡茶饮/07-片1-分镜稿.md：
//   S1 钩子 / S2 痛点(拆 anchor-pain) / S3 制券·券面(★一屏标杆) / S4 机制对比(拆 anchor-mech) /
//   S5 制券·发放与期限 / S6 核销后赠券链(拆 ref-11) / S7 结果·顾客与核销(拆 ref-16) / S8 后台(拆 ref-10) / S9 收尾
// 骨架全部内联本文件；跨屏只复用 ../../components/{animations,ui} 与 ../../palette。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_ROUND, PALETTES } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import { Ico } from '../../components/icons';
import type { SceneRenderProps, SubtitleLine } from '../../types';
import type {
  HookPayload, PainPayload, MakePayload, FormRow, MechPayload, IssuePayload,
  ChainPayload, StepsPayload, LedgerPayload, CtaPayload,
} from './types';

// ── 本片色板 ──
const COFFEE_RED = '#B5502A';
const ESPRESSO = '#2B1C12';
const BROWN = '#5A3E2B';
const MUTED = '#8A6F5A';
const FAINT = '#B49A80';
const PAPER = '#FFFFFF';
const CREAM = '#F1E4CE';
const LINE = 'rgba(90,62,43,0.18)';
const SHADOW = 'rgba(90,62,43,0.15)';

// ── 节拍：口播句 → 区域 ──
const useBeat = (subs?: SubtitleLine[]): number => {
  const f = useCurrentFrame();
  if (!subs || subs.length === 0) return -1;
  let a = -1;
  subs.forEach((s, i) => { if (f >= s.startFrame) a = i; });
  return a;
};
const useBeatFrame = (subs?: SubtitleLine[]) => (i: number) => subs?.[i]?.startFrame ?? 8;
/** 区域三态：没讲到=安静可读 0.9 / 讲到=全亮 / 讲过=降到 0.74（浅底仍读得清） */
const region = (beat: number, from: number, to: number) => ({
  opacity: beat < 0 ? 0.94 : beat < from ? 0.9 : beat <= to ? 1 : 0.74,
  active: beat >= from && beat <= to,
});

// ── 母题零件 ──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const x1 = Math.sin(f / 62) * 26;
  const y1 = Math.cos(f / 80) * 20;
  const x2 = Math.cos(f / 70) * 30;
  const ringO = 0.05 + (Math.sin(f / 50) * 0.5 + 0.5) * 0.025;
  return (
    <>
      <div style={{ position: 'absolute', left: -160 + x1, top: 200 + y1, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(181,80,42,0.10) 0%, transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: -200 + x2, bottom: 360 - y1, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(141,110,99,0.12) 0%, transparent 66%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 70, top: 240, width: 260, height: 250, border: `14px solid ${COFFEE_RED}`, borderRadius: '50% 46% 52% 48% / 48% 52% 46% 54%', opacity: ringO, transform: 'rotate(-14deg)', pointerEvents: 'none' }} />
    </>
  );
};

const PrintLine: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: Math.min(1, p * 1.8), transform: `translateY(${(1 - p) * -10}px)`, ...style }}>{children}</div>;
};

const Ticket: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ children, style, rot = 0 }) => (
  <div style={{ position: 'relative', background: PAPER, border: `1.5px solid ${LINE}`, boxShadow: `0 18px 40px ${SHADOW}`, transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: -11, height: 12, backgroundImage: `linear-gradient(135deg, ${PAPER} 30%, transparent 30%), linear-gradient(-135deg, ${PAPER} 30%, transparent 30%)`, backgroundSize: '22px 22px', filter: `drop-shadow(0 -2px 2px ${SHADOW})` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: -11, height: 12, backgroundImage: `linear-gradient(45deg, ${PAPER} 30%, transparent 30%), linear-gradient(-45deg, ${PAPER} 30%, transparent 30%)`, backgroundSize: '22px 22px', filter: `drop-shadow(0 2px 2px ${SHADOW})` }} />
    {children}
  </div>
);

/** 关键词咖啡渍圈（标题里只圈一次，克制） */
const Ring: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 18, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 6px' }}>
      <span style={{ position: 'absolute', left: '-2%', top: '-14%', width: `${p * 104}%`, height: '128%', border: `4px solid ${COFFEE_RED}`, borderRadius: '50% 46% 52% 48% / 48% 52% 46% 54%', opacity: 0.55, transform: 'rotate(-5deg)' }} />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

/** 内容屏左上角标胶囊 */
const Tag: React.FC<{ text: string; delay?: number }> = ({ text, delay = 4 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 72, top: 128, display: 'inline-flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, border: `2px solid rgba(90,62,43,0.35)`, borderRadius: 999, padding: '10px 28px', color: BROWN, fontSize: 26, letterSpacing: 3, background: 'rgba(255,255,255,0.7)' }}>
      <span style={{ width: 24, height: 24, display: 'inline-block' }}>{Ico.cup(COFFEE_RED)}</span>
      {text}
    </div>
  );
};

/** 制券屏顶栏（菜单板风 + 右上示例胶囊 + 面包屑行尾合规标注） */
const MakeNav: React.FC<{ title: string; step: string; crumb: string }> = ({ title, step, crumb }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - 4, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 116, opacity: p }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, height: 66 }}>
        <span style={{ width: 44, height: 44, display: 'inline-block' }}>{Ico.cup(COFFEE_RED)}</span>
        <span style={{ fontFamily: FONT_ROUND, fontSize: 52, color: ESPRESSO, letterSpacing: 4 }}>{title}</span>
        <span style={{ position: 'absolute', right: 0, fontSize: 24, color: '#fff', background: COFFEE_RED, borderRadius: 999, padding: '9px 24px', letterSpacing: 2 }}>{step}</span>
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', fontSize: 25, color: MUTED, letterSpacing: 1 }}>{crumb}</div>
    </div>
  );
};

const GroupHead: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
  <PrintLine delay={delay}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: `2px solid ${LINE}` }}>
      <span style={{ width: 10, height: 32, borderRadius: 5, background: COFFEE_RED }} />
      <span style={{ fontSize: 31, fontWeight: 700, color: BROWN, letterSpacing: 2 }}>{text}</span>
    </div>
  </PrintLine>
);

const Chevron = () => (
  <svg width="20" height="28" viewBox="0 0 20 28" style={{ flexShrink: 0 }}>
    <path d="M5 4l11 10L5 24" stroke={FAINT} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Toggle: React.FC<{ prog: number }> = ({ prog }) => (
  <span style={{ width: 84, height: 44, borderRadius: 999, flexShrink: 0, position: 'relative', background: prog > 0.5 ? COFFEE_RED : '#D9CEC1' }}>
    <span style={{ position: 'absolute', top: 5, left: 5 + prog * 40, width: 34, height: 34, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }} />
  </span>
);

/** 一行制券表单：hero=核心决策行整行点亮；kind=select 带箭头、switch 带开关 */
const FormLine: React.FC<{ row: FormRow; delay: number; active: boolean }> = ({ row, delay, active }) => {
  const f = useCurrentFrame();
  const knob = row.kind === 'switch' ? spring({ frame: f - delay - 10, fps: FPS, config: { damping: 17, stiffness: 190 } }) : 0;
  if (f < delay) return null;
  return (
    <PrintLine delay={delay}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: row.hero ? '26px 20px 22px' : '24px 12px 20px',
        borderBottom: `1.5px dashed ${LINE}`,
        background: row.hero || active ? 'rgba(181,80,42,0.10)' : 'transparent',
        borderLeft: row.hero ? `7px solid ${COFFEE_RED}` : `7px solid ${active ? 'rgba(181,80,42,0.4)' : 'transparent'}`,
        borderRadius: 12,
      }}>
        <span style={{ width: 188, flexShrink: 0, fontSize: 30, color: row.hero || active ? '#7a3a1e' : MUTED, letterSpacing: 1, fontWeight: row.hero ? 700 : 400 }}>{row.k}</span>
        <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 14 }}>
          {row.tag && <span style={{ fontSize: 22, color: '#fff', background: COFFEE_RED, borderRadius: 8, padding: '4px 12px', letterSpacing: 1, transform: 'translateY(-6px)' }}>{row.tag}</span>}
          <span style={{ fontSize: row.hero ? 42 : 36, fontWeight: 700, color: row.hero ? COFFEE_RED : ESPRESSO, textAlign: 'right', lineHeight: 1.3 }}>{row.v}</span>
          {row.kind === 'switch' && <Toggle prog={knob} />}
          {row.kind === 'select' && <Chevron />}
        </span>
      </div>
      {row.hint && <div style={{ fontSize: 24, color: FAINT, textAlign: 'right', padding: row.hero ? '10px 20px 6px' : '8px 12px 4px', letterSpacing: 1, lineHeight: 1.4 }}>{row.hint}</div>}
    </PrintLine>
  );
};

// ── S1 钩子 ──
const S1Hook: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const t = spring({ frame: f - 8, fps: FPS, config: { damping: 20, stiffness: 130 } });
  const tick = spring({ frame: f - 60, fps: FPS, config: { damping: 18, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 250, right: 72, opacity: t, transform: `translateY(${(1 - t) * 34}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 88, lineHeight: 1.24, color: ESPRESSO }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 88, lineHeight: 1.24, color: ESPRESSO }}>
          <Ring delay={22}>{p.title2}</Ring>
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: MUTED, letterSpacing: 1, opacity: region(beat, 1, 1).opacity }}>{p.sub}</div>
      </div>
      <div style={{ position: 'absolute', left: 130, right: 130, top: 660, opacity: interpolate(tick, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateY(${(1 - tick) * 60}px)` }}>
        <Ticket rot={-1.2} style={{ padding: '46px 52px 40px 60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 28, color: FAINT, letterSpacing: 2 }}>{p.ticketName}</span>
            <span style={{ fontSize: 26, color: '#fff', background: COFFEE_RED, borderRadius: 999, padding: '10px 28px', letterSpacing: 2 }}>{p.ticketBadge}</span>
          </div>
          <div style={{ marginTop: 22, fontFamily: FONT_ROUND, fontSize: 52, color: ESPRESSO }}>{p.ticketLine}</div>
          <div style={{ marginTop: 18, fontSize: 30, color: MUTED }}>客人：白拿一杯，喝完就走</div>
        </Ticket>
      </div>
      <div style={{ position: 'absolute', left: 130, right: 130, top: 1180, opacity: region(beat, 1, 1).opacity }}>
        <PrintLine delay={150}>
          <div style={{ background: CREAM, borderRadius: 18, borderLeft: `9px solid ${COFFEE_RED}`, boxShadow: `0 12px 26px ${SHADOW}`, padding: '30px 40px', fontFamily: FONT_ROUND, fontSize: 36, color: ESPRESSO, letterSpacing: 1, textAlign: 'center' }}>
            问题不在发不发券，在<span style={{ color: COFFEE_RED }}>门槛那一栏</span>
          </div>
        </PrintLine>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 痛点（拆 anchor-pain）──
const S2Pain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as PainPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const card = spring({ frame: f - 14, fps: FPS, config: { damping: 20, stiffness: 130 } });
  const tt = spring({ frame: f - 4, fps: FPS, config: { damping: 22, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 234, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 78, lineHeight: 1.24, color: ESPRESSO }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 78, lineHeight: 1.24, color: ESPRESSO }}>{p.title2}</div>
        <div style={{ marginTop: 8, fontSize: 40, color: ESPRESSO, fontFamily: FONT_ROUND }}><Ring delay={18}>{p.accent}</Ring></div>
      </div>
      <div style={{ position: 'absolute', left: 72, top: 600, width: 560, opacity: card, transform: `translateX(${(1 - card) * 90}px) rotate(${(1 - card) * 3 - 0.6}deg)` }}>
        <Ticket style={{ padding: '46px 46px 40px 54px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 26, color: FAINT, letterSpacing: 2 }}>{p.ticketName}</span>
            <span style={{ fontSize: 25, color: '#fff', background: COFFEE_RED, borderRadius: 999, padding: '9px 26px', letterSpacing: 2 }}>{p.ticketBadge}</span>
          </div>
          <div style={{ fontFamily: FONT_ROUND, fontSize: 52, lineHeight: 1.3, color: ESPRESSO, marginTop: 16 }}>{p.ticketTitle}</div>
          {p.ticketLines.map((l, i) => (
            <div key={l} style={{ marginTop: i === 0 ? 26 : 16, fontSize: 31, color: MUTED, borderTop: i === 0 ? `1.5px dashed ${LINE}` : 'none', paddingTop: i === 0 ? 22 : 0 }}>{l}</div>
          ))}
        </Ticket>
      </div>
      <div style={{ position: 'absolute', right: 72, top: 640, width: 340 }}>
        {p.quotes.map((q, i) => {
          const r = region(beat, 0, 1);
          return (
            <PrintLine key={q.t1} delay={70 + i * 26} style={{ opacity: r.opacity, marginBottom: 90 }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: ESPRESSO }}>{q.t1}</div>
              <div style={{ fontSize: 31, color: MUTED, marginTop: 8 }}>{q.t2}</div>
              <div style={{ width: 64, height: 4, background: COFFEE_RED, marginTop: 14, borderRadius: 2 }} />
            </PrintLine>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1300, opacity: region(beat, 1, 1).opacity }}>
        <PrintLine delay={150}>
          <div style={{ background: CREAM, borderRadius: 18, borderLeft: `9px solid ${COFFEE_RED}`, boxShadow: `0 12px 26px ${SHADOW}`, padding: '30px 40px', fontFamily: FONT_ROUND, fontSize: 36, color: ESPRESSO, letterSpacing: 1, textAlign: 'center' }}>
            无门槛是<span style={{ color: COFFEE_RED }}>请客</span>，设了门槛才是<span style={{ color: COFFEE_RED }}>做生意</span>
          </div>
        </PrintLine>
      </div>
    </AbsoluteFill>
  );
};

// ── S3 制券·券面+期限（★一屏标杆：两组表单 + 门槛分水岭提示）──
const S3MakeBasic: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const beat = useBeat(scene.subtitles);
  const bf = useBeatFrame(scene.subtitles);
  const f = useCurrentFrame();
  const lift = spring({ frame: f - 12, fps: FPS, config: { damping: 20, stiffness: 150 } });
  // 行（跨组拉平）→ 口播句：名称1 门槛2 面额3 数量3 有效期类型4 有效期4
  const rowBeat = [1, 2, 3, 3, 4, 4];
  const cardTop = (gi: number) => p.groups.slice(0, gi).reduce((n, g) => n + g.rows.length, 0);
  const groupDelay = (gi: number) => Math.max(10, bf(rowBeat[cardTop(gi)]) - 10);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <MakeNav title={p.navTitle} step={p.tag} crumb={p.crumb} />
      <div style={{ position: 'absolute', left: 68, right: 68, top: 300, opacity: lift, transform: `translateY(${(1 - lift) * 60}px)` }}>
        {p.groups.map((g, gi) => (
          <div key={g.head} style={{ marginTop: gi === 0 ? 0 : 44 }}>
            <Ticket rot={gi === 0 ? 0 : 0.3} style={{ padding: '34px 44px 22px 52px' }}>
              <GroupHead text={g.head} delay={groupDelay(gi)} />
              {g.rows.map((row, i) => {
                const b = rowBeat[cardTop(gi) + i];
                return <FormLine key={row.k} row={row} delay={bf(b) + 4} active={beat === b} />;
              })}
            </Ticket>
          </div>
        ))}
        {p.callout && (
          <PrintLine delay={bf(2) + 30} style={{ marginTop: 40 }}>
            <div style={{ background: CREAM, borderRadius: 18, borderLeft: `9px solid ${COFFEE_RED}`, boxShadow: `0 12px 26px ${SHADOW}`, padding: '28px 38px' }}>
              <div style={{ fontFamily: FONT_ROUND, fontSize: 34, color: ESPRESSO, letterSpacing: 1 }}>{p.callout.l1}</div>
              <div style={{ fontFamily: FONT_ROUND, fontSize: 34, color: COFFEE_RED, marginTop: 10, letterSpacing: 1 }}>{p.callout.l2}</div>
              <div style={{ marginTop: 14, fontSize: 25, color: BROWN, letterSpacing: 1 }}>{p.callout.tag}</div>
            </div>
          </PrintLine>
        )}
      </div>
      <div style={{ position: 'absolute', left: 68, right: 68, bottom: 190, textAlign: 'center', fontSize: 24, color: 'rgba(90,62,43,0.6)', letterSpacing: 1, opacity: interpolate(f, [bf(4), bf(4) + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{p.foot}</div>
    </AbsoluteFill>
  );
};

// ── S4 机制·门槛对比（拆 anchor-mech）──
const S4Mech: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MechPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 20, stiffness: 140 } });
  const left = region(beat, 1, 1);
  const right = region(beat, 2, 2);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 240, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 30}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 82, lineHeight: 1.24, color: ESPRESSO }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 82, lineHeight: 1.24, color: ESPRESSO }}><Ring delay={20}>{p.title2}</Ring></div>
        <div style={{ marginTop: 20, fontSize: 30, color: MUTED }}>{p.sub}</div>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 660, display: 'flex', gap: 26, alignItems: 'stretch' }}>
        <div style={{ flex: 1, opacity: Math.min(left.opacity + 0.05, 1) }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: MUTED, marginBottom: 18 }}>{p.leftHead}</div>
          <div style={{ background: '#EFE7DB', borderRadius: 20, padding: '36px 34px', minHeight: 420 }}>
            {p.leftItems.map((it, i) => <PrintLine key={it} delay={40 + i * 12}><div style={{ fontSize: 32, color: '#8a715c', lineHeight: 1.9 }}>· {it}</div></PrintLine>)}
          </div>
          <div style={{ marginTop: 22, background: 'rgba(181,80,42,0.08)', border: `1.5px dashed rgba(181,80,42,0.4)`, borderRadius: 16, padding: '22px 26px', fontSize: 27, color: '#8a4a2e', lineHeight: 1.5 }}>{p.leftNote}</div>
        </div>
        <div style={{ width: 3, background: LINE, borderRadius: 2, margin: '40px 0' }} />
        <div style={{ flex: 1, opacity: Math.min(right.opacity + 0.05, 1) }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: COFFEE_RED, marginBottom: 18 }}>{p.rightHead}</div>
          <div style={{ background: PAPER, border: `2px solid ${COFFEE_RED}`, borderRadius: 20, padding: '36px 34px', minHeight: 420, boxShadow: `0 14px 30px ${SHADOW}` }}>
            {p.rightItems.map((it, i) => <PrintLine key={it} delay={70 + i * 12}><div style={{ fontSize: 32, color: ESPRESSO, fontWeight: 600, lineHeight: 1.9 }}>· {it}</div></PrintLine>)}
          </div>
          <div style={{ marginTop: 22, background: CREAM, borderLeft: `7px solid ${COFFEE_RED}`, borderRadius: 16, padding: '22px 26px', fontSize: 27, color: BROWN, lineHeight: 1.5 }}>{p.rightNote}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1360, opacity: region(beat, 3, 3).opacity }}>
        <PrintLine delay={150}>
          <div style={{ background: COFFEE_RED, borderRadius: 18, padding: '26px 40px', fontFamily: FONT_ROUND, fontSize: 36, color: '#fff', textAlign: 'center', letterSpacing: 2, boxShadow: `0 14px 30px rgba(181,80,42,0.28)` }}>{p.punch}</div>
        </PrintLine>
      </div>
    </AbsoluteFill>
  );
};

// ── S5 发放方式·选择（公开领取 vs 私密发放，选公开）──
const S5Issue: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as IssuePayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  const pick = spring({ frame: f - 24, fps: FPS, config: { damping: 18, stiffness: 160 } });
  const other = spring({ frame: f - 48, fps: FPS, config: { damping: 20, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 240, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 78, color: ESPRESSO, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 16, fontSize: 29, color: MUTED }}>{p.sub}</div>
      </div>
      {/* 选中：公开领取 */}
      <div style={{ position: 'absolute', left: 72, right: 72, top: 520, opacity: interpolate(pick, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateY(${(1 - pick) * 40}px)` }}>
        <Ticket style={{ padding: '40px 46px 36px 54px', border: `2.5px solid ${COFFEE_RED}`, background: 'rgba(181,80,42,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 48, height: 48, display: 'inline-block' }}>{Ico.check(COFFEE_RED)}</span>
            <span style={{ fontFamily: FONT_ROUND, fontSize: 50, color: ESPRESSO }}>{p.pickHead}</span>
            <span style={{ marginLeft: 'auto', fontSize: 25, color: '#fff', background: COFFEE_RED, borderRadius: 999, padding: '9px 24px', letterSpacing: 2 }}>这张选它</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 30, color: BROWN }}>{p.pickDesc}</div>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {p.pickPoints.map((pt, i) => (
              <PrintLine key={pt} delay={40 + i * 12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, color: ESPRESSO }}>
                  <span style={{ width: 13, height: 13, borderRadius: '50%', background: COFFEE_RED, flexShrink: 0 }} />{pt}
                </div>
              </PrintLine>
            ))}
          </div>
        </Ticket>
      </div>
      {/* 未选：私密发放（弱化，一句带过） */}
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1080, opacity: Math.min(interpolate(other, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), region(beat, 0, 1).opacity) * 0.9, transform: `translateY(${(1 - other) * 40}px)` }}>
        <div style={{ background: '#EFE7DB', borderRadius: 20, padding: '30px 42px', display: 'flex', alignItems: 'center', gap: 18, opacity: 0.85 }}>
          <span style={{ fontFamily: FONT_ROUND, fontSize: 40, color: MUTED }}>{p.otherHead}</span>
          <span style={{ fontSize: 27, color: '#8a715c', marginLeft: 'auto' }}>{p.otherDesc}</span>
        </div>
      </div>
      {/* 结果条 */}
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1320, opacity: region(beat, 1, 1).opacity }}>
        <PrintLine delay={120}>
          <div style={{ background: CREAM, borderRadius: 18, borderLeft: `9px solid ${COFFEE_RED}`, boxShadow: `0 12px 26px ${SHADOW}`, padding: '34px 44px', fontFamily: FONT_ROUND, fontSize: 40, color: ESPRESSO, letterSpacing: 1, lineHeight: 1.4 }}>{p.result}</div>
        </PrintLine>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 核销后赠券链（拆 ref-11 纵向步骤条）──
const S6Chain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ChainPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  const nodeBeat: [number, number][] = [[0, 0], [1, 1], [2, 2]];
  const line = interpolate(f, [24, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 238, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 74, color: ESPRESSO, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 16, fontSize: 29, color: MUTED }}>{p.sub}</div>
      </div>
      <div style={{ position: 'absolute', left: 128, top: 560, width: 5, height: 820 * line, background: `linear-gradient(${COFFEE_RED}, ${BROWN})`, borderRadius: 3 }} />
      {p.nodes.map((n, i) => {
        const r = region(beat, nodeBeat[i][0], nodeBeat[i][1]);
        const s = spring({ frame: f - 26 - i * 20, fps: FPS, config: { damping: 19, stiffness: 160 } });
        return (
          <div key={n.head} style={{ position: 'absolute', left: 72, right: 72, top: 540 + i * 320, opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })), transform: `translateY(${(1 - s) * 44}px)` }}>
            <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
              <div style={{ width: 108, height: 108, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 2 ? COFFEE_RED : PAPER, border: i === 2 ? 'none' : `3px solid ${COFFEE_RED}`, boxShadow: `0 10px 24px ${SHADOW}` }}>
                <span style={{ fontFamily: FONT_ROUND, fontSize: 52, color: i === 2 ? '#fff' : COFFEE_RED }}>{i + 1}</span>
              </div>
              <Ticket rot={(i - 1) * 0.4} style={{ flex: 1, padding: '30px 34px 28px 44px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: ESPRESSO }}>{n.head}</span>
                  {n.reward && <span style={{ fontSize: 24, color: '#fff', background: COFFEE_RED, borderRadius: 8, padding: '6px 14px', letterSpacing: 2 }}>奖</span>}
                </div>
                <div style={{ fontSize: 28, color: BROWN, marginTop: 10, lineHeight: 1.5 }}>{n.desc}</div>
                {n.note && <div style={{ fontSize: 24, color: FAINT, marginTop: 10 }}>{n.note}</div>}
              </Ticket>
            </div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 176, textAlign: 'center', fontSize: 24, color: 'rgba(90,62,43,0.55)', letterSpacing: 2, opacity: region(beat, 2, 2).opacity }}>{p.foot}</div>
    </AbsoluteFill>
  );
};

// ── S7 结果·顾客与核销（拆 ref-16 步骤结果对照）──
const S7Steps: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as StepsPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  const rowBeat: [number, number][] = [[0, 0], [1, 1], [2, 2]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 240, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 76, color: ESPRESSO, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 18, fontSize: 29, color: MUTED }}>{p.sub}</div>
      </div>
      {p.rows.map((row, i) => {
        const r = region(beat, rowBeat[i][0], rowBeat[i][1]);
        const s = spring({ frame: f - 26 - i * 20, fps: FPS, config: { damping: 20, stiffness: 160 } });
        return (
          <div key={row.act} style={{ position: 'absolute', left: 72, right: 72, top: 500 + i * 360, opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })), transform: `translateX(${(1 - s) * 100}px)` }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 24 }}>
              <Ticket style={{ flex: 1.15, padding: '30px 30px 30px 46px', display: 'flex', gap: 22, alignItems: 'center' }}>
                <span style={{ width: 66, height: 66, borderRadius: 16, background: i === 1 ? COFFEE_RED : BROWN, color: '#fff', fontFamily: FONT_ROUND, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: ESPRESSO }}>{row.act}</div>
                  <div style={{ fontSize: 27, color: MUTED, marginTop: 8, lineHeight: 1.45 }}>{row.desc}</div>
                </div>
              </Ticket>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 40, height: 28 }}>{Ico.arrow(COFFEE_RED)}</span>
              </div>
              <div style={{ flex: 1, background: CREAM, borderRadius: 20, padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, border: r.active ? `2.5px solid ${COFFEE_RED}` : '2.5px solid transparent' }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: COFFEE_RED, letterSpacing: 2 }}>{row.mark}</span>
                <div style={{ fontSize: 28, color: BROWN, lineHeight: 1.5 }}>{row.res}</div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── S8 后台（拆 ref-10 多栏清单）──
const S8Ledger: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as LedgerPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 238, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 72, color: ESPRESSO, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 16, fontSize: 29, color: MUTED }}>{p.sub}</div>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 540, display: 'flex', gap: 32 }}>
        {p.cols.map((col, ci) => {
          const r = region(beat, ci === 0 ? 0 : 1, ci === 0 ? 0 : 1);
          const s = spring({ frame: f - 22 - ci * 16, fps: FPS, config: { damping: 21, stiffness: 150 } });
          const headBg = col.tone === 'accent' ? COFFEE_RED : BROWN;
          return (
            <div key={col.head} style={{ flex: 1, opacity: Math.min(r.opacity + 0.08, 1) * interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateX(${(1 - s) * 90 * (ci === 0 ? -1 : 1)}px)` }}>
              <div style={{ background: PAPER, borderRadius: 24, border: `1.5px solid ${LINE}`, boxShadow: `0 16px 38px ${SHADOW}`, padding: '36px 32px', height: 820, outline: r.active ? `3px solid ${headBg}` : '3px solid transparent', outlineOffset: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 26, borderBottom: `2px solid ${LINE}` }}>
                  <span style={{ width: 14, height: 36, borderRadius: 6, background: headBg }} />
                  <span style={{ fontFamily: FONT_ROUND, fontSize: 42, color: ESPRESSO }}>{col.head}</span>
                </div>
                {col.items.map((it, i) => (
                  <PrintLine key={it} delay={40 + ci * 16 + i * 12}>
                    <div style={{ marginTop: 34, background: '#F7F1E7', borderRadius: 16, padding: '32px 28px', fontSize: 31, color: BROWN, lineHeight: 1.5 }}>{it}</div>
                  </PrintLine>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1440, opacity: region(beat, 1, 1).opacity }}>
        <PrintLine delay={150}>
          <div style={{ background: PAPER, borderRadius: 18, border: `1.5px solid ${LINE}`, boxShadow: `0 12px 26px ${SHADOW}`, padding: '26px 40px', fontFamily: FONT_ROUND, fontSize: 34, color: COFFEE_RED, textAlign: 'center', letterSpacing: 2 }}>{p.punch}</div>
        </PrintLine>
      </div>
    </AbsoluteFill>
  );
};

// ── S9 收尾 ──
const S9Cta: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 20, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <div style={{ position: 'absolute', left: 72, top: 250, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 30}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 82, lineHeight: 1.24, color: ESPRESSO }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 82, lineHeight: 1.24, color: ESPRESSO }}><Ring delay={18}>{p.title2}</Ring></div>
      </div>
      {p.strips.map((st, i) => (
        <div key={st.name} style={{ position: 'absolute', left: 120, right: 120, top: 590 + i * 176, opacity: region(beat, 0, 0).opacity }}>
          <PrintLine delay={26 + i * 14}>
            <Ticket rot={(i - 1.5) * 0.5} style={{ display: 'flex', alignItems: 'center', padding: '28px 44px 28px 54px' }}>
              <span style={{ width: 40, height: 40, display: 'inline-block' }}>{Ico.check(COFFEE_RED)}</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: ESPRESSO, marginLeft: 22, flex: 1 }}>{st.name}</span>
              <span style={{ fontSize: 27, color: COFFEE_RED, fontWeight: 700, letterSpacing: 2 }}>{st.role}</span>
            </Ticket>
          </PrintLine>
        </div>
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <PrintLine delay={90}>
          <div style={{ border: `5px solid ${COFFEE_RED}`, borderRadius: 24, padding: '20px 52px', fontFamily: FONT_ROUND, fontSize: 62, color: COFFEE_RED, letterSpacing: 8, background: 'rgba(255,255,255,0.85)', boxShadow: `0 14px 34px rgba(181,80,42,0.22)` }}>{p.brand}</div>
        </PrintLine>
        <div style={{ fontSize: 28, color: MUTED, letterSpacing: 3, opacity: region(beat, 1, 1).opacity }}>{p.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 注册表 ──
export const G07_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g07-hook': S1Hook,
  'g07-pain': S2Pain,
  'g07-make-basic': S3MakeBasic,
  'g07-mech': S4Mech,
  'g07-issue': S5Issue,
  'g07-chain': S6Chain,
  'g07-steps': S7Steps,
  'g07-ledger': S8Ledger,
  'g07-cta': S9Cta,
};

// g11 · 烧烤夜宵 · 专属屏组件（一条视频一套 UI 语言）
// 母题：深夜黑板牌——深板面 + 木框 + 粉笔字 + 手绘线（不用毛玻璃块、不用卡片阵列）。
// 色彩：SKILL §4.5 纯 Remotion 烧烤基准（深底 #120B08/#24130C/#42180D、强调 #F06A24/#FF8B38/#FFC05A、字 #F7F1EA/#C6BDB5）。
// 布局：内容落在 x[120,960]（板宽 840、left 120）；核心带 y200-1100、硬底线 1760（R3 §7.3）。
// 入场语法：牌挂入轻摆 → 粉笔逐笔写出（clip 揭示）→ 行逐条擦入；不用大段 translateY+opacity。
// 禁跨行业 import 他片组件；spring 一律透传本片 motion（R3 §7.1）。
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE_OUT, SPRING_CONFIG } from '../../components/animations';
import { FONT_BODY, FONT_IMPACT, FONT_TITLE } from '../../palette';
import type { SceneRenderProps, StyleConfig } from '../../types';
import type { CtaPayload, FlowPayload, FormFacePayload, FormIssuePayload, FormRow, FormTermPayload, HookPayload, IdeaPayload } from './types';

/* ── 本片色板 ───────────────────────────────────────────── */
const CHALK = '#F7F1EA';
const CHALK_DIM = '#C6BDB5';
const EMBER = '#F06A24';
const EMBER_LT = '#FF8B38';
const GOLD = '#FFC05A';
const BOARD = '#24130C';
const BOARD_DK = '#120B08';
const FRAME = '#4a2612';
/** 粉笔质感：多重描边 + 极轻外发光（模拟粉笔边缘毛糙，不伤可读性） */
const CHALK_SHADOW = '0 0 2px rgba(247,241,234,.55), 0 0 18px rgba(240,106,36,.22)';

const BOARD_W = 880;
const BOARD_LEFT = 100;

type SpringCfg = (typeof SPRING_CONFIG)[keyof typeof SPRING_CONFIG];
const cfgOf = (style: StyleConfig): SpringCfg => SPRING_CONFIG[style.motion];

/* ── 零件 · 黑板牌 ──────────────────────────────────────── */
const Board: React.FC<{ w?: number; h: number; top: number; rotate?: number; delay?: number; sp: SpringCfg; children: React.ReactNode }> = ({ w = BOARD_W, h, top, rotate = -0.6, delay = 0, sp, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: sp, durationInFrames: 26 });
  return (
    <div
      style={{
        position: 'absolute',
        left: BOARD_LEFT,
        top,
        width: w,
        height: h,
        transform: `translateY(${interpolate(s, [0, 1], [-40, 0])}px) rotate(${rotate * s}deg)`,
        opacity: interpolate(s, [0, 1], [0, 1]),
        border: `10px solid ${FRAME}`,
        borderRadius: 10,
        background: `radial-gradient(120% 55% at 16% 10%, rgba(255,255,255,.05), transparent 62%), radial-gradient(90% 46% at 84% 82%, rgba(255,255,255,.032), transparent 66%), repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0 2px, transparent 2px 5px), linear-gradient(162deg, #2a1709 0%, #140c07 100%)`,
        boxShadow: `inset 0 2px 40px rgba(0,0,0,.55), inset 0 0 0 2px rgba(247,241,234,.05), 0 18px 50px rgba(0,0,0,.45)`,
        padding: '34px 40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 14, border: '2px dashed rgba(247,241,234,.13)', borderRadius: 5, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>{children}</div>
    </div>
  );
};

/* ── 零件 · 粉笔逐笔写出 ────────────────────────────────── */
const WriteIn: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 16], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}>{children}</div>;
};

/* ── 零件 · 手绘下划线 ──────────────────────────────────── */
const ChalkUnderline: React.FC<{ start: number; width: number; color?: string }> = ({ start, width, color = GOLD }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <svg width={width} height={10} style={{ display: 'block', marginTop: 4 }}>
      <path d={`M 2 6 C ${width * 0.3} 2, ${width * 0.7} 9, ${width - 2} 5`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={width} strokeDashoffset={width * (1 - p)} opacity={0.9} />
    </svg>
  );
};

/* ── 零件 · 火星粒子（帧驱动确定性、种子固定）───────────── */
const EmberParticles: React.FC<{ count?: number }> = ({ count = 22 }) => {
  const f = useCurrentFrame();
  const items = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number): number => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
        return { x: r(1) * 1080, size: 2 + r(2) * 4, speed: 0.35 + r(3) * 0.9, phase: r(4), drift: 18 + r(5) * 40, ph2: r(6) * Math.PI * 2 };
      }),
    [count],
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {items.map((p, i) => {
        const life = (f * p.speed * 0.4 + p.phase * 100) % 100;
        const o = Math.max(0, Math.sin((life / 100) * Math.PI)) * 0.55;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + Math.sin(f * 0.02 + p.ph2) * p.drift,
              top: 1980 - life * 20,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: EMBER_LT,
              opacity: o,
              boxShadow: `0 0 ${p.size * 3}px ${EMBER}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ── 零件 · 粉笔大数字 ─────────────────────────────────── */
const BigChalk: React.FC<{ text: string; start: number; size?: number; color?: string; sp: SpringCfg }> = ({ text, start, size = 132, color = GOLD, sp }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - start, fps, config: sp, durationInFrames: 20 });
  return (
    <span style={{ fontFamily: FONT_IMPACT, fontSize: size, lineHeight: 1, color, display: 'inline-block', transform: `scale(${interpolate(s, [0, 1], [0.72, 1])})`, opacity: interpolate(s, [0, 1], [0, 1]), textShadow: CHALK_SHADOW, filter: 'contrast(1.04)' }}>
      {text}
    </span>
  );
};

/* ── 零件 · 牌内小标题 ─────────────────────────────────── */
const BoardHeading: React.FC<{ text: string; delay?: number; tone?: string }> = ({ text, delay = 6, tone = EMBER_LT }) => (
  <WriteIn start={delay}>
    <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 40, color: tone, letterSpacing: 3, textShadow: CHALK_SHADOW }}>{text}</div>
    <ChalkUnderline start={delay + 8} width={210} color={tone} />
  </WriteIn>
);

/* ── 零件 · 字段行（左标签 · 右值）──────────────────────── */
const RowLine: React.FC<{ row: FormRow; start: number }> = ({ row, start }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [start, start + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(f, [start, start + 12], [-18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', transform: `translateX(${x}px)`, opacity: o, padding: '18px 0', borderBottom: '1px dashed rgba(198,189,181,.22)' }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 34, color: CHALK_DIM, fontWeight: 600 }}>{row.k}</span>
      <span style={{ fontFamily: FONT_TITLE, fontSize: 44, color: row.hero ? GOLD : CHALK, fontWeight: 700, textShadow: CHALK_SHADOW }}>{row.v}</span>
    </div>
  );
};

/* ── 零件 · 批注带 ─────────────────────────────────────── */
const NoteBand: React.FC<{ notes: string[]; start: number }> = ({ notes, start }) => (
  <div style={{ marginTop: 16 }}>
    {notes.map((n, i) => (
      <WriteIn key={i} start={start + i * 12}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: CHALK_DIM, padding: '9px 0' }}>
          <span style={{ color: EMBER_LT, marginRight: 10 }}>—</span>
          {n}
        </div>
      </WriteIn>
    ))}
  </div>
);

/* ══ S1 · 钩子：同店两态对照 ══════════════════════════════ */
const G11Hook: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as HookPayload;
  const sp = cfgOf(style);
  const cols = [
    { label: p.leftLabel, value: p.leftValue, note: p.leftNote, hot: true },
    { label: p.rightLabel, value: p.rightValue, note: p.rightNote, hot: false },
  ];
  return (
    <AbsoluteFill>
      <EmberParticles />
      <Board h={1120} top={330} sp={sp}>
        <BoardHeading text={p.title} tone={CHALK} />
        <div style={{ display: 'flex', marginTop: 36, gap: 24 }}>
          {cols.map((c, i) => (
            <div key={i} style={{ flex: 1, padding: '24px 20px', borderRadius: 6, background: c.hot ? 'rgba(240,106,36,.14)' : 'rgba(0,0,0,.28)', border: `1px solid ${c.hot ? 'rgba(255,139,56,.5)' : 'rgba(198,189,181,.2)'}` }}>
              <WriteIn start={30 + i * 14}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: c.hot ? EMBER_LT : CHALK_DIM, fontWeight: 700 }}>{c.label}</div>
              </WriteIn>
              <div style={{ marginTop: 12 }}>
                <BigChalk text={c.value} start={44 + i * 18} size={78} color={c.hot ? GOLD : CHALK} sp={sp} />
              </div>
              <WriteIn start={58 + i * 16}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 25, color: CHALK_DIM, marginTop: 8 }}>{c.note}</div>
              </WriteIn>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44 }}>
          <WriteIn start={150}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: CHALK, lineHeight: 1.5 }}>{p.subHook}</div>
          </WriteIn>
          <ChalkUnderline start={166} width={600} color={EMBER_LT} />
        </div>
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S2 · 理解段：上下算账块 ═════════════════════════════ */
const G11Idea: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as IdeaPayload;
  const sp = cfgOf(style);
  return (
    <AbsoluteFill>
      <EmberParticles count={16} />
      <Board h={1180} top={320} rotate={0.5} sp={sp}>
        <WriteIn start={6}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: CHALK_DIM, fontWeight: 700 }}>{p.topTitle}</div>
        </WriteIn>
        {p.topRows.map((r, i) => (
          <WriteIn key={i} start={26 + i * 16}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: i === 1 ? CHALK : CHALK_DIM, padding: '11px 0' }}>{r}</div>
          </WriteIn>
        ))}
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${EMBER} 30%, ${EMBER} 70%, transparent)`, margin: '20px 0', opacity: 0.75 }} />
        <WriteIn start={190}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: EMBER_LT, fontWeight: 700 }}>{p.bottomTitle}</div>
        </WriteIn>
        {p.bottomRows.map((r, i) => (
          <WriteIn key={i} start={210 + i * 18}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: CHALK, padding: '11px 0' }}>{r}</div>
          </WriteIn>
        ))}
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <BigChalk text={p.seam} start={370} size={48} color={GOLD} sp={sp} />
        </div>
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S3 · 制券① 手气券（一屏标杆）════════════════════════ */
const G11FormFace: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as FormFacePayload;
  const sp = cfgOf(style);
  return (
    <AbsoluteFill>
      <EmberParticles count={20} />
      <Board h={1150} top={300} sp={sp}>
        <BoardHeading text={p.head} />
        <WriteIn start={30}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: CHALK_DIM, marginTop: 16 }}>券类型：{p.typeLabel}</div>
        </WriteIn>
        <div style={{ marginTop: 8 }}>
          {p.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={64 + i * 22} />
          ))}
        </div>
        <div style={{ marginTop: 34, padding: '26px 28px', borderRadius: 6, background: 'rgba(240,106,36,.12)', border: '1px solid rgba(255,139,56,.4)' }}>
          <WriteIn start={180}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: CHALK_DIM }}>{p.face.label}</div>
          </WriteIn>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6 }}>
            {p.face.rows.map((r, i) => (
              <React.Fragment key={r.big}>
                {i > 0 && <span style={{ fontFamily: FONT_BODY, fontSize: 40, color: CHALK_DIM }}>~</span>}
                <BigChalk text={r.big} start={196 + i * 18} size={162} sp={sp} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 34, color: CHALK_DIM }}>{r.unit}</span>
              </React.Fragment>
            ))}
          </div>
          <ChalkUnderline start={224} width={280} />
          <WriteIn start={232}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 25, color: CHALK_DIM, marginTop: 4 }}>{p.face.note}</div>
          </WriteIn>
        </div>
        <NoteBand notes={p.notes} start={330} />
        {p.tip && (
          <WriteIn start={470}>
            <div style={{ marginTop: 30, fontFamily: FONT_TITLE, fontSize: 36, color: GOLD, border: `2px solid ${GOLD}`, borderRadius: 6, padding: '14px 22px', display: 'inline-block', textShadow: CHALK_SHADOW }}>{p.tip}</div>
          </WriteIn>
        )}
      </Board>
      {/* L1 氛围：板下炭火余温光（补下部空间，语义＝炭火还在烧） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1560, height: 420, background: 'radial-gradient(60% 100% at 50% 100%, rgba(240,106,36,.20), transparent 70%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ══ S4 · 制券② 发放 + 倒计时 ════════════════════════════ */
const G11FormIssue: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as FormIssuePayload;
  const sp = cfgOf(style);
  const f = useCurrentFrame();
  const cd = Math.max(0, 3 - Math.floor(Math.max(0, f - 330) / 26));
  return (
    <AbsoluteFill>
      <EmberParticles count={18} />
      <Board h={1250} top={300} rotate={0.4} sp={sp}>
        <BoardHeading text={p.head} />
        <div style={{ marginTop: 10 }}>
          {p.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={44 + i * 24} />
          ))}
        </div>
        <WriteIn start={140}>
          <div style={{ marginTop: 18, fontFamily: FONT_BODY, fontSize: 28, color: EMBER_LT, fontWeight: 700 }}>{p.group.head}</div>
          <ChalkUnderline start={148} width={210} color={EMBER_LT} />
        </WriteIn>
        <div>
          {p.group.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={166 + i * 24} />
          ))}
        </div>
        <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 24 }}>
          <WriteIn start={330}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: CHALK_DIM }}>{p.countdown.label}</div>
          </WriteIn>
          <BigChalk text={cd > 0 ? `00:0${cd}` : p.countdown.unlock} start={340} size={96} color={cd > 0 ? CHALK : GOLD} sp={sp} />
        </div>
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S5 · 制券③ 期限与时段带 ═════════════════════════════ */
const G11FormTerm: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as FormTermPayload;
  const sp = cfgOf(style);
  const f = useCurrentFrame();
  const grow = interpolate(f, [130, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <EmberParticles count={16} />
      <Board h={1130} top={330} sp={sp}>
        <BoardHeading text={p.head} />
        <div style={{ marginTop: 10 }}>
          {p.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={40 + i * 24} />
          ))}
        </div>
        <WriteIn start={104}>
          <div style={{ marginTop: 24, fontFamily: FONT_BODY, fontSize: 30, color: EMBER_LT, fontWeight: 700 }}>{p.band.label}</div>
          <ChalkUnderline start={112} width={190} color={EMBER_LT} />
        </WriteIn>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, clipPath: `inset(0 ${(1 - grow) * 100}% 0 0)` }}>
          {p.band.weekdays.map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 5, fontFamily: FONT_BODY, fontSize: 24, color: i < p.band.activeCount ? CHALK : 'rgba(198,189,181,.45)', background: i < p.band.activeCount ? 'rgba(240,106,36,.18)' : 'rgba(0,0,0,.35)', border: `1px solid ${i < p.band.activeCount ? 'rgba(255,139,56,.55)' : 'rgba(198,189,181,.16)'}` }}>{d}</div>
          ))}
        </div>
        <WriteIn start={240}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: GOLD, marginTop: 16 }}>{p.band.value}</div>
        </WriteIn>
        {p.note && (
          <WriteIn start={300}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 25, color: CHALK_DIM, marginTop: 20 }}>— {p.note}</div>
          </WriteIn>
        )}
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S6 · 顾客侧 / 核销侧接力链 ══════════════════════════ */
const G11Flow: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as FlowPayload;
  const sp = cfgOf(style);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <EmberParticles count={18} />
      <Board h={900} top={420} rotate={-0.4} sp={sp}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
          {p.steps.map((s, i) => {
            const o = interpolate(f, [20 + i * 30, 44 + i * 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <React.Fragment key={s.title}>
                <div style={{ flex: 1, opacity: o, padding: '18px 16px', borderRadius: 6, background: 'rgba(0,0,0,.28)', border: '1px solid rgba(198,189,181,.2)', textAlign: 'center' }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: s.kind === 'coupon' ? EMBER_LT : CHALK_DIM, fontWeight: 700 }}>{s.title}</div>
                  {s.value && (
                    <div style={{ marginTop: 10 }}>
                      <BigChalk text={s.value} start={40 + i * 30} size={s.kind === 'coupon' ? 74 : 50} color={s.kind === 'verify' ? GOLD : CHALK} sp={sp} />
                    </div>
                  )}
                  {s.note && <div style={{ fontFamily: FONT_BODY, fontSize: 23, color: CHALK_DIM, marginTop: 8 }}>{s.note}</div>}
                </div>
                {i < p.steps.length - 1 && <div style={{ alignSelf: 'center', opacity: o, fontFamily: FONT_BODY, fontSize: 38, color: EMBER }}>›</div>}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <WriteIn start={140}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: CHALK_DIM }}>{p.tailNote}</div>
          </WriteIn>
        </div>
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S7 · 金句收口 ══════════════════════════════════════ */
const G11Cta: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as CtaPayload;
  const sp = cfgOf(style);
  return (
    <AbsoluteFill>
      <EmberParticles count={14} />
      <Board h={860} top={450} rotate={0} sp={sp}>
        {p.lines.map((l, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 56 : 24 }}>
            <WriteIn start={20 + i * 26}>
              <div style={{ fontFamily: FONT_IMPACT, fontSize: 72, color: i === 0 ? CHALK : GOLD, lineHeight: 1.25 }}>{l}</div>
            </WriteIn>
          </div>
        ))}
        <WriteIn start={130}>
          <div style={{ marginTop: 50, fontFamily: FONT_BODY, fontSize: 28, color: CHALK_DIM }}>{p.action}</div>
        </WriteIn>
      </Board>
    </AbsoluteFill>
  );
};

/* ── 注册表（scenes/index.tsx 按 ui 名分发）────────────── */
export const G11_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g11-hook': G11Hook,
  'g11-idea': G11Idea,
  'g11-form-face': G11FormFace,
  'g11-form-issue': G11FormIssue,
  'g11-form-term': G11FormTerm,
  'g11-flow': G11Flow,
  'g11-cta': G11Cta,
};

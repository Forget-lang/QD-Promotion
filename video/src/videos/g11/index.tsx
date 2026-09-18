// g11 · 烧烤夜宵 · 专属屏组件（一条视频一套 UI 语言）
// 母题：深夜黑板牌——深板面 + 木框 + 粉笔字 + 手绘线（不用毛玻璃块、不用卡片阵列）。
// 色彩：SKILL §4.5 纯 Remotion 烧烤基准（深底 #120B08/#24130C/#42180D、强调 #F06A24/#FF8B38/#FFC05A、字 #F7F1EA/#C6BDB5）。
// 布局：板宽 820、left 130（旋转 ±0.6° 角点外扩 ~6px 已留余量）→ 板自身落在 x124..956 ⊂ x[120,960]；核心带 y200-1100、硬底线 1760（R3 §7.3；达标方式见 §7.3「安全区不得靠整场景缩放」）。
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

/** 板宽/左边距：旋转 ±0.6° 会让角点外扩约 6px → 取 130/820，使板恒定落在 x120..960（R3 §7.3 安全线）内 */
const BOARD_W = 820;
const BOARD_LEFT = 130;

type SpringCfg = (typeof SPRING_CONFIG)[keyof typeof SPRING_CONFIG];
const cfgOf = (style: StyleConfig): SpringCfg => SPRING_CONFIG[style.motion];

/* ── 零件 · 黑板牌 ──────────────────────────────────────── */
const Board: React.FC<{ w?: number; h?: number; top?: number; rotate?: number; delay?: number; gap?: number; sp: SpringCfg; children: React.ReactNode }> = ({ w = BOARD_W, h, top, rotate = -0.6, delay = 0, gap = 30, sp, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: sp, durationInFrames: 26 });
  /** fit 模式（不给 h）：板高随内容、垂直居中于 y150~1710；给了 h：固定高 + space-between（S3 标杆沿用） */
  const fit = h == null;
  const panel = (
    <div
      style={{
        ...(fit ? { position: 'relative' } : { position: 'absolute', left: BOARD_LEFT, top }),
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: fit ? 'flex-start' : 'space-between', gap: fit ? gap : undefined, height: fit ? undefined : '100%' }}>{children}</div>
    </div>
  );
  if (!fit) return panel;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 150, height: 1560, display: 'flex', alignItems: 'center', paddingLeft: BOARD_LEFT, pointerEvents: 'none' }}>
      {panel}
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
    <span style={{ fontFamily: FONT_IMPACT, fontSize: size, lineHeight: 1, color, display: 'inline-block', whiteSpace: 'nowrap', transform: `scale(${interpolate(s, [0, 1], [0.72, 1])})`, opacity: interpolate(s, [0, 1], [0, 1]), textShadow: CHALK_SHADOW, filter: 'contrast(1.04)' }}>
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
      <Board gap={34} sp={sp}>
        <BoardHeading text={p.title} tone={CHALK} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
          {cols.map((c, i) => (
            <div key={i} style={{ flex: 1, minHeight: 232, padding: '30px 22px', borderRadius: 6, background: c.hot ? 'rgba(240,106,36,.14)' : 'rgba(0,0,0,.28)', border: `1px solid ${c.hot ? 'rgba(255,139,56,.5)' : 'rgba(198,189,181,.2)'}` }}>
              <WriteIn start={30 + i * 14}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: c.hot ? EMBER_LT : CHALK_DIM, fontWeight: 700 }}>{c.label}</div>
              </WriteIn>
              <div style={{ marginTop: 12 }}>
                <BigChalk text={c.value} start={44 + i * 18} size={82} color={c.hot ? GOLD : CHALK} sp={sp} />
              </div>
              <WriteIn start={58 + i * 16}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 27, color: CHALK_DIM, marginTop: 8 }}>{c.note}</div>
              </WriteIn>
            </div>
          ))}
        </div>
        <div>
          <WriteIn start={150}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 36, color: CHALK, lineHeight: 1.5, textShadow: CHALK_SHADOW }}>{p.subHook}</div>
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
      <Board gap={26} rotate={0.5} sp={sp}>
        <WriteIn start={6}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: CHALK_DIM, fontWeight: 700 }}>{p.topTitle}</div>
        </WriteIn>
        {p.topRows.map((r, i) => (
          <WriteIn key={i} start={26 + i * 16}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: i === 1 ? 'rgba(198,189,181,.95)' : 'rgba(198,189,181,.72)', padding: '12px 0' }}>{r}</div>
          </WriteIn>
        ))}
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${EMBER} 30%, ${EMBER} 70%, transparent)`, margin: '20px 0', opacity: 0.75 }} />
        <WriteIn start={190}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: EMBER_LT, fontWeight: 700 }}>{p.bottomTitle}</div>
        </WriteIn>
        {p.bottomRows.map((r, i) => (
          <WriteIn key={i} start={210 + i * 18}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 33, color: CHALK, padding: '12px 0', textShadow: CHALK_SHADOW }}>{r}</div>
          </WriteIn>
        ))}
        <div style={{ textAlign: 'center' }}>
          <BigChalk text={p.seam} start={370} size={54} color={GOLD} sp={sp} />
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
      <Board gap={28} rotate={0.4} sp={sp}>
        <BoardHeading text={p.head} />
        <div>
          {p.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={44 + i * 24} />
          ))}
        </div>
        <WriteIn start={140}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: EMBER_LT, fontWeight: 700 }}>{p.group.head}</div>
          <ChalkUnderline start={148} width={210} color={EMBER_LT} />
        </WriteIn>
        <div>
          {p.group.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={166 + i * 24} />
          ))}
        </div>
        <div style={{ padding: '20px 26px', borderRadius: 6, background: 'rgba(240,106,36,.10)', border: '1px solid rgba(255,139,56,.38)', textAlign: 'center' }}>
          <WriteIn start={330}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: CHALK_DIM }}>{p.countdown.label}</div>
          </WriteIn>
          <div style={{ marginTop: 2 }}>
            <BigChalk text={cd > 0 ? `00:0${cd}` : p.countdown.unlock} start={340} size={112} color={cd > 0 ? CHALK : GOLD} sp={sp} />
          </div>
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
      <Board gap={26} sp={sp}>
        <BoardHeading text={p.head} />
        <div style={{ marginTop: 10 }}>
          {p.rows.map((r, i) => (
            <RowLine key={r.k} row={r} start={40 + i * 24} />
          ))}
        </div>
        <WriteIn start={104}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: EMBER_LT, fontWeight: 700 }}>{p.band.label}</div>
          <ChalkUnderline start={112} width={190} color={EMBER_LT} />
        </WriteIn>
        <div style={{ display: 'flex', gap: 10, clipPath: `inset(0 ${(1 - grow) * 100}% 0 0)` }}>
          {p.band.weekdays.map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: 'center', padding: '26px 0', borderRadius: 6, fontFamily: FONT_BODY, fontSize: 30, fontWeight: i < p.band.activeCount ? 700 : 500, color: i < p.band.activeCount ? CHALK : 'rgba(198,189,181,.36)', background: i < p.band.activeCount ? 'rgba(240,106,36,.26)' : 'rgba(0,0,0,.45)', border: `1px solid ${i < p.band.activeCount ? 'rgba(255,139,56,.7)' : 'rgba(198,189,181,.14)'}` }}>{d}</div>
          ))}
        </div>
        <WriteIn start={240}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: GOLD }}>{p.band.value}</div>
        </WriteIn>
        {p.note && (
          <WriteIn start={300}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: CHALK_DIM }}>— {p.note}</div>
          </WriteIn>
        )}
      </Board>
    </AbsoluteFill>
  );
};

/* ══ S6 · 顾客侧：开奖 → 卡包 → 核销（手机屏 + 右侧三拍）══ */
const G11Flow: React.FC<SceneRenderProps> = ({ scene, style }) => {
  const p = scene.payload as unknown as FlowPayload;
  const sp = cfgOf(style);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneIn = spring({ frame: f - 8, fps, config: sp, durationInFrames: 26 });
  return (
    <AbsoluteFill>
      <EmberParticles count={18} />
      <Board gap={30} rotate={-0.4} sp={sp}>
        <div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
          {/* 手机卡包屏（本片内联件；不上任何二维码/图形码，只出数字券码） */}
          <div
            style={{
              flex: '0 0 336px',
              width: 336,
              padding: '16px 14px 20px',
              borderRadius: 34,
              border: '11px solid #341d0f',
              background: 'linear-gradient(180deg, #1b1109 0%, #0c0705 100%)',
              boxShadow: 'inset 0 0 34px rgba(0,0,0,.65), 0 16px 38px rgba(0,0,0,.5)',
              transform: `translateY(${(1 - phoneIn) * 26}px)`,
              opacity: interpolate(phoneIn, [0, 1], [0, 1]),
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: 104, height: 9, borderRadius: 6, background: 'rgba(198,189,181,.22)', margin: '0 auto 14px' }} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: CHALK_DIM, fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>{p.phone.statusBar}</div>
            <div style={{ marginTop: 14, padding: '16px 14px', borderRadius: 10, background: 'rgba(240,106,36,.13)', border: '1px solid rgba(255,139,56,.45)' }}>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 30, color: CHALK, fontWeight: 700, textAlign: 'center', textShadow: CHALK_SHADOW }}>{p.phone.couponName}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                <BigChalk text={p.phone.big} start={56} size={118} sp={sp} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 30, color: CHALK_DIM }}>{p.phone.unit}</span>
              </div>
              <WriteIn start={74}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 23, color: GOLD, textAlign: 'center', marginTop: 2 }}>{p.phone.bigLabel}</div>
              </WriteIn>
              <div style={{ marginTop: 12 }}>
                {p.phone.rows.map((r, i) => (
                  <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderTop: i === 0 ? '1px dashed rgba(198,189,181,.22)' : undefined, borderBottom: '1px dashed rgba(198,189,181,.22)' }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: CHALK_DIM }}>{r.k}</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 24, color: CHALK, fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <WriteIn start={150}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: CHALK_DIM }}>{p.phone.codeLabel}</span>
                  <span style={{ fontFamily: FONT_IMPACT, fontSize: 30, color: GOLD, letterSpacing: 2 }}>{p.phone.code}</span>
                </div>
              </WriteIn>
            </div>
          </div>
          {/* 右侧三拍：到点 → 开奖 → 到店用掉 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {p.steps.map((s, i) => {
              const o = interpolate(f, [70 + i * 26, 94 + i * 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={s.title} style={{ opacity: o, transform: `translateX(${(1 - o) * -14}px)`, paddingLeft: 16, borderLeft: `4px solid ${s.kind === 'coupon' ? EMBER_LT : 'rgba(198,189,181,.28)'}` }}>
                  <div style={{ fontFamily: FONT_TITLE, fontSize: 33, color: s.kind === 'coupon' ? GOLD : CHALK, fontWeight: 700, textShadow: CHALK_SHADOW }}>{s.title}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 25, color: CHALK_DIM, marginTop: 4 }}>{s.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
        <WriteIn start={170}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: CHALK_DIM, textAlign: 'center' }}>{p.tailNote}</div>
        </WriteIn>
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
      <Board gap={30} rotate={0} sp={sp}>
        {p.lines.map((l, i) => (
          <div key={i}>
            <WriteIn start={20 + i * 26}>
              <div style={{ fontFamily: FONT_IMPACT, fontSize: 86, color: i === 0 ? CHALK : GOLD, lineHeight: 1.3, textShadow: CHALK_SHADOW }}>{l}</div>
            </WriteIn>
          </div>
        ))}
        <WriteIn start={130}>
          <div style={{ borderTop: '1px dashed rgba(198,189,181,.24)', paddingTop: 18, fontFamily: FONT_BODY, fontSize: 32, color: CHALK, textShadow: CHALK_SHADOW }}>{p.action}</div>
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

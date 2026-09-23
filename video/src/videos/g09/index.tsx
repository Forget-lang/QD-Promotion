// g09 宠物店（洗护美容）· 片1 · 屏组件（一屏一组件，禁止跨行业 import）
// 母题「洗护次卡磁条卡 + 泡泡计数」。背景 = bgImage（蓝绿光斑底 BG-ABS-004，由 VTemplate 的 KenBurnsBg 垫底），
// 本组件 AbsoluteFill 透明、不写 backgroundColor（背景底强制闸门）。
// 视觉语言（与 g08 桌号牌/牌匾/金钉/椒红彻底两套）：磁条次卡卡面（真实产品形态）+ 泡泡=次数计数
//   + 白卡清单（水蓝/薄荷）。图形全抽象几何（圆泡/磁条带/圆角卡）。
// 红线（g08 补29/30/31）：主体元素入场 spring 收敛后停留期静止，禁持续 transform；含文字层禁缩放；
//   无 Drift/PushIn/useVoiceEnergy（已删）。停留期镜头感只由 VTemplate KenBurnsBg 背景缓推承担。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE } from '../../palette';
import type { SceneRenderProps } from '../../types';
import type {
  MakePayload, MakeGroup, MakeRow, HookPayload, PainPayload, ResultPayload, CtaPayload,
} from './types';

// ── 洗护次卡配色（叠在蓝绿光斑底上；磁条卡为高对比承载）──
const TEAL_D = '#12495f';    // 磁条卡深端（深海蓝）
const TEAL_L = '#2f9e8a';    // 磁条卡浅端（墨玉绿）
const STRIPE = '#0b2b38';    // 磁条带
const AQUA = '#1E88E5';      // 水蓝（deep-blue accent）
const MINT = '#2FBF9E';      // 薄荷
const MINT_BG = '#E7F7F1';   // hero 行浅薄荷底
const INK = '#12333f';       // 深蓝墨字
const PAPER = 'rgba(255,255,255,0.95)'; // 制作清单白卡底
const MUTE = 'rgba(255,255,255,0.85)';  // 卡面小字

// ── 单个泡泡（一次到店 = 一个泡泡）：上浮吹出，收敛后静止 ──
// state: 'on'=剩余（亮薄荷水珠）/ 'used'=已核销（变暗带勾）
const Bubble: React.FC<{ delay: number; state?: 'on' | 'used'; size?: number }> = ({ delay, state = 'on', size = 62 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 14, stiffness: 160 } });
  if (f < delay) return null;
  const used = state === 'used';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      border: used ? '3px solid rgba(255,255,255,0.35)' : `3px solid ${state === 'on' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}`,
      background: used
        ? 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.28), rgba(120,150,150,0.18) 70%)'
        : 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.98), rgba(178,236,220,0.6) 52%, rgba(120,200,180,0.28))',
      boxShadow: used ? 'none' : 'inset 0 -8px 14px rgba(18,73,95,0.16), 0 4px 12px rgba(255,255,255,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT_TITLE, fontSize: size * 0.5, color: 'rgba(255,255,255,0.85)',
      transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.2, 1])})`,
      opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    }}>{used ? '✓' : ''}</div>
  );
};

// ── 间隔胶囊（制券②：泡泡之间的节奏标注）──
const GapPill: React.FC<{ delay: number; text: string }> = ({ delay, text }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (f < delay) return null;
  return (
    <span style={{
      flexShrink: 0, fontFamily: FONT_TITLE, fontSize: 22, color: '#fff', letterSpacing: 0.5,
      background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.5)',
      borderRadius: 999, padding: '3px 12px', opacity: p,
    }}>{text}</span>
  );
};

// ── 磁条次卡卡面（本片主载体，可复用：钩子屏带已用态、制券②带间隔胶囊）──
const CardFace: React.FC<{
  cardName: string; category?: string; times: number; usedTimes?: number;
  validLabel: string; intervalHint?: string; baseDelay?: number;
}> = ({ cardName, category = '洗护次卡', times, usedTimes = 0, validLabel, intervalHint, baseDelay = 6 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - baseDelay, fps: FPS, config: { damping: 15, stiffness: 150 } });
  const bubbleSize = intervalHint ? 48 : 62;
  const bubbleDelay0 = baseDelay + 34;
  return (
    <div style={{
      transform: `scale(${interpolate(s, [0, 1], [1.06, 1])})`,
      opacity: interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      <div style={{
        position: 'relative', borderRadius: 30, overflow: 'hidden',
        background: `linear-gradient(140deg, ${TEAL_D}, ${TEAL_L})`,
        boxShadow: '0 26px 54px rgba(18,73,95,0.42), inset 0 1px 0 rgba(255,255,255,0.25)',
        border: '1px solid rgba(255,255,255,0.28)',
      }}>
        {/* 卡顶流光：白光沿卡顶边巡走（停留期镜头感两件套之一，g08 补31 同款机制、水感配色；只动装饰层不压文字） */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, left: ((f * 6) % 1800) - 300, width: 220, height: 60, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent)', transform: 'rotate(6deg)' }} />
        </div>
        <div style={{ height: 62, background: STRIPE, marginTop: 30 }} />
        <div style={{ padding: '30px 44px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONT_TITLE, fontSize: 64, color: '#fff', letterSpacing: 3, textShadow: '0 2px 3px rgba(0,0,0,0.28)' }}>{cardName}</span>
            <span style={{ fontFamily: FONT_TITLE, fontSize: 28, color: MUTE, letterSpacing: 2 }}>{category}</span>
          </div>
          {/* 泡泡计数（= 次数）；intervalHint 时在相邻泡泡间插节奏胶囊 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: intervalHint ? 10 : 16, marginTop: 34, flexWrap: 'nowrap' }}>
            {Array.from({ length: times }).flatMap((_, i) => {
              const nodes = [
                <Bubble key={`b${i}`} delay={bubbleDelay0 + i * 7} state={i < usedTimes ? 'used' : 'on'} size={bubbleSize} />,
              ];
              if (intervalHint && i < times - 1) nodes.push(<GapPill key={`g${i}`} delay={bubbleDelay0 + 40 + i * 6} text={intervalHint} />);
              return nodes;
            })}
            {!intervalHint && <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: 40, color: '#fff', letterSpacing: 1 }}>× {times} 次</span>}
          </div>
          <div style={{ marginTop: 30, fontSize: 26, color: MUTE, letterSpacing: 1 }}>{validLabel}</div>
        </div>
      </div>
    </div>
  );
};

// ── 手机表单风零件（复刻真实次卡创建页：值进输入框、开关用真 toggle、分区标签左对齐小灰）──
// 与 g08"顶部牌匾 + 大圆角号牌卡装竖排清单"彻底不同：这里是一张铺在背景上、直接填的表单。

// 开关药丸（开=薄荷、关=灰）——复刻 t-switch
const TogglePill: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 88, height: 50, borderRadius: 999, background: on ? MINT : 'rgba(18,73,95,0.18)', position: 'relative', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)' }}>
    <div style={{ position: 'absolute', top: 5, left: on ? 43 : 5, width: 40, height: 40, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
  </div>
);

// 输入框值胶囊——值放进圆角框（复刻 t-input 的取值态），hero 薄荷描边
const InputPill: React.FC<{ text: string; hero?: boolean; wide?: boolean }> = ({ text, hero, wide }) => (
  <div style={{
    minWidth: wide ? 320 : 150, textAlign: 'right',
    background: hero ? MINT_BG : 'rgba(255,255,255,0.85)',
    border: `2.5px solid ${hero ? MINT : 'rgba(18,73,95,0.18)'}`,
    borderRadius: 12, padding: '10px 22px',
    fontFamily: FONT_TITLE, fontSize: 33, color: hero ? TEAL_L : INK, letterSpacing: 0.5,
    boxShadow: '0 3px 10px rgba(18,73,95,0.08)',
  }}>{text}</div>
);

// 表单行：字段名左 + 输入框/开关右（值=开/关 时渲染 toggle；hero 薄荷框 + 重点 chip）
const FormRow: React.FC<{ row: MakeRow; delay: number }> = ({ row, delay }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 16, stiffness: 190 } });
  if (f < delay) return null;
  const { k, v, hero, tag, indent } = row;
  const isSwitch = v === '开' || v === '关';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '22px 6px',
      borderBottom: '2px solid rgba(18,73,95,0.09)',
      opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateY(${interpolate(s, [0, 1], [12, 0])}px)`,
    }}>
      <span style={{ fontSize: 30, fontWeight: 600, color: INK, letterSpacing: 1, paddingLeft: indent ? 20 : 0 }}>{k}</span>
      {tag && <span style={{ fontSize: 19, color: hero ? '#fff' : AQUA, background: hero ? MINT : 'transparent', border: hero ? 'none' : `2px solid ${AQUA}`, borderRadius: 999, padding: '2px 12px', fontWeight: 700 }}>{tag}</span>}
      <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
        {isSwitch ? <TogglePill on={v === '开'} /> : <InputPill text={v} hero={hero} wide={v.length > 6} />}
      </span>
    </div>
  );
};

// 分区标签：左对齐小灰绿标题（表单分区，非 g08 居中分隔线组头）
const FormSection: React.FC<{ head: string; delay: number }> = ({ head, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (f < delay) return null;
  return (
    <div style={{ marginTop: 30, marginBottom: 2, opacity: p }}>
      <span style={{ fontSize: 24, color: TEAL_L, letterSpacing: 2, fontWeight: 700 }}>{head}</span>
    </div>
  );
};

// 核销节奏条（制券②：把"间隔 14 天"画成第 1→第 5 次的到店节奏）
const RhythmStrip: React.FC<{ hint: string; delay: number }> = ({ hint, delay }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dots = [1, 2, 3, 4, 5];
  return (
    <div style={{ marginTop: 22, background: MINT_BG, borderRadius: 16, padding: '18px 22px', opacity: p, boxShadow: 'inset 0 0 0 2px rgba(47,191,158,0.25)' }}>
      <div style={{ fontSize: 22, color: TEAL_D, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>到店节奏 · 打开核销间隔后</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {dots.map((n, i) => (
          <React.Fragment key={n}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: TEAL_L, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_TITLE, fontSize: 22, flexShrink: 0 }}>{n}</div>
            {i < dots.length - 1 && <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: TEAL_D, fontWeight: 600 }}>·{hint}·</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ── 底层光晕漂移（SKILL 第5步"底层持续微动"sanctioned 项；只动氛围层，不动主体/文字；帧驱动确定性）──
const AmbientGlow: React.FC = () => {
  const f = useCurrentFrame();
  const x1 = 150 + Math.sin(f / 45) * 140;
  const y1 = 1180 + Math.cos(f / 38) * 90;
  const x2 = 760 + Math.cos(f / 55) * 120;
  const y2 = 1480 + Math.sin(f / 42) * 100;
  const x3 = 430 + Math.sin(f / 58 + 2) * 100;
  const y3 = 880 + Math.cos(f / 50 + 1) * 80;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x1, top: y1, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,191,158,0.16), transparent 70%)' }} />
      <div style={{ position: 'absolute', left: x2, top: y2, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)' }} />
      <div style={{ position: 'absolute', left: x3, top: y3, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,200,235,0.16), transparent 70%)' }} />
    </AbsoluteFill>
  );
};

// ── 顶部合规角标（各屏共用，固定不动，C-11 挂顶部）──
const Badge: React.FC<{ text?: string }> = ({ text }) =>
  text ? <div style={{ position: 'absolute', right: 84, top: 92, fontSize: 22, color: TEAL_L, border: `2px solid ${MINT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3, background: 'rgba(255,255,255,0.6)' }}>{text}</div> : null;

// ── 制券屏（S3/S4/S5 复用）：手机表单风（复刻次卡创建页，与 g08 卡片清单彻底不同）──
const G09Make: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const f = useCurrentFrame();
  const nav = spring({ frame: f - 4, fps: FPS, config: { damping: 15, stiffness: 150 } });
  let d = 60;
  const groupDelays = p.groups.map((g) => {
    const head = d; d += 14;
    const rows = g.rows.map(() => { const r = d; d += 12; return r; });
    return { head, rows };
  });
  const rhythmDelay = d + 8;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <Badge text={p.badge} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 150, bottom: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* 表单导航标题行（仿小程序页标题；C-10 不画返回键/状态栏） */}
        <div style={{ opacity: interpolate(nav, [0, 1], [0, 1]), transform: `translateY(${interpolate(nav, [0, 1], [14, 0])}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: FONT_TITLE, fontSize: 44, color: INK, letterSpacing: 1 }}>{p.title}</span>
            <span style={{ marginLeft: 'auto', fontSize: 22, color: TEAL_L, border: `2px solid ${MINT}`, borderRadius: 999, padding: '4px 18px', fontWeight: 700 }}>次卡</span>
          </div>
          <div style={{ fontSize: 25, color: TEAL_D, marginTop: 8, letterSpacing: 0.5 }}>{p.sub}</div>
          <div style={{ height: 2, background: 'rgba(18,73,95,0.12)', marginTop: 18 }} />
        </div>
        {/* 表单分区 + 行 */}
        <div>
          {p.groups.map((g, gi) => (
            <React.Fragment key={g.head}>
              <FormSection head={g.head} delay={groupDelays[gi].head} />
              {g.rows.map((row, ri) => <FormRow key={row.k} row={row} delay={groupDelays[gi].rows[ri]} />)}
            </React.Fragment>
          ))}
        </div>
        {p.intervalHint && <RhythmStrip hint={p.intervalHint} delay={rhythmDelay} />}
      </div>
    </AbsoluteFill>
  );
};

// ── S1 钩子屏：痛点大字压在磁条卡界面上（C-05 同格）──
const G09Hook: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const f = useCurrentFrame();
  const t = spring({ frame: f - 4, fps: FPS, config: { damping: 15, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <Badge text={p.badge} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* 痛点钩子大字 */}
        <div style={{ opacity: interpolate(t, [0, 1], [0, 1]), transform: `translateY(${interpolate(t, [0, 1], [20, 0])}px)` }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 74, color: INK, letterSpacing: 3, lineHeight: 1.28, textShadow: '0 2px 8px rgba(255,255,255,0.5)' }}>{p.title}</div>
          <div style={{ marginTop: 22, fontSize: 34, color: TEAL_D, letterSpacing: 1, fontWeight: 600 }}>{p.sub}</div>
        </div>
        {/* 磁条卡（部分泡泡已用变暗 = 还剩几次） */}
        <div style={{ marginTop: 46, position: 'relative' }}>
          <CardFace cardName={p.cardName} times={p.times} usedTimes={p.usedTimes} validLabel={`已用 ${p.usedTimes} 次 · 剩余次数客人自己看得见`} baseDelay={40} />
          <div style={{ position: 'absolute', right: 30, top: -18, fontFamily: FONT_TITLE, fontSize: 30, color: '#fff', background: MINT, borderRadius: 999, padding: '8px 22px', letterSpacing: 1, boxShadow: '0 8px 20px rgba(47,191,158,0.5)' }}>{p.remainLabel}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 痛点屏：客户流失时间轴（flow，非 g08 编号对照清单）──
const G09Pain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as PainPayload;
  const f = useCurrentFrame();
  const h = spring({ frame: f - 4, fps: FPS, config: { damping: 15, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <Badge text={p.badge} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ opacity: interpolate(h, [0, 1], [0, 1]), transform: `translateY(${interpolate(h, [0, 1], [18, 0])}px)` }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 58, color: INK, letterSpacing: 2 }}>{p.title}</div>
          <div style={{ marginTop: 12, fontSize: 29, color: TEAL_D, letterSpacing: 1, fontWeight: 600 }}>{p.sub}</div>
        </div>
        {/* 时间轴：一条竖脊 + 逐节点，末节点（流失）变灰带 ✗ */}
        <div style={{ marginTop: 40, position: 'relative', paddingLeft: 8 }}>
          <div style={{ position: 'absolute', left: 30, top: 24, bottom: 24, width: 4, borderRadius: 2, background: 'rgba(18,73,95,0.16)' }} />
          {p.nodes.map((n, i) => {
            const d = 110 + i * 30;
            const s = spring({ frame: f - d, fps: FPS, config: { damping: 15, stiffness: 160 } });
            if (f < d) return null;
            return (
              <div key={n.text} style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: i === 0 ? 0 : 26, opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateX(${interpolate(s, [0, 1], [-16, 0])}px)` }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: n.lost ? 'rgba(18,73,95,0.14)' : TEAL_L, color: '#fff', fontFamily: FONT_TITLE, fontSize: 26, border: '4px solid rgba(255,255,255,0.9)', boxShadow: n.lost ? 'none' : '0 6px 16px rgba(47,158,138,0.4)' }}>{n.lost ? '✗' : i + 1}</div>
                <div style={{ flex: 1, background: n.lost ? 'rgba(255,255,255,0.55)' : PAPER, borderRadius: 16, padding: '18px 24px', border: n.lost ? '2px dashed rgba(18,73,95,0.25)' : '2px solid rgba(47,158,138,0.22)', boxShadow: n.lost ? 'none' : '0 10px 24px rgba(18,73,95,0.12)' }}>
                  <span style={{ fontFamily: FONT_TITLE, fontSize: 24, color: n.lost ? 'rgba(18,51,63,0.55)' : AQUA, letterSpacing: 1 }}>{n.time}</span>
                  <span style={{ fontSize: 30, color: n.lost ? 'rgba(18,51,63,0.6)' : INK, fontWeight: 700, letterSpacing: 0.5, marginLeft: 16 }}>{n.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 结果屏：磁条卡特写 + 核销流水（hero-object，非 g08 两栏）──
const G09Result: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ResultPayload;
  const f = useCurrentFrame();
  const h = spring({ frame: f - 4, fps: FPS, config: { damping: 15, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <Badge text={p.badge} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: interpolate(h, [0, 1], [0, 1]), transform: `translateY(${interpolate(h, [0, 1], [18, 0])}px)` }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 52, color: INK, letterSpacing: 2 }}>{p.title}</div>
          <div style={{ marginTop: 8, fontSize: 26, color: TEAL_D, letterSpacing: 1, fontWeight: 600 }}>{p.sub}</div>
        </div>
        {/* 主实物：磁条次卡特写（3 已用变暗、剩 2 次） */}
        <div style={{ marginTop: 34, position: 'relative' }}>
          <CardFace cardName={p.cardName} times={p.times} usedTimes={p.usedTimes} validLabel="客人打开卡包 · 看得见还剩几次" baseDelay={40} />
          <div style={{ position: 'absolute', right: 30, top: -16, fontFamily: FONT_TITLE, fontSize: 28, color: '#fff', background: MINT, borderRadius: 999, padding: '7px 20px', letterSpacing: 1, boxShadow: '0 8px 20px rgba(47,191,158,0.5)' }}>{p.remainLabel}</div>
        </div>
        {/* 核销流水：第 X 次 + 日期（间隔 14 天）+ 状态 */}
        <div style={{ marginTop: 28, background: PAPER, borderRadius: 20, padding: '18px 30px 22px', boxShadow: '0 18px 40px rgba(18,73,95,0.16), inset 0 0 0 2px rgba(47,158,138,0.28)' }}>
          <div style={{ fontSize: 24, color: TEAL_L, letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>核销记录 · 你后台看得见</div>
          {p.log.map((r, i) => {
            const d = 150 + i * 16;
            const s = spring({ frame: f - d, fps: FPS, config: { damping: 16, stiffness: 180 } });
            if (f < d) return null;
            return (
              <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: i < p.log.length - 1 ? '2px solid rgba(18,73,95,0.08)' : 'none', opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.done ? MINT : 'transparent', border: r.done ? 'none' : '2.5px solid rgba(18,73,95,0.25)', color: r.done ? '#fff' : TEAL_D, fontFamily: FONT_TITLE, fontSize: 22 }}>{r.done ? '✓' : r.n}</span>
                <span style={{ fontSize: 28, color: INK, fontWeight: 700 }}>第 {r.n} 次</span>
                <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: 26, color: r.done ? TEAL_L : 'rgba(18,51,63,0.45)' }}>{r.done ? r.date : '待用'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S7 收尾屏：5 个泡泡逐一点亮成"接下来五次" + 品牌（hero-focus，非 g08 主张+落章）──
const G09Cta: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  const f = useCurrentFrame();
  const line = spring({ frame: f - 6, fps: FPS, config: { damping: 15, stiffness: 150 } });
  const brand = spring({ frame: f - 70, fps: FPS, config: { damping: 14, stiffness: 170 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <AmbientGlow />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* 主张（"五次"由下面一排点亮的泡泡呼应） */}
        <div style={{ textAlign: 'center', opacity: interpolate(line, [0, 1], [0, 1]), transform: `translateY(${interpolate(line, [0, 1], [22, 0])}px)` }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 62, color: INK, letterSpacing: 3, lineHeight: 1.35, textShadow: '0 2px 10px rgba(255,255,255,0.55)' }}>{p.line}</div>
        </div>
        {/* 一排泡泡逐一点亮 = 接下来五次（入场上浮后静止） */}
        <div style={{ display: 'flex', gap: 26, marginTop: 56 }}>
          {Array.from({ length: p.times }).map((_, i) => (
            <Bubble key={i} delay={34 + i * 12} state="on" size={82} />
          ))}
        </div>
        {/* 品牌胶囊 */}
        <div style={{ marginTop: 66, opacity: interpolate(brand, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }), transform: `scale(${interpolate(brand, [0, 1], [1.08, 1])})` }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 54, color: '#fff', letterSpacing: 9, background: `linear-gradient(140deg, ${TEAL_D}, ${TEAL_L})`, borderRadius: 16, padding: '20px 44px', boxShadow: '0 16px 36px rgba(18,73,95,0.4)' }}>{p.brand}</div>
        </div>
        <div style={{ marginTop: 26, textAlign: 'center', fontSize: 28, color: TEAL_D, letterSpacing: 3, fontWeight: 600 }}>{p.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 注册表 ──
export const G09_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g09-hook': G09Hook,
  'g09-pain': G09Pain,
  'g09-make': G09Make,
  'g09-result': G09Result,
  'g09-cta': G09Cta,
};

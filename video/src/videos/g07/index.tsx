// g07 咖啡茶饮 · 片1 · 九屏（一屏一组件，禁止跨行业 import）
// 母题「咖啡馆菜单板」——2026-09-03 推翻 v1（点单小票太像教培 g06）。五轴全反 g06：
//   底色 深浓缩咖啡（非浅底漂浮卡）/ 容器 平铺分栏无投影（非白色圆角卡）/ 标题 得意黑招牌+金色眉标题（非方圆体+胶囊）/
//   表单行 菜单「名称 …… 价格」点线引导（非左标签右数值+虚线下划线）/ 强调 暖金（非红）/ 入场 逐行淡起+点线写出
// 屏序与分镜见 outputs/g07-咖啡茶饮/07-片1-分镜稿.md。数据/字段/口播不动，本文件只承载呈现骨架。
// 骨架全部内联本文件；跨屏只复用 ../../components/{animations,ui} 与 ../../palette。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import { Ico } from '../../components/icons';
import type { SceneRenderProps, SubtitleLine } from '../../types';
import type {
  HookPayload, PainPayload, MakePayload, MechPayload, IssuePayload,
  ChainPayload, StepsPayload, LedgerPayload, CtaPayload,
} from './types';

// ── 菜单板色板 ──
const BG = '#241812';
const BG2 = '#2f2016';
const CREAM = '#F3E9D8';
const GOLD = '#D9A441';
const MUTED = '#B79A78';
const FAINT = '#8a7355';
const LEADER = 'rgba(243,233,216,0.22)';
const RULE = 'rgba(217,164,65,0.45)';
const TINT = 'rgba(217,164,65,0.10)';

// ── 节拍：口播句 → 区域 ──
const useBeat = (subs?: SubtitleLine[]): number => {
  const f = useCurrentFrame();
  if (!subs || subs.length === 0) return -1;
  let a = -1;
  subs.forEach((s, i) => { if (f >= s.startFrame) a = i; });
  return a;
};
const useBeatFrame = (subs?: SubtitleLine[]) => (i: number) => subs?.[i]?.startFrame ?? 8;
const region = (beat: number, from: number, to: number) => ({
  opacity: beat < 0 ? 0.95 : beat < from ? 0.9 : beat <= to ? 1 : 0.72,
  active: beat >= from && beat <= to,
});

// ── 母题零件 ──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.06 + (Math.sin(f / 70) * 0.5 + 0.5) * 0.05;
  const sx = Math.sin(f / 90) * 10;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${BG2} 0%, ${BG} 70%)` }} />
      <div style={{ position: 'absolute', left: 120 + sx, top: 120, width: 840, height: 520, borderRadius: '50%', background: `radial-gradient(circle, rgba(217,164,65,${o}) 0%, transparent 68%)`, pointerEvents: 'none' }} />
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${470 + i * 70} 1760 q 26 -60 0 -120 q -26 -60 0 -120`} stroke={GOLD} strokeWidth="3" fill="none" strokeLinecap="round" />
        ))}
      </svg>
    </>
  );
};

/** 逐行淡起 + 上移（菜单行入场，区别 g06 的递交/打印擦入） */
const MenuRow: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style }}>{children}</div>;
};

/** 招牌标题：金色眉标题 + 得意黑主标题（可两行，第二行金下划线）+ 副行 */
const Sign: React.FC<{ eyebrow: string; l1: string; l2?: string; sub?: string; delay?: number }> = ({ eyebrow, l1, l2, sub, delay = 4 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const ul = interpolate(f - delay - 10, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 84, right: 84, top: 150, opacity: p }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 32, height: 32, display: 'inline-block' }}>{Ico.cup(GOLD)}</span>
        <span style={{ fontSize: 25, color: GOLD, letterSpacing: 6, fontWeight: 700 }}>{eyebrow}</span>
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT_TITLE, fontSize: 82, color: CREAM, letterSpacing: 3, lineHeight: 1.12 }}>
        {l1}
        {l2 && (
          <span style={{ position: 'relative', display: 'inline-block', marginLeft: 4 }}>
            {l2}
            <span style={{ position: 'absolute', left: 0, bottom: -8, width: `${ul * 100}%`, height: 5, background: GOLD, borderRadius: 3 }} />
          </span>
        )}
      </div>
      {sub && <div style={{ marginTop: 22, fontSize: 27, color: MUTED, letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};

/** 分栏抬头：金色编号 + 奶油名 + 金线 */
const SectionHead: React.FC<{ no: string; name: string; delay: number }> = ({ no, name, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <MenuRow delay={delay}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 38 }}>
        <span style={{ fontSize: 26, color: GOLD, fontFamily: FONT_TITLE }}>{no}</span>
        <span style={{ fontSize: 33, color: CREAM, fontWeight: 700, letterSpacing: 3 }}>{name}</span>
        <span style={{ flex: 1, height: 1.5, background: RULE, transform: `scaleX(${p})`, transformOrigin: 'left' }} />
      </div>
    </MenuRow>
  );
};

/** 菜单行：名称 …… 价格（点线引导）；hero=分水岭整行点亮；muted=弱化 */
const MenuLine: React.FC<{ name: string; value: string; delay: number; active?: boolean; hero?: boolean; muted?: boolean; tag?: string; sub?: string }> = ({ name, value, delay, active, hero, muted, tag, sub }) => {
  const f = useCurrentFrame();
  const lead = interpolate(f - delay - 6, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  if (f < delay) return null;
  return (
    <MenuRow delay={delay}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 18, padding: hero ? '20px 22px' : '16px 6px',
        background: hero ? TINT : 'transparent', borderRadius: 12,
        borderLeft: hero ? `5px solid ${GOLD}` : `5px solid ${active ? 'rgba(217,164,65,0.45)' : 'transparent'}`,
      }}>
        <span style={{ fontSize: hero ? 34 : 31, color: hero ? GOLD : muted ? MUTED : CREAM, fontWeight: hero ? 700 : 500, letterSpacing: 1, flexShrink: 0 }}>{name}</span>
        {tag && <span style={{ fontSize: 21, color: BG, background: GOLD, borderRadius: 6, padding: '3px 12px', letterSpacing: 1, fontWeight: 700, flexShrink: 0 }}>{tag}</span>}
        <span style={{ flex: 1, minWidth: 30, borderBottom: `2px dotted ${LEADER}`, transform: `scaleX(${lead})`, transformOrigin: 'left', height: 2, marginBottom: 8 }} />
        <span style={{ fontSize: hero ? 40 : 34, color: hero ? GOLD : muted ? MUTED : CREAM, fontWeight: 700, flexShrink: 0, letterSpacing: 1 }}>{value}</span>
      </div>
      {sub && <div style={{ fontSize: 23, color: FAINT, textAlign: 'right', padding: '2px 10px 0 0', letterSpacing: 1 }}>{sub}</div>}
    </MenuRow>
  );
};

/** 要点行（列表项，圆点 + 文本） */
const Item: React.FC<{ text: string; delay: number; tone?: 'cream' | 'muted' | 'gold' }> = ({ text, delay, tone = 'cream' }) => {
  const color = tone === 'muted' ? MUTED : tone === 'gold' ? GOLD : CREAM;
  return (
    <MenuRow delay={delay}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: tone === 'muted' ? MUTED : GOLD, flexShrink: 0 }} />
        <span style={{ fontSize: 30, color, fontWeight: tone === 'muted' ? 400 : 600, lineHeight: 1.4 }}>{text}</span>
      </div>
    </MenuRow>
  );
};

/** 老板注意卡（平铺金框，非漂浮白卡） */
const Note: React.FC<{ delay: number; children: React.ReactNode; label?: string }> = ({ delay, children, label = '老板注意' }) => (
  <MenuRow delay={delay} style={{ marginTop: 44 }}>
    <div style={{ border: `1.5px solid ${RULE}`, borderRadius: 16, padding: '28px 34px', background: 'rgba(217,164,65,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 26, height: 26, display: 'inline-block' }}>{Ico.cup(GOLD)}</span>
        <span style={{ fontSize: 24, color: GOLD, letterSpacing: 3, fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ fontSize: 31, color: CREAM, lineHeight: 1.5 }}>{children}</div>
    </div>
  </MenuRow>
);

const G = (t: string) => <span style={{ color: GOLD, fontWeight: 700 }}>{t}</span>;

// ── S1 钩子 ──
const S1Hook: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title1} l2={p.title2} sub={p.sub} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 560, opacity: region(beat, 0, 1).opacity }}>
        <div style={{ border: `1.5px solid ${RULE}`, borderRadius: 16, padding: '34px 40px', background: 'rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 26, color: FAINT, letterSpacing: 2 }}>{p.ticketName}</span>
            <span style={{ fontSize: 24, color: BG, background: MUTED, borderRadius: 999, padding: '8px 24px', letterSpacing: 2 }}>{p.ticketBadge}</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span style={{ fontSize: 40, color: MUTED, fontWeight: 700 }}>{p.ticketLine}</span>
            <span style={{ flex: 1, borderBottom: `2px dotted ${LEADER}`, height: 2, marginBottom: 10 }} />
            <span style={{ fontSize: 28, color: FAINT }}>白拿一杯 · 喝完就走</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 900 }}>
        <Note delay={150} label="问题出在哪">不在发不发券，在{G('门槛')}那一栏——先别怪客人</Note>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 痛点 ──
const S2Pain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as PainPayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title1} l2={p.title2} />
      <div style={{ position: 'absolute', left: 84, top: 500, width: 500, opacity: region(beat, 0, 1).opacity }}>
        <div style={{ border: `1.5px solid ${RULE}`, borderRadius: 16, padding: '32px 36px', background: 'rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 24, color: FAINT, letterSpacing: 2 }}>{p.ticketName}</span>
            <span style={{ fontSize: 23, color: BG, background: MUTED, borderRadius: 999, padding: '7px 22px', letterSpacing: 2 }}>{p.ticketBadge}</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 44, color: MUTED, fontWeight: 700 }}>{p.ticketTitle}</div>
          {p.ticketLines.map((l, i) => (
            <div key={l} style={{ marginTop: i === 0 ? 22 : 12, fontSize: 28, color: FAINT, borderTop: i === 0 ? `1.5px dashed ${LEADER}` : 'none', paddingTop: i === 0 ? 18 : 0 }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 84, top: 540, width: 380 }}>
        {p.quotes.map((q, i) => (
          <MenuRow key={q.t1} delay={60 + i * 26} style={{ marginBottom: 70, opacity: region(beat, 0, 1).opacity }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: CREAM }}>{q.t1}</div>
            <div style={{ fontSize: 29, color: MUTED, marginTop: 6 }}>{q.t2}</div>
            <div style={{ width: 60, height: 4, background: GOLD, marginTop: 12, borderRadius: 2 }} />
          </MenuRow>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1180 }}>
        <Note delay={150} label="一句话">无门槛是{G('请客')}，设了门槛才是{G('做生意')}</Note>
      </div>
    </AbsoluteFill>
  );
};

// ── S3 制券·券面+期限（★一屏标杆：菜单点线行 + 老板注意）──
const S3MakeBasic: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const beat = useBeat(scene.subtitles);
  const bf = useBeatFrame(scene.subtitles);
  // 行（跨组拉平）→ 口播句：名称1 门槛2 面额3 数量3 有效期类型4 有效期4
  const rowBeat = [1, 2, 3, 3, 4, 4];
  const cardTop = (gi: number) => p.groups.slice(0, gi).reduce((n, g) => n + g.rows.length, 0);
  const clean = (h: string) => h.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '');
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow="券到咖啡 · 今日出券" l1={p.navTitle} sub={p.crumb} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 470 }}>
        {p.groups.map((g, gi) => (
          <div key={g.head}>
            <SectionHead no={gi === 0 ? '01' : '02'} name={clean(g.head)} delay={bf(rowBeat[cardTop(gi)]) - 6} />
            <div style={{ marginTop: 12 }}>
              {g.rows.map((row, i) => {
                const b = rowBeat[cardTop(gi) + i];
                return <MenuLine key={row.k} name={row.k} value={row.v} delay={bf(b) + 4} active={beat === b} hero={row.hero} tag={row.tag} sub={row.hint} />;
              })}
            </div>
          </div>
        ))}
        {p.callout && (
          <Note delay={bf(2) + 30} label="老板注意">门槛填 {G('0')} 是白送引流，设成客单价 {G('满 35')} 才是来了就得消费一次</Note>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── S4 机制·门槛对比（两栏菜单）──
const S4Mech: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MechPayload;
  const beat = useBeat(scene.subtitles);
  const left = region(beat, 1, 1);
  const right = region(beat, 2, 2);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title1} l2={p.title2} sub={p.sub} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 500, display: 'flex', gap: 30 }}>
        <div style={{ flex: 1, opacity: Math.min(left.opacity + 0.05, 1) }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: MUTED, borderBottom: `2px solid ${LEADER}`, paddingBottom: 14 }}>{p.leftHead}</div>
          {p.leftItems.map((it, i) => <Item key={it} text={it} delay={40 + i * 12} tone="muted" />)}
          <div style={{ marginTop: 24, border: `1.5px dashed rgba(183,154,120,0.5)`, borderRadius: 14, padding: '20px 24px', fontSize: 26, color: MUTED, lineHeight: 1.5 }}>{p.leftNote}</div>
        </div>
        <div style={{ width: 2, background: RULE }} />
        <div style={{ flex: 1, opacity: Math.min(right.opacity + 0.05, 1) }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: GOLD, borderBottom: `2px solid ${GOLD}`, paddingBottom: 14 }}>{p.rightHead}</div>
          {p.rightItems.map((it, i) => <Item key={it} text={it} delay={70 + i * 12} tone="cream" />)}
          <div style={{ marginTop: 24, background: TINT, borderLeft: `5px solid ${GOLD}`, borderRadius: 14, padding: '20px 24px', fontSize: 26, color: CREAM, lineHeight: 1.5 }}>{p.rightNote}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1340, opacity: region(beat, 3, 3).opacity }}>
        <MenuRow delay={150}>
          <div style={{ background: GOLD, borderRadius: 14, padding: '26px 40px', fontFamily: FONT_TITLE, fontSize: 38, color: BG, textAlign: 'center', letterSpacing: 2 }}>{p.punch}</div>
        </MenuRow>
      </div>
    </AbsoluteFill>
  );
};

// ── S5 发放方式·选择 ──
const S5Issue: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as IssuePayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title} sub={p.sub} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 500, opacity: region(beat, 0, 1).opacity }}>
        <div style={{ border: `2px solid ${GOLD}`, borderRadius: 16, padding: '34px 40px', background: TINT }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 44, height: 44, display: 'inline-block' }}>{Ico.check(GOLD)}</span>
            <span style={{ fontFamily: FONT_TITLE, fontSize: 50, color: GOLD }}>{p.pickHead}</span>
            <span style={{ marginLeft: 'auto', fontSize: 24, color: BG, background: GOLD, borderRadius: 999, padding: '8px 22px', letterSpacing: 2 }}>这张选它</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 29, color: CREAM }}>{p.pickDesc}</div>
          {p.pickPoints.map((pt, i) => <Item key={pt} text={pt} delay={40 + i * 12} tone="cream" />)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1000, opacity: region(beat, 0, 1).opacity * 0.85 }}>
        <div style={{ border: `1.5px solid ${LEADER}`, borderRadius: 14, padding: '26px 36px', display: 'flex', alignItems: 'center', gap: 18, opacity: 0.7 }}>
          <span style={{ fontFamily: FONT_TITLE, fontSize: 38, color: MUTED }}>{p.otherHead}</span>
          <span style={{ fontSize: 26, color: FAINT, marginLeft: 'auto' }}>{p.otherDesc}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1200 }}>
        <Note delay={130} label="发出去">公开领取：把券存成海报贴门口，{G('谁看到都能领')}</Note>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 复购链（纵向编号菜单）──
const S6Chain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ChainPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const line = interpolate(f, [24, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title} sub={p.sub} />
      <div style={{ position: 'absolute', left: 128, top: 520, width: 3, height: 900 * line, background: `linear-gradient(${GOLD}, ${MUTED})`, borderRadius: 2 }} />
      {p.nodes.map((n, i) => {
        const r = region(beat, i, i);
        const s = spring({ frame: f - 26 - i * 20, fps: FPS, config: { damping: 19, stiffness: 160 } });
        return (
          <div key={n.head} style={{ position: 'absolute', left: 84, right: 84, top: 500 + i * 320, opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })), transform: `translateY(${(1 - s) * 40}px)` }}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 2 ? GOLD : 'transparent', border: i === 2 ? 'none' : `2px solid ${GOLD}` }}>
                <span style={{ fontFamily: FONT_TITLE, fontSize: 44, color: i === 2 ? BG : GOLD }}>{`0${i + 1}`}</span>
              </div>
              <div style={{ flex: 1, borderBottom: `1.5px dashed ${LEADER}`, paddingBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 38, fontWeight: 700, color: i === 2 ? GOLD : CREAM }}>{n.head}</span>
                  {n.reward && <span style={{ fontSize: 22, color: BG, background: GOLD, borderRadius: 6, padding: '3px 12px', letterSpacing: 1, fontWeight: 700 }}>奖</span>}
                </div>
                <div style={{ fontSize: 29, color: MUTED, marginTop: 10, lineHeight: 1.5 }}>{n.desc}</div>
                {n.note && <div style={{ fontSize: 24, color: FAINT, marginTop: 8 }}>{n.note}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── S7 结果·顾客与核销（菜单点线行）──
const S7Steps: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as StepsPayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title} sub={p.sub} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 520 }}>
        {p.rows.map((row, i) => {
          const r = region(beat, i, i);
          return (
            <MenuRow key={row.act} delay={30 + i * 26} style={{ marginBottom: 40, opacity: r.opacity }}>
              <div style={{ borderBottom: `1.5px dashed ${LEADER}`, paddingBottom: 26 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: FONT_TITLE, fontSize: 30, color: GOLD }}>{`0${i + 1}`}</span>
                  <span style={{ fontSize: 36, fontWeight: 700, color: CREAM }}>{row.act}</span>
                  <span style={{ fontSize: 26, color: MUTED }}>· {row.desc}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 22, color: BG, background: r.active ? GOLD : MUTED, borderRadius: 6, padding: '3px 14px', letterSpacing: 1, fontWeight: 700 }}>{row.mark}</span>
                </div>
                <div style={{ marginTop: 14, fontSize: 31, color: r.active ? GOLD : CREAM, lineHeight: 1.5 }}>{row.res}</div>
              </div>
            </MenuRow>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── S8 后台（两栏菜单清单）──
const S8Ledger: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as LedgerPayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow={p.tag} l1={p.title} sub={p.sub} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 520, display: 'flex', gap: 30 }}>
        {p.cols.map((col, ci) => {
          const r = region(beat, ci, ci);
          return (
            <div key={col.head} style={{ flex: 1, opacity: Math.min(r.opacity + 0.05, 1) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: `2px solid ${ci === 0 ? GOLD : MUTED}`, paddingBottom: 16 }}>
                <span style={{ width: 12, height: 30, borderRadius: 4, background: ci === 0 ? GOLD : MUTED }} />
                <span style={{ fontFamily: FONT_TITLE, fontSize: 40, color: ci === 0 ? GOLD : CREAM }}>{col.head}</span>
              </div>
              {col.items.map((it, i) => (
                <MenuRow key={it} delay={40 + ci * 16 + i * 12}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 24 }}>
                    <span style={{ fontSize: 30, color: CREAM }}>{it}</span>
                    <span style={{ flex: 1, borderBottom: `2px dotted ${LEADER}`, height: 2, marginBottom: 8 }} />
                  </div>
                </MenuRow>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1340, opacity: region(beat, 1, 1).opacity }}>
        <MenuRow delay={150}>
          <div style={{ background: TINT, border: `1.5px solid ${RULE}`, borderRadius: 14, padding: '26px 40px', fontFamily: FONT_TITLE, fontSize: 34, color: GOLD, textAlign: 'center', letterSpacing: 2 }}>{p.punch}</div>
        </MenuRow>
      </div>
    </AbsoluteFill>
  );
};

// ── S9 收尾 ──
const S9Cta: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Sign eyebrow="券到咖啡 · 攻略收束" l1={p.title1} l2={p.title2} />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 520, opacity: region(beat, 0, 0).opacity }}>
        {p.strips.map((st, i) => (
          <MenuRow key={st.name} delay={30 + i * 16}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, padding: '20px 6px', borderBottom: `1.5px dashed ${LEADER}` }}>
              <span style={{ width: 34, height: 34, display: 'inline-block', transform: 'translateY(6px)' }}>{Ico.check(GOLD)}</span>
              <span style={{ fontSize: 36, fontWeight: 700, color: CREAM }}>{st.name}</span>
              <span style={{ flex: 1, borderBottom: `2px dotted ${LEADER}`, height: 2, marginBottom: 8 }} />
              <span style={{ fontSize: 30, color: GOLD, fontWeight: 700, letterSpacing: 2 }}>{st.role}</span>
            </div>
          </MenuRow>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <MenuRow delay={90}>
          <div style={{ border: `3px solid ${GOLD}`, borderRadius: 16, padding: '22px 56px', fontFamily: FONT_TITLE, fontSize: 60, color: GOLD, letterSpacing: 8 }}>{p.brand}</div>
        </MenuRow>
        <div style={{ fontSize: 27, color: MUTED, letterSpacing: 4, opacity: region(beat, 1, 1).opacity }}>{p.sub}</div>
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

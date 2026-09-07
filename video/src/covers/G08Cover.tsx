// g08 火锅 · 三平台封面（代码渲染文字，不用 AI 文生图写中文——视频主视觉红线）
// 与成片同语言：中秋档期桌号牌 / 朱红海浪纹真背景图 / 牌匾 + 米纸号牌卡（双线金边·四角金钉）+ 落章
// （见 outputs/g08-火锅/03-母题一页.md）。封面不承诺数据，只承诺方法；不刻意打"免费"、
// 不用极限词、无站外生态词；入口三件套：主文案 ≤10 字含数字锚点（7 天），与口播前 2 秒同题。
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';

const RED = '#C8342B';
const DEEPRED = '#7A1F16';
const BRONZE = '#C89B3C';
const CREAM = '#FBF3E4';
const INK = '#3A231A';
const GOLD_SOFT = 'rgba(200,155,60,0.6)';

/** 朱红海浪纹真背景（与成片同图 BG-GEO-002），非 UI 手绘底 */
const Bg: React.FC = () => (
  <AbsoluteFill>
    <img src={staticFile('backgrounds/g08/bg.png')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

/** 牌匾：深红底 + 铜金边 + 内衬米线（母题标题承载） */
const Plaque: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: DEEPRED, borderRadius: 14, padding: '30px 34px 36px', textAlign: 'center',
    border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${CREAM}, 0 18px 40px rgba(0,0,0,0.45)`,
    ...style,
  }}>
    {children}
  </div>
);

/** 米纸号牌卡：双线金边 + 四角金钉（母题内容承载） */
const PlaceCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: 'relative', background: CREAM, borderRadius: 18, padding: '30px 44px 38px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 8px ${CREAM}, inset 0 0 0 9.5px ${GOLD_SOFT}, 0 24px 52px rgba(0,0,0,0.45)`, ...style }}>
    {[[18, 18], [18, undefined], [undefined, 18], [undefined, undefined]].map(([t, l], i) => (
      <span key={i} style={{
        position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: BRONZE,
        top: t, bottom: t === undefined ? 18 : undefined, left: l, right: l === undefined ? 18 : undefined,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
    ))}
    {children}
  </div>
);

/** 勾选行：★勾选格 + 字段名 + 虚线 + 右对齐值（成片 DipRow 同构） */
const CoverRow: React.FC<{ k: string; v: string; last?: boolean }> = ({ k, v, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 18, padding: '26px 0',
    borderBottom: last ? 'none' : '2px dashed rgba(200,52,43,0.28)',
  }}>
    <span style={{
      width: 34, height: 34, borderRadius: 6, flexShrink: 0, background: RED,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT_TITLE, fontSize: 24, color: CREAM,
    }}>★</span>
    <span style={{ fontFamily: FONT_TITLE, fontSize: 40, color: DEEPRED, letterSpacing: 2, flexShrink: 0 }}>{k}</span>
    <span style={{ flex: 1, borderBottom: '2px dotted rgba(58,35,26,0.22)', height: 2 }} />
    <span style={{ fontSize: 31, color: INK, fontWeight: 700, textAlign: 'right', lineHeight: 1.3 }}>{v}</span>
  </div>
);

/** 品牌落章：铜金边框微倾（成片 G08Cta 落章同构） */
const Brand: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{
    display: 'inline-block', fontFamily: FONT_TITLE, fontSize: 46, color: BRONZE, letterSpacing: 12,
    border: `4px solid ${BRONZE}`, borderRadius: 16, padding: '20px 42px 20px 54px', transform: 'rotate(-2deg)',
    boxShadow: `inset 0 0 0 3px rgba(200,155,60,0.4), 0 14px 34px rgba(0,0,0,0.4)`, ...style,
  }}>券到卡包</div>
);

const ROWS: { k: string; v: string }[] = [
  { k: '锁档期', v: '固定有效期 · 过期作废' },
  { k: '催到店', v: '到期提醒 · 提前 3 天' },
  { k: '匀客流', v: '回店券 · 次日起生效' },
];

const MainTitle: React.FC<{ size: number }> = ({ size }) => (
  <>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.28, color: CREAM, letterSpacing: 6 }}>7 天假期，</div>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.28, color: CREAM, letterSpacing: 6 }}>一过就<span style={{ color: BRONZE }}>空</span>？</div>
  </>
);

const SubLine: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{ fontSize: size, color: CREAM, letterSpacing: 3, textShadow: '0 2px 6px rgba(0,0,0,0.45)', fontWeight: 600 }}>{children}</div>
);

/** 抖音封面 9:16 —— 钩子问句牌匾 + 号牌卡三勾选行 */
export const G08CoverDy: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 84, right: 84, top: 300 }}>
      <Plaque style={{ width: '86%', margin: '0 auto' }}>
        <MainTitle size={96} />
      </Plaque>
      <div style={{ textAlign: 'center', margin: '30px 0 0' }}>
        <SubLine size={36}>火锅店老板的节前备券节奏</SubLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 96, right: 96, top: 1010 }}>
      <PlaceCard>
        {ROWS.map((r, i) => <CoverRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
      </PlaceCard>
    </div>
    <Brand style={{ position: 'absolute', right: 96, bottom: 110 }} />
  </AbsoluteFill>
);

/** 小红书封面 3:4 —— 关键词口吻 + 同构号牌卡（可截图照做） */
export const G08CoverXhs: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 72, right: 72, top: 200 }}>
      <Plaque style={{ width: '88%', margin: '0 auto' }}>
        <MainTitle size={84} />
      </Plaque>
      <div style={{ textAlign: 'center', margin: '26px 0 0' }}>
        <SubLine size={32}>节前备三张券，节后客人不散</SubLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 84, right: 84, top: 760 }}>
      <PlaceCard style={{ padding: '24px 38px 30px' }}>
        {ROWS.map((r, i) => <CoverRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
      </PlaceCard>
    </div>
    <Brand style={{ position: 'absolute', right: 84, bottom: 66, fontSize: 40 }} />
  </AbsoluteFill>
);

/** 搜狐头图 16:9 —— 左牌匾右号牌卡，长文配图 */
export const G08CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 96, top: 240, width: 900 }}>
      <Plaque>
        <MainTitle size={76} />
      </Plaque>
      <div style={{ margin: '34px 0 0' }}>
        <SubLine size={33}>火锅店中秋备券攻略：锁档期、催到店、匀客流</SubLine>
      </div>
      <Brand style={{ marginTop: 66, fontSize: 40 }} />
    </div>
    <div style={{ position: 'absolute', right: 96, top: 250, width: 640 }}>
      <PlaceCard style={{ padding: '18px 36px 24px' }}>
        {ROWS.map((r, i) => <CoverRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
      </PlaceCard>
    </div>
  </AbsoluteFill>
);

/** 抖音横版封面 4:3 —— 网页端发布需竖横两版；左牌匾右号牌卡，与竖版同题 */
export const G08CoverDy43: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 80, top: 220, width: 720 }}>
      <Plaque>
        <MainTitle size={72} />
      </Plaque>
      <div style={{ margin: '30px 0 0' }}>
        <SubLine size={32}>火锅店老板的节前备券节奏</SubLine>
      </div>
      <Brand style={{ marginTop: 62, fontSize: 38 }} />
    </div>
    <div style={{ position: 'absolute', right: 80, top: 230, width: 560 }}>
      <PlaceCard style={{ padding: '14px 32px 20px' }}>
        {ROWS.map((r, i) => <CoverRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
      </PlaceCard>
    </div>
  </AbsoluteFill>
);

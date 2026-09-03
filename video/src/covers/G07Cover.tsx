// g07 咖啡茶饮 · 三平台封面（代码渲染文字，不用 AI 文生图写中文——视频主视觉红线）
// 与成片同语言：点单小票 / 咖啡渍圈 / caramel 金咖色板（见 outputs/g07-咖啡茶饮/03-母题一页.md）。
// 封面不承诺数据，只承诺方法；不刻意打"免费"、不用极限词、无站外生态词。
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';

const BG = '#241812';
const BG2 = '#2f2016';
const CREAM = '#F3E9D8';
const PAPER = '#FFFDF8';
const GOLD = '#D9A441';
const MUTED = '#B79A78';
const DARK = '#2B1C12';
const RULE = 'rgba(217,164,65,0.45)';

const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 70% at 50% 26%, ${BG2} 0%, ${BG} 68%)` }} />
);

/** 咖啡渍圈：落在关键词后的细金环（本片招牌记号） */
const Ring: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 120, style }) => (
  <span style={{
    position: 'absolute', width: size, height: size * 0.82, borderRadius: '50%',
    border: `3px solid rgba(217,164,65,0.55)`, transform: 'rotate(-8deg)', pointerEvents: 'none', ...style,
  }} />
);

/** 点单小票条：纸白底 + 上下撕齿 + 虚线分隔 */
const Ticket: React.FC<{ children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ children, rot = 0, style }) => (
  <div style={{ position: 'relative', transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{
      background: PAPER, borderRadius: 10, padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 20,
      boxShadow: '0 16px 34px rgba(0,0,0,0.45)',
      borderTop: `2px dashed rgba(43,28,18,0.35)`, borderBottom: `2px dashed rgba(43,28,18,0.35)`,
    }}>
      {children}
    </div>
  </div>
);

const TkKey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: FONT_TITLE, fontSize: 40, color: GOLD, letterSpacing: 2, flexShrink: 0 }}>{children}</span>
);
const TkVal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: 30, color: DARK, fontWeight: 700, marginLeft: 'auto', textAlign: 'right', lineHeight: 1.35 }}>{children}</span>
);

const Badge: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 12, border: `2px solid ${RULE}`,
    borderRadius: 999, padding: '10px 30px', color: MUTED, fontSize: 28, letterSpacing: 3, ...style,
  }}>
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: GOLD }} />
    {text}
  </div>
);

const Brand: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{
    display: 'inline-block', border: `4px solid ${GOLD}`, borderRadius: 18, padding: '12px 34px',
    fontFamily: FONT_TITLE, fontSize: 40, color: GOLD, letterSpacing: 8, transform: 'rotate(-2deg)', ...style,
  }}>券到卡包</div>
);

/** 抖音封面 9:16 —— 钩子问句 + 三张小票条 */
export const G07CoverDy: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <Badge text="咖啡茶饮 · 满减券攻略" style={{ position: 'absolute', left: 72, top: 150 }} />
    <div style={{ position: 'absolute', left: 72, right: 72, top: 380 }}>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 104, lineHeight: 1.2, color: CREAM, letterSpacing: 3 }}>券发出去了，</div>
      <div style={{ position: 'relative', fontFamily: FONT_TITLE, fontSize: 104, lineHeight: 1.2, color: CREAM, letterSpacing: 3, width: 'fit-content' }}>
        <Ring size={168} style={{ left: 116, top: -18 }} />
        人怎么<span style={{ color: GOLD }}>不回头</span>？
      </div>
      <div style={{ marginTop: 34, fontSize: 36, color: MUTED, letterSpacing: 2 }}>问题常常出在「门槛」那一栏</div>
    </div>
    {[
      { k: '门槛', v: '满 35 才可用 · 来了就得消费' },
      { k: '发放', v: '公开领取 · 存成海报贴门口' },
      { k: '复购', v: '核销后自动再得一张' },
    ].map((t, i) => (
      <div key={t.k} style={{ position: 'absolute', left: 72, right: 72, top: 1060 + i * 190 }}>
        <Ticket rot={(i - 1) * 0.8}>
          <TkKey>{t.k}</TkKey>
          <span style={{ flex: 1, borderBottom: '2px dotted rgba(43,28,18,0.25)', height: 2, marginBottom: 8 }} />
          <TkVal>{t.v}</TkVal>
        </Ticket>
      </div>
    ))}
    <Brand style={{ position: 'absolute', right: 84, bottom: 120 }} />
  </AbsoluteFill>
);

/** 小红书封面 3:4 —— 关键词口吻 + 参数小票（可截图照做） */
export const G07CoverXhs: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <Badge text="咖啡店经营 · 复购" style={{ position: 'absolute', left: 64, top: 96 }} />
    <div style={{ position: 'absolute', left: 64, right: 64, top: 250 }}>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 92, lineHeight: 1.24, color: CREAM, letterSpacing: 2 }}>一张满减券，</div>
      <div style={{ position: 'relative', fontFamily: FONT_TITLE, fontSize: 92, lineHeight: 1.24, color: CREAM, letterSpacing: 2, width: 'fit-content' }}>
        <Ring size={150} style={{ left: 210, top: -10 }} />
        <span style={{ color: GOLD }}>拉新</span>又<span style={{ color: GOLD }}>复购</span>
      </div>
      <div style={{ marginTop: 26, fontSize: 32, color: MUTED, letterSpacing: 2 }}>门槛设对，人才会回头</div>
    </div>
    {[
      { k: '券面', v: '满 35 减 8 · 先做 200 张' },
      { k: '期限', v: '自领取日起 7 天内有效' },
      { k: '复购', v: '开「核销后赠券」开关' },
    ].map((t, i) => (
      <div key={t.k} style={{ position: 'absolute', left: 64, right: 64, top: 730 + i * 172 }}>
        <Ticket rot={(i - 1) * 0.7}>
          <TkKey>{t.k}</TkKey>
          <span style={{ flex: 1, borderBottom: '2px dotted rgba(43,28,18,0.25)', height: 2, marginBottom: 8 }} />
          <TkVal>{t.v}</TkVal>
        </Ticket>
      </div>
    ))}
    <Brand style={{ position: 'absolute', right: 72, bottom: 72 }} />
  </AbsoluteFill>
);

/** 搜狐头图 16:9 —— 左标题右小票，长文配图 */
export const G07CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 96, top: 220, width: 960 }}>
      <Badge text="咖啡茶饮 · 门店经营" />
      <div style={{ marginTop: 44, fontFamily: FONT_TITLE, fontSize: 88, lineHeight: 1.28, color: CREAM, letterSpacing: 2 }}>
        咖啡店拉新复购：
      </div>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 88, lineHeight: 1.28, color: CREAM, letterSpacing: 2 }}>
        满减券的<span style={{ color: GOLD }}>门槛</span>这么设
      </div>
      <div style={{ marginTop: 30, fontSize: 33, color: MUTED, letterSpacing: 2 }}>
        门槛设对、公开发出去、限期领了就来、用完再送一张
      </div>
      <Brand style={{ marginTop: 60 }} />
    </div>
    <div style={{ position: 'absolute', right: 96, top: 250, width: 640 }}>
      {[
        { k: '设', v: '消费门槛满 35 · 优惠 8 元' },
        { k: '发', v: '公开领取，海报贴门口' },
        { k: '复', v: '核销后自动再得一张' },
      ].map((r, i) => (
        <div key={r.k} style={{ marginTop: i === 0 ? 0 : 36 }}>
          <Ticket rot={(i - 1) * 0.6}>
            <TkKey>{r.k}</TkKey>
            <TkVal>{r.v}</TkVal>
          </Ticket>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/** 抖音横版封面 4:3 —— 网页端发布需竖横两版；左标题右小票，与竖版同题 */
export const G07CoverDy43: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <Badge text="咖啡茶饮 · 满减券攻略" style={{ position: 'absolute', left: 72, top: 88 }} />
    <div style={{ position: 'absolute', left: 72, top: 260, width: 700 }}>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 92, lineHeight: 1.22, color: CREAM, letterSpacing: 3 }}>券发出去了，</div>
      <div style={{ position: 'relative', fontFamily: FONT_TITLE, fontSize: 92, lineHeight: 1.22, color: CREAM, letterSpacing: 3, width: 'fit-content' }}>
        <Ring size={148} style={{ left: 100, top: -16 }} />
        人怎么<span style={{ color: GOLD }}>不回头</span>？
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: MUTED, letterSpacing: 2 }}>问题常常出在「门槛」那一栏</div>
      <Brand style={{ position: 'absolute', left: 0, bottom: -170 }} />
    </div>
    <div style={{ position: 'absolute', right: 80, top: 260, width: 560 }}>
      {[
        { k: '门槛', v: '满 35 · 来了就得消费' },
        { k: '发放', v: '公开领取 · 贴门口' },
        { k: '复购', v: '用完自动再得一张' },
      ].map((t, i) => (
        <div key={t.k} style={{ marginTop: i === 0 ? 0 : 44 }}>
          <Ticket rot={(i - 1) * 0.7}>
            <TkKey>{t.k}</TkKey>
            <TkVal>{t.v}</TkVal>
          </Ticket>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

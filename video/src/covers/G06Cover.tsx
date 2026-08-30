// g06 教培托管 · 三平台封面（代码渲染文字，不用 AI 文生图写中文——视频主视觉红线）
// 底图 = 本片视频背景 BG-ABS-001（video/public/backgrounds/g06/bg.png），与成片同语言：
// 回执单卡 / 打孔齿 / 盖章对勾 / 荧光抹带。封面不承诺数据，只承诺方法。
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT_BODY, FONT_ROUND } from '../palette';

const BROWN = '#5D4636';
const CARAMEL = '#8D6E63';
const STAMP_RED = '#E8503A';
const HI = 'rgba(255,199,44,0.62)';
const PAPER = '#FFFDF9';
const LINE = 'rgba(141,110,99,0.22)';

const Bg: React.FC = () => (
  <>
    <Img src={staticFile('backgrounds/g06/bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }} />
    <AbsoluteFill style={{ background: 'rgba(255,251,244,0.30)' }} />
  </>
);

const RuledLines: React.FC<{ gap?: number }> = ({ gap = 64 }) => (
  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
    {Array.from({ length: 40 }, (_, i) => (
      <line key={i} x1="0" y1={40 + i * gap} x2="2000" y2={40 + i * gap} stroke={CARAMEL} strokeWidth="1.4" />
    ))}
  </svg>
);

const HiLight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ position: 'relative', display: 'inline-block', padding: '0 8px' }}>
    <span style={{ position: 'absolute', left: 0, bottom: '8%', height: '38%', width: '100%', background: HI, borderRadius: 10, transform: 'skewX(-8deg)' }} />
    <span style={{ position: 'relative' }}>{children}</span>
  </span>
);

const Slip: React.FC<{ children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ children, rot = 0, style }) => (
  <div style={{
    position: 'relative', background: PAPER, borderRadius: 26, border: `1.5px solid ${LINE}`,
    boxShadow: '0 20px 46px rgba(122,74,38,0.20)', transform: `rotate(${rot}deg)`, ...style,
  }}>
    <div style={{ position: 'absolute', left: 16, top: 22, bottom: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#F6E9D4' }} />
      ))}
    </div>
    {children}
  </div>
);

const Check: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 17l7 7L26 8" stroke={STAMP_RED} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Badge: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 12, border: '2px solid rgba(141,110,99,0.45)',
    borderRadius: 999, padding: '12px 32px', color: '#7A5C44', fontSize: 30, letterSpacing: 3,
    background: 'rgba(255,253,249,0.75)', ...style,
  }}>
    <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF7043' }} />
    {text}
  </div>
);

const BrandSeal: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{
    display: 'inline-block', border: `5px solid ${STAMP_RED}`, borderRadius: 20, padding: '14px 40px',
    fontFamily: FONT_ROUND, fontSize: 44, color: STAMP_RED, letterSpacing: 8,
    background: 'rgba(255,253,249,0.85)', transform: 'rotate(-2.5deg)',
    boxShadow: '0 12px 28px rgba(232,80,58,0.20)', ...style,
  }}>券到卡包</div>
);

/** 抖音封面 9:16 —— 钩子问句 + 回执条 */
export const G06CoverDy: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <RuledLines />
    <Badge text="教培托管 · 开学季" style={{ position: 'absolute', left: 72, top: 150 }} />
    <div style={{ position: 'absolute', left: 72, right: 72, top: 420 }}>
      <div style={{ fontFamily: FONT_ROUND, fontSize: 108, lineHeight: 1.22, color: BROWN }}>一张传单，</div>
      <div style={{ fontFamily: FONT_ROUND, fontSize: 108, lineHeight: 1.22, color: BROWN }}>
        <HiLight>能留下什么？</HiLight>
      </div>
      <div style={{ marginTop: 36, fontSize: 36, color: '#8a715c', letterSpacing: 2 }}>
        托管班开学招生 · 把试用做成一张券
      </div>
    </div>
    {['谁领的 —— 得知道', '来没来 —— 得能查', '想回访 —— 得有号码'].map((t, i) => (
      <div key={t} style={{ position: 'absolute', left: 72, right: 72, top: 1020 + i * 176 }}>
        <Slip rot={(i - 1) * 0.8} style={{ display: 'flex', alignItems: 'center', padding: '30px 44px 30px 62px' }}>
          <Check size={42} />
          <span style={{ fontSize: 40, fontWeight: 700, color: '#2f241c', marginLeft: 24 }}>{t}</span>
        </Slip>
      </div>
    ))}
    <BrandSeal style={{ position: 'absolute', right: 84, bottom: 120 }} />
  </AbsoluteFill>
);

/** 小红书封面 3:4 —— 经验分享口吻 + 三张券回执 */
export const G06CoverXhs: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <RuledLines gap={56} />
    <Badge text="托管班 · 开学季招生" style={{ position: 'absolute', left: 64, top: 96 }} />
    <div style={{ position: 'absolute', left: 64, right: 64, top: 280 }}>
      <div style={{ fontFamily: FONT_ROUND, fontSize: 92, lineHeight: 1.24, color: BROWN }}>把试用，做成</div>
      <div style={{ fontFamily: FONT_ROUND, fontSize: 92, lineHeight: 1.24, color: BROWN }}>
        一张<HiLight>拿得出的券</HiLight>
      </div>
      <div style={{ marginTop: 28, fontSize: 32, color: '#8a715c', letterSpacing: 2 }}>
        校门口发出去的，得能把线接上
      </div>
    </div>
    {[
      { n: '兑换券', d: '下午托管一次 · 14 天内有效' },
      { n: '满减券', d: '私密发放，领完链接失效' },
      { n: '手机号名单', d: '「指定手机号可领取」，最多 500 个' },
    ].map((c, i) => (
      <div key={c.n} style={{ position: 'absolute', left: 64, right: 64, top: 700 + i * 172 }}>
        <Slip rot={(i - 1) * 0.7} style={{ display: 'flex', alignItems: 'center', padding: '26px 40px 26px 60px' }}>
          <Check size={40} />
          <span style={{ fontSize: 38, fontWeight: 700, color: '#2f241c', marginLeft: 22, width: 190 }}>{c.n}</span>
          <span style={{ fontSize: 29, color: '#8a715c', flex: 1 }}>{c.d}</span>
        </Slip>
      </div>
    ))}
    <BrandSeal style={{ position: 'absolute', right: 72, bottom: 72 }} />
  </AbsoluteFill>
);

/** 搜狐头图 16:9 —— 左标题右回执，长文配图 */
export const G06CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <RuledLines gap={72} />
    <div style={{ position: 'absolute', left: 96, top: 240, width: 980 }}>
      <Badge text="教培托管 · 开学季" />
      <div style={{ marginTop: 46, fontFamily: FONT_ROUND, fontSize: 96, lineHeight: 1.26, color: BROWN }}>
        开学季，托管班的试用
      </div>
      <div style={{ fontFamily: FONT_ROUND, fontSize: 96, lineHeight: 1.26, color: BROWN }}>
        怎么<HiLight>接上线</HiLight>
      </div>
      <div style={{ marginTop: 34, fontSize: 34, color: '#8a715c', letterSpacing: 2 }}>
        一张电子券：发出去的每一张传单，都查得到下落
      </div>
      <BrandSeal style={{ marginTop: 66 }} />
    </div>
    <div style={{ position: 'absolute', right: 96, top: 250, width: 660 }}>
      {[
        { k: '领', v: '校门口扫码，券自动进家长卡包' },
        { k: '核', v: '到店出示券码，商家扫码核销' },
        { k: '查', v: '领取核销分开记，渠道排行可导出' },
      ].map((r, i) => (
        <div key={r.k} style={{ marginTop: i === 0 ? 0 : 34 }}>
          <Slip rot={(i - 1) * 0.6} style={{ display: 'flex', alignItems: 'center', padding: '26px 40px 26px 58px' }}>
            <span style={{
              width: 62, height: 62, borderRadius: 16, background: i === 2 ? STAMP_RED : CARAMEL, color: '#fff',
              fontFamily: FONT_ROUND, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{r.k}</span>
            <span style={{ fontSize: 30, color: '#3d2f24', marginLeft: 24, lineHeight: 1.4 }}>{r.v}</span>
          </Slip>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// g09 宠物洗护 · 三平台封面（代码渲染文字，不用 AI 文生图写中文——视频主视觉红线）
// 与成片同语言：磁条次卡 + 泡泡计数 / 蓝绿光斑真背景图（BG-ABS-004）/ 表单值胶囊
// （见 outputs/g09-宠物店/03-母题一页.md）。封面不承诺数据，只承诺方法；不刻意打"免费"、
// 不用极限词、无站外生态词；入口三件套：主文案 ≤10 字含数字锚点（5 次），与标题/口播前 2 秒同题。
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';

const TEAL_D = '#12495f';
const TEAL_L = '#2f9e8a';
const STRIPE = '#0b2b38';
const INK = '#12333f';
const PAPER = 'rgba(255,255,255,0.92)';

/** 蓝绿光斑真背景（与成片同图 BG-ABS-004），非 UI 手绘底 */
const Bg: React.FC = () => (
  <AbsoluteFill>
    <img src={staticFile('backgrounds/g09/bg.png')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

/** 磁条次卡（封面主视觉，成片 CardFace 同构静态版；5 泡泡全亮 = 接下来五次） */
const CoverCard: React.FC<{ width?: number; nameSize?: number; bubble?: number }> = ({ width = 800, nameSize = 58, bubble = 52 }) => (
  <div style={{ width, borderRadius: 30, overflow: 'hidden', background: `linear-gradient(140deg, ${TEAL_D}, ${TEAL_L})`, boxShadow: '0 26px 54px rgba(18,73,95,0.42)', border: '1px solid rgba(255,255,255,0.28)' }}>
    <div style={{ height: 50, background: STRIPE, marginTop: 26 }} />
    <div style={{ padding: '26px 40px 34px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FONT_TITLE, fontSize: nameSize, color: '#fff', letterSpacing: 3, textShadow: '0 2px 3px rgba(0,0,0,0.28)' }}>洗护5次卡</span>
        <span style={{ fontFamily: FONT_TITLE, fontSize: Math.round(nameSize * 0.44), color: 'rgba(255,255,255,0.85)', letterSpacing: 2 }}>洗护次卡</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            width: bubble, height: bubble, borderRadius: '50%', flexShrink: 0,
            border: '3px solid rgba(255,255,255,0.9)',
            background: 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.98), rgba(178,236,220,0.6) 52%, rgba(120,200,180,0.28))',
            boxShadow: 'inset 0 -8px 14px rgba(18,73,95,0.16), 0 4px 12px rgba(255,255,255,0.35)',
          }} />
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: Math.round(bubble * 0.68), color: '#fff', letterSpacing: 1 }}>× 5 次</span>
      </div>
      <div style={{ marginTop: 24, fontSize: 24, color: 'rgba(255,255,255,0.85)', letterSpacing: 1 }}>有效期 120 天 · 每人限领 1 张</div>
    </div>
  </div>
);

/** 可截图照做行：字段名 + 值进输入框（成片表单语言同构） */
const PillRow: React.FC<{ k: string; v: string; last?: boolean }> = ({ k, v, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '18px 0', borderBottom: last ? 'none' : '2px solid rgba(18,73,95,0.09)' }}>
    <span style={{ fontSize: 30, fontWeight: 700, color: INK, letterSpacing: 1 }}>{k}</span>
    <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: 32, color: TEAL_D, background: 'rgba(255,255,255,0.88)', border: '2.5px solid rgba(18,73,95,0.18)', borderRadius: 12, padding: '8px 22px' }}>{v}</span>
  </div>
);

/** 品牌胶囊（成片 G09Cta 品牌同构） */
const Brand: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{
    display: 'inline-block', fontFamily: FONT_TITLE, fontSize: 44, color: '#fff', letterSpacing: 9,
    background: `linear-gradient(140deg, ${TEAL_D}, ${TEAL_L})`, borderRadius: 16, padding: '18px 40px',
    boxShadow: '0 16px 36px rgba(18,73,95,0.4)', ...style,
  }}>券到卡包</div>
);

const ROWS: { k: string; v: string }[] = [
  { k: '每张包含次数', v: '5 次' },
  { k: '核销间隔', v: '14 天' },
  { k: '有效期', v: '120 天' },
];

const MainTitle: React.FC<{ size: number }> = ({ size }) => (
  <>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.3, color: INK, letterSpacing: 6, textShadow: '0 2px 10px rgba(255,255,255,0.6)' }}>一张卡，</div>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.3, color: INK, letterSpacing: 6, textShadow: '0 2px 10px rgba(255,255,255,0.6)' }}>锁住<span style={{ color: TEAL_L }}>5</span>次</div>
  </>
);

const SubLine: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{ fontSize: size, color: INK, letterSpacing: 2, fontWeight: 600, textShadow: '0 2px 8px rgba(255,255,255,0.55)' }}>{children}</div>
);

/** 抖音封面 9:16 —— 主文案 + 副行钩子问句 + 磁条卡 + 三行可截图照做 */
export const G09CoverDy: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 84, right: 84, top: 240, textAlign: 'center' }}>
      <MainTitle size={100} />
      <div style={{ marginTop: 30 }}>
        <SubLine size={36}>洗完这一次，下回啥时候来？</SubLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center' }}>
      <CoverCard width={820} nameSize={62} bubble={56} />
    </div>
    <div style={{ position: 'absolute', left: 110, right: 110, top: 1290, background: PAPER, borderRadius: 20, padding: '10px 36px 18px', boxShadow: '0 18px 40px rgba(18,73,95,0.16), inset 0 0 0 2px rgba(47,158,138,0.28)' }}>
      {ROWS.map((r, i) => <PillRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
    </div>
    <Brand style={{ position: 'absolute', right: 96, bottom: 70 }} />
  </AbsoluteFill>
);

/** 小红书封面 3:4 —— 同题压缩版（可截图照做） */
export const G09CoverXhs: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 72, right: 72, top: 150, textAlign: 'center' }}>
      <MainTitle size={80} />
      <div style={{ marginTop: 24 }}>
        <SubLine size={31}>洗完这一次，下回啥时候来？</SubLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center' }}>
      <CoverCard width={720} nameSize={52} bubble={46} />
    </div>
    <div style={{ position: 'absolute', left: 96, right: 96, top: 980, background: PAPER, borderRadius: 20, padding: '8px 32px 14px', boxShadow: '0 18px 40px rgba(18,73,95,0.16), inset 0 0 0 2px rgba(47,158,138,0.28)' }}>
      {ROWS.map((r, i) => <PillRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
    </div>
    <Brand style={{ position: 'absolute', right: 84, bottom: 48, fontSize: 38 }} />
  </AbsoluteFill>
);

/** 搜狐头图 16:9 —— 左主文案右磁条卡，长文配图 */
export const G09CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 96, top: 220, width: 900 }}>
      <MainTitle size={78} />
      <div style={{ margin: '32px 0 0' }}>
        <SubLine size={32}>宠物店留客：次数、间隔、有效期一次设对</SubLine>
      </div>
      <Brand style={{ marginTop: 60 }} />
    </div>
    <div style={{ position: 'absolute', right: 96, top: 150 }}>
      <CoverCard width={640} nameSize={48} bubble={42} />
    </div>
    <div style={{ position: 'absolute', right: 96, top: 640, width: 640, background: PAPER, borderRadius: 20, padding: '6px 32px 12px', boxShadow: '0 18px 40px rgba(18,73,95,0.16), inset 0 0 0 2px rgba(47,158,138,0.28)' }}>
      {ROWS.map((r, i) => <PillRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
    </div>
  </AbsoluteFill>
);

/** 抖音横版封面 4:3 —— 网页端发布需竖横两版；与竖版同题 */
export const G09CoverDy43: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Bg />
    <div style={{ position: 'absolute', left: 84, top: 180, width: 700 }}>
      <MainTitle size={72} />
      <div style={{ margin: '28px 0 0' }}>
        <SubLine size={30}>洗完这一次，下回啥时候来？</SubLine>
      </div>
      <Brand style={{ marginTop: 56, fontSize: 38 }} />
    </div>
    <div style={{ position: 'absolute', right: 84, top: 140 }}>
      <CoverCard width={560} nameSize={44} bubble={38} />
    </div>
    <div style={{ position: 'absolute', right: 84, top: 560, width: 560, background: PAPER, borderRadius: 20, padding: '4px 30px 10px', boxShadow: '0 18px 40px rgba(18,73,95,0.16), inset 0 0 0 2px rgba(47,158,138,0.28)' }}>
      {ROWS.map((r, i) => <PillRow key={r.k} k={r.k} v={r.v} last={i === ROWS.length - 1} />)}
    </div>
  </AbsoluteFill>
);

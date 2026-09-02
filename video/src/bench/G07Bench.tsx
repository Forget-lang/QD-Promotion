// g07 咖啡茶饮 · 一屏标杆 v2 ·「咖啡馆菜单板」语言（推翻 v1 的"点单小票"——那版骨架太像教培 g06）
// 结构全反 g06：深色浓缩咖啡底（非浅底）/ 菜单"名称……价格"点线引导行（非左标签右数值+虚线下划线）/
//   得意黑招牌标题 + 金色分隔线（非方圆体 + 胶囊角标）/ 平铺分栏无漂浮白卡（非白色圆角卡+投影）/ 暖金强调（非红）
// 屏内容：制作满减券（① 券面 4 行 + ② 期限 2 行）+ 老板注意卡；消费门槛=分水岭，唯一强调
// 字段名逐字回 spec/coupon-fields.json；数值为示例（顶部标注）。骨架全内联本文件。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE, PALETTES } from '../palette';
import { EASE_OUT } from '../components/animations';
import { Ico } from '../components/icons';

// ── 菜单板色板（深浓缩咖啡底 + 奶油字 + 暖金）──
const BG = '#241812';            // 浓缩深咖底
const BG2 = '#2f2016';           // 稍亮中心
const CREAM = '#F3E9D8';         // 奶油主字
const GOLD = '#D9A441';          // 暖金（主强调，区别 g06 红）
const GOLD_SOFT = 'rgba(217,164,65,0.5)';
const MUTED = '#B79A78';         // 次要
const LEADER = 'rgba(243,233,216,0.22)'; // 点线
const RULE = 'rgba(217,164,65,0.4)';

// ── 底层：深色 + 中心暖光呼吸 + 极淡蒸汽线（持续微动）──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.06 + (Math.sin(f / 70) * 0.5 + 0.5) * 0.05;
  const sx = Math.sin(f / 90) * 10;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${BG2} 0%, ${BG} 70%)` }} />
      <div style={{ position: 'absolute', left: 120 + sx, top: 120, width: 840, height: 520, borderRadius: '50%', background: `radial-gradient(circle, rgba(217,164,65,${o}) 0%, transparent 68%)`, pointerEvents: 'none' }} />
      {/* 极淡蒸汽线 */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${470 + i * 70} 1750 q 26 -60 0 -120 q -26 -60 0 -120`} stroke={GOLD} strokeWidth="3" fill="none" strokeLinecap="round" />
        ))}
      </svg>
    </>
  );
};

// ── 菜单行入场：整行淡起 + 点线从左往右"写"出来 ──
const MenuRow: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{children}</div>;
};

// ── 一行菜单：名称 …… 价格（点线引导），hero=分水岭行 ──
const Row: React.FC<{ name: string; price: string; delay: number; hero?: boolean; tag?: string; sub?: string }> = ({ name, price, delay, hero, tag, sub }) => {
  const f = useCurrentFrame();
  const lead = interpolate(f - delay - 6, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  if (f < delay) return null;
  return (
    <MenuRow delay={delay}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 18, padding: hero ? '20px 22px' : '16px 4px',
        background: hero ? 'rgba(217,164,65,0.10)' : 'transparent', borderRadius: 12,
        borderLeft: hero ? `5px solid ${GOLD}` : '5px solid transparent',
      }}>
        <span style={{ fontSize: hero ? 34 : 31, color: hero ? GOLD : CREAM, fontWeight: hero ? 700 : 500, letterSpacing: 1, flexShrink: 0 }}>{name}</span>
        {tag && <span style={{ fontSize: 21, color: BG, background: GOLD, borderRadius: 6, padding: '3px 12px', letterSpacing: 1, fontWeight: 700, flexShrink: 0 }}>{tag}</span>}
        <span style={{ flex: 1, minWidth: 30, borderBottom: `2px dotted ${LEADER}`, transform: `scaleX(${lead})`, transformOrigin: 'left', height: 2, marginBottom: 8 }} />
        <span style={{ fontSize: hero ? 40 : 34, color: hero ? GOLD : CREAM, fontWeight: 700, flexShrink: 0, letterSpacing: 1 }}>{price}</span>
      </div>
      {sub && <div style={{ fontSize: 23, color: MUTED, textAlign: 'right', padding: '2px 8px 0 0', letterSpacing: 1 }}>{sub}</div>}
    </MenuRow>
  );
};

// ── 分栏抬头（菜单小标题 + 金线）──
const Section: React.FC<{ no: string; name: string; delay: number }> = ({ no, name, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <MenuRow delay={delay}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40 }}>
        <span style={{ fontSize: 26, color: GOLD, fontFamily: FONT_TITLE }}>{no}</span>
        <span style={{ fontSize: 34, color: CREAM, fontWeight: 700, letterSpacing: 3 }}>{name}</span>
        <span style={{ flex: 1, height: 1.5, background: RULE, transform: `scaleX(${p})`, transformOrigin: 'left' }} />
      </div>
    </MenuRow>
  );
};

// ── 招牌标题（得意黑 + 眉标题 + 金分隔线）──
const Header: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f - 4, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 84, right: 84, top: 150, opacity: p }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 34, height: 34, display: 'inline-block' }}>{Ico.cup(GOLD)}</span>
        <span style={{ fontSize: 26, color: GOLD, letterSpacing: 6, fontWeight: 700 }}>券到咖啡 · 今日出券</span>
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT_TITLE, fontSize: 88, color: CREAM, letterSpacing: 4, lineHeight: 1.1 }}>制作满减券</div>
      <div style={{ marginTop: 20, height: 3, background: `linear-gradient(90deg, ${GOLD}, transparent)`, borderRadius: 2 }} />
      <div style={{ marginTop: 16, fontSize: 26, color: MUTED, letterSpacing: 2 }}>券到卡包 · 拉新复购 · 数值为示例</div>
    </div>
  );
};

// ── 老板注意卡（平铺金框，非漂浮白卡）──
const Note: React.FC<{ delay: number }> = ({ delay }) => (
  <MenuRow delay={delay}>
    <div style={{ marginTop: 48, border: `1.5px solid ${RULE}`, borderRadius: 16, padding: '28px 34px', background: 'rgba(217,164,65,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 26, height: 26, display: 'inline-block' }}>{Ico.cup(GOLD)}</span>
        <span style={{ fontSize: 24, color: GOLD, letterSpacing: 3, fontWeight: 700 }}>老板注意</span>
      </div>
      <div style={{ fontSize: 31, color: CREAM, lineHeight: 1.5 }}>门槛填 <span style={{ color: GOLD, fontWeight: 700 }}>0</span> 是白送引流，设成客单价 <span style={{ color: GOLD, fontWeight: 700 }}>满 35</span> 才是来了就得消费一次</div>
    </div>
  </MenuRow>
);

export const G07Bench: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Ambient />
      <Header />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 470 }}>
        <Section no="01" name="券面" delay={22} />
        <div style={{ marginTop: 14 }}>
          <Row name="优惠券名称" price="到店咖啡券" delay={34} sub="最多 18 字 · 场景写进名字" />
          <Row name="消费门槛" price="满 35 元可用" delay={52} hero tag="分水岭" sub="0 为无门槛" />
          <Row name="优惠金额" price="减 8 元" delay={72} sub="满 35 才能用，省 8 元" />
          <Row name="制作数量" price="200 张" delay={90} sub="库存 1~10000" />
        </div>
        <Section no="02" name="期限" delay={110} />
        <div style={{ marginTop: 14 }}>
          <Row name="有效期类型" price="领后 N 天内有效" delay={120} />
          <Row name="有效期" price="7 天" delay={136} sub="最少 1 天，最多 365 天" />
        </div>
        <Note delay={156} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 200, textAlign: 'center', fontSize: 24, color: MUTED, letterSpacing: 4 }}>券到卡包 · 咖啡茶饮</div>
    </AbsoluteFill>
  );
};

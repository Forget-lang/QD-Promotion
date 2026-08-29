// 一屏标杆 · 「券包打开页」高保真复刻（非交付片，验证质感用）
// 真值来源：applet/pages_user/bundle/private_receive.vue（结构/CSS 逐条对照）+ utils/theme.js（深海蓝 #123448）
//   + static/css/app.css（.button-gold #ffeeb2/#8d5f37）+ R6 换算 1rpx = 1080/750 = 1.44px
// 红线：不出现微信胶囊/字样等小程序标识；数据为脱敏示例并角标「示例」
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_BODY, FONT_TITLE, FPS } from '../palette';

const PX = 1.44; // rpx → px（1080 宽）
const THEME = '#123448';          // 主题 9 深海蓝
const THEME_DARK = '#0B2331';
const RED = '#E84C59';            // 券金额红（页面实测 .coupon-content-amount）
const GOLD_BG = '#FFEEB2';
const GOLD_TX = '#8D5F37';

// 状态栏（自绘通用元素，无平台标识）
const StatusBar: React.FC = () => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top: 0, height: 88 * PX,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
    color: '#fff', fontFamily: FONT_BODY, fontSize: 34, fontWeight: 600,
  }}>
    <span>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* 信号 */}
      <svg width="46" height="34" viewBox="0 0 46 34"><g fill="#fff"><rect x="0" y="22" width="8" height="12" rx="2"/><rect x="12" y="15" width="8" height="19" rx="2"/><rect x="24" y="8" width="8" height="26" rx="2"/><rect x="36" y="0" width="8" height="34" rx="2" opacity="0.4"/></g></svg>
      {/* 电池 */}
      <svg width="66" height="32" viewBox="0 0 66 32"><rect x="1" y="1" width="56" height="30" rx="8" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7"/><rect x="6" y="6" width="40" height="20" rx="5" fill="#fff"/><rect x="61" y="10" width="5" height="12" rx="2.5" fill="#fff" opacity="0.7"/></svg>
    </div>
  </div>
);

// 透明导航：仅左返回箭头（微信胶囊属小程序标识，禁止出现）
const NavBar: React.FC = () => (
  <div style={{ position: 'absolute', left: 36, top: 100 * PX, width: 72, height: 72, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="30" height="52" viewBox="0 0 30 52"><path d="M26 4 L6 26 L26 48" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
  </div>
);

// 券行数据（真实形态示例值）
const COUPONS = [
  { thumb: '兑换券', name: '45 分钟美术体验课兑换券', amount: null as string | null, unit: '', threshold: '需提前与老师约课', valid: '领取后 30 天内有效 · 周末全天可用', hours: '可用时段：周六 / 周日 9:00-17:00', count: '1张' },
  { thumb: '满减券', name: '秋季报名满减券', amount: '80', unit: '元券', threshold: '满 800 元可用', valid: '领取后 30 天内有效', hours: '仅工作日 14:00-20:00 报名可用', count: '1张' },
  { thumb: '折扣券', name: '画材专用折扣券', amount: '9', unit: '折券', threshold: '画材店内在售商品', valid: '领取后 60 天内有效', hours: '全天可用 · 不与满减同享', count: '1张' },
];

export const BundleOpenBench: React.FC = () => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const s = (d: number) => spring({ frame: f - d, fps: FPS, config: { damping: 20, stiffness: 170 } });
  // 封面光晕呼吸（持续微动，不抢信息层）
  const glow = Math.sin(f / 22) * 0.5 + 0.5;
  const card1 = s(14), card2 = s(24), card3 = s(34), btn = s(48), panel = s(4);

  return (
    <AbsoluteFill style={{ background: '#F6F6F6', fontFamily: FONT_BODY }}>
      {/* ── 封面区（真值 swiperHeight≈864px，展示滚动后构图：压到 620px）── */}
      <div style={{
        position: 'absolute', left: 0, top: 0, right: 0, height: 588,
        background: `linear-gradient(168deg, ${THEME_DARK} 0%, ${THEME} 52%, #1B4A63 100%)`, overflow: 'hidden',
      }}>
        {/* 光晕两块：呼吸微动 */}
        <div style={{ position: 'absolute', left: -140, top: -180, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)', opacity: 0.6 + glow * 0.4 }} />
        <div style={{ position: 'absolute', right: -180, top: 60, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,196,48,0.14) 0%, transparent 70%)', opacity: 0.5 + glow * 0.3 }} />
        {/* 海报标题区 */}
        <div style={{ position: 'absolute', left: 64, top: 216, color: '#fff' }}>
          <div style={{ display: 'inline-block', fontSize: 26, letterSpacing: 6, border: '2px solid rgba(255,255,255,0.55)', borderRadius: 999, padding: '8px 26px', opacity: 0.9 }}>开学季 · 老学员回归季</div>
          <div style={{ marginTop: 26, fontFamily: FONT_TITLE, fontSize: 76, fontWeight: 900, letterSpacing: 2 }}>秋季新生美术礼包</div>
          <div style={{ marginTop: 14, fontSize: 30, color: 'rgba(255,255,255,0.82)' }}>三选一领取 · 老师一对一发给你</div>
        </div>
        <StatusBar />
        <NavBar />
      </div>

      {/* ── 商户面板（真值 margin-top:-60rpx 上叠 + 白卡 24rpx 圆角）── */}
      <div style={{
        position: 'absolute', left: 32 * PX, right: 32 * PX, top: 512,
        transform: `translateY(${(1 - panel) * 40}px)`, opacity: panel,
        background: '#fff', borderRadius: 35, boxShadow: '0 12px 35px rgba(20,40,70,0.10)',
        padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 22,
      }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#F4C430,#E4572E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 40, fontWeight: 800, flexShrink: 0 }}>画</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: '#333' }}>小画笔美术（示例商户）</div>
          <div style={{ marginTop: 6, fontSize: 26, color: '#999' }}>少儿美术 · 12 类课程可约</div>
        </div>
        <svg width="16" height="28" viewBox="0 0 16 28"><path d="M2 2 L13 14 L2 26" stroke="#C4C9CE" strokeWidth="4" strokeLinecap="round" fill="none" /></svg>
      </div>

      {/* ── 券包主卡（真值 .bundle：主题底 32rpx 内距 24rpx 圆角，白字标题）── */}
      <div style={{
        position: 'absolute', left: 32 * PX, right: 32 * PX, top: 648,
        background: THEME, borderRadius: 35, padding: '28px 30px 14px',
        boxShadow: '0 18px 44px rgba(18,52,72,0.28)',
      }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>开学季三选一 · 专属优惠券</div>
        <div style={{ marginTop: 10, fontSize: 30, color: 'rgba(255,255,255,0.85)' }}>私密发放 · 3张专属优惠券</div>

        {COUPONS.map((c, i) => {
          const p = [card1, card2, card3][i];
          return (
            <div key={c.name} style={{
              position: 'relative', marginTop: 15, background: '#fff', borderRadius: 35, padding: '16px 28px',
              display: 'flex', alignItems: 'center', gap: 26,
              opacity: p, transform: `translateY(${(1 - p) * 34}px)`,
            }}>
              {/* 两侧凹槽（真值 ::before/after 24rpx 圆 theme 色，左右 -12rpx） */}
              <div style={{ position: 'absolute', left: -17, top: '50%', marginTop: -17, width: 34, height: 34, borderRadius: '50%', background: THEME }} />
              <div style={{ position: 'absolute', right: -17, top: '50%', marginTop: -17, width: 34, height: 34, borderRadius: '50%', background: THEME }} />
              {/* 缩略块（无封面图时 = couponTypeLabel 占位真值 120rpx 圆角12） */}
              <div style={{ width: 88, height: 88, borderRadius: 14, background: '#F5F7F9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 26, color: THEME, fontWeight: 600 }}>{c.thumb}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 34, fontWeight: 600, color: '#1a1a1a' }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 10, gap: 8 }}>
                  {c.amount ? (
                    <>
                      <span style={{ fontSize: 56, fontWeight: 700, color: RED, lineHeight: 1 }}>{c.amount}</span>
                      <span style={{ fontSize: 30, fontWeight: 600, color: RED }}>{c.unit}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 40, fontWeight: 700, color: RED, lineHeight: 1.15 }}>到店兑换</span>
                  )}
                  <span style={{ fontSize: 27, color: '#B6B6B6' }}>{c.threshold}</span>
                </div>
                <div style={{ marginTop: 7, fontSize: 26, color: '#B6B6B6' }}>{c.valid}</div>
                <div style={{ marginTop: 3, fontSize: 24, color: '#9AA6B2' }}>{c.hours}</div>
              </div>
              {/* button-gold 真值：#ffeeb2 底 #8d5f37 字 24rpx 600 */}
              <div style={{ flexShrink: 0, background: GOLD_BG, color: GOLD_TX, fontSize: 26, fontWeight: 600, borderRadius: 10, padding: '12px 20px' }}>{c.count}</div>
            </div>
          );
        })}

        {/* 使用须知：结构化 4 条，每条有 facts.json 能力依据 */}
        <div style={{ marginTop: 22, paddingBottom: 8, borderTop: '1.5px dashed rgba(255,255,255,0.22)', paddingTop: 14 }}>
          <div style={{ fontSize: 29, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>使用须知</div>
          {[
            ['领取', '每人限领 1 个券包 · 三张券任选其一'],
            ['怎么用', '领取后进「我的卡包」，到店出示核销码，老师扫码核销'],
            ['到期', '到期前 3 天服务通知提醒 · 过期作废'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 24, lineHeight: 1.45 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', width: 72, flexShrink: 0, whiteSpace: 'nowrap' }}>{k}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 底部吸附操作栏（真值 .bundle-footer：白底上阴影 + 主题色大按钮 + 倒计时备注）── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff',
        boxShadow: '0 -3px 23px rgba(0,0,0,0.06)', padding: '24px 43px 30px',
        opacity: btn, transform: `translateY(${(1 - btn) * 30}px)`,
      }}>
        <div style={{
          background: THEME, color: '#fff', fontSize: 34, fontWeight: 500, textAlign: 'center',
          borderRadius: 63, padding: '34px 0', position: 'relative', overflow: 'hidden',
        }}>
          领取券包 · 选择一种领取
          {/* 按钮高光扫过（持续微动） */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: 180,
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)',
            left: interpolate(f % 90, [0, 90], [-200, 1080]),
          }} />
        </div>
        <div style={{ position: 'absolute', left: 44, bottom: 8, fontSize: 18, color: '#C9C9C9' }}>界面演示 · 数据为示例</div>
      </div>
    </AbsoluteFill>
  );
};

// 一屏标杆 · 「券包实物特写」rev3（非交付片，验证质感用）
// 用户口径（2026-08-29）：视频画面 ≠ App 截图。只复刻干货实体——券包名 / 三张券 / 使用须知；
//   页面 chrome（导航、返回、状态栏、领取按钮、商户卡）与产品自定义不了的话术全部去掉。
//   背景图是视频画面的组成部分，不被覆盖：券包作为一个"物体"摆在背景上。
// 券面真值：applet/pages_user/bundle/private_receive.vue（凹槽/金徽章/金额红/字号）+ utils/theme.js 深海蓝。
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, FPS } from '../palette';

const THEME = '#123448';
const THEME_DARK = '#0B2331';
const RED = '#E84C59';
const GOLD_BG = '#FFEEB2';
const GOLD_TX = '#8D5F37';

// 三张券（真实形态示例数据；每条文案都对应产品可自定义字段）
const COUPONS = [
  { tag: '兑换券', name: '45 分钟美术体验课兑换券', amount: '', unit: '', big: '到店兑换', threshold: '需提前与老师约课', valid: '领取后 30 天内有效 · 周末全天可用', hours: '9:00-17:00', rot: -0.9, dx: 0 },
  { tag: '满减券', name: '秋季报名满减券', amount: '80', unit: '元券', big: '', threshold: '满 800 元可用', valid: '领取后 30 天内有效', hours: '仅工作日 14:00-20:00', rot: 0.6, dx: -10 },
  { tag: '折扣券', name: '画材专用折扣券', amount: '9', unit: '折券', big: '', threshold: '画材店内在售商品', valid: '领取后 60 天内有效', hours: '全天可用 · 不与满减同享', rot: -0.4, dx: 6 },
];

const NOTES: [string, string][] = [
  ['领取', '每人限领 1 个券包 · 三张券任选其一'],
  ['怎么用', '领取后进「我的卡包」，到店出示核销码，老师扫码核销'],
  ['到期', '到期前 3 天服务通知提醒 · 过期作废'],
];

export const BundleOpenBench: React.FC = () => {
  const f = useCurrentFrame();
  const lift = spring({ frame: f - 8, fps: FPS, config: { damping: 20, stiffness: 160 } });
  const glow = Math.sin(f / 24) * 0.5 + 0.5;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* ── 视频背景层（A 级素材库冰蓝柔光底，四周可见）── */}
      <Img src={staticFile('backgrounds/bench-bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* 轻压一层白雾保证暗色小字可读（呼吸微动） */}
      <AbsoluteFill style={{ background: 'rgba(250,252,255,0.22)', opacity: 0.9 + glow * 0.1 }} />

      {/* ── 顶部路径条：券怎么到顾客手上（真实能力「加好友自动发券」泛称口径）── */}
      {(() => {
        const enter = spring({ frame: f - 20, fps: FPS, config: { damping: 22, stiffness: 180 } });
        const steps = ['加老师好友', '券包自动到账', '三选一领取'];
        return (
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 190 + (1 - enter) * 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
            opacity: enter,
          }}>
            {steps.map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 && (
                  <svg width="30" height="20" viewBox="0 0 30 20"><path d="M2 10 H24 M18 3 L26 10 L18 17" stroke="rgba(18,52,72,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.78)',
                  border: '1.5px solid rgba(18,52,72,0.14)', borderRadius: 999, padding: '12px 28px',
                  boxShadow: '0 8px 20px rgba(18,52,72,0.10)',
                }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: '50%', background: THEME, color: '#fff',
                    fontSize: 21, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 27, fontWeight: 600, color: '#16323F' }}>{t}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        );
      })()}

      {/* ── 券包主体：一个物体，整体入场 + 落影浮起 ── */}
      <div style={{
        position: 'absolute', left: 104, right: 104, top: 340,
        transform: `translateY(${(1 - lift) * 90}px)`, opacity: lift,
        filter: 'drop-shadow(0 34px 60px rgba(18,52,72,0.30))',
      }}>
        {/* 包头条（真值 .bundle 主题底白标题） */}
        <div style={{
          position: 'relative', background: `linear-gradient(150deg, ${THEME_DARK} 0%, ${THEME} 68%, #1A4B66 100%)`,
          borderRadius: '36px 36px 0 0', padding: '48px 54px 40px', overflow: 'hidden',
        }}>
          {/* 光带扫过（持续微动） */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: 260, transform: 'skewX(-14deg)',
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)',
            left: interpolate(f % 110, [0, 110], [-300, 900]),
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: 2, lineHeight: 1.24 }}>
              秋季新生美术礼包
            </div>
            <div style={{ flexShrink: 0, marginTop: 10, border: '2px solid rgba(255,255,255,0.55)', color: 'rgba(255,255,255,0.92)', fontSize: 26, borderRadius: 999, padding: '8px 24px', letterSpacing: 4 }}>券包</div>
          </div>
          <div style={{ marginTop: 18, fontSize: 28, color: 'rgba(255,255,255,0.78)' }}>
            私密发放 · 三张券自选一种 · 每人限领 1 个
          </div>
        </div>

        {/* 三张券（叠卡微旋，产品实拍纵深） */}
        <div style={{ background: THEME, padding: '4px 0 0' }}>
          {COUPONS.map((c, i) => (
            <div key={c.tag} style={{
              position: 'relative', zIndex: 3 - i,
              margin: `${i === 0 ? 0 : -12}px 26px ${i === 2 ? 10 : 20}px`,
              transform: `rotate(${c.rot}deg) translateX(${c.dx}px)`,
              background: '#fff', borderRadius: 28, padding: '24px 30px',
              display: 'flex', alignItems: 'center', gap: 24,
              boxShadow: i === 0 ? '0 16px 34px rgba(10,30,44,0.30)' : '0 10px 24px rgba(10,30,44,0.22)',
            }}>
              {/* 两侧凹槽压在主题底上（真值 24rpx 圆） */}
              <div style={{ position: 'absolute', left: -15, top: '50%', marginTop: -15, width: 30, height: 30, borderRadius: '50%', background: THEME }} />
              <div style={{ position: 'absolute', right: -15, top: '50%', marginTop: -15, width: 30, height: 30, borderRadius: '50%', background: THEME }} />
              <div style={{ width: 90, height: 90, borderRadius: 14, background: '#F2F5F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 25, color: THEME, fontWeight: 700 }}>{c.tag}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 34, fontWeight: 700, color: '#1a1a1a' }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 7, gap: 8 }}>
                  {c.amount ? (
                    <>
                      <span style={{ fontSize: 52, fontWeight: 800, color: RED, lineHeight: 1 }}>{c.amount}</span>
                      <span style={{ fontSize: 29, fontWeight: 700, color: RED }}>{c.unit}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 40, fontWeight: 800, color: RED }}>{c.big}</span>
                  )}
                  <span style={{ fontSize: 25, color: '#A9B0B8' }}>{c.threshold}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 24, color: '#A9B0B8' }}>{c.valid} · {c.hours}</div>
              </div>
              <div style={{ flexShrink: 0, background: GOLD_BG, color: GOLD_TX, fontSize: 26, fontWeight: 700, borderRadius: 10, padding: '10px 18px' }}>1张</div>
            </div>
          ))}

          {/* 须知尾板（干货收口，虚线像印在包底衬卡上） */}
          <div style={{ margin: '8px 26px 0', padding: '26px 40px 34px', borderTop: '2px dashed rgba(255,255,255,0.26)', borderRadius: '0 0 36px 36px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 2 }}>使用须知</div>
            {NOTES.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 25, lineHeight: 1.5 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', width: 84, flexShrink: 0 }}>{k}</span>
                <span style={{ color: 'rgba(255,255,255,0.88)', flex: 1 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部说明（视频层信息，不属于券包物体） */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center',
        fontSize: 24, color: 'rgba(18,52,72,0.55)', letterSpacing: 2,
      }}>券包为产品真实形态演示 · 数据为示例</div>
    </AbsoluteFill>
  );
};

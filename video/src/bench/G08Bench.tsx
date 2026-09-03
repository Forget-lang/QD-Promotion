// g08 火锅 · 一屏标杆 ·「中秋档期桌号牌」语言（五轴自证对照 g07 点单小票，见 outputs/g08-火锅/03-母题一页.md）
// 五轴真换：中轴对称牌匾栅格（非 g07 左对齐流水）/ 米纸号牌卡双线金边+四角金钉（非撕齿小票条）/
//   牌匾横匾标题金框红底金字（非大字+咖啡渍圈）/ 落章式入场整块弹跳盖上去（非打印逐行擦入）/
//   块级落定 + 金线流光沿卡边巡走（非句级点亮）/ 椒红主调铜金辅（非金咖主调）
// 屏内容：制作中秋家宴券（① 券面 4 行 + ② 期限 3 行含固定有效期 hero + ③ 到期提醒 2 行）
// 字段名逐字回 spec/coupon-fields.json；数值为示例（顶部标注，C-11 挂顶部不放屏底）。骨架全内联本文件。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE } from '../palette';
import { EASE_OUT, SPRING_CONFIG } from '../components/animations';
import { Drift, PushIn } from '../components/camera';

// ── hotpot-red 色板（深红棕底 + 米纸 + 椒红 + 铜金）──
const BG = '#2B1613';            // 深红棕底
const BG2 = '#3A1D17';           // 稍亮中心
const RED = '#C8342B';           // 椒红（主强调）
const BRONZE = '#C89B3C';        // 铜金（描边/组头/流光）
const PAPER = '#FBF3E4';         // 米纸卡底
const INK = '#3A231A';           // 卡上深棕字
const MUTED = '#A8837A';         // 次要（深底上）
const GOLD_SOFT = 'rgba(200,155,60,0.55)';

// ── 底层：等位屏点阵 + 牌匾金框（2026-09-03 重做：用户否决与 g07 同构的「柔光晕+波浪线」背景）──
// g07 背景 = 椭圆 radial 聚光底 + 圆形光晕呼吸 + 底部波浪曲线（连续·有机·柔和）。
// 本片整套反转 = 垂直线性渐变底 + LED 红点阵网格（等位叫号屏抽象）+ 双线金框·四角金钉（挂墙档期牌），
// 离散·规则·直线——点阵呼应等位屏，金框金钉呼应号牌卡签名记号，与 g07 零同构。
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const dotO = 0.10 + (Math.sin(f / 62) * 0.5 + 0.5) * 0.07; // 点阵呼吸（LED 待机微光，帧间差不归零）
  return (
    <>
      {/* 深红棕垂直渐变底（线性铺陈，非 g07 椭圆聚光） */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${BG2} 0%, ${BG} 100%)` }} />
      {/* 等位屏点阵：红色像素网格（LED 叫号屏抽象） */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, rgba(200,52,43,${dotO}) 2.5px, transparent 2.5px)`,
        backgroundSize: '52px 52px',
      }} />
      {/* 牌匾金框：外粗内细双线（整屏裱成一块挂墙的档期牌） */}
      <div style={{ position: 'absolute', inset: 34, border: `2px solid rgba(200,155,60,0.38)`, borderRadius: 6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 45, border: `1px solid rgba(200,155,60,0.16)`, borderRadius: 3, pointerEvents: 'none' }} />
      {/* 四角金钉（挂钉——号牌卡签名记号在背景层的延伸） */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([ex, ey], i) => (
        <span key={i} style={{
          position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: BRONZE,
          boxShadow: '0 2px 5px rgba(0,0,0,0.45)', pointerEvents: 'none',
          left: ex < 0 ? 27 : undefined, right: ex > 0 ? 27 : undefined,
          top: ey < 0 ? 27 : undefined, bottom: ey > 0 ? 27 : undefined,
        }} />
      ))}
    </>
  );
};

// ── 落章入场：整块微过冲弹跳落定（damping 低，"啪"地盖上）──
const Stamp: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 13, stiffness: 170 } });
  if (f < delay) return null;
  return (
    <div style={{ transform: `scale(${interpolate(s, [0, 1], [1.14, 1])}) rotate(${interpolate(s, [0, 1], [-1.6, 0])}deg)`, opacity: interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }), ...style }}>
      {children}
    </div>
  );
};

// ── 锅底单一行：勾选格 + 字段名 + 右对齐值（红色细虚线分隔，无 g07 点线）──
const DipRow: React.FC<{ name: string; value: string; delay: number; hero?: boolean; tag?: string; indent?: boolean }> = ({ name, value, delay, hero, tag, indent }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 15, stiffness: 180 } });
  if (f < delay) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, padding: hero ? '20px 24px' : `12px 16px 12px ${indent ? 56 : 16}px`,
      background: hero ? RED : 'transparent', borderRadius: hero ? 10 : 0,
      borderBottom: hero ? 'none' : '2px dashed rgba(200,52,43,0.28)',
      transform: `scale(${interpolate(s, [0, 1], [0.94, 1])}) rotate(${interpolate(s, [0, 1], [-1.2, 0])}deg)`, opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      {/* 勾选格（锅底单记号；hero 行用实心红块替代） */}
      <span style={{
        width: 30, height: 30, borderRadius: 6, flexShrink: 0,
        border: hero ? 'none' : `2.5px solid rgba(200,52,43,0.55)`, background: hero ? PAPER : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_TITLE, fontSize: 22, color: RED,
      }}>{hero ? '★' : ''}</span>
      <span style={{ fontSize: 33, fontWeight: 700, color: hero ? PAPER : INK, letterSpacing: 2 }}>{name}</span>
      {tag && <span style={{ fontSize: 22, color: RED, border: `2px solid ${RED}`, borderRadius: 999, padding: '3px 14px', letterSpacing: 2, fontWeight: 700 }}>{tag}</span>}
      <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: hero ? 40 : 36, color: hero ? PAPER : RED, letterSpacing: 1, textAlign: 'right' }}>{value}</span>
    </div>
  );
};

// ── 组头：铜金小号 + 名称 + 两侧对称线（中轴对称语言）──
const GroupHead: React.FC<{ no: string; name: string; delay: number }> = ({ no, name, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  if (f < delay) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <span style={{ flex: 1, height: 2, background: 'linear-gradient(to right, transparent, rgba(200,52,43,0.4))' }} />
      <span style={{ fontFamily: FONT_TITLE, fontSize: 30, color: BRONZE, letterSpacing: 3 }}>
        <span style={{ fontSize: 24, marginRight: 10 }}>{no}</span>{name}
      </span>
      <span style={{ flex: 1, height: 2, background: 'linear-gradient(to left, transparent, rgba(200,52,43,0.4))' }} />
    </div>
  );
};

// ── 一屏标杆：制作中秋家宴券 · 固定有效期 ──
export const G08Bench: React.FC = () => {
  const f = useCurrentFrame();
  // 金线流光沿卡边巡走（停留期边框微动）
  const sweep = ((f * 6) % 1800) - 300;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Drift depth={0.4} amplitude={3} seed="g08-bg">
        <Ambient />
      </Drift>
      <PushIn>
        {/* 顶部：eyebrow + 合规角标（C-11 顶部，不放屏底） */}
        <div style={{ position: 'absolute', left: 84, top: 96, fontSize: 26, color: MUTED, letterSpacing: 4 }}>🔥 券到火锅 · 中秋档期</div>
        <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>示例</div>

        {/* 牌匾横匾：金双线框 + 椒红底金字，落章定场 */}
        <Stamp delay={6} style={{ position: 'absolute', left: 170, right: 170, top: 180 }}>
          <div style={{
            background: RED, borderRadius: 14, padding: '26px 20px', textAlign: 'center',
            border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${PAPER}, 0 18px 40px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 74, color: PAPER, letterSpacing: 10 }}>制作中秋家宴券</div>
          </div>
        </Stamp>
        <div style={{ position: 'absolute', left: 84, right: 84, top: 336, textAlign: 'center', fontSize: 26, color: MUTED, letterSpacing: 2 }}>
          券到卡包 · 中秋家宴 · 数值为示例
        </div>

        {/* 号牌卡：米纸底 + 双线金边 + 四角金钉，落章入场 */}
        <Stamp delay={30} style={{ position: 'absolute', left: 84, right: 84, top: 410 }}>
          <div style={{ position: 'relative', background: PAPER, borderRadius: 18, padding: '14px 8px 30px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 8px ${PAPER}, inset 0 0 0 9.5px ${GOLD_SOFT}, 0 24px 52px rgba(0,0,0,0.5)` }}>
            {/* 四角金钉（本片签名记号） */}
            {[[18, 18], [18, undefined], [undefined, 18], [undefined, undefined]].map(([t, l], i) => (
              <span key={i} style={{
                position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: BRONZE,
                top: t, bottom: t === undefined ? 18 : undefined, left: l, right: l === undefined ? 18 : undefined,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            ))}
            {/* 金线流光沿卡边巡走（停留期微动） */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: -40, left: sweep, width: 220, height: 60, background: `linear-gradient(100deg, transparent, rgba(200,155,60,0.35), transparent)`, transform: 'rotate(6deg)' }} />
            </div>

            <div style={{ padding: '26px 44px 0' }}>
              <GroupHead no="01" name="券面" delay={48} />
              <DipRow name="优惠券名称" value="中秋家宴券" delay={60} />
              <DipRow name="消费门槛" value="满 150 元可用" delay={74} />
              <DipRow name="优惠金额" value="减 30 元" delay={88} />
              <DipRow name="制作数量" value="200 张" delay={102} />

              <GroupHead no="02" name="期限" delay={122} />
              <DipRow name="有效期类型" value="固定有效期" delay={136} hero tag="节日专属" />
              <DipRow name="有效开始时间" value="9 月 25 日" delay={158} indent />
              <DipRow name="有效结束时间" value="9 月 28 日" delay={172} indent />

              <GroupHead no="03" name="到期提醒" delay={192} />
              <DipRow name="到期提醒" value="开" delay={206} />
              <DipRow name="提前提醒" value="提前 3 天" delay={220} />
            </div>
          </div>
        </Stamp>

        {/* 底部品牌一行（不做页脚小字，随字幕道上方留白区居中，单行品牌署名） */}
        <div style={{ position: 'absolute', left: 84, right: 84, bottom: 170, textAlign: 'center' }}>
          <Stamp delay={250}>
            <span style={{ display: 'inline-block', fontFamily: FONT_TITLE, fontSize: 34, color: BRONZE, letterSpacing: 10, border: `3px solid ${BRONZE}`, borderRadius: 12, padding: '10px 30px', transform: 'rotate(-1.5deg)' }}>券到卡包</span>
          </Stamp>
        </div>
      </PushIn>
    </AbsoluteFill>
  );
};

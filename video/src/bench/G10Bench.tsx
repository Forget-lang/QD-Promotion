// g10 美容沙龙 · 一屏标杆 ·「护理邀请卡」语言（hero-object）
// 整套反 g09（deep-blue / 次卡字段 form 清单：左标签右白药丸值 + 编号绿分节 + 右侧 toggle）：
//   ① 呈现架构：单张实体邀请卡为主角 + 右侧引线标注（hero-object），非逐行表单清单（form）
//   ② 容器：竖版圆角邀请卡 + 缎带顶 + 撕齿 + 磁条底栏（社交信物），非横版磁条次卡
//   ③ 强调：缎带色块 + 引线，非 g09 绿色胶囊 tag
//   ④ 底色：粉晕光弧浅底（暖粉紫），非蓝绿光斑冷底
// 字段名逐字回 ../applet/pages_coupon/coupon/create.vue；数值为示例（画面零面包屑、零示例标，示例性由口播教学语气承载）。骨架全内联本文件。
import React from 'react';
import {
  AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame,
} from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';
import { EASE_OUT } from '../components/animations';
import { Ico } from '../components/icons';

const ACCENT = '#AB47BC';
const ACCENT_DK = '#8e24aa';
const INK = '#2a1830';
const MUTED = 'rgba(42,24,48,0.55)';
const CARD_FACE = '#ffffff';
const RIBBON = 'rgba(171,71,188,0.12)';
const LINE = 'rgba(171,71,188,0.4)';

// ── 底层：粉晕光弧背景图（前景兼容验证用真底）+ 柔光呼吸 ──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.10 + (Math.sin(f / 80) * 0.5 + 0.5) * 0.06;
  return (
    <>
      <Img src={staticFile('backgrounds/g10/bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'rgba(250,245,251,0.28)' }} />
      <div style={{ position: 'absolute', left: 60, top: 120, width: 960, height: 620, borderRadius: '50%', background: `radial-gradient(circle, rgba(171,71,188,${o}) 0%, transparent 68%)`, pointerEvents: 'none' }} />
    </>
  );
};

// ── 整卡「递入」：从左上滑入 + 微旋回正（母题入场语法）──
const CardIn: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ opacity: p, transform: `translate(${(1 - p) * -60}px, ${(1 - p) * -40}px) rotate(${(1 - p) * -5}deg)` }}>
      {children}
    </div>
  );
};

const FaceRow: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{children}</div>;
};

// 卡面一行：左标签 · 右值 chip
const Field: React.FC<{ label: string; value: string; hero?: boolean; delay: number }> = ({ label, value, hero, delay }) => (
  <FaceRow delay={delay}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '25px 0', borderTop: `1px solid rgba(171,71,188,0.14)` }}>
      <span style={{ fontSize: 30, color: MUTED, letterSpacing: 1 }}>{label}</span>
      <span style={{
        fontSize: hero ? 33 : 30, fontWeight: 700, color: hero ? '#fff' : INK,
        background: hero ? ACCENT : RIBBON, padding: hero ? '10px 22px' : '8px 18px',
        borderRadius: 12, letterSpacing: 1, fontFamily: FONT_TITLE,
      }}>{value}</span>
    </div>
  </FaceRow>
);

// 使用须知：明细的家（≤500 字），卡内展开成真实几行
const Notice: React.FC<{ delay: number }> = ({ delay }) => {
  const lines = ['· 深层清洁 + 肩颈放松', '· 约 60 分钟 · 需提前预约', '· 每位闺蜜首享一次'];
  return (
    <FaceRow delay={delay}>
      <div style={{ padding: '20px 0 6px', borderTop: `1px solid rgba(171,71,188,0.14)` }}>
        <div style={{ fontSize: 30, color: MUTED, letterSpacing: 1, marginBottom: 10 }}>使用须知</div>
        {lines.map((t, i) => (
          <div key={i} style={{ fontSize: 27, color: INK, lineHeight: 1.7, letterSpacing: 0.5 }}>{t}</div>
        ))}
      </div>
    </FaceRow>
  );
};

// 右侧引线标注
const Callout: React.FC<{ delay: number; top: number; title: string; body: React.ReactNode }> = ({ delay, top, title, body }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', right: 56, top, width: 372, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <svg width="76" height="2" style={{ position: 'absolute', left: -80, top: 18 }}><line x1="0" y1="1" x2="76" y2="1" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" /></svg>
      <div style={{ fontSize: 25, color: ACCENT_DK, fontWeight: 800, letterSpacing: 0.5, marginBottom: 6, fontFamily: FONT_TITLE }}>{title}</div>
      <div style={{ fontSize: 27, color: INK, lineHeight: 1.44 }}>{body}</div>
    </div>
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f - 4, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 64, right: 64, top: 128, opacity: p }}>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 82, color: INK, letterSpacing: 3, lineHeight: 1.08 }}>先做这张体验邀请卡</div>
      <div style={{ marginTop: 18, height: 3, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, borderRadius: 2 }} />
    </div>
  );
};

// 底部注意卡（缎带框，非漂浮白卡）
const Note: React.FC<{ delay: number }> = ({ delay }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 64, right: 64, top: 1400, opacity: p }}>
      <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 18, padding: '26px 32px', background: 'rgba(171,71,188,0.07)', display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ width: 38, height: 38, flexShrink: 0, display: 'inline-block' }}>{Ico.users(ACCENT_DK)}</span>
        <div style={{ fontSize: 30, color: INK, lineHeight: 1.42 }}>
          这套玩法天生要<span style={{ color: ACCENT_DK, fontWeight: 800 }}>两张券</span>：这张体验券当「转赠物」，还得另做一张私密券当「奖励」。
        </div>
      </div>
    </div>
  );
};

export const G10Bench: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: '#faf5fb' }}>
      <Ambient />
      <Header />

      {/* ── HERO：护理邀请卡（竖版 · 缎带顶 · 撕齿 · 磁条底）── */}
      <div style={{ position: 'absolute', left: 64, top: 356, width: 548 }}>
        <CardIn delay={20}>
          <div style={{ background: CARD_FACE, borderRadius: 26, boxShadow: '0 22px 54px rgba(120,60,140,0.24)', overflow: 'hidden', border: '1px solid rgba(171,71,188,0.18)' }}>
            <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`, padding: '30px 38px 34px', position: 'relative' }}>
              <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', letterSpacing: 3 }}>护理体验 · 邀请卡</div>
              <div style={{ marginTop: 8, fontSize: 46, color: '#fff', fontFamily: FONT_TITLE, letterSpacing: 2 }}>闺蜜护理体验券</div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 16, background: 'radial-gradient(circle at 8px 16px, transparent 8px, #fff 8px) repeat-x', backgroundSize: '20px 16px' }} />
            </div>
            <div style={{ padding: '28px 38px 6px' }}>
              <Field label="兑换内容" value="深层清洁护理" hero delay={44} />
              <Notice delay={62} />
              <Field label="发放方式" value="私密发放" delay={104} />
              <Field label="每人限领总量" value="1 张" delay={122} />
              <Field label="有效期" value="15 天" delay={138} />
            </div>
            <div style={{ marginTop: 20, height: 58, background: `repeating-linear-gradient(90deg, ${ACCENT_DK} 0 10px, transparent 10px 18px)`, opacity: 0.85 }} />
          </div>
        </CardIn>
      </div>

      {/* ── 右侧引线标注：为什么这么设 ── */}
      <Callout delay={54} top={560} title="兑换内容 · 只有 10 个字" body={<>装不下服务明细，<span style={{ color: ACCENT_DK, fontWeight: 700 }}>明细写进「使用须知」</span>——兑换券最容易讲错的一条。</>} />
      <Callout delay={110} top={920} title="发放方式 · 先发给老客" body={<>私密发放一对一给到老客，<span style={{ color: ACCENT_DK, fontWeight: 700 }}>她才能转赠给闺蜜</span>；此项创建后改不了。</>} />
      <Callout delay={144} top={1180} title="有效期 · 给个期限" body={<>设 15 天，逼老客及时转赠、闺蜜及时到店，<span style={{ color: ACCENT_DK, fontWeight: 700 }}>券不睡死</span>。</>} />

      <Note delay={168} />
    </AbsoluteFill>
  );
};

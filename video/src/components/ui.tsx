// 通用 UI 组件（仅提效，非模板）· 2026-08-17 专业级优化 · 2026-08-20 质感升级 + 内容四件套
// - 质感积木：CharReveal / AccentWord / IconBadge / PhoneMockup / elevation
// - 内容四件套：CouponCard / StatCounter+StatCard / StepFlow / CompareCard
//   （生长机制见 workflow/craft.md；组件与产品 UI 对齐状态见 docs/internal/R4-applet前端UI储备.md §8）
// - 2026-08-29 按 applet 真值校准：CouponCard 金额右置 + 删假条码；PhoneMockup 新增 nav 顶栏
import React from 'react';
import { interpolate, interpolateColors, spring, useCurrentFrame } from 'remotion';
import { ACCENT_GREEN, ACCENT_RED, FONT_BODY, FONT_TITLE, FPS, INK, NAV_RED, PAPER } from '../palette';
import { EASE_OUT, EASE_IN, SPRING_CONFIG } from './animations';
import { Ico } from './icons';
import type { IconKey } from './icons';
import type { MotionKey } from '../types';

/** 三级投影（浅底/深底两套），全片光影方向统一向下 */
export const elevation = (level: 1 | 2 | 3, dark = false): string => {
  const light = ['0 2px 8px rgba(15,17,21,0.08)', '0 12px 36px rgba(15,17,21,0.12)', '0 24px 64px rgba(15,17,21,0.20)'];
  const darkShadows = ['0 2px 10px rgba(0,0,0,0.30)', '0 12px 36px rgba(0,0,0,0.38)', '0 24px 64px rgba(0,0,0,0.52)'];
  return (dark ? darkShadows : light)[level - 1];
};

/** 逐字 mask 入场：每字从下方 reveal，stagger 默认 2 帧（大标题专用，贵感来源） */
export const CharReveal: React.FC<{
  text: string; delay?: number; stagger?: number; duration?: number; style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 2, duration = 14, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'inline-block', ...style }}>
      {text.split('').map((ch, i) => {
        const p = interpolate(f - delay - i * stagger, [0, duration], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
        });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
            <span style={{
              display: 'inline-block',
              transform: `translateY(${(1 - p) * 110}%)`,
              opacity: Math.min(1, p * 1.6),
            }}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
};

/** 重音词大字：字号 + 颜色同时弹入（对齐口播重音帧使用，位置由各视频设计稿决定） */
export const AccentWord: React.FC<{
  text: string; color: string; delay?: number; peak?: number; family?: string; motion?: MotionKey;
}> = ({ text, color, delay = 0, peak = 96, family = FONT_TITLE, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  const c = interpolateColors(spr, [0, 1], [INK, color]);
  return (
    <div style={{
      fontFamily: family, fontSize: peak, fontWeight: 900, color: c, lineHeight: 1.1,
      transform: `scale(${interpolate(spr, [0, 1], [0.55, 1])})`,
      opacity: interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      textShadow: `0 6px 30px ${color}44`, display: 'inline-block',
    }}>
      {text}
    </div>
  );
};

/** 图标容器：squircle 底 + 主色 tint + 内高光（图标不裸放，G03 起统一用） */
export const IconBadge: React.FC<{
  icon: IconKey; color: string; size?: number; pad?: number; radius?: number;
}> = ({ icon, color, size = 90, pad = 20, radius = 26 }) => (
  <div style={{
    width: size, height: size, backgroundColor: `${color}1c`, borderRadius: radius, padding: pad,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 6px ${color}22`,
  }}>
    {Ico[icon](color)}
  </div>
);

/** 手机样机：内嵌产品真实 UI 用（bezel + 灵动岛 + 玻璃高光），场景内 children 自由设计。
 *  传 `nav` 才在壳内顶部补产品顶栏（演示"真界面"时应传）：
 *  - `brand`：顶栏红底白字 = applet `pages.json` globalStyle 全站默认
 *  - `light`：浅底黑字 = 10 个页面显式覆盖的 `#f6f6f6`（我的卡包 / 券包 / 次卡系列 / 券详情 / 我的商家）
 *  胶囊为自绘（返回 + 分隔线 + 首页），规格对齐 applet `m-navigation-bar.vue`；顶栏一律手写复刻，不贴真实截图。 */
export const PhoneMockup: React.FC<{
  children: React.ReactNode; width?: number; height?: number;
  nav?: { title?: string; variant?: 'brand' | 'light' };
}> = ({ children, width = 560, height = 1140, nav }) => {
  const rpx = (width - 28) / 750;
  const NAV_H = 88 * rpx;
  const chromeH = Math.round(176 * rpx);
  const light = nav?.variant === 'light';
  const barBg = light ? '#f6f6f6' : NAV_RED;
  const fg = light ? '#333' : '#fff';
  return (
    <div style={{
      width, height, borderRadius: 64, padding: 14, backgroundColor: '#101216',
      boxShadow: `${elevation(3, true)}, inset 0 1px 0 rgba(255,255,255,0.18)`,
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 50, overflow: 'hidden',
        position: 'relative', backgroundColor: '#fff',
      }}>
        {nav && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: chromeH, backgroundColor: barBg }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height: NAV_H,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 34 * rpx, fontWeight: 600, color: fg, letterSpacing: '0.01em',
              }}>{nav.title || '券到卡包'}</span>
            </div>
            <div style={{
              position: 'absolute', right: 20 * rpx, bottom: 12 * rpx, width: 174 * rpx, height: 64 * rpx,
              borderRadius: 32 * rpx, backgroundColor: light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.24)',
              border: `0.5px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.28)'}`,
              display: 'flex', alignItems: 'center', boxSizing: 'border-box',
            }}>
              <svg width={40 * rpx} height={40 * rpx} viewBox="0 0 24 24" fill="none" style={{ flex: 1 }}>
                <path d="M15 5l-7 7 7 7" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ width: 1, height: 18 * rpx, backgroundColor: fg, opacity: 0.3 }} />
              <svg width={34 * rpx} height={34 * rpx} viewBox="0 0 24 24" fill="none" style={{ flex: 1 }}>
                <path d="M4 10.5L12 4l8 6.5V20H4v-9.5z" stroke={fg} strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
        <div style={{
          position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 32, borderRadius: 16, backgroundColor: '#101216', zIndex: 10,
        }} />
        <div style={{ position: 'absolute', top: nav ? chromeH : 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
};


/** 券面卡片：票券标准件（内容在左 + 大字金额在右 + 虚线分隔 + 两侧缺口）。
 *  布局对齐真产品：`m-coupon-tpl` / 首页券票 / 券详情三段式均为金额右置（`max-width:230rpx; text-align:right`）。
 *  holeColor 必须传「卡片底下的场景背景色」才能在卡边打出缺口，不传则无缺口。
 *  不放条码：真产品全 App 无条形码，核销码是后端返回的二维码图片 + 数字卡号。 */
export const CouponCard: React.FC<{
  title: string; amount?: string; validity?: string; note?: string;
  accent: string; width?: number; delay?: number; dark?: boolean; holeColor?: string; motion?: MotionKey;
}> = ({ title, amount, validity, note, accent, width = 560, delay = 0, dark = false, holeColor, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  const PAD = 32;
  return (
    <div style={{
      width, padding: PAD, borderRadius: 28,
      backgroundColor: dark ? 'rgba(255,255,255,0.07)' : PAPER,
      boxShadow: `${elevation(2, dark)}, inset 0 1px 0 rgba(255,255,255,${dark ? 0.12 : 0.6})`,
      transform: `translateY(${(1 - spr) * 24}px) scale(${0.92 + spr * 0.08}) rotate(${(1 - spr) * -2}deg)`,
      opacity: interpolate(spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ flex: 1, textAlign: amount ? 'left' : 'center' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 32, fontWeight: 700, color: dark ? '#fff' : INK, lineHeight: 1.3 }}>{title}</div>
          {note && <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: dark ? 'rgba(255,255,255,0.55)' : '#777', marginTop: 8 }}>{note}</div>}
        </div>
        {amount && (
          <div style={{
            flexShrink: 0, maxWidth: 330, textAlign: 'right',
            fontFamily: FONT_TITLE, fontSize: 84, fontWeight: 900, color: accent,
            lineHeight: 1, letterSpacing: '-0.02em',
          }}>{amount}</div>
        )}
      </div>
      <div style={{ position: 'relative', margin: '28px 0 20px' }}>
        <div style={{ borderTop: `2px dashed ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.14)'}` }} />
        {holeColor && <>
          <div style={{ position: 'absolute', left: -(PAD + 10), top: -10, width: 20, height: 20, borderRadius: '50%', backgroundColor: holeColor }} />
          <div style={{ position: 'absolute', right: -(PAD + 10), top: -10, width: 20, height: 20, borderRadius: '50%', backgroundColor: holeColor }} />
        </>}
      </div>
      {validity && (
        <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: dark ? 'rgba(255,255,255,0.55)' : '#888' }}>{validity}</div>
      )}
    </div>
  );
};

/** 数字滚动：0→value 计数入场。只用于真实可述口径（发了多少张/用了多少张/第几天），禁止虚构营销数据 */
export const StatCounter: React.FC<{
  value: number; suffix?: string; delay?: number; duration?: number; color?: string; size?: number;
}> = ({ value, suffix, delay = 0, duration = 18, color = INK, size = 88 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return (
    <div style={{
      fontFamily: FONT_TITLE, fontSize: size, fontWeight: 900, color, lineHeight: 1,
      fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline',
    }}>
      {Math.round(value * p)}
      {suffix && <span style={{ fontSize: size * 0.38, marginLeft: 8, fontWeight: 800 }}>{suffix}</span>}
    </div>
  );
};

/** 数据卡：图标 + 标签 + 滚动数字 + 说明，grid/panel 数据屏通用 */
export const StatCard: React.FC<{
  label: string; value: number; suffix?: string; caption?: string; icon?: IconKey;
  accent: string; delay?: number; dark?: boolean; width?: number; motion?: MotionKey;
}> = ({ label, value, suffix, caption, icon, accent, delay = 0, dark = false, width = 300, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      width, padding: '32px 28px', borderRadius: 24,
      backgroundColor: dark ? 'rgba(255,255,255,0.07)' : PAPER,
      boxShadow: `${elevation(1, dark)}, inset 0 1px 0 rgba(255,255,255,${dark ? 0.12 : 0.6})`,
      textAlign: 'center',
      transform: `translateY(${(1 - spr) * 20}px)`,
      opacity: interpolate(spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      {icon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <IconBadge icon={icon} color={accent} size={72} pad={16} radius={20} />
        </div>
      )}
      <div style={{ fontFamily: FONT_BODY, fontSize: 26, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.65)' : '#777', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <StatCounter value={value} suffix={suffix} delay={delay + 4} color={accent} size={80} />
      </div>
      {caption && <div style={{ fontFamily: FONT_BODY, fontSize: 22, color: dark ? 'rgba(255,255,255,0.5)' : '#999', marginTop: 10 }}>{caption}</div>}
    </div>
  );
};

/** 步骤条：连接线擦入 + 步骤逐个弹入（图标 + 标题 + 说明），flow 屏通用 */
export const StepFlow: React.FC<{
  steps: { icon: IconKey; title: string; note?: string }[];
  accent: string; delay?: number; stagger?: number; dark?: boolean; width?: number; motion?: MotionKey;
}> = ({ steps, accent, delay = 0, stagger = 10, dark = false, width = 960, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const badgeSize = 92;
  const colW = width / steps.length - 24;
  const lineP = interpolate(f - delay, [0, (steps.length - 1) * stagger + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return (
    <div style={{ position: 'relative', width, display: 'flex', justifyContent: 'space-between' }}>
      <div style={{
        position: 'absolute', top: badgeSize / 2 - 2, left: colW / 2, right: colW / 2,
        height: 4, borderRadius: 2,
        backgroundColor: dark ? 'rgba(255,255,255,0.16)' : `${accent}30`,
        transform: `scaleX(${lineP})`, transformOrigin: 'left center',
      }} />
      {steps.map((s, i) => {
        const spr = spring({ frame: f - delay - i * stagger, fps: FPS, config: SPRING_CONFIG[motion] });
        return (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: colW,
            opacity: interpolate(spr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `scale(${0.6 + spr * 0.4})`,
          }}>
            <IconBadge icon={s.icon} color={accent} size={badgeSize} radius={26} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 30, fontWeight: 800, color: dark ? '#fff' : INK, marginTop: 18 }}>{s.title}</div>
            {s.note && (
              <div style={{ fontFamily: FONT_BODY, fontSize: 23, color: dark ? 'rgba(255,255,255,0.55)' : '#888', marginTop: 6, textAlign: 'center', lineHeight: 1.4 }}>{s.note}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** 左右对比卡：痛点(红) vs 解法(主色，默认绿)，中缝 VS 徽章，左卡左入/右卡右入/条目错帧 */
export const CompareCard: React.FC<{
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
  accent?: string; delay?: number; dark?: boolean; width?: number; motion?: MotionKey;
}> = ({ left, right, accent = ACCENT_GREEN, delay = 0, dark = false, width = 940, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const cardW = (width - 56) / 2;
  const enterOpacity = interpolate(f - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const vsSpr = spring({ frame: f - delay - 16, fps: FPS, config: SPRING_CONFIG[motion] });

  const renderSide = (
    cfg: { title: string; items: string[] }, color: string, iconKey: 'x' | 'check', dir: -1 | 1,
  ) => (
    <div style={{
      width: cardW, padding: '30px 28px', borderRadius: 24,
      backgroundColor: dark ? 'rgba(255,255,255,0.07)' : PAPER,
      boxShadow: `${elevation(1, dark)}, inset 0 1px 0 rgba(255,255,255,${dark ? 0.12 : 0.6})`,
      transform: `translateX(${interpolate(f - delay, [0, 14], [dir * 60, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
      })}px)`,
      opacity: enterOpacity,
    }}>
      <div style={{
        display: 'inline-block', fontFamily: FONT_BODY, fontSize: 30, fontWeight: 800, color,
        padding: '6px 18px', borderRadius: 12, backgroundColor: `${color}18`, marginBottom: 20,
      }}>{cfg.title}</div>
      {cfg.items.map((it, i) => {
        const ip = interpolate(f - delay - 10 - i * 3, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
        });
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, opacity: ip, transform: `translateX(${(1 - ip) * 16}px)` }}>
            <div style={{ width: 26, height: 26, flexShrink: 0 }}>{Ico[iconKey](color)}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 26, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.85)' : '#333', lineHeight: 1.4 }}>{it}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: 'relative', width, display: 'flex', justifyContent: 'space-between' }}>
      {renderSide(left, ACCENT_RED, 'x', -1)}
      {renderSide(right, accent, 'check', 1)}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) scale(${0.4 + vsSpr * 0.6})`,
        width: 92, height: 92, borderRadius: '50%',
        backgroundColor: dark ? '#1f2238' : PAPER,
        boxShadow: elevation(2, dark),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_TITLE, fontSize: 34, fontWeight: 900, color: dark ? '#fff' : INK,
        opacity: interpolate(vsSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
      }}>VS</div>
    </div>
  );
};


/** 段落标题（大，带可选装饰下划线，wipe 擦入） */
export const SectionTitle: React.FC<{ text: string; color?: string; size?: number; underline?: string }> = ({
  text, color = INK, size = 64, underline,
}) => {
  const f = useCurrentFrame();
  // 中文字符 ≈ fontSize 宽度，标点/数字约 0.55×；下划线取标题宽度的 55%（装饰比例，非等宽）
  const targetWidth = Math.min(text.length * size * 0.55, 380);
  const w = interpolate(f, [6, 28], [0, targetWidth], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT_TITLE, fontSize: size, fontWeight: 900,
        color, lineHeight: 1.15, padding: '0 48px',
        letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
        textShadow: color === PAPER ? '0 2px 20px rgba(0,0,0,0.35)' : 'none',
      }}>
        <CharReveal text={text} delay={2} />
      </div>
      {underline && (
        <div style={{
          height: 7, width: w,
          margin: '18px auto 0',
          backgroundColor: underline, borderRadius: 4,
        }} />
      )}
    </div>
  );
};

/**
 * 底部多行字幕（帧级精确同步）
 * - 位置：底部安全区，距底部 60px
 * - 白色字 + 黑色描边，任何背景下都清晰
 * - 每行独立的 startFrame / endFrame，跟口播逐行对齐
 * - 入场：淡入 + 轻微上浮；出场：淡出 + 轻微下沉
 * - 最多同时显示 2 行（避免遮挡画面）
 */
export const Subtitle: React.FC<{ lines: { text: string; startFrame: number; endFrame: number }[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const FADE_FRAMES = 6;

  // 过滤出当前帧应该显示的行
  const activeLines = lines
    .map((line, i) => ({ ...line, index: i }))
    .filter((line) => f >= line.startFrame && f <= line.endFrame);

  // 最多显示最后 2 行（最新的两句），避免堆太多行
  const visibleLines = activeLines.slice(-2);

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 60,
      textAlign: 'center',
      padding: '0 60px',
      pointerEvents: 'none',
    }}>
      {visibleLines.map((line) => {
        const lineAge = visibleLines.length - 1 - visibleLines.indexOf(line); // 最新一行在最下面 = 0
        // 入场：startFrame 开始淡入
        const entranceProgress = interpolate(f, [line.startFrame, line.startFrame + FADE_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        // 出场：endFrame 前 FADE_FRAMES 开始淡出
        const exitProgress = interpolate(f, [line.endFrame - FADE_FRAMES, line.endFrame], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_IN,
        });
        const opacity = Math.min(entranceProgress, exitProgress);
        const translateY = interpolate(opacity, [0, 1], [6, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={line.index}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              marginBottom: 8,
            }}
          >
            <span style={{
              fontFamily: FONT_BODY,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#ffffff',
              textShadow: `
                -2px -2px 0 rgba(0,0,0,0.8),
                 2px -2px 0 rgba(0,0,0,0.8),
                -2px  2px 0 rgba(0,0,0,0.8),
                 2px  2px 0 rgba(0,0,0,0.8),
                 0 3px 12px rgba(0,0,0,0.5)
              `,
              letterSpacing: 1,
            }}>
              {line.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** 手写高亮文字（R3 §5.6 呈现手法 ref-02）：大字 + 半透明高亮条（微倾斜 2°）+ 可选波浪下划线 */
export const HighLightText: React.FC<{
  text: string;
  color: string;              // 高亮条颜色
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  wavy?: boolean;             // 波浪下划线
  delay?: number;
  motion?: MotionKey;
  style?: React.CSSProperties;
}> = ({ text, color, textColor = '#1a1a1a', fontSize = 44, fontWeight = 900, wavy, delay = 0, motion = 'snappy', style }) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <span style={{ position: 'relative', display: 'inline-block', transform: `translateY(${(1 - spr) * 14}px)`, opacity: spr, ...style }}>
      {/* 半透明高亮条（微倾斜，ref-02 荧光笔感） */}
      <span style={{
        position: 'absolute', left: -10, right: -10, top: '46%', height: '42%',
        background: hexToRgbaLocal(color, 0.38),
        transform: 'rotate(-1.8deg)', borderRadius: 6, pointerEvents: 'none',
      }} />
      {/* 主文字 */}
      <span style={{
        position: 'relative', zIndex: 1,
        fontFamily: FONT_TITLE, fontSize, fontWeight, color: textColor, lineHeight: 1.25,
      }}>{text}</span>
      {/* 波浪下划线（SVG，ref-02 第二层级标记） */}
      {wavy && (
        <svg width="100%" height="14" viewBox="0 0 120 14" preserveAspectRatio="none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: -14 }}>
          <path d="M0 7 Q 7.5 0 15 7 T 30 7 T 45 7 T 60 7 T 75 7 T 90 7 T 105 7 T 120 7"
            fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
};

/** 本地 hex→rgba（HighLightText 内部用，不导出） */
const hexToRgbaLocal = (hex: string, alpha: number): string => {
  const v = String(hex || '').replace('#', '');
  if (v.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * G04 美容院 · 发布封面（竖版 1080×1920 + 搜狐横版 1920×1080）
 * - C-05 痛点场景型：大问句钩子 + 行业元素 + 品牌角标
 * 依据：outputs/g04-美容院/03-封面文案包.md（设计稿 2.9）
 * 规则：M3 §2 封面规范（安全区 / 主色≤2 / 对比度 / 无免费角标 / 品牌克制 / 代码渲染矢量字）
 * 背景：BG-ABS-003 粉雾网格渐变底（浅底深字）
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const INK = '#3E2060';      // 深紫（主标题）
const ACCENT = '#9B7FBF';   // 粉紫（副标题/强调）
const DARK = '#2a1a2e';     // 品牌角标深色
const PAPER = '#ffffff';
const BG = staticFile('backgrounds/g04/bg.png');

const FONT_TITLE = "'DeyiHei', sans-serif";
const FONT_BODY = "'Alibaba PuHuiTi 3', sans-serif";
const FONT_ROUND = "'Alimama FangYuan', sans-serif";

/** 次卡磁面小图形（封面视觉锚点，参考真实产品磁条卡面：光晕+渐变蒙层+卡名+次数+徽章/有效期） */
const MiniCard: React.FC<{ size?: number }> = ({ size = 240 }) => {
  const cardW = size;
  const cardH = size * 0.74;
  const theme = '#3E2060';
  return (
    <div style={{
      width: cardW, height: cardH, borderRadius: cardH * 0.07,
      background: `linear-gradient(145deg, ${theme}, #5B3A8A)`,
      boxShadow: `0 18px 44px rgba(62,32,96,0.32)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* 磁卡质感：右上光晕 + 主题色渐变蒙层 */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 88% 6%, rgba(255,255,255,0.22) 0%, transparent 54%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(62,32,96,0.15) 0%, transparent 42%, rgba(0,0,0,0.16) 100%)' }} />
      {/* 右上商户名 */}
      <div style={{
        position: 'absolute', top: cardH * 0.07, right: cardW * 0.07,
        fontFamily: FONT_BODY, fontSize: cardW * 0.045, fontWeight: 500,
        color: 'rgba(255,255,255,0.72)',
      }}>美容院</div>
      {/* 卡名 + 次数 */}
      <div style={{
        position: 'absolute', left: cardW * 0.08, top: cardH * 0.16,
        right: cardW * 0.2,
      }}>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: cardW * 0.09, color: '#fff', lineHeight: 1.2 }}>
          六次养护卡
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: cardH * 0.04 }}>
          <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: cardW * 0.2, color: '#fff', lineHeight: 1 }}>6</span>
          <span style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: cardW * 0.075, color: 'rgba(255,255,255,0.88)', marginLeft: 4 }}>次</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: cardW * 0.045, color: 'rgba(255,255,255,0.72)', marginLeft: 8 }}>/ 共 6 次</span>
        </div>
      </div>
      {/* 底部：左徽章 + 右有效期 */}
      <div style={{
        position: 'absolute', left: cardW * 0.08, right: cardW * 0.08, bottom: cardH * 0.08,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: cardW * 0.045, color: 'rgba(255,255,255,0.88)',
          padding: `${cardW * 0.012}px ${cardW * 0.03}px`,
          border: '1px solid rgba(255,255,255,0.35)', borderRadius: cardW * 0.018,
        }}>次卡</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: cardW * 0.042, color: 'rgba(255,255,255,0.72)' }}>
          有效期 90 天
        </div>
      </div>
    </div>
  );
};

/** 品牌角标（右下角） */
const BrandBadge: React.FC<{ right: number; bottom: number; dark?: boolean }> = ({ right, bottom, dark }) => (
  <div style={{
    position: 'absolute', right, bottom,
    display: 'flex', alignItems: 'center', gap: 12,
    opacity: 0.9,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: dark ? DARK : ACCENT,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 20, color: '#fff' }}>券</span>
    </div>
    <span style={{ fontFamily: FONT_ROUND, fontSize: 34, fontWeight: 700, color: INK }}>券到卡包</span>
  </div>
);

/** 竖版封面 1080×1920（抖音/小红书共用，小红书裁中间 3:4） */
export const G04CoverA: React.FC = () => (
  <AbsoluteFill style={{ background: '#fdf4f6' }}>
    <Img src={BG} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    {/* 主标题（大问句钩子，安全区 top≥160） */}
    <div style={{
      position: 'absolute', top: 260, left: 80, right: 80, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 120, color: INK,
        lineHeight: 1.25, letterSpacing: '0.01em',
        textShadow: '0 6px 24px rgba(62,32,96,0.18)',
      }}>还在推销办卡？</div>
      {/* 副标题 */}
      <div style={{
        fontFamily: FONT_ROUND, fontWeight: 700, fontSize: 60, color: ACCENT,
        marginTop: 36, lineHeight: 1.4,
      }}>试试送一张养护卡</div>
    </div>
    {/* 行业元素：迷你次卡磁面（视觉锚点，放大占主体） */}
    <div style={{ position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <MiniCard size={430} />
    </div>
    {/* 品牌角标（右下） */}
    <BrandBadge right={80} bottom={180} />
  </AbsoluteFill>
);

/** 搜狐横版头图 1920×1080 */
export const G04CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ background: '#fdf4f6' }}>
    <Img src={BG} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    {/* 左区：标题 */}
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 160, right: 640, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{
        fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 108, color: INK,
        lineHeight: 1.3, letterSpacing: '0.01em',
        textShadow: '0 6px 24px rgba(62,32,96,0.18)',
      }}>美容院不推销办卡<br />怎么锁客？</div>
      <div style={{
        fontFamily: FONT_ROUND, fontWeight: 700, fontSize: 56, color: ACCENT,
        marginTop: 32,
      }}>次卡替代储值方案</div>
    </div>
    {/* 右区：迷你卡面（放大） */}
    <div style={{ position: 'absolute', right: 160, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
      <MiniCard size={470} />
    </div>
    {/* 品牌角标（右下） */}
    <BrandBadge right={80} bottom={80} />
  </AbsoluteFill>
);

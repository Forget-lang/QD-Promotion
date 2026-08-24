/**
 * G03 火锅店 · 发布封面（A/B 两版，1080×1920）
 * - A 版：痛点场景型（大问句钩子）
 * - B 版：卡片干货型（浏览器顶栏 + 白卡干货）
 * 依据：outputs/g03-火锅店/03-封面文案包与找图引导.md
 * 规则：M3 平台发布手册 §2 封面规范（安全区 / 主色≤2 / 对比度 / 无免费角标 / 品牌克制）
 * 背景：BG-ABS-001 暖奶油卡片底（直接显示，不模糊）
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// ── 色板（warm-orange，与视频一致）──
const INK = '#2a1a12'; // 深棕（浅底文字）
const ACCENT = '#FF7043'; // 暖橙强调
const PAPER = '#ffffff';
const BG = staticFile('backgrounds/g03/bg.jpg');

const FONT_TITLE = "'DeyiHei', sans-serif";
const FONT_BODY = "'Alibaba PuHuiTi 3', sans-serif";
const FONT_ROUND = "'Alimama FangYuan', sans-serif"; // 圆润亲和（封面第二字体性格，按设计灵活用）

/** 火锅线条图标（锅体 + 蒸汽，单色描边） */
const PotIcon: React.FC<{ size?: number; color?: string }> = ({ size = 130, color = INK }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M36 16c-5 6 5 9 0 15" stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.65} />
    <path d="M60 12c-5 6 5 9 0 15" stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.65} />
    <rect x={14} y={42} width={72} height={11} rx={5.5} fill={color} />
    <path d="M20 57h60v4a30 24 0 0 1-60 0z" fill={color} />
    <path d="M8 47h6M86 47h6" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** 迷你券图形（白底票券 + 虚线分割，不含具体金额） */
const Ticket: React.FC = () => (
  <div
    style={{
      width: 320,
      height: 140,
      background: PAPER,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 10px 30px rgba(42,26,18,0.14)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: 86,
        height: '100%',
        borderRight: '3px dashed rgba(42,26,18,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 54, color: ACCENT }}>折</span>
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: INK }}>下午茶折扣券</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 30, color: 'rgba(42,26,18,0.55)', marginTop: 6 }}>
        闲时可用 · 到店核销
      </div>
    </div>
  </div>
);

/** 品牌角标（右下，克制） */
const BrandMark: React.FC<{ right?: number; bottom?: number }> = ({ right = 80, bottom = 230 }) => (
  <div
    style={{
      position: 'absolute',
      right,
      bottom,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div style={{ width: 14, height: 14, borderRadius: 7, background: ACCENT }} />
    <span style={{ fontFamily: FONT_ROUND, fontWeight: 400, fontSize: 40, color: INK, opacity: 0.9 }}>券到卡包</span>
  </div>
);

// ─────────────────────────────────────────────
// A 版 · 痛点场景型：大问句钩子
// ─────────────────────────────────────────────
export const G03CoverA: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#fdf6f0' }}>
      <Img src={BG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* 问句主体（上 1/3，绝对焦点） */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 88, color: INK, letterSpacing: 2 }}>
          下午3点的火锅店，
        </div>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 148, color: INK, marginTop: 26, letterSpacing: 4 }}>
          坐满了人<span style={{ color: ACCENT }}>？</span>
        </div>
        {/* 手绘感强调下划线 */}
        <svg width={620} height={34} viewBox="0 0 620 34" fill="none" style={{ marginTop: 18 }}>
          <path d="M10 22c150-14 440-16 600-6" stroke={ACCENT} strokeWidth={11} strokeLinecap="round" />
        </svg>
      </div>

      {/* 副标题（白底胶囊，保证可读） */}
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.88)',
            borderRadius: 60,
            padding: '26px 56px',
            boxShadow: '0 8px 24px rgba(42,26,18,0.10)',
          }}
        >
          <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 56, color: INK }}>
            一张「下午茶折扣券」的秘密
          </span>
        </div>
      </div>

      {/* 行业元素（火锅 + 券） */}
      <div
        style={{
          position: 'absolute',
          top: 1310,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 46,
        }}
      >
        <PotIcon size={150} />
        <Ticket />
      </div>

      <BrandMark />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// B 版 · 卡片干货型：浏览器顶栏 + 白卡干货
// ─────────────────────────────────────────────
export const G03CoverB: React.FC = () => {
  const bullets = ['闲时折扣券，只填下午空档', '定时开抢，到点自动开领', '到店出示，扫码就核销'];
  return (
    <AbsoluteFill style={{ background: '#fdf6f0' }}>
      <Img src={BG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* 白卡主体 */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 90,
          right: 90,
          borderRadius: 40,
          background: PAPER,
          boxShadow: '0 24px 60px rgba(42,26,18,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* 浏览器顶栏 */}
        <div
          style={{
            height: 96,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            padding: '0 40px',
            gap: 14,
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontFamily: FONT_ROUND, fontWeight: 400, fontSize: 46, color: PAPER }}>火锅店经营干货</span>
          </div>
          <div style={{ width: 66 }} />
        </div>

        {/* 卡片内容 */}
        <div style={{ padding: '70px 64px 78px' }}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 96, color: INK, lineHeight: 1.22 }}>
            火锅店下午没人？
          </div>
          <div style={{ fontFamily: FONT_ROUND, fontWeight: 400, fontSize: 58, color: INK, marginTop: 32 }}>
            一张券，把<span style={{ color: ACCENT }}>空座位</span>变成<span style={{ color: ACCENT }}>钱</span>
          </div>

          <div style={{ height: 3, background: 'rgba(42,26,18,0.12)', margin: '54px 0 50px' }} />

          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: i < bullets.length - 1 ? 46 : 0 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: 'rgba(255,112,67,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width={34} height={34} viewBox="0 0 24 24" fill="none">
                  <path d="M4 12.5l5 5L20 6.5" stroke={ACCENT} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 56, color: INK }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <BrandMark />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// 搜狐横版头图（16:9，1920×1080，与 B 版同风格）
// ─────────────────────────────────────────────
export const G03CoverSohu: React.FC = () => {
  const bullets = ['闲时折扣券，只填下午空档', '定时开抢，到点自动开领', '到店出示，扫码就核销'];
  return (
    <AbsoluteFill style={{ background: '#fdf6f0' }}>
      <Img src={BG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* 横向白卡 */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 140,
          right: 140,
          borderRadius: 44,
          background: PAPER,
          boxShadow: '0 24px 60px rgba(42,26,18,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* 浏览器顶栏 */}
        <div
          style={{
            height: 96,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            padding: '0 44px',
            gap: 14,
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontFamily: FONT_ROUND, fontWeight: 400, fontSize: 46, color: PAPER }}>火锅店经营干货</span>
          </div>
          <div style={{ width: 66 }} />
        </div>

        {/* 内容：左标题区 + 右干货区 */}
        <div style={{ display: 'flex', padding: '64px 72px 70px', gap: 64, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <PotIcon size={120} />
              <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 92, color: INK, lineHeight: 1.2 }}>
                火锅店下午没人？
              </div>
            </div>
            <div style={{ fontFamily: FONT_ROUND, fontWeight: 400, fontSize: 54, color: INK, marginTop: 36 }}>
              一张「下午茶折扣券」，把<span style={{ color: ACCENT }}>空座位</span>变成<span style={{ color: ACCENT }}>钱</span>
            </div>
          </div>

          <div style={{ width: 660, flexShrink: 0 }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: i < bullets.length - 1 ? 36 : 0 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    background: 'rgba(255,112,67,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                    <path d="M4 12.5l5 5L20 6.5" stroke={ACCENT} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 46, color: INK }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BrandMark right={140} bottom={90} />
    </AbsoluteFill>
  );
};

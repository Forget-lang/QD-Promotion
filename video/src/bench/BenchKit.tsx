// BenchKit · 参考图公共骨架件（17 个屏型样张共用）
// 来源：outputs/样本库/ref-01~19 共性提炼——页码角标 / 双色大标题 / 胶囊提示条 / 底部结论条 / 网格纸底
// 红线：3D 插画与卡通形象一律不抄（禁自绘具象插画），统一用 emoji + 几何形替位
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';

export const INK = '#1E2430';
export const SOFT = 'rgba(30,36,48,0.62)';
export const FAINT = 'rgba(30,36,48,0.45)';
export const CARD = { background: '#fff', borderRadius: 26, boxShadow: '0 10px 26px rgba(20,40,70,0.10)' } as const;

/** 冰蓝柔光底（产品演示统一背景）或网格纸底（知识卡风格） */
export const Paper: React.FC<{ grid?: boolean; tint?: string }> = ({ grid, tint }) => grid ? (
  <AbsoluteFill style={{ background: tint ?? '#F7FAFF' }}>
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
      {Array.from({ length: 27 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={1920} stroke="rgba(60,110,180,0.14)" strokeWidth="1.5" />)}
      {Array.from({ length: 48 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40} stroke="rgba(60,110,180,0.14)" strokeWidth="1.5" />)}
    </svg>
  </AbsoluteFill>
) : (
  <>
    <Img src={staticFile('backgrounds/bench-bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: 'rgba(250,252,255,0.3)' }} />
  </>
);

/** 左上页码角标（ref 系列通用） */
export const PageBadge: React.FC<{ no: number; color: string }> = ({ no, color }) => (
  <div style={{
    position: 'absolute', left: 64, top: 84, background: color, color: '#fff',
    fontFamily: FONT_BODY, fontSize: 28, fontWeight: 800, borderRadius: 999, padding: '8px 26px',
  }}>17 屏型 · {String(no).padStart(2, '0')}</div>
);

/** 大标题（双色对比是参考图的灵魂） */
export const Head: React.FC<{ lines: React.ReactNode[]; size?: number; top?: number; color?: string }> = ({ lines, size = 74, top = 190, color = INK }) => (
  <div style={{ position: 'absolute', left: 80, right: 80, top, fontFamily: FONT_TITLE, fontSize: size, fontWeight: 900, color, lineHeight: 1.26, letterSpacing: 1 }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

/** 胶囊提示条 */
export const CapTip: React.FC<{ top: number; icon?: string; children: React.ReactNode; color?: string }> = ({ top, icon = '💡', children, color = INK }) => (
  <div style={{
    position: 'absolute', left: 80, right: 80, top, display: 'flex', alignItems: 'center', gap: 14,
    background: '#fff', border: '1.5px solid rgba(30,36,48,0.12)', borderRadius: 999, padding: '16px 30px',
    boxShadow: '0 8px 20px rgba(20,40,70,0.07)', fontFamily: FONT_BODY, fontSize: 28, color,
  }}>
    <span style={{ fontSize: 30 }}>{icon}</span>{children}
  </div>
);

/** 底部结论条 */
export const ConcBar: React.FC<{ icon?: string; children: React.ReactNode; bg?: string; fg?: string; bottom?: number }> = ({ icon = '🎯', children, bg = '#fff', fg = INK, bottom = 90 }) => (
  <div style={{
    position: 'absolute', left: 62, right: 62, bottom, background: bg, borderRadius: 24,
    border: '1.5px solid rgba(30,36,48,0.10)', boxShadow: '0 14px 30px rgba(20,40,70,0.10)',
    padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 18,
    fontFamily: FONT_BODY, fontSize: 30, fontWeight: 800, color: fg, lineHeight: 1.5,
  }}>
    <span style={{ fontSize: 38, flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1 }}>{children}</span>
  </div>
);

/** 视频统一脚注 */
export const Foot: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 36, textAlign: 'center', fontFamily: FONT_BODY, fontSize: 21, color: FAINT, letterSpacing: 2 }}>
    屏型排版样张 · 功能为产品真实能力 · 数据为示例
  </div>
);

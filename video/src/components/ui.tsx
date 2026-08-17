// 通用 UI 组件（仅提效，非模板）· 2026-08-15 组件库化抽出
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, INK, PAPER } from '../palette';

/** 进度指示器（类鱼皮 SLIDE 01/07） */
export const SlideTag: React.FC<{ cur: number; total: number; dark?: boolean }> = ({ cur, total, dark }) => (
  <div style={{
    position: 'absolute', top: 44, left: 44,
    fontFamily: FONT_BODY, fontSize: 22, fontWeight: 700,
    color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)',
    letterSpacing: 1,
  }}>
    SLIDE {String(cur).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

/** 段落标题（大，带可选装饰下划线） */
export const SectionTitle: React.FC<{ text: string; color?: string; size?: number; underline?: string }> = ({
  text, color = INK, size = 64, underline,
}) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [6, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT_TITLE, fontSize: size, fontWeight: 900,
        color, lineHeight: 1.2, padding: '0 48px',
        textShadow: color === PAPER ? '0 2px 20px rgba(0,0,0,0.35)' : 'none',
      }}>
        {text}
      </div>
      {underline && (
        <div style={{
          height: 7, width: `${w * Math.min(text.length * 30, 320)}px`,
          maxWidth: 420, margin: '18px auto 0',
          backgroundColor: underline, borderRadius: 4,
        }} />
      )}
    </div>
  );
};

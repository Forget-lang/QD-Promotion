// 通用 UI 组件（仅提效，非模板）· 2026-08-17 专业级优化
// - SlideTag 加入场淡入（原为瞬现）
// - SectionTitle 下划线宽度按中文字符精确估算 + EASE_OUT 缓动
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, INK, PAPER } from '../palette';
import { EASE_OUT } from './animations';

/** 进度指示器（类鱼皮 SLIDE 01/07）· 入场淡入 */
export const SlideTag: React.FC<{ cur: number; total: number; dark?: boolean }> = ({ cur, total, dark }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div style={{
      position: 'absolute', top: 44, left: 44,
      fontFamily: FONT_BODY, fontSize: 22, fontWeight: 700,
      color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)',
      letterSpacing: 1,
      opacity,
    }}>
      SLIDE {String(cur).padStart(2, '0')} / {String(total).padStart(2, '0')}
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
        color, lineHeight: 1.2, padding: '0 48px',
        textShadow: color === PAPER ? '0 2px 20px rgba(0,0,0,0.35)' : 'none',
      }}>
        {text}
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

// 通用 UI 组件（仅提效，非模板）· 2026-08-17 专业级优化
// - SectionTitle 下划线宽度按中文字符精确估算 + EASE_OUT 缓动
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, INK, PAPER } from '../palette';
import { EASE_OUT } from './animations';


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

/**
 * 底部字幕
 * - 位置：底部安全区，距底部 60px
 * - 白色字 + 黑色描边，任何背景下都清晰
 * - 入场：淡入 + 轻微上浮
 */
export const Subtitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 6 }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const translateY = interpolate(f, [delay, delay + 10], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 60,
      textAlign: 'center',
      padding: '0 60px',
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      <span style={{
        fontFamily: FONT_BODY,
        fontSize: 34,
        fontWeight: 600,
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
        {text}
      </span>
    </div>
  );
};

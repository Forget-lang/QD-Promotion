// 通用 UI 原子件（仅提效，非模板）· 2026-08-29 大瘦身：
// IconBadge / PhoneMockup / CouponCard / StatCounter / StatCard / StepFlow / CompareCard / SectionTitle / HighLightText
// 共 9 个"统一外观"业务组件已删除——它们违反「外观每片必新」，且真值口径全部沉淀在 docs/internal/R6-applet前端UI储备.md（§0.1 黑名单 / §1.5 主题 / §8 校准表），要复刻照 R6 + bench 锚稿手写。
// 本文件只留跨片通用的原子件：投影常量 / 逐字入场 / 重音词 / 底部字幕。
import React from 'react';
import { interpolate, interpolateColors, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, INK } from '../palette';
import { EASE_OUT, EASE_IN } from './animations';

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
  text: string; color: string; delay?: number; peak?: number; family?: string;
}> = ({ text, color, delay = 0, peak = 96, family = FONT_TITLE }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 9], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const c = interpolateColors(p, [0, 1], [INK, color]);
  return (
    <div style={{
      fontFamily: family, fontSize: peak, fontWeight: 900, color: c, lineHeight: 1.1,
      transform: `scale(${0.55 + p * 0.45})`,
      opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      textShadow: `0 6px 30px ${color}44`, display: 'inline-block',
    }}>
      {text}
    </div>
  );
};

/**
 * 底部多行字幕（帧级精确同步）
 * - 位置：底部安全区，距底部 60px；白色字 + 黑色描边，任何背景下都清晰
 * - 每行独立的 startFrame / endFrame（相对本屏起点），跟口播逐行对齐
 * - 最多同时显示 2 行（避免遮挡画面）
 */
export const Subtitle: React.FC<{ lines: { text: string; startFrame: number; endFrame: number }[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const FADE_FRAMES = 6;

  const activeLines = lines
    .map((line, i) => ({ ...line, index: i }))
    .filter((line) => f >= line.startFrame && f <= line.endFrame);

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
        const entranceProgress = interpolate(f, [line.startFrame, line.startFrame + FADE_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
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

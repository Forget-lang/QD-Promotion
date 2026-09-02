// 通用 UI 原子件（仅提效，非模板）· 2026-08-29 大瘦身：
// IconBadge / PhoneMockup / CouponCard / StatCounter / StatCard / StepFlow / CompareCard / SectionTitle / HighLightText
// 共 9 个"统一外观"业务组件已删除——它们违反「外观每片必新」，且真值口径全部沉淀在 docs/internal/R6-applet前端UI储备.md（§0.1 黑名单 / §1.5 主题 / §8 校准表），要复刻照 R6 + bench 锚稿手写。
// 2026-09-02 Q4 零引用件清理：elevation / CharReveal / AccentWord 已删（零消费者；投影与逐字入场各片按锚稿手写）。本文件只留跨片通用的底部字幕。
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_BODY } from '../palette';
import { EASE_OUT, EASE_IN } from './animations';

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

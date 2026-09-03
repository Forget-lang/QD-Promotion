// 通用 UI 原子件（仅提效，非模板）· 2026-08-29 大瘦身：
// IconBadge / PhoneMockup / CouponCard / StatCounter / StatCard / StepFlow / CompareCard / SectionTitle / HighLightText
// 共 9 个"统一外观"业务组件已删除——它们违反「外观每片必新」，且真值口径全部沉淀在 docs/internal/R6-applet前端UI储备.md（§0.1 黑名单 / §1.5 主题 / §8 校准表），要复刻照 R6 + bench 锚稿手写。
// 2026-09-02 Q4 零引用件清理：elevation / CharReveal / AccentWord 已删（零消费者；投影与逐字入场各片按锚稿手写）。本文件只留跨片通用的底部字幕。
// 2026-09-03 动态字幕升级（用户拍板）：入场改 spring（透传本片 motion 性格）+ 新旧行透明度分层，几何位置与描边口径不变。
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_BODY } from '../palette';
import { EASE_IN, SPRING_CONFIG } from './animations';
import type { MotionKey } from '../types';

/**
 * 底部多行字幕（帧级精确同步 · 动态版）
 * - 位置：底部安全区，距底部 60px；白色字 + 黑色描边，任何背景下都清晰
 * - 每行独立的 startFrame / endFrame（相对本屏起点），跟口播逐行对齐
 * - 最多同时显示 2 行（避免遮挡画面）；入场 spring 上滑落定，离场快速淡出
 * - 新行在场时旧行降到 0.72（与 C-12「讲过的区域降级」同口径），视线自然跟到最新句
 */
export const Subtitle: React.FC<{
  lines: { text: string; startFrame: number; endFrame: number }[];
  /** 本片运动性格（spring 必须透传 motion，R3 §7.1）；分发器从 style.motion 传入 */
  motion?: MotionKey;
}> = ({ lines, motion = 'snappy' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FADE_FRAMES = 6;

  const activeLines = lines
    .map((line, i) => ({ ...line, index: i }))
    .filter((line) => f >= line.startFrame && f <= line.endFrame);

  const visibleLines = activeLines.slice(-2);
  const newestIndex = visibleLines.length > 0
    ? visibleLines[visibleLines.length - 1].index
    : -1;

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
        const entrance = spring({
          frame: f - line.startFrame,
          fps,
          config: SPRING_CONFIG[motion],
          durationInFrames: 14,
        });
        const exitProgress = interpolate(f, [line.endFrame - FADE_FRAMES, line.endFrame], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_IN,
        });
        const recency = line.index === newestIndex ? 1 : 0.72;
        const opacity = Math.min(entrance, exitProgress) * recency;
        const translateY = interpolate(entrance, [0, 1], [16, 0], {
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

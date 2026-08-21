// 基础动画组件（仅提效，非模板）· 2026-08-17 专业级优化
// - 全部 spring 动画透传 motion（修复 buttery 声明未生效的 Bug）
// - 新增 WipeIn（clip-path 擦入，对齐设计稿「wipe 入」描述）
// - 新增 Pulse（瞬时强调脉冲，用于数字/箭头强调）
// - 非 spring 插值统一使用 Easing.bezier(0.16,1,0.3,1)（expo-out）
import React from 'react';
import { interpolate, spring, Easing, useCurrentFrame } from 'remotion';
import { FPS } from '../palette';
import type { MotionKey } from '../types';

export const SPRING_CONFIG: Record<MotionKey, { damping: number; stiffness: number; mass?: number }> = {
  bouncy: { damping: 14, stiffness: 100 },
  snappy: { damping: 25, stiffness: 180 },
  buttery: { damping: 50, stiffness: 50 },
  heavy: { damping: 30, stiffness: 80, mass: 3 },
};

/** expo-out：所有非 spring 动画的标准缓动 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** expo-in：淡出/离场用的加速缓动（与 EASE_OUT 对称） */
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const FadeInUp: React.FC<{
  children: React.ReactNode; delay?: number; dist?: number; motion?: MotionKey;
}> = ({ children, delay = 0, dist = 50, motion = 'bouncy' }) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(spr, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(spr, [0, 1], [dist, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

export const SlideInLeft: React.FC<{ children: React.ReactNode; delay?: number; motion?: MotionKey }> = ({
  children, delay = 0, motion = 'bouncy',
}) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(spr, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateX(${interpolate(spr, [0, 1], [-90, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

export const SlideInRight: React.FC<{ children: React.ReactNode; delay?: number; motion?: MotionKey }> = ({
  children, delay = 0, motion = 'bouncy',
}) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(spr, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateX(${interpolate(spr, [0, 1], [90, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

export const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number; motion?: MotionKey; startScale?: number }> = ({
  children, delay = 0, motion = 'bouncy', startScale = 0.82,
}) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `scale(${interpolate(spr, [0, 1], [startScale, 1])})`,
    }}>
      {children}
    </div>
  );
};

/**
 * WipeIn — clip-path 擦入 reveal
 * 对齐设计稿「标题 wipe 入」「节点依次 wipe 入」描述。
 * direction='left' 从左向右擦开；'up' 从下向上擦开。
 */
export const WipeIn: React.FC<{
  children: React.ReactNode; delay?: number; duration?: number; direction?: 'left' | 'up';
}> = ({ children, delay = 0, duration = 22, direction = 'left' }) => {
  const f = useCurrentFrame();
  const progress = interpolate(f - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const clipPath = direction === 'left'
    ? `inset(0 ${(1 - progress) * 100}% 0 0)`
    : `inset(${(1 - progress) * 100}% 0 0 0)`;
  return (
    <div style={{ clipPath, WebkitClipPath: clipPath }}>
      {children}
    </div>
  );
};

/**
 * Pulse — 单次脉冲强调（scale 1 → 1+intensity → 1）
 * 用于数字「10」、箭头 ↑/↓ 等需要瞬时强调的元素。
 */
export const Pulse: React.FC<{
  children: React.ReactNode; delay?: number; intensity?: number; duration?: number;
}> = ({ children, delay = 0, intensity = 0.06, duration = 20 }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f - delay, [0, duration * 0.5, duration], [1, 1 + intensity, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return <div style={{ transform: `scale(${scale})`, display: 'inline-block' }}>{children}</div>;
};

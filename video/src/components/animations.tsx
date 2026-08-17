// 基础动画组件（仅提效，非模板）· 2026-08-15 组件库化 + spring 性格化
// 默认配置 = 原 VTemplate 值（G02 画面不变）；motion 为风格维度，供后续视频差异化
import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { FPS } from '../palette';
import type { MotionKey } from '../types';

export const SPRING_CONFIG: Record<MotionKey, { damping: number; stiffness: number; mass?: number }> = {
  bouncy: { damping: 14, stiffness: 100 },
  snappy: { damping: 25, stiffness: 180 },
  buttery: { damping: 50, stiffness: 50 },
  heavy: { damping: 30, stiffness: 80, mass: 3 },
};

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

export const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number; motion?: MotionKey }> = ({
  children, delay = 0, motion = 'bouncy',
}) => {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `scale(${interpolate(spr, [0, 1], [0.82, 1])})`,
    }}>
      {children}
    </div>
  );
};

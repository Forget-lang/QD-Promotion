// 镜头感原语（2026-09-03 用户拍板升级四项，片 2 起消费）：视差漂移 / 重点推近。
// 全部帧驱动（useCurrentFrame + interpolate / noise2D），无 CSS animation（R3 §7.1）。
// 用法：一屏内背景/中景/前景分别包 Drift 并给不同 depth 即成视差；重点内容包 PushIn 在停留期缓慢推近。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';

/**
 * 视差漂移：noise 驱动的极慢浮动（位移 + 微旋转），不同 depth 的层错出镜头层次感。
 * depth 建议：背景 0.4 / 中景 1 / 前景 1.6。amplitude 为基础振幅（px），保持克制（默认 3）。
 */
export const Drift: React.FC<{
  children: React.ReactNode;
  depth?: number;
  amplitude?: number;
  seed?: string;
}> = ({ children, depth = 1, amplitude = 3, seed = 'cam' }) => {
  const f = useCurrentFrame();
  const t = f / 150;
  const x = noise2D(`${seed}-x`, t, 0) * amplitude * depth;
  const y = noise2D(`${seed}-y`, t, 0) * amplitude * depth;
  const r = noise2D(`${seed}-r`, t, 0) * 0.12 * depth;
  return (
    <AbsoluteFill style={{ transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)` }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * 重点推近：停留期对内容做极慢推近（默认 1 → 1.05），让画面"有镜头在看"。
 * startFrame / durationInFrames 相对本屏时间轴；不传时按 10 秒缓推。
 */
export const PushIn: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
  startFrame?: number;
  durationInFrames?: number;
}> = ({ children, from = 1, to = 1.05, startFrame = 0, durationInFrames = 300 }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [startFrame, startFrame + durationInFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

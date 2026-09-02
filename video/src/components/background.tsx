// 背景装饰组件 · 2026-08-17 视觉升级 · 2026-08-20 增加全片氛围层
// 2026-09-02 Q4 零引用件清理：DotGrid / GlowOrb 已删（零消费者；浅底点阵 / 深底柔光各片按需手写）。
// 本文件只留 VTemplate 统一挂载的全片氛围层四件套：Grain / Vignette / AccentOverlay / KenBurnsBg。
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/** 全片颗粒层：feTurbulence 噪点，杀纯色渐变的色带 + 胶片质感。静态不动画，渲染稳定 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => (
  <AbsoluteFill style={{
    opacity,
    pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

/** 暗角：压四角聚焦中部视线，增强画面层次感 */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.25 }) => (
  <AbsoluteFill style={{
    pointerEvents: 'none',
    background: `radial-gradient(ellipse 75% 70% at 50% 46%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
  }} />
);

/** 主色统调：行业背景图与 UI 色系融合（soft-light 只混下层，不影响场景内容） */
export const AccentOverlay: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.18 }) => (
  <AbsoluteFill style={{
    backgroundColor: color, mixBlendMode: 'soft-light', opacity, pointerEvents: 'none',
  }} />
);

/** Ken Burns 背景图：全质量显示 + 全片极慢推近，只做氛围不承担信息 */
export const KenBurnsBg: React.FC<{
  src: string;
  blur?: number;
  opacity?: number;
  endScale?: number;
}> = ({ src, blur = 0, opacity = 1, endScale = 1.04 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, endScale], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{
      filter: `blur(${blur}px)`,
      opacity,
      transform: `scale(${scale})`,
    }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

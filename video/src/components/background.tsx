// 背景装饰组件 · 2026-08-17 视觉升级 · 2026-08-20 增加全片氛围层
// - DotGrid：轻量点阵纹理，给浅底画面增加质感（不抢内容）
// - GlowOrb：柔光圆斑，给深底画面增加层次感
// - Grain / Vignette / AccentOverlay / KenBurnsBg：全片氛围层（VTemplate 统一挂载）
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE_OUT } from './animations';

/** 点阵背景（浅底画面用） */
export const DotGrid: React.FC<{ color?: string; spacing?: number; size?: number; opacity?: number }> = ({
  color = 'rgba(0,0,0,0.06)', spacing = 40, size = 3, opacity = 1,
}) => (
  <AbsoluteFill style={{ opacity }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`dotgrid-${spacing}-${size}`} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx={size} cy={size} r={size} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dotgrid-${spacing}-${size})`} />
    </svg>
  </AbsoluteFill>
);

/** 柔光圆斑（深底画面用，2-3 个错位叠加营造氛围） */
export const GlowOrb: React.FC<{
  x: number; y: number; size: number; color: string; delay?: number;
}> = ({ x, y, size, color, delay = 0 }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f - delay, [0, 40], [0, 0.35], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const drift = Math.sin((f - delay) / 40) * 12;
  return (
    <div style={{
      position: 'absolute', left: x, top: y + drift, width: size, height: size,
      borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, pointerEvents: 'none',
    }} />
  );
};

/** 全片颗粒层：feTurbulence 噪点，杀纯色渐变的色带 + 胶片质感。静态不动画，渲染稳定 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => (
  <AbsoluteFill style={{
    opacity,
    pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

/** 暗角：只压四角聚焦中部视线，顺带压住模糊背景图边缘发灰 */
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

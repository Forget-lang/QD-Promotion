// 背景装饰组件 · 2026-08-17 视觉升级
// - DotGrid：轻量点阵纹理，给浅底画面增加质感（不抢内容）
// - GlowOrb：柔光圆斑，给深底画面增加层次感
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
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

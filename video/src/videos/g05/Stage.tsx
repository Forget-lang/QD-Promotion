// G05 舞台画框：顶部挂画导轨 + 底部画桌台面（本片视觉语言的"墙-桌"结构）
// 为什么要有它：分带实测显示中段内容已达 70~90%，真空集中在顶带（31~35%）与底带 1600~1920（19~52%）；
// 参考片正是用顶栏 + 底部 tab 栏封住这两条。台面同时给底部字幕提供深色底，提升浅底字幕可读性。
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CRAYON_RED, CRAYON_YELLOW, PENCIL } from './parts';

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 30) * 5;
  return (
    <AbsoluteFill>
      {/* 底部画桌台面（y 1626→1920 满幅）：冷蓝渐变 + 台面高光线 */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1626, bottom: 0,
        background: 'linear-gradient(180deg, rgba(21,101,192,0.13) 0%, rgba(21,101,192,0.26) 100%)',
        borderTop: '3px solid rgba(21,101,192,0.34)',
      }} />
      {/* 台面上一支横放的蜡笔（几何形，非具象插画）：随呼吸轻漂移 = 底部持续微动源 */}
      <div style={{
        position: 'absolute', left: 96 + drift, top: 1668, width: 190, height: 26, borderRadius: 13,
        background: `linear-gradient(90deg, ${CRAYON_YELLOW} 0 74%, ${PENCIL} 74% 82%, #E8C9A0 82% 100%)`,
        opacity: 0.85, transform: 'rotate(-1.5deg)',
      }} />
      <div style={{
        position: 'absolute', right: 200 + drift * 0.6, top: 1672, width: 14, height: 14, borderRadius: '50%',
        background: CRAYON_RED, opacity: 0.5,
      }} />

      {/* 顶部挂画导轨：横杆 + 两颗螺钉 + 垂到展签的两根吊绳 */}
      <div style={{
        position: 'absolute', left: 64, right: 64, top: 66, height: 7, borderRadius: 4,
        background: 'rgba(107,107,107,0.55)',
      }} />
      {[96, 972].map((x) => (
        <div key={x} style={{
          position: 'absolute', left: x, top: 60, width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(20,40,70,0.22)', border: '2px solid rgba(20,40,70,0.30)',
        }} />
      ))}
      {[150, 330].map((x) => (
        <div key={x} style={{
          position: 'absolute', left: x, top: 72, width: 2.5, height: 82, background: 'rgba(107,107,107,0.45)',
        }} />
      ))}

      {children}
    </AbsoluteFill>
  );
};

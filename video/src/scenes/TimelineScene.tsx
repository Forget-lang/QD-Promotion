// S2/S3 时间线场景 · 2026-08-18 全新组件
// SVG 客流曲线：横轴 9:00-22:00，纵轴客流量
// problem 模式：曲线下午塌陷，红色高亮空桌区
// solution 模式：券标落入空位，谷底升起，曲线变橙
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ACCENT_RED, PALETTES, TYPOGRAPHY } from '../palette';
import type { Scene, StyleConfig, TimelinePoint } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, EASE_OUT } from '../components/animations';
import { DotGrid } from '../components/background';

// ── 坐标映射 ──
const CHART_X0 = 60;
const CHART_X1 = 1020;
const CHART_Y0 = 500;   // 顶部（爆满）
const CHART_Y1 = 820;   // 底部（空店）
const HOUR_START = 9;
const HOUR_END = 22;
const PATH_LENGTH = 1600; // stroke-dasharray 估值

const hourToX = (hour: number) =>
  CHART_X0 + ((hour - HOUR_START) / (HOUR_END - HOUR_START)) * (CHART_X1 - CHART_X0);

const trafficToY = (traffic: number) =>
  CHART_Y1 - (traffic / 100) * (CHART_Y1 - CHART_Y0);

// Catmull-Rom → Bezier 平滑路径
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function areaPath(curve: string, lastX: number): string {
  return `${curve} L ${lastX.toFixed(1)} ${CHART_Y1} L ${CHART_X0} ${CHART_Y1} Z`;
}

// 时间刻度
const TIME_TICKS = [9, 12, 15, 18, 21];

export const TimelineScene: React.FC<{
  scene: Scene; style: StyleConfig; index: number; total: number;
}> = ({ scene, style, index, total }) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  const isSolution = scene.timelineMode === 'solution';
  const points = scene.timelinePoints ?? [];
  const coupons = scene.timelineCoupons ?? [];
  const highlight = scene.timelineHighlight;

  // 曲线绘制进度（0→1）
  const drawProgress = interpolate(f, [20, 70], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });

  // solution 模式：谷底升起进度
  const liftProgress = isSolution
    ? interpolate(f, [80, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT })
    : 0;

  // 计算当前曲线点（solution 模式下叠加券的抬升效果）
  const currentPoints: { x: number; y: number; traffic: number }[] = points.map((pt) => {
    let traffic = pt.traffic;
    if (isSolution && liftProgress > 0) {
      // 找到距离该点最近的券，叠加 lift（按时间距离衰减）
      for (const c of coupons) {
        const dist = Math.abs(pt.hour - c.hour);
        if (dist <= 2) {
          const factor = 1 - dist / 2;
          traffic += c.lift * factor * liftProgress;
        }
      }
    }
    return { x: hourToX(pt.hour), y: trafficToY(Math.min(100, traffic)), traffic };
  });

  const curveD = smoothPath(currentPoints);
  const areaD = areaPath(curveD, CHART_X1);

  // 问题模式：红色塌陷区
  const hlX0 = highlight ? hourToX(highlight.startHour) : 0;
  const hlX1 = highlight ? hourToX(highlight.endHour) : 0;
  const hlOpacity = !isSolution
    ? interpolate(f, [75, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(f, [75, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 区域填充透明度
  const areaOpacity = interpolate(f, [50, 80], [0, 0.12], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // 曲线颜色
  const curveColor = isSolution && liftProgress > 0.5 ? p.accent : (isSolution ? ACCENT_RED : p.ink);

  return (
    <AbsoluteFill style={{ background: p.bg, justifyContent: 'flex-start' }}>
      <DotGrid color={`${p.accent}0d`} spacing={44} size={3} />

      {/* 标题 */}
      <div style={{ position: 'absolute', top: 110, width: '100%', padding: '0 56px' }}>
        <FadeInUp motion={style.motion}>
          <div style={{
            fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight,
            color: p.ink, textAlign: 'center', lineHeight: 1.3,
          }}>
            {scene.title}
          </div>
        </FadeInUp>
      </div>

      {/* SVG 图表 */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* 基线 */}
        <line
          x1={CHART_X0} y1={CHART_Y1} x2={CHART_X1} y2={CHART_Y1}
          stroke="#ccc" strokeWidth={2} strokeDasharray="6 4"
          opacity={interpolate(f, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />

        {/* 问题模式：红色塌陷高亮区 */}
        {highlight && hlOpacity > 0.01 && (
          <g opacity={hlOpacity}>
            <rect
              x={hlX0} y={CHART_Y0 - 20}
              width={hlX1 - hlX0} height={CHART_Y1 - CHART_Y0 + 40}
              fill={ACCENT_RED} opacity={0.08} rx={8}
            />
            {/* 虚线上边框 */}
            <line
              x1={hlX0} y1={CHART_Y0 - 10} x2={hlX1} y2={CHART_Y0 - 10}
              stroke={ACCENT_RED} strokeWidth={2} strokeDasharray="8 6"
            />
            {/* 标签 */}
            <rect
              x={(hlX0 + hlX1) / 2 - 90} y={CHART_Y0 - 52}
              width={180} height={40} rx={20} fill={ACCENT_RED}
            />
            <text
              x={(hlX0 + hlX1) / 2} y={CHART_Y0 - 26}
              textAnchor="middle" fill="#fff"
              style={{ fontFamily: typo.family, fontSize: 24, fontWeight: 500 }}
            >
              {highlight.label}
            </text>
          </g>
        )}

        {/* 区域填充 */}
        <path d={areaD} fill={curveColor} opacity={areaOpacity} />

        {/* 客流曲线 */}
        <path
          d={curveD}
          fill="none"
          stroke={curveColor}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH * (1 - drawProgress)}
        />

        {/* 时间刻度 */}
        {TIME_TICKS.map((h) => (
          <g key={h} opacity={interpolate(f, [25, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <line
              x1={hourToX(h)} y1={CHART_Y1} x2={hourToX(h)} y2={CHART_Y1 + 10}
              stroke="#999" strokeWidth={2}
            />
            <text
              x={hourToX(h)} y={CHART_Y1 + 38}
              textAnchor="middle" fill="#999"
              style={{ fontFamily: typo.bodyFamily, fontSize: 26, fontWeight: typo.bodyWeight }}
            >
              {h}:00
            </text>
          </g>
        ))}

        {/* solution 模式：券标落点 */}
        {isSolution && coupons.map((c, i) => {
          const cx = hourToX(c.hour);
          // 找到对应曲线上的 y 值
          const idx = points.findIndex((pt) => Math.abs(pt.hour - c.hour) < 0.1);
          const pt = currentPoints[idx] ?? currentPoints[Math.min(idx, currentPoints.length - 1)];
          const cy = pt ? pt.y - 50 : CHART_Y0;
          const dropDelay = 100 + i * 18;
          const dropProgress = interpolate(f, [dropDelay, dropDelay + 20], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
          });
          const labelOpacity = interpolate(f, [dropDelay + 15, dropDelay + 35], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          return (
            <g key={i}>
              {/* 连接线 */}
              <line
                x1={cx} y1={cy + dropProgress * 0 + 20} x2={cx} y2={pt ? pt.y : CHART_Y1 - 20}
                stroke={c.color} strokeWidth={2} strokeDasharray="5 4"
                opacity={dropProgress * 0.6}
              />
              {/* 券标圆 */}
              <g transform={`translate(${cx}, ${cy + (1 - dropProgress) * -80})`} opacity={dropProgress}>
                <circle cx={0} cy={0} r={36} fill="#fff" stroke={c.color} strokeWidth={3} />
                <circle cx={0} cy={0} r={28} fill={`${c.color}15`} />
                <foreignObject x={-18} y={-18} width={36} height={36}>
                  <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Ico[c.icon](c.color)}
                  </div>
                </foreignObject>
              </g>
              {/* 标签 */}
              <text
                x={cx} y={cy - 50}
                textAnchor="middle" fill={c.color}
                style={{ fontFamily: typo.family, fontSize: 26, fontWeight: 500 }}
                opacity={labelOpacity}
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 底部说明 */}
      {scene.sub && (
        <div style={{ position: 'absolute', bottom: 160, width: '100%', padding: '0 80px' }}>
          <FadeInUp delay={isSolution ? 130 : 90} motion={style.motion}>
            <div style={{
              fontFamily: typo.bodyFamily, fontSize: 34, fontWeight: typo.bodyWeight,
              color: '#888', textAlign: 'center', lineHeight: 1.5,
            }}>
              {scene.sub}
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

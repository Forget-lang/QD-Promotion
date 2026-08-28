// G05 本片共用零件 —— 「画室作品墙 / 蜡笔与纸张」视觉基线的载体（pipeline §2.1.0 ②③⑥）
// 只服务 G05；跨片复用前先按 R3 §5.3 判断是否已成通用原语。
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS } from '../../palette';
import type { MotionKey } from '../../types';
import { EASE_OUT, SPRING_CONFIG } from '../../components/animations';
import { FONT_BODY } from '../../palette';

/** 本片专属色板（不是 palette 的语义色，是"画室"材质色） */
export const PAPER = '#FBF7EF';        // 画纸米白
export const PAPER_EDGE = 'rgba(0,0,0,0.10)';
export const PAPER_SHADOW = '0 6px 18px rgba(20,40,70,0.12)';
export const CRAYON_RED = '#E4572E';
export const CRAYON_YELLOW = '#F4C430';
export const PENCIL = '#6B6B6B';
export const TAPE = 'rgba(244,196,48,0.55)';
export const INK_SOFT = 'rgba(26,26,26,0.72)';
export const PAD_L = 80;               // 左安全边（与 R3 §7.3 一致）

/** 本片统一入场语法：纸片从上方落下 + 轻微旋正（≠ 既有条目的 translateY 直弹） */
export const DropIn: React.FC<{
  children: React.ReactNode; delay?: number; motion: MotionKey;
  from?: number; rotate?: number; dist?: number;
}> = ({ children, delay = 0, motion, from = -64, rotate = -4, dist = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      opacity: interpolate(s, [0, 0.22], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translate(${dist}px, ${interpolate(s, [0, 1], [from, 0])}px) rotate(${interpolate(s, [0, 1], [rotate, 0])}deg)`,
    }}>
      {children}
    </div>
  );
};

/** 胶带：斜压在半透明的米黄条 */
export const Tape: React.FC<{ width?: number; angle?: number; color?: string }> = ({
  width = 120, angle = -38, color = TAPE,
}) => (
  <div style={{
    width, height: 28, background: color, opacity: 0.9, transform: `rotate(${angle}deg)`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.10)', borderRadius: 2,
  }} />
);

/** 图钉 */
export const Pin: React.FC<{ color?: string; size?: number }> = ({ color = CRAYON_RED, size = 20 }) => (
  <svg width={size * 2} height={size * 2} viewBox="0 0 40 40" style={{ display: 'block' }}>
    <circle cx="20" cy="18" r="11" fill={color} />
    <circle cx="16" cy="14" r="4" fill="rgba(255,255,255,0.55)" />
    <path d="M20 29 L20 38" stroke={PENCIL} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** 回形针 */
export const Clip: React.FC<{ color?: string }> = ({ color = PENCIL }) => (
  <svg width="34" height="62" viewBox="0 0 34 62" fill="none" style={{ display: 'block' }}>
    <path d="M10 8v34a7 7 0 0014 0V12a4 4 0 00-8 0v28" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
  </svg>
);

/** 铅笔（本片的"手绘感"角饰；命名避开色值常量 PENCIL） */
export const PencilMark: React.FC<{ width?: number; body?: string }> = ({ width = 150, body = CRAYON_YELLOW }) => (
  <svg width={width} height={width * 0.28} viewBox="0 0 150 42" fill="none">
    <path d="M112 6 l30 15 -30 15 z" fill="#E8C9A0" />
    <path d="M128 15 l14 6 -14 6 z" fill="#1a1a1a" />
    <rect x="8" y="6" width="104" height="30" rx="4" fill={body} />
    <rect x="8" y="6" width="104" height="30" rx="4" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
    <rect x="2" y="10" width="12" height="22" rx="3" fill="#C0C6CC" />
  </svg>
);

/** 蜡笔线：抖动 path + stroke draw-on（本片的核心装饰母题） */
export const CrayonLine: React.FC<{
  delay?: number; width?: number; color?: string; thick?: number; wobble?: number;
}> = ({ delay = 0, width = 320, color = CRAYON_YELLOW, thick = 10, wobble = 5 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const L = 7;
  const seg = width / L;
  let d = `M4 ${thick / 2 + (0 % 2 ? wobble : 0)}`;
  for (let i = 1; i <= L; i++) d += ` Q ${seg * (i - 0.5)} ${i % 2 ? thick / 2 - wobble : thick / 2 + wobble} ${seg * i} ${thick / 2}`;
  return (
    <svg width={width + 8} height={thick + 8} viewBox={`0 0 ${width + 8} ${thick + 8}`} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round"
        strokeDasharray="1600" strokeDashoffset={1600 * (1 - p)} opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};

/** 展签卡：本片的标题系统（美术馆标签 + 图钉 + 编号行），不做通栏色块 */
export const ExhibitTag: React.FC<{
  no: number; total: number; title: string; x?: number; y?: number;
  size?: number; motion: MotionKey; delay?: number; accent: string;
}> = ({ no, total, title, x = PAD_L, y = 150, size = 54, motion, delay = 0, accent }) => {
  const w = Math.min(840, title.length * size + 190);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w }}>
      <DropIn motion={motion} delay={delay} from={-46} rotate={-1.6}>
        <div style={{
          position: 'relative', background: PAPER, borderRadius: 10, border: `2px solid ${PAPER_EDGE}`,
          boxShadow: PAPER_SHADOW, padding: '20px 34px 22px',
        }}>
          <div style={{ position: 'absolute', left: w - 44, top: -14 }}>{<Pin size={13} color={accent} />}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 22, letterSpacing: '0.18em', color: PENCIL }}>
            {String(no).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: size, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.25 }}>
            {title}
          </div>
        </div>
      </DropIn>
    </div>
  );
};

/** 三原色点导航：第几幕（本片独有的收束信号，红/黄/蓝） */
export const ActDots: React.FC<{ active: number }> = ({ active }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const on = interpolate(f, [Math.min(20, durationInFrames - 1), 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const colors = [CRAYON_RED, CRAYON_YELLOW, '#1E88E5'];
  return (
    <div style={{ position: 'absolute', right: PAD_L, top: 1608, display: 'flex', gap: 16, opacity: on }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          width: 15, height: 15, borderRadius: '50%',
          background: i === active % 3 ? c : 'transparent',
          border: `2px solid ${i === active % 3 ? c : PENCIL}`,
          transform: `scale(${i === active % 3 ? 1 + 0.22 * on : 1})`,
        }} />
      ))}
    </div>
  );
};

/** 底部提示条：红蜡笔粗线 + 一句话（本片的结论承载，不用红色渐变大色块） */
export const BottomNote: React.FC<{
  text: string; delay: number; motion: MotionKey; color?: string; size?: number;
}> = ({ text, delay, motion, color = CRAYON_RED, size = 44 }) => (
  <div style={{ position: 'absolute', left: PAD_L, right: PAD_L, top: 1500 }}>
    <DropIn motion={motion} delay={delay} from={-30} rotate={0}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <CrayonLine delay={delay + 8} width={Math.min(760, text.length * size + 60)} color={color} thick={9} />
        <div style={{ fontFamily: FONT_BODY, fontSize: size, fontWeight: 800, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3 }}>
          {text}
        </div>
      </div>
    </DropIn>
  </div>
);

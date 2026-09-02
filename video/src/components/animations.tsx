// 基础动画原子件（仅提效，非模板）
// 2026-09-02 Q4 零引用件清理：入场包装件（FadeInUp / SlideInLeft / SlideInRight / ScaleIn / WipeIn / Pulse）全部删除——
//   现行每片入场都在片内内联手写（见各 `videos/gXX/index.tsx` 的 HandIn），共享层不再预建成品入场件（防"会动的 PPT"与同质化）。
//   本文件只留三样被真实消费的原子：SPRING_CONFIG（VTemplate 转场 timing 消费）+ EASE_OUT / EASE_IN（Subtitle 与各片手写动画消费）。
import { Easing } from 'remotion';
import type { MotionKey } from '../types';

export const SPRING_CONFIG: Record<MotionKey, { damping: number; stiffness: number; mass?: number }> = {
  bouncy: { damping: 14, stiffness: 100 },
  snappy: { damping: 25, stiffness: 180 },
  buttery: { damping: 50, stiffness: 50 },
  heavy: { damping: 30, stiffness: 80, mass: 3 },
};

/** expo-out：非 spring 动画的标准缓动 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** expo-in：淡出 / 离场用的加速缓动（与 EASE_OUT 对称） */
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

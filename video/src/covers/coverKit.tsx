// 封面大字系统（2026-09-11 v2 · 对标去年「黑底大字」封面的冲击力，适配珊瑚橙底）
// 结构 = hook 超大白字 + payoff 暖金大字 + 副标题方圆体；零 UI 组件、零品牌名
// hook 单字占画面宽 ~24%（264/1080，去年参考 ~28%），缩到信息流小图仍清晰（360px 实测口径）
// 描边增重（paintOrder stroke fill）代替黑底的高对比，让橙底上的白字/金字立得住
// 字体：hook/payoff 数黑体（端正超重海报字）+ 副标方圆体（圆润亲和），两字体一硬一柔
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { FONT_IMPACT, FONT_ROUND } from '../palette';

const HOOK_WHITE = '#ffffff';
// 暖金偏亮：金与橙底同为暖色，靠「提亮 + 加强描边」拉开层次（小图实测口径）
const PAYOFF_GOLD = '#FFEDB8';
const SUB_WHITE = 'rgba(255,255,255,0.96)';
// 深红描边/阴影基色：与珊瑚橙同族，压得住画面又不脏
const inkRed = (a: number) => `rgba(122,28,12,${a})`;

/** 封面专属背景：CV-001 珊瑚橙渐变底（封面背景资源库，不复用视频 bg） */
export const CoverBg: React.FC = () => (
  <AbsoluteFill>
    <img src={staticFile('cover/CV-001-珊瑚橙渐变底.jpg')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

/** hook 行：数黑体 · 白 · 超大 · 深红描边增重 */
export const Hook: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{
    fontFamily: FONT_IMPACT, fontSize: size, lineHeight: 1.16, fontWeight: 700,
    color: HOOK_WHITE, letterSpacing: 2,
    WebkitTextStroke: `${Math.max(4, Math.round(size * 0.034))}px ${inkRed(0.32)}`,
    paintOrder: 'stroke fill',
    textShadow: `0 ${Math.round(size * 0.06)}px ${Math.round(size * 0.18)}px ${inkRed(0.5)}`,
  }}>{children}</div>
);

/** payoff 行：数黑体 · 暖金 · 大字号，深红描边稍强（金与橙底近，靠描边拉开） */
export const Payoff: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{
    fontFamily: FONT_IMPACT, fontSize: size, lineHeight: 1.16, fontWeight: 700,
    color: PAYOFF_GOLD, letterSpacing: 3,
    WebkitTextStroke: `${Math.max(3, Math.round(size * 0.048))}px ${inkRed(0.5)}`,
    paintOrder: 'stroke fill',
    textShadow: `0 ${Math.round(size * 0.08)}px ${Math.round(size * 0.24)}px ${inkRed(0.6)}`,
  }}>{children}</div>
);

/** 副标题：方圆体 · 白 96% · 宽字距（小字不加描边，只留柔影） */
export const SubLine: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{
    fontFamily: FONT_ROUND, fontSize: size, color: SUB_WHITE,
    letterSpacing: Math.round(size * 0.18),
    textShadow: `0 ${Math.round(size * 0.05)}px ${Math.round(size * 0.22)}px ${inkRed(0.45)}`,
  }}>{children}</div>
);

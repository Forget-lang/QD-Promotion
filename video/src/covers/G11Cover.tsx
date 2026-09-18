// g11 烧烤夜宵 · 封面（大字压屏版：hook「周一空桌」+ payoff「8 点开抢」+ 副标）
// 字体系统见 covers/coverKit.tsx；零 UI 组件、零品牌名；背景固定封面背景库 CV-001（不复用视频 bg）
// 入口三件套①：封面主文案与口播前 2 秒同题（烧烤店 · 周五满 / 周一空）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CoverBg, Hook, Payoff, SubLine } from './coverKit';

// ════════════════ 抖音封面 9:16（1080×1920）════════════════
export const G11CoverDy: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 505, textAlign: 'center' }}>
      <Hook size={232}>周一空桌</Hook>
      <div style={{ marginTop: 26 }}>
        <Payoff size={168}>8 点开抢</Payoff>
      </div>
      <div style={{ marginTop: 62 }}>
        <SubLine size={62}>烧烤店手气券玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 抖音横版封面 4:3（1440×1080）════════════════
// 网页端发布需竖横两版分别设置；与竖版同题
export const G11CoverDy43: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 90, right: 90, top: 265, textAlign: 'center' }}>
      <Hook size={190}>周一空桌</Hook>
      <div style={{ marginTop: 22 }}>
        <Payoff size={132}>8 点开抢</Payoff>
      </div>
      <div style={{ marginTop: 48 }}>
        <SubLine size={48}>烧烤店手气券玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 小红书封面 3:4（1080×1440）════════════════
export const G11CoverXhs: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 430, textAlign: 'center' }}>
      <Hook size={196}>周一空桌</Hook>
      <div style={{ marginTop: 24 }}>
        <Payoff size={140}>8 点开抢</Payoff>
      </div>
      <div style={{ marginTop: 52 }}>
        <SubLine size={54}>烧烤店手气券玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 搜狐头图 16:9（1920×1080）════════════════
export const G11CoverSohu: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 180, right: 180, top: 265, textAlign: 'center' }}>
      <Hook size={190}>周一空桌</Hook>
      <div style={{ marginTop: 22 }}>
        <Payoff size={132}>8 点开抢</Payoff>
      </div>
      <div style={{ marginTop: 50 }}>
        <SubLine size={46}>烧烤店手气券玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

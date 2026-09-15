// g10 美容沙龙 · 封面（大字压屏版：hook「老带新」+ payoff「1 张券就够」+ 副标）
// 字体系统见 covers/coverKit.tsx；零 UI 组件、零品牌名
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CoverBg, Hook, Payoff, SubLine } from './coverKit';

// ════════════════ 抖音封面 9:16（1080×1920）════════════════
export const G10CoverDy: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 505, textAlign: 'center' }}>
      <Hook size={264}>老带新</Hook>
      <div style={{ marginTop: 24 }}>
        <Payoff size={182}>1 张券就够</Payoff>
      </div>
      <div style={{ marginTop: 64 }}>
        <SubLine size={62}>美容院客人转赠裂变玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 小红书封面 3:4（1080×1440）════════════════
export const G10CoverXhs: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 430, textAlign: 'center' }}>
      <Hook size={216}>老带新</Hook>
      <div style={{ marginTop: 22 }}>
        <Payoff size={148}>1 张券就够</Payoff>
      </div>
      <div style={{ marginTop: 52 }}>
        <SubLine size={52}>美容院客人转赠裂变玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 抖音横版封面 4:3（1440×1080）════════════════
// 网页端发布需竖横两版分别设置；与竖版同题
export const G10CoverDy43: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 90, right: 90, top: 265, textAlign: 'center' }}>
      <Hook size={216}>老带新</Hook>
      <div style={{ marginTop: 22 }}>
        <Payoff size={142}>1 张券就够</Payoff>
      </div>
      <div style={{ marginTop: 48 }}>
        <SubLine size={48}>美容院客人转赠裂变玩法</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 搜狐头图 16:9（1920×1080）════════════════
export const G10CoverSohu: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 180, right: 180, top: 265, textAlign: 'center' }}>
      <Hook size={228}>老带新</Hook>
      <div style={{ marginTop: 22 }}>
        <Payoff size={148}>1 张券就够</Payoff>
      </div>
      <div style={{ marginTop: 50 }}>
        <SubLine size={46}>美容院老客转赠裂变 · 闺蜜带人自动发奖</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// g07 咖啡茶饮 · 封面（按最新封面规范：只标题+副标题，零 UI 组件，红底珊瑚橙）
// 背景 = CV-001 珊瑚橙渐变底（封面背景资源库，不复用视频 bg）
// 主标题得意黑（冲击）+ 副标题方圆体（亲和），白字，零品牌名
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { FONT_ROUND, FONT_TITLE } from '../palette';

const TITLE_WHITE = '#ffffff';
const SUB_WHITE = 'rgba(255,255,255,0.9)';
const TITLE_SHADOW = '0 6px 30px rgba(150,45,30,0.45)';

const Bg: React.FC = () => (
  <AbsoluteFill>
    <img src={staticFile('cover/CV-001-珊瑚橙渐变底.jpg')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

const MainTitle: React.FC<{ size: number; lines: [string, string] }> = ({ size, lines }) => (
  <>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.25, color: TITLE_WHITE, letterSpacing: 3, textShadow: TITLE_SHADOW }}>{lines[0]}</div>
    <div style={{ fontFamily: FONT_TITLE, fontSize: size, lineHeight: 1.25, color: TITLE_WHITE, letterSpacing: 3, textShadow: TITLE_SHADOW, marginTop: 14 }}>{lines[1]}</div>
  </>
);

const SubLine: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <div style={{ fontFamily: FONT_ROUND, fontSize: size, color: SUB_WHITE, letterSpacing: 2, textShadow: '0 2px 14px rgba(150,45,30,0.3)' }}>{children}</div>
);

// 抖音 9:16
export const G07CoverDy: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_TITLE }}>
    <Bg />
    <div style={{ position: 'absolute', left: 60, right: 60, top: 420, textAlign: 'center' }}>
      <MainTitle size={156} lines={['1 栏门槛，', '决定回头率']} />
      <div style={{ marginTop: 52 }}>
        <SubLine size={52}>咖啡店满减券这么填</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// 抖音横版 4:3
export const G07CoverDy43: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_TITLE }}>
    <Bg />
    <div style={{ position: 'absolute', left: 90, top: 220 }}>
      <MainTitle size={114} lines={['1 栏门槛，', '决定回头率']} />
      <div style={{ marginTop: 40 }}>
        <SubLine size={42}>咖啡店满减券这么填</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// 小红书 3:4
export const G07CoverXhs: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_TITLE }}>
    <Bg />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 280, textAlign: 'center' }}>
      <MainTitle size={128} lines={['1 栏门槛，', '决定回头率']} />
      <div style={{ marginTop: 42 }}>
        <SubLine size={42}>咖啡店满减券这么填</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// 搜狐 16:9
export const G07CoverSohu: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_TITLE }}>
    <Bg />
    <div style={{ position: 'absolute', left: 180, top: 220 }}>
      <MainTitle size={124} lines={['1 栏门槛，', '决定回头率']} />
      <div style={{ marginTop: 48 }}>
        <SubLine size={48}>咖啡店满减券 · 门槛填法决定复购</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

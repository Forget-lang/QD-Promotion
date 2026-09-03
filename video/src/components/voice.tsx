// 语音能量（2026-09-03 用户拍板升级四项，片 2 起消费）：有声版口播能量驱动强调元素微脉动。
// 架构：VTemplate 在每屏 Sequence 挂 VoiceEnergyProvider（有声传语音 src，无声传 null 直通）；
// 屏组件用 useVoiceEnergy() 取 0..1 能量（无声版恒 0，调用方无需区分有声无声）。
// 取数走 @remotion/media-utils 帧级波形，不依赖浏览器播放时钟。
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

const VoiceEnergyContext = React.createContext<number>(0);

/** 真正读音频数据的内层：仅在 src 存在（有声版）时挂载，无声版不碰音频文件 */
const VoiceEnergyInner: React.FC<{ src: string; children: React.ReactNode }> = ({ src, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(src);

  let energy = 0;
  if (audioData) {
    const samples = visualizeAudio({ fps, frame, audioData, numberOfSamples: 8 });
    const avg = samples.reduce((sum, v) => sum + v, 0) / samples.length;
    const peak = Math.max(...samples);
    energy = Math.min(1, avg * 0.6 + peak * 0.6);
  }

  return (
    <VoiceEnergyContext.Provider value={energy}>
      {children}
    </VoiceEnergyContext.Provider>
  );
};

/** 挂载点：VTemplate 每屏包一层；src=null（无声版）时原样透传，不产生音频读取 */
export const VoiceEnergyProvider: React.FC<{ src: string | null; children: React.ReactNode }> = ({ src, children }) => {
  if (!src) return <>{children}</>;
  return <VoiceEnergyInner src={src}>{children}</VoiceEnergyInner>;
};

/** 消费点：屏组件内调用取当前帧语音能量 0..1；无声版恒 0 */
export const useVoiceEnergy = (): number => React.useContext(VoiceEnergyContext);

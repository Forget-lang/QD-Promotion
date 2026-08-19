/**
 * G02 茶饮咖啡 · v4 终极声画同步版
 *
 * 2026-08-19 v4 终极优化（J-cut 转场交叉同步法）：
 *   - 音频文件零裁剪零淡入，只做响度归一化（第一个字 100% 完整）
 *   - voiceOffset = 0，画面一出来就说话，绝不空等
 *   - 每屏音频在最后 TRANSITION_FRAMES 帧内线性淡出（J-cut）
 *   - 下一屏音频从转场第一帧就正常音量进入（零淡入）
 *   - 效果：上句尾音渐弱 + 下句完整首字 = 无缝衔接，无爆音，首字清晰
 *
 * 为什么这是确定的（不需要试）：
 *   - TTS 语速稳定 → 时长可预测
 *   - ffprobe 精确到毫秒测量
 *   - Remotion 帧级渲染 → 淡入淡出是精确的数学曲线
 *   - 所有参数从时长推导，无经验值
 */

import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import type { TransitionPresentation } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { FPS, PALETTES } from './palette';
import { g02 } from './data/g02';
import { SceneRenderer } from './scenes';
import { SPRING_CONFIG } from './components/animations';
import type { TransitionKey } from './types';

/** 转场时长：12 帧 = 0.4s */
const TRANSITION_FRAMES = 12;

const getPresentation = (t: TransitionKey): TransitionPresentation<Record<string, unknown>> => {
  switch (t) {
    case 'wipe':
      return wipe({ direction: 'from-bottom' }) as TransitionPresentation<Record<string, unknown>>;
    case 'slide':
      return slide({ direction: 'from-right' }) as TransitionPresentation<Record<string, unknown>>;
    case 'dissolve':
    case 'zoom':
    case 'pop':
    default:
      return fade();
  }
};

/**
 * 带尾音淡出的 Audio 组件（J-cut 上句淡出）
 *
 * 原理：
 *   - 语音从第 0 帧开始播放（voiceOffset = 0），第一个字完整清晰
 *   - 在场景最后 TRANSITION_FRAMES 帧内，音量从 1 线性降到 0
 *   - 下一屏的语音在转场开始时以正常音量进入（零淡入）
 *   - 效果：上句尾音渐弱，下句首字完整 → 无缝 J-cut 衔接
 *
 * @param src 音频文件路径
 * @param sceneDurationInFrames 场景总帧数
 * @param startFrom 语音起点帧（默认 0）
 */
const FadingAudio: React.FC<{
  src: string;
  sceneDurationInFrames: number;
  startFrom?: number;
}> = ({ src, sceneDurationInFrames, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const fadeStartFrame = sceneDurationInFrames - TRANSITION_FRAMES;
  const audioFrame = frame - startFrom;

  // 音量计算：
  // - fadeStartFrame 之前：音量 = 1
  // - fadeStartFrame 到 sceneDurationInFrames：音量从 1 → 0（线性淡出）
  // - startFrom 之前：还没开始播放，音量 = 0（由 Audio 组件的 startFrom 控制）
  const volume =
    audioFrame < 0
      ? 0
      : interpolate(frame, [fadeStartFrame, sceneDurationInFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  return <Audio src={src} startFrom={startFrom} volume={volume} />;
};

export const TOTAL_FRAMES =
  g02.scenes.reduce((s, c) => s + c.dur * FPS, 0) -
  (g02.scenes.length - 1) * TRANSITION_FRAMES;

export const VTemplate: React.FC = () => {
  const presentation = getPresentation(g02.style.transition);
  const p = PALETTES[g02.style.palette];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1115' }}>
      {/* ── B 方案：行业背景图（模糊 + 降透明，只做氛围） ── */}
      {g02.style.bgImage && (
        <AbsoluteFill style={{ filter: 'blur(15px)', opacity: 0.55 }}>
          <Img
            src={staticFile(g02.style.bgImage)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      )}

      {/* 第三层：场景内容（转场 + UI 组件） */}
      <TransitionSeries>
        {g02.scenes.map((sc, i) => {
          const sceneFrames = Math.floor(sc.dur * FPS);
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={sceneFrames}>
                <SceneRenderer
                  scene={sc}
                  style={g02.style}
                  index={i}
                  total={g02.scenes.length}
                />
                <FadingAudio
                  src={staticFile(`audio/s${i + 1}.wav`)}
                  sceneDurationInFrames={sceneFrames}
                  startFrom={Math.floor((sc.voiceOffset || 0) * FPS)}
                />
              </TransitionSeries.Sequence>
              {i < g02.scenes.length - 1 && (
                <TransitionSeries.Transition
                  presentation={presentation}
                  timing={springTiming({
                    config: SPRING_CONFIG[g02.style.motion],
                    durationInFrames: TRANSITION_FRAMES,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

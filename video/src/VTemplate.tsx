import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { FPS, PALETTES } from './palette';
import { SceneRenderer } from './scenes';
import { SPRING_CONFIG } from './components/animations';
import { KenBurnsBg, Grain, Vignette, AccentOverlay } from './components/background';
import type { TransitionKey, VideoData } from './types';

/** 转场时长：12 帧 = 0.4s */
const TRANSITION_FRAMES = 12;

/** dissolve = 模糊 + 淡入淡出（真实呈现，非 fade 别名） */
const DissolvePresentation: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({
  children, presentationProgress: p, presentationDirection,
}) => {
  const entering = presentationDirection === 'entering';
  return (
    <AbsoluteFill style={{
      opacity: entering ? p : 1 - p,
      filter: `blur(${(entering ? 1 - p : p) * 8}px)`,
    }}>
      {children}
    </AbsoluteFill>
  );
};

/** zoom = 缩放推近 + 淡入淡出 */
const ZoomPresentation: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({
  children, presentationProgress: p, presentationDirection,
}) => {
  const entering = presentationDirection === 'entering';
  return (
    <AbsoluteFill style={{
      opacity: entering ? p : 1 - p,
      transform: `scale(${entering ? 1.15 - 0.15 * p : 1 + 0.08 * p})`,
    }}>
      {children}
    </AbsoluteFill>
  );
};

/** pop = spring 过冲弹入 + 淡出 */
const PopPresentation: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({
  children, presentationProgress: p, presentationDirection,
}) => {
  const entering = presentationDirection === 'entering';
  // sin(π·p) 在中段过冲到 1.12 再回落到 1，模拟 spring 过冲
  const enterScale = 0.85 + 0.15 * p + 0.12 * Math.sin(Math.PI * p);
  return (
    <AbsoluteFill style={{
      opacity: entering ? Math.min(1, p * 2) : 1 - p,
      transform: `scale(${entering ? enterScale : 1 - 0.06 * p})`,
    }}>
      {children}
    </AbsoluteFill>
  );
};

const getPresentation = (t: TransitionKey): TransitionPresentation<Record<string, unknown>> => {
  switch (t) {
    case 'wipe':
      return wipe({ direction: 'from-bottom' }) as TransitionPresentation<Record<string, unknown>>;
    case 'slide':
      return slide({ direction: 'from-right' }) as TransitionPresentation<Record<string, unknown>>;
    case 'dissolve':
      return { component: DissolvePresentation, props: {} };
    case 'zoom':
      return { component: ZoomPresentation, props: {} };
    case 'pop':
      return { component: PopPresentation, props: {} };
    default:
      return fade();
  }
};

/**
 * 带尾音淡出的 Audio 组件（J-cut 上句淡出 · B 方案）
 *
 * 延迟开口实现：用 Sequence 包裹 Audio，from={voiceOffsetFrames}
 *   - Audio 在 Sequence 内部从第 0 帧开始播放完整音频（首字不丢）
 *   - Sequence 的 from 决定音频何时开始（真正的延迟播放）
 *   - 音量曲线基于 Sequence 内部帧号（从 0 开始的音频时间轴）
 *
 * 淡出起点（B 方案）：从「语音实际结束点」开始线性降到 0，尾字零削波；
 * 数据未回填 voiceDur 时退回旧逻辑（最后 12 帧固定淡出）。
 */
const FadingAudio: React.FC<{
  src: string;
  sceneDurationInFrames: number;
  voiceOffsetFrames?: number;
  voiceDurationInFrames?: number;
}> = ({ src, sceneDurationInFrames, voiceOffsetFrames = 0, voiceDurationInFrames }) => {
  const innerDuration = sceneDurationInFrames - voiceOffsetFrames;
  const fallbackStart = innerDuration - TRANSITION_FRAMES;
  const fadeStartFrame = voiceDurationInFrames != null
    ? Math.min(Math.max(voiceDurationInFrames, 0), innerDuration - 1)
    : fallbackStart;

  return (
    <Sequence from={voiceOffsetFrames} durationInFrames={innerDuration}>
      <FadingAudioInner src={src} fadeStartFrame={fadeStartFrame} totalFrames={innerDuration} />
    </Sequence>
  );
};

const FadingAudioInner: React.FC<{
  src: string;
  fadeStartFrame: number;
  totalFrames: number;
}> = ({ src, fadeStartFrame, totalFrames }) => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [fadeStartFrame, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return <Audio src={src} volume={volume} />;
};

/** 计算视频总帧数（取整统一：所有 dur*FPS 统一 Math.floor） */
export const computeTotalFrames = (video: VideoData): number => {
  const totalSceneFrames = video.scenes.reduce(
    (sum, sc) => sum + Math.floor(sc.dur * FPS),
    0,
  );
  const overlapFrames = (video.scenes.length - 1) * TRANSITION_FRAMES;
  return totalSceneFrames - overlapFrames;
};

export const VTemplate: React.FC<{ video: VideoData }> = ({ video }) => {
  const presentation = getPresentation(video.style.transition);
  const p = PALETTES[video.style.palette];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1115' }}>
      {/* 背景模板图（全质量显示 + Ken Burns 微动，只做氛围） */}
      {video.style.bgImage && <KenBurnsBg src={video.style.bgImage} blur={video.style.bgBlur ?? 0} />}
      {/* 主色调和：背景图与 UI 色系融合（soft-light 只混下层背景） */}
      {video.style.bgImage && <AccentOverlay color={p.accent} opacity={0.18} />}

      {/* 场景内容（转场 + UI 组件） */}
      <TransitionSeries>
        {video.scenes.map((sc, i) => {
          const sceneFrames = Math.floor(sc.dur * FPS);
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={sceneFrames}>
                <SceneRenderer
                  scene={sc}
                  style={video.style}
                  index={i}
                  total={video.scenes.length}
                  videoId={video.id}
                />
                {video.hasAudio && (
                  <FadingAudio
                    src={staticFile(`audio/${video.id}/s${i + 1}.wav`)}
                    sceneDurationInFrames={sceneFrames}
                    voiceOffsetFrames={Math.floor((sc.voiceOffset || 0) * FPS)}
                    voiceDurationInFrames={sc.voiceDur != null ? Math.floor(sc.voiceDur * FPS) : undefined}
                  />
                )}
              </TransitionSeries.Sequence>
              {i < video.scenes.length - 1 && (
                <TransitionSeries.Transition
                  presentation={presentation}
                  timing={springTiming({
                    config: SPRING_CONFIG[video.style.motion],
                    durationInFrames: TRANSITION_FRAMES,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* 全片氛围层（质感三件套：暗角聚焦 + 颗粒杀色带 + 主色调和，始终挂载） */}
      <Grain opacity={0.035} />
      <Vignette strength={0.25} />
    </AbsoluteFill>
  );
};

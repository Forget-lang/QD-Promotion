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

/** reveal = 有机曲边扫过揭示（母题转场基座，2026-09-03 用户拍板） */
const REVEAL_W = 1080;
const REVEAL_H = 1920;

const revealEdgePath = (x: number): string =>
  `M ${x} 0 C ${x + 180} ${REVEAL_H * 0.33}, ${x - 180} ${REVEAL_H * 0.66}, ${x} ${REVEAL_H}`;

const RevealPresentation: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({
  children, presentationProgress: p, presentationDirection, passedProps,
}) => {
  const entering = presentationDirection === 'entering';
  const accent = String(passedProps.accent ?? '#ffffff');
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const x = interpolate(p, [0, 1], [-240, REVEAL_W + 240]);
  const edge = revealEdgePath(x);
  const clipShape = entering
    ? `${edge} L 0 ${REVEAL_H} L 0 0 Z`
    : `${edge} L ${REVEAL_W} ${REVEAL_H} L ${REVEAL_W} 0 Z`;
  const drift = entering
    ? interpolate(p, [0, 1], [48, 0], { extrapolateRight: 'clamp' })
    : interpolate(p, [0, 1], [0, -48], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={id}>
            <path d={clipShape} />
          </clipPath>
        </defs>
      </svg>
      <AbsoluteFill style={{ clipPath: `url(#${id})`, transform: `translateX(${drift}px)` }}>
        {children}
      </AbsoluteFill>
      {entering && (
        <svg
          viewBox={`0 0 ${REVEAL_W} ${REVEAL_H}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <path d={edge} fill="none" stroke={accent} strokeWidth={3} opacity={Math.sin(Math.PI * p) * 0.9} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

const getPresentation = (t: TransitionKey, accent: string): TransitionPresentation<Record<string, unknown>> => {
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
    case 'reveal':
      return { component: RevealPresentation, props: { accent } };
    default:
      throw new Error(`未匹配的转场键：${t}`);
  }
};

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

type VTemplateProps = {
  video: VideoData;
  /** 仅安全区取证：保留真实场景/字幕/生产 transform，去掉 full-bleed 氛围层。生产 Composition 永不启用。 */
  safeAreaProbe?: boolean;
};

export const VTemplate: React.FC<VTemplateProps> = ({ video, safeAreaProbe = false }) => {
  const p = PALETTES[video.style.palette];
  const presentation = getPresentation(video.style.transition, p.accent);
  // g11 生产值固定 0.76；安全区取证通过独立 Composition 显式传 safeAreaProbe=true，而不是继续缩小场景。
  const sceneScale = video.id === 'g11' ? 0.76 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1115' }}>
      {/* 背景模板图（全质量显示 + Ken Burns 微动，只做氛围；safe-area probe 不计 full-bleed 背景） */}
      {!safeAreaProbe && video.style.bgImage && <KenBurnsBg src={video.style.bgImage} blur={video.style.bgBlur ?? 0} />}
      {/* 主色调和：背景图与 UI 色系融合（soft-light 只混下层背景） */}
      {!safeAreaProbe && video.style.bgImage && <AccentOverlay color={p.accent} opacity={0.18} />}

      {/* 场景内容（转场 + UI 组件） */}
      <AbsoluteFill style={{ transform: `scale(${sceneScale})`, transformOrigin: 'center center' }}>
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
      </AbsoluteFill>

      {/* 全片氛围层（质感三件套：暗角聚焦 + 颗粒杀色带 + 主色调和；safe-area probe 不计 full-bleed 氛围） */}
      {!safeAreaProbe && <Grain opacity={0.035} />}
      {!safeAreaProbe && <Vignette strength={0.25} />}
    </AbsoluteFill>
  );
};

/** 独立安全区取证 Composition：输入 props 可序列化，避免依赖 bundle-time 环境变量缓存。 */
export const G11SafeAreaProbe: React.FC<{ video: VideoData }> = ({ video }) => (
  <VTemplate video={video} safeAreaProbe />
);

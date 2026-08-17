/**
 * G02 茶饮咖啡 · 无声版视频 v3（代码驱动 UI 组件 Motion Graphics）
 *
 * 2026-08-17 专业级优化：
 *   - 接入 @remotion/transitions TransitionSeries，场景间 wipe 转场替代硬切
 *     （原 Sequence 硬切与 style.transition:'wipe' 声明不符）
 *   - 转场时长 12 帧（0.4s），springTiming 对齐 buttery 缓动
 *   - transition 维度按 style.transition 分发，供后续视频轮换 slide/dissolve/fade
 *
 * 设计范式（2026-08-14 用户确认）：
 *   Remotion 代码绘制 UI 组件 + 结构化信息 + 精确动画
 *   + 项目商用字体（得意黑/普惠体/方圆体）+ SVG 内联图标
 *   = 讲解级 PPT Motion Graphics，参考鱼皮信息图/视频风格
 *
 * 资源：字体来自 商用字体/（已复制到 public/fonts/）；图标内联 SVG；零 AI 生图。
 * 画幅：1080×1920 @30fps | 时长：约 64.6s（7 屏 + 6 个 0.4s wipe 转场）
 * 状态：无声版；确认画面后最后一步才合成 TTS 语音。
 *
 * 架构（2026-08-15 数据驱动重构）：
 *   VTemplate = 读 data/g02.ts → TransitionSeries 按 scene.type 分发到 scenes/ 渲染器
 *   内容在 data/g02.ts（核心环节产物），视觉系统在 components/ + scenes/（可复用积木）。
 *   风格配置（style）控制配色/动画性格/转场，多风格轮换 + 相似度检查见 10-视频制作方案。
 *
 * ⚠️ 硬禁区：本文件仅服务 G02 这一条视频。下一条视频须全新独立设计（换 data + 风格配置）。
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import type { TransitionPresentation } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { FPS } from './palette';
import { g02 } from './data/g02';
import { SceneRenderer } from './scenes';
import type { TransitionKey } from './types';

/** 转场时长：12 帧 = 0.4s（专业 MG 标准，不拖沓不突兀） */
const TRANSITION_FRAMES = 12;

/**
 * 按 style.transition 映射到 @remotion/transitions presentation。
 * 未来新视频换 transition 值即换转场型，无需改本文件。
 */
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
 * 总帧数 = Σ(场景 dur×FPS) - (场景数-1)×转场帧数
 * 转场在相邻场景间重叠，TransitionSeries 自动计算，这里手动同步给 Composition。
 */
export const TOTAL_FRAMES =
  g02.scenes.reduce((s, c) => s + c.dur * FPS, 0) -
  (g02.scenes.length - 1) * TRANSITION_FRAMES;

export const VTemplate: React.FC = () => {
  const presentation = getPresentation(g02.style.transition);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1115' }}>
      <TransitionSeries>
        {g02.scenes.map((sc, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={sc.dur * FPS}>
              <SceneRenderer
                scene={sc}
                style={g02.style}
                index={i}
                total={g02.scenes.length}
              />
            </TransitionSeries.Sequence>
            {i < g02.scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={presentation}
                timing={springTiming({
                  config: { damping: 50, stiffness: 50 },
                  durationInFrames: TRANSITION_FRAMES,
                })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

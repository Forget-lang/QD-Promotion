/**
 * G02 茶饮咖啡 · 无声版视频 v2（代码驱动 UI 组件 Motion Graphics）
 *
 * 设计范式（2026-08-14 用户确认）：
 *   旧方案：AI 生成插画 + 大字贴图 = 质感差、信息量低 ❌
 *   本方案：Remotion 代码绘制 UI 组件 + 结构化信息 + 精确动画
 *          + 项目商用字体（得意黑/普惠体/方圆体）+ SVG 内联图标
 *          = 讲解级 PPT Motion Graphics，参考鱼皮信息图/视频风格 ✅
 *
 * 资源：字体来自 商用字体/（已复制到 public/fonts/）；图标内联 SVG；零 AI 生图。
 * 画幅：1080×1920 @30fps | 时长：约 67s | 7 屏独立场景（一次讲透，无「下个视频」钩子）。
 * 状态：无声版；确认画面后最后一步才合成 TTS 语音。
 *
 * 架构（2026-08-15 数据驱动重构）：
 *   VTemplate = 读 data/g02.ts → 按 scene.type 分发到 scenes/ 渲染器
 *   内容在 data/g02.ts（核心环节产物），视觉系统在 components/ + scenes/（可复用积木）。
 *   风格配置（style）控制配色/动画性格，多风格轮换 + 相似度检查见 10-视频制作方案。
 *
 * ⚠️ 硬禁区：本文件仅服务 G02 这一条视频。下一条视频须全新独立设计（换 data + 风格配置）。
 */

import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { FPS } from './palette';
import { g02 } from './data/g02';
import { SceneRenderer } from './scenes';

export const TOTAL_FRAMES = g02.scenes.reduce((s, c) => s + c.dur * FPS, 0); // 2010

export const VTemplate: React.FC = () => {
  let acc = 0;
  const ranges = g02.scenes.map((s) => {
    const start = acc;
    const dur = s.dur * FPS;
    acc += dur;
    return { ...s, start, dur };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1115' }}>
      {ranges.map((sc, i) => (
        <Sequence key={i} from={sc.start} durationInFrames={sc.dur} name={`S${i + 1}-${sc.type}`}>
          <SceneRenderer scene={sc} style={g02.style} index={i} total={g02.scenes.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

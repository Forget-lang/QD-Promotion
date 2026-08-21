// S4 流程·大步骤卡 · 2026-08-21 v4 视觉红线版
// - 纵向大步骤卡，步骤号超大做视觉锤
// - 每步全宽 960px，高 320px，填满上 2/3
// - 透明背景，白色玻璃卡浮在背景图上
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import { FPS } from '../palette';
import type { MotionKey, Scene, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, ScaleIn, SPRING_CONFIG } from '../components/animations';
import { CharReveal, elevation } from '../components/ui';

export const FlowScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const nodes = scene.nodes ?? [];

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 top: 100 */}
      <div style={{ position: 'absolute', top: 100, width: '100%', padding: '0 60px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight, color: '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
        {scene.sub && (
          <FadeInUp delay={18} motion={style.motion}>
            <div style={{
              marginTop: 16, fontFamily: FONT_BODY, fontSize: 34,
              color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.4,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {scene.sub}
            </div>
          </FadeInUp>
        )}
      </div>

      {/* 步骤卡片区：从 y:280 开始，纵向排列 */}
      <div style={{
        position: 'absolute', top: 280, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
      }}>
        {nodes.map((n, i) => {
          const delay = 12 + i * 20;
          const nodeColor = n.color || p.accent;
          return (
            <ScaleIn key={i} delay={delay} motion={style.motion} startScale={0.88}>
              <div style={{
                width: 960, height: 320,
                backgroundColor: 'rgba(255,255,255,0.96)',
                borderRadius: 36,
                boxShadow: `${elevation(3)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
                display: 'flex', alignItems: 'center', gap: 40, padding: '0 52px',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${nodeColor}`,
              }}>
                <StepNumber num={i + 1} color={nodeColor} delay={delay} motion={style.motion} typo={typo} />

                <div style={{
                  width: 130, height: 130, borderRadius: 36,
                  background: `linear-gradient(135deg, ${nodeColor}20, ${nodeColor}08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 68, height: 68 }}>{Ico[n.icon](nodeColor)}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight,
                    color: '#1a1a1a', lineHeight: 1.2,
                  }}>
                    {n.title}
                  </div>
                  <StepSubtitle index={i} />
                </div>
              </div>
            </ScaleIn>
          );
        })}
      </div>

      {/* 底部脚注 */}
      {scene.footnote && (
        <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 60px', textAlign: 'center' }}>
          <FadeInUp delay={120} motion={style.motion}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 32, color: 'rgba(255,255,255,0.92)',
              background: 'rgba(255,255,255,0.15)', padding: '18px 44px', borderRadius: 999,
              display: 'inline-block',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              {scene.footnote}
            </div>
          </FadeInUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

const StepNumber: React.FC<{
  num: number; color: string; delay: number; motion: MotionKey; typo: { family: string; titleWeight: number };
}> = ({ num, color, delay, motion, typo }) => {
  const f = useCurrentFrame();
  const spr = spring({
    frame: f - delay - 6, fps: FPS,
    config: SPRING_CONFIG[motion] ?? SPRING_CONFIG.snappy,
  });
  return (
    <div style={{
      width: 120, height: 120, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}ee)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: `0 10px 30px ${color}50`,
      transform: `scale(${0.3 + 0.7 * spr})`,
    }}>
      <span style={{
        fontFamily: typo.family, fontSize: 58, fontWeight: typo.titleWeight,
        color: '#fff', lineHeight: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>{num}</span>
    </div>
  );
};

const StepSubtitle: React.FC<{ index: number }> = ({ index }) => {
  const subs = [
    '分享券 + 回馈券，设好转赠奖励规则',
    '老客扫码领券，一键转赠给朋友',
    '朋友核销，奖励自动到账，全程不用你管',
  ];
  return (
    <div style={{
      fontFamily: FONT_BODY, fontSize: 28, color: '#888', marginTop: 10, lineHeight: 1.5,
    }}>
      {subs[index]}
    </div>
  );
};

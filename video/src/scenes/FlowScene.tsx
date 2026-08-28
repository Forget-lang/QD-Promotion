// S4 流程屏（flow）· 两种呈现：纵向大步骤卡（默认）/ 横向节点串联（layout: 'horizontal'）
// - 纵向：每步全宽 920px 白卡高 320px，步骤号超大做视觉锤
// - 横向：序号圆 + 图标 + 标题 + 补充小字，节点间连接线逐段 draw-on（craft §8 L-06 流程线性型）
// - 透明背景，白色玻璃卡浮在背景图上
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { FONT_BODY, PALETTES, TYPOGRAPHY } from '../palette';
import { FPS } from '../palette';
import type { MotionKey, Scene, SceneNode, StyleConfig } from '../types';
import { Ico } from '../components/icons';
import { EASE_OUT, FadeInUp, ScaleIn, SPRING_CONFIG } from '../components/animations';
import { CharReveal, elevation } from '../components/ui';

export const FlowScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const nodes = scene.nodes ?? [];
  const isHorizontal = scene.layout === 'horizontal';

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题区 top: 120（安全区 ≥120px） */}
      <div style={{ position: 'absolute', top: 120, width: '100%', padding: '0 80px' }}>
        <CharReveal
          text={scene.title ?? ''}
          delay={2}
          style={{
            fontFamily: typo.family, fontSize: 72, fontWeight: typo.titleWeight, color: scene.darkText ? p.ink : '#fff',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
            textShadow: scene.darkText ? '0 2px 10px rgba(255,255,255,0.4)' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
        {scene.sub && (
          <FadeInUp delay={18} motion={style.motion}>
            <div style={{
              marginTop: 16, fontFamily: FONT_BODY, fontSize: 34,
              color: scene.darkText ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.4,
              textShadow: scene.darkText ? 'none' : '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {scene.sub}
            </div>
          </FadeInUp>
        )}
      </div>

      {isHorizontal ? (
        <HorizontalNodes
          nodes={nodes} accent={p.accent} accentDark={p.accentDark}
          dark={scene.darkText ?? false} motion={style.motion} typo={typo}
        />
      ) : (
      /* 步骤卡片区：从 y:280 开始，纵向排列 */
      <div style={{
        position: 'absolute', top: 280, left: 80, right: 80,
        display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
      }}>
        {nodes.map((n, i) => {
          const delay = 12 + i * 20;
          const nodeColor = n.color || p.accent;
          return (
            <ScaleIn key={i} delay={delay} motion={style.motion} startScale={0.88}>
              <div style={{
                width: 920, height: 320,
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
                  <StepSubtitle sub={nodes[i].sub} />
                </div>
              </div>
            </ScaleIn>
          );
        })}
      </div>
      )}

      {/* 底部脚注 */}
      {scene.footnote && (
        <div style={{ position: 'absolute', bottom: 190, width: '100%', padding: '0 80px', textAlign: 'center' }}>
          <FadeInUp delay={120} motion={style.motion}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 32, color: scene.darkText ? 'rgba(26,26,26,0.85)' : 'rgba(255,255,255,0.92)',
              background: scene.darkText ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)',
              padding: '18px 44px', borderRadius: 999,
              display: 'inline-block',
              backdropFilter: 'blur(8px)',
              border: scene.darkText ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.25)',
              textShadow: scene.darkText ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
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

const StepSubtitle: React.FC<{ sub?: string }> = ({ sub }) => {
  if (!sub) return null;
  return (
    <div style={{
      fontFamily: FONT_BODY, fontSize: 28, color: '#888', marginTop: 10, lineHeight: 1.5,
    }}>
      {sub}
    </div>
  );
};

// ── C1 变体：横向节点串联（craft §8 L-06）──
const NODE_COL_W = 260;
const NODE_ROW_W = 920;
const NODE_STEP = 36;

const HorizontalNodes: React.FC<{
  nodes: SceneNode[]; accent: string; accentDark: string; dark: boolean; motion: MotionKey;
  typo: { family: string; titleWeight: number };
}> = ({ nodes, accent, accentDark, dark, motion, typo }) => {
  const n = nodes.length;
  const gap = n > 1 ? (NODE_ROW_W - n * NODE_COL_W) / (n - 1) : 0;
  const centerOf = (i: number) => i * (NODE_COL_W + gap) + NODE_COL_W / 2;
  return (
    <div style={{ position: 'absolute', top: 700, left: 80, right: 80, height: 450 }}>
      {/* 连接线层（先绘制 → 落在序号圆之后）：圆心中线 y=60 */}
      {nodes.slice(0, -1).map((_, i) => (
        <Connector
          key={i} color={accentDark}
          left={centerOf(i) + 60} width={gap + NODE_COL_W - 120}
          delay={32 + i * NODE_STEP}
        />
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {nodes.map((nd, i) => {
          const delay = 12 + i * NODE_STEP;
          const c = nd.color || accent;
          return (
            <div key={i} style={{ width: NODE_COL_W, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <StepNumber num={i + 1} color={c} delay={delay} motion={motion} typo={typo} />
              <FadeInUp delay={delay + 6} motion={motion} dist={26}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, marginTop: 14 }}>{Ico[nd.icon](c)}</div>
                  <div style={{
                    marginTop: 12, fontFamily: typo.family, fontSize: 40, fontWeight: typo.titleWeight,
                    color: dark ? '#1a1a1a' : '#fff', lineHeight: 1.25, textAlign: 'center',
                  }}>{nd.title}</div>
                  {nd.sub && (
                    <div style={{
                      marginTop: 8, fontFamily: FONT_BODY, fontSize: 26, lineHeight: 1.5,
                      color: dark ? '#888' : 'rgba(255,255,255,0.8)', textAlign: 'center',
                    }}>{nd.sub}</div>
                  )}
                </div>
              </FadeInUp>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** 节点间连接线：4px 主题深色，scaleX 左→右逐段 draw-on */
const Connector: React.FC<{ color: string; left: number; width: number; delay: number }> = ({
  color, left, width, delay,
}) => {
  const f = useCurrentFrame();
  const grow = interpolate(f - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  return (
    <div style={{
      position: 'absolute', top: 58, left, width, height: 4, borderRadius: 2,
      background: `linear-gradient(90deg, ${color}, ${color}bb)`,
      transformOrigin: 'left center', transform: `scaleX(${grow})`,
      opacity: grow > 0 ? 1 : 0,
    }} />
  );
};

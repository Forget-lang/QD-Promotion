// S2 痛点·纵向列表式 · v7
// - 标题：深绿色顶栏 + 白字
// - 主体：白底大卡片填满中部（y:240 → y:1300）
// - 列表项纵向均匀分布，每一项都有分量
// - 结论：卡片底部红色结论区
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
import { ACCENT_RED, PALETTES, TYPOGRAPHY, FPS } from '../palette';
import type { Scene, StyleConfig, MotionKey } from '../types';
import { Ico } from '../components/icons';
import { FadeInUp, SPRING_CONFIG } from '../components/animations';
import { elevation } from '../components/ui';

function AnimatedItem({ children, delay, motion }: { children: React.ReactNode; delay: number; motion: MotionKey }) {
  const f = useCurrentFrame();
  const spr = spring({ frame: f - delay, fps: FPS, config: SPRING_CONFIG[motion] });
  return (
    <div style={{
      flex: 1,
      display: 'flex', alignItems: 'center',
      opacity: interpolate(spr, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
    }}>
      {children}
    </div>
  );
}

export const PainScene: React.FC<{ scene: Scene; style: StyleConfig; index: number; total: number }> = ({
  scene, style,
}) => {
  const p = PALETTES[style.palette];
  const typo = TYPOGRAPHY[style.typography];
  const f = useCurrentFrame();
  const leftItems = scene.leftItems ?? [];

  // 编号列表变体（R3 §5.6 呈现手法 ref-01，S2 用）：大编号 + 红色下划线标题 + 正文，网格纸感
  if (scene.layout === 'numbered-list') {
    return <NumberedListPain scene={scene} style={style} typo={typo} p={p} />;
  }

  const titleSpr = spring({
    frame: f - 2, fps: FPS, config: SPRING_CONFIG[style.motion],
  });

  const headerSpr = spring({
    frame: f - 8, fps: FPS, config: SPRING_CONFIG[style.motion],
  });

  const conclusionSpr = spring({
    frame: f - 56, fps: FPS, config: SPRING_CONFIG[style.motion],
  });

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>

      {/* ===== 标题（y:120） ===== */}
      <div style={{
        position: 'absolute', top: 120, left: 80, right: 80,
        transform: `translateY(${(1 - titleSpr) * -30}px)`,
        opacity: titleSpr,
      }}>
        <div style={{
          backgroundColor: p.accentDark,
          borderRadius: 24,
          padding: '28px 48px',
          boxShadow: elevation(3),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: typo.family, fontSize: 64, fontWeight: typo.titleWeight,
            color: '#fff', lineHeight: 1.2, letterSpacing: '0.01em',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {scene.title ?? ''}
          </span>
        </div>
      </div>

      {/* ===== 大卡片（y:240 → bottom:420，填满中部，离字幕区更近） ===== */}
      <div style={{
        position: 'absolute', top: 240, left: 80, right: 80, bottom: 420,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 32,
        boxShadow: elevation(3),
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* 分类标题 */}
        <div style={{
          padding: '48px 56px 24px',
          opacity: headerSpr,
          transform: `translateY(${(1 - headerSpr) * -20}px)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 60, height: 60, backgroundColor: ACCENT_RED, borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{ width: 30, height: 30 }}>{Ico.x('#fff')}</div>
            </div>
            <span style={{
              fontFamily: typo.family, fontSize: 52, fontWeight: typo.titleWeight,
              color: ACCENT_RED, lineHeight: 1.2,
            }}>
              {scene.leftTitle ?? '传统引流'}
            </span>
          </div>
        </div>

        {/* 分隔线 */}
        <div style={{ height: 2, backgroundColor: '#f0f0f0', margin: '0 56px' }} />

        {/* 痛点列表区域（flex:1 撑开剩余空间，列表项均匀分布） */}
        <div style={{ flex: 1, padding: '8px 56px', display: 'flex', flexDirection: 'column' }}>
          {leftItems.map((item, i) => (
            <React.Fragment key={i}>
              <AnimatedItem delay={14 + i * 14} motion={style.motion}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 28, width: '100%' }}>
                  {/* 红色叉号圆块 */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: `${ACCENT_RED}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ width: 28, height: 28 }}>{Ico.x(ACCENT_RED)}</div>
                  </div>
                  {/* 痛点文字 */}
                  <span style={{
                    fontFamily: typo.bodyFamily, fontSize: 48, fontWeight: typo.bodyWeight,
                    color: '#222', lineHeight: 1.4, flex: 1,
                  }}>
                    {item}
                  </span>
                </div>
              </AnimatedItem>
              {i < leftItems.length - 1 && (
                <div style={{ height: 1, backgroundColor: '#eee' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 底部结论区 */}
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT_RED} 0%, ${ACCENT_RED}cc 100%)`,
          padding: '40px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          opacity: conclusionSpr,
          transform: `translateY(${(1 - conclusionSpr) * 30}px)`,
        }}>
          <div style={{ width: 52, height: 52 }}>{Ico.bolt('#fff')}</div>
          <span style={{
            fontFamily: typo.family, fontSize: 56, fontWeight: typo.titleWeight,
            color: '#fff', lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {scene.rightSub ?? '钱花了，人没来'}
          </span>
        </div>
      </div>

      {/* y:1500 以下留空给字幕（bottom:420 = 1920-420=1500，字幕从1760开始，留260px呼吸空间） */}

    </AbsoluteFill>
  );
};


// ── 编号列表变体（R3 §5.6 ref-01：大编号 + 标题红色下划线 + 正文，网格纸感）──
const NumberedListPain: React.FC<{
  scene: Scene; style: StyleConfig;
  typo: { family: string; titleWeight: number; bodyWeight: number; bodyFamily: string };
  p: (typeof PALETTES)['berry-purple'];
}> = ({ scene, style, typo, p }) => {
  const items = scene.leftItems ?? [];
  const itemsSub = scene.leftItemsSub ?? [];
  const titleSpr = spring({ frame: useCurrentFrame() - 2, fps: FPS, config: SPRING_CONFIG[style.motion] });
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* 标题（深紫顶栏，与其他屏一致） */}
      <div style={{
        position: 'absolute', top: 120, left: 80, right: 80,
        transform: `translateY(${(1 - titleSpr) * -30}px)`, opacity: titleSpr,
      }}>
        <div style={{
          backgroundColor: p.accentDark, borderRadius: 24, padding: '28px 48px',
          boxShadow: elevation(3), display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: typo.family, fontSize: 64, fontWeight: typo.titleWeight,
            color: '#fff', lineHeight: 1.2, letterSpacing: '0.01em',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>{scene.title ?? ''}</span>
        </div>
      </div>

      {/* 内容区（半透明白纸，网格质感由背景 BG-ABS-003 直接透出） */}
      <div style={{
        position: 'absolute', top: 240, left: 80, right: 80, bottom: 400,
        backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 32,
        boxShadow: elevation(3), backdropFilter: 'blur(6px)',
        padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 26,
      }}>
        {items.map((item, i) => (
          <FadeInUp key={i} delay={10 + i * 14} motion={style.motion}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, width: '100%' }}>
              {/* 大编号（主题色，ref-01 编号高亮） */}
              <div style={{
                fontFamily: typo.family, fontSize: 76, fontWeight: 900,
                color: p.accent, lineHeight: 1, flexShrink: 0, width: 92, textAlign: 'center',
              }}>{i + 1}</div>
              {/* 正文 + 红色下划线（ref-01 标题下划线）+ 痛点深挖副行（小字，为什么/后果，干货直接显示） */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: typo.bodyFamily, fontSize: 46, fontWeight: typo.bodyWeight,
                  color: '#222', lineHeight: 1.4,
                  borderBottom: `6px solid ${ACCENT_RED}cc`,
                  paddingBottom: 10, display: 'inline-block',
                }}>{item}</div>
                {itemsSub[i] && (
                  <div style={{
                    fontFamily: typo.bodyFamily, fontSize: 28, color: '#888', lineHeight: 1.5,
                    marginTop: 12,
                  }}>{itemsSub[i]}</div>
                )}
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>

      {/* 底部红色结论条 */}
      <FadeInUp delay={56} motion={style.motion}>
        <div style={{
          position: 'absolute', left: 80, right: 80, bottom: 280,
          background: `linear-gradient(135deg, ${ACCENT_RED} 0%, ${ACCENT_RED}cc 100%)`,
          borderRadius: 24, padding: '32px 48px', boxShadow: elevation(2),
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          <div style={{ width: 48, height: 48 }}>{Ico.bolt('#fff')}</div>
          <span style={{
            fontFamily: typo.family, fontSize: 52, fontWeight: typo.titleWeight,
            color: '#fff', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>{scene.rightSub ?? '钱花了，人没来'}</span>
        </div>
      </FadeInUp>
    </AbsoluteFill>
  );
};

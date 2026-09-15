// g11 烧烤夜宵 · 锁客裂变 · 专属屏组件（一条视频一套 UI 语言）
// 母题：炭火虚焦底 + 深色毛玻璃块 + 粗黑大标题 + 手气券卡（炭火暖橙系）· snappy 入场 · dissolve 转场
// 禁跨行业 import 其它片组件；入场/节拍内联本文件。
// 安全区：内容一律落在 x[120,960]——抖音全屏播放按屏比放大裁边（20:9 实测放大 1.18×、左右各裁约 82px，2026-09-11），口径属主 R3 §7.3。
// ════════════════ S1 · 钩子（hero-focus · 信息密度+流式排版 v9 2026-09-14）════════════════
// 布局规范（R3 §7.3）：核心内容集中带 y:200-1100；标题距顶 ≥200px；活动区硬底线 y:120-1760。
// 排版原则：单列左对齐流式栅格（left:120 内容宽800），间距走统一刻度本（GUT），
// 层级靠字号+色阶区分不靠空洞间距；分区用卡面/分隔线界定，绝不用超大留白冒充分区。
// 色彩规范（R3 §7.4）：语义色从 PALETTES['warm-orange'] 取，禁硬编码 hex。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SceneRenderProps } from '../../types';
import { FONT_BODY, FONT_TITLE, FPS, PALETTES } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import type { HookPayload, IdeaPayload, ProofPayload, FieldsPayload, MechanismPayload, CtaPayload, FieldPair, MechanismStep } from './types';

// ── 炭火暖橙主题色板（R3 §7.4：从 PALETTES 取，本片 style.palette = 'warm-orange'）──
const PA = PALETTES['warm-orange'];
const ACCENT = PA.accent;          // FF7043 炭火橙
const ACCENT_DARK = PA.accentDark; // e85d2f
const ACCENT_GOLD = '#FFB347';     // 暖金高亮（坐落在 warm-orange 主题上的金，属主题泛化用色）
const INK = PA.paper;              // 白 #ffffff（深炭火底上的主文字）
const MUTED = 'rgba(255,255,255,0.62)'; // 次级弱化字
const GLASS_BG = 'rgba(26, 17, 10, 0.74)';  // 深色毛玻璃底（W1 bgDark 系衍生）
const GLASS_BORDER = 'rgba(255, 112, 67, 0.28)';
const CARD_BG = 'rgba(32, 20, 12, 0.86)';
const CARD_ACCENT = ACCENT;
const LINE = 'rgba(255, 179, 71, 0.18)';

// ── 统一间距刻度本（R3 §7.3：间距 40-60px 区间；杜绝零散散值）──
const GUT = { xs: 16, s: 24, m: 44, l: 60 };

// ── snappy 擦入包装（干脆利落，不弹跳）──
const In: React.FC<{ delay: number; from?: number; children: React.ReactNode }> = ({ delay, from = 16, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * from}px)` }}>{children}</div>;
};

// ── 真实物理感入场（一镜一重点的"落定"时刻：轻微惯性 + 微小 overshoot，不 >6px）──
// 导演稿 §5.B：手机/券/主体用物理感，避免"处处弹跳"。裸用 translateY+opacity = 假，这段加 3px 回落。
const LandIn: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  const t = f - delay;
  const p = interpolate(t, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  const y = interpolate(t, [0, 8, 16], [34, -3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: p, transform: `translateY(${y}px)` }}>{children}</div>;
};

// ── 炭火氛围：漂浮火星粒子（帧驱动确定性，随机种子固定）——活的火：上升漂移 + 明暗呼吸 ──
const EmberParticles: React.FC = () => {
  const f = useCurrentFrame();
  const particles = Array.from({ length: 26 }, (_, i) => {
    const seed = i * 37 + 11;
    const x = 90 + ((seed * 53) % 900);
    const baseY = 1840 - (seed % 700);
    const speed = 0.5 + (seed % 12) * 0.09;      // 上升漂移速度
    const sway = 18 + (seed % 20);               // 横向摆幅（火星不是笔直飞）
    const size = 2 + (seed % 5);
    const delay = (seed * 13) % 90;
    const actualF = f + delay;
    const up = (actualF * speed) % 1900;
    const y = baseY - up;
    const twinkle = 0.35 + 0.3 * Math.abs(Math.sin((actualF + seed) * 0.06));
    return { x: x + Math.sin(actualF * 0.02 + seed) * sway, y, size, opacity: twinkle, i };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT_GOLD}, transparent 70%)`,
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 3}px ${ACCENT}`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ── 火焰图形（SVG，几何化不写实）──
const FlameIcon: React.FC<{ size?: number; color?: string }> = ({ size = 36, color = ACCENT_GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 7 8 7 13C7 16 9 19 12 21C15 19 17 16 17 13C17 8 12 2 12 2Z" fill={color} opacity="0.9" />
    <path d="M12 7C12 7 9 11 9 14C9 16 10 18 12 19.5" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5" />
  </svg>
);

const TicketLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 18px',
    background: 'rgba(255,255,255,0.05)',
    borderLeft: `3px solid ${ACCENT}`,
    borderRadius: 4,
  }}>
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      background: ACCENT_GOLD, flexShrink: 0,
    }} />
    <span style={{ fontSize: 28, color: INK, lineHeight: 1.4 }}>{children}</span>
  </div>
);

export const HookScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const cut = p.titleMain.split(p.titleHi);
  const pre = cut[0] ?? '';
  const post = cut[1] ?? '';

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* ── 主视觉：手写烧烤菜单板（实体物件，非 UI 浮卡）——收在 y:200–1080 · 一镜一重点：板+标题就是全屏唯一视觉事件 ── */}
      <LandIn delay={6}>
        <div style={{
          position: 'absolute', left: 160, top: 200, width: 760,
          background: 'linear-gradient(115deg, #3d2818 0%, #54331d 45%, #452b19 100%)',
          borderRadius: '18px 18px 8px 8px',
          padding: '46px 52px 40px 52px',
          boxShadow: '0 18px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.08)',
          borderBottom: '14px solid #2b1a0e',
        }}>
          {/* 木纹 + 铆钉质感 */}
          <div style={{
            position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
            borderRadius: 'inherit',
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 9px)',
            pointerEvents: 'none',
          }} />
          {/* 右上火焰钉角 */}
          <div style={{
            position: 'absolute', right: 22, top: 18,
            transform: 'rotate(8deg)',
          }}>
            <FlameIcon size={34} />
          </div>
          {/* 顶角两颗铆钉 */}
          <div style={{ position: 'absolute', left: 22, top: 20, width: 12, height: 12, borderRadius: 6, background: '#1c1007', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25)' }} />
          <div style={{ position: 'absolute', left: 54, top: 20, width: 12, height: 12, borderRadius: 6, background: '#1c1007', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25)' }} />

          {/* 板顶：痛点手写标签（粉笔质感 · 小板直） */}
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            background: 'rgba(0,0,0,0.28)',
            borderLeft: `4px solid ${ACCENT_GOLD}`,
            fontSize: 26,
            color: ACCENT_GOLD,
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: 4,
          }}>
            {p.painLead}
          </div>

          {/* 板中：主标题（粗黑压屏 · 高亮暖金） */}
          <div style={{
            marginTop: GUT.m - 8,
            fontFamily: FONT_TITLE,
            fontSize: 80,
            color: '#fff7e6',
            lineHeight: 1.12,
            letterSpacing: 1,
            textShadow: '0 3px 18px rgba(0,0,0,0.5)',
          }}>
            {pre}<span style={{ color: ACCENT_GOLD, textDecoration: 'underline rgba(255,179,71,0.4) 6px' }}>{p.titleHi}</span>{post}
          </div>

          {/* 板身：副标（手写小字 · 弱化） */}
          <div style={{
            marginTop: GUT.s,
            fontSize: 30, color: 'rgba(255,247,230,0.72)',
            lineHeight: 1.5,
            fontFamily: 'Kaiti SC, STKaiti, KaiTi, serif',
          }}>
            {p.subTitle}
          </div>

          {/* 板下缘剖面（立体板厚度） */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: -14, height: 14,
            background: '#2b1a0e',
            borderRadius: '0 0 8px 8px',
          }} />
        </div>
      </LandIn>

      {/* ── 板下：一张痛点小票（撕边 · 实体物）——左收窄，与右下券卡错位不遮挡（R3 §7.3 安全区 x[120,960]）── */}
      <div style={{
        position: 'absolute', left: 150, top: 620,
        width: 320, display: 'flex', flexDirection: 'column', gap: GUT.s,
      }}>
        {p.miniPoints?.slice(0, 1).map((pt, i) => (
          <In key={i} delay={26 + i * 10} from={14}>
            <div style={{
              background: 'rgba(250, 242, 230, 0.96)',
              borderRadius: 3,
              padding: '14px 20px',
              boxShadow: '0 6px 22px rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* 撕边齿痕 */}
              <div style={{
                width: 4, height: 26,
                background: 'repeating-linear-gradient(180deg, transparent 0 4px, #b54a1f 4px 8px)',
                marginLeft: -20, marginRight: 2,
              }} />
              <div style={{
                width: 8, height: 8, borderRadius: 4, background: '#b54a1f', flexShrink: 0,
              }} />
              <span style={{ fontSize: 27, color: '#3a2a18', fontWeight: 600 }}>{pt}</span>
            </div>
          </In>
        ))}
      </div>

      {/* ── 右下角：手气券卡从板侧垂下（层叠实体 · 核心道具）——右移下放，与左侧小票互不遮挡 · 物理感落定 ── */}
      <LandIn delay={42}>
        <div style={{
          position: 'absolute', right: 145, top: 600, width: 440,
          background: 'linear-gradient(160deg, rgba(48,28,16,0.96), rgba(34,20,12,0.96))',
          border: `3px solid ${ACCENT_GOLD}`,
          borderRadius: 14,
          padding: '30px 34px 26px 34px',
          boxShadow: '0 16px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,179,71,0.2)',
          transform: 'rotate(1.5deg)',
        }}>
          {/* 卡顶：标签 + 点题 */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: GUT.s - 6,
          }}>
            <div style={{
              display: 'inline-block',
              padding: '5px 14px',
              background: 'rgba(255,179,71,0.16)',
              border: `1px solid rgba(255,179,71,0.5)`,
              borderRadius: 4,
              fontSize: 23,
              color: ACCENT_GOLD,
              fontWeight: 700,
              letterSpacing: 1,
            }}>
              {p.cardTag}
            </div>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.66)', fontFamily: 'Kaiti SC, KaiTi, serif' }}>{p.cardSlogan}</span>
          </div>

          {/* 金额区间（主值大数字） */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: FONT_TITLE }}>
            <span style={{ fontSize: 40, color: ACCENT_GOLD, opacity: 0.9 }}>¥</span>
            <span style={{ fontSize: 64, color: ACCENT_GOLD, lineHeight: 1 }}>{p.cardMin}</span>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)' }}>~</span>
            <span style={{ fontSize: 64, color: ACCENT_GOLD, lineHeight: 1 }}>¥{p.cardMax}</span>
            <span style={{ fontSize: 29, color: '#fff7e6', marginLeft: 8, fontWeight: 700 }}>{p.cardName}</span>
          </div>

          {/* 券数据行（边框线界定，非留白） */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: GUT.s - 2,
            paddingTop: GUT.s - 8,
            borderTop: `1px dashed rgba(255,179,71,0.45)`,
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
          }}>
            <span>{p.cardThreshold}</span>
            <span>{p.cardValid}</span>
            <span style={{ color: ACCENT_GOLD, fontWeight: 700 }}>{p.cardTime}</span>
          </div>
        </div>
      </LandIn>

      {/* ── 底部引导（小字 · 右下角落，不抢主景）── */}
      <In delay={50} from={10}>
        <div style={{
          position: 'absolute', left: 120, top: 1024,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 25, color: 'rgba(255,255,255,0.72)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 4,
            border: `2px solid ${ACCENT_GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: ACCENT_GOLD,
          }}>扫</div>
          <span>桌上扫码即领 · {p.actionHint}</span>
        </div>
      </In>

      {/* 底部氛围光斑带（装饰不承载内容） */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to top, rgba(255,112,67,0.16), transparent)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

// ════════════════ S2 · 道理屏（two-column 对比）════════════════
export const IdeaScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as IdeaPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* 顶部标题 */}
      <In delay={8} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 100, right: 120 }}>
          <div style={{
            fontSize: 32, color: ACCENT_GOLD, marginBottom: 12,
            fontWeight: 600, letterSpacing: 2,
          }}>
            反常识
          </div>
          <div style={{
            fontFamily: FONT_TITLE, fontSize: 60, color: INK,
            lineHeight: 1.2,
          }}>
            {p.title}
          </div>
        </div>
      </In>

      {/* 两栏对比卡片 */}
      <div style={{
        position: 'absolute', left: 120, right: 120, top: 320,
        display: 'flex', gap: 24,
      }}>
        {/* 左：老办法（灰调·打叉） */}
        <In delay={20} from={20}>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: 14,
            padding: '32px 28px',
          }}>
            <div style={{
              fontSize: 28, color: MUTED, marginBottom: 24,
              fontWeight: 600, letterSpacing: 1,
            }}>
              ✕ 老办法 · 没用
            </div>
            {p.wrongItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: i < p.wrongItems.length - 1 ? 22 : 0,
                fontSize: 30, color: MUTED,
              }}>
                <div style={{
                  width: 24, height: 24,
                  border: `2px solid ${MUTED}`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: MUTED, opacity: 0.6,
                }}>✕</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </In>

        {/* 中间 VS 分隔符 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 48,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `rgba(255, 107, 53, 0.15)`,
            border: `1.5px solid ${ACCENT}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: ACCENT, fontWeight: 700,
          }}>
            VS
          </div>
        </div>

        {/* 右：真锁客（暖橙·打勾） */}
        <In delay={36} from={20}>
          <div style={{
            flex: 1,
            background: CARD_BG,
            border: `2px solid ${CARD_ACCENT}`,
            borderRadius: 14,
            padding: '32px 28px',
            boxShadow: `0 4px 40px rgba(255, 107, 53, 0.2)`,
          }}>
            <div style={{
              fontSize: 28, color: ACCENT_GOLD, marginBottom: 24,
              fontWeight: 600, letterSpacing: 1,
            }}>
              ✓ 真锁客 · 有效
            </div>
            {p.rightItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                marginBottom: i < p.rightItems.length - 1 ? 22 : 0,
                fontSize: 30, color: INK,
                lineHeight: 1.4,
              }}>
                <div style={{
                  width: 24, height: 24, marginTop: 6,
                  background: ACCENT_GOLD,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#1a0f0a', fontWeight: 700,
                  flexShrink: 0,
                }}>✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </In>
      </div>

      {/* 底部结论条 */}
      <In delay={56}>
        <div style={{
          position: 'absolute', left: 120, right: 120, bottom: 120,
          padding: '24px 32px',
          background: `linear-gradient(90deg, rgba(255, 107, 53, 0.1), rgba(255, 179, 71, 0.1))`,
          borderLeft: `4px solid ${ACCENT_GOLD}`,
          borderRadius: 8,
          fontSize: 32, color: INK,
          fontWeight: 500,
          lineHeight: 1.5,
        }}>
          {p.conclusion}
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S3 · 证明屏（hero-object 核销界面）════════════════
export const ProofScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ProofPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* 顶部大数据证明 */}
      <In delay={8} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 80, right: 120 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            fontFamily: FONT_TITLE,
          }}>
            <span style={{ fontSize: 96, color: ACCENT_GOLD, lineHeight: 1 }}>{p.bigNumber}</span>
            <span style={{ fontSize: 36, color: MUTED }}>{p.bigUnit}</span>
          </div>
          <div style={{ fontSize: 30, color: INK, marginTop: 8 }}>
            {p.subTitle}
          </div>
        </div>
      </In>

      {/* 中央：手机核销成功界面 mockup */}
      <In delay={28} from={24}>
        <div style={{
          position: 'absolute', left: '50%', top: 300,
          transform: 'translateX(-50%)',
          width: 520,
        }}>
          {/* 手机壳 */}
          <div style={{
            background: 'rgba(20, 15, 12, 0.95)',
            borderRadius: 32,
            padding: '24px 20px',
            border: `2px solid rgba(255,255,255,0.08)`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255, 107, 53, 0.15)`,
          }}>
            {/* 顶部状态栏 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 22, color: MUTED,
              marginBottom: 30,
            }}>
              <span>21:30</span>
              <span>●●●●</span>
            </div>

            {/* 核销成功大字 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 28, color: ACCENT_GOLD,
                fontWeight: 600, letterSpacing: 4,
                marginBottom: 12,
              }}>
                ✓ 核销成功
              </div>
              <div style={{
                fontSize: 48, color: INK,
                fontFamily: FONT_TITLE,
                marginBottom: 8,
              }}>
                夜宵手气券
              </div>
              <div style={{
                fontSize: 24, color: MUTED,
                marginBottom: 24,
              }}>
                已核销 · 满 100 减 18 元
              </div>
            </div>

            {/* 分隔线 */}
            <div style={{
              height: 1,
              background: LINE,
              margin: '20px 0',
            }} />

            {/* 奖励到账提示 */}
            <div style={{
              background: `rgba(255, 107, 53, 0.12)`,
              border: `1px solid ${CARD_ACCENT}`,
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GOLD})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                🎁
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, color: INK, fontWeight: 500 }}>
                  奖励券已到账
                </div>
                <div style={{ fontSize: 20, color: MUTED, marginTop: 2 }}>
                  核销后赠券 · 夜宵手气券 × 1
                </div>
              </div>
              <div style={{ fontSize: 22, color: ACCENT_GOLD }}>→</div>
            </div>
          </div>
        </div>
      </In>

      {/* 底部案例来源 */}
      <In delay={56}>
        <div style={{
          position: 'absolute', left: 120, right: 120, bottom: 100,
          textAlign: 'center',
          fontSize: 26, color: MUTED,
        }}>
          {p.caseSource}
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S4 · 落地屏 1（form-list 手气券设置）════════════════
export const BasicScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as FieldsPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* 顶部标题 + 牌数标签 */}
      <In delay={8} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 100, right: 120 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            background: `rgba(255, 107, 53, 0.15)`,
            border: `1px solid ${ACCENT}`,
            borderRadius: 20,
            fontSize: 26,
            color: ACCENT_GOLD,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {p.tag}
          </div>
          <div style={{
            fontFamily: FONT_TITLE, fontSize: 56, color: INK,
            lineHeight: 1.2,
          }}>
            {p.title}
          </div>
        </div>
      </In>

      {/* 表单卡片 */}
      <In delay={24} from={20}>
        <div style={{
          position: 'absolute', left: 120, right: 120, top: 280,
          background: CARD_BG,
          border: `2px solid ${CARD_ACCENT}`,
          borderRadius: 14,
          padding: '8px 0',
          boxShadow: `0 8px 40px rgba(255, 107, 53, 0.15)`,
        }}>
          {p.fields.map((field, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '22px 32px',
              borderBottom: i < p.fields.length - 1 ? `1px solid ${LINE}` : 'none',
            }}>
              <span style={{ fontSize: 28, color: MUTED }}>{field.label}</span>
              <span style={{
                fontSize: 30, color: ACCENT_GOLD,
                fontWeight: 600,
              }}>
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </In>

      {/* 底部 tip */}
      <In delay={60}>
        <div style={{
          position: 'absolute', left: 120, right: 120, bottom: 100,
          display: 'flex', alignItems: 'flex-start', gap: 16,
          padding: '20px 24px',
          background: 'rgba(255, 179, 71, 0.08)',
          borderLeft: `3px solid ${ACCENT_GOLD}`,
          borderRadius: 6,
        }}>
          <span style={{ fontSize: 28 }}>💡</span>
          <span style={{ fontSize: 26, color: INK, lineHeight: 1.6 }}>
            {p.tip}
          </span>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ════════════════ S5 · 落地屏 2（mechanism-diagram 锁客+裂变）════════════════
export const MechanismScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MechanismPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* 顶部标题 */}
      <In delay={8} from={16}>
        <div style={{ position: 'absolute', left: 120, top: 90, right: 120 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            background: `rgba(255, 107, 53, 0.15)`,
            border: `1px solid ${ACCENT}`,
            borderRadius: 20,
            fontSize: 26,
            color: ACCENT_GOLD,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {p.tag}
          </div>
          <div style={{
            fontFamily: FONT_TITLE, fontSize: 52, color: INK,
            lineHeight: 1.2,
          }}>
            {p.title}
          </div>
        </div>
      </In>

      {/* 流程节点（竖排） */}
      <div style={{
        position: 'absolute', left: 120, right: 120, top: 260, bottom: 80,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        {p.steps.map((step, i) => (
          <In key={i} delay={20 + i * 12} from={16}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* 节点卡 */}
              <div style={{
                width: 680,
                padding: '18px 28px',
                background: step.highlight
                  ? `linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 179, 71, 0.15))`
                  : 'rgba(255,255,255,0.05)',
                border: step.highlight
                  ? `2px solid ${ACCENT_GOLD}`
                  : `1px solid ${GLASS_BORDER}`,
                borderRadius: 12,
                boxShadow: step.highlight
                  ? `0 0 30px rgba(255, 107, 53, 0.25)`
                  : 'none',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: step.highlight ? ACCENT_GOLD : 'rgba(255,255,255,0.1)',
                  color: step.highlight ? '#1a0f0a' : MUTED,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1, fontSize: 28, color: INK, lineHeight: 1.4 }}>
                  {step.text}
                </div>
                {step.icon && (
                  <div style={{ fontSize: 32 }}>{step.icon}</div>
                )}
              </div>

              {/* 箭头（非最后一个） */}
              {i < p.steps.length - 1 && (
                <div style={{
                  fontSize: 24, color: ACCENT_GOLD,
                  margin: '4px 0',
                  opacity: 0.6,
                }}>
                  ↓
                </div>
              )}
            </div>
          </In>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S6 · 金句屏（cta-statement）════════════════
export const CtaScreen: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  const parts = p.sentence.split(p.highlight);
  const pre = parts[0] ?? '';
  const post = parts[1] ?? '';

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <EmberParticles />

      {/* 金句大字（居中） */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 100px',
      }}>
        <In delay={10} from={20}>
          <div style={{
            fontFamily: FONT_TITLE, fontSize: 64, color: INK,
            lineHeight: 1.4, textAlign: 'center',
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}>
            {pre}
            <span style={{ color: ACCENT_GOLD }}>{p.highlight}</span>
            {post}
          </div>
        </In>

        {/* 呼应手气券卡（缩小版，首尾呼应） */}
        <In delay={40} from={16}>
          <div style={{
            marginTop: 60,
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '12px 24px',
            background: CARD_BG,
            border: `1px solid ${CARD_ACCENT}`,
            borderRadius: 10,
            opacity: 0.8,
          }}>
            <FlameIcon size={24} color={ACCENT} />
            <span style={{ fontSize: 26, color: MUTED }}>
              夜宵手气券 · ¥3 ~ ¥30
            </span>
            <div style={{
              fontSize: 22, color: ACCENT_GOLD,
              padding: '2px 10px',
              background: 'rgba(255, 179, 71, 0.1)',
              borderRadius: 12,
            }}>
              扫码即领
            </div>
          </div>
        </In>
      </div>

      {/* 底部炭火散景光斑带（同 S1，闭环感） */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: 'linear-gradient(to top, rgba(255, 107, 53, 0.15), transparent)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

// ════════════════ 渲染器注册表 ════════════════
export const G11_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g11-hook': HookScreen,
  'g11-idea': IdeaScreen,
  'g11-proof': ProofScreen,
  'g11-basic': BasicScreen,
  'g11-mechanism': MechanismScreen,
  'g11-cta': CtaScreen,
};

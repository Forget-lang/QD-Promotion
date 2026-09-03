// g08 火锅 · 片1 · 屏组件（一屏一组件，禁止跨行业 import）
// 母题「中秋档期的桌号牌」（outputs/g08-火锅/03-母题一页.md；2026-09-03 用户指出背景与 g07 换皮同构，
// 正式屏统一到桌号牌线，原「排队叫号单」线废弃归档）。
// 五轴真换 g07 菜单板（详证 03-母题一页 §1）：中轴对称牌匾栅格 / 号牌卡·米纸底·双线金边·四角金钉 /
//   牌匾横匾标题·金框红底金字 / 落章式入场 / 块级落定+金线流光。椒红主调铜金辅（非 g07 金咖主调）。
// 背景 = 等位屏点阵 + 牌匾金框（离散·规则·直线），与 g07 的「椭圆聚光+柔光晕+波浪线」（连续·有机）零同构。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE } from '../../palette';
import { Drift, PushIn } from '../../components/camera';
import type { SceneRenderProps, SubtitleLine } from '../../types';
import type { ComparePayload, CompareCol } from './types';

// ── hotpot-red 色板（系列内沿用，与 bench/G08Bench.tsx 同源）──
const BG = '#2B1613';            // 深红棕底
const BG2 = '#3A1D17';           // 顶部稍亮
const RED = '#C8342B';           // 椒红（主强调）
const BRONZE = '#C89B3C';        // 铜金（描边/组头/流光）
const PAPER = '#FBF3E4';         // 米纸卡底
const INK = '#3A231A';           // 卡上深棕字
const MUTED = '#A8837A';         // 次要（深底上）
const GOLD_SOFT = 'rgba(200,155,60,0.55)';

// ── 节拍：口播句 → 号牌卡（块级落定，讲到哪块亮哪块）──
const useBeat = (subs?: SubtitleLine[]): number => {
  const f = useCurrentFrame();
  if (!subs || subs.length === 0) return -1;
  let a = -1;
  subs.forEach((s, i) => { if (f >= s.startFrame) a = i; });
  return a;
};
const region = (beat: number, from: number, to: number) => ({
  opacity: beat < 0 ? 0.95 : beat < from ? 0.9 : beat <= to ? 1 : 0.72,
  active: beat >= from && beat <= to,
});

// ── 底层：等位屏点阵 + 牌匾金框（同 bench，离散规则直线语言）──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const dotO = 0.10 + (Math.sin(f / 62) * 0.5 + 0.5) * 0.07; // 点阵呼吸（LED 待机微光）
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${BG2} 0%, ${BG} 100%)` }} />
      {/* 等位屏点阵：红色像素网格（LED 叫号屏抽象） */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, rgba(200,52,43,${dotO}) 2.5px, transparent 2.5px)`,
        backgroundSize: '52px 52px',
      }} />
      {/* 牌匾金框：外粗内细双线（整屏裱成一块挂墙的档期牌） */}
      <div style={{ position: 'absolute', inset: 34, border: `2px solid rgba(200,155,60,0.38)`, borderRadius: 6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 45, border: `1px solid rgba(200,155,60,0.16)`, borderRadius: 3, pointerEvents: 'none' }} />
      {/* 四角挂钉（号牌卡签名记号在背景层的延伸） */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([ex, ey], i) => (
        <span key={i} style={{
          position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: BRONZE,
          boxShadow: '0 2px 5px rgba(0,0,0,0.45)', pointerEvents: 'none',
          left: ex < 0 ? 27 : undefined, right: ex > 0 ? 27 : undefined,
          top: ey < 0 ? 27 : undefined, bottom: ey > 0 ? 27 : undefined,
        }} />
      ))}
    </>
  );
};

// ── 落章入场（同 bench：整块微过冲弹跳落定，"啪"地盖上）──
const Stamp: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 13, stiffness: 170 } });
  if (f < delay) return null;
  return (
    <div style={{ transform: `scale(${interpolate(s, [0, 1], [1.14, 1])}) rotate(${interpolate(s, [0, 1], [-1.6, 0])}deg)`, opacity: interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }), ...style }}>
      {children}
    </div>
  );
};

// ── 客流曲线三型（号牌卡底部示意：红细描边 + 峰值点 + 时间轴，非数据图表）──
const CURVES: Record<CompareCol['curveType'], { d: string; dots: [number, number][]; name: string; axis: [string, string, string] }> = {
  festival: { d: 'M6 84 Q 50 78 88 60 T 176 26 T 264 60 T 322 84', dots: [[176, 26]], name: '节日高峰型', axis: ['节前', '节中', '节后'] },
  rush: { d: 'M6 26 Q 70 34 118 54 T 208 76 T 322 86', dots: [[6, 26]], name: '逐日递减型', axis: ['领当天', '第3天', '第7天'] },
  spread: { d: 'M6 80 Q 38 64 70 36 Q 96 12 122 34 Q 156 68 190 72 Q 226 46 258 26 Q 288 30 322 62', dots: [[70, 36], [258, 26]], name: '双峰接力型', axis: ['节中', '隔天', '节后'] },
};

// ── 号牌卡：米纸底 + 双线金边 + 四角金钉 + 金线流光（推荐项整卡椒红底）──
const NumCard: React.FC<{ col: CompareCol }> = ({ col }) => {
  const f = useCurrentFrame();
  const sweep = ((f * 6) % 1600) - 280; // 金线流光沿卡边巡走（停留期微动）
  const rec = !!col.recommended;
  const bodyBg = rec ? RED : PAPER;
  const textC = rec ? PAPER : INK;
  const labelC = rec ? PAPER : RED;
  const mutedC = rec ? 'rgba(251,243,228,0.72)' : MUTED;
  const lineC = rec ? 'rgba(251,243,228,0.32)' : 'rgba(200,52,43,0.28)';
  const c = CURVES[col.curveType];

  return (
    <div style={{
      position: 'relative', height: '100%',
      background: bodyBg, borderRadius: 16, border: `3px solid ${BRONZE}`,
      boxShadow: `inset 0 0 0 3px ${bodyBg}, inset 0 0 0 4.5px ${rec ? 'rgba(251,243,228,0.5)' : GOLD_SOFT}, 0 18px 44px rgba(0,0,0,0.5)`,
      display: 'flex', flexDirection: 'column', padding: '18px 20px 16px', overflow: 'hidden',
    }}>
      {/* 四角金钉（本片签名记号） */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([ex, ey], i) => (
        <span key={i} style={{
          position: 'absolute', width: 13, height: 13, borderRadius: '50%', background: BRONZE,
          boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
          left: ex < 0 ? 9 : undefined, right: ex > 0 ? 9 : undefined,
          top: ey < 0 ? 9 : undefined, bottom: ey > 0 ? 9 : undefined,
        }} />
      ))}
      {/* 金线流光沿卡边巡走 */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -40, left: sweep, width: 220, height: 56, background: 'linear-gradient(100deg, transparent, rgba(200,155,60,0.35), transparent)', transform: 'rotate(6deg)' }} />
      </div>

      {/* 卡头小牌匾：编号 + 档期标签 */}
      <div style={{
        background: rec ? 'rgba(0,0,0,0.30)' : RED, borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: FONT_TITLE, fontSize: 42, color: PAPER, letterSpacing: 2, lineHeight: 1 }}>{col.no}</span>
        <span style={{
          fontSize: 17, color: rec ? 'rgba(251,243,228,0.92)' : PAPER,
          border: `2px solid ${rec ? 'rgba(251,243,228,0.55)' : 'rgba(251,243,228,0.8)'}`,
          borderRadius: 999, padding: '3px 11px', letterSpacing: 2, fontWeight: 700,
        }}>{col.tag}</span>
      </div>

      {/* 类型名称（中轴居中 + 椒红线；字号留足 10 字余量防溢出） */}
      <div style={{
        fontFamily: FONT_TITLE, fontSize: 24, color: textC, letterSpacing: 1,
        textAlign: 'center', padding: '14px 0 10px', borderBottom: `2.5px solid ${rec ? 'rgba(251,243,228,0.45)' : RED}`,
      }}>{col.head}</div>

      {/* 适用生意 */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 17, color: labelC, fontWeight: 800, letterSpacing: 3, marginBottom: 5 }}>适用生意</div>
        <div style={{ fontSize: 22, color: textC, lineHeight: 1.5, fontWeight: 600 }}>{col.useCase}</div>
      </div>

      {/* 怎么判断（左牌线块） */}
      <div style={{ marginTop: 14, borderLeft: `4px solid ${rec ? PAPER : RED}`, borderRadius: '0 8px 8px 0', background: rec ? 'rgba(251,243,228,0.12)' : 'rgba(200,52,43,0.07)', padding: '10px 12px' }}>
        <div style={{ fontSize: 17, color: labelC, fontWeight: 800, letterSpacing: 3, marginBottom: 5 }}>怎么判断</div>
        <div style={{ fontSize: 21, color: textC, lineHeight: 1.45, fontWeight: 500 }}>{col.pickSignal}</div>
      </div>

      {/* 火锅举例 */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 17, color: labelC, fontWeight: 800, letterSpacing: 3, marginBottom: 5 }}>火锅举例</div>
        <div style={{ fontSize: 21, color: textC, lineHeight: 1.45 }}>{col.example}</div>
      </div>

      {/* 铜牌徽章 ×2（紧迫感 / 灵活度） */}
      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        {[col.statA, col.statB].map((st) => (
          <div key={st.label} style={{
            flex: 1, border: `2px solid ${rec ? 'rgba(251,243,228,0.5)' : GOLD_SOFT}`,
            borderRadius: 8, padding: '8px 4px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, color: mutedC, letterSpacing: 2, marginBottom: 2 }}>{st.label}</div>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 23, color: labelC, letterSpacing: 2 }}>{st.value}</div>
          </div>
        ))}
      </div>

      {/* 反面提醒 */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 17, color: mutedC, fontWeight: 700, letterSpacing: 3, marginBottom: 5 }}>注意</div>
        <div style={{ fontSize: 21, color: mutedC, lineHeight: 1.4 }}>{col.downside}</div>
      </div>

      {/* 客流曲线区（压底，占剩余空间） */}
      <div style={{ flex: 1, minHeight: 150, marginTop: 14, paddingTop: 12, borderTop: `2px dashed ${lineC}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 80, display: 'flex' }}>
          <svg viewBox="0 0 328 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d={`${c.d} L 322 110 L 6 110 Z`} fill={rec ? 'rgba(251,243,228,0.14)' : 'rgba(200,52,43,0.12)'} />
            <path d={c.d} fill="none" stroke={rec ? PAPER : RED} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {c.dots.map(([x, y], di) => (
              <circle key={di} cx={x} cy={y} r="6" fill={rec ? PAPER : RED} />
            ))}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: 2 }}>
          {c.axis.map((a) => (
            <span key={a} style={{ fontSize: 14, color: mutedC, letterSpacing: 1 }}>{a}</span>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 16, color: labelC, letterSpacing: 3, fontWeight: 700, marginTop: 3 }}>{c.name}</div>
      </div>
    </div>
  );
};

// ── 三选项对照表（有效期类型三选一）—— 一屏标杆 · 桌号牌语言 ──
const G08Compare: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ComparePayload;
  const beat = useBeat(scene.subtitles);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: BG }}>
      <Drift depth={0.4} amplitude={3} seed="g08-bg">
        <Ambient />
      </Drift>
      <PushIn>
        {/* 顶部 eyebrow + 合规角标（C-11 挂顶部，不放屏底） */}
        <div style={{ position: 'absolute', left: 84, top: 96, fontSize: 25, color: MUTED, letterSpacing: 4 }}>🔥 券到火锅 · {p.tag}</div>
        <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>示例</div>

        {/* 牌匾横匾标题（金框红底金字，落章定场） */}
        <Stamp delay={6} style={{ position: 'absolute', left: 110, right: 110, top: 166 }}>
          <div style={{
            background: RED, borderRadius: 14, padding: '24px 18px', textAlign: 'center',
            border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${PAPER}, 0 18px 40px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 54, color: PAPER, letterSpacing: 7 }}>{p.title}</div>
          </div>
        </Stamp>
        <div style={{ position: 'absolute', left: 84, right: 84, top: 318, textAlign: 'center', fontSize: 25, color: MUTED, letterSpacing: 2 }}>{p.sub}</div>

        {/* 三块号牌卡（等高并排；节拍指向：讲到哪块亮哪块） */}
        <div style={{ position: 'absolute', left: 60, right: 60, top: 408, bottom: 356, display: 'flex', gap: 20 }}>
          {p.cols.map((col, i) => {
            const r = region(beat, i, i);
            return (
              <div key={col.no} style={{ flex: 1, display: 'flex', opacity: r.opacity, transform: `scale(${r.active ? 1.02 : 1})` }}>
                <Stamp delay={30 + i * 12} style={{ flex: 1 }}>
                  <NumCard col={col} />
                </Stamp>
              </div>
            );
          })}
        </div>

        {/* 结论牌匾（C-09：本片结论条第 1 用——机制屏） */}
        <Stamp delay={130} style={{ position: 'absolute', left: 110, right: 110, bottom: 196 }}>
          <div style={{
            background: RED, borderRadius: 12, padding: '18px 24px', textAlign: 'center',
            border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 2.5px ${PAPER}, 0 12px 32px rgba(0,0,0,0.45)`,
          }}>
            <span style={{ fontSize: 29, color: PAPER, fontWeight: 700, letterSpacing: 2, lineHeight: 1.4 }}>{p.punch}</span>
          </div>
        </Stamp>
      </PushIn>
    </AbsoluteFill>
  );
};

// ── 注册表 ──
export const G08_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g08-compare': G08Compare,
};

// g06 教培托管 · 片 1 · 十二屏（一屏一组件，禁止跨行业 import）
// 母题「一张券，一个对勾」：回执单卡 / 打孔齿 / 盖章对勾 / 荧光抹带 / 作业本横线
// 屏序与布局来源见 outputs/g06-教培托管/07-片1-分镜稿.md（02-分镜稿已作废）：
//   S1 钩子 / S2 anchor-pain / S3 ref-13 / S4·S5·S7·S10 制券表单自绘（照 applet create.vue）/
//   S6 ref-16 / S8 ref-11 / S9·S11 ref-10 / S12 全新
// 本片骨架（Slip / HandIn / FormCard / FormLine / GroupHead / Stamp / Tag / HiLight …）全部内联在本文件，
//   仓库没有 src/skeletons 目录；跨屏复用的只有 ../../components/{animations,ui} 与 ../../palette。
//   组件函数名保留首版屏号前缀，与现行屏号不一一对应（现行绑定见文件末 G06_RENDERERS；2026-08-31 删无屏绑定的 g06-compare）。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_ROUND, PALETTES } from '../../palette';
import { EASE_OUT } from '../../components/animations';
import { elevation } from '../../components/ui';
import type { SceneRenderProps, SubtitleLine } from '../../types';
import type {
  HookPayload, PainPayload, IdeaPayload, MakePayload, FormRow, StepsPayload,
  ChainPayload, LedgerPayload, CtaPayload,
} from './types';

// ── 本片色板（暖奶油底 + 焦糖棕 + 印章红 + 荧光黄）──
const ACCENT = PALETTES['warm-orange'].accent;      // #FF7043
const ACCENT_DARK = PALETTES['warm-orange'].accentDark;
const CARAMEL = '#8D6E63';
const BROWN = '#5D4636';
const STAMP_RED = '#E8503A';
const HI = 'rgba(255,199,44,0.6)';
const PAPER = '#FFFDF9';
const CREAM = '#F6E9D4';
const LINE = 'rgba(141,110,99,0.22)';
const SHADOW = 'rgba(122,74,38,0.16)';

// ── 节拍：口播句 → 区域 ─────────────────────────────
const useBeat = (subs?: SubtitleLine[]): number => {
  const f = useCurrentFrame();
  if (!subs || subs.length === 0) return -1;
  let a = -1;
  subs.forEach((s, i) => { if (f >= s.startFrame) a = i; });
  return a;
};

/** 区域三态：没讲到=安静可读 0.88 / 讲到=全亮 / 讲过=降到 0.72（浅底上仍要能读清） */
const region = (beat: number, from: number, to: number) => ({
  opacity: beat < 0 ? 0.92 : beat < from ? 0.88 : beat <= to ? 1 : 0.72,
  active: beat >= from && beat <= to,
});

// ── 母题零件 ────────────────────────────────────────

/** 作业本横线（底层装饰，呼吸微动） */
const Ruled: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.035 + (Math.sin(f / 46) * 0.5 + 0.5) * 0.02;
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none' }}>
      {Array.from({ length: 33 }, (_, i) => (
        <line key={i} x1="0" y1={60 + i * 56} x2="1080" y2={60 + i * 56} stroke={CARAMEL} strokeWidth="1.2" />
      ))}
    </svg>
  );
};

/** 底层持续微动：暖光斑漂移 + 横线（挂在每屏最底） */
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const x1 = Math.sin(f / 64) * 26;
  const y1 = Math.cos(f / 78) * 20;
  const x2 = Math.cos(f / 70) * 30;
  return (
    <>
      <Ruled />
      <div style={{
        position: 'absolute', left: -180 + x1, top: 260 + y1, width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,112,67,0.10) 0%, transparent 68%)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: -220 + x2, bottom: 380 - y1, width: 640, height: 640, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,213,79,0.12) 0%, transparent 66%)', pointerEvents: 'none',
      }} />
    </>
  );
};

/** 场景胶囊角标 */
const Tag: React.FC<{ text: string; delay?: number }> = ({ text, delay = 4 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{
      position: 'absolute', left: 72, top: 128, display: 'inline-flex', alignItems: 'center', gap: 12,
      opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
      border: `2px solid rgba(141,110,99,0.45)`, borderRadius: 999, padding: '10px 30px',
      color: '#7A5C44', fontSize: 27, letterSpacing: 3, background: 'rgba(255,253,249,0.72)',
    }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} />
      {text}
    </div>
  );
};

/** 荧光笔抹带（重要词底部横抹，wipe 展开） */
const HiLight: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 14, color = HI }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 6px' }}>
      <span style={{
        position: 'absolute', left: 0, bottom: '10%', height: '36%', width: `${p * 100}%`,
        background: color, borderRadius: 8, transform: 'skewX(-8deg)',
      }} />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

/** 盖章入场：缩放 + 旋转回落 */
const Stamp: React.FC<{ delay?: number; rot?: number; children: React.ReactNode }> = ({ delay = 0, rot = 0, children }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 16, stiffness: 240, mass: 0.9 } });
  return (
    <div style={{
      transform: `scale(${1.28 - 0.28 * s}) rotate(${-12 * (1 - s) + rot}deg)`,
      opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      {children}
    </div>
  );
};

/** 回执单卡：白卡 + 左缘打孔齿 + 微旋 + 暖投影 */
const Slip: React.FC<{
  children: React.ReactNode; rot?: number; style?: React.CSSProperties; holeColor?: string;
}> = ({ children, rot = 0, style, holeColor = CREAM }) => (
  <div style={{
    position: 'relative', background: PAPER, borderRadius: 24,
    border: `1.5px solid ${LINE}`, boxShadow: `0 16px 38px ${SHADOW}`,
    transform: `rotate(${rot}deg)`, ...style,
  }}>
    <div style={{ position: 'absolute', left: 14, top: 18, bottom: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: holeColor }} />
      ))}
    </div>
    {children}
  </div>
);

/** 粗描边对勾 */
const CheckGlyph: React.FC<{ color?: string; size?: number }> = ({ color = STAMP_RED, size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 17l7 7L26 8" stroke={color} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 递进入场：右入 + 微旋落定（回执递交感） */
const HandIn: React.FC<{ delay?: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0, rot = 0, children, style,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 22, stiffness: 150 } });
  return (
    <div style={{
      opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateX(${(1 - s) * 110}px) rotate(${(1 - s) * 4 + rot}deg)`,
      ...style,
    }}>
      {children}
    </div>
  );
};

/** 行 wipe（书写感） */
const RowWipe: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: Math.min(1, p * 1.8), ...style }}>
      {children}
    </div>
  );
};

/** 光带扫过（票面持续微动） */
const Sweep: React.FC<{ period?: number; color?: string }> = ({ period = 120, color = 'rgba(255,255,255,0.16)' }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, width: 240, transform: 'skewX(-14deg)',
      background: `linear-gradient(100deg, transparent, ${color}, transparent)`,
      left: interpolate(f % period, [0, period], [-320, 1040]), pointerEvents: 'none',
    }} />
  );
};

// ── S1 钩子 · 全新做 ────────────────────────────────
const S1Hook: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const t = spring({ frame: f - 8, fps: FPS, config: { damping: 20, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 250, right: 72, opacity: t, transform: `translateY(${(1 - t) * 34}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 92, lineHeight: 1.22, color: BROWN, fontWeight: 400 }}>
          {p.title1}
        </div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 92, lineHeight: 1.22, color: BROWN, fontWeight: 400 }}>
          <HiLight delay={20}>{p.title2}</HiLight>
        </div>
        <div style={{ marginTop: 26, fontSize: 30, color: '#8a715c', letterSpacing: 1 }}>{p.sub}</div>
      </div>

      {p.bars.map((b, i) => {
        const r = region(beat, 2, 2);           // 第三句口播（三问）点亮信息条
        const st = spring({ frame: f - 34 - i * 12, fps: FPS, config: { damping: 15, stiffness: 210 } });
        return (
          <div key={b.label} style={{
            position: 'absolute', left: 72, right: 72, top: 700 + i * 176,
            opacity: Math.min(r.opacity, interpolate(st, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })),
            transform: `scale(${1.1 - 0.1 * st}) rotate(${(1 - st) * -3}deg)`,
          }}>
            <Slip style={{ display: 'flex', alignItems: 'center', padding: '30px 40px 30px 56px' }}>
              <span style={{ fontSize: 35, fontWeight: 700, color: BROWN, flex: 1 }}>{b.label}</span>
              <span style={{ fontSize: 30, color: '#b09b86', margin: '0 18px' }}>——</span>
              <span style={{
                fontSize: 35, fontWeight: 700, color: STAMP_RED,
                borderBottom: r.active ? `4px solid ${ACCENT}` : '4px solid transparent', paddingBottom: 2,
              }}>{b.result}</span>
            </Slip>
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: 72, right: 72, top: 1270, opacity: region(beat, 2, 2).opacity }}>
        <RowWipe delay={236}>
          <div style={{
            background: 'rgba(255,253,249,0.86)', border: `2px dashed rgba(232,80,58,0.5)`, borderRadius: 20,
            padding: '30px 40px', fontFamily: FONT_ROUND, fontSize: 40, color: STAMP_RED, textAlign: 'center', letterSpacing: 2,
          }}>
            要是有张东西，能替你把线接上呢
          </div>
        </RowWipe>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 痛点 · 拆 anchor-pain（实物卡 + 痛点句）──────
const S2Pain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as PainPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const card = spring({ frame: f - 14, fps: FPS, config: { damping: 20, stiffness: 130 } });
  const tt = spring({ frame: f - 4, fps: FPS, config: { damping: 22, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 234, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 80, lineHeight: 1.24, color: BROWN }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 80, lineHeight: 1.24, color: BROWN }}>{p.title2}</div>
        <div style={{ marginTop: 10, fontSize: 42, color: BROWN, fontFamily: FONT_ROUND }}>
          <HiLight delay={18} color="rgba(232,80,58,0.28)">{p.accent}</HiLight>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 72, right: 72, top: 610, opacity: card,
        transform: `translateX(${(1 - card) * 90}px) rotate(${(1 - card) * 3 - 0.6}deg)`,
      }}>
        <Slip holeColor="#F3E4CB" style={{ padding: '44px 48px 40px 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 25, color: '#b09b86', letterSpacing: 2 }}>{p.flyName}</span>
            <span style={{ fontSize: 24, color: '#fff', background: ACCENT, borderRadius: 999, padding: '8px 24px', letterSpacing: 2 }}>{p.flyBadge}</span>
          </div>
          <div style={{ fontFamily: FONT_ROUND, fontSize: 44, lineHeight: 1.4, color: '#3d2f24', marginTop: 16 }}>{p.flyTitle}</div>
          {p.flyLines.map((l, i) => (
            <div key={l} style={{ marginTop: i === 0 ? 20 : 10, fontSize: 29, color: '#8a715c', borderTop: i === 0 ? `1.5px dashed ${LINE}` : 'none', paddingTop: i === 0 ? 18 : 0 }}>
              {l}
            </div>
          ))}

          <div style={{ marginTop: 30, borderTop: `2px solid rgba(232,80,58,0.35)` }} />
          {p.quotes.map((q, i) => {
            const from = i === 2 ? 1 : 0;      // 前两句随第一句口播，第三句随第二句
            const r = region(beat, from, from);
            return (
              <RowWipe key={q.t1} delay={50 + i * 22} style={{ opacity: r.opacity }}>
                <div style={{ display: 'flex', gap: 24, marginTop: 26, alignItems: 'baseline' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: STAMP_RED, flexShrink: 0, transform: 'translateY(-4px)' }} />
                  <div>
                    <span style={{ fontSize: 34, fontWeight: 700, color: '#3d2f24' }}>{q.t1}</span>
                    <span style={{ fontSize: 30, color: '#9c8672', marginLeft: 16 }}>{q.t2}</span>
                    {r.active && <span style={{ display: 'inline-block', width: '100%', height: 3, background: `linear-gradient(90deg, ${STAMP_RED}, transparent)`, marginTop: 8 }} />}
                  </div>
                </div>
              </RowWipe>
            );
          })}
        </Slip>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 168, textAlign: 'center', fontSize: 23, color: 'rgba(93,70,54,0.5)', letterSpacing: 2 }}>
        {p.foot}
      </div>
    </AbsoluteFill>
  );
};

// ── S3 思路 · 拆 ref-13（等式大结论）────────────────
const S3Idea: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as IdeaPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 20, stiffness: 140 } });
  const icons: Record<string, React.ReactElement> = {
    stamp: <CheckGlyph size={46} />,
    clock: (
      <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke={ACCENT_DARK} strokeWidth="3.4" />
        <path d="M24 13v11l8 5" stroke={ACCENT_DARK} strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    ),
    bell: (
      <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
        <path d="M24 6c-8 0-12 6-12 14v8l-4 6h32l-4-6v-8c0-8-4-14-12-14z" stroke={ACCENT_DARK} strokeWidth="3.4" strokeLinejoin="round" />
        <path d="M19 38a5 5 0 0010 0" stroke={ACCENT_DARK} strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.eyebrow} />
      <div style={{ position: 'absolute', left: 72, top: 240, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 30}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 84, lineHeight: 1.24, color: BROWN }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 84, lineHeight: 1.24, color: BROWN }}>
          <HiLight delay={20}>{p.title2}</HiLight>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 660, display: 'flex', gap: 30 }}>
        {p.reasons.map((rc, i) => {
          const r = region(beat, i, i);
          const s = spring({ frame: f - 30 - i * 14, fps: FPS, config: { damping: 18, stiffness: 170 } });
          return (
            <div key={rc.title} style={{
              flex: 1, opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })),
              transform: `translateX(${(1 - s) * 90}px)`,
            }}>
              <Slip rot={(i - 1) * 0.7} style={{ padding: '36px 26px 34px 44px', height: 380 }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icons[rc.icon]}
                </div>
                <div style={{ fontFamily: FONT_ROUND, fontSize: 42, color: '#3d2f24', marginTop: 26 }}>{rc.title}</div>
                <div style={{ fontSize: 27, color: '#8a715c', marginTop: 14, lineHeight: 1.55 }}>{rc.sub}</div>
              </Slip>
            </div>
          );
        })}
      </div>

      {/* 预告小票：下一屏要去产品里做这张券 */}
      <div style={{ position: 'absolute', right: 96, top: 1130, opacity: region(beat, 2, 2).opacity }}>
        <Stamp delay={252} rot={4}>
          <div style={{
            background: PAPER, border: `1.5px solid ${LINE}`, boxShadow: `0 14px 30px ${SHADOW}`,
            borderRadius: 18, padding: '20px 34px', display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <CheckGlyph size={34} />
            <span style={{ fontSize: 29, fontWeight: 700, color: BROWN }}>{p.next}</span>
          </div>
        </Stamp>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 1300, opacity: region(beat, 1, 2).opacity }}>
        <RowWipe delay={268}>
          <div style={{
            background: 'rgba(255,253,249,0.9)', borderRadius: 20, border: `1.5px solid ${LINE}`,
            padding: '28px 40px', fontFamily: FONT_ROUND, fontSize: 34, color: CARAMEL, textAlign: 'center', letterSpacing: 2,
          }}>
            {p.punch}
          </div>
        </RowWipe>
      </div>
    </AbsoluteFill>
  );
};

// ── 制券表单零件（S4 填写 / S5 开关与提交）───────────
/** 第 i 句口播的起始帧：表单行的入场跟着口播走，不另拍 delay */
const useBeatFrame = (subs?: SubtitleLine[]) => (i: number) => subs?.[i]?.startFrame ?? 8;

/** 仿产品页面顶栏：返回 + 这一页的真实标题（券到卡包里就叫「制作兑换券」）*/
const MakeNav: React.FC<{ title: string; crumb: string; step: string }> = ({ title, crumb, step }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - 4, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 116, opacity: p }}>
      <div style={{ position: 'relative', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="32" viewBox="0 0 24 32" style={{ position: 'absolute', left: 8 }}>
          <path d="M19 3L4 16l15 13" stroke={BROWN} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: FONT_ROUND, fontSize: 46, color: BROWN, letterSpacing: 3 }}>{title}</span>
        <span style={{
          position: 'absolute', right: 0, fontSize: 24, color: '#fff', background: CARAMEL,
          borderRadius: 999, padding: '8px 22px', letterSpacing: 2,
        }}>{step}</span>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontSize: 26, color: '#9c8672', letterSpacing: 1 }}>{crumb}</div>
    </div>
  );
};

/** 制券页的开关：口播讲到这一行时拨到「开」 */
const Toggle: React.FC<{ prog: number }> = ({ prog }) => (
  <span style={{
    width: 84, height: 44, borderRadius: 999, flexShrink: 0, position: 'relative',
    background: prog > 0.5 ? ACCENT : '#D9CEC1',
  }}>
    <span style={{
      position: 'absolute', top: 5, left: 5 + prog * 40, width: 34, height: 34, borderRadius: '50%',
      background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
    }} />
  </span>
);

/** 输入框光标：讲到这一行时闪，讲完这行就收 */
const Caret: React.FC<{ show: boolean }> = ({ show }) => {
  const f = useCurrentFrame();
  if (!show) return null;
  return <span style={{ width: 4, height: 36, background: ACCENT_DARK, opacity: Math.floor(f / 12) % 2 ? 0.2 : 1, flexShrink: 0 }} />;
};

/** 选择器右箭头（有效期类型 / 发放方式这类要选的字段） */
const Chevron = () => (
  <svg width="20" height="28" viewBox="0 0 20 28" style={{ flexShrink: 0 }}>
    <path d="M5 4l11 10L5 24" stroke="#b09b86" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 分组标题（对应制券页每格小标题） */
const GroupHead: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
  <RowWipe delay={delay}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: `2px solid ${LINE}` }}>
      <span style={{ width: 10, height: 30, borderRadius: 5, background: ACCENT }} />
      <span style={{ fontSize: 30, fontWeight: 700, color: CARAMEL, letterSpacing: 2 }}>{text}</span>
    </div>
  </RowWipe>
);

/** 一行表单：左=产品里的字段名，右=托管场景里填的值，下面一行是产品自己的规则提示 */
const FormLine: React.FC<{
  row: FormRow; active: boolean; delay: number; variant: 'input' | 'switch'; roomy?: boolean;
}> = ({ row, active, delay, variant, roomy = false }) => {
  const f = useCurrentFrame();
  const knob = variant === 'switch' && row.kind === 'switch'
    ? spring({ frame: f - delay - 10, fps: FPS, config: { damping: 17, stiffness: 190 } })
    : 0;
  const isSelect = variant === 'switch' && row.kind === 'select';
  const bullets = row.k === '使用须知' ? row.v.split(' · ') : null;
  // 未到本行节拍前不占位：否则卡片会先挂成一个只有打孔齿的空白回执（2026-08-30 用户审片指出）
  if (f < delay) return null;
  return (
    <RowWipe delay={delay}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: roomy ? '32px 18px 24px' : '20px 12px 14px',
        borderBottom: `1.5px dashed ${LINE}`,
        background: active ? 'rgba(255,112,67,0.09)' : 'transparent',
        borderRadius: 14,
        transition: 'none',
      }}>
        <span style={{ width: roomy ? 200 : 178, flexShrink: 0, fontSize: roomy ? 31 : 29, color: active ? '#7a4a2e' : '#8a715c', letterSpacing: 1 }}>{row.k}</span>
        {bullets ? (
          <span style={{ flex: 1, fontSize: roomy ? 33 : 31, fontWeight: 700, color: '#2f241c', lineHeight: 1.6, textAlign: 'left' }}>
            {bullets.map((b) => (<span key={b} style={{ display: 'block' }}>● <HiLight delay={delay + 8}>{b}</HiLight></span>))}
          </span>
        ) : (
          <span style={{ flex: 1, fontSize: roomy ? 36 : 33, fontWeight: 700, color: '#2f241c', textAlign: 'right', lineHeight: 1.35 }}>
            <HiLight delay={delay + 8}>{row.v}</HiLight>
          </span>
        )}
        {row.kind === 'switch' && variant === 'switch' ? <Toggle prog={knob} /> : isSelect ? <Chevron /> : <Caret show={active} />}
      </div>
      {row.hint && (
        <div style={{ fontSize: roomy ? 26 : 24, color: '#b09b86', textAlign: 'right', padding: roomy ? '12px 12px 8px' : '8px 12px 6px', letterSpacing: 1, lineHeight: 1.4 }}>
          {row.hint}
        </div>
      )}
    </RowWipe>
  );
};

/** 表单卡片（对应制券页的一组 t-cell-group） */
const FormCard: React.FC<{ rot?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  rot = 0, style, children,
}) => (
  <Slip rot={rot} holeColor="#F1E3CA" style={{ padding: '30px 44px 22px 74px', ...style }}>
    {children}
  </Slip>
);

// ── S4 制作① · 制券页上半（券面内容）★一屏标杆 ──
// 布局来源：无样张对应——照 applet/pages_coupon/coupon/create.vue 的分组与字段行自绘（仿表单，非截图）
const S4MakeBasic: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const beat = useBeat(scene.subtitles);
  const bf = useBeatFrame(scene.subtitles);
  const f = useCurrentFrame();
  const lift = spring({ frame: f - 12, fps: FPS, config: { damping: 20, stiffness: 150 } });
  // 行 → 口播句：名称(1) 兑换内容(2) 门槛+数量(3) 使用须知(4)
  const rowBeat = [1, 2, 3, 3, 4];
  // 首组卡在开场句后 30 帧入场（页面刚打开就有卡头，不留整屏空白），但绝不晚于首行自己的节拍
  const card1Delay = Math.max(10, Math.min(bf(1) - 10, bf(0) + 30));
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <MakeNav title={p.navTitle} crumb={p.crumb} step={p.tag} />
      <div style={{
        position: 'absolute', left: 68, right: 68, top: 300,
        opacity: lift, transform: `translateY(${(1 - lift) * 70}px)`,
      }}>
        <HandIn delay={card1Delay}>
          <FormCard>
            <GroupHead text={p.groups[0].head} delay={card1Delay} />
            {p.groups[0].rows.map((row, i) => (
              <FormLine key={row.k} row={row} delay={bf(rowBeat[i]) + 4} active={beat === rowBeat[i]} variant="input" roomy />
            ))}
          </FormCard>
        </HandIn>
        <HandIn delay={bf(4) - 10}>
          <FormCard rot={0.4} style={{ marginTop: 56 }}>
            <GroupHead text={p.groups[1].head} delay={bf(4) - 10} />
            {p.groups[1].rows.map((row) => (
              <FormLine key={row.k} row={row} delay={bf(4) + 4} active={beat === 4} variant="input" roomy />
            ))}
          </FormCard>
        </HandIn>
      </div>
      <div style={{
        position: 'absolute', left: 68, right: 68, bottom: 250, textAlign: 'center',
        fontSize: 24, color: 'rgba(93,70,54,0.6)', letterSpacing: 1, lineHeight: 1.5,
        opacity: interpolate(f, [bf(2), bf(2) + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>{p.foot}</div>
    </AbsoluteFill>
  );
};

// ── S5 制作② · 制券页下半（期限 / 发放 / 提醒 + 提交）──
// 布局来源：同上（制券表单自绘），本屏改为开关态 + 底部提交条，与 S4 不同构
const S5MakeRules: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const beat = useBeat(scene.subtitles);
  const bf = useBeatFrame(scene.subtitles);
  const f = useCurrentFrame();
  const lift = spring({ frame: f - 10, fps: FPS, config: { damping: 20, stiffness: 150 } });
  // 行 → 口播句（六行取节拍表前六槽）：有效期类型+有效期(0) 可用时段(1) 发放方式+每人限领(2) 到期提醒(3)；第 5 句收在提交钮
  const rowBeat = [0, 0, 1, 2, 2, 3, 4];
  const cardTop = (gi: number) => p.groups.slice(0, gi).reduce((n, g) => n + g.rows.length, 0);
  // 每张卡入场 = 本组首行的那一拍（卡片不再先挂成空白回执，见 2026-08-30 用户审片）
  const groupDelay = (gi: number) => Math.max(10, bf(rowBeat[cardTop(gi)]) - 10);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <MakeNav title={p.navTitle} crumb={p.crumb} step={p.tag} />
      <div style={{
        position: 'absolute', left: 68, right: 68, top: 300,
        opacity: lift, transform: `translateY(${(1 - lift) * 70}px)`,
      }}>
        {p.groups.map((g, gi) => (
          <HandIn key={g.head} delay={groupDelay(gi)}>
            <FormCard rot={gi === 1 ? 0.4 : -0.4} style={{ marginTop: gi === 0 ? 0 : 34 }}>
              <GroupHead text={g.head} delay={groupDelay(gi)} />
              {g.rows.map((row, i) => {
                const b = rowBeat[cardTop(gi) + i];
                return <FormLine key={row.k} row={row} delay={bf(b) + 4} active={beat === b} variant="switch" />;
              })}
            </FormCard>
          </HandIn>
        ))}
        <RowWipe delay={bf(4) + 40}>
          <div style={{
            marginTop: 38, borderRadius: 999, padding: '28px 0', textAlign: 'center', letterSpacing: 6,
            background: `linear-gradient(115deg, ${ACCENT_DARK}, ${ACCENT})`, color: '#fff',
            fontSize: 37, fontWeight: 700, boxShadow: '0 16px 34px rgba(232,80,58,0.3)',
          }}>{p.submit}</div>
        </RowWipe>
      </div>
      <div style={{
        position: 'absolute', left: 68, right: 68, bottom: 150, textAlign: 'center',
        fontSize: 25, color: 'rgba(93,70,54,0.62)', letterSpacing: 1,
        opacity: interpolate(f, [bf(4) + 56, bf(4) + 78], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>{p.foot}</div>
    </AbsoluteFill>
  );
};

// ── S6 步骤 · 拆 ref-16（步骤结果对照）──────────────
const S6Steps: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as StepsPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  // 行 → 口播句：领(0,1) 存(1,2) 核销+记录(2,3)
  const rowBeat: [number, number][] = [[0, 1], [1, 2], [2, 3]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 240, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 78, color: BROWN, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 18, fontSize: 29, color: '#8a715c' }}>{p.sub}</div>
      </div>

      {p.rows.map((row, i) => {
        const r = region(beat, rowBeat[i][0], rowBeat[i][1]);
        const s = spring({ frame: f - 26 - i * 16, fps: FPS, config: { damping: 20, stiffness: 160 } });
        return (
          <div key={row.act} style={{
            position: 'absolute', left: 72, right: 72, top: 560 + i * 330,
            opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })),
            transform: `translateX(${(1 - s) * 100}px)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 26 }}>
              <Slip style={{ flex: 1.25, padding: '30px 30px 30px 52px', display: 'flex', gap: 22, alignItems: 'center' }}>
                <span style={{
                  width: 66, height: 66, borderRadius: 16, background: i === 2 ? STAMP_RED : CARAMEL, color: '#fff',
                  fontFamily: FONT_ROUND, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 37, fontWeight: 700, color: '#2f241c' }}>{row.act}</div>
                  <div style={{ fontSize: 27, color: '#8a715c', marginTop: 8, lineHeight: 1.45 }}>{row.desc}</div>
                </div>
              </Slip>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="40" height="28" viewBox="0 0 40 28">
                  <path d="M2 14h30M24 4l10 10-10 10" stroke={CARAMEL} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{
                flex: 1, background: CREAM, borderRadius: 22, padding: '28px 26px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
                border: r.active ? `2.5px solid ${ACCENT}` : '2.5px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Stamp delay={40 + i * 16} rot={-4}><CheckGlyph size={36} /></Stamp>
                  <span style={{ fontSize: 28, fontWeight: 700, color: CARAMEL, letterSpacing: 2 }}>{row.mark}</span>
                </div>
                <div style={{ fontSize: 28, color: '#5d4636', lineHeight: 1.5 }}>{row.res}</div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── S8 进阶 · 拆 ref-11（纵向编号步骤条）────────────
const S8Chain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ChainPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  const nodeBeat: [number, number][] = [[0, 0], [1, 1], [2, 3]];
  const line = interpolate(f, [20, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 238, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 76, color: BROWN, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 16, fontSize: 29, color: '#8a715c' }}>{p.sub}</div>
      </div>

      {/* 时间线 */}
      <div style={{ position: 'absolute', left: 128, top: 560, width: 5, height: 940 * line, background: `linear-gradient(${ACCENT}, ${STAMP_RED})`, borderRadius: 3 }} />

      {p.nodes.map((n, i) => {
        const r = region(beat, nodeBeat[i][0], nodeBeat[i][1]);
        const s = spring({ frame: f - 26 - i * 18, fps: FPS, config: { damping: 19, stiffness: 160 } });
        return (
          <div key={n.head} style={{
            position: 'absolute', left: 72, right: 72, top: 540 + i * 330,
            opacity: Math.min(r.opacity, interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })),
            transform: `translateY(${(1 - s) * 44}px)`,
          }}>
            <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
              <div style={{
                width: 110, height: 110, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === 2 ? STAMP_RED : PAPER, border: i === 2 ? 'none' : `3px solid ${ACCENT}`,
                boxShadow: `0 10px 24px ${SHADOW}`,
              }}>
                <span style={{ fontFamily: FONT_ROUND, fontSize: 52, color: i === 2 ? '#fff' : ACCENT_DARK }}>{i + 1}</span>
              </div>
              <Slip rot={(i - 1) * 0.5} style={{ flex: 1, padding: '30px 34px 30px 54px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#2f241c' }}>{n.head}</span>
                  {n.reward && <Stamp delay={70} rot={8}><span style={{ fontSize: 24, color: '#fff', background: STAMP_RED, borderRadius: 8, padding: '6px 14px', letterSpacing: 2 }}>奖</span></Stamp>}
                </div>
                <div style={{ fontSize: 28, color: '#6d5a49', marginTop: 10, lineHeight: 1.5 }}>{n.desc}</div>
                {n.note && <div style={{ fontSize: 24, color: '#b09b86', marginTop: 10 }}>{n.note}</div>}
              </Slip>
            </div>
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 168, textAlign: 'center', fontSize: 24, color: 'rgba(93,70,54,0.55)', letterSpacing: 2, opacity: region(beat, 2, 3).opacity }}>
        {p.foot}
      </div>
    </AbsoluteFill>
  );
};

// ── S9 进阶 · 拆 ref-10（多栏分类清单）──────────────
const S9Ledger: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as LedgerPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 22, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <Tag text={p.tag} />
      <div style={{ position: 'absolute', left: 72, top: 238, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 26}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 74, color: BROWN, lineHeight: 1.24 }}>{p.title}</div>
        <div style={{ marginTop: 16, fontSize: 29, color: '#8a715c' }}>{p.sub}</div>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 540, display: 'flex', gap: 32 }}>
        {p.cols.map((col, ci) => {
          const r = region(beat, ci === 0 ? 0 : 3, ci === 0 ? 2 : 3);
          const s = spring({ frame: f - 22 - ci * 16, fps: FPS, config: { damping: 21, stiffness: 150 } });
          const headBg = col.tone === 'accent' ? ACCENT : CARAMEL;
          return (
            <div key={col.head} style={{
              flex: 1, opacity: Math.min(r.opacity + 0.08, 1) * interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateX(${(1 - s) * 90 * (ci === 0 ? -1 : 1)}px)`,
            }}>
              <div style={{
                background: PAPER, borderRadius: 26, border: `1.5px solid ${LINE}`, boxShadow: `0 16px 38px ${SHADOW}`,
                padding: '34px 30px', height: 820,
                outline: r.active ? `3px solid ${headBg}` : '3px solid transparent', outlineOffset: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 22, borderBottom: `2px solid ${LINE}` }}>
                  <span style={{ width: 14, height: 34, borderRadius: 6, background: headBg }} />
                  <span style={{ fontFamily: FONT_ROUND, fontSize: 40, color: '#3d2f24' }}>{col.head}</span>
                </div>
                {col.items.map((it, i) => (
                  <RowWipe key={it} delay={40 + ci * 16 + i * 12}>
                    <div style={{ marginTop: 24, background: '#F7F1E7', borderRadius: 16, padding: '22px 24px', fontSize: 27, color: '#5d4636', lineHeight: 1.5 }}>
                      {it}
                    </div>
                  </RowWipe>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 1450, opacity: region(beat, 3, 3).opacity }}>
        <RowWipe delay={383}>
          <div style={{
            background: 'rgba(255,253,249,0.9)', borderRadius: 20, border: `1.5px solid ${LINE}`,
            padding: '26px 40px', fontFamily: FONT_ROUND, fontSize: 36, color: CARAMEL, textAlign: 'center', letterSpacing: 2,
          }}>{p.punch}</div>
        </RowWipe>
      </div>
    </AbsoluteFill>
  );
};

// ── S10 收尾 · 全新做（母题收束）────────────────────
const S10Cta: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  const beat = useBeat(scene.subtitles);
  const f = useCurrentFrame();
  const tt = spring({ frame: f - 6, fps: FPS, config: { damping: 20, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Ambient />
      <div style={{ position: 'absolute', left: 72, top: 260, right: 72, opacity: tt, transform: `translateY(${(1 - tt) * 30}px)` }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 90, lineHeight: 1.24, color: BROWN }}>{p.title1}</div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 90, lineHeight: 1.24, color: BROWN }}>
          <HiLight delay={18}>{p.title2}</HiLight>
        </div>
      </div>

      {p.strips.map((st, i) => (
        <div key={st.name} style={{ position: 'absolute', left: 120, right: 120, top: 720 + i * 180, opacity: region(beat, 0, 0).opacity }}>
          <Stamp delay={30 + i * 14} rot={(i - 1) * 1.2}>
            <Slip style={{ display: 'flex', alignItems: 'center', padding: '26px 40px 26px 58px' }}>
              <CheckGlyph size={40} />
              <span style={{ fontSize: 32, fontWeight: 700, color: '#2f241c', marginLeft: 22, flex: 1 }}>{st.name}</span>
              <span style={{ fontSize: 28, color: ACCENT_DARK, fontWeight: 700, letterSpacing: 2 }}>{st.role}</span>
            </Slip>
          </Stamp>
        </div>
      ))}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 1320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <Stamp delay={80} rot={-3}>
          <div style={{
            border: `5px solid ${STAMP_RED}`, borderRadius: 24, padding: '20px 52px',
            fontFamily: FONT_ROUND, fontSize: 64, color: STAMP_RED, letterSpacing: 8,
            background: 'rgba(255,253,249,0.82)', boxShadow: `0 14px 34px rgba(232,80,58,0.22)`,
          }}>{p.brand}</div>
        </Stamp>
        <div style={{ fontSize: 28, color: '#8a715c', letterSpacing: 3, opacity: region(beat, 3, 3).opacity }}>{p.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 注册表：交给 scenes/index.tsx 的 VIDEO_RENDERERS ──
export const G06_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g06-hook': S1Hook,
  'g06-pain': S2Pain,
  'g06-idea': S3Idea,
  'g06-make-basic': S4MakeBasic,
  'g06-make-rules': S5MakeRules,
  'g06-steps': S6Steps,
  'g06-chain': S8Chain,
  'g06-ledger': S9Ledger,
  'g06-cta': S10Cta,
};

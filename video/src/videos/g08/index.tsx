// g08 火锅 · 片1 · 屏组件（一屏一组件，禁止跨行业 import）
// 母题「中秋档期的桌号牌」。背景 = bgImage（朱红海浪纹 BG-GEO-002，由 VTemplate 的 KenBurnsBg 垫底），
// 本组件 **AbsoluteFill 透明、不写 backgroundColor**——不再手写程序化棕底（2026-09-04 背景底强制闸门）。
// 桌号牌语言：中轴牌匾标题 + 米纸号牌卡（双线金边·四角金钉）+ 锅底单勾选行 + 落章入场。
// 2026-09-07 补30：五屏 PushIn 全部移除——任何缩放（含量化步进）在步进点都会重光栅化文字
//（实测步进帧对 23.7dB，比连续缩放逐帧 36.4dB 单次更大），含文字层禁缩放（文字保锐红线）。
// 2026-09-07 补31：五屏 Drift 视差漂移全部移除（用户终裁：主体元素停留期不要持续微动），
// 停留期镜头感由 KenBurnsBg 背景缓推 + 卡顶流光承担；camera.tsx 零引用随删。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_TITLE } from '../../palette';
import { Ico } from '../../components/icons';
import type { SceneRenderProps } from '../../types';
import type { MakePayload, MakeGroup, MakeRow, HookPayload, PainPayload, ResultPayload, CtaPayload } from './types';

// ── 桌号牌配色（叠在朱红海浪纹底上；米纸卡为高对比承载）──
const RED = '#C8342B';           // 椒红（hero/强调）
const DEEPRED = '#7A1F16';       // 深红（牌匾底，比背景沉一档、读得出"立牌"）
const BRONZE = '#C89B3C';        // 铜金（描边/组头/金钉）
const CREAM = '#FBF3E4';         // 米纸卡底
const INK = '#3A231A';           // 卡上深棕字
const GOLD_SOFT = 'rgba(200,155,60,0.6)';

// ── 落章入场：整块微过冲弹跳落定（"啪"地盖上）──
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

// ── 锅底单一行：勾选格 + 字段名 + 右对齐值（hero 行整条椒红底）──
const DipRow: React.FC<{ row: MakeRow; delay: number }> = ({ row, delay }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 15, stiffness: 180 } });
  if (f < delay) return null;
  const { k, v, hero, tag, indent } = row;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, marginTop: 14,
      padding: hero ? '20px 24px' : `12px 16px 12px ${indent ? 56 : 16}px`,
      background: hero ? RED : 'transparent', borderRadius: hero ? 10 : 0,
      borderBottom: hero ? 'none' : '2px dashed rgba(200,52,43,0.28)',
      transform: `scale(${interpolate(s, [0, 1], [0.94, 1])}) rotate(${interpolate(s, [0, 1], [-1.2, 0])}deg)`,
      opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 6, flexShrink: 0,
        border: hero ? 'none' : '2.5px solid rgba(200,52,43,0.55)', background: hero ? CREAM : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_TITLE, fontSize: 22, color: RED,
      }}>{hero ? '★' : ''}</span>
      <span style={{ fontSize: 33, fontWeight: 700, color: hero ? CREAM : INK, letterSpacing: 2 }}>{k}</span>
      {tag && <span style={{ fontSize: 22, color: hero ? CREAM : RED, border: `2px solid ${hero ? 'rgba(251,243,228,0.7)' : RED}`, borderRadius: 999, padding: '3px 14px', letterSpacing: 2, fontWeight: 700 }}>{tag}</span>}
      <span style={{ marginLeft: 'auto', fontFamily: FONT_TITLE, fontSize: hero ? 40 : 36, color: hero ? CREAM : RED, letterSpacing: 1, textAlign: 'right' }}>{v}</span>
    </div>
  );
};

// ── 组头：铜金小号 + 名称 + 两侧对称线（中轴对称语言）──
const GroupHead: React.FC<{ group: MakeGroup; delay: number }> = ({ group, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (f < delay) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <span style={{ flex: 1, height: 2, background: 'linear-gradient(to right, transparent, rgba(200,52,43,0.4))' }} />
      <span style={{ fontFamily: FONT_TITLE, fontSize: 30, color: BRONZE, letterSpacing: 3 }}>
        {group.head}
      </span>
      <span style={{ flex: 1, height: 2, background: 'linear-gradient(to left, transparent, rgba(200,52,43,0.4))' }} />
    </div>
  );
};

// ── 制券屏：制作中秋家宴券（固定有效期 + 到期提醒）──
const G08Make: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as MakePayload;
  const f = useCurrentFrame();
  const sweep = ((f * 6) % 1800) - 300; // 金线流光沿卡边巡走（停留期微动）
  // 逐组逐行的入场延时（全部在 ~frame 230 前落定，供抽全内容帧）
  let d = 48;
  const groupDelays = p.groups.map((g) => {
    const head = d; d += 20;
    const rows = g.rows.map(() => { const r = d; d += 14; return r; });
    return { head, rows };
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* 屏组件透明——朱红海浪纹 bgImage 由 VTemplate 垫底，此处不写 backgroundColor */}
      {/* 顶部合规角标（固定不动） */}
      {p.badge && <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>{p.badge}</div>}

      {/* 内容块垂直居中（牌匾 + 副行 + 号牌卡），低行数屏不再顶重脚轻 */}
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
          {/* 牌匾（margin auto 居中）+ 副行 */}
          <Stamp delay={6} style={{ width: '82%', margin: '0 auto' }}>
              <div style={{
                background: DEEPRED, borderRadius: 14, padding: '22px 20px 26px', textAlign: 'center',
                border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${CREAM}, 0 18px 40px rgba(0,0,0,0.45)`,
              }}>
                {p.icon && (
                  <div style={{
                    width: 66, height: 66, margin: '0 auto 12px', borderRadius: '50%',
                    border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 2.5px rgba(251,243,228,0.35)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 34, height: 34 }}>{Ico[p.icon](CREAM)}</div>
                  </div>
                )}
                <div style={{ fontFamily: FONT_TITLE, fontSize: 72, color: CREAM, letterSpacing: 10 }}>{p.title}</div>
              </div>
            </Stamp>
            <div style={{ textAlign: 'center', fontSize: 26, color: CREAM, letterSpacing: 2, textShadow: '0 2px 6px rgba(0,0,0,0.4)', margin: '22px 0 30px' }}>{p.sub}</div>

          {/* 号牌卡 */}
          <Stamp delay={30}>
              <div style={{ position: 'relative', background: CREAM, borderRadius: 18, padding: '14px 8px 34px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 8px ${CREAM}, inset 0 0 0 9.5px ${GOLD_SOFT}, 0 24px 52px rgba(0,0,0,0.45)` }}>
                {/* 四角金钉（签名记号） */}
                {[[18, 18], [18, undefined], [undefined, 18], [undefined, undefined]].map(([t, l], i) => (
                  <span key={i} style={{
                    position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: BRONZE,
                    top: t, bottom: t === undefined ? 18 : undefined, left: l, right: l === undefined ? 18 : undefined,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }} />
                ))}
                {/* 金线流光沿卡边巡走 */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: -40, left: sweep, width: 220, height: 60, background: 'linear-gradient(100deg, transparent, rgba(200,155,60,0.35), transparent)', transform: 'rotate(6deg)' }} />
                </div>

                <div style={{ padding: '26px 44px 0' }}>
                  {p.groups.map((g, gi) => (
                    <React.Fragment key={g.head}>
                      <GroupHead group={g} delay={groupDelays[gi].head} />
                      {g.rows.map((row, ri) => (
                        <DipRow key={row.k} row={row} delay={groupDelays[gi].rows[ri]} />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Stamp>
      </div>
    </AbsoluteFill>
  );
};

// ── S1 钩子屏：痛点牌匾 + 号牌卡预告"带到期日的券"（钩子长在券界面上）──
const G08Hook: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as HookPayload;
  const f = useCurrentFrame();
  const sweep = ((f * 6) % 1800) - 300;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* 顶部合规角标（固定不动） */}
      {p.badge && <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>{p.badge}</div>}

      {/* 内容块垂直居中 */}
      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
          {/* 痛点牌匾 + 副行 */}
          <Stamp delay={6} style={{ width: '82%', margin: '0 auto' }}>
            <div style={{
              background: DEEPRED, borderRadius: 14, padding: '40px 24px', textAlign: 'center',
              border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${CREAM}, 0 18px 40px rgba(0,0,0,0.45)`,
            }}>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 72, color: CREAM, letterSpacing: 6, lineHeight: 1.25 }}>{p.title}</div>
            </div>
          </Stamp>
            <div style={{ textAlign: 'center', fontSize: 34, color: CREAM, letterSpacing: 1, textShadow: '0 2px 6px rgba(0,0,0,0.45)', fontWeight: 600, margin: '28px 0 34px' }}>{p.sub}</div>

          {/* 号牌卡预告：这张"带到期日的券" */}
          <Stamp delay={60}>
            <div style={{ position: 'relative', background: CREAM, borderRadius: 18, padding: '40px 36px 44px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 8px ${CREAM}, inset 0 0 0 9.5px ${GOLD_SOFT}, 0 24px 52px rgba(0,0,0,0.45)` }}>
              {[[18, 18], [18, undefined], [undefined, 18], [undefined, undefined]].map(([t, l], i) => (
                <span key={i} style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: BRONZE, top: t, bottom: t === undefined ? 18 : undefined, left: l, right: l === undefined ? 18 : undefined, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
              ))}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: -40, left: sweep, width: 220, height: 60, background: 'linear-gradient(100deg, transparent, rgba(200,155,60,0.35), transparent)', transform: 'rotate(6deg)' }} />
              </div>
              <div style={{ textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 52, color: INK, letterSpacing: 3 }}>{p.couponName}</div>
              <div style={{ marginTop: 28, background: RED, borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 32, color: CREAM, fontWeight: 700, letterSpacing: 2 }}>有效期类型</span>
                <span style={{ fontFamily: FONT_TITLE, fontSize: 40, color: CREAM, letterSpacing: 1 }}>{p.validityType}</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
                <span style={{ fontSize: 30, color: INK, letterSpacing: 2 }}>到期</span>
                <span style={{ fontFamily: FONT_TITLE, fontSize: 52, color: RED, letterSpacing: 1 }}>{p.expireDate}</span>
              </div>
              <div style={{ marginTop: 26, textAlign: 'center', fontSize: 30, color: DEEPRED, fontWeight: 700, letterSpacing: 2, borderTop: '2px dashed rgba(200,52,43,0.3)', paddingTop: 22 }}>{p.highlight}</div>
            </div>
          </Stamp>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 痛点屏：现在这么做 → 结果失效 对照清单 ──
const G08Pain: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as PainPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* 顶部合规角标（固定不动） */}
      {p.badge && <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>{p.badge}</div>}

      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
          {/* 牌匾 + 副行 + 对照清单卡 */}
          <Stamp delay={6} style={{ width: '82%', margin: '0 auto' }}>
            <div style={{ background: DEEPRED, borderRadius: 14, padding: '34px 24px', textAlign: 'center', border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${CREAM}, 0 18px 40px rgba(0,0,0,0.45)` }}>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 60, color: CREAM, letterSpacing: 4 }}>{p.title}</div>
            </div>
          </Stamp>
          <div style={{ textAlign: 'center', fontSize: 30, color: CREAM, letterSpacing: 1, textShadow: '0 2px 6px rgba(0,0,0,0.45)', fontWeight: 600, margin: '26px 0 32px' }}>{p.sub}</div>
          <Stamp delay={40}>
            <div style={{ position: 'relative', background: CREAM, borderRadius: 18, padding: '30px 34px 36px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 8px ${CREAM}, inset 0 0 0 9.5px ${GOLD_SOFT}, 0 24px 52px rgba(0,0,0,0.45)` }}>
              {[[18, 18], [18, undefined], [undefined, 18], [undefined, undefined]].map(([t, l], i) => (
                <span key={i} style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: BRONZE, top: t, bottom: t === undefined ? 18 : undefined, left: l, right: l === undefined ? 18 : undefined }} />
              ))}
              {p.items.map((it, i) => (
                <div key={it.act} style={{ marginTop: i === 0 ? 6 : 26, paddingTop: i === 0 ? 0 : 26, borderTop: i === 0 ? 'none' : '2px dashed rgba(200,52,43,0.28)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <span style={{ fontFamily: FONT_TITLE, fontSize: 30, color: BRONZE }}>{`0${i + 1}`}</span>
                    <span style={{ fontSize: 38, color: INK, fontWeight: 700, letterSpacing: 1 }}>{it.act}</span>
                  </div>
                  <div style={{ marginTop: 8, marginLeft: 46, fontSize: 30, color: RED, letterSpacing: 1 }}>✗ {it.fail}</div>
                </div>
              ))}
            </div>
          </Stamp>
      </div>
    </AbsoluteFill>
  );
};

// ── S5 结果屏：顾客那边 / 你这边 两栏各看到什么 ──
const G08Result: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as ResultPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* 顶部合规角标（固定不动） */}
      {p.badge && <div style={{ position: 'absolute', right: 84, top: 88, fontSize: 22, color: BRONZE, border: `2px solid ${GOLD_SOFT}`, borderRadius: 999, padding: '6px 20px', letterSpacing: 3 }}>{p.badge}</div>}

      <div style={{ position: 'absolute', left: 84, right: 84, top: 150, bottom: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
          {/* 牌匾 + 副行 */}
          <Stamp delay={6} style={{ width: '82%', margin: '0 auto' }}>
            <div style={{ background: DEEPRED, borderRadius: 14, padding: '30px 24px', textAlign: 'center', border: `4px solid ${BRONZE}`, boxShadow: `inset 0 0 0 3px ${CREAM}, 0 18px 40px rgba(0,0,0,0.45)` }}>
              <div style={{ fontFamily: FONT_TITLE, fontSize: 56, color: CREAM, letterSpacing: 4 }}>{p.title}</div>
            </div>
          </Stamp>
            <div style={{ textAlign: 'center', fontSize: 28, color: CREAM, letterSpacing: 1, textShadow: '0 2px 6px rgba(0,0,0,0.4)', fontWeight: 600, margin: '24px 0 30px' }}>{p.sub}</div>

          {/* 两栏号牌卡 */}
          <div style={{ display: 'flex', gap: 22 }}>
            {p.sides.map((side, si) => (
              <Stamp key={side.who} delay={40 + si * 14} style={{ flex: 1, display: 'flex' }}>
                <div style={{ position: 'relative', flex: 1, background: CREAM, borderRadius: 18, padding: '26px 26px 30px', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 6px ${CREAM}, inset 0 0 0 7.5px ${GOLD_SOFT}, 0 20px 44px rgba(0,0,0,0.45)` }}>
                  {[[14, 14], [14, undefined], [undefined, 14], [undefined, undefined]].map(([t, l], i) => (
                    <span key={i} style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: BRONZE, top: t, bottom: t === undefined ? 14 : undefined, left: l, right: l === undefined ? 14 : undefined }} />
                  ))}
                  <div style={{ textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 34, color: RED, letterSpacing: 3, borderBottom: `2.5px solid ${RED}`, paddingBottom: 12 }}>
                    {side.icon && (
                      <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: '50%', border: `3px solid ${BRONZE}`, boxShadow: `inset 0 0 0 2px rgba(251,243,228,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 30, height: 30 }}>{Ico[side.icon](RED)}</div>
                      </div>
                    )}
                    {side.who}
                  </div>
                  {side.items.map((it, i) => (
                    <div key={it} style={{ marginTop: 22, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ color: BRONZE, fontSize: 26, lineHeight: 1.4 }}>✓</span>
                      <span style={{ fontSize: 28, color: INK, lineHeight: 1.4, fontWeight: 600 }}>{it}</span>
                    </div>
                  ))}
                </div>
              </Stamp>
            ))}
          </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 收尾屏：主张 + 品牌落章 ──
const G08Cta: React.FC<SceneRenderProps> = ({ scene }) => {
  const p = scene.payload as unknown as CtaPayload;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      {/* 主张大字 + 定位句 */}
      <Stamp delay={10} style={{ position: 'absolute', left: 110, right: 110, top: 620 }}>
        <div style={{ textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 62, color: CREAM, letterSpacing: 4, lineHeight: 1.4, textShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>{p.line}</div>
      </Stamp>
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1080, textAlign: 'center', fontSize: 30, color: CREAM, letterSpacing: 3, textShadow: '0 2px 6px rgba(0,0,0,0.45)' }}>{p.sub}</div>

      {/* 品牌落章 */}
      <Stamp delay={70} style={{ position: 'absolute', left: 0, right: 0, top: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 60, color: BRONZE, letterSpacing: 12, border: `4px solid ${BRONZE}`, borderRadius: 16, padding: '22px 46px', transform: 'rotate(-2deg)', boxShadow: `inset 0 0 0 3px rgba(200,155,60,0.4), 0 14px 34px rgba(0,0,0,0.4)` }}>{p.brand}</div>
        </div>
      </Stamp>
    </AbsoluteFill>
  );
};

// ── 注册表 ──
export const G08_RENDERERS: Record<string, React.ComponentType<SceneRenderProps>> = {
  'g08-hook': G08Hook,
  'g08-pain': G08Pain,
  'g08-make': G08Make,
  'g08-result': G08Result,
  'g08-cta': G08Cta,
};

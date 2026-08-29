// 质感扩展验证 · 两类非产品屏标杆（BENCH 系列，非交付片）
// 原则：真物或重排版，二者之外无画面——痛点屏载体=传单（实物复刻），机制屏载体=两组真券（对比实物化）
// 禁止：抽象示意图（框线箭头）、假数据、占位条
import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { FONT_BODY, FONT_TITLE, FPS } from '../palette';

const INK = '#16323F';
const RED = '#E84C59';
const THEME = '#123448';
const GOLD_BG = '#FFEEB2';
const GOLD_TX = '#8D5F37';

const Bg: React.FC<{ dim?: number }> = ({ dim = 0.22 }) => (
  <>
    <Img src={staticFile('backgrounds/bench-bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: `rgba(250,252,255,${dim})` }} />
  </>
);

const enter = (f: number, d: number, st = 170) => spring({ frame: f - d, fps: FPS, config: { damping: 21, stiffness: st } });

/** BENCH-A 痛点屏：一张被拒的传单 + 重排版主张 */
export const BenchPain: React.FC = () => {
  const f = useCurrentFrame();
  const e1 = enter(f, 6), e2 = enter(f, 16), e3 = enter(f, 26), eStack = enter(f, 10);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Bg />
      {/* 主张（钩子句，重排版承担，不画场景） */}
      <div style={{ position: 'absolute', left: 96, right: 96, top: 210 }}>
        <div style={{ fontSize: 30, color: 'rgba(22,50,63,0.62)', letterSpacing: 4, opacity: e1, transform: `translateY(${(1 - e1) * 24}px)` }}>开学季 · 校门口</div>
        <div style={{ marginTop: 16, fontFamily: FONT_TITLE, fontSize: 82, fontWeight: 900, color: INK, lineHeight: 1.28, opacity: e1, transform: `translateY(${(1 - e1) * 30}px)` }}>
          传单没有错<br /><span style={{ color: RED }}>发法</span>才让人犹豫
        </div>
      </div>
      {/* 主体：一沓印好的传单（3 张微旋堆叠，投影） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: eStack, transform: `translateY(${(1 - eStack) * 70}px)` }}>
        <div style={{ position: 'relative', width: 560, height: 700, filter: 'drop-shadow(0 30px 46px rgba(18,52,72,0.26))' }}>
          {[{ r: 5.5, x: 22, y: 20, z: 1 }, { r: -3.5, x: -14, y: 10, z: 2 }, { r: 0.8, x: 0, y: 0, z: 3 }].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, zIndex: p.z, transform: `rotate(${p.r}deg)` }}>
              <div style={{
                width: 500, height: 660, background: '#fff', borderRadius: 8,
                border: '1px solid rgba(18,52,72,0.10)',
                boxShadow: '0 10px 26px rgba(18,52,72,0.10)', padding: '46px 42px',
                display: 'flex', flexDirection: 'column',
              }}>
                {i === 2 && (
                  <>
                    {/* 传单印刷面（纯文字排版=产品可生成的形态，不放照片） */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 26, letterSpacing: 3, color: 'rgba(22,50,63,0.55)' }}>小画笔美术 · 示例</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', background: RED, borderRadius: 8, padding: '6px 18px' }}>免费</span>
                    </div>
                    <div style={{ marginTop: 44, fontFamily: FONT_TITLE, fontSize: 78, fontWeight: 900, color: INK, lineHeight: 1.3 }}>美术<br />体验课</div>
                    <div style={{ marginTop: 30, width: 170, height: 12, background: GOLD_BG, borderRadius: 6 }} />
                    <div style={{ marginTop: 36, fontSize: 29, color: 'rgba(22,50,63,0.72)', lineHeight: 1.75 }}>
                      45 分钟小班课<br />当周约课 · 到店即上<br />领取后 30 天内有效
                    </div>
                    <div style={{ marginTop: 'auto', borderTop: '2px dashed rgba(22,50,63,0.18)', paddingTop: 22, fontSize: 24, color: 'rgba(22,50,63,0.5)' }}>
                      向老师出示本券 · 登记后入座
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 右侧三条真实反应（通用表述，无绝对化、无假数据） */}
      {[
        ['家长笑着摆手', '「回去考虑一下」'],
        ['体验课答应了', '临时有事来不了'],
        ['课包买回去了', '孩子两周没来'],
      ].map(([a, b], i) => {
        const e = [e2, e3, enter(f, 36)][i];
        return (
          <div key={a} style={{
            position: 'absolute', left: 706, top: 772 + i * 236, width: 296,
            opacity: e, transform: `translateX(${(1 - e) * 40}px)`,
          }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{a}</div>
            <div style={{ marginTop: 8, fontSize: 27, color: 'rgba(22,50,63,0.6)', lineHeight: 1.5 }}>{b}</div>
            <div style={{ marginTop: 16, height: 2, background: 'rgba(232,76,89,0.35)', width: 96 }} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontSize: 23, color: 'rgba(18,52,72,0.5)', letterSpacing: 2 }}>场景描述为行业通用表述 · 券面为示例</div>
    </AbsoluteFill>
  );
};

/** BENCH-B 机制屏：两种给法（两组真物对比，代替抽象分叉图） */
export const BenchMech: React.FC = () => {
  const f = useCurrentFrame();
  const head = enter(f, 6), l = enter(f, 18), r = enter(f, 30);
  const card = (tag: string, name: string, val: string, dim: boolean) => (
    <div style={{
      position: 'relative', background: '#fff', borderRadius: 24, padding: '22px 26px',
      display: 'flex', alignItems: 'center', gap: 18,
      boxShadow: '0 10px 24px rgba(18,52,72,0.12)', opacity: dim ? 0.55 : 1,
      transform: `rotate(${dim ? -1.2 + Math.random() * 0 : 0}deg)`,
    }}>
      <div style={{ width: 74, height: 74, borderRadius: 12, background: '#F2F5F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 21, color: THEME, fontWeight: 700 }}>{tag}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 27, fontWeight: 700, color: INK }}>{name}</div>
        <div style={{ marginTop: 4, fontSize: 23, color: '#A9B0B8' }}>{val}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Bg />
      {/* 主张 */}
      <div style={{ position: 'absolute', left: 96, right: 96, top: 200, opacity: head, transform: `translateY(${(1 - head) * 26}px)` }}>
        <div style={{ fontFamily: FONT_TITLE, fontSize: 76, fontWeight: 900, color: INK, lineHeight: 1.3 }}>同一副牌<br />换个<span style={{ color: RED }}>给法</span></div>
        <div style={{ marginTop: 18, fontSize: 31, color: 'rgba(22,50,63,0.68)' }}>课还是那些课 · 家长担的成本变了</div>
      </div>
      {/* 左右两组真物 */}
      <div style={{ position: 'absolute', left: 72, top: 560, width: 452, opacity: l, transform: `translateY(${(1 - l) * 50}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: INK, marginBottom: 20 }}>直接塞课包</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: -14 }}>
          <div style={{ transform: 'rotate(1.4deg)', marginBottom: 14 }}>{card('次卡', '10 次课时卡', '¥1600 · 一次决定', true)}</div>
          <div style={{ transform: 'rotate(-1.1deg) translateX(-8px)', marginBottom: 14 }}>{card('兑换券', '写生体验课', '1 节 · 需约课', true)}</div>
          <div style={{ transform: 'rotate(0.6deg)' }}>{card('折扣券', '画材 8.8 折', '60 天内有效', true)}</div>
        </div>
        <div style={{ marginTop: 26, background: 'rgba(232,76,89,0.10)', border: '1.5px dashed rgba(232,76,89,0.5)', borderRadius: 14, padding: '18px 22px', fontSize: 26, lineHeight: 1.6, color: '#7A2A31' }}>
          一次要点头三张 · 花费叠在一起<br />家长会犹豫：孩子能坚持吗
        </div>
      </div>
      <div style={{ position: 'absolute', left: 536, top: 700, width: 8, bottom: 560, background: 'rgba(22,50,63,0.12)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', right: 72, top: 560, width: 452, opacity: r, transform: `translateY(${(1 - r) * 50}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: INK, marginBottom: 20 }}>放进券包 · 挑一张</div>
        <div style={{ background: THEME, borderRadius: '20px 20px 0 0', padding: '24px 26px' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fff' }}>开学季美术礼包</div>
          <div style={{ marginTop: 8, fontSize: 23, color: 'rgba(255,255,255,0.75)' }}>三选一 · 每人限领 1 个</div>
        </div>
        <div style={{ background: THEME, borderRadius: '0 0 20px 20px', padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {card('兑换券', '体验课兑换券', '先上 1 节再说', false)}
          <div style={{ transform: 'scale(0.98)', opacity: 0.82 }}>{card('满减券', '报名满减券', '满 800 减 80', false)}</div>
          <div style={{ transform: 'scale(0.96)', opacity: 0.66 }}>{card('折扣券', '画材折扣券', '9 折 · 60 天', false)}</div>
        </div>
        <div style={{ marginTop: 26, background: 'rgba(255,238,178,0.5)', border: '1.5px solid rgba(141,95,55,0.4)', borderRadius: 14, padding: '18px 22px', fontSize: 26, lineHeight: 1.6, color: GOLD_TX }}>
          今天只担一张的成本 · 上完体验<br />剩下的券还躺在卡包里
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontSize: 23, color: 'rgba(18,52,72,0.5)', letterSpacing: 2 }}>券包为产品真实形态演示 · 数据为示例</div>
    </AbsoluteFill>
  );
};

// 一屏标杆 · 「多列对照表」屏型（BENCH，非交付片）
// 排版底稿：outputs/样本库/ref-15-多列对照表格型-模型路由表.jpg
//   拆其骨架：双色大标题 / 胶囊提示条 / 主题色表头+斑马行 / 单元格"粗体导语+小字细节"两级 / 底部结论条 / emoji 图标
//   换肤验证：配色换产品真实主题「墨玉绿 #0C453D」（utils/theme.js），非参考图紫色
// 内容口径：全部字段有 spec/facts.json 依据（私密一次 1~10 张、超时五档、券包 2~10 种每人限领、库存 1~10000）；不出现平台禁用词
import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame } from 'remotion';
import { FONT_BODY, FONT_TITLE, FPS } from '../palette';

const T = '#0C453D';        // 墨玉绿（产品主题 4）
const T_DARK = '#07312B';
const GOLD = '#B98A2F';
const RED = '#C2402A';
const INK = '#17332D';

const COLS = [
  { k: '方式', w: 180, flex: 0 },
  { k: '怎么发', w: 320, flex: 0 },
  { k: '适合什么场景', w: 280, flex: 0 },
  { k: '要点', w: 0, flex: 1 },
];

const ROWS = [
  {
    emoji: '📢', name: '公开领取', tone: '放出去谁都能领',
    how: ['分享链接 / 店内台卡', '领完自动进顾客卡包'],
    scene: ['新店引流活动', '门口桌贴，路人变留资'],
    note: '库存 1~10000 可控', warn: false,
    band: 'rgba(12,69,61,0.05)',
  },
  {
    emoji: '🤝', name: '私密发放', tone: '一对一发给指定人',
    how: ['按手机号定向发', '一次 1~10 张', '链接可设超时失效'],
    scene: ['老客唤醒、节日答谢', '老师/店员当面发'],
    note: '收的人确认才到账', warn: false,
    band: 'rgba(185,138,47,0.07)',
  },
  {
    emoji: '🎁', name: '券包', tone: '一包装几张 挑一张领',
    how: ['2~10 种券自由配', '每人限领 1 个', '走私密方式发出'],
    scene: ['新生欢迎礼', '三选一降低尝试门槛'],
    note: '顾客挑一张，另两张留在包里', warn: false,
    band: 'rgba(12,69,61,0.05)',
  },
];

export const BenchTable: React.FC = () => {
  const f = useCurrentFrame();
  const s = (d: number) => spring({ frame: f - d, fps: FPS, config: { damping: 21, stiffness: 170 } });
  const head = s(4), tip = s(12);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Img src={staticFile('backgrounds/bench-bg.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'rgba(250,252,250,0.32)' }} />

      {/* 顶部：双色大标题 + 胶囊提示条（ref-15 骨架①） */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 168, opacity: head, transform: `translateY(${(1 - head) * 26}px)` }}>
        <div style={{ fontFamily: FONT_TITLE, fontSize: 78, fontWeight: 900, color: INK, letterSpacing: 1 }}>
          券怎么发出去？<span style={{ color: T }}>三选一</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 32, color: 'rgba(23,51,45,0.66)' }}>方式不同，顾客的感受完全不同</div>
      </div>
      <div style={{
        position: 'absolute', left: 80, right: 80, top: 372, opacity: tip, transform: `translateY(${(1 - tip) * 20}px)`,
        display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1.5px solid rgba(12,69,61,0.2)',
        borderRadius: 999, padding: '16px 30px', boxShadow: '0 8px 20px rgba(12,69,61,0.08)',
      }}>
        <span style={{ fontSize: 30 }}>💡</span>
        <span style={{ fontSize: 28, color: INK }}>三种都是产品真实功能 · 这一页分清该用哪个</span>
      </div>

      {/* 主体表格（ref-15 骨架③：主题色表头 + 斑马行 + 两级文字 + 红字警示） */}
      <div style={{ position: 'absolute', left: 62, right: 62, top: 470 }} id="tbl">
        {/* 表头 */}
        <div style={{ display: 'flex', background: `linear-gradient(120deg, ${T_DARK}, ${T})`, borderRadius: '22px 22px 0 0', overflow: 'hidden', boxShadow: '0 14px 30px rgba(12,69,61,0.22)' }}>
          {COLS.map((c) => (
            <div key={c.k} style={{ flex: c.flex ? 1 : 'none', width: c.flex ? undefined : c.w, padding: '24px 18px 24px 20px', fontSize: 29, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>
              {c.k}
            </div>
          ))}
        </div>
        {ROWS.map((r, i) => {
          const e = s(16 + i * 10);
          return (
            <div key={r.name} style={{
              display: 'flex', background: i === 1 ? r.band : '#FFFFFF', borderTop: i > 0 ? '1.5px solid rgba(12,69,61,0.10)' : 'none',
              opacity: e, transform: `translateY(${(1 - e) * 30}px)`,
              ...(i === ROWS.length - 1 ? { borderRadius: '0 0 22px 22px', overflow: 'hidden' } : {}),
            }}>
              {/* 方式列：emoji + 名称 + 定性短语 */}
              <div style={{ flex: '0 0 180px', padding: '30px 8px 30px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 46 }}>{r.emoji}</div>
                <div style={{ fontSize: 33, fontWeight: 800, color: INK }}>{r.name}</div>
                <div style={{ fontSize: 22, color: 'rgba(23,51,45,0.6)', lineHeight: 1.4 }}>{r.tone}</div>
              </div>
              {/* 怎么发 */}
              <div style={{ flex: '0 0 320px', padding: '30px 12px' }}>
                {r.how.map((t) => (
                  <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
                    <span style={{ color: GOLD, fontSize: 24, marginTop: 2 }}>●</span>
                    <span style={{ fontSize: 25, color: INK, lineHeight: 1.45 }}>{t}</span>
                  </div>
                ))}
              </div>
              {/* 适合场景 */}
              <div style={{ flex: '0 0 280px', padding: '30px 12px' }}>
                {r.scene.map((t, j) => (
                  <div key={t} style={{ fontSize: 25, lineHeight: 1.55, color: j === 0 ? T : 'rgba(23,51,45,0.75)', fontWeight: j === 0 ? 700 : 400 }}>{t}</div>
                ))}
              </div>
              {/* 要点（warn=红字） */}
              <div style={{ flex: 1, minWidth: 0, padding: '30px 22px 30px 0' }}>
                <div style={{ fontSize: 24, lineHeight: 1.5, fontWeight: 700, color: r.warn ? RED : 'rgba(23,51,45,0.8)' }}>{r.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部结论条（ref-15 骨架④：图标 + 双色强调句式） */}
      <div style={{
        position: 'absolute', left: 62, right: 62, top: 1372, background: '#fff', borderRadius: 24,
        border: '1.5px solid rgba(12,69,61,0.16)', boxShadow: '0 14px 30px rgba(12,69,61,0.12)', padding: '28px 34px',
        opacity: s(48), transform: `translateY(${(1 - s(48)) * 26}px)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 38 }}>🎯</span>
          <span style={{ fontSize: 30, fontWeight: 800, color: INK, lineHeight: 1.5 }}>
            拉新用<span style={{ color: T }}>公开领取</span> · 喊老客用<span style={{ color: T }}>私密发放</span> · 想让人先试再说，就把三张券装进
            <span style={{ color: GOLD }}>券包让他挑</span>
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontSize: 22, color: 'rgba(12,69,61,0.5)', letterSpacing: 2 }}>功能为产品真实能力 · 场景为通用表述</div>
    </AbsoluteFill>
  );
};

// g07 咖啡茶饮 · 一屏标杆（质感验证用，非交付片）
// 母题「一张刚打印出来的点单小票」：热敏小票上下撕齿 / 咖啡渍水印 / 拿铁纸感 / 打印出票入场
// 色板 caramel（陶土咖啡红 #B5502A + 浓缩咖墨 + 纯白小票）——整套与教培那条（暖橙 + 回执左打孔 + 盖章对勾）不同。
// 屏内容：制作满减券（券面 4 行 + 期限 2 行两组）+ 门槛分水岭提示卡；消费门槛=本片核心决策，唯一强调整行
// 字段名逐字回 spec/coupon-fields.json；数值为示例（合规标注走顶部面包屑行尾，C-11）。
// 骨架全部内联本文件；跨屏只复用 ../../components/{animations,ui} 与 ../../palette。
import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame,
} from 'remotion';
import { FPS, FONT_BODY, FONT_ROUND, PALETTES } from '../palette';
import { EASE_OUT } from '../components/animations';
import { Ico } from '../components/icons';

// ── 本片色板（caramel 主题派生）──
const COFFEE_RED = '#B5502A';                     // 陶土咖啡红（本片主 accent，区别暖橙 #FF7043）
const ESPRESSO = '#2B1C12';                       // 浓缩深咖（标题墨色）
const BROWN = '#5A3E2B';                          // 暖棕（正文）
const MUTED = '#8A6F5A';                          // 灰咖（次要）
const FAINT = '#B49A80';                          // 浅咖（提示）
const PAPER = '#FFFFFF';                          // 纯白小票（与奶油底拉开对比，撕齿才看得见）
const CREAM = '#F1E4CE';                          // 奶油卡底
const LINE = 'rgba(90,62,43,0.18)';               // 咖啡细线
const SHADOW = 'rgba(90,62,43,0.15)';             // 暖投影

// ── 底层持续微动：暖光斑漂移 + 咖啡渍水印圈呼吸（招牌记号，只此一个、克制）──
const Ambient: React.FC = () => {
  const f = useCurrentFrame();
  const x1 = Math.sin(f / 62) * 26;
  const y1 = Math.cos(f / 80) * 20;
  const x2 = Math.cos(f / 70) * 30;
  const ringO = 0.05 + (Math.sin(f / 50) * 0.5 + 0.5) * 0.025;
  return (
    <>
      <div style={{
        position: 'absolute', left: -160 + x1, top: 200 + y1, width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(181,80,42,0.10) 0%, transparent 68%)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: -200 + x2, bottom: 360 - y1, width: 640, height: 640, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(141,110,99,0.12) 0%, transparent 66%)', pointerEvents: 'none',
      }} />
      {/* 咖啡渍水印圈：非正圆的手绘感环 + 内圈，落在右上，低透明 */}
      <div style={{
        position: 'absolute', right: 70, top: 250, width: 260, height: 250,
        border: `14px solid ${COFFEE_RED}`, borderRadius: '50% 46% 52% 48% / 48% 52% 46% 54%',
        opacity: ringO, transform: 'rotate(-14deg)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 150, top: 330, width: 90, height: 86,
        border: `8px solid ${COFFEE_RED}`, borderRadius: '50% 48% 52% 46%', opacity: ringO * 0.8,
        transform: 'rotate(10deg)', pointerEvents: 'none',
      }} />
    </>
  );
};

// ── 打印出票入场：行自上而下落 + 擦入（区别教培的右入递交）──
const PrintLine: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      opacity: Math.min(1, p * 1.8),
      transform: `translateY(${(1 - p) * -10}px)`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// ── 小票卡：纯白底 + 细咖啡描边 + 暖投影 + 上下撕齿（纸白 vs 奶油底，齿看得见）──
const Ticket: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ children, style, rot = 0 }) => (
  <div style={{ position: 'relative', background: PAPER, border: `1.5px solid ${LINE}`, boxShadow: `0 18px 40px ${SHADOW}`, transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{
      position: 'absolute', left: 0, right: 0, top: -11, height: 12,
      backgroundImage: `linear-gradient(135deg, ${PAPER} 30%, transparent 30%), linear-gradient(-135deg, ${PAPER} 30%, transparent 30%)`,
      backgroundSize: '22px 22px', filter: `drop-shadow(0 -2px 2px ${SHADOW})`,
    }} />
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: -11, height: 12,
      backgroundImage: `linear-gradient(45deg, ${PAPER} 30%, transparent 30%), linear-gradient(-45deg, ${PAPER} 30%, transparent 30%)`,
      backgroundSize: '22px 22px', filter: `drop-shadow(0 2px 2px ${SHADOW})`,
    }} />
    {children}
  </div>
);

// ── 顶栏（菜单板风）：杯标 + 页面真标题 + 步骤胶囊 + 面包屑（行尾「数值为示例」合规标注，C-11 顶部）──
const Header: React.FC<{ title: string; step: string; crumb: string }> = ({ title, step, crumb }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - 4, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 116, opacity: p }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, height: 66 }}>
        <span style={{ width: 44, height: 44, display: 'inline-block' }}>{Ico.cup(COFFEE_RED)}</span>
        <span style={{ fontFamily: FONT_ROUND, fontSize: 52, color: ESPRESSO, letterSpacing: 4 }}>{title}</span>
        <span style={{
          position: 'absolute', right: 0, fontSize: 24, color: '#fff', background: COFFEE_RED,
          borderRadius: 999, padding: '9px 24px', letterSpacing: 2,
        }}>{step}</span>
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', fontSize: 25, color: MUTED, letterSpacing: 1 }}>{crumb}</div>
    </div>
  );
};

// ── 分组小标题 ──
const GroupHead: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
  <PrintLine delay={delay}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: `2px solid ${LINE}` }}>
      <span style={{ width: 10, height: 32, borderRadius: 5, background: COFFEE_RED }} />
      <span style={{ fontSize: 31, fontWeight: 700, color: BROWN, letterSpacing: 2 }}>{text}</span>
    </div>
  </PrintLine>
);

// ── 一行制券表单：左=产品字段名，右=咖啡场景示例值；未到本行节拍前不占位 ──
// hero = 本片核心决策行（消费门槛）：整行咖啡红底带 + 左色条 + 值放大成主色 + 可选小标签；其余行干净无装饰
const FormLine: React.FC<{
  k: string; v: string; delay: number; hero?: boolean; tag?: string; hint?: string;
}> = ({ k, v, delay, hero, tag, hint }) => {
  const f = useCurrentFrame();
  if (f < delay) return null;
  return (
    <PrintLine delay={delay}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: hero ? '26px 20px 22px' : '24px 12px 20px',
        borderBottom: `1.5px dashed ${LINE}`,
        background: hero ? 'rgba(181,80,42,0.10)' : 'transparent',
        borderLeft: hero ? `7px solid ${COFFEE_RED}` : '7px solid transparent',
        borderRadius: 12,
      }}>
        <span style={{ width: 188, flexShrink: 0, fontSize: 30, color: hero ? '#7a3a1e' : MUTED, letterSpacing: 1, fontWeight: hero ? 700 : 400 }}>{k}</span>
        <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 14 }}>
          {tag && (
            <span style={{ fontSize: 22, color: '#fff', background: COFFEE_RED, borderRadius: 8, padding: '4px 12px', letterSpacing: 1, transform: 'translateY(-6px)' }}>{tag}</span>
          )}
          <span style={{ fontSize: hero ? 42 : 36, fontWeight: 700, color: hero ? COFFEE_RED : ESPRESSO, textAlign: 'right', lineHeight: 1.3 }}>{v}</span>
        </span>
      </div>
      {hint && (
        <div style={{ fontSize: 24, color: FAINT, textAlign: 'right', padding: hero ? '10px 20px 6px' : '8px 12px 4px', letterSpacing: 1, lineHeight: 1.4 }}>{hint}</div>
      )}
    </PrintLine>
  );
};

// ── 门槛分水岭提示卡 ──
const Callout: React.FC<{ delay: number }> = ({ delay }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: FPS, config: { damping: 20, stiffness: 150 } });
  return (
    <PrintLine delay={delay} style={{ marginTop: 40 }}>
      <div style={{
        background: CREAM, borderRadius: 18, borderLeft: `9px solid ${COFFEE_RED}`,
        boxShadow: `0 12px 26px ${SHADOW}`, padding: '30px 40px',
      }}>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 35, color: ESPRESSO, letterSpacing: 1 }}>
          门槛填 <span style={{ color: COFFEE_RED, fontWeight: 700 }}>0</span> = 白送引流，招来只占便宜的
        </div>
        <div style={{ fontFamily: FONT_ROUND, fontSize: 35, color: ESPRESSO, marginTop: 12, letterSpacing: 1 }}>
          门槛设成 <span style={{ color: COFFEE_RED, fontWeight: 700 }}>35 元</span>（≈客单价）= 来了就得消费一次
        </div>
        <div style={{ marginTop: 16, fontSize: 25, color: BROWN, letterSpacing: 1 }}>这一栏，就是"拉新还是提客单"的分水岭</div>
      </div>
    </PrintLine>
  );
};

// ── 页脚品牌记号 ──
const FootMark: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f - 110, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT });
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      opacity: p * 0.9, color: FAINT, fontSize: 24, letterSpacing: 3,
    }}>
      <span style={{ width: 26, height: 26, display: 'inline-block' }}>{Ico.cup(FAINT)}</span>
      券到卡包 · 咖啡茶饮
    </div>
  );
};

// ── 一屏标杆主体 ──
export const G07Bench: React.FC = () => {
  const f = useCurrentFrame();
  const lift = spring({ frame: f - 12, fps: FPS, config: { damping: 20, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, backgroundColor: PALETTES.caramel.bg }}>
      <Ambient />
      <Header title="制作满减券" step="示例" crumb="券到卡包 · 拉新复购 · 数值为示例" />
      <div style={{
        position: 'absolute', left: 68, right: 68, top: 300,
        opacity: lift, transform: `translateY(${(1 - lift) * 60}px)`,
      }}>
        {/* 第一组 · 券面 */}
        <Ticket style={{ padding: '36px 44px 24px 52px' }}>
          <GroupHead text="① 券面" delay={18} />
          <FormLine k="优惠券名称" v="到店咖啡券" delay={28} hint="最多 18 字 · 场景直接写进名字" />
          <FormLine k="消费门槛" v="满 35 元可用" delay={46} hero tag="分水岭" hint="0 为无门槛" />
          <FormLine k="优惠金额" v="8 元" delay={66} hint="满 35 才能用，省 8 元" />
          <FormLine k="制作数量" v="200 张" delay={84} hint="库存 1~10000" />
        </Ticket>

        {/* 第二组 · 期限 */}
        <Ticket rot={0.3} style={{ padding: '36px 44px 24px 52px', marginTop: 56 }}>
          <GroupHead text="② 期限" delay={102} />
          <FormLine k="有效期类型" v="自领取日起 N 天内有效" delay={110} />
          <FormLine k="有效期" v="7 天" delay={126} hint="最少 1 天，最多 365 天" />
        </Ticket>

        <Callout delay={144} />
      </div>
      <FootMark />
    </AbsoluteFill>
  );
};

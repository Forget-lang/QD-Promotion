// 屏型样张 B · ref-11/12/13/14/16/17/18/19 拆底稿（BENCH，非交付片）
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';
import { Paper, PageBadge, Head, CapTip, ConcBar, Foot, INK, SOFT, FAINT, CARD } from './BenchKit';

const RED = '#C2402A';
const YEL = '#F4C430';
const WINE = '#8B1A32';
const GOLDT = '#786018';
const JADE = '#0C453D';
const CELLAR = '#6A2432';
const NAVY = '#212F99';
const COPPER = '#6B3A2A';
const DEEP = '#123448';

/** ref-11 纵向编号步骤条：编号圆+竖虚线+彩底三栏卡 */
export const R11: React.FC = () => {
  const steps = [
    ['🎨', '做券', '选券型 · 设面额门槛 · 写须知', '名称 18 字内，库存 1~10000', '#FFEFD3'],
    ['📦', '组包', '2~10 种券装一包 · 设自选一种', '每人限领 1 个，三选一', '#E3F1E9'],
    ['📨', '发放', '台卡加好友自动发 / 一对一私发', '私密一次 1~10 张，可设超时', '#E4E9FB'],
    ['📮', '核销', '到店出示核销码，商家扫码', '核销方向固定：商家扫顾客', '#FBE3E6'],
    ['📊', '复盘', '按券分开记：谁领了、谁核了', '领了没用的名单可导出再唤醒', '#EFE7F8'],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper tint="#FBF7EE" />
      <PageBadge no={11} color={COPPER} />
      <Head lines={['一张券的一生', '五步走完<闭环>'.replace('<', '').replace('>', '')]} top={180} size={72} color={COPPER} />
      <div style={{ position: 'absolute', left: 130, top: 460, bottom: 300, width: 4, background: 'rgba(107,58,42,0.35)' }} />
      {steps.map(([e, t, a, b, bg], i) => (
        <div key={t as string} style={{ position: 'absolute', left: 90, right: 62, top: 448 + i * 268 }}>
          <span style={{ position: 'absolute', left: 0, top: 34, width: 80, height: 80, borderRadius: '50%', background: COPPER, color: '#fff', fontSize: 40, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 8px 18px rgba(107,58,42,0.3)' }}>{i + 1}</span>
          <div style={{ marginLeft: 120, background: bg as string, borderRadius: 24, padding: '24px 30px', display: 'flex', gap: 26, alignItems: 'center', border: '1.5px solid rgba(107,58,42,0.14)' }}>
            <div style={{ width: 170, flexShrink: 0 }}><span style={{ fontSize: 40 }}>{e}</span><div style={{ fontFamily: FONT_TITLE, fontSize: 42, fontWeight: 900, color: COPPER, marginTop: 4 }}>{t}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 30, fontWeight: 700, color: INK }}>{a}</div><div style={{ marginTop: 8, fontSize: 26, color: SOFT }}>{b}</div></div>
          </div>
        </div>
      ))}
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-12 行式列表焦点卡：左四行列表 + 右大数字焦点卡 */
export const R12: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Paper />
    <PageBadge no={12} color={WINE} />
    <Head lines={['为什么家长<span style="x">不抗拒</span>这张券'.replace(/<\/?span[^>]*>/g, '')]} top={190} size={68} color={WINE} />
    <div style={{ position: 'absolute', left: 62, top: 380, width: 620, ...CARD, padding: '10px 34px' }}>
      {[['🏷️', '只领一张', '三选一，不用当场买任何东西'], ['🧯', '没有捆绑', '没挑中的两张不算他欠你的'], ['⏰', '有闹钟', '到期前 3 天服务通知提醒他'], ['🔍', '有下文', '领没领、来没来，后台分开记']].map(([e, t, d], i) => (
        <div key={t as string} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '26px 0', borderBottom: i < 3 ? '1.5px dashed rgba(139,26,50,0.16)' : 'none' }}>
          <span style={{ fontSize: 44 }}>{e}</span>
          <div><div style={{ fontSize: 33, fontWeight: 800, color: INK }}>{t}</div><div style={{ marginTop: 6, fontSize: 27, color: SOFT }}>{d}</div></div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 710, top: 380, right: 62, ...CARD, padding: '34px 26px', textAlign: 'center', background: 'linear-gradient(160deg,#FFF3F6,#fff)' }}>
      <span style={{ fontSize: 60 }}>👑</span>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 40, fontWeight: 900, color: INK, marginTop: 8 }}>家长的心理成本</div>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 120, fontWeight: 900, color: WINE, lineHeight: 1.2 }}>1 张</div>
      <div style={{ fontSize: 27, color: SOFT }}>而不是三张课包<br />一起压在身上</div>
    </div>
    <div style={{ position: 'absolute', left: 62, right: 62, top: 1160, ...CARD, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 18 }}>
      <span style={{ fontSize: 40 }}>💡</span>
      <span style={{ fontSize: 29, color: INK, lineHeight: 1.5 }}>券包是<b style={{ color: WINE }}>降压阀</b>：把「买不买」换成「挑哪个」，对话就继续得下去</span>
    </div>
    <ConcBar icon="🎯">先让他<span style={{ color: WINE }}>轻松收下</span>，再让他<span style={{ color: WINE }}>来了不想走</span></ConcBar>
    <Foot />
  </AbsoluteFill>
);

/** ref-13 等式大数字结论型：流程条 + 等式块 + 金警示条 + VS */
export const R13: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Paper tint="#F6F4FF" />
    <PageBadge no={13} color={NAVY} />
    <Head lines={[<React.Fragment key="t">为什么券要<span style={{ color: RED }}>装进包里</span>发</React.Fragment>]} top={180} size={76} color={NAVY} />
    <div style={{ position: 'absolute', left: 82, top: 316, background: NAVY, color: '#fff', fontSize: 29, fontWeight: 700, borderRadius: 999, padding: '12px 32px' }}>因为一次给三张，等于没给</div>
    {/* 流程条 */}
    <div style={{ position: 'absolute', left: 62, right: 62, top: 400, display: 'flex', alignItems: 'center', gap: 10 }}>
      {['单发券', '发三张', '家长犹豫', '不了了之'].map((t, i) => (
        <React.Fragment key={t}>
          <div style={{ flex: 1, textAlign: 'center', ...CARD, padding: '20px 6px', fontSize: 27, fontWeight: 700, color: i === 3 ? RED : INK }}>{t}</div>
          {i < 3 && <span style={{ color: FAINT, fontSize: 30 }}>→</span>}
        </React.Fragment>
      ))}
    </div>
    {/* 等式块 */}
    <div style={{ position: 'absolute', left: 62, top: 600, width: 470, ...CARD, padding: '30px 32px', background: 'linear-gradient(160deg,#EDF0FF,#fff)' }}>
      <div style={{ fontSize: 33, fontWeight: 900, color: NAVY }}>🎁 发一个券包</div>
      <div style={{ marginTop: 14, fontSize: 27, color: SOFT, lineHeight: 1.6 }}>三张券装一包<br />家长挑一张领，每人限 1 个</div>
    </div>
    <div style={{ position: 'absolute', left: 548, top: 668, fontSize: 74, color: NAVY, fontWeight: 900 }}>=</div>
    <div style={{ position: 'absolute', left: 626, right: 62, top: 600, ...CARD, padding: '24px 30px', textAlign: 'center' }}>
      <div style={{ fontSize: 27, color: SOFT }}>家长只承担</div>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 96, fontWeight: 900, color: NAVY, lineHeight: 1.1 }}>1 张</div>
      <div style={{ fontSize: 26, color: FAINT }}>的成本 · 另两张还在包里</div>
    </div>
    {/* 金色警示条 */}
    <div style={{ position: 'absolute', left: 62, right: 62, top: 930, background: 'rgba(244,196,48,0.22)', border: '1.5px solid rgba(120,96,24,0.35)', borderRadius: 18, padding: '22px 30px', fontSize: 30, color: GOLDT, fontWeight: 700 }}>⚠️ 你在替家长做决定，他在替自己做推辞</div>
    {/* VS 区 */}
    <div style={{ position: 'absolute', left: 62, right: 62, top: 1060, display: 'flex', gap: 22, alignItems: 'stretch' }}>
      <div style={{ flex: 1, ...CARD, padding: '26px 30px', borderTop: `6px solid ${NAVY}` }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: NAVY }}>❶ 塞三张 = 卖课包</div>
        {['当场表态度：再考虑', '回家就忘了这回事', '下次路过绕着走'].map((t) => <div key={t} style={{ marginTop: 12, fontSize: 27, color: SOFT }}>✕ {t}</div>)}
      </div>
      <div style={{ alignSelf: 'center', fontFamily: FONT_TITLE, fontSize: 54, fontWeight: 900, color: RED }}>VS</div>
      <div style={{ flex: 1, ...CARD, padding: '26px 30px', borderTop: `6px solid ${JADE}` }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: JADE }}>❷ 挑一张 = 收礼物</div>
        {['挑的过程就是咨询', '领了就有核销动作', '记录留下下次话题'].map((t) => <div key={t} style={{ marginTop: 12, fontSize: 27, color: SOFT }}>✓ {t}</div>)}
      </div>
    </div>
    <ConcBar icon="💡" bg={NAVY} fg="#fff">让<b>对的东西</b>，进<b>对的包装</b></ConcBar>
    <Foot />
  </AbsoluteFill>
);

/** ref-14 阶段导航展开型：左三阶段竖卡+箭头，右展开面板 */
export const R14: React.FC = () => {
  const st = [
    ['新生期', '三选一券包', JADE, '#E3F1E9', '进门', ['体验课兑换', '报名满减', '画材折扣'], '先让人进门，别急着收钱'],
    ['在读期', '老带新双券', NAVY, '#E4E9FB', '扩散', ['推荐人一张', '新客一张', '先到先得'], '口碑是现成的复购杠杆'],
    ['沉睡期', '限时回归券', CELLAR, '#F9E3E7', '回收', ['60 天未核销筛出', '15 天有效', '到期前再提醒'], '很多不是退班，是忘了'],
  ] as const;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper />
      <PageBadge no={14} color={DEEP} />
      <Head lines={['学员生命周期，<三阶段各有打法>'.replace('<', '').replace('>', '')]} top={180} size={64} color={DEEP} />
      {st.map(([p1, p2, c, bg, badge, chips, tip], i) => (
        <div key={p1 as string} style={{ position: 'absolute', left: 62, right: 62, top: 360 + i * 396, display: 'flex', gap: 22 }}>
          <div style={{ width: 220, flexShrink: 0, background: '#fff', borderLeft: `10px solid ${c}`, borderRadius: 22, boxShadow: '0 10px 24px rgba(20,40,70,0.10)', padding: '26px 24px' }}>
            <span style={{ fontSize: 46 }}>{i === 0 ? '🌱' : i === 1 ? '🔥' : '💤'}</span>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 44, fontWeight: 900, color: c as string, marginTop: 8 }}>{p1}</div>
            <div style={{ fontSize: 29, fontWeight: 700, color: INK, marginTop: 4 }}>{p2}</div>
          </div>
          <div style={{ flex: 1, background: bg, borderRadius: 22, padding: '24px 28px', border: '1.5px solid rgba(30,36,48,0.08)' }}>
            <div style={{ display: 'inline-block', background: c, color: '#fff', fontSize: 26, fontWeight: 800, borderRadius: 12, padding: '8px 22px', marginBottom: 16 }}>{'❶❷❸'[i]} {p2} · {badge}</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {(chips as readonly string[]).map((k) => <span key={k} style={{ background: '#fff', borderRadius: 999, padding: '10px 24px', fontSize: 26, fontWeight: 700, color: c as string, boxShadow: '0 4px 10px rgba(20,40,70,0.08)' }}>{k}</span>)}
            </div>
            <div style={{ marginTop: 18, fontSize: 28, color: INK, lineHeight: 1.5 }}>💡 {tip}</div>
          </div>
        </div>
      ))}
      <ConcBar icon="🧭">阶段不同，<span style={{ color: DEEP }}>发券的理由</span>也不同</ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-16 步骤结果对照型：左编号步骤卡→右结果面板，交替四组 */
export const R16: React.FC = () => {
  const rows = [
    ['建券包', '挑 3 张互补的券：体验 · 报名 · 画材', '📦 一包三张，各管一步'],
    ['设领取', '自选一种 · 每人限领 1 个', '🎯 家长只挑想要的'],
    ['发出去', '台卡加好友自动发 / 老师一对一私发', '📨 私密直达，不广场化'],
    ['看记录', '谁领了哪张、核了没有，按券分开记', '📊 名单就是下轮话题'],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper tint="#FBF7EE" />
      <PageBadge no={16} color={GOLDT} />
      <Head lines={[<React.Fragment key="t">券包五分钟<span style={{ color: RED }}>上线</span></React.Fragment>]} top={180} size={78} color={GOLDT} />
      <div style={{ position: 'absolute', left: 82, top: 322, fontSize: 30, color: SOFT }}>四步发出去，每一步都有记录可查</div>
      {rows.map(([t, d, res], i) => (
        <div key={t as string} style={{ position: 'absolute', left: 62, right: 62, top: 420 + i * 300, display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ width: 560, background: '#fff', borderRadius: 24, padding: '26px 28px', boxShadow: '0 10px 24px rgba(20,40,70,0.10)' }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: GOLDT }}><span style={{ background: GOLDT, color: '#fff', borderRadius: 12, padding: '4px 16px', fontSize: 28, marginRight: 14 }}>{i + 1}</span>{t}</div>
            <div style={{ marginTop: 14, fontSize: 28, color: INK, lineHeight: 1.55 }}>{d}</div>
          </div>
          <span style={{ fontSize: 36, color: FAINT }}>➜</span>
          <div style={{ flex: 1, background: 'linear-gradient(150deg,#FFF6D8,#fff)', border: '1.5px solid rgba(120,96,24,0.25)', borderRadius: 24, padding: '26px 24px', fontSize: 29, fontWeight: 700, color: INK }}>{res}</div>
        </div>
      ))}
      <ConcBar icon="⭐" bg="#FFF6D8">发完才三分钟，<span style={{ color: GOLDT }}>名单已经在攒了</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-17 双卡对称型：左右同构卡（作用/怎么发/适合）+ 中间组合条 */
export const R17: React.FC = () => {
  const card = (title: string, c: string, rows: [string, string][]) => (
    <div style={{ flex: 1, background: '#fff', borderRadius: 26, boxShadow: '0 14px 30px rgba(20,40,70,0.12)', padding: '30px 30px 24px', borderTop: `8px solid ${c}` }}>
      <div style={{ display: 'inline-block', background: c, color: '#fff', fontSize: 33, fontWeight: 900, borderRadius: 14, padding: '10px 24px' }}>{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ marginTop: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: c }}>🔸 {k}</div>
          <div style={{ marginTop: 8, fontSize: 27, color: SOFT, lineHeight: 1.55 }}>{v}</div>
        </div>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper />
      <PageBadge no={17} color={JADE} />
      <Head lines={['公开领 vs 私发，<何时用哪个>'.replace('<', '').replace('>', '')]} top={190} size={64} color={JADE} />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 400, display: 'flex', gap: 24, alignItems: 'stretch' }}>
        {card('公开领取', JADE, [['作用', '放出去谁都能领，适合门店自然客流'], ['怎么发', '分享链接 · 店内台卡 · 海报'], ['适合谁', '新店引流、活动期铺量'], ['注意', '库存设好上限 1~10000 可控']])}
        {card('私密发放', NAVY, [['作用', '点对点发给指定人，别人领不到'], ['怎么发', '按手机号定向 · 一次 1~10 张'], ['适合谁', '老客唤醒、师生当面递手机'], ['注意', '可设超时失效，收的人确认才到账']])}
      </div>
      <div style={{ position: 'absolute', left: 62, right: 62, top: 1160, background: 'linear-gradient(90deg,#E3F1E9,#E4E9FB)', borderRadius: 22, padding: '24px 30px', fontSize: 29, color: INK, lineHeight: 1.6, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 40 }}>⭐</span><span>组合打：门口<b style={{ color: JADE }}>公开领</b>攒名单 → 挑出来<b style={{ color: NAVY }}>私发</b>券包唤醒，一波流量两波用</span>
      </div>
      <ConcBar icon="💡">量用公开，<span style={{ color: JADE }}>准用私密</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-18 编号三栏行清单型：7 行（编号徽章+图标+名称/适用+右模板卡） */
export const R18: React.FC = () => {
  const rows = [
    ['新生欢迎', '体验课兑换', '🌱', JADE, '放进券包第一张，零门槛进门'],
    ['报名助推', '满减券', '🧾', NAVY, '满 800 减 80，课包决策时递一把'],
    ['日常回访', '折扣券', '🔁', GOLDT, '画材 9 折，给到店一个顺手理由'],
    ['沉睡唤醒', '限时回归', '💤', CELLAR, '60 天没来筛名单，15 天有效'],
    ['口碑放大', '老带新双发', '🤝', COPPER, '推荐人和新客各一张，先到先得'],
    ['节日借势', '随机金额', '🎉', WINE, '1~99 元随机，拆红包的劲头'],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper tint="#F6F8FB" />
      <PageBadge no={18} color={NAVY} />
      <Head lines={['6 个场景，<6 种发法>'.replace('<', '').replace('>', '')]} top={180} size={74} color={NAVY} />
      {rows.map(([a, b, e, c, d], i) => (
        <div key={a as string} style={{ position: 'absolute', left: 62, right: 62, top: 400 + i * 196, display: 'flex', alignItems: 'center', gap: 18, background: i % 2 ? 'rgba(255,255,255,0.75)' : '#fff', borderRadius: 22, padding: '24px 24px', boxShadow: '0 8px 18px rgba(20,40,70,0.07)' }}>
          <span style={{ width: 64, height: 64, borderRadius: 16, background: c as string, color: '#fff', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
          <span style={{ fontSize: 44, flexShrink: 0 }}>{e}</span>
          <div style={{ width: 236, flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: INK }}>{a}</div>
            <div style={{ marginTop: 2, fontSize: 24, color: c as string, fontWeight: 700 }}>{b}</div>
          </div>
          <div style={{ flex: 1, fontSize: 27, color: SOFT, lineHeight: 1.45, borderLeft: '2px dashed rgba(30,36,48,0.18)', paddingLeft: 22 }}>{d}</div>
        </div>
      ))}
      <ConcBar icon="⭐">场景对上了，<span style={{ color: NAVY }}>券才不会白发</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-19 多列成果卡行型：顶部 5 小卡 + 三张结论大卡 + 引语条 */
export const R19: React.FC = () => {
  const tops = [['🎯', '三选一', JADE], ['🧾', '分开记', NAVY], ['⏰', '有提醒', GOLDT], ['📨', '私下达', CELLAR], ['🔁', '能唤醒', COPPER]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper />
      <PageBadge no={19} color={DEEP} />
      <Head lines={['把发券做成<span>回头客的流水线</span>'.replace(/<\/?span[^>]*>/g, '')]} top={190} size={66} color={DEEP} />
      <div style={{ position: 'absolute', left: 62, right: 62, top: 380, display: 'flex', gap: 14 }}>
        {tops.map(([e, t, c], i) => (
          <div key={t as string} style={{ flex: 1, ...CARD, padding: '22px 8px', textAlign: 'center', borderTop: `5px solid ${c}` }}>
            <span style={{ background: DEEP, color: '#fff', borderRadius: 8, fontSize: 22, fontWeight: 800, padding: '3px 12px' }}>0{i + 1}</span>
            <div style={{ fontSize: 44, marginTop: 10 }}>{e}</div>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 34, fontWeight: 900, color: c as string, marginTop: 6 }}>{t}</div>
          </div>
        ))}
      </div>
      {/* 三结论大卡 */}
      {[
        ['📊', '每步留记录', '领取、核销按券分开记，效果不是猜的', JADE],
        ['⏰', '到期不流失', '到期前 0~30 天可设提醒，忘了也会被叫回来', NAVY],
        ['🧲', '唤醒有名单', '领了没核销的名单导得出来，二轮跟进不靠记忆', CELLAR],
      ].map(([e, t, d, c], i) => (
        <div key={t as string} style={{ position: 'absolute', left: 62, right: 62, top: 640 + i * 176, display: 'flex', alignItems: 'center', gap: 20, ...CARD, padding: '24px 28px', borderLeft: `8px solid ${c}` }}>
          <span style={{ fontSize: 52 }}>{e}</span>
          <div><div style={{ fontFamily: FONT_TITLE, fontSize: 38, fontWeight: 900, color: c as string }}>{t}</div><div style={{ marginTop: 4, fontSize: 27, color: SOFT }}>{d}</div></div>
        </div>
      ))}
      {/* 引语条 */}
      <div style={{ position: 'absolute', left: 62, right: 62, top: 1200, background: '#EEF2F8', borderRadius: 24, padding: '28px 34px', display: 'flex', gap: 18, alignItems: 'center' }}>
        <span style={{ fontSize: 52, color: DEEP }}>❝</span>
        <div style={{ fontSize: 30, color: INK, lineHeight: 1.6 }}>券发出去只是开头，<b style={{ color: DEEP }}>记录把散客变成回头客</b>❞</div>
      </div>
      <ConcBar icon="🏆">流水线的终点不是发券，是<span style={{ color: DEEP }}>知道谁还会再来</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

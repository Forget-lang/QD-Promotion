// 屏型样张 A · ref-01/02/03/04/05/06/08/09/10 拆底稿（BENCH，非交付片）
// 每个组件 = 一种可复用排版骨架，内容装券域真实干货；配色用产品 9 套真实主题轮换
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT_BODY, FONT_TITLE } from '../palette';
import { Paper, PageBadge, Head, CapTip, ConcBar, Foot, INK, SOFT, FAINT, CARD } from './BenchKit';

const RED = '#C2402A';
const YEL = '#F4C430';
const WINE = '#8B1A32';   // 主题1 尊享红
const CELLAR = '#6A2432'; // 主题2 酒窖红
const GOLDT = '#786018';  // 主题3 鎏金黄
const JADE = '#0C453D';   // 主题4 墨玉绿
const NAVY = '#212F99';   // 主题5 午夜蓝
const DEEP = '#123448';   // 主题9 深海蓝

/** ref-01 编号列表型：网格纸底 + 红色编号导语 + 黑正文 */
export const R01: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
    <Paper grid />
    <PageBadge no={1} color={WINE} />
    <div style={{ position: 'absolute', left: 80, right: 80, top: 170, fontFamily: FONT_TITLE, fontSize: 96, fontWeight: 900, color: INK }}>私发券跟进四步</div>
    <div style={{ position: 'absolute', left: 82, top: 300, width: 380, height: 10, background: YEL, borderRadius: 5, transform: 'rotate(-0.6deg)' }} />
    <div style={{ position: 'absolute', left: 82, top: 344, fontSize: 30, color: SOFT }}>一张券从发出到收口，每天只做一件事</div>
    {[
      ['私发当天', '券一对一发到家长手机，附一句课堂安排，对方确认才算送达。'],
      ['第 2 天', '没核销的先不管，上了体验课的家庭趁热聊后续班型。'],
      ['第 5 天', '还没来的，服务通知会提醒到期——提醒话术提前写好。'],
      ['到期前 1 天', '最后确认一次约课时间；过期作废，下次活动再邀约。'],
    ].map(([t, d], i) => (
      <div key={t} style={{ position: 'absolute', left: 80, right: 80, top: 430 + i * 330 }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: RED, textDecoration: 'underline', textDecorationColor: 'rgba(194,64,42,0.35)', textUnderlineOffset: 10 }}>{i + 1}. {t}</div>
        <div style={{ marginTop: 18, fontSize: 32, color: INK, lineHeight: 1.62 }}>{d}</div>
      </div>
    ))}
    <ConcBar icon="📆">日子你定，<span style={{ color: WINE }}>到期提醒系统替你盯</span></ConcBar>
    <Foot />
  </AbsoluteFill>
);

/** ref-02 手写高亮型：白卡 + 超大字 + 黄色涂药块 + 波浪线 + 话题条 */
export const R02: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY, background: '#EEF2F6' }}>
    <div style={{ position: 'absolute', left: 62, top: 120, right: 62, bottom: 200, background: '#fff', borderRadius: 44, boxShadow: '0 20px 50px rgba(20,40,70,0.14)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 56, top: 52, display: 'flex', gap: 16 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: ['#F4C430', '#D9E2EC', '#C7D3E0'][i] }} />)}
      </div>
      <div style={{ position: 'absolute', right: 56, top: 48, background: '#F1F4F8', borderRadius: 999, padding: '14px 30px', fontSize: 27, color: SOFT }}># 到店礼 # 电子券 # 实体店主</div>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 330, fontFamily: FONT_TITLE, fontWeight: 900, color: INK, lineHeight: 1.5 }}>
        <div style={{ fontSize: 110, display: 'inline-block', background: `linear-gradient(transparent 62%, ${YEL} 62% 92%, transparent 92%)`, padding: '0 8px' }}>别再印传单了</div>
        <div style={{ fontSize: 84, marginTop: 56 }}>发一张<span style={{ color: WINE }}>到店就能核销</span></div>
        <div style={{ fontSize: 84 }}>的券，谁来了<span style={{ color: WINE }}>看得见</span></div>
      </div>
      <svg width="760" height="34" viewBox="0 0 760 34" style={{ position: 'absolute', left: 78, top: 900 }}>
        <path d="M4 20 Q 60 4 120 18 T 240 18 T 360 18 T 480 18 T 600 18 T 700 18 T 756 16" stroke="#7EB6F0" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.75" />
      </svg>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 1000, display: 'flex', gap: 18 }}>
        {[['📩', '谁领了', '后台一屏看清'], ['🏪', '谁来了', '扫码即核有记录'], ['⏰', '快到期', '提醒自动发']].map(([e, t, d]) => (
          <div key={t as string} style={{ flex: 1, background: '#F7F9FC', border: '1.5px solid rgba(30,36,48,0.10)', borderRadius: 20, padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 46 }}>{e}</div>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 36, fontWeight: 900, color: INK, marginTop: 6 }}>{t}</div>
            <div style={{ fontSize: 25, color: SOFT, marginTop: 6 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 1330, fontSize: 30, color: SOFT, lineHeight: 1.7 }}>
        传单发出去就断了线；券的每一步<span style={{ color: WINE, fontWeight: 800 }}>都留痕</span>，跟进才知道找谁。
      </div>
      <div style={{ position: 'absolute', left: 70, right: 70, bottom: 90, background: '#FFF7E0', border: '2px dashed rgba(120,96,24,0.4)', borderRadius: 24, padding: '24px 30px', fontSize: 30, color: GOLDT, lineHeight: 1.6 }}>
        📌 券发出去不是本事，<b>知道谁领了、谁来了</b>才是
      </div>
    </div>
    <Foot />
  </AbsoluteFill>
);

/** ref-03 多层分区型：缎带标题 + 四列价卡 + 左清单右套餐胶囊 */
export const R03: React.FC = () => {
  const tiers = [['体验卡', '1 节 45 分钟', '9.9'], ['季卡', '12 节 · 每周 1 节', '480'], ['半年卡', '24 节 · 含画材', '920'], ['年卡', '48 节 · 优先排班', '1680']];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY, background: '#FFF9EC' }}>
      <PageBadge no={3} color={GOLDT} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 84, fontWeight: 900, color: WINE }}>美术班价目 · 示例</div>
      <div style={{ position: 'absolute', left: 300, right: 300, top: 320, height: 54, background: '#F9DCE4', borderRadius: 999, textAlign: 'center', lineHeight: '54px', fontSize: 27, color: WINE, fontWeight: 700 }}>价格仅供演示 · 商家自定</div>
      {/* 四列价卡 */}
      <div style={{ position: 'absolute', left: 62, right: 62, top: 430, display: 'flex', gap: 16 }}>
        {tiers.map(([n, d, p], i) => (
          <div key={n} style={{ ...CARD, flex: 1, padding: '22px 12px', textAlign: 'center', border: i === 3 ? `3px solid ${WINE}` : '1.5px solid rgba(139,26,50,0.15)' }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: WINE }}>{n}</div>
            <div style={{ marginTop: 10, fontSize: 21, color: FAINT, minHeight: 56, lineHeight: 1.4 }}>{d}</div>
            <div style={{ fontSize: 26, color: RED, fontWeight: 800 }}>¥<span style={{ fontSize: 52 }}>{p}</span></div>
          </div>
        ))}
      </div>
      {/* 左清单 */}
      <div style={{ position: 'absolute', left: 62, top: 830, width: 470, ...CARD, padding: '26px 30px' }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: INK }}>🎨 增值服务</div>
        {[['画材代购', '+按实结算'], ['作品展装裱', '免费'], ['缺课补约', '每期 2 次'], ['节日主题课', '持卡优先']].map(([a, b]) => (
          <div key={a} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, fontSize: 28, color: SOFT, borderBottom: '1.5px dashed rgba(30,36,48,0.12)', paddingBottom: 14 }}>
            <span>{a}</span><span style={{ color: RED, fontWeight: 700 }}>{b}</span>
          </div>
        ))}
      </div>
      {/* 右时长套餐胶囊 */}
      <div style={{ position: 'absolute', left: 556, top: 830, right: 62, ...CARD, padding: '26px 30px' }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: INK }}>⏰ 短周期尝试包</div>
        {[['4 节课', '季卡前先试试'], ['8 节课', '看到进步再续'], ['12 节课', '含 1 次户外写生']].map(([a, b]) => (
          <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 24 }}>
            <span style={{ background: '#FFEFD3', color: GOLDT, fontWeight: 800, fontSize: 28, borderRadius: 999, padding: '10px 26px' }}>{a}</span>
            <span style={{ fontSize: 26, color: SOFT }}>{b}</span>
          </div>
        ))}
      </div>
      <ConcBar icon="💝" bg="#FFF3F6" bottom={220}>领券到店的新家长，<span style={{ color: WINE }}>先体验再选档</span>——别一上来就推年卡</ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-04 撕纸卡片型：两张撕边白纸（clip-path）+ 缎带小标 */
export const R04: React.FC = () => {
  const torn: React.CSSProperties = { clipPath: 'polygon(0% 6%, 3% 0%, 9% 4%, 16% 0%, 24% 5%, 33% 1%, 42% 5%, 52% 0%, 61% 4%, 70% 0%, 79% 5%, 88% 1%, 95% 5%, 100% 0%, 100% 94%, 96% 100%, 88% 95%, 79% 100%, 70% 95%, 61% 100%, 52% 96%, 42% 100%, 33% 95%, 24% 100%, 16% 96%, 9% 100%, 3% 95%, 0% 100%)' };
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper grid tint="#EAF2FF" />
      <PageBadge no={4} color={NAVY} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 88, fontWeight: 900, color: NAVY, textShadow: '4px 4px 0 rgba(126,182,240,0.45)' }}>新生第一课<br />怎么留住人</div>
      {[
        ['📋 体验课后 24 小时', '趁记忆还热：把课堂照片和作品发给家长，附一句「下周期末展，留个位置？」——券这时候发，跟平时差别明显。'],
        ['🧲 让作品替你说', '把孩子的画装进券包封面：领取记录里能查到谁领了没来，挑三个最像会来的，再一对一发一次。'],
      ].map(([t, d], i) => (
        <div key={t as string} style={{ position: 'absolute', left: i === 0 ? 60 : 120, right: i === 0 ? 120 : 60, top: 520 + i * 660, minHeight: 360, paddingBottom: 60 }}>
          <div style={{ ...CARD, ...torn, minHeight: '100%', padding: '120px 60px 70px', position: 'relative', boxShadow: '0 16px 34px rgba(30,50,90,0.16)' }}>
            <div style={{ position: 'absolute', left: 44, top: 64, background: NAVY, color: '#fff', fontSize: 30, fontWeight: 800, padding: '12px 30px', clipPath: 'polygon(0 0,100% 0,94% 100%,0 100%)' }}>{t}</div>
            <div style={{ fontSize: 33, color: INK, lineHeight: 1.72 }}>{d}</div>
          </div>
        </div>
      ))}
      <span style={{ position: 'absolute', right: 90, top: 470, fontSize: 70 }}>📎</span>
      <span style={{ position: 'absolute', left: 110, top: 1130, fontSize: 70 }}>🖍️</span>
      <ConcBar icon="⭐">先让孩子<span style={{ color: NAVY }}>被看见</span>，再让家长<span style={{ color: NAVY }}>做决定</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-05 括号分组型：笔记本孔 + 竖排类目 + 两层结构 */
export const R05: React.FC = () => {
  const groups = [
    ['代金券', '最直接的省钱', ['门槛低，点单即用', '适合拉第一次到店', '⭑ 核销最利落']],
    ['满减券', '把客单价抬上去', ['满 800 减 80 这样设', '适合报名、大课包', '⭑ 需算好门槛']],
    ['折扣券', '不打折感的让利', ['画材 9 折，常用常领', '适合周边消费补刀', '⭑ 毛利要盯住']],
    ['兑换券', '一节体验的门', ['45 分钟课直接兑', '适合新生、回归礼', '⭑⭑⭑ 最常用']],
  ] as const;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper grid tint="#F3F6FF" />
      <PageBadge no={5} color={NAVY} />
      {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ position: 'absolute', left: 58, top: 210 + i * 180, width: 30, height: 30, borderRadius: '50%', background: NAVY, opacity: 0.85 }} />)}
      <div style={{ position: 'absolute', left: 130, top: 150, fontFamily: FONT_TITLE, fontSize: 78, fontWeight: 900, color: NAVY }}>常用四型怎么选</div>
      <div style={{ position: 'absolute', left: 132, top: 262, fontSize: 30, color: INK, background: `linear-gradient(transparent 60%, ${YEL} 60% 94%, transparent 94%)`, padding: '0 6px' }}>先想「让顾客做什么」，再挑券</div>
      {groups.map(([n, tone, rows], gi) => (
        <div key={n} style={{ position: 'absolute', left: 130, right: 70, top: 360 + gi * 340, display: 'flex', gap: 24 }}>
          <div style={{ writingMode: 'vertical-rl' as never, fontFamily: FONT_TITLE, fontSize: 40, fontWeight: 900, color: NAVY, letterSpacing: 6 }}>{n}</div>
          <div style={{ position: 'relative', flex: 1, paddingLeft: 34 }}>
            <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 22, border: '3px solid rgba(30,36,48,0.55)', borderRight: 'none', borderRadius: '16px 0 0 16px' }} />
            <div style={{ fontSize: 31, fontWeight: 800, color: INK }}>{tone}</div>
            {rows.map((r) => <div key={r as string} style={{ marginTop: 10, fontSize: 28, color: SOFT }}>{r}</div>)}
          </div>
        </div>
      ))}
      <ConcBar icon="🧭">拿不准先发<span style={{ color: NAVY }}>兑换券</span> · 另有套餐券 / 随机券，下篇拆</ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-06 大边框黑板型：粗外框 + 直角引号标题 + 黄色涂底副题 */
export const R06: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT_BODY, background: '#DFF0DC' }}>
    <PageBadge no={6} color={JADE} />
    <div style={{ position: 'absolute', left: 56, right: 56, top: 150, bottom: 160, border: `26px solid #6FA8E8`, borderRadius: 56, background: '#FFF9E8', boxShadow: 'inset 0 -30px 0 rgba(111,168,232,0.55)' }}>
      <div style={{ textAlign: 'center', paddingTop: 90 }}>
        <div style={{ fontFamily: FONT_TITLE, fontSize: 108, fontWeight: 900, color: '#5B3A1E', letterSpacing: 4 }}>「开学季」</div>
        <div style={{ fontFamily: FONT_TITLE, fontSize: 96, fontWeight: 900, color: '#5B3A1E', letterSpacing: 6, marginTop: 8 }}>老店焕新三步</div>
        <div style={{ marginTop: 30, fontSize: 34, color: JADE, letterSpacing: 8 }}>LAOJIANHUANXIN · 示例</div>
      </div>
      <div style={{ margin: '60px 90px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: YEL, borderRadius: 20, padding: '14px 44px', fontFamily: FONT_TITLE, fontSize: 56, fontWeight: 900, color: '#5B3A1E' }}>三件事做好，老客自己回门</div>
      </div>
      <div style={{ margin: '70px 110px 0', display: 'flex', flexDirection: 'column', gap: 54 }}>
        {[
          ['① 名单先捞出来：', '领过券没来的，最顺路'],
          ['② 券包三选一：', '别把选择塞回家长手里'],
          ['③ 回门有礼：', '老带新，两张券互为奖励'],
        ].map(([a, b]) => (
          <div key={a} style={{ fontSize: 42, fontWeight: 800, color: '#4A3524', lineHeight: 1.5 }}>
            <span style={{ color: '#8B1A32' }}>{a}</span>{b}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 110, right: 110, bottom: 130, background: 'rgba(244,196,48,0.28)', border: '2px solid rgba(120,96,24,0.35)', borderRadius: 18, padding: '18px 30px', fontSize: 30, fontWeight: 700, color: '#5B3A1E', textAlign: 'center' }}>
        三步是同一件事：给老客一个回门的理由
      </div>
      <span style={{ position: 'absolute', right: 60, top: 40, fontSize: 60 }}>✨</span>
      <span style={{ position: 'absolute', left: 66, bottom: 50, fontSize: 60 }}>📚</span>
    </div>
    <Foot />
  </AbsoluteFill>
);

/** ref-08 彩色药丸徽章型：两列大药丸网格（自有视频同款） */
export const R08: React.FC = () => {
  const pills = [['代金券', '#E8641A', '点单直接用 · 核销最利落'], ['套餐券', '#0E8576', '一节体验课打包成券'], ['满减券', '#3B62E4', '满 800 减 80 示例'], ['折扣券', '#A32626', '画材 9 折 · 周边消费补刀'], ['兑换券', '#7A3FC4', '到店才能兑 · 领了必有下文'], ['随机券', '#C77700', '1~99 元 · 拆红包的劲头']];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper />
      <PageBadge no={8} color={DEEP} />
      <Head lines={['<六种券型> 都支持'.replace('<', '').replace('>', ''), '一张一张说清楚']} top={200} size={70} />
      <div style={{ position: 'absolute', left: 80, top: 420, right: 80, fontSize: 30, color: SOFT }}>制券时六选一，创建后关键字段自动锁定，改券不慌</div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 510, bottom: 330, display: 'flex', flexWrap: 'wrap', gap: '78px 36px', justifyContent: 'center', alignContent: 'space-between' }}>
        {pills.map(([t, c, d]) => (
          <div key={t as string} style={{ width: 420, textAlign: 'center' }}>
            <div style={{ background: c as string, color: '#fff', fontFamily: FONT_TITLE, fontSize: 56, fontWeight: 900, letterSpacing: 4, borderRadius: 999, padding: '38px 0', transform: `rotate(${t === '套餐券' ? 1.4 : t === '折扣券' ? -1.2 : 0.7}deg)`, boxShadow: '0 12px 26px rgba(20,40,70,0.22)' }}>{t}</div>
            <div style={{ marginTop: 14, fontSize: 26, color: SOFT }}>{d}</div>
          </div>
        ))}
      </div>
      <ConcBar icon="🎫">六种都能装进<span style={{ color: DEEP }}>券包</span>，也能单独发</ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-09 四象限型：2×2 卡 + 等式题头 + 卡内微结构 */
export const R09: React.FC = () => {
  const q = [
    ['📢', '拉新 = 兑换券', ['一节体验课', '到店才能兑', '领了必有下文'], JADE],
    ['🧾', '提价 = 满减券', ['门槛抬客单', '800-80 示例', '报名场景最配'], NAVY],
    ['🔁', '回访 = 券包', ['三张挑一张', '每人限一个', '到期前有提醒'], CELLAR],
    ['🤝', '转介绍 = 双发券', ['老带新各一张', '先到先得', '可取消可追踪'], GOLDT],
  ] as const;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper />
      <PageBadge no={9} color={JADE} />
      <Head lines={['开店用券，<四个对号>入座'.replace('<', '').replace('>', '')]} top={190} size={72} color={JADE} />
      <div style={{ position: 'absolute', left: 80, top: 306, fontSize: 30, color: SOFT }}>想清目的再选券，别为发而发</div>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {q.map(([e, t, rows, c]) => (
          <div key={t as string} style={{ ...CARD, padding: '44px 36px 40px', borderTop: `6px solid ${c}` }}>
            <div style={{ fontSize: 64 }}>{e}</div>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 44, fontWeight: 900, color: c as string, marginTop: 10 }}>{t}</div>
            {rows.map((r) => <div key={r as string} style={{ marginTop: 18, fontSize: 30, color: SOFT }}>· {r}</div>)}
          </div>
        ))}
      </div>
      <ConcBar icon="🎯">对不上号的券，<span style={{ color: JADE }}>宁可不发</span></ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

/** ref-10 多栏分类网格型：3×2 类目卡，卡内【标签】+ 一行说明 */
export const R10: React.FC = () => {
  const cats = [
    ['到店', JADE, [['台卡立牌', '扫码领改为：领券后页内引导到店'], ['门贴海报', '券面直接印「凭券到店」'], ['库存上限', '1~10000 张，先到先得'], ['核销方向', '到店后由商家扫顾客的券码']]],
    ['私域', NAVY, [['一对一私发', '手机号定向 · 一次 1~10 张'], ['到店核销', '老师扫码即核，谁来了有数'], ['到期提醒', '0~30 天前服务通知送达'], ['领取超时', '私密券可设超时，五档任选']]],
    ['活动', CELLAR, [['报名满减', '节点前 7 天发最顺'], ['新生礼包', '券包三选一 · 降门槛'], ['可用时段', '按星期 + 时间段设，最多 2 段'], ['节日暖场', '随机券 1~99 元，拆红包的劲头']]],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT_BODY }}>
      <Paper tint="#F6F8FB" grid />
      <PageBadge no={10} color={CELLAR} />
      <Head lines={['一个工具，<三类用法>'.replace('<', '').replace('>', '')]} top={170} size={78} color={CELLAR} />
      <div style={{ position: 'absolute', left: 82, top: 300, fontSize: 29, color: SOFT }}>券到卡包动作清单 · 每张都有数据可查</div>
      <div style={{ position: 'absolute', left: 62, right: 62, top: 390, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
        {cats.map(([name, c, items]) => (
          <div key={name as string} style={{ background: '#fff', border: `2px solid ${c}`, borderRadius: 22, padding: '30px 22px' }}>
            <div style={{ fontFamily: FONT_TITLE, fontSize: 44, fontWeight: 900, color: c as string, borderBottom: `3px solid ${c}`, paddingBottom: 10, display: 'inline-block' }}>{name}</div>
            {(items as [string, string][]).map(([a, b]) => (
              <div key={a} style={{ marginTop: 22, background: '#F6F8FB', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: INK }}>【{a}】</div>
                <div style={{ marginTop: 6, fontSize: 25, color: SOFT, lineHeight: 1.5 }}>{b}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 62, right: 62, top: 1310, background: '#fff', borderRadius: 20, boxShadow: '0 10px 26px rgba(20,40,70,0.10)', padding: '24px 30px', fontSize: 29, color: INK, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 38 }}>📒</span><span>三条线共用一本账：<b style={{ color: CELLAR }}>领取记录 · 核销记录 · 提醒记录</b>，分开记分开查</span>
      </div>
      <ConcBar icon="💡">同一个后台，<span style={{ color: CELLAR }}>台卡 · 私域 · 活动</span>三条线都能走</ConcBar>
      <Foot />
    </AbsoluteFill>
  );
};

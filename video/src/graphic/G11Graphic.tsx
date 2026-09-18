// g11 烧烤夜宵 · 抖音图文首篇（5 图 · 3:4 · 1080×1440）
// 版式：首图＝珊瑚橙大字（与视频封面同底、文案不同构）＋ 内页＝点阵网格备忘录/清单风
// 零品牌名、零二维码；图内产品字段名逐字回 spec/coupon-fields.json（登记见 graphic/g11.ts）
// 依据：SKILL 第 7 步抖音图文线（CHANGE-20260917-019）＋ CHANGE-20260918-027
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { FONT_BODY, FONT_IMPACT, FONT_ROUND } from '../palette';
import { CoverBg, Hook, Payoff, SubLine } from '../covers/coverKit';

const INK = '#1F2937';
const INK2 = '#4B5563';
const EMBER = '#F06A24';
const GRAY = '#9CA3AF';

/** 内页底：点阵网格纸（封面背景库外的图文用纸，来自 assets A.xhs） */
const PaperBg: React.FC = () => (
  <AbsoluteFill>
    <img
      src={staticFile('xhs/BG-XHS-02-点阵网格.jpg')}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </AbsoluteFill>
);

/** 页眉：主题 ＋ 页码 */
const Head: React.FC<{ tag: string; page: string }> = ({ tag, page }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
    <div style={{ fontFamily: FONT_ROUND, fontSize: 30, color: EMBER, letterSpacing: 2 }}>{tag}</div>
    <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: GRAY }}>{page}</div>
  </div>
);

/** 大标题 */
const Title: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 56 }) => (
  <div style={{ fontFamily: FONT_IMPACT, fontSize: size, color: INK, lineHeight: 1.28, marginBottom: 34 }}>{children}</div>
);

/** 条目：左侧序号块 ＋ 标题 ＋ 说明 */
const Item: React.FC<{ no?: string; head: string; body?: string; bad?: boolean }> = ({ no, head, body, bad }) => (
  <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
    {no && (
      <div
        style={{
          flex: '0 0 58px', width: 58, height: 58, borderRadius: 14,
          background: bad ? GRAY : EMBER, color: '#fff',
          fontFamily: FONT_BODY, fontSize: 30, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {no}
      </div>
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONT_BODY, fontSize: 38, fontWeight: 700, color: bad ? GRAY : INK, lineHeight: 1.35 }}>{head}</div>
      {body && <div style={{ fontFamily: FONT_BODY, fontSize: 31, color: INK2, lineHeight: 1.55, marginTop: 8 }}>{body}</div>}
    </div>
  </div>
);

/** 页脚提示条 */
const Foot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 10, paddingTop: 24, borderTop: `3px solid ${EMBER}`, fontFamily: FONT_BODY, fontSize: 30, color: INK2, lineHeight: 1.6 }}>
    {children}
  </div>
);

/** 内页容器 */
const Page: React.FC<{ tag: string; page: string; children: React.ReactNode }> = ({ tag, page, children }) => (
  <AbsoluteFill>
    <PaperBg />
    {/* 页眉固定顶部 */}
    <div style={{ position: 'absolute', left: 78, right: 78, top: 96 }}>
      <Head tag={tag} page={page} />
    </div>
    {/* 内容垂直居中 */}
    <div
      style={{
        position: 'absolute', inset: 0, padding: '150px 78px 118px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// ════════════════ 图 1 · 首图（即封面 · 珊瑚橙大字）════════════════
export const G11Graphic1: React.FC = () => (
  <AbsoluteFill>
    <CoverBg />
    <div style={{ position: 'absolute', left: 60, right: 60, top: 420, textAlign: 'center' }}>
      <Hook size={176}>周一没人？</Hook>
      <div style={{ marginTop: 48 }}>
        <Payoff size={66}>一张手气券，5 步<br />填满周一到周四</Payoff>
      </div>
      <div style={{ marginTop: 72 }}>
        <SubLine size={44}>烧烤店 · 照着设就行</SubLine>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════ 图 2 · 先想明白（为什么打折没用）════════════════
export const G11Graphic2: React.FC = () => (
  <Page tag="烧烤店 · 周中填场" page="1 / 4">
    <Title>先想明白：问题不在味道</Title>
    <Item no="✕" bad head="打折喊群" body="客人只会把你归成“打折才值得来”的那家店，周末生意跟着遭殃。" />
    <Item no="✓" head="换个思路" body="不“给”优惠，让人“抢”——给的是机会，不是便宜。" />
    <Foot>周五翻台三轮、周一空一半。这一步想通，后面五步才成立。</Foot>
  </Page>
);

// ════════════════ 图 3 · 第一步 / 第二步 ════════════════
export const G11Graphic3: React.FC = () => (
  <Page tag="烧烤店 · 周中填场" page="2 / 4">
    <Title size={52}>第一步 · 做一张手气券</Title>
    <Item
      no="1"
      head="券种选「手气券」，面额区间填 6 元 ~ 88 元"
      body="领的人当场开奖：抢到 88 元那张觉得值得到店一趟，手气最差也够串个素菜。"
    />
    <Item no="!" head="顶格九十九，别把区间拉满" body="区间太宽，烂手气一多，玩法就砸了。" />
    <div style={{ height: 34 }} />
    <Title size={52}>第二步 · 每人限领一张</Title>
    <Item no="2" head="打开「每人限领总量」，填 1 张" body="一个人囤五张，“抢”的味道就没了。" />
  </Page>
);

// ════════════════ 图 4 · 第三步 / 第四步 ════════════════
export const G11Graphic4: React.FC = () => (
  <Page tag="烧烤店 · 周中填场" page="3 / 4">
    <Title size={52}>第三步 · 领取开始时间定在周一晚 8 点</Title>
    <Item no="3" head="打开「领取开始时间」，定周一 20:00" body="八点前，领取页挂着倒计时，谁都点不进来；八点一到，群里一声“开抢”，两百张券抢完就没。" />
    <div style={{ height: 26 }} />
    <Title size={52}>第四步 · 可用时段写死周一到周四</Title>
    <Item no="4" head="「可用时段」只勾周一到周四，17:00 – 23:00" body="时段写死，这张券周末用不了——想吃这口，只能工作日来。" />
    <Foot>周末的火没浇灭，周一到周四的炭火点上了。</Foot>
  </Page>
);

// ════════════════ 图 5 · 第五步 ＋ 收口 ════════════════
export const G11Graphic5: React.FC = () => (
  <Page tag="烧烤店 · 周中填场" page="4 / 4">
    <Title size={52}>第五步 · 剩下的系统替你跑</Title>
    <Item no="5" head="晚 8 点开抢 → 抢到手气面额 → 进卡包 → 到店出示券码 → 店员一扫就核销" body="一条线走完，你不用追任何一个客人。" />
    <div
      style={{
        marginTop: 34, padding: '34px 30px', borderRadius: 18,
        background: 'rgba(240,106,36,.10)', border: `3px solid ${EMBER}`,
        fontFamily: FONT_IMPACT, fontSize: 50, color: INK, lineHeight: 1.4, textAlign: 'center',
      }}
    >
      被抢到手的券，<br />才会被用掉
    </div>
    <Foot>有免费版，打开就能做——这个周一晚上八点，造第一波。</Foot>
  </Page>
);

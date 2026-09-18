// g11 · 烧烤夜宵 · 片1 · 数据（无声版）
// 母题：深夜黑板牌（Board）＋ 炭火虚焦深底；色彩取 SKILL §4.5 纯 Remotion 烧烤基准。
// 字段真值来源：spec/coupon-fields.json（k: = 产品真实字段名，逐字回 applet 源码；head: = 页面原生组名）
// 口播：outputs/g11-烧烤/02-口播文案.md（Legacy Baseline）；分镜：07-片1-分镜稿.md；Shot 表：08-R9视觉决策卡.md
import type { VideoData } from '../types';

export const g11: VideoData = {
  id: 'g11',
  hasAudio: false,
  style: {
    palette: 'warm-orange',
    motion: 'snappy',
    transition: 'wipe',
    hookStyle: 'contrast',
    bgImage: 'backgrounds/g11/bg.png',
    bgBlur: 3,
  },
  scenes: [
    // ── S1 · 钩子：同店两态对照 ────────────────────────────────
    {
      type: 'hook', ui: 'g11-hook', layoutKind: 'layered-stage', dur: 9,
      subtitles: [
        { text: '开烧烤店的，周五夜里翻台三轮，周一晚上一半桌子空着。', startFrame: 0, endFrame: 140 },
        { text: '串还是那个串，炉子还是那个炉子——缺的是给客人一个周一晚上出门的理由。', startFrame: 150, endFrame: 260 },
      ],
      payload: {
        title: '同一个店，两种晚上',
        leftLabel: '周五',
        leftValue: '翻台三轮',
        leftNote: '排队等位',
        rightLabel: '周一',
        rightValue: '半店空桌',
        rightNote: '炭火照点',
        subHook: '缺的不是味道，是给客人一个出门的理由',
      },
    },

    // ── S2 · 理解段：上下算账块（旧办法 / 新机制）────────────────
    {
      type: 'idea', ui: 'g11-idea', layoutKind: 'layered-stage', dur: 17,
      subtitles: [
        { text: '碰上这事，多数老板的反应是打折：群里喊一句，周一到周四便宜点。', startFrame: 0, endFrame: 170 },
        { text: '喊了等于没喊——客人只会把你归成"打折才值得来"的那家店。', startFrame: 180, endFrame: 350 },
        { text: '券这东西，随手能领就随手划走；到点才开抢、过了时段用不了，它才从一张"通知"变成一个"机会"。', startFrame: 360, endFrame: 500 },
      ],
      payload: {
        topTitle: '打折喊群',
        topRows: ['群里喊一句：周一到周四便宜点', '客人把你归成「打折才值得来」'],
        bottomTitle: '到点开抢',
        bottomRows: ['时间没到，点不到', '抢到手的，才当回事', '只有工作日晚上能用'],
        seam: '一张通知  →  一个机会',
      },
    },

    // ── S3 · 制券① 手气券（一屏标杆）────────────────────────────
    {
      type: 'fields', ui: 'g11-form-face', layoutKind: 'layered-stage', dur: 20,
      subtitles: [
        { text: '打开券到卡包，券类型选"手气券"——面额随机的券，像开奖。', startFrame: 0, endFrame: 140 },
        { text: '区间你定：六块到八十八块。', startFrame: 150, endFrame: 300 },
        { text: '顶上为什么是八十八？抢到八十八那张的人，觉得这券值得到店一趟。', startFrame: 310, endFrame: 460 },
        { text: '底下为什么是六块？手气最差那位，也够串个素菜，不寒碜。提醒一句：顶格九十九，别把区间拉满。', startFrame: 470, endFrame: 590 },
      ],
      payload: {
        head: '① 券面',
        typeLabel: '手气券',
        rows: [
          { k: '优惠券名称', v: '夜宵手气券' },
          { k: '制作数量', v: '200 张' },
          { k: '消费门槛', v: '满 68 元可用' },
        ],
        face: {
          label: '面额区间',
          note: '领取时随机，整数',
          rows: [
            { big: '6', unit: '元' },
            { big: '88', unit: '元' },
          ],
        },
        notes: ['顶格八十八：值得到店一趟', '起步六块：最差那张也不寒碜'],
        tip: '顶格 99，别把区间拉满',
      },
    },

    // ── S4 · 制券② 公开领取 + 限领一张 + 到点开抢 ────────────────
    {
      type: 'fields', ui: 'g11-form-issue', layoutKind: 'layered-stage', dur: 18,
      subtitles: [
        { text: '发放方式选"公开领取"——建了就改不了，选之前想清楚。', startFrame: 0, endFrame: 160 },
        { text: '每人限领，填一张：一个人囤五张，"抢"的味道就没了。', startFrame: 170, endFrame: 300 },
        { text: '再打开自定义领取时间，开始时间定在周一晚上八点。', startFrame: 310, endFrame: 430 },
        { text: '八点前，领取页挂着倒计时，谁都点不进来；八点一到，群里一声"开抢"，两百张券，抢完就没。', startFrame: 440, endFrame: 530 },
      ],
      payload: {
        head: '② 发放',
        rows: [
          { k: '发放方式', v: '公开领取', hero: true, note: '创建后不可修改' },
          { k: '限领总量', v: '开' },
          { k: '每人限领总量', v: '1 张' },
        ],
        group: {
          head: '公开领取设置',
          rows: [
            { k: '自定义领取时间', v: '开' },
            { k: '领取开始时间', v: '周一 20:00' },
          ],
        },
        countdown: { label: '领取开始', to: '00:03', unlock: '开抢' },
        linkageNote: '每人限领总量＝1 → 每次领取数量 / 领取周期 两行不出现（真值表 visibleWhen）',
      },
    },

    // ── S5 · 制券③ 期限与时段（时段写死）────────────────────────
    {
      type: 'fields', ui: 'g11-form-term', layoutKind: 'layered-stage', dur: 13,
      subtitles: [
        { text: '最关键的一步：可用时段，千万别选全天。', startFrame: 0, endFrame: 110 },
        { text: '定制成周一到周四，晚上五点到十一点。', startFrame: 120, endFrame: 210 },
        { text: '时段写死，这张券周末用不了——想吃这口，只能工作日来。', startFrame: 220, endFrame: 300 },
        { text: '周末的火没浇灭，周一到周四的炭火，点上了。', startFrame: 310, endFrame: 380 },
      ],
      payload: {
        head: '③ 期限',
        rows: [
          { k: '有效期类型', v: '自领取日起 N 天内有效' },
          { k: '有效期', v: '7 天' },
        ],
        band: { label: '可用时段', weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], activeCount: 4, value: '晚五点到十一点' },
        note: '周末用不了，留着高峰，先填周一至周四的空桌',
      },
    },

    // ── S6 · 顾客侧 / 核销侧接力链 ───────────────────────────────
    {
      type: 'advance', ui: 'g11-flow', layoutKind: 'layered-stage', dur: 11,
      subtitles: [
        { text: '客人那边：周一晚八点整，面额当场揭晓——八十八，进卡包，当晚就能用。', startFrame: 0, endFrame: 120 },
        { text: '到店坐下，出示券码，店员一扫，满六十八直接减。', startFrame: 130, endFrame: 250 },
        { text: '手气最差也不亏，六块钱的运气也是运气。', startFrame: 260, endFrame: 320 },
      ],
      payload: {
        phone: {
          statusBar: '我的卡包',
          couponName: '夜宵手气券',
          big: '88',
          unit: '元',
          bigLabel: '面额当场揭晓',
          rows: [
            { k: '消费门槛', v: '满 68 元可用' },
            { k: '有效期', v: '7 天' },
          ],
          codeLabel: '券码',
          code: '8823 1145',
        },
        steps: [
          { kind: 'timer', title: '到晚八点', detail: '八点之前，谁都点不进来' },
          { kind: 'coupon', title: '面额揭晓', detail: '抢到的那张，才有分量' },
          { kind: 'verify', title: '到店用掉', detail: '一桌结账，当场减掉' },
        ],
        tailNote: '手气最差也不亏，六块钱的运气也是运气',
      },
    },

    // ── S7 · 金句收口 ────────────────────────────────────────────
    {
      type: 'cta', ui: 'g11-cta', layoutKind: 'layered-stage', dur: 11,
      subtitles: [
        { text: '周末的生意靠味道，空着的桌子要自己造。', startFrame: 0, endFrame: 120 },
        { text: '被抢到手的券，才会被用掉。', startFrame: 130, endFrame: 220 },
        { text: '有免费版，打开就能做——这个周一晚上八点，造第一波。', startFrame: 230, endFrame: 320 },
      ],
      payload: {
        lines: ['周末的生意靠味道', '空着的桌子要自己造'],
        action: '有免费版，打开就能做',
      },
    },
  ],
};

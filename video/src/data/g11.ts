// g11 · 烧烤夜宵 · 片1 · 数据（无声版）
// 字段真值来源：spec/coupon-fields.json · 类型：手气券（RANDOM）
import type { VideoData } from '../types';

export const g11: VideoData = {
  id: 'g11',
  hasAudio: false,
  style: {
    palette: 'warm-orange',
    motion: 'snappy',
    transition: 'dissolve',
    hookStyle: 'question',
    bgImage: 'backgrounds/g11/bg.png',
    bgBlur: 0,
  },
  scenes: [
    // ── S1 · 钩子屏（三层舞台：炭火 + 手写菜单板/小票 + 券）──
    {
      type: 'hook',
      ui: 'g11-hook',
      layoutKind: 'layered-stage',
      dur: 12, // ~12s
      subtitles: [
        { text: '烧烤一条街都是，凭什么有的店开半年就倒、有的天天排队到马路对面？', startFrame: 20, endFrame: 200 },
        { text: '不是味道差——你家客人吃完抹嘴就走，下次再也想不起你。', startFrame: 220, endFrame: 340 },
      ],
      payload: {
        titleMain: '凭什么有的店天天排队？',
        titleHi: '天天排队',
        painLead: '留不住客，是烧烤店的死穴',
        miniPoints: [
          '客人吃完就走，下次想不起你',
          '客人下次来，又不知道去哪里吃了'
        ],
        subTitle: '不是味道差——是客人吃完抹嘴就走，下次再也想不起你',
        cardName: '夜宵手气券',
        cardMin: '3',
        cardMax: '30',
        cardTag: '手气券 · 随机金额',
        cardSlogan: '刮奖感更抓夜宵冲动',
        cardThreshold: '无门槛',
        cardValid: '3 天内有效',
        cardTime: '17:00 – 02:00',
        actionHint: '人人不落空',
      },
    },

    // ── S2 · 道理屏（三层舞台：大数字教训，弃两栏对照）──
    {
      type: 'idea',
      ui: 'g11-idea',
      layoutKind: 'layered-stage',
      dur: 18, // ~18s
      subtitles: [
        { text: '老板们最常干的三件事：打折、送啤酒、充两百送一百。', startFrame: 10, endFrame: 180 },
        { text: '有用吗？没用——客人一看就知道你要套路他。', startFrame: 190, endFrame: 340 },
        { text: '真正能留人的，是让他觉得自己在你这儿"有点东西没花完"。', startFrame: 350, endFrame: 540 },
      ],
      payload: {
        title: '老办法没用，真正能留人的是这个',
        wrongItems: [
          '打折促销',
          '送啤酒饮料',
          '充值办卡',
        ],
        rightItems: [
          '让他觉得"有点东西没花完"',
          '损失厌恶比便宜更抓人心',
        ],
        conclusion: '一张快过期的券，比十句"欢迎再来"都管用',
      },
    },

    // ── S3 · 证明屏（三层舞台：手机核销 + 新券生成）──
    {
      type: 'fields',
      ui: 'g11-proof',
      layoutKind: 'layered-stage',
      dur: 20, // ~20s
      subtitles: [
        { text: '真正能把人留住的，是把"核销"变成下一单的开始。', startFrame: 10, endFrame: 150 },
        { text: '客人吃完，拿出手机一扫，券核销成功。', startFrame: 160, endFrame: 280 },
        { text: '手机里自动又生出一张一模一样的券，领取当日起，三天内有效。', startFrame: 290, endFrame: 460 },
        { text: '客人手机里永远躺着一张你家的券。', startFrame: 470, endFrame: 590 },
      ],
      payload: {
        bigNumber: '3',
        bigUnit: '天 有效',
        subTitle: '核销一张、送一张——永远有一张你家的券',
        caseSource: '到店核销后可再得本券一张',
      },
    },

    // ── S4 · 落地屏 1（三层舞台：手气券大数字逐项）──
    {
      type: 'fields',
      ui: 'g11-basic',
      layoutKind: 'layered-stage',
      dur: 22, // ~22s
      subtitles: [
        { text: '用券到卡包做这套玩法，其实就三张牌。', startFrame: 10, endFrame: 150 },
        { text: '第一张，手气券——就是金额随机的券，像刮奖一样。', startFrame: 160, endFrame: 300 },
        { text: '金额三块到三十块随机，这个区间正好。', startFrame: 310, endFrame: 430 },
        { text: '有效期三天，可用时段晚五点到凌晨两点。', startFrame: 440, endFrame: 560 },
        { text: '发放方式选公开领取——桌角贴个码，坐下扫一下就领。', startFrame: 570, endFrame: 660 },
      ],
      payload: {
        tag: '第一张牌',
        title: '手气券怎么设',
        fields: [
          { label: '金额区间', value: '3 元 ~ 30 元' },
          { label: '消费门槛', value: '0（无门槛）' },
          { label: '有效期', value: '领取当日起 3 天' },
          { label: '可用时段', value: '17:00 – 02:00' },
          { label: '发放方式', value: '公开领取（桌码即领）' },
        ],
        tip: '手气券 = 刮奖感，比固定金额的满减券更抓夜宵的冲动消费',
      },
    },

    // ── S5 · 落地屏 2（三层舞台：两台手机锁客裂变）──
    {
      type: 'mechanism',
      ui: 'g11-mechanism',
      layoutKind: 'layered-stage',
      dur: 20, // ~20s
      subtitles: [
        { text: '第二张牌更狠——核销后赠券，一开，核销完自动再得一张。', startFrame: 10, endFrame: 220 },
        { text: '第三张牌，转赠奖励——朋友核销了，你也得一张奖励券。', startFrame: 230, endFrame: 440 },
        { text: '奖励用兑换券，比如"招牌烤串一把"——实打实的东西，当然愿意转。', startFrame: 450, endFrame: 580 },
      ],
      payload: {
        tag: '第二张 + 第三张牌',
        title: '锁客 + 裂变，一次打通',
        steps: [
          { num: '1', text: '老客到店核销手气券', icon: '🍢' },
          { num: '2', text: '核销后自动再得一张新手气券', icon: '🎁' },
          { num: '3', text: '把券转给朋友一起吃', icon: '📤' },
          { num: '4', text: '朋友到店核销使用', icon: '👥' },
          { num: '5', text: '老客自动得奖励券 · 招牌烤串一把', icon: '🏆', highlight: true },
        ],
      },
    },

    // ── S6 · 金句屏（三层舞台：金句大字）──
    {
      type: 'cta',
      ui: 'g11-cta',
      layoutKind: 'layered-stage',
      dur: 8, // ~8s
      subtitles: [
        { text: '烧烤店拼的不是谁烤得香——是谁家客人吃完了，', startFrame: 20, endFrame: 150 },
        { text: '手机里还躺着一张你家的券。', startFrame: 160, endFrame: 230 },
      ],
      payload: {
        sentence: '烧烤店拼的不是谁烤得香——是谁家客人吃完了，手机里还躺着一张你家的券',
        highlight: '手机里还躺着一张你家的券',
      },
    },
  ],
};

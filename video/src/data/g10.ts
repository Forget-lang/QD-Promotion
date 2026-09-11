// g10 · 美容沙龙 · 老带新裂变 · 视频数据（第 1 批：入口三屏 钩子/讲道理/制券①）
// style：berry-purple + 粉晕光弧底 + slide 转场 + contrast 钩子 + bouncy 动效（整套反 g09，见 03-母题一页.md）
// 每屏 ui 必填、指向 videos/g10/index.tsx 注册组件；k: 字段名逐字回 create.vue；数值为示例。
import type { VideoData } from '../types';

export const g10: VideoData = {
  id: 'g10',
  hasAudio: false,
  style: {
    palette: 'berry-purple',
    motion: 'bouncy',
    transition: 'slide',
    hookStyle: 'contrast',
    bgImage: 'backgrounds/g10/bg.png',
    bgBlur: 0,
  },
  scenes: [
    {
      type: 'hook',
      ui: 'g10-hook',
      layoutKind: 'hero-focus',
      dur: 9,
      payload: {
        eyebrow: '券到卡包 · 美业沙龙',
        sampleTag: '数值为示例',
        titleA: '客人夸上天，',
        titleB: '不带闺蜜来？',
        titleBHi: '不带闺蜜',
        sub: '不是她不帮你，是你手里没一张能让她顺手转给闺蜜的券。',
        cardName: '闺蜜护理体验券',
        cardTag: '可转赠',
        buttonLabel: '转赠给好友',
        pains: [
          { t: '口头约了，到店对不上', s: '朋友来了没凭证，两边都尴尬' },
          { t: '没好处，第二次不开口', s: '介绍全凭人情，撑不了多久' },
          { t: '公开刷屏，老客尴尬', s: '她只想私下发给闺蜜' },
        ],
      },
    },
    {
      type: 'idea',
      ui: 'g10-idea',
      layoutKind: 'two-column',
      dur: 14,
      payload: {
        eyebrow: '券到卡包 · 美业沙龙',
        sampleTag: '数值为示例',
        title: '为什么她不开口？',
        left: { head: '群里甩来的券', lines: [
          { t: '白给的东西，谁都不稀罕', s: '领完就丢进卡包吃灰' },
          { t: '当废纸扔进卡包', s: '领完就忘，占着名额' },
          { t: '发一圈没人领', s: '越群发越掉价' },
          { t: '像在推销', s: '老客反而不想转' },
        ] },
        right: { head: '亲手转赠', lines: [
          { t: '她送的是人情', s: '亲手递出去的才有分量' },
          { t: '闺蜜觉得占了便宜', s: '熟人体验，两头体面' },
          { t: '带人还有奖励券', s: '闺蜜核销后自动到账' },
          { t: '下次还愿意开口', s: '有来有往才长久' },
        ] },
        leftVerdict: '结果：没有第二次',
        rightVerdict: '结果：两头都体面',
        bottom: '给她一个带人、自己也划算的理由。',
      },
    },
    {
      type: 'fields',
      ui: 'g10-make-basic',
      layoutKind: 'hero-object',
      dur: 18,
      payload: {
        eyebrow: '券到卡包 · 美业沙龙',
        sampleTag: '数值为示例',
        couponType: '兑换券',
        ribbon: '护理体验 · 邀请卡',
        cardName: '闺蜜护理体验券',
        fields: [
          { k: '兑换内容', v: '深层清洁护理', hero: true },
          { k: '发放方式', v: '私密发放' },
          { k: '每人限领总量', v: '1 张' },
          { k: '有效期', v: '15 天' },
        ],
        noticeK: '使用须知',
        noticeLines: ['· 深层清洁 + 肩颈放松', '· 约 60 分钟 · 需提前预约', '· 每位闺蜜首享一次'],
        notes: [
          { t: '兑换内容 · 只有 10 个字', b: '装不下服务明细，明细写进使用须知，这是兑换券最容易讲错的一条。', hi: '明细写进使用须知' },
          { t: '发放方式 · 先发给老客', b: '私密发放一对一给到老客，她才能转赠给闺蜜；此项创建后改不了。', hi: '她才能转赠给闺蜜' },
          { t: '有效期 · 给个期限', b: '设 15 天，逼老客及时转赠、闺蜜及时到店，券不睡死。', hi: '券不睡死' },
        ],
        caution: '这套玩法天生要两张券：这张体验券当转赠物，还得另做一张私密券当奖励。下一屏讲转赠怎么开。',
      },
    },
  ],
};

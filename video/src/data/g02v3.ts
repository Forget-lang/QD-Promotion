// G02v3 - 茶饮咖啡 · 老带新转赠奖励（ink-green 风格）
// 玩法：P-05 老带新转赠奖励
// 字幕：口播全文按语义断句分行，起止帧为均匀分布占位（有声版按 TTS 实测精修）
import type { VideoData } from '../types';

export const g02v3: VideoData = {
  id: 'G02-TeaCoffee-V3',
  style: {
    palette: 'ink-green',
    motion: 'snappy',
    typography: 'friendly',
    transition: 'slide',
    hookStyle: 'number',
    bgImage: 'backgrounds/g02v3/bg.jpg',
    bgBlur: 4,  // 毛玻璃微虚化：轻微模糊，保留光影层次
  },
  scenes: [
    // S1 钩子：老客的秘密
    {
      type: 'hook',
      dur: 12.0,
      voiceOffset: 0,
      voiceDur: 11.7,
      title: '50% 新客，老客带来的',
      sub: '一杯咖啡换一个精准新客',
      hookNumber: '50%',
      hookUnit: '',
      subtitles: [
        { text: '你知道吗？', startFrame: 0, endFrame: 45 },
        { text: '咖啡店的新客，', startFrame: 30, endFrame: 90 },
        { text: '有一半是老客带进来的。', startFrame: 75, endFrame: 180 },
        { text: '但怎么让老客愿意带朋友来呢？', startFrame: 165, endFrame: 350 },
      ],
    },
    // S2 痛点：拉新怎么这么难
    {
      type: 'pain',
      dur: 16.0,
      voiceOffset: 0,
      voiceDur: 15.8,
      title: '拉新怎么这么难',
      leftTitle: '传统引流',
      leftItems: [
        '发传单，没人看',
        '投广告，转化低',
        '打价格战，留不住',
      ],
      rightTitle: '结果',
      rightSub: '钱花了，人没来',
      subtitles: [
        { text: '发传单吧，没人看；', startFrame: 0, endFrame: 80 },
        { text: '投抖音吧，点击贵、转化低；', startFrame: 65, endFrame: 170 },
        { text: '打折促销吧，', startFrame: 155, endFrame: 220 },
        { text: '吸引来的都是薅羊毛的，薅完就走。', startFrame: 205, endFrame: 340 },
        { text: '其实最便宜、最有效的拉新方式，', startFrame: 320, endFrame: 430 },
        { text: '一直就在你身边——老客的口碑。', startFrame: 410, endFrame: 474 },
      ],
    },
    // S3 方案：一杯带一杯
    {
      type: 'solution',
      dur: 13.0,
      voiceOffset: 0,
      voiceDur: 12.7,
      title: '一杯带一杯',
      sub: '老客自然帮你拉新客',
      items: [
        { icon: 'gift', color: '#1a4d3e', title: '分享券', desc: '老客转赠朋友' },
        { icon: 'users', color: '#2d6a4f', title: '朋友核销', desc: '新客到店消费' },
        { icon: 'bolt', color: '#40916c', title: '自动返券', desc: '老客再得一杯' },
      ],
      subtitles: [
        { text: '今天教你一招：一杯带一杯。', startFrame: 0, endFrame: 100 },
        { text: '用「券到卡包」做一张分享券，', startFrame: 80, endFrame: 180 },
        { text: '老客领了转赠给朋友，', startFrame: 160, endFrame: 240 },
        { text: '朋友到店核销了，', startFrame: 220, endFrame: 300 },
        { text: '老客自动再得一张免费咖啡券。', startFrame: 280, endFrame: 380 },
        { text: '就这么简单。', startFrame: 360, endFrame: 381 },
      ],
    },
    // S4 流程：三步搞定
    {
      type: 'flow',
      dur: 12.0,
      voiceOffset: 0,
      voiceDur: 11.7,
      title: '三步搞定',
      sub: '全程全自动，不用你管',
      nodes: [
        { icon: 'gift', color: '#1a4d3e', title: '做分享券' },
        { icon: 'search', color: '#2d6a4f', title: '贴二维码' },
        { icon: 'users', color: '#40916c', title: '自动返券' },
      ],
      footnote: '朋友核销 → 系统自动发奖励券',
      subtitles: [
        { text: '三步就能设置好：', startFrame: 0, endFrame: 70 },
        { text: '第一步，做一张分享券，设好转赠奖励；', startFrame: 55, endFrame: 150 },
        { text: '第二步，打印个二维码贴店里，老客扫码就能领；', startFrame: 135, endFrame: 240 },
        { text: '第三步，朋友到店核销，', startFrame: 220, endFrame: 300 },
        { text: '系统自动给老客发奖励券。', startFrame: 280, endFrame: 340 },
        { text: '全程不用你管，全自动。', startFrame: 320, endFrame: 351 },
      ],
    },
    // S5 为什么好使：三个理由
    {
      type: 'grid',
      dur: 16.0,
      voiceOffset: 0,
      voiceDur: 15.8,
      title: '为什么这个方法好使',
      cards: [
        { icon: 'users', color: '#1a4d3e', title: '信任度高', desc: '朋友推荐比硬广转化率高好几倍' },
        { icon: 'cash', color: '#2d6a4f', title: '成本极低', desc: '一杯咖啡换一个精准新客' },
        { icon: 'bolt', color: '#40916c', title: '提升复购', desc: '老客得券再来，一举两得' },
      ],
      subtitles: [
        { text: '为什么这个方法好使？', startFrame: 0, endFrame: 70 },
        { text: '第一，朋友推荐的信任度高，', startFrame: 55, endFrame: 150 },
        { text: '比硬广转化率高好几倍；', startFrame: 130, endFrame: 210 },
        { text: '第二，一杯咖啡换一个新客，', startFrame: 190, endFrame: 280 },
        { text: '获客成本低到离谱；', startFrame: 260, endFrame: 340 },
        { text: '第三，老客得了免费券，', startFrame: 320, endFrame: 400 },
        { text: '自己也会再来，相当于还提升了复购。', startFrame: 380, endFrame: 474 },
      ],
    },
    // S6 进阶玩法：次卡锁客
    {
      type: 'transfer',
      dur: 13.0,
      voiceOffset: 0,
      voiceDur: 12.7,
      title: '进阶玩法',
      transferFrom: '1杯',
      transferTo: '10杯',
      subtitles: [
        { text: '进阶玩法：搭配次卡效果更好。', startFrame: 0, endFrame: 100 },
        { text: '朋友第一次来喝了觉得不错，', startFrame: 80, endFrame: 180 },
        { text: '直接推十杯次卡锁客，', startFrame: 160, endFrame: 260 },
        { text: '一个新客变成十次到店，', startFrame: 240, endFrame: 330 },
        { text: '一杯咖啡的获客成本，', startFrame: 310, endFrame: 380 },
        { text: '摊到十次里几乎可以忽略。', startFrame: 360, endFrame: 381 },
      ],
    },
    // S7 数据说话
    {
      type: 'panel',
      dur: 11.0,
      voiceOffset: 0,
      voiceDur: 10.7,
      title: '效果好不好，数据说话',
      metrics: [
        { icon: 'gift', color: '#1a4d3e', title: '发出量', dir: '↑', desc: '发了多少张券一目了然' },
        { icon: 'users', color: '#2d6a4f', title: '核销率', dir: '↑', desc: '实际到店转化看得见' },
        { icon: 'bolt', color: '#40916c', title: '转赠带客', dir: '↑', desc: '老客带来多少新客' },
      ],
      subtitles: [
        { text: '效果好不好，数据说话。', startFrame: 0, endFrame: 80 },
        { text: '发了多少张、核销了多少、', startFrame: 60, endFrame: 160 },
        { text: '转赠带来多少新客，', startFrame: 140, endFrame: 230 },
        { text: '后台清清楚楚，', startFrame: 210, endFrame: 290 },
        { text: '每一分钱花在哪都看得见。', startFrame: 270, endFrame: 321 },
      ],
    },
    // S8 CTA
    {
      type: 'cta',
      dur: 6.0,
      voiceOffset: 0.3,
      voiceDur: 3.0,
      title: '老客带新客',
      sub: '一杯换一杯',
      subtitles: [
        { text: '券到卡包，', startFrame: 9, endFrame: 60 },
        { text: '老客带新客，一杯换一杯。', startFrame: 45, endFrame: 90 },
      ],
    },
  ],
};

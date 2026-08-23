// G03 火锅店 · 下午茶折扣券填闲时 + 核销奖励锁复购（2026-08-22 有声版 v2）
// 玩法：P-03 闲时填空档（主）+ P-07 满减提客单/核销奖励（辅）
// 风格五维：warm-orange + buttery + impact + dissolve + question（与 G02 全不同）
// 场景序列：hook → timeline → solution → flow → grid → solution → panel → cta
// 背景图：BG-ABS-001 暖奶油卡片底（素材索引表 A 级，直接显示 blur=0）
//
// ✅ 有声版 v2 字幕修正（2026-08-22）：
//   1. 字幕 = 口播全文（修复 S2/S3/S5/S6 漏字，不做摘要）
//   2. 每行 = 语义短句（标点断句，一行不塞两个分句，修复 S3 时间轴不同步）
//   3. 时间轴 = 行字数占比 × 语音实测帧数（短句粒度误差 ±0.3s 内）
import type { VideoData } from '../types';

export const g03: VideoData = {
  id: 'G03-Hotpot-IdleTime',
  style: {
    palette: 'warm-orange',
    motion: 'buttery',
    typography: 'impact',
    transition: 'dissolve',
    hookStyle: 'question',
    bgImage: 'backgrounds/g03/bg.jpg',
    bgBlur: 0,
  },
  hasAudio: true,
  scenes: [
    // ── S1 钩子：反常识提问（语音 10.22s → dur 10.3）──
    {
      type: 'hook',
      darkText: true,
      dur: 10.3,
      voiceOffset: 0,
      voiceDur: 10.22,
      title: '下午三点，火锅店坐满了人',
      sub: '你信吗？',
      subtitles: [
        { text: '下午三点的火锅店，坐满了人', startFrame: 0, endFrame: 80 },
        { text: '你信吗？反正我以前不信', startFrame: 80, endFrame: 153 },
        { text: '后来发现，人家只是把', startFrame: 153, endFrame: 220 },
        { text: '下午两点的座位，提前卖了出去', startFrame: 220, endFrame: 307 },
      ],
    },

    // ── S2 痛点：下午客流塌陷（语音 18.01s → dur 18.1）──
    {
      type: 'timeline',
      dur: 18.1,
      voiceOffset: 0,
      voiceDur: 18.01,
      title: '下午客流，塌了',
      timelineMode: 'problem',
      timelinePoints: [
        { hour: 9, traffic: 20 },
        { hour: 11, traffic: 45 },
        { hour: 12, traffic: 50 },
        { hour: 13, traffic: 30 },
        { hour: 14, traffic: 12 },
        { hour: 15, traffic: 8 },
        { hour: 16, traffic: 10 },
        { hour: 17, traffic: 28 },
        { hour: 18, traffic: 70 },
        { hour: 19, traffic: 95 },
        { hour: 20, traffic: 85 },
        { hour: 21, traffic: 60 },
        { hour: 22, traffic: 40 },
      ],
      timelineHighlight: { startHour: 14, endHour: 17, label: '空店时段' },
      subtitles: [
        { text: '火锅店老板都懂：晚市忙得脚不沾地', startFrame: 0, endFrame: 107 },
        { text: '下午却闲得发慌，房租按天付', startFrame: 107, endFrame: 192 },
        { text: '锅底烧热了没人来，翻台率为零', startFrame: 192, endFrame: 291 },
        { text: '员工闲着刷手机，门口连个路过的都没有', startFrame: 291, endFrame: 419 },
        { text: '下午没客人，是火锅店看不见的隐形亏损', startFrame: 419, endFrame: 540 },
      ],
    },

    // ── S3 方案：下午茶折扣券（语音 15.82s → dur 15.9）──
    {
      type: 'solution',
      darkText: true,
      dur: 15.9,
      voiceOffset: 0,
      voiceDur: 15.82,
      title: '一张券，填满下午',
      layout: 'vertical',
      items: [
        { icon: 'clock', color: '#FF7043', title: '只在下午有效', desc: '下午两点到五点，错峰不排队' },
        { icon: 'cash', color: '#FF7043', title: '顾客得了实惠', desc: '下午吃火锅，比晚市便宜' },
        { icon: 'check', color: '#FF7043', title: '不伤晚市价格', desc: '券只限下午，晚市照常' },
      ],
      subtitles: [
        { text: '怎么把下午填满？不是全场打折', startFrame: 0, endFrame: 94 },
        { text: '拉一帮贪便宜的人来', startFrame: 94, endFrame: 159 },
        { text: '而是做一张下午茶折扣券', startFrame: 159, endFrame: 238 },
        { text: '只在下午两点到五点有效', startFrame: 238, endFrame: 317 },
        { text: '想吃火锅的人，下午来，更划算', startFrame: 317, endFrame: 411 },
        { text: '你也不用动晚市的价', startFrame: 411, endFrame: 475 },
      ],
    },

    // ── S4 流程：三步设置（语音 18.42s → dur 18.5）──
    {
      type: 'flow',
      darkText: true,
      dur: 18.5,
      voiceOffset: 0,
      voiceDur: 18.42,
      title: '三步设置',
      nodes: [
        { icon: 'clock', color: '#FF7043', title: '选时段', sub: '下午两点到五点，避开正餐高峰' },
        { icon: 'bolt', color: '#FF7043', title: '设折扣', sub: '八折七折，想给多少你定' },
        { icon: 'check', color: '#FF7043', title: '定时开抢', sub: '下午一点准时放券' },
      ],
      subtitles: [
        { text: '设置只要三步', startFrame: 0, endFrame: 49 },
        { text: '第一步，选时段：下午两点到五点', startFrame: 49, endFrame: 155 },
        { text: '避开正餐高峰', startFrame: 155, endFrame: 204 },
        { text: '第二步，设折扣：八折七折', startFrame: 204, endFrame: 293 },
        { text: '想给多少你定', startFrame: 293, endFrame: 342 },
        { text: '第三步，定时开抢：下午一点准时放券', startFrame: 342, endFrame: 464 },
        { text: '顾客抢到了，下午自然就来', startFrame: 464, endFrame: 553 },
      ],
    },

    // ── S5 为什么好使（语音 18.46s → dur 18.5）──
    {
      type: 'grid',
      darkText: true,
      dur: 18.5,
      voiceOffset: 0,
      voiceDur: 18.46,
      title: '为什么这招好使',
      cards: [
        { icon: 'cash', color: '#FF7043', title: '顾客得了实惠', desc: '下午吃火锅便宜，错峰不用排队' },
        { icon: 'users', color: '#FF7043', title: '你填了闲时', desc: '空座位变成钱，房租照样付' },
        { icon: 'check', color: '#FF7043', title: '晚市不受影响', desc: '券只在下午有效，晚市价格照常' },
      ],
      subtitles: [
        { text: '这招好使，是因为三件事同时发生', startFrame: 0, endFrame: 95 },
        { text: '顾客得了实惠：下午吃火锅便宜', startFrame: 95, endFrame: 183 },
        { text: '错峰也不用排队', startFrame: 183, endFrame: 230 },
        { text: '你填了闲时：空着的座位变成钱', startFrame: 230, endFrame: 318 },
        { text: '房租照样付，但多了一波客人', startFrame: 318, endFrame: 399 },
        { text: '晚市不受影响：券只在下午有效', startFrame: 399, endFrame: 487 },
        { text: '晚市该多少钱就多少钱', startFrame: 487, endFrame: 554 },
      ],
    },

    // ── S6 进阶：核销奖励锁复购（语音 11.03s → dur 11.1）──
    {
      type: 'solution',
      darkText: true,
      cardVariant: 'numbered',
      dur: 11.1,
      voiceOffset: 0,
      voiceDur: 11.03,
      title: '吃完这次，还惦记下次',
      layout: 'vertical',
      items: [
        { icon: 'gift', color: '#FF7043', title: '核销自动送券', desc: '顾客下午核销，系统自动再送一张' },
        { icon: 'clock', color: '#FF7043', title: '下周还能用', desc: '回头客，就是这么来的' },
      ],
      subtitles: [
        { text: '再送你一招：核销奖励', startFrame: 0, endFrame: 57 },
        { text: '顾客下午核销了这张券', startFrame: 57, endFrame: 121 },
        { text: '系统自动再送一张，下周还能用', startFrame: 121, endFrame: 210 },
        { text: '吃完这次，还惦记下次', startFrame: 210, endFrame: 274 },
        { text: '回头客，就是这么来的', startFrame: 274, endFrame: 331 },
      ],
    },

    // ── S7 数据：后台可见（语音 10.22s → dur 11.1）──
    {
      type: 'panel',
      darkText: true,
      dur: 11.1,
      voiceOffset: 0,
      voiceDur: 10.22,
      title: '效果好不好，数据说话',
      footnote: '每一分钱花在哪，都清清楚楚',
      metrics: [
        { icon: 'gift', color: '#FF7043', title: '发出量', dir: '↑', desc: '发了多少张一目了然' },
        { icon: 'check', color: '#FF7043', title: '核销率', dir: '↑', desc: '实际到店转化看得见' },
        { icon: 'users', color: '#FF7043', title: '渠道排行', dir: '↑', desc: '哪个渠道带来最多客人' },
      ],
      subtitles: [
        { text: '效果怎么样，数据说了算', startFrame: 0, endFrame: 66 },
        { text: '发了多少张、核销了多少张', startFrame: 66, endFrame: 132 },
        { text: '哪个渠道带来的客人最多', startFrame: 132, endFrame: 198 },
        { text: '后台都看得见', startFrame: 198, endFrame: 234 },
        { text: '每一分钱花在哪，都清清楚楚', startFrame: 234, endFrame: 307 },
      ],
    },

    // ── S8 CTA：品牌收尾（语音 7.43s → dur 9.0）──
    {
      type: 'cta',
      darkText: true,
      dur: 9.0,
      voiceOffset: 0.5,
      voiceDur: 7.43,
      title: '券到卡包',
      sub: '把火锅店闲时变成钱的电子券工具',
      subtitles: [
        { text: '券到卡包——把火锅店闲时', startFrame: 15, endFrame: 89 },
        { text: '变成钱的电子券工具', startFrame: 89, endFrame: 150 },
        { text: '老板，下午的座位', startFrame: 150, endFrame: 204 },
        { text: '别让它空着', startFrame: 204, endFrame: 238 },
      ],
    },
  ],
};

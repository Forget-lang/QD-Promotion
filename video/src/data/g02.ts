// G02 茶饮咖啡 2.0 · 储值替代 + 老带新裂变（2026-08-20 v1）
// 场景策略：精品独立咖啡馆 · 次卡替代储值 + 兑换券转赠奖励
// 风格五维：caramel + buttery + impact + wipe + contrast
// 内容深度：6 个信息单元（钩子/痛点深挖/核心思路/具体步骤/适用判断/进阶延伸）
//
// ⚠️ J-cut 转场交叉同步法：
//   - dur = ceilTo01(audioDuration) + extraHold
//   - voiceOffset = 0（画面一出来就说话），CTA 屏除外 0.5s
//   - extraHold：信息屏 0s / 数据屏 0.8s / CTA 屏 1.5s
//   - 转场 0.4s 内：上屏音频尾音淡出，下屏音频首字完整
//
// v1 说明：
//   - voiceDur 待 TTS 生成后用 ffprobe 回填（当前为文字量预估值）
//   - S7 panel 扩展支持 vertical 布局 + 数字滚动
import type { VideoData } from '../types';
import { ACCENT_GREEN, ACCENT_RED } from '../palette';

export const g02: VideoData = {
  id: 'G02-TeaCoffee-V2',
  style: {
    palette: 'caramel',
    motion: 'buttery',
    typography: 'impact',
    transition: 'wipe',
    hookStyle: 'contrast',
    bgImage: 'backgrounds/g02/g02-bg-coffee.jpg',
  },
  scenes: [
    // ── S1 钩子：左右对比（14.3s）──
    // 语音 14.22s → ceilTo01=14.3 + 留余 0 = 14.3s
    {
      type: 'hook',
      dur: 14.3,
      voiceOffset: 0,
      voiceDur: 14.216,
      title: '别再让顾客充卡了',
      leftTitle: '充卡',
      rightTitle: '次卡',
      sub: '换个思路，锁客反而更牢',
      subtitles: [{ text: '别再让顾客充卡了，换个思路锁客更牢', startFrame: 0, endFrame: 428 }],
    },

    // ── S2 痛点：充卡的两难（19.9s）──
    // 语音 19.81s → ceilTo01=19.9 + 留余 0 = 19.9s
    // 用 solution vertical 模拟"两难"痛点结构：两张红色系卡片
    {
      type: 'solution',
      dur: 19.9,
      voiceOffset: 0,
      voiceDur: 19.807,
      title: '充卡的两难',
      layout: 'vertical',
      items: [
        {
          icon: 'x',
          color: ACCENT_RED,
          title: '推不动——顾客抵触',
          desc: '充一次几百块，怕跑路、觉得掉价，精品店顾客尤其不吃这一套',
        },
        {
          icon: 'x',
          color: ACCENT_RED,
          title: '不推又不行——老客流失',
          desc: '新店越开越多，新鲜感一过就跑，生意好一天坏一天没个准谱',
        },
      ],
      subtitles: [{ text: '充卡的两难：推不动，又不能不推', startFrame: 0, endFrame: 596 }],
    },

    // ── S3 方案：十杯次卡（21.1s）──
    // 语音 21.01s → ceilTo01=21.1 + 留余 0 = 21.1s
    {
      type: 'solution',
      dur: 21.1,
      voiceOffset: 0,
      voiceDur: 21.015,
      title: '试试十杯次卡',
      layout: 'vertical',
      items: [
        {
          icon: 'cup',
          color: ACCENT_GREEN,
          title: '锁住十次到店',
          desc: '预付十杯咖啡，用完之前都是你的回头客',
        },
        {
          icon: 'clock',
          color: ACCENT_GREEN,
          title: '节奏刚刚好',
          desc: '每天可用一次，想喝就来，不卡太紧',
        },
        {
          icon: 'gift',
          color: ACCENT_GREEN,
          title: '没推销感',
          desc: '也就两三百块，顾客没什么心理负担',
        },
      ],
      subtitles: [{ text: '十杯次卡，一样锁客，顾客没压力', startFrame: 0, endFrame: 632 }],
    },

    // ── S4 流程：三步操作（20.7s）──
    // 语音 20.65s → ceilTo01=20.7 + 留余 0 = 20.7s
    {
      type: 'flow',
      dur: 20.7,
      voiceOffset: 0,
      voiceDur: 20.652,
      title: '三步做好一张次卡',
      nodes: [
        { icon: 'bolt',  color: ACCENT_GREEN,  title: '创建次卡' },
        { icon: 'gift',  color: ACCENT_GREEN,  title: '私密发放' },
        { icon: 'check', color: ACCENT_GREEN,  title: '扫码核销' },
      ],
      footnote: '每天可用一次，咖啡一天一杯刚刚好',
      subtitles: [{ text: '三步搞定：创建、发券、扫码核销', startFrame: 0, endFrame: 620 }],
    },

    // ── S5 判断：你的店适合做次卡吗（21.9s）──
    // 语音 21.88s → ceilTo01=21.9 + 留余 0 = 21.9s
    // 用 solution vertical 模拟判断清单：2✓ + 1✗
    {
      type: 'solution',
      dur: 21.9,
      voiceOffset: 0,
      voiceDur: 21.876,
      title: '你的店适合做次卡吗',
      layout: 'vertical',
      items: [
        {
          icon: 'check',
          color: ACCENT_GREEN,
          title: '有稳定老客的店',
          desc: '开了一段时间，有一批常来的熟客',
        },
        {
          icon: 'check',
          color: ACCENT_GREEN,
          title: '客单价稳定的品类',
          desc: '咖啡、奶茶、洗车，每次消费差不多',
        },
        {
          icon: 'x',
          color: ACCENT_RED,
          title: '纯一次性生意不建议',
          desc: '客单价波动大、顾客只来一次的，别做',
        },
      ],
      subtitles: [{ text: '两个半标准，对号入座看看适不适合', startFrame: 0, endFrame: 656 }],
    },

    // ── S6 进阶：转赠裂变（17.7s）──
    // 语音 17.62s → ceilTo01=17.7 + 留余 0 = 17.7s
    {
      type: 'flow',
      dur: 17.7,
      voiceOffset: 0,
      voiceDur: 17.624,
      title: '进阶玩法：转赠裂变',
      nodes: [
        { icon: 'cup',    color: ACCENT_GREEN,  title: '老客有券' },
        { icon: 'gift',   color: ACCENT_GREEN,  title: '转赠朋友' },
        { icon: 'check',  color: ACCENT_GREEN,  title: '到店核销' },
        { icon: 'users',  color: ACCENT_GREEN,  title: '再得一张' },
      ],
      footnote: '老客带新客，一杯变三杯，自然就发生了',
      subtitles: [{ text: '进阶玩法：转赠裂变，老客自然带新客', startFrame: 0, endFrame: 530 }],
    },

    // ── S7 数据：滚动数字（10.1s）──
    // 语音 9.21s → ceilTo01=9.3 + 留余 0.8 = 10.1s
    // panel vertical 布局 + StatCounter 数字滚动
    {
      type: 'panel',
      dur: 10.1,
      voiceOffset: 0,
      voiceDur: 9.206,
      title: '数据清清楚楚',
      layout: 'vertical',
      metrics: [
        { icon: 'gift',  color: ACCENT_GREEN,  title: '已发放', dir: '↑', desc: '张' },
        { icon: 'check', color: ACCENT_GREEN,  title: '已核销', dir: '↑', desc: '次' },
        { icon: 'users', color: ACCENT_GREEN,  title: '转赠人数', dir: '↑', desc: '人' },
      ],
      subtitles: [{ text: '发了多少、用了多少，后台都看得见', startFrame: 0, endFrame: 302 }],
    },

    // ── S8 CTA：品牌收尾（7.3s）──
    // 语音 7.19s → ceilTo01=7.2 + 留余 1.5 = 8.7s
    {
      type: 'cta',
      dur: 8.7,
      voiceOffset: 0.5,
      voiceDur: 7.186,
      title: '券到卡包',
      sub: '精品咖啡店的电子券工具',
      subtitles: [{ text: '券到卡包 · 精品咖啡店的电子券工具', startFrame: 15, endFrame: 260 }],
    },
  ],
};

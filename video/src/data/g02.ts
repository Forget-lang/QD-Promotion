// G02 茶饮咖啡 · 早鸟次卡（2026-08-19 v4 J-cut 终极同步版）
// 场景策略：早鸟次卡 — 把上午的空位变成钱
// 风格：warm-orange + snappy + slide + friendly + question
// 内容深度：2 个核心功能（次卡 + 核销奖励）
//
// ⚠️ v4 节奏设计（J-cut 转场交叉同步法 · 确定性方案）
// ─────────────────────────────────────────
// 音频预处理：
//   仅 loudnorm 响度归一化到 -16 LUFS，零裁剪、零淡入
//   → 第一个字 100% 完整，最后一个字 100% 完整
//
// 时间轴公式：
//   dur = ceilTo01(audioDuration) + extraHold
//   （voiceOffset = 0，画面一出来就说话）
//   （ceilTo01 确保 dur ≥ 音频时长，音频绝不被截断）
//
//   extraHold（说完后画面停留）：
//     信息屏：0s → 说完立刻转场，绝不空等
//     数据屏：0.8s → 给观众时间读数字
//     CTA 屏（最后一屏）：1.5s → 品牌记忆停留
//
// J-cut 同步原理：
//   转场 0.4s 内：
//     上屏音频：最后 0.4s 线性淡出（1 → 0）
//     下屏音频：从转场第 0 帧开始就是满音量（零淡入）
//     画面：上屏渐出 ↔ 下屏渐入
//   效果：上句尾音渐弱，下句首字完整清晰
//   → 无缝衔接，无爆音，首字不丢
//
// 最后一屏（S7）特殊处理：
//   视频最后 0.4s 淡出到零，自然收尾
//
// 为什么这是确定的（不需要反复试）：
//   1. TTS 同一模型同一参数，语速稳定（±2% 以内）
//   2. ffprobe 毫秒级精确测量时长
//   3. Remotion 帧级渲染，淡入淡出是精确数学曲线
//   4. 所有 dur 从 audioDuration 直接推导，无经验调参
//   → TTS 只生成一次，后面全是零成本的文件处理和代码渲染
import type { VideoData } from '../types';
import { ACCENT_ORANGE, ACCENT_GREEN, ACCENT_CYAN, ACCENT_RED } from '../palette';

export const g02: VideoData = {
  id: 'G02-TeaCoffee',
  style: {
    palette: 'warm-orange',
    motion: 'snappy',
    typography: 'friendly',
    transition: 'slide',
    hookStyle: 'question',
    bgImage: 'backgrounds/g02/bg.jpg',
  },
  scenes: [
    // ── S1 钩子：问号型（5.1s）──
    // 语音 5.01s → ceilTo01=5.1 + 留余 0 = 5.1s
    {
      type: 'hook',
      dur: 5.1,
      voiceOffset: 0,
      title: '上午空着也是空着？',
      sub: '咖啡店的空位，其实都是钱',
      subtitle: '上午空着也是空着？',
    },

    // ── S2 痛点对比：打折 VS 锁客（10.3s）──
    // 语音 10.21s → ceilTo01=10.3 + 留余 0 = 10.3s
    {
      type: 'pain',
      dur: 10.3,
      voiceOffset: 0,
      title: '打折，是在给老客发补贴',
      leftTitle: '靠打折拉人',
      leftItems: [
        '越打利润越薄',
        '老客等折扣才来',
        '新客冲便宜不留存',
      ],
      rightTitle: '让客人自己想回来',
      rightSub: '关键不是便宜，是来几次',
      subtitle: '打折是给老客发补贴，关键是让客人想回来',
    },

    // ── S3 解法：早鸟次卡三特性（10.3s）──
    // 语音 10.22s → ceilTo01=10.3 + 留余 0 = 10.3s
    {
      type: 'solution',
      dur: 10.3,
      voiceOffset: 0,
      title: '一张早鸟次卡，把客人留下来',
      items: [
        {
          icon: 'cup',
          color: ACCENT_ORANGE,
          title: '十次预付',
          desc: '买了十杯的钱，自然会常来',
        },
        {
          icon: 'clock',
          color: ACCENT_CYAN,
          title: '早鸟福利',
          desc: '十点前核销，送一份小食',
        },
        {
          icon: 'users',
          color: ACCENT_GREEN,
          title: '填空档期',
          desc: '上午的座位不再空着',
        },
      ],
      subtitle: '一张早鸟次卡，让客人主动回来',
    },

    // ── S4 转赠流程：四节点（7.5s）──
    // 语音 7.42s → ceilTo01=7.5 + 留余 0 = 7.5s
    {
      type: 'flow',
      dur: 7.5,
      voiceOffset: 0,
      title: '老客带新客，就这么自然',
      nodes: [
        { icon: 'cup',    color: ACCENT_ORANGE, title: '领次卡' },
        { icon: 'gift',   color: ACCENT_ORANGE, title: '转赠朋友' },
        { icon: 'check',  color: ACCENT_CYAN,   title: '到店核销' },
        { icon: 'users',  color: ACCENT_GREEN,  title: '新客进店' },
      ],
      subtitle: '转赠给朋友，老客自然带新客',
    },

    // ── S5 券种搭配：2×2 网格（8.8s）──
    // 语音 8.76s → ceilTo01=8.8 + 留余 0 = 8.8s
    {
      type: 'grid',
      dur: 8.8,
      voiceOffset: 0,
      title: '券种搭配，客流自然来',
      cards: [
        { icon: 'bolt',    color: ACCENT_ORANGE, title: '早鸟次卡',   desc: '核心锁客，十次预付' },
        { icon: 'gift',    color: ACCENT_GREEN,  title: '核销奖励',   desc: '用完自动发买一送一' },
        { icon: 'clock',   color: ACCENT_CYAN,   title: '闲时折扣',   desc: '下午两点到四点八折' },
        { icon: 'arrow',   color: ACCENT_ORANGE, title: '循环锁客',   desc: '用完续卡，来了还来' },
      ],
      subtitle: '多种券搭配着用，客流自然就来了',
    },

    // ── S6 效果面板：三指标（7.1s）──
    // 语音 6.20s → ceilTo01=6.3 + 留余 0.8 = 7.1s
    // 数据屏留余稍长，给观众时间读数字
    {
      type: 'panel',
      dur: 7.1,
      voiceOffset: 0,
      title: '改变正在发生',
      metrics: [
        { icon: 'users', color: ACCENT_GREEN,  title: '回头客', dir: '↑', desc: '次卡锁住老客' },
        { icon: 'clock', color: ACCENT_CYAN,   title: '空桌时段', dir: '↓', desc: '闲时被填上' },
        { icon: 'cash',  color: ACCENT_ORANGE, title: '复购率', dir: '↑', desc: '来的次数变多' },
      ],
      subtitle: '回头客变多，空桌变少，复购率上来了',
    },

    // ── S7 CTA：品牌收尾（5.9s）──
    // 语音 4.38s → ceilTo01=4.4 + 留余 1.5 = 5.9s
    // 最后一屏：品牌先停留，最后 0.4s 淡出收尾
    {
      type: 'cta',
      dur: 5.9,
      voiceOffset: 0,
      title: '券到卡包',
      sub: '再小的门店也可以制作电子券',
      subtitle: '再小的门店，也能做电子券',
    },
  ],
};

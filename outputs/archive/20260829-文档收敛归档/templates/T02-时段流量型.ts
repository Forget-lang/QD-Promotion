// T02 时段流量型 —— 提炼自 G03 火锅店（下午茶折扣券填闲时，已交付）
// 适用：痛点是"某时段/某场景客流塌陷"的玩法（P-03 闲时填空档等），时间轴可视化痛点是核心差异屏
import type { VideoTemplate } from './types';

export const T02: VideoTemplate = {
  id: 'T02',
  name: '时段流量型',
  source: 'G03 火锅店 · 下午茶折扣券填闲时',
  applicable: '时段/流量类痛点：闲时填空档、高峰分流等，痛点可用客流曲线可视化的场景',
  stylePreset: {
    motion: 'buttery',
    typography: 'impact',
    transition: 'dissolve',
    hookStyle: 'question',
  },
  bgRequirement: '暖浅底（G03 用 BG-ABS-001 暖奶油卡片底，blur=0，全片 darkText: true）',
  voiceBudget: '660-900 字（对应 120-150s @atempo 1.2）',
  scenes: [
    { role: 'hook', type: 'hook', variant: 'question', technique: '反常识提问',
      fill: ['反常识场景问句（如"下午三点火锅店坐满人，你信吗"）'], durRange: [10, 12] },
    { role: 'pain', type: 'timeline', variant: 'problem 模式 + 空档高亮', technique: '客流曲线可视化',
      fill: ['全天客流点位（按小时）', '空店高亮时段 + 标签'], durRange: [16, 19] },
    { role: 'solution', type: 'solution', variant: 'vertical',
      fill: ['方案三点：时段限定 / 顾客实惠 / 不伤正价'], durRange: [14, 17] },
    { role: 'steps', type: 'flow',
      fill: ['设置步骤 3 个（每步带 sub 补充说明）'], durRange: [17, 19] },
    { role: 'proof', type: 'grid',
      fill: ['为什么好使 3 条（顾客/商家/价格三方共赢结构）'], durRange: [17, 19] },
    { role: 'advance', type: 'solution', variant: 'numbered',
      fill: ['锁复购机制 2-3 条（核销自动送券类）'], durRange: [10, 12] },
    { role: 'data', type: 'panel',
      fill: ['统计项 3 个（仅 R1 真实统计维度，禁编造）'], durRange: [10, 12] },
    { role: 'cta', type: 'cta',
      fill: ['口号', '行业定位句（把 X 变成钱）'], durRange: [8, 10] },
  ],
};

// T01 机制讲解型 —— 提炼自 G02 茶饮咖啡（老带新转赠奖励，已交付）
// 适用：需要讲清"机制为什么好使"的玩法（P-01 券锁复购 / P-05 老带新等）
import type { VideoTemplate } from './types';

export const T01: VideoTemplate = {
  id: 'T01',
  name: '机制讲解型',
  source: 'G02 茶饮咖啡 · 老带新转赠奖励',
  applicable: '机制类玩法：核心卖点是"机制怎么运转、为什么好使"，无强产品物件焦点',
  stylePreset: {
    motion: 'snappy',
    typography: 'friendly',
    transition: 'slide',
    hookStyle: 'number',
  },
  bgRequirement: '深底（G02 用墨绿深底 + bgBlur 4 微虚化）；若选浅底必须全片 darkText: true 并 still 验证前景对比度',
  voiceBudget: '660-900 字（对应 120-150s @atempo 1.2）',
  scenes: [
    { role: 'hook', type: 'hook', variant: 'number', technique: '数字焦点',
      fill: ['数字断言（必须真实可述）', '机制一句话承诺'], durRange: [10, 13] },
    { role: 'pain', type: 'pain', variant: '左右对照（传统做法 vs 结果）',
      fill: ['传统做法痛点 3 条', '结果一句话总结'], durRange: [14, 17] },
    { role: 'solution', type: 'solution', variant: '纵向三卡', technique: '纵向通栏三卡',
      fill: ['机制三步：icon + 名称 + 一句话描述'], durRange: [12, 16] },
    { role: 'steps', type: 'flow',
      fill: ['操作节点 3 个', 'footnote：自动化结果说明'], durRange: [12, 14] },
    { role: 'proof', type: 'grid',
      fill: ['为什么好使 3 条：标题 + 描述'], durRange: [15, 17] },
    { role: 'advance', type: 'transfer', variant: '小到大递进',
      fill: ['递进起点 / 终点（如 1杯 → 10杯）'], durRange: [12, 14] },
    { role: 'data', type: 'panel',
      fill: ['统计项 3 个（仅 R1 真实统计维度，禁编造）'], durRange: [10, 12] },
    { role: 'cta', type: 'cta',
      fill: ['口号主标题', '定位副标题'], durRange: [6, 9] },
  ],
};

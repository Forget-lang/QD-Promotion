// T03 产品卡面型 —— 提炼自 G04 美容院（次卡私发，已交付 v2）
// 适用：玩法围绕具体产品物件（次卡/券包），卡面屏是视觉焦点，操作步骤用括号分组抄作业
import type { VideoTemplate } from './types';

export const T03: VideoTemplate = {
  id: 'T03',
  name: '产品卡面型',
  source: 'G04 美容院 · 次卡私发',
  applicable: '产品物件类玩法：次卡/券包等卡面可当视觉焦点，操作话术可"抄作业"的场景',
  stylePreset: {
    motion: 'snappy',
    typography: 'friendly',
    transition: 'slide',
    hookStyle: 'contrast',
  },
  bgRequirement: '粉紫浅底（G04 用 BG-ABS-003 粉雾网格底，blur=0，全片 darkText: true）；卡面主题色从 applet theme.js 9 色按行业选',
  voiceBudget: '660-900 字（对应 120-150s @atempo 1.2）',
  scenes: [
    { role: 'hook', type: 'hook', variant: 'contrast', technique: '左右对照词',
      fill: ['对照两词（如 卖卡 vs 送卡）', '顾客心理一句话'], durRange: [10, 13] },
    { role: 'pain', type: 'pain', variant: 'numbered-list + 副行', technique: '编号列表 + 后果副行',
      fill: ['痛点 3 条 + 每条后果/为什么副行'], durRange: [13, 15] },
    { role: 'solution', type: 'cardface', technique: '产品真实 UI 重绘（applet m-card-magnetic-face）',
      fill: ['卡面全参数：卡名/类型/次数/有效期/字段/使用说明（全部 R1 真实，禁编造）', '卡面主题色（applet 9 色按行业）'], durRange: [16, 19] },
    { role: 'steps', type: 'bracket-group', technique: 'ref-05 括号分组',
      fill: ['步骤 3 组：标签 + 明细（重点行高亮，含可直接抄的话术）'], durRange: [15, 17] },
    { role: 'proof', type: 'grid',
      fill: ['为什么好使 3 条'], durRange: [14, 17] },
    { role: 'advance', type: 'transfer',
      fill: ['进阶玩法递进（转赠带新客类）'], durRange: [12, 14] },
    { role: 'data', type: 'panel',
      fill: ['统计项 3 个（仅 R1 真实统计维度，禁编造）'], durRange: [10, 12] },
    { role: 'cta', type: 'cta',
      fill: ['口号', '定位'], durRange: [6, 9] },
  ],
};

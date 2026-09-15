// g11 烧烤夜宵 · 专属屏 payload 类型
// 约定：k: = 产品真实字段名（check-ui-truth 硬检逐字命中源码）；head: = 组标题；其余键 = 本片文案。

export interface HookPayload {
  titleMain: string;     // 主标题大字
  titleHi: string;       // 主标题里染强调色的子串
  subTitle: string;      // 副标题/认知缺口副钩
  painLead: string;      // 痛点引言（首字抓 2 秒钩子）
  miniPoints?: string[]; // 痛点小票条（可读信息）
  cardName: string;      // 手气券卡的券名
  cardMin: string;       // 随机最小金额（产品字段：随机最小金额）
  cardMax: string;       // 随机最大金额（产品字段：随机最大金额）
  cardTag: string;       // 券卡标签（手气券·随机金额）
  cardSlogan: string;    // 券卡点题语（为什么随手气券）
  cardThreshold: string; // 消费门槛（产品字段：消费门槛）
  cardValid: string;     // 有效期提示（值）
  cardTime: string;      // 可用时段
  actionHint: string;    // 引导动作补充
}

export interface IdeaPayload {
  title: string;
  wrongItems: string[];  // 老办法·打叉项
  rightItems: string[];  // 真锁客·打勾项
  conclusion: string;    // 底部结论条
}

export interface ProofPayload {
  bigNumber: string;     // 大数字
  bigUnit: string;       // 单位
  subTitle: string;      // 副标题说明
  caseSource: string;    // 案例来源
}

export interface FieldPair {
  label: string;  // 字段名
  value: string;  // 字段值
}

export interface FieldsPayload {
  tag: string;      // 牌数标签
  title: string;    // 标题
  fields: FieldPair[];  // 字段列表
  tip: string;      // 底部 tip
}

export interface MechanismStep {
  num: string;       // 序号
  text: string;      // 步骤文字
  icon?: string;     // 可选图标 emoji
  highlight?: boolean; // 是否高亮
}

export interface MechanismPayload {
  tag: string;
  title: string;
  steps: MechanismStep[];
}

export interface CtaPayload {
  sentence: string;   // 金句整句
  highlight: string;  // 高亮部分
}

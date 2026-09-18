// g11 抖音图文首篇 · 数据（图内上屏字段名逐字登记）
// 依据：SKILL 第 7 步「抖音图文线」（CHANGE-20260917-019）＋ CHANGE-20260918-027（交付结构定稿）
// 口径：图内产品字段名必须**逐字**取自 spec/*-fields.json 并回 applet 源码取证；数值只能来自 spec 真值。
// ⚠️ 机检接入（把本文件扫入 check-ui-truth）属"改检查器"，按用户边界待点头后执行（027 §三.4）。

export const g11Graphic = {
  id: 'g11-graphic',
  kind: '抖音图文',
  ratio: '3:4',
  size: { w: 1080, h: 1440 },
  /** 5 图：首图即封面 */
  images: [
    { n: 1, role: 'cover', title: '周一没人？', k: [] as string[] },
    { n: 2, role: 'body', title: '先想明白：问题不在味道', k: [] as string[] },
    {
      n: 3,
      role: 'body',
      title: '第一步 · 做一张手气券 ／ 第二步 · 每人限领一张',
      k: ['手气券', '每人限领总量'],
    },
    {
      n: 4,
      role: 'body',
      title: '第三步 · 领取开始时间定在周一晚 8 点 ／ 第四步 · 可用时段写死周一到周四',
      k: ['领取开始时间', '可用时段'],
    },
    { n: 5, role: 'body', title: '第五步 · 剩下的系统替你跑', k: ['券码'] },
  ],
  /** 逐字取证对照：字段名 → 真源 → 源码位置 */
  evidence: [
    { k: '手气券', from: 'spec/coupon-fields.json', src: '券种选项（applet create.vue）' },
    { k: '每人限领总量', from: 'spec/coupon-fields.json', src: 'create.vue:246' },
    { k: '领取开始时间', from: 'spec/coupon-fields.json', src: 'create.vue:275' },
    { k: '可用时段', from: 'spec/coupon-fields.json', src: 'create.vue:185' },
    { k: '券码', from: 'applet 源码（非 spec 表内条目）', src: 'verify/verify.vue:6、discard/list.vue:6 等 13 个文件' },
  ],
  /** 示例值（来自 spec 真值，非字段名） */
  sampleValues: [
    { label: '面额区间', value: '6 元 ~ 88 元', note: '产品取值边界 1~99 整数（facts.constraints）' },
    { label: '领取开始时间', value: '周一 20:00' },
    { label: '可用时段', value: '周一到周四 17:00 – 23:00' },
  ],
} as const;

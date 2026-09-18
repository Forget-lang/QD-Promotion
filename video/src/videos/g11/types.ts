// g11 烧烤夜宵 · 专属屏 payload 类型
// 约定：k: = 产品真实字段名（check-ui-truth ①/③ 硬检逐字命中源码）；v: = 画面值；
//       head: = 页面原生组名（③ 层校验归属）；①②③ 起头的是我方自述分步标题（不参与原生组判定）。
// 母题：深夜黑板牌（Board）＋ 粉笔字；本片专属——不被跨片 import，也不 import 他片。

/** 制券屏通用字段行 */
export interface FormRow {
  k: string;
  v?: string;
  /** 大数字强调（如面额区间 6 / 88），逐个大数字起拍 */
  bigs?: string[];
  note?: string;
  hero?: boolean;
}

export interface HookPayload {
  title: string;
  leftLabel: string;
  leftValue: string;
  leftNote: string;
  rightLabel: string;
  rightValue: string;
  rightNote: string;
  subHook: string;
}

export interface IdeaPayload {
  topTitle: string;
  topRows: string[];
  bottomTitle: string;
  bottomRows: string[];
  seam: string;
}

/** S3 · 券面（含面额区间 hero 块）
 *  ⚠️ face.rows 的 k: 是**必填的产品字段名**——⑥ 层要求声明 couponType 后必须带该券种 faceFields；
 *  而真值表登记这两行 onScreen:false（行名不上屏）→ 数据层登记、**画面只渲染 big/unit**。 */
export interface FormFacePayload {
  head: string;
  couponType: string;
  rows: FormRow[];
  face: { label: string; note: string; rows: { k: string; big: string; unit: string }[] };
  notes: string[];
  tip?: string;
}

/** S4 · 发放（含原生组与倒计时） */
export interface FormIssuePayload {
  head: string;
  rows: FormRow[];
  group: { head: string; rows: FormRow[] };
  countdown: { label: string; to: string; unlock: string };
  linkageNote?: string;
}

/** S5 · 期限与时段（含时段带） */
export interface FormTermPayload {
  head: string;
  rows: FormRow[];
  band: { label: string; weekdays: string[]; activeCount: number; value: string };
  note?: string;
}

export interface FlowPayload {
  steps: { kind: 'timer' | 'coupon' | 'verify'; title: string; value?: string; note?: string }[];
  tailNote: string;
}

export interface CtaPayload {
  lines: string[];
  action: string;
}

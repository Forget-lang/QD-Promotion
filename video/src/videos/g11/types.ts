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
 *  ⚠️ 本屏**不声明 couponType、不登记面额行名**：真值表登记面额两行为 onScreen:false（行名不上屏），
 *  而 ⑥ 层「声明券种 → 必带面额字段」与红线层「data 内禁极限词字面」在此交汇冲突（2026-09-18 实测）。
 *  故券种只作**展示值** typeLabel 上屏；面额区间只渲染 big/unit。见分镜稿 §备注与待拍板项。 */
export interface FormFacePayload {
  head: string;
  typeLabel: string;
  rows: FormRow[];
  face: { label: string; note: string; rows: { big: string; unit: string }[] };
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

/** S6 · 顾客侧：手机卡包屏 + 右侧三拍
 *  ⚠️ phone.rows 的 k: 为**产品字段名**（须逐字回源码取证）；券码只出**数字**，不出任何二维码/图形码（三平台禁小程序码及微信系二维码）。 */
export interface FlowPayload {
  phone: {
    /** 屏内标题（源码取证：pages.json「我的卡包」） */
    statusBar: string;
    couponName: string;
    big: string;
    unit: string;
    bigLabel: string;
    rows: FormRow[];
    codeLabel: string;
    code: string;
  };
  steps: { kind: 'timer' | 'coupon' | 'verify'; title: string; detail: string }[];
  tailNote: string;
}

export interface CtaPayload {
  lines: string[];
  action: string;
}

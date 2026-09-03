// g07 咖啡茶饮 · 片1 · 本片 payload 形状（通用 Scene 只留分发字段，业务数据全在这里）
// 组件在本目录 index.tsx，专属件不跨行业 import。

export interface InfoBar { label: string; result: string }

export interface HookPayload {
  tag: string;
  title1: string;
  title2: string;      // 含关键词（会被圈出）
  accent: string;      // 关键词
  sub: string;
  ticketName: string;  // 底部小票示意
  ticketBadge: string;
  ticketLine: string;
}

export interface PainQuote { t1: string; t2: string }

export interface PainPayload {
  tag: string;
  title1: string;
  title2: string;
  accent: string;
  ticketName: string;
  ticketBadge: string;
  ticketTitle: string;
  ticketLines: string[];
  quotes: PainQuote[];
}

/** 一行制券表单：k = 制券页真字段名，v = 咖啡场景示例值，hint = 产品自己的规则提示 */
export interface FormRow {
  k: string;
  v: string;
  hint?: string;
  hero?: boolean;      // 本片核心决策行（消费门槛）：整行点亮
  tag?: string;        // hero 行的小标签（如「分水岭」）
  kind?: 'input' | 'select' | 'switch';
  on?: boolean;
}
export interface FormGroup { head: string; rows: FormRow[] }

export interface MakePayload {
  tag: string;
  navTitle: string;
  couponType?: string;   // 声明券种（如「满减券」），供 check-ui-truth ⑥ 校验面额字段配对
  crumb: string;
  groups: FormGroup[];
  callout?: { l1: string; l2: string; tag: string };
}

/** S5 发放方式选择屏：公开领取（选中）vs 私密发放（另一套，不展开） */
export interface IssuePayload {
  tag: string;
  title: string;
  sub: string;
  pickHead: string;
  pickDesc: string;
  pickPoints: string[];
  otherHead: string;
  otherDesc: string;
  result: string;
}

export interface MechPayload {
  tag: string;
  title1: string;
  title2: string;
  accent: string;
  sub: string;
  leftHead: string;
  leftItems: string[];
  leftNote: string;
  rightHead: string;
  rightItems: string[];
  rightNote: string;
  punch: string;
}

export interface ChainNode { head: string; desc: string; note?: string; reward?: boolean }
export interface ChainPayload {
  tag: string;
  title: string;
  sub: string;
  nodes: ChainNode[];
}

export interface StepRow { act: string; desc: string; res: string; mark: string }
export interface StepsPayload {
  tag: string;
  title: string;
  sub: string;
  rows: StepRow[];
}

export interface LedgerCol { head: string; tone: 'accent' | 'brown'; items: string[] }
export interface LedgerPayload {
  tag: string;
  title: string;
  sub: string;
  cols: LedgerCol[];
  punch: string;
}

export interface CtaPayload {
  title1: string;
  title2: string;
  strips: { name: string; role: string }[];
  brand: string;
  sub: string;
}

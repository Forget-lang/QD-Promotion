// g06 教培托管 · 本片 payload 形状（通用 Scene 只留分发字段，业务数据全在这里）
// 组件在本目录 index.tsx，专属件不跨行业 import。

export interface InfoBar { label: string; result: string }

export interface HookPayload {
  tag: string;
  title1: string;
  title2: string;
  sub: string;
  bars: InfoBar[];
}

export interface PainQuote { t1: string; t2: string }

export interface PainPayload {
  tag: string;
  title1: string;
  title2: string;
  accent: string;
  flyName: string;
  flyBadge: string;
  flyTitle: string;
  flyLines: string[];
  quotes: PainQuote[];
  foot: string;
}

export interface ReasonCard { title: string; sub: string; icon: 'stamp' | 'clock' | 'bell' }

export interface IdeaPayload {
  eyebrow: string;
  title1: string;
  title2: string;
  reasons: ReasonCard[];
  next: string;
  punch: string;
}

/** 一行制券表单：k = 券到卡包制券页上的真实字段名，v = 本行业示例值，hint = 产品自己的规则提示 */
export interface FormRow {
  k: string;
  v: string;
  hint?: string;
  kind?: 'input' | 'select' | 'switch';
  on?: boolean;
}

export interface FormGroup { head: string; rows: FormRow[] }

/** S4 / S5「在券到卡包里制作一张兑换券」两屏共用形状 */
export interface MakePayload {
  tag: string;
  navTitle: string;
  crumb: string;
  groups: FormGroup[];
  foot: string;
  submit?: string;
}

export interface StepRow { act: string; desc: string; res: string; mark: string }

export interface StepsPayload {
  tag: string;
  title: string;
  sub: string;
  rows: StepRow[];
}

export interface VsSide {
  head: string;
  tone: 'dim' | 'win';
  items: string[];
}

export interface ComparePayload {
  tag: string;
  title1: string;
  title2: string;
  left: VsSide;
  right: VsSide;
  bar: string;
}

export interface ChainNode { head: string; desc: string; note?: string; reward?: boolean }

export interface ChainPayload {
  tag: string;
  title: string;
  sub: string;
  nodes: ChainNode[];
  foot: string;
}

export interface LedgerCol { head: string; tone: 'accent' | 'caramel'; items: string[] }

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

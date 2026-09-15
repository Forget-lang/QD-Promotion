// g10 美容沙龙 · 专属屏 payload 类型（形状由本片定义，通用 Scene 只留分发/时长字段）
// 约定：k: = 产品真实字段名（check-ui-truth 硬检逐字命中源码）；head: = 组标题；其余键 = 本片文案。

export interface HookPayload {
  titleA: string;      // 钩子第一行
  titleB: string;      // 钩子第二行（含强调词）
  titleBHi: string;    // titleB 里染成强调色的子串
  sub: string;         // 认知缺口副钩
  cardName: string;    // 手机里券卡的券名（值，非字段名）
  cardTag: string;     // 券卡上的真实标签（可转赠）
  validHint: string;   // 券卡上的有效期提示（值）
  buttonLabel: string; // 真实界面按钮文案（转赠给好友）
}

export interface IdeaPayload {
  title: string;
  left: { head: string; lines: { t: string; s: string }[] };
  right: { head: string; lines: { t: string; s: string }[] };
  leftVerdict: string;
  rightVerdict: string;
  bottom: string;
}

export interface FieldKV {
  k: string;           // 产品字段名（硬检）
  v: string;
  hero?: boolean;
}

export interface MakeBasicPayload {
  couponType: '兑换券'; // ⑥ 券种↔面额配对声明（本屏用了面额字段「兑换内容」）
  ribbon: string;
  cardName: string;
  fields: FieldKV[];
  noticeK: string;     // 使用须知字段名（硬检）
  noticeLines: string[];
  notes: { t: string; b: string; hi: string }[]; // 引线标注（hi=句中强调子串）
  caution: string;
}

export interface GiftRow {
  k: string;        // 产品字段名（硬检：允许转赠/开启转赠奖励/转赠奖励券）
  switchOn?: boolean; // 开关行：true 渲染开关药丸（ON）
  v?: string;       // 选择行：渲染值 chip
  note?: string;    // 行下小注（tip 原文）
}

export interface MakeGiftPayload {
  title: string;
  rows: GiftRow[];
  mechTitle: string;
  mechNodes: { t: string; s: string; hi?: boolean }[]; // 机制图节点（体验券→闺蜜→奖励券）
  mechArrows: string[]; // 节点间箭头标注（转赠/核销）
  timingNote: string;   // 奖励到账时机（挂在奖励节点下）
}

export interface FlowNodeData {
  t1: string;   // 节点主语（老客/转赠/闺蜜/到店/奖励券）
  t2: string;   // 节点动作（领到券/给好友/领进卡包/核销/自动到账）
  note: string; // 节点一行注
  hi?: boolean; // 末节点高亮
}

export interface FlowPayload {
  title: string;
  nodes: FlowNodeData[];
}

export interface CtaLine {
  text: string;
  hi?: string; // 句中强调子串
}

export interface CtaPayload {
  lines: CtaLine[];
  cardRibbon: string;
  cardName: string;
  cardTag: string;
  validHint: string;
}

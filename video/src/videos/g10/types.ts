// g10 美容沙龙 · 专属屏 payload 类型（形状由本片定义，通用 Scene 只留分发/时长字段）
// 约定：k: = 产品真实字段名（check-ui-truth 硬检逐字命中源码）；head: = 组标题；其余键 = 本片文案。

export interface HookPayload {
  eyebrow: string;
  sampleTag: string;
  titleA: string;      // 钩子第一行
  titleB: string;      // 钩子第二行（含强调词）
  titleBHi: string;    // titleB 里染成强调色的子串
  sub: string;         // 认知缺口副钩
  cardName: string;    // 手机里券卡的券名（值，非字段名）
  cardTag: string;     // 券卡上的真实标签（可转赠）
  buttonLabel: string; // 真实界面按钮文案（转赠给好友）
  pains: { t: string; s: string }[]; // 底部三张痛点卡（借官网三痛点结构）
}

export interface IdeaPayload {
  eyebrow: string;
  sampleTag: string;
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
  eyebrow: string;
  sampleTag: string;
  couponType: '兑换券'; // ⑥ 券种↔面额配对声明（本屏用了面额字段「兑换内容」）
  ribbon: string;
  cardName: string;
  fields: FieldKV[];
  noticeK: string;     // 使用须知字段名（硬检）
  noticeLines: string[];
  notes: { t: string; b: string; hi: string }[]; // 引线标注（hi=句中强调子串）
  caution: string;
}

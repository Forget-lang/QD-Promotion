// g09 宠物店（洗护美容）· 片1 · 本片 payload 形状（通用 Scene 只留分发字段，业务数据全在这里）
// 组件在本目录 index.tsx，专属件不跨行业 import。母题=洗护次卡磁条卡 + 泡泡计数（03-母题一页.md）。
// 背景 = bgImage（蓝绿光斑底 BG-ABS-004，由 VTemplate 垫底），屏组件透明、内容压在图上。
// 字段名/组标题键用 k / v / head —— 对齐 check-ui-truth 取键约定（次卡字段名回 spec/card-fields.json 逐字取证）。
// 次卡不是优惠券：本屏不声明 couponType（⑥ 券种↔面额配对只认优惠券，次卡屏天然跳过）。

/** 制作清单一行：字段名 k + 值 v */
export interface MakeRow {
  k: string;        // 字段名（逐字回 card-fields.json）
  v: string;        // 值（示例）
  hero?: boolean;   // 重点行（本屏要观众看清的选择）
  tag?: string;     // 行内说明标签（我方文案，非产品原话）
  indent?: boolean; // 从属行（挂在 hero 下，缩进）
}

/** 一个分组（① 卡基本信息 / ② 期限 / ③ 核销节奏）——次卡页无原生组名，全为我方分步自述 */
export interface MakeGroup {
  head: string;
  rows: MakeRow[];
}

/** 制券屏：制作一张洗护次卡（磁条卡面 + 泡泡计数 + 制作清单） */
export interface MakePayload {
  badge?: string;      // 右上角合规标注（数值为示例时挂，C-11 挂顶部）
  cardName: string;    // 磁条卡上的次卡名（示例：洗护5次卡）
  times: number;       // 泡泡计数（= 每张包含次数，示例 5）
  validLabel: string;  // 卡面有效期小行（示例：有效期 120 天）
  intervalHint?: string; // 制券②用：在卡面相邻泡泡之间插此胶囊（如"间隔 14 天"），把核销间隔画成节奏；不传则同一屏标杆
  title: string;       // 制作清单主标题
  sub: string;         // 制作清单副行
  groups: MakeGroup[];
}

/** S1 钩子屏：痛点压在"正在被填的次卡"界面上（C-05 同格，不另开铺垫屏） */
export interface HookPayload {
  badge?: string;
  title: string;        // 痛点钩子大字
  sub: string;          // 判断句（一张次卡把下次变成看得见的次数）
  cardName: string;     // 磁条卡名
  times: number;        // 泡泡总数
  usedTimes: number;    // 已用（泡泡变暗）数——示意"用过几次、还剩几次"
  remainLabel: string;  // 剩余次数角标（如"还剩 3 次"）
}

/** S2 痛点屏：客户流失时间轴（flow）——从"洗完这一次"到"去了别家"，标出断点 */
export interface TimelineNode { time: string; text: string; lost?: boolean; }
export interface PainPayload {
  badge?: string;
  title: string;
  sub: string;
  nodes: TimelineNode[];
}

/** S6 结果屏：磁条卡特写 + 核销流水（hero-object）——一张卡 + 第 X 次核销记录 */
export interface VerifyLog { n: number; date: string; done: boolean; }
export interface ResultPayload {
  badge?: string;
  title: string;
  sub: string;
  cardName: string;
  times: number;
  usedTimes: number;
  remainLabel: string;
  log: VerifyLog[];
}

/** S7 收尾屏：主张 + 5 个泡泡逐一点亮成"接下来五次" + 品牌（hero-focus） */
export interface CtaPayload {
  line: string;   // 主张（"五次"由一排点亮的泡泡呼应）
  times: number;  // 点亮的泡泡数（= 每张包含次数）
  brand: string;
  sub: string;
}

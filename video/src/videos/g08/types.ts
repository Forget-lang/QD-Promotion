// g08 火锅 · 片1 · 本片 payload 形状（通用 Scene 只留分发字段，业务数据全在这里）
// 组件在本目录 index.tsx，专属件不跨行业 import。母题=中秋档期桌号牌（03-母题一页.md）。
// 背景 = bgImage（朱红海浪纹 BG-GEO-002，由 VTemplate 垫底），屏组件透明、内容压在图上。
// 字段名/组标题键用 k / v / head —— 对齐 check-ui-truth 的取键约定（①③⑤⑥ 靠它扫字段与券种配对）。

import type { IconKey } from '../../components/icons';

/** 锅底单一行：字段名 k + 值 v */
export interface MakeRow {
  k: string;        // 字段名（逐字回 coupon-fields.json）
  v: string;        // 值（示例）
  hero?: boolean;   // 重点行（本屏唯一要观众看清的选择）
  tag?: string;     // 行内档期标签
  indent?: boolean; // 从属行（挂在 hero 下，缩进）
}

/** 一个分组（① 券面 / ② 期限 / ③ 到期提醒） */
export interface MakeGroup {
  head: string;     // 组标题（我方分步自述带 ①②；到期提醒为页面原生组名）
  rows: MakeRow[];
}

export interface MakePayload {
  couponType: string; // 券种（供 check-ui-truth ⑥ 校验面额字段配对）
  badge?: string;     // 右上角合规标注（仅显示示例数值的屏挂：S1/S3/S6）——C-11 挂顶部
  title: string;      // 牌匾横匾主标题
  sub: string;        // 副行
  icon?: IconKey;     // 牌匾圆框图标（gift=制券 / clock=档期，母题一页 §5）
  groups: MakeGroup[];
}

/** S1 钩子屏：痛点压在"正在被填的档期券"界面上（C-05，钩子长在券上、不另开铺垫屏） */
export interface HookPayload {
  badge?: string;
  title: string;        // 痛点钩子（牌匾大字）
  sub: string;          // 判断句（会做生意的老板赶的是带到期日的券）
  couponName: string;   // 号牌卡上的券名
  validityType: string; // 有效期类型（hero）
  expireDate: string;   // 到期日（钩子焦点）
  highlight: string;    // 焦点标注（如"过期自动作废 = 紧迫感"）
}

/** S2 痛点屏：现在这么做 → 结果失效 的对照清单 */
export interface PainItem { act: string; fail: string; }
export interface PainPayload {
  badge?: string;
  title: string;
  sub: string;
  items: PainItem[];
}

/** S5 结果屏：顾客侧 / 商家侧 两栏各看到什么 */
export interface ResultSide { who: string; icon?: IconKey; items: string[]; }
export interface ResultPayload {
  badge?: string;
  title: string;
  sub: string;
  sides: ResultSide[];
}

/** S6 收尾屏：主张 + 品牌落章 */
export interface CtaPayload {
  line: string;   // 一句主张
  brand: string;  // 品牌名（券到卡包，结尾署名允许上屏）
  sub: string;    // 品牌定位一句
}

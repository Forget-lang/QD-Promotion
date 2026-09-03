// g08 火锅 · 片1 · 本片 payload 形状（通用 Scene 只留分发字段，业务数据全在这里）
// 组件在本目录 index.tsx，专属件不跨行业 import。母题=中秋档期桌号牌（03-母题一页.md）。

/** 三选项对照列：有效期类型三选一 */
export interface CompareCol {
  no: string;           // 编号，如 "01"（号牌卡头）
  head: string;         // 列标题（有效期类型名）
  tag: string;          // 卡头档期标签，如 "节日档"
  useCase: string;      // 适用生意
  downside: string;     // 反面/注意点
  recommended?: boolean; // 是否推荐项（红底号牌）
  pickSignal: string;   // 怎么选判断句
  example: string;      // 火锅场景举例
  curveType: 'festival' | 'rush' | 'spread'; // 客流曲线类型
  statA: { label: string; value: string };  // 铜牌徽章 A
  statB: { label: string; value: string };  // 铜牌徽章 B
}

export interface ComparePayload {
  tag: string;          // 顶部 eyebrow 标签
  title: string;        // 牌匾横匾主标题
  sub: string;          // 副行
  cols: CompareCol[];   // 三列号牌卡
  punch: string;        // 底部结论牌匾
}

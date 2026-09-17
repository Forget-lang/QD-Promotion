# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260917-018`
- 标题：quandao-mcp-server 登记为外部能力说明书源（落 R10）
- 负责人：用户 + 本地 Agent
- 范围：`global`
- 状态：`VERIFYING`
- 基线：`HEAD = origin/main = 16ec0de`
- **定位说明**：Owner 落点 1 个（`docs/internal/R10-产品事实源解析协议.md`）＋ 4 个标题序号顺移。跨治理 Owner → 按 R8 留档。用户 2026-09-17 15:23 拍板「做吧」。

## 二、Goal

把 `quandao-mcp-server`（7 个只读工具的外部 MCP 服务端）正式登记进 `R10`，给它一个**合法但有边界的身份**：外部能力说明书源（人工校对尺），并写死三条硬边界——结束"它目前只存在于工作区记忆、换会话即失效"的挂账状态。

## 三、新口径 New Policy

1. **定位**：`quandao-mcp-server` 是产品侧的**外部能力说明书源**——`quandao-mcp` v1.0.0，Streamable HTTP，配置在用户级 `~/.workbuddy/mcp.json`；7 个工具（`coupon/bundle/card/point_capabilities` ＋ `industry_tree` ＋ `position_list`/`recommend_list`）**全部只读**。
2. **它不是第二份产品真值，也不是数据管道。** 产品能力/字段的唯一 Owner 仍是 `APPLET / spec/`（本协议 §1 与「Agent 协作规则」不变）。
3. **硬边界 ①·不作机检判据**：能力说明书措辞含「通常/一般」等模糊限定，只供人工校对；任何闸门（`scripts/*.mjs`）不得读取或依赖其返回值。
4. **硬边界 ②·不进选题判据**：`industry_tree` 只作行业身份校准（名称/层级/id）与相邻行业查重旁证；不得当候选行业清单（`SKILL.md` 第 1 步「现场调研，不预置清单」不受影响）。
5. **硬边界 ③·上屏仍回源码取证**：`position_list`/`recommend_list` 只作「落点真实性」线索；任何上屏表述仍按上屏真实性闸门回 `APPLET` 源码逐字取证。
6. **引用义务**：把 MCP 结论写进 `spec/*.json` 时，`src`/来源必须显式标注「外部能力文档：quandao-mcp · <工具名>（非小程序源码）」并记录取用日期；说明书随产品迭代过期，不得把它的数值当永久真值（此为既有 `013/014/015` 实践的成文化）。

## 四、Replace

- `R10` 原 §6~§9 标题序号顺移为 §7~§10（**正文零改动**），为新节让位。

## 五、Remove

- **无删除**。

## 六、Preserve

- `R10` §1~§5 正文逐字不动；`AGENTS.md` / `SKILL.md` / `spec/*.json` / `scripts/*.mjs` / CI 工作流零改动（硬边界 ① 恰恰要求检查器不碰 MCP）。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `docs/internal/R10-*.md` 新增 §6 | 治理协议 Owner | ADD | 登记＋三条硬边界＋引用义务（§三 全款） | DONE |
| `docs/internal/R10-*.md` 原 §6~§9 标题 | 治理协议 Owner | REPLACE | 仅序号 +1，正文逐字不动 | DONE |
| `AGENTS.md` / `SKILL.md` | 宪法 / 生产 Owner | PRESERVE | 零改动 | DONE |
| `spec/*.json` | Product Truth | PRESERVE | 零改动（既有「来源：quandao-mcp」标注已合规） | DONE |
| `scripts/*.mjs`（15 道闸门） | 检查器 | PRESERVE | 零改动（边界 ①：闸门不读 MCP） | DONE |
| `docs/changes/active/CHANGE-20260917-018-*.md` | 本事务 | ADD | 本文件 | DONE |

## 八、Migration Plan

1. `R10` 插入新 §6（定位＋三边界＋引用义务），原 §6~§9 标题序号顺移。
2. 复跑 `check-doc-references` / `check-change-contract` / `gate-all` 比对基线。
3. 回填本契约后提交推送。

## 九、Mechanical Checks

- 文档引用检查：保持基线 5 处（g11 线），本笔新增断链 0。
- 契约闸门：`check-change-contract` PASS（含本契约，20 transactions）。
- 判定零变化：`gate-all` 仍 `2/15` 且红项构成与基线逐项一致。
- R10 diff：仅新增一节 ＋ 4 个标题序号行，正文零改动（`git diff` 核验）。

## 十、Negative / Semantic Counterexample

**反例 1（"已登记"被读成"可当产品真值"）**：后续会话拿 MCP 返回直接改 spec 数值。
**拦截层**：§三 第 2 条——唯一 Owner 不变；引用义务要求标注来源与日期，机检可见。

**反例 2（把能力说明书接进闸门）**：让 `check-facts` 等脚本调 MCP 校验。
**拦截层**：§三 第 3 条（边界 ①）＋ §六 `scripts/` PRESERVE。

**反例 3（拿行业树生成候选行业清单）**：选题时直接抄 `industry_tree`。
**拦截层**：§三 第 4 条（边界 ②）＋ `SKILL.md` 第 1 步不动。

**反例 4（拿推荐位文案/截图直接上屏）**：
**拦截层**：§三 第 5 条（边界 ③）＋ 上屏真实性闸门不变。

**反例 5（顺手批量灌数据进 spec）**：
**拦截层**：§六 `spec/` PRESERVE；真值变更必须另走 R8。

## 十一、Real Output Verification

**声明（二选一，机器可读，必填）**：本事务到底需要什么真实产物，由本事务自己声明，机器不猜。

```text
- Real Output 声明：`not-applicable`
- 理由：只登记外部源的治理身份与边界，不产出、不修改任何视频画面 / 分镜 / Remotion 组件 / 渲染产物。
```

- 真实关键帧/短片：不适用
- 人工验收判据：R10 新节三边界齐全；`gate-all` 红项构成零变化
- 结果：PASS（not-applicable）

## 十二、Closure Report

- 已修改：`docs/internal/R10-产品事实源解析协议.md`（新增 §6「外部能力说明书源（quandao-mcp-server）」＝定位＋三条硬边界＋引用义务；原 §6~§9 标题序号顺移为 §7~§10）、本契约
- 已废止：无
- 已保留：`R10` §1~§5 与各节正文逐字不动；`AGENTS.md` / `SKILL.md` / `spec/*.json` / `scripts/*.mjs` / `.github/workflows/` 零改动
- 影响面：`6 / 6`
- 旧口径扫描：PASS —— 全仓「外部事实源」表述与本登记一致（`R10` §4 的 APPLET external 标记、§5 素材库登记不变；`013/014/015` 写入 spec 的「来源：外部能力文档 quandao-mcp」标注恰为本登记 §6 引用义务的既有实践）；无第二处 MCP 登记落点
- 机械检查：PASS —— R10 diff `18/4`（新增 14 行新节正文 ＋ 4 个新标题；删除 4 个旧标题，正文零改动）；`check-doc-references` 5 处＝基线（g11 线）；`check-change-contract` PASS（20 transactions）；`gate-all` `2/15` 且红项构成与基线逐项一致
- 负向测试：PASS —— 结构性验证即负向验证：本笔**没有**改动任何检查器（边界 ① 要求闸门读不到 MCP，`scripts/` diff 为空即证明）；`SKILL.md` 第 1 步原文未动（边界 ② 生效）；上屏真实性闸门四表自证行为不变（边界 ③ 生效）
- 语义反例：PASS —— §十 五个反例逐条对照：① 当真值用 —— 未发生（spec 零改动）；② 接进闸门 —— 未发生（scripts 零改动）；③ 行业树当清单 —— 未发生（SKILL 零改动）；④ 推荐位上屏 —— 未发生；⑤ 批量灌 spec —— 未发生
- 真图/成片：N/A（not-applicable，见 §十一）
- 本次新增红：**0** —— 迁移中一度 3/15（第 3 道为本契约 Impact Map 的 PENDING 行，回填后消除），最终 `2/15` 且红项构成与基线逐项一致

**结论：NOT CLOSED**

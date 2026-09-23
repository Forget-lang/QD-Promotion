# 项目全局一致性架构索引

> 状态：生效
> 用途：**稳定架构恢复索引**——只索引权威层级与主链关系，不新增业务规则。
> 文档引用纪律：本账只引用当前有效路径；不保留已删除文件名、历史错误路径或“旧名→新名”的废弃话头。
> 实时状态边界：本账**不提供实时状态**，也不兼任实时状态账本；取值处见 `AGENTS.md` §十一。本文件任何一节都不得写入片号级或事务级的波动状态。
> 接班纪律：新会话统一从 `AGENTS.md` 开始，再按当前任务**先判内容线、取该线唯一 Owner**（行业线＝`SKILL.md`／教程线＝`docs/internal/产品功能教程作业规范.md`）或对应领域 Owner。

## 1. 唯一主链

```text
项目目标
  ↓
产品事实真源 APPLET / Product Truth
  ↓
内容策略与内容包（内容层：五拍骨架）
  ↓
导演层（R9 通用导演判据 ＋ 逐片《导演稿》）
  ↓
风格层（所选风格包：视觉语言；R9 视觉映射表＝通用默认起手式，风格可覆盖）
  ↓
Visual Shot Contract
  ↓
实现（Remotion／风格化引擎／后期——按所选风格包）
  ↓
真实渲染帧 / 成片
  ↓
Gate All + 发布后验
  ↓
CLOSED
```

任何环节未闭环，都不得把后续环节的局部通过描述成“项目已完成”。

## 2. 权威层级

| 层 | 权威 | 负责什么 | 边界（波动状态不写入本列） |
|---|---|---|---|
| 总治理宪法 | `AGENTS.md` | 最高戒律、唯一 AI 入口、Owner/入口/历史边界、全局变更总路由 | 生效 |
| 治理协议 | `docs/internal/R8-变更收敛协议.md` | Decision → 全局侦察 → Owner/入口 → Change Contract → Impact → Migration → Verification → CLOSED | 生效 |
| 整改排兵布阵 | `docs/internal/整改作战总纲.md` | 整改前资源/Owner/冲突/依赖/能力/优先级审计 | 生效；不是第二生产流程 |
| 变更事务 | `docs/changes/*` | 实际变更的影响、迁移、验证、关闭状态 | **不在此硬编码当前事务**：以 `docs/changes/active/` 与 `docs/changes/closed/` 目录为准；实时状态以脚本输出与当前产物为准（`AGENTS.md` §十一） |
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | 真源在 APPLET；仓库内快照基准与校验见 `spec/product-truth/README.md`，本行不填读数 |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` / `spec/point-fields.json` / `spec/member-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 词/元素级硬禁与人工确认层以脚本输出为准，本行不填读数 |
| 导演层 | `docs/internal/R9-视觉导演与审美决策.md` | 为什么这样讲（叙事六项）＋镜头级视觉决策原则 | 生效；通用导演原则 Owner，不拥有具体导演方法 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → 表达方式默认起手式（工具无关；构件名为 `remotion-components` 举例） | 生效；风格包可覆盖实现，不得改写叙事判断 |
| 风格层 | `video/styles/` 下每风格一个自包含目录（清单与逐闸门适用性＝`scripts/ref-registry.json` 的 `styles`） | 用什么视觉语言表达（镜头表现方式／空间／素材／动效／声音） | 生效；不拥有流程／叙事／观看路径，不构成入口 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | 机制生效；逐片收口与否以脚本与当前产物为准 |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | 逐片红绿以 `gate-all` 输出为准，本行不填读数 |

## 3. 实时状态与历史证据的取值处

> 实时状态的取值处不在此列，一律见 `AGENTS.md` §十一；本节只登记历史闭环事项的证据去处。

### P0-A：APPLET Product Truth（指针，不复制结论）

- 快照基准（原始 archive SHA-256／文件数／Snapshot SHA-256／范围与排除规则／Git Blob SHA）：以 `spec/product-truth/README.md` 为准。
- 闭环过程与逐闸门验证证据（CI materialize、UI Truth、Facts、Doc refs、Redlines、Visual Shot Contract、gate-all）：见 `docs/changes/` 内 `CHANGE-20260915-003`。
- 本账不复制其状态结论；红绿一律回脚本输出（`AGENTS.md` §十一）。

## 4. 已完成且不得重新发明

### 全局治理阵型

最高原则已经统一到 `AGENTS.md` 的零号戒律；R8 负责全局变更协议；整改总纲负责前置排兵布阵；本文件只负责权威层级与主链的结构索引。不得再新增平行治理 Owner、平行 AI 入口或平行生产流程。

用户侧操作层现在固定只有两份文档：

- `AI工作启动指令.md`：用户个人工作控制台，负责“怎么叫 AI 开始干活”；不承担规则 Owner，不承担 AI 自动入口。
- `docs/AI使用手册.md`：用户协作说明书，负责“我怎样和 AI 协作、何时拍板、如何看证据”；不承担规则 Owner，不承担 AI 自动入口。

CHANGE-20260916-003 已完成并关闭：

- 唯一 AI 自动入口：`AGENTS.md`
- 用户个人工作控制台：`AI工作启动指令.md`
- 历史前身：`outputs/archive/AI启动提示词.md`
- 当前事务已归档：`docs/changes/closed/CHANGE-20260916-003-全局治理阵型收口.md`
- 本轮 Closure Report：CLOSED
- fresh CI：`change-contract-gate` #75 PASS；`visual-shot-contract` #124 PASS（**历史记录**；自 `CHANGE-20260917-012` 起，关闭证据改以候选状态上的等价重现为准，不要求 CI 记录）
- 变更史：以 `docs/changes/`（变更事务库）为准；历史账本（主文件与 2026-08 分卷）均已全系退役，追溯走 git 历史

### 5. R9 / Visual Shot Contract

- R9 为**导演决策 Owner（视觉导演＋叙事导演）**（2026-09-23 `CHANGE-20260923-039` 起；通用导演原则的 Owner）；视觉映射表随其归属。
- `scripts/check-visual-shot-contract.mjs` 是关键镜头契约机检 Owner。
- 逐片是否已进入 Visual Shot Contract 与成片 Gate，属波动状态，本账不记（取值处见 `AGENTS.md` §十一）。

### 6. 当前接班规则

新会话不得从本账开始执行，也不得把本账当作规则 Owner。

固定接班链：

`用户 → AI工作启动指令.md → AGENTS.md → 该线唯一 Owner（行业线＝SKILL.md）→ outputs → Gate`

任何局部任务若发现第二 Owner、第二入口、新旧规则并存、历史重新进入当前链，必须先按 R8 做全局侦察与影响面布阵。

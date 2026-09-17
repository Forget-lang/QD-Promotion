# 项目全局一致性总账

> 状态：生效
> 用途：索引权威关系与当前闭环状态，不新增业务规则。
> 文档引用纪律：本账只引用当前有效路径；不保留已删除文件名、历史错误路径或“旧名→新名”的废弃话头。
> 接班纪律：本账是当前状态总账，不是新会话第一入口。新会话统一从 `AGENTS.md` 开始，再按当前任务读取 `SKILL.md` 与对应 Owner。

## 1. 唯一主链

```text
项目目标
  ↓
产品事实真源 APPLET / Product Truth
  ↓
内容策略与内容包
  ↓
R9 视觉导演方法
  ↓
R9 视觉映射表
  ↓
Visual Shot Contract
  ↓
分镜 / Remotion 实现
  ↓
真实渲染帧 / 成片
  ↓
Gate All + 发布后验
  ↓
CLOSED
```

任何环节未闭环，都不得把后续环节的局部通过描述成“项目已完成”。

## 2. 权威层级

| 层 | 权威 | 负责什么 | 当前状态 |
|---|---|---|---|
| 总治理宪法 | `AGENTS.md` | 最高戒律、唯一 AI 入口、Owner/入口/历史边界、全局变更总路由 | 生效 |
| 治理协议 | `docs/internal/R8-变更收敛协议.md` | Decision → 全局侦察 → Owner/入口 → Change Contract → Impact → Migration → Verification → CLOSED | 生效 |
| 整改排兵布阵 | `docs/internal/整改作战总纲.md` | 整改前资源/Owner/冲突/依赖/能力/优先级审计 | 生效；不是第二生产流程 |
| 变更事务 | `docs/changes/*` | 实际变更的影响、迁移、验证、关闭状态 | **不在此硬编码当前事务**：以 `docs/changes/active/` 与 `docs/changes/closed/` 目录为准；实时状态以脚本输出与当前产物为准（`AGENTS.md` §十一） |
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | **snapshot 已入主分支；CI 已验证** |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁层无命中；人工确认按当前生产流程执行 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | 机制生效；新 g11 尚未进入机检收口 |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | 新 g11 尚未进入最终 Gate；上一版产物已全部删除，不再作为当前证据 |

## 3. 当前状态与已关闭事项

### P0-A：APPLET Product Truth

- 原始 archive SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`。
- 干净 snapshot：仅 `.vue/.js/.json`，排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 与 macOS `._*` 元数据。
- 文件数：**298**。
- snapshot SHA-256：`d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`。
- snapshot 已保存至 `spec/product-truth/applet/source.tar.xz`，Git Blob SHA：`ee34f4c2ecf397a6a43e7ecb7aa5eeb9a8f3804a`。
- CI 已 materialize 该 snapshot，并通过 UI Truth / Facts / Doc refs / Redlines / Visual Shot Contract / gate-all。
- **状态：CLOSED。** 历史整改前状态不作为当前阻塞项。

### 当前生产事项：g11 · 烧烤夜宵 · 片1

- 旧 g11 内容、VO、母题、分镜、R9 决策、benchmark 视频与渲染帧已全部删除，不再作为当前证据。
- 新版已按当前 SKILL 八步法重新从第 1 步开始：
  - `outputs/g11-烧烤/01-内容输入包.md`：第 1 步未完成；
  - `outputs/g11-烧烤/02-口播文案.md`：当前文件存在，但不得越过第 1 步完成门；
  - `outputs/g11-烧烤/03-母题一页.md`：第 2 步内容已建立视觉定位卡；
  - `outputs/g11-烧烤/07-片1-分镜稿.md`：第 4 步 + 第 4.5 步材料已建立，但前序完成门仍未通过；
  - `outputs/g11-烧烤/08-R9视觉决策卡.md`：当前 R9 决策材料存在；
- 当前视觉/内容方向：**“双节聚会 + 转赠奖励”社交裂变闭环**，核心机制为 `A 领券 → A 转给 B → B 核销 → A 获指定私密奖励券`。
- **当前节点：第 1 步治理回归未完成，因此不得进入后续生产节点。**
- 尚未产生新版 g11 的最终真实渲染帧、Visual Shot Contract 机检收口、最终 Gate 或发布后验，因此不得描述为已完成。

## 4. 已完成且不得重新发明

### 全局治理阵型

最高原则已经统一到 `AGENTS.md` 的零号戒律；R8 负责全局变更协议；整改总纲负责前置排兵布阵；本账只负责当前状态索引。不得再新增平行治理 Owner、平行 AI 入口或平行生产流程。

用户侧操作层现在固定只有两份文档：

- `AI工作启动指令.md`：用户个人工作控制台，负责“怎么叫 AI 开始干活”；不承担规则 Owner，不承担 AI 自动入口。
- `docs/AI使用手册.md`：用户协作说明书，负责“我怎样和 AI 协作、何时拍板、如何看证据”；不承担规则 Owner，不承担 AI 自动入口。

CHANGE-20260916-003 已完成并关闭：

- 唯一 AI 自动入口：`AGENTS.md`
- 用户个人工作控制台：`AI工作启动指令.md`
- 历史前身：`outputs/archive/AI启动提示词.md`
- 当前事务已归档：`docs/changes/closed/CHANGE-20260916-003-全局治理阵型收口.md`
- 本轮 Closure Report：CLOSED
- fresh CI：`change-contract-gate` #75 PASS；`visual-shot-contract` #124 PASS
- 变更史：以 `docs/changes/`（变更事务库）为准；历史账本（主文件与 2026-08 分卷）均已全系退役，追溯走 git 历史

### 5. R9 / Visual Shot Contract

- R9 视觉导演与视觉映射表为现行视觉决策层。
- `scripts/check-visual-shot-contract.mjs` 是关键镜头契约机检 Owner。
- 新 g11 当前仍处于第 1 步治理回归，不得进入最终 Visual Shot Contract 与成片 Gate。

### 6. 当前接班规则

新会话不得从本账开始执行，也不得把本账当作规则 Owner。

固定接班链：

`用户 → AI工作启动指令.md → AGENTS.md → 当前 Owner / SKILL.md → outputs → Gate`

任何局部任务若发现第二 Owner、第二入口、新旧规则并存、历史重新进入当前链，必须先按 R8 做全局侦察与影响面布阵。

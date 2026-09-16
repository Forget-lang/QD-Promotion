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
| 变更事务 | `docs/changes/*` | 实际变更的影响、迁移、验证、关闭状态 | **CHANGE-20260916-003 已完成迁移，当前处于 VERIFYING；changelog 完成后关闭并归档** |
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | **snapshot 已入主分支；CI 已验证** |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁层无命中；人工确认按当前生产流程执行 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | **检查通过** |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | **最新 visual-shot-contract Run #101：PASS** |

## 3. 当前状态与已关闭事项

### P0-A：APPLET Product Truth

- 原始 archive SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`。
- 干净 snapshot：仅 `.vue/.js/.json`，排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 与 macOS `._*` 元数据。
- 文件数：**298**。
- snapshot SHA-256：`d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`。
- snapshot 已保存至 `spec/product-truth/applet/source.tar.xz`，Git Blob SHA：`ee34f4c2ecf397a6a43e7ecb7aa5eeb9a8f3804a`。
- CI 已 materialize 该 snapshot，并通过 UI Truth / Facts / Doc refs / Redlines / Visual Shot Contract / gate-all。
- **状态：CLOSED。** 历史整改前状态不作为当前阻塞项。

### P0-B：g11 安全区真实帧

- `EmberParticles` 已完成坐标约束修复。
- g11 `VTemplate` 生产 `sceneScale=0.76` 保持不变。
- 安全区已改为 content-only 取证 + 左右 120px 信息安全硬边界；顶部仅诊断，合法 full-bleed 背景不判违规。
- fresh safe-area frames、production frames 与 gate-all 已完成验证；后续以最新 CI 实际结果为准。
- **状态：CLOSED。**

## 4. 已完成且不得重新发明

### 全局治理阵型

最高原则已经统一到 `AGENTS.md` 的零号戒律；R8 负责全局变更协议；整改总纲负责前置排兵布阵；本账只负责当前状态索引。不得再新增平行治理 Owner、平行 AI 入口或平行生产流程。

用户侧操作层现在固定只有两份文档：

- `AI工作启动指令.md`：用户个人工作控制台，负责“怎么叫 AI 开始干活”；不承担规则 Owner，不承担 AI 自动入口。
- `docs/AI使用手册.md`：用户协作说明书，负责“我怎样和 AI 协作、何时拍板、如何看证据”；不承担规则 Owner，不承担 AI 自动入口。

二者均不进入权威规则链，也不要求 `AGENTS.md` 反向引用；AI 进入仓库后仍从 `AGENTS.md` 开始，并回到当前唯一 Owner。

### R8 变更收敛

Change Contract 已接入 gate-all；全局变更必须先完成侦察、Owner/入口确认与影响面布阵；CLOSED 事务需要完整影响对账、机械验证、反例验证与收口证据。

### R9 视觉导演

已建立 Visual Subject、Visual Metaphor、Spatial Composition、Motion Meaning、Attention Curve、Exit Logic 六项镜头决策框架，并建立叙事关系到 Remotion 视觉关系的映射表。

### g11 烧烤

已完成从 PPT/UI 模板式结构向纯 Remotion 镜头体系的重构方案，形成 20 镜头视觉决策卡；产品事实采用 APPLET 为准，并完成无门槛、3 天、随机金额区间、17:00–02:00 等纠偏。

### 产品业务口径

“券到卡包”是商家优惠券制作、发券、核销及转赠/裂变等推广工具，不是支付工具。

- 不支持付费购券；
- 不收取手续费；
- 客户支付时不会自动抵扣；
- 优惠券是优惠凭证，到店后凭券核销抵扣优惠金额；
- 核销后，客户仍通过门店原有收款渠道支付剩余金额。

示例：20 元优惠券用于 100 元消费，店员先核销 20 元优惠券，顾客再向商家支付 80 元。

**“满 100 减 18 元”属于正常、合法的满减券实例，不是 Product Truth mismatch。** 满减券的“消费门槛”可设置为 0 元表示无门槛，也可设置为具体金额表示有门槛；视频中应根据具体券实例分别表达。

## 5. Agent 接续规则

本账只用于恢复当前状态，**不承担新会话第一入口职责**。新 Agent / 新会话统一执行：

1. 先读 `AGENTS.md`；
2. 再按 `AGENTS.md` 的「AI 读取顺序」读取 `SKILL.md` 与当前任务 Owner；
3. 只有任务涉及治理状态时，才回读本账；
4. 当前事务状态以 `docs/changes/active/` 与 `docs/changes/closed/` 的实际位置及事务正文为准。

当前正常作业路由：

- `AGENTS.md`
- `SKILL.md`
- 当前任务对应 Owner
- 输出 / 产物
- Gate / 验收

不要根据聊天历史猜测状态；以仓库文件与最新 CI 实际结果为准。

## 6. CLOSED 定义

事项只有同时满足唯一权威明确、旧口径已迁移、影响面已对账、机械检查通过、反例验证通过、真实产出验证通过（适用时）、对应 gate-all 通过并按 R8 关闭，才可写为 `CLOSED`。

## 7. 当前结论

**当前唯一全局治理事务 CHANGE-20260916-003 已完成 Migration 与 fresh Verification，当前仅剩 changelog 最终补记及事务归档/关闭手续；在完成前保持 VERIFYING，不宣称本轮文档治理已全面 CLOSED。** CHANGE-20260915-004 已完成并归档至 `docs/changes/closed/`，不得再作为当前 active transaction 继续执行。
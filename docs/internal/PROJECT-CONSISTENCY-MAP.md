# 项目全局一致性总账

> 状态：生效
> 用途：解决长周期、多 Agent、多执行环境下的“旧口径继续生效 / 文档互相打架 / 已改但未闭环 / 对话中断后无法恢复上下文”问题。
>
> 本文件不是新的业务规则，也不替代 R8/R9/R10；它只负责索引“谁是权威、谁依赖谁、当前是否闭环”。

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
| 治理 | `docs/internal/R8-变更收敛协议.md` | Decision → Change Contract → Impact → Migration → Verification → CLOSED | 生效 |
| 变更事务 | `docs/changes/*` | 每次实际变更的影响、迁移、验证、关闭状态 | 当前无 active transaction；已关闭事务不可重新作为现行口径 |
| 产品事实 | `APPLET` + R10 | 产品字段、UI、流程事实 | **CI 未闭环**：snapshot 已本地生成，但尚未进入 Git 主分支 |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁 0 命中；人工确认项仍存在 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 每个关键镜头必须有视觉主体、隐喻、Peak Frame、State Change、Exit 等 | **CI 通过** |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | **当前失败 2/15** |

## 3. 当前未闭环事项

### P0-A：Product Truth Snapshot 进入 Git / CI

**事实：**
- 已从用户提供的 `applet.zip` 生成完整 snapshot。
- 范围为 `.vue/.js/.json`，共 299 个文件。
- snapshot SHA-256：`259fb2aa05c40f3e626e0d733c634e38bdec839860dd13b352193aa66fc9f59b`。
- 原始 `applet.zip` SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`。
- R10 已登记上述 provenance。

**未完成：**
- snapshot 尚未进入 promotion Git 主分支。
- 因此 CI 无法 materialize `../applet`。
- `check-ui-truth` 仍按设计硬失败。

**正确收口：**
1. 将完整、可逐文件追溯的 snapshot 正式提交到 Git；
2. CI materialize；
3. 不降低 `check-ui-truth` 验证等级；
4. 重新运行 gate-all；
5. 只有 UI Truth PASS 后才能关闭本项。

**禁止：** partial snapshot、占位文件、伪造 source、CI skip、降低 checker。

### P0-B：g11 安全区真实帧问题

**事实：**
- gate-all 当前报告“文字安全区探针”失败。
- `g11` 的 `EmberParticles` 目前存在粒子坐标可能进入安全边带/画外的问题。
- 这是实际渲染层问题，不得通过放宽阈值、忽略装饰元素或伪造 PASS 处理。

**正确收口：**
1. 修改 g11 粒子/装饰元素的实际坐标约束，使真实像素进入安全范围；
2. 重新渲染最新帧；
3. 重新运行 safe-area probe；
4. 对失败帧进行真图复核；
5. gate-all PASS 后关闭本项。

**注意：** 标题、小元素的出界语义可以不同，但当前探针是像素级事实检查；在没有用户重新拍板改变检查语义之前，应先修真实画面。

### P1：红线人工确认项

当前自动扫描：
- 画面层硬禁：0
- 口播层硬禁：0
- 文案层需确认：27
- 文档层提示：11

这些不是当前 gate-all 的红灯，但治理要求不能直接跳过。应逐条确认是否属于规则说明句；确认完成后再决定是否需要清理扫描噪声或保留说明。

## 4. 已完成、不可重新发明的治理成果

### R8 变更收敛
- Change Contract 已接入 gate-all。
- CLOSED 事务必须具备完整 Impact Map、PASS 验证、反例验证和收口证据。
- 当前没有 active change transaction。

### R9 视觉导演
- 已建立镜头级视觉决策方法：Visual Subject、Visual Metaphor、Spatial Composition、Motion Meaning、Attention Curve、Exit Logic。
- 已建立视觉映射表。
- 组件选择必须服从视觉关系，不得反过来由组件库决定镜头。
- 关键镜头必须具备 Peak Frame / State Change / Exit 等契约字段。

### R10 Product Truth
- 已统一逻辑身份 `APPLET`。
- 物理路径是环境绑定，不是事实源名称。
- CI 不伪造 applet，不静默跳过 UI Truth。
- 外部素材库保持 external，不伪装成本仓库资产。

### g11 烧烤
- 已完成从 PPT/UI 模板式结构向纯 Remotion 镜头体系的重构方案。
- 已形成 20 镜头 R9 视觉决策卡。
- 已完成产品事实纠偏：无门槛、3 天、随机 3–30 元、17:00–02:00 等必须以 APPLET 为准。
- 分镜文件已恢复到完整版本；后续修改必须做最小安全 patch，禁止整文件覆盖导致回退。

## 5. Agent 接续规则

任何新的 Agent / 新会话开始工作时，先读取本文件，再按以下顺序读取：

1. `AGENTS.md`
2. `docs/internal/R8-变更收敛协议.md`
3. `docs/internal/R9-视觉导演与审美决策.md`
4. `docs/internal/R9-视觉映射表.md`
5. `docs/internal/R10-产品事实源解析协议.md`
6. 当前 active `docs/changes/*`（若有）
7. 本文件列出的 P0/P1 未闭环项

不要根据聊天历史自行恢复“当前状态”；以仓库中的上述文件和 CI 实际结果为准。

## 6. CLOSED 的定义

项目不能因为“文档写了”“代码改了”“本地看起来对了”而标记完成。

一个事项只有同时满足：

- 唯一权威已明确；
- 旧口径已迁移/退休；
- 影响面已对账；
- 机械检查通过；
- 反例验证通过；
- 真实产出验证通过（适用时）；
- gate-all 对应闸门通过；
- 变更事务按 R8 关闭；

才可写为 `CLOSED`。

## 7. 当前项目结论

**项目尚未完全闭环。**

当前最明确的两个硬阻塞是：

1. `APPLET` Product Truth Snapshot 尚未进入 Git/CI，导致 UI Truth 闸门硬失败；
2. g11 最新真实帧仍有安全区像素越界，导致 Safe Area 闸门硬失败。

除此之外，红线人工确认 27 条属于待人工收口事项，但不是当前 gate-all 的硬失败原因。

本账的作用是：即使工作跨越多个会话、多个 Agent、多个物理工作区，也只能沿这条状态链继续，不得重新讨论已经解决的路径身份、治理规则或视觉契约问题。

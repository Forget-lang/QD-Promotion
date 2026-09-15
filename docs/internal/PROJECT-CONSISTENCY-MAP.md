# 项目全局一致性总账

> 状态：生效
> 用途：索引权威关系与当前闭环状态，不新增业务规则。
> 文档引用纪律：本账只引用当前有效路径；不保留已删除文件名、历史错误路径或“旧名→新名”的废弃话头。

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
| 变更事务 | `docs/changes/*` | 实际变更的影响、迁移、验证、关闭状态 | **1 个 active transaction：CHANGE-20260915-004，状态 MIGRATING** |
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | **snapshot 已入主分支；CI 已验证** |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁层无命中；人工确认按当前生产流程执行 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | **检查通过** |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | **以最新 CI 实际结果为准** |

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

### R8 变更收敛

Change Contract 已接入 gate-all；CLOSED 事务需要完整影响对账、机械验证、反例验证与收口证据。

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

新 Agent / 新会话开始工作时，先读取本账，再读取：

- `AGENTS.md`
- `SKILL.md`（当前为八步法；第 4.5 步为正式视觉转换关）
- `docs/internal/R8-变更收敛协议.md`
- `docs/internal/R9-视觉导演与审美决策.md`
- `docs/internal/R9-视觉映射表.md`
- `R10`
- `spec/facts.json`、`spec/coupon-fields.json`、`spec/card-fields.json`
- 当前 active `docs/changes/*`（若有）

不要根据聊天历史猜测状态；以仓库文件与最新 CI 实际结果为准。

## 6. CLOSED 定义

事项只有同时满足唯一权威明确、旧口径已迁移、影响面已对账、机械检查通过、反例验证通过、真实产出验证通过（适用时）、对应 gate-all 通过并按 R8 关闭，才可写为 `CLOSED`。

## 7. 当前结论

**核心治理、Product Truth、g11 安全区与 R9 视觉契约整改均已闭环。** 当前不存在 P0-A/P0-B 遗留阻塞；CHANGE-20260915-004 正在进行最后的文档一致性收口，未关闭前不得把项目整体声明为完成。

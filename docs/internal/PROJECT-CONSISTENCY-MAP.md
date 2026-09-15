# 项目全局一致性总账

> 状态：生效
> 用途：索引权威关系与当前闭环状态，不新增业务规则。

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
| 变更事务 | `docs/changes/*` | 实际变更的影响、迁移、验证、关闭状态 | 当前无 active transaction |
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | snapshot 已入主分支；CI 闭环验证未通过 |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁层无命中；人工确认待收口 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | 最近检查通过 |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | 等待 Product Truth 真值不一致项与 g11 新证据收口 |

## 3. 当前未闭环事项

### P0-A：APPLET Product Truth 入库与 CI

- 原始 archive SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`。
- 当前采用干净 snapshot：仅 `.vue/.js/.json`，排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 与 macOS `._*` 元数据。
- 文件数：**298**。
- snapshot SHA-256：`d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`。
- 完整 snapshot archive 已保存至 `spec/product-truth/applet/source.tar.xz`，Git Blob SHA：`ee34f4c2ecf397a6a43e7ecb7aa5eeb9a8f3804a`。
- 当前阻塞已从“缺少 Product Truth archive”推进为“check-ui-truth 仍报告 53 个真值表/画面字段名无法在 APPLET 源码逐字命中”；不得通过跳过、放宽 checker 或制造别名绕过。
- 收口条件：逐项迁移/修正真值不一致 → CI `check-ui-truth` 真实验证 → gate-all 对应闸门通过。

### P0-B：g11 安全区真实帧

- `EmberParticles` 已完成坐标约束修复，使装饰粒子服从像素安全边界。
- g11 `VTemplate` 已收紧为 `sceneScale=0.76`，用于验证既有宽卡片是否侵入左右安全边带。
- CI #46 已在该修复提交后重新触发，但 run 本身无可用 job 明细，不能把它当作通过证据。
- 收口条件：最新渲染 → safe-area probe → 真图复核 → gate-all 对应闸门通过。

### P1：红线人工确认

- 自动扫描仍有文案层与文档层的规则说明类提示。
- 这些提示不等同于硬禁命中，但治理要求逐条判断，不能直接跳过。

## 4. 已完成且不得重新发明

### R8 变更收敛

Change Contract 已接入 gate-all；CLOSED 事务需要完整影响对账、机械验证、反例验证与收口证据。

### R9 视觉导演

已建立 Visual Subject、Visual Metaphor、Spatial Composition、Motion Meaning、Attention Curve、Exit Logic 六项镜头决策框架，并建立叙事关系到 Remotion 视觉关系的映射表。

### g11 烧烤

已完成从 PPT/UI 模板式结构向纯 Remotion 镜头体系的重构方案，形成 20 镜头视觉决策卡；产品事实采用 APPLET 为准，并完成无门槛、3 天、随机金额区间、17:00–02:00 等纠偏。

## 5. 产品业务口径补充

“券到卡包”是商家优惠券制作、发券、核销及转赠/裂变等推广工具，不是支付工具。

- 不支持付费购券；
- 不收取手续费；
- 客户支付时不会自动抵扣；
- 优惠券是优惠凭证，到店后凭券核销抵扣优惠金额；
- 核销后，客户仍通过门店原有收款渠道支付剩余金额。

示例：20 元优惠券用于 100 元消费，店员先核销 20 元优惠券，顾客再向商家支付 80 元。

**“满 100 减 18 元”属于正常、合法的满减券实例，不是 Product Truth mismatch。** 满减券的“消费门槛”可设置为 0 元表示无门槛，也可设置为具体金额表示有门槛；视频中应根据具体券实例分别表达。

## 6. Agent 接续规则

新 Agent / 新会话开始工作时，先读取本账，再读取：

- `AGENTS.md`
- `docs/internal/R8-变更收敛协议.md`
- `docs/internal/R9-视觉导演与审美决策.md`
- `docs/internal/R9-视觉映射表.md`
- `spec/facts.json`、`spec/coupon-fields.json`、`spec/card-fields.json` 等当前 Product Truth 登记与字段真值
- 当前 active `docs/changes/*`（若有）

不要根据聊天历史猜测状态；以仓库文件与最新 CI 实际结果为准。

## 7. CLOSED 定义

事项只有同时满足唯一权威明确、旧口径已迁移、影响面已对账、机械检查通过、反例验证通过、真实产出验证通过（适用时）、对应 gate-all 通过并按 R8 关闭，才可写为 `CLOSED`。

## 8. 当前结论

**项目尚未完全闭环。** 当前继续执行 P0-A 与 P0-B；P1 人工确认随后收口。不得因为局部检查通过而提前宣布完成。

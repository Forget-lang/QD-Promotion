# 项目全局一致性总账

> 状态：生效
> 用途：解决长周期、多 Agent、多执行环境下的旧口径继续生效、文档互相打架、已改但未闭环、会话中断后无法恢复上下文问题。
> 本文件只负责索引权威关系与当前闭环状态，不新增业务规则。

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
| 产品事实 | `APPLET` + Product Truth | 产品字段、UI、流程事实 | snapshot 已重建并准备入库；等待本次提交后的 CI 验证 |
| 字段登记 | `spec/coupon-fields.json` / `spec/card-fields.json` | promotion 内可消费的字段真值登记 | 在位；必须可追溯到 APPLET |
| 红线 | `spec/redlines.json` + `scripts/check-redlines.mjs` | 画面/口播硬禁及人工确认层 | 硬禁层无命中；人工确认层待收口 |
| 视觉方法 | `docs/internal/R9-视觉导演与审美决策.md` | 镜头级视觉决策原则 | 生效 |
| 视觉映射 | `docs/internal/R9-视觉映射表.md` | 叙事关系 → Remotion 视觉关系/组件 | 生效 |
| 镜头契约 | `scripts/check-visual-shot-contract.mjs` + R9 ledger | 关键镜头的视觉主体、隐喻、Peak Frame、State Change、Exit | 已通过最近一次有效检查 |
| 成片验证 | `scripts/gate-all.mjs` | 统一总闸门 | 等待本次 Product Truth 与 g11 画面修复后的新证据 |

## 3. 当前未闭环事项

### P0-A：APPLET Product Truth 入库与 CI

- 来源 archive 已核验 SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`。
- 当前干净 snapshot 只纳入 `.vue/.js/.json`，排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 与 macOS `._*` 元数据。
- 干净 snapshot 文件数：**298**。
- 干净 snapshot SHA-256：`d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`。
- 归档位置约定：`spec/product-truth/applet/source.tar.xz`；CI 会从该归档 materialize `../applet`。
- 收口条件：归档入主分支 → CI 解包范围/文件数核验 → `check-ui-truth` 真实验证 → gate-all 对应闸门通过。
- 禁止：partial snapshot、placeholder、合成 source、skip 或降低 checker。

### P0-B：g11 安全区真实帧

- 已对 `EmberParticles` 做实际坐标约束修复，使装饰粒子服从像素安全边界。
- 尚未取得该修复后的新 CI/真实帧证据，因此本项仍未 CLOSED。
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

已完成从 PPT/UI 模板式结构向纯 Remotion 镜头体系的重构方案，形成 20 镜头视觉决策卡；产品事实采用 APPLET 为准，并已完成无门槛、3 天、随机金额区间、17:00–02:00 等纠偏。

## 5. Agent 接续规则

新 Agent / 新会话开始工作时，先读取本账，再读取：

1. `AGENTS.md`
2. `docs/internal/R8-变更收敛协议.md`
3. `docs/internal/R9-视觉导演与审美决策.md`
4. `docs/internal/R9-视觉映射表.md`
5. `docs/internal/R10-产品事实源解析协议.md`
6. 当前 active `docs/changes/*`（若有）

不要根据聊天历史猜测状态；以仓库文件与最新 CI 实际结果为准。

## 6. CLOSED 定义

事项只有同时满足唯一权威明确、旧口径已迁移、影响面已对账、机械检查通过、反例验证通过、真实产出验证通过（适用时）、对应 gate-all 通过并按 R8 关闭，才可写为 `CLOSED`。

## 7. 当前结论

**项目尚未完全闭环。** 当前继续执行 P0-A 与 P0-B；P1 人工确认随后收口。不得因为局部检查通过而提前宣布完成。

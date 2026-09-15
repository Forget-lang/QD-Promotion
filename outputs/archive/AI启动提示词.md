# 券到卡包 · AI 启动提示词

> 更新：2026-09-15
> 用途：开新会话 / 换 AI 工具时，快速、无歧义地接手当前项目。
> 原则：**提示词只指路，不复制规则。** 规则以 `AGENTS.md`、`SKILL.md`、`spec/`、`docs/internal/` 为准；不要根据聊天历史猜状态。
>
> **当前生产主线是 SKILL 八步法；第 4.5 步“文案 → Remotion 原生视觉转换”是正式关卡。**

---

## 0. 开工三动作

```text
1. node scripts/gate-all.mjs
2. node scripts/list-assets.mjs
3. 读 outputs/archive/changelog.md 顶部 10 条
```

红灯不产出、不交付。若 `gate-all` 提示已有发布后验待回填，先按发布后验协议回填上一片，不跳过数据闭环直接开下一片。

然后按任务读取：

- `AGENTS.md`
- `SKILL.md`（当前八步法）
- `docs/internal/PROJECT-CONSISTENCY-MAP.md`
- `docs/internal/R8-变更收敛协议.md`
- `docs/internal/R9-视觉导演与审美决策.md`
- `docs/internal/R9-视觉映射表.md`
- `docs/internal/R10-产品事实源解析协议.md`
- `spec/facts.json`
- `spec/coupon-fields.json`
- `spec/card-fields.json`
- `spec/redlines.json`

---

## A. 文档审计 / 工作流验证

任务：验证，不凭记忆下结论。

检查顺序：

1. `gate-all` 与正式退出码；
2. `check-doc-references`：断链、反引号资源路径；
3. SKILL / R3 / R7 / R9 与 `video/src` 实现逐条核对；
4. spec / R 文档之间的新旧口径冲突；红线只以 `spec/redlines.json` 为准；
5. 搜索已退休路线、旧数量、旧字段名、旧工作流名称；
6. 对照 changelog 顶部近期决策，查“拍板但未落实”；
7. 查死代码、旧类型、回退旁路与共享成品模板；
8. 新增/修改闸门必须做负向测试，并检查真实退出码。

输出：问题清单 → 证据 → 影响 → 建议。未经用户确认不改全局规则。

---

## B. 正式产出一条视频

严格按 `SKILL.md` 八步法执行：

1. **选行业与定攻略**：调研三问 → 候选场景 → 三态判定 → 用户圈选 → 表缺先回 APPLET 取证。
2. **视觉母题**：先确定一屏标杆、背景/素材纪律、色彩与动效语法。
3. **口播稿**：产品事实、红线、字数/时长、信息密度全部回权威文档。
4. **分镜稿**：逐屏确定叙事功能、字段真值、画面动作；关键镜头进入 R9 五字段。
4.5. **文案 → Remotion 原生视觉转换**：先确定 Visual Subject / Visual Metaphor / Spatial Composition / Motion Meaning / Peak / State Change / Exit，再选组件；不得反过来从组件库拼镜头。
5. **Remotion 工程实现**：按 R3/R7 API 与现有工程约定实现；不得创建退化旁路或共享成品模板。
6. **渲染验收**：fresh keyframes → 真图审查 → gate-all；通过后进入 TTS、声画同步、最终成片审片。
7. **三平台适配**：抖音 / 小红书 / 搜狐发布稿、标题、封面。
8. **发布后验**：1h / 24h / 7d 数据回流，形成下一片选型输入。

### 人工确认节点

用户负责：方向拍板、一屏标杆、逐屏真图确认、最终成片与发布决定。

用户说“空 / 乱 / 不像”时，AI 必须翻译成具体画面动作，不得只放大字号、堆卡片或换颜色敷衍。

---

## C. 多模型接力

每个节点只能交付对应硬停产物，不跨节点：

| 节点 | 对应步骤 | 硬停产物 |
|---|---|---|
| C1 | 1 | 内容输入包 + 调研留痕 |
| C2 | 2 | 行业视觉母题 + 一屏标杆 |
| C3 | 3 | 口播稿 |
| C4 | 4 | 分镜稿 |
| C4.5 | 4.5 | R9 视觉决策 / Shot Contract |
| C5 | 5 | Remotion 屏代码 |
| C6 | 6 | fresh 真图 / 成片 |
| C7 | 7 | 三平台发布稿 + 标题 + 封面 |
| C8 | 8 | 发布后数据复盘与下一片单变量 |

模型可替换；流程、事实真源和硬停点不可替换。

---

## D. 产品事实纪律

- 产品事实先查 `APPLET` / Product Truth，不凭记忆猜。
- `spec/facts.json`、`coupon-fields.json`、`card-fields.json` 是 promotion 内消费层，必须能回溯到 APPLET。
- 当前 Product Truth Snapshot 为 298 个 `.vue/.js/.json` 源文件，已进入 CI 并验证。
- 历史 `开启核销活码` 是 retired 旧命名；当前上屏统一使用 **动态核销码**。
- `满100减18元` 是合法满减券实例，不要错误改成“无门槛”。“无门槛”只用于消费门槛为 0 的具体券实例。
- 不支持付费购券、不收手续费、优惠券不会自动从支付中扣款；核销后客户仍通过门店原有支付渠道支付剩余金额。
- 任何无法由事实真源支持的功能描述不上屏、不进口播。

---

## E. 视觉与安全区纪律

- R9 是视觉决策层；R7 是组件目录；R3 是工程实现层。
- 一镜一主视觉关系；先关系、后组件。
- 动效必须表达语义：出现=被注意/生成，消失=被消耗，复制=奖励，移动=转赠，聚拢=注意力，扩散=传播，锐化=澄清，暗化=退出。
- 安全区不是“所有像素离边缘 120px”。当前硬闸聚焦**左右 120px 信息安全边界**；顶部只诊断；底部字幕带不量；full-bleed 背景/氛围层不算信息越界。
- g11 生产 `sceneScale=0.76`；不要继续缩小作为绕过办法。

---

## F. 变更治理纪律

任何全局规则变化：

```text
Decision
→ Change Contract
→ Impact Map
→ Migration
→ Mechanical / Negative Verification
→ Real Output Verification（适用时）
→ CLOSED
```

已 CLOSED 的事务不能重新当作待办；新问题新建 Change ID。Change ID 必须唯一。

---

## G. 当前项目状态

截至 2026-09-15：

- Product Truth Snapshot：CLOSED / CI 已验证；
- R8 治理：已接入；
- R9 视觉导演 / Mapping / Visual Shot Contract：已闭环；
- g11 安全区与 fresh production frames：已验证；
- 文档总账与启动入口：以当前版本为准；
- g11 后续真正未完成的是 TTS、声画同步、最终 MP4、发布与发布后数据，不要把这些工作伪装成“文档整改”。

**接班硬规则：不要重新发明已经 CLOSED 的 Product Truth、安全区或 R9 规则；先检查当前仓库状态，再决定是否真的有新变更。**

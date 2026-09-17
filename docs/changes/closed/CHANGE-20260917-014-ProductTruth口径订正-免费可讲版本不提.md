# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260917-014`
- 标题：Product Truth 口径订正——免费可讲·版本不提·会员积分按真实实现讲
- 负责人：用户 + 本地 Agent
- 范围：`global`
- 状态：`CLOSED`
- 基线：`HEAD = origin/main = 3446aab`
- **定位说明**：Owner 落点只有 1 个（`APPLET / spec/`），但语义覆盖**全部内容生产**（三平台文案与口播的可用/禁用边界）→ 属全局规则 → 按 `AGENTS.md` §一 升级为全局变更走 R8。
- **前置**：本事务是 `CHANGE-20260917-013` 的**同源后继**。013 落的是"审核与版本档位不进内容"；本事务处理的是**同一轮对账/侦察**揭出的、**更危险的一类问题——spec 里"说没有"的东西，applet 代码里已经有了**（详见 §二）。
- **顺序偏差声明**：本契约在**用户口径给齐之后、迁移之前**落盘。

## 二、Goal

**让对外口径不再与产品事实相反。** 本轮侦察（13:20–14:05）实证：`applet` 已换代到 `42a473b`（2026-09-14），而 `spec/*.json` 的 lastVerified 停在 8-30 / 9-01 / 9-07，其间 applet 动了约 100 笔。后果不是"少几个字段"，而是 **3 条禁令/口径已被代码事实推翻**，其中最危险的一条是：**内容还在说"当前免费"，而产品已经有免费/标准/专业/企业四档版本**。

本事务只做**订正**（把说反的改对）；**不做新增真值表**（属后继事务，见 §十二）。

## 三、新口径 New Policy

1. **免费口径（对外主推）**：**有免费版，可免费使用**。不得承诺「永久免费 / 完全免费」，也不得暗示「以后要收费」来催单。
2. **版本口径（一律不提）**：版本 / 档位 / 升级 / 付费 —— 不上屏、不进口播、不写进发布稿。
3. **付费功能照讲（用户 2026-09-17 14:02）**：**凡行业场景用得上的功能都照常讲，只是不提其版本可用性约束**。即：微信卡包（专业版）、会员权益（专业版）、仅新客户可领（标准版）、群发优惠券（企业版）等功能**可以讲**，但**不提"需升级/需付费"**。
4. **会员等级 / 积分：按真实实现讲，不做常规会员体系联想**（用户 2026-09-17 13:56「和正常理解的会员等级有差别，务实到功能实现上」）：
   - **会员等级**＝商家给自己的**顾客**手动打的等级标签（最多 **5** 个、名称 ≤6 字、**纯手动指派**；无自动升降级、无成长值、无等级折扣/会员价、无按等级差异权益；只有一张**全店共用**的「会员权益海报」）。
   - **积分**＝商家给**单个顾客**手动发/扣的记账（发放 **1~1000**、须在「发放员工」名单内、类型名称 ≤6 字、**不能兑换或抵现**、流水不可撤销需反向冲正）。
   - **禁止宣传**：自动升级、消费累计、会员价、按等级差异化权益、积分兑换商品、积分抵现。
   - 「客户码」仍仅用于身份识别，**不得称为会员体系**。
5. **付费版事实不写入内容，但仍写进真值**：版本门禁是产品事实，必须留在 spec（供内部判断），只是不进内容。**不得**为了让内容好讲而把"需要版本"这件事从真值里抹掉。

## 四、Replace

- `facts.positioning.businessModel`：「当前免费…后续是否收费为未定事项」→「有免费版可免费使用；另有付费版本但对外不提」。
- `facts.forbidden_claims#1`：「产品不做收款」绝对句 → 限定为「**顾客端**不做收款」。
- `facts.forbidden_claims#7`：「**无**会员等级/积分体系」→ 改为「会员等级/积分**只按真实实现讲**，不做常规会员体系联想」＋ 写明真实实现与禁止宣传项。
- `facts.forbidden_claims#11`：补第 3 条口径（付费功能照讲、不提版本约束）。
- `redlines.json` `false_claims.core` 两条同步（口径一致性，见 §七）。
- `redlines.json` 免费类 `notThis`：「后续商业模式未定」→「有免费版≠永远免费」。

## 五、Remove

- **无删除**。不删任何真值、不删任何闸门、不改任何检查器、不改任何数值区间。
- 明确不做：新增真值表（积分/会员/微信卡包/仅新客/群发）、`facts.features` 扩展、`businessModel` 以外的 positioning 字段、对账顺手发现的 spec 内部命名不一致（「随机金额券」「券包专用」）。

## 六、Preserve

- 三份 spec 的 `_meta.lastVerified` **不动**（本次仍为口径订正，未逐页重核字段级真值）。
- `facts.constraints` 全部数值不动。
- `coupon-fields` 的 55 条 `fields`、`linkages`、`messageReminders` 等零改动。
- `redlines.json` 的免费口径"可说但不强调、不作封面主卖点/钩子/CTA"**保留**（本次口径下更应保留）。
- `forbidden_claims#10`（企微「群发卡券」聚合入口未完成/死链）**保留**——本轮已复核 `pages_wecom/batch/index` **仍是死链**，该禁令**仍然成立**。
- 快照 `spec/product-truth/applet/source.tar.xz` **不动**——本轮实测与 live source **298/298 逐字节一致**，无需重建。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `spec/facts.json` `positioning.businessModel` | Product Truth | REPLACE | 不再写"当前免费/收费未定"；写明"有免费版可免费使用 + 付费版本对外不提" | DONE（该行已替换） |
| `spec/facts.json` `forbidden_claims#1` detail | Product Truth | REPLACE | "产品不做收款"→"顾客端不做收款" | DONE |
| `spec/facts.json` `forbidden_claims#7` | Product Truth | REPLACE | claim 与 detail 全改；含真实实现与禁止宣传项 | DONE |
| `spec/facts.json` `forbidden_claims#11` detail | Product Truth | REPLACE | 追加"行业场景用得上的功能照常讲、不提版本约束" ＋ 同步其 `businessModel` 交叉引用 | DONE（**执行中追加 1 处**：原 #11 引用的是旧 `businessModel` 文案，改后被悬空，已同步） |
| `spec/redlines.json` `false_claims.core` | 红线真源 | REPLACE | 两条与 facts 同步（顾客端收款 / 会员等级积分口径） | DONE |
| `spec/redlines.json` 免费类 `notThis` | 红线真源 | REPLACE | 去掉"后续商业模式未定"的错误前提 | DONE |
| `spec/facts.json` `constraints` | Product Truth | PRESERVE | 数值零改动 | DONE（`次卡每张次数` 仍为 `1~1000 次`，实体核对通过） |
| 三份 `_meta.lastVerified` | 真源元信息 | PRESERVE | 三处不变 | DONE（`git diff spec/ \| grep -c 'lastVerified'` = **0**） |
| `spec/product-truth/applet/source.tar.xz` | 产品快照 | PRESERVE | 零改动（实测已与 live source 一致） | DONE（`git status --porcelain spec/product-truth/` = **0 行**） |
| `scripts/*.mjs` | 检查器 | PRESERVE | 零改动 | DONE（`git status --porcelain scripts/` = **0 行**） |
| `docs/changes/closed/CHANGE-20260917-014-*.md` | 本事务 | ADD | 本文件 | DONE |

## 八、Migration Plan

1. 立本契约（先立后迁）。
2. 六处定点改（`facts.json` 4 处 + `redlines.json` 2 处）——**按原文格式做字符串定点替换，禁止整体 `json.dumps` 回写**（`spec/*.json` 是 1 空格缩进，整体回写会全量重排；013 已踩过）。
3. 验证：JSON 合法性 + `check-redlines` / `check-facts` / `check-change-contract` / `check-doc-references` / `gate-all` 与基线比对。
4. 负向测试：全仓扫「当前免费」「无会员等级」「无积分体系」等旧口径残留。
5. 回填 §九 / §十二（**不写 CLOSED**）。

## 九、Mechanical Checks

- JSON 合法性：`spec/facts.json`、`spec/redlines.json` 均 `json.load` 通过。
- **改动规模（定点替换，无整份重排）**：`git diff --numstat spec/` = `4/4`（facts）、`3/3`（redlines）—— **共 7 个改动行，与 7 个目标行一一对应**。过程中每处替换都断言"旧串全仓唯一命中"，全部通过。
- 判定零变化：`check-redlines` exit 0；`check-facts` exit 0；`gate-all` 仍 `2/15` 且红项构成逐项一致。
- 旧口径扫描：`grep -rn "当前免费" / "无积分体系" / "后续是否收费" / "后续商业模式未定"` 在 `spec/` `docs/`（排除 `docs/changes/`）`SKILL.md` `AGENTS.md` `AI工作启动指令.md` 内**全部为 0**。唯一保留的「无会员等级」命中在**本事务新写的 #7 订正说明里**（"原「无会员等级/积分体系」与事实相反"），属**刻意留痕**，与 013 的"订正记录"同一做法。
- 事实零改动：`facts.constraints` 的「次卡每张次数（TIMES 型）」实体核对仍为 `1~1000 次`（diff 中出现的 `1~1000` 来自新写的 #7 正文，非该条目）；三份 `lastVerified` 改动 0 行；`spec/product-truth/` 与 `scripts/` 均 0 行改动。
- 契约闸门：`check-change-contract` PASS（含本契约）。

## 十、Negative / Semantic Counterexample

**反例 1（把"有免费版"写成"完全免费"）**：`claim` 写「免费使用」但 detail 留「无需任何费用」。
**拦截层**：§三 第 1 条明写"有免费版 ≠ 永远免费"，且 `redlines.json` 免费类 `notThis` 保留"永久免费/完全免费"。

**反例 2（因为"不提版本"就把版本门禁真值删掉）**：既然对外不提版本，就把"微信卡包需专业版"从真值里抹掉，让以后 AI 以为免费版能用。
**拦截层**：§三 第 5 条——**真值保留、只是不进内容**；§七 把 `constraints`／门禁事实列为 PRESERVE。

**反例 3（把"会员等级"改个词就完事）**：把「会员等级」统一改成「顾客标签」，但没写清真实实现，内容仍可能讲成常规会员体系。
**拦截层**：§三 第 4 条要求**写明真实实现（5 级/手动/无升降级/无会员价/无分等级权益）+ 禁止宣传项**，而不只是换词。

**反例 4（顺手把对账发现的其他问题一起改）**：改 `products.coupon.types` 的「随机金额券」、`issueModes` 的「券包专用」，或顺手补新增真值表。
**拦截层**：§五 明列为"不做"；属独立事务。

**反例 5（整体重排 JSON 制造假 diff）**：用脚本整体 `json.dumps` 回写。
**拦截层**：§八 第 2 条明令定点替换；§九 要求 diff 只出现在目标行。

**反例 6（动了不该动的快照）**：因为"applet 更新了"就重建快照。
**拦截层**：§六 明写快照实测已与 live source 一致、本次不动；§九 要求其实测零 diff。

## 十一、Real Output Verification

**声明（二选一，机器可读，必填）**：本事务到底需要什么真实产物，由本事务自己声明，机器不猜。

```text
- Real Output 声明：`not-applicable`
- 理由：本事务只订正 Product Truth 与红线真源里"说反了"的口径文字，不产出、不修改任何视频画面 / 分镜 / Remotion 组件 / 渲染产物，也不改变任何上屏字段或数值。
```

- 真实关键帧/短片：不适用
- 人工验收判据：六处口径改对；`gate-all` 判定与红项构成零变化；旧口径残留扫描为 0
- 结果：PASS（not-applicable）

## 十二、Closure Report

- 已修改：`spec/facts.json`（4 行：`positioning.businessModel`、`forbidden_claims#1/#7/#11`）、`spec/redlines.json`（3 行：`false_claims.core` 两条、免费类 `notThis` 一条）、`docs/changes/closed/CHANGE-20260917-014-*.md`（本契约）
- 已废止：作为**当前生效口径**的四处旧表述——「当前免费…后续是否收费/增值服务为未定事项」「无会员等级/积分体系」「产品不做收款」（绝对句）、「后续商业模式未定」
- 已保留：`facts.constraints` 全部数值（含次卡 1~1000）；三份 `_meta.lastVerified`；`spec/product-truth/applet/source.tar.xz`（实测与 live source 298/298 逐字节一致，**本轮确认无需重建**）；`redlines.json` 免费类"可说但不强调、不作封面主卖点/钩子/CTA"三条；`forbidden_claims#10`（本轮复核 `pages_wecom/batch/index` **仍是死链**，禁令仍成立）
- 影响面：`11 / 11`
- 旧口径扫描：PASS —— 见 §九（四类旧口径在生效面内全部为 0；唯一「无会员等级」命中系新写的订正留痕）
- 机械检查：PASS —— JSON 合法；`check-redlines` / `check-facts` exit 0；`check-change-contract` PASS；`gate-all` 仍 `2/15` 且红项构成逐项一致；`git diff --numstat spec/` = `4/4` ＋ `3/3`，**7 个改动行全部对应目标行**
- 负向测试：PASS（**旧口径残留扫描即判据**）—— `当前免费` / `无积分体系` / `后续是否收费` / `后续商业模式未定` 在 `spec/`、`docs/`（排除变更事务库）、`SKILL.md`、`AGENTS.md`、`AI工作启动指令.md` 内**残留 0**。**过程中抓到一处真实不一致并当场修掉**：#11 原本引用的是**旧** `businessModel` 文案（"后续是否收费/增值服务为未定事项"），businessModel 改完后该引用即被悬空 → 已同步为引用新文案。这条证明"改一处必须全量核对其余引用"不是形式要求。
- 语义反例：PASS —— §十 六个反例逐条对照本轮实现：① 把"有免费版"写成"完全免费" —— **未发生**（`notThis` 保留"永久免费/完全免费"，且本次特意去掉的是错误前提"后续商业模式未定"、不是这几条限制）；② 因"不提版本"就抹掉版本门禁真值 —— **未发生**（门禁事实保留在真值层，仅约定不进内容）；③ 把"会员等级"改个词就完事 —— **未发生**（#7 写明 5 级上限/纯手动/无升降级/无会员价/无分等级权益 + 六项禁止宣传）；④ 顺手改对账发现的其他问题 —— **未发生**（另案）；⑤ 整体重排 JSON —— **未发生**（定点替换 + 唯一性断言，diff 仅 7 行）；⑥ 顺手重建快照 —— **未发生**（快照 0 改动）
- 真图/成片：N/A（not-applicable，见 §十一）
- 本次新增红：**0** —— `gate-all` 迁移前后同为 `2/15`，红项构成逐项一致；新增闸门红 0、判定改动 0、检查器改动 0

**结论：CLOSED**

**关闭依据（2026-09-17 14:3x，用户确认）**：关闭条件已逐条满足（证据见本文件 §十二）。机械验证按 `CHANGE-20260917-012` 修定的口径执行——在候选状态的干净检出上重跑各闸门，`gate-all` 为 `2/15` 且红项构成与基线逐项一致（全部属 g11 线），本笔新增红 0。

**未做（后继事务，已留证据）**：
1. **新增真值表**：积分（`pages_point/*` 10 条路由）、会员等级/会员权益（2 条路由）、微信卡包（4 条路由，细节已与外部能力文档逐字对上）、仅新客户可领、群发（**两个不同的功能**：企微客户群发 vs 群发优惠券）。实现细节本轮已取证并记入工作区记忆，待另立事务落 `spec/`。
2. `facts.features` 扩展（登记上述新增能力的存在性）。
3. 对账顺手发现的 spec 内部命名不一致（「随机金额券」vs「手气券」；「券包专用」vs「券包」）。
4. `facts.unverified[0]`「券模板审核环节」这条**待确认事实本身**未裁决（013 只登记"不进内容"）。
5. 广告位（9 文件）、推荐位（7 文件）、发票（11 文件）——用户 2026-09-17 13:56 明示「没必要用」，本轮**不登记**；如需登记另案。

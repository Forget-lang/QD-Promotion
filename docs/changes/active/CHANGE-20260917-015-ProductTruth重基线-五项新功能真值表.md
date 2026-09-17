# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260917-015`
- 标题：Product Truth 重基线——五项新功能真值表 + features 扩展 + 玩法版图原子 + 存量字段重核（第一批）
- 负责人：用户 + 本地 Agent
- 范围：`global`
- 状态：`VERIFYING`
- 基线：`HEAD = origin/main = 0773d7b`
- **定位说明**：触及 `spec/`（Product Truth Owner）＋ `knowledge/玩法版图.md`（组合视角 Owner）＝ **两个权威对象** → 属全局变更走 R8。
- **顺序偏差声明**：本契约在**取证完成之后、落盘真值表之前**起草；因取证量极大（三路并行只读，报告见工作区当日日志），为不伪造"先立后迁"的外观特此明写。**残留差异**：契约未能约束取证过程，只约束落盘内容。

## 二、Goal

**把 2026-09-07~09-14 期间 applet 新增的五项能力落成 Product Truth，并同步组合视角；同时对存量真值表做第一批字段级重核。**

前置事实（本轮实证）：`spec` 三份 lastVerified 停在 8-30 / 9-01 / 9-07，而 applet 已到 `42a473b`（9-14）；其间 `pages_coupon/coupon/create.vue` 改了 **16 次**、`update.vue` 13 次、`choose_type.vue` 12 次、`pages_card/card/create.vue` 7 次。**014 只订正了"说反了的口径"，本事务补"缺了的真值"。**

## 三、新口径 New Policy

1. **积分**（`spec/point-fields.json` 新建）：商家给单个顾客**手动**发/扣的记账；发放 **1~1000**（快捷值 1/5/10/20/50）、扣除无上限但不能超余额；类型分"发放/扣除"两方向、名称 ≤6 字、系统类型不可改删；须在「发放员工」名单内；流水不可撤销只能反向冲正；**积分兑换/抵现均未实现**（券创建页「积分兑换」是置灰占位）；**无版本门禁（免费版可用）**。
2. **会员权益（会员等级）**（`spec/member-fields.json` 新建）：商家给自己的**顾客**手动打的等级标签；**最多 5 个**、名称 ≤6 字、6 图标、11 色板；**无任何升级条件**；**不参与计价、不产生差异化权益**（一张全店共用的权益海报）；用途＝打标/筛选/群发圈人/顾客端徽章；**需专业版及以上（真值保留、内容不提）**。
3. **微信卡包**（`spec/coupon-fields.json` 新增 `wecard` 节 + `fields` 一行）：开关在**制券第一步选类型页**；仅代金/满减/折扣可同步；**八条开启须知**（商家满减券·0.01 元·365 天·不支持转赠·券包不支持一键加入·创建后不可再改·每人每券 100 张）；设置三页仅对新券生效；**创建后不可取消/不可改**；**需专业版及以上（真值保留、内容不提）**。
4. **仅新客户可领**（`coupon-fields` / `card-fields` 各加一行）：判定＝「该商户下从未领过优惠券、券包、次卡」；券包发放时强制关闭；**需标准版及以上（真值保留、内容不提）**。
5. **群发**（`facts.features.mass`，两种不可混讲）：企微客户群发（渠道，**成员须在群发助手确认**）≠ 群发优惠券（按等级圈人、每人 1 张、**每周仅一次**、不可撤回）。
6. **存量字段重核（第一批）**：优惠券表修正 5 处过期（「开启核销活码」→「开启动态核销码」、限领总量 1~100 张、有效期/封面张数**随版本档位**、手气券示例文案、发放方式补第 4 项占位）＋ 2 条新联动；次卡的完整重核**留待下一批**（见 §十二）。
7. **玩法版图同步**（`knowledge/玩法版图.md`）：按其自述"功能原子必须以当前 Product Truth 为准"，新增 ⑦发放承载族 ⑧新客圈定族，并把积分/会员等级/会员权益海报并入 ⑥客户资产族。

## 四、Replace

- `knowledge/玩法版图.md` §一 功能原子库：⑥客户资产族扩 3 条，新增 ⑦⑧ 两族。
- `spec/coupon-fields.json`：5 处过期字段修正 + 2 行新增 + `wecard` 节新增。

## 五、Remove

- **无删除**。不删任何既有真值、不删任何闸门、不改任何检查器。
- 明确不做：**发票 / 广告位 / 推荐位**（用户 13:56「没必要用」）；对账发现的 spec 内部命名不一致（另案）；次卡表的完整重核（下一批）。

## 六、Preserve

- 三份既有 `_meta.lastVerified` 中，`facts.json` / `redlines.json` 不动；**`coupon-fields.json` 的 lastVerified 因本次做了字段级重核与补充，更新为 2026-09-17**（这是本事务唯一前推的时间戳，理由：该表本次被逐条重核并补齐）。
- `facts.constraints` 全部数值不动（次卡 1~1000、积分 1~1000 均维持）。
- 两份新表**不写"需专业版/标准版/企业版"进内容口径**——版本门禁只作为真值层字段存在（`forbidden_claims #11`）。
- `card-fields.json`、`facts.json` 的 `positioning`、`R2`/`R6` 等 Owner 本事务不动。
- `redlines.json` 不动（014 已同步过 core；本轮新增能力无新增禁词）。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `spec/point-fields.json` | Product Truth | ADD | 新建；14 条字段 + hardRules + notThis + unverified | DONE |
| `spec/member-fields.json` | Product Truth | ADD | 新建；10 条字段 + hardRules + notThis + unverified | DONE |
| `spec/coupon-fields.json` | Product Truth | REPLACE+ADD | 5 处修正 + 2 行新增 + `wecard` 节 + `linkages` +2 + `unverified` +3 | DONE |
| `spec/facts.json` `features` | Product Truth | ADD | 新增 `point` / `member` / `wecard` / `mass` 四键（能力级登记） | DONE |
| `knowledge/玩法版图.md` §一 | 组合视角 Owner | REPLACE | ⑥族 +3 条；新增 ⑦⑧ 两族；注明真源落点 | DONE |
| `spec/card-fields.json` | Product Truth | PRESERVE | **本轮不动**（次卡完整重核留下一批，agent 报告已留档） | DONE |
| `spec/redlines.json` | 红线真源 | PRESERVE | 零改动 | DONE |
| `scripts/*.mjs` | 检查器 | PRESERVE | 零改动 | DONE |
| `docs/changes/active/CHANGE-20260917-015-*.md` | 本事务 | ADD | 本文件 | DONE |

## 八、Migration Plan

1. 三路并行只读取证（会员等级 / 积分+版本门禁 / 微信卡包·仅新客·群发）＋ 存量真值表逐条核对。
2. 新建两份真值表；扩展 `coupon-fields`；扩展 `facts.features`；同步玩法版图。
3. 验证：JSON 合法性 + `check-facts` / `check-redlines` / `check-change-contract` / `check-doc-references` / `gate-all`。
4. 回填 §九 / §十二（**不写 CLOSED**）。

## 九、Mechanical Checks

- JSON 合法性：`point-fields` / `member-fields` / `coupon-fields` / `facts` 均 `json.load` 通过。
- 落点核验：`facts.features` 键序含 `point/member/wecard/mass`；`coupon-fields.fields` 55 → 57 条、`linkages` 9 → 11 条、新增顶层 `wecard` 节。
- 判定零变化：`check-facts` / `check-redlines` exit 0；`gate-all` 迁移中一度 `3/15`，**当场修掉后回到 `2/15` 且红项构成逐项一致**。
  - **上屏真实性闸门当场抓到一处真错**：我把 `fields` 里的「开启核销活码」改成「开动态核销码」，但 `createGroups` 的分组行名里还留着一处旧名（还有一处是**列表里的裸字符串**，第一版递归替换函数只处理了 dict 值、漏掉了裸字符串元素）→ 闸门报「真值表里有 1 个名字在目标产品源码中全局查无此文案」。**这正是该闸门的职责**（"表里的假名字会被后续每一片照抄"），已修正，最终 `真值表自证 ✅ —— 优惠券+次卡共 76 个字段名 + 68 个有效分组行名逐字命中`。
- **机器覆盖缺口（登记）**：`check-ui-truth` 的扫描面目前是**优惠券 + 次卡两张表**；本轮新增的 `point-fields.json` / `member-fields.json` **尚未纳入该闸门的扫描面**（其字段名暂无机检，只能靠人工回溯 `文件:行号`）。扩扫描面属改检查器，另案。
- 事实零改动：`facts.constraints` 数值、`redlines.json`、`scripts/` 均 0 行改动。
- 版本门禁写法核验：两份新表与 `wecard` 节均把门禁放在**真值字段**（`versionGate` / `limits`），并明写"对外不提（forbidden_claims #11）"，未把版本写进任何 `onScreen` 文案。
- 契约闸门：`check-change-contract` PASS（含本契约）。

## 十、Negative / Semantic Counterexample

**反例 1（把版本门禁写进内容）**：讲微信卡包时顺带说"专业版就有这个功能"。
**拦截层**：§三 第 2/3/4 条——门禁只在真值层 `versionGate` 字段；`forbidden_claims #11` 明令不提。

**反例 2（把会员等级讲成常规会员体系）**：写"消费积分自动升级等级""不同等级不同折扣"。
**拦截层**：`member-fields.json` `notThis` 五条 + `hardRules`"没有任何升级条件"；与 `forbidden_claims #7` 的禁止宣传项一一对应。

**反例 3（把积分写成积分商城）**：写"积分当钱花""积分兑换商品"。
**拦截层**：`point-fields.json` `hardRules`"积分兑换即将上线、券创建页为置灰占位"+ `notThis`"不是积分商城"。

**反例 4（把两种群发混成一种）**：写"一键群发给所有客户"。
**拦截层**：`facts.features.mass` 明写两种不可混讲；C1 须成员确认、C2 每周仅一次。

**反例 5（因为"真值要准"就把 1~1000 改掉）**：次卡次数上限随版本档位，就把 `facts.constraints` 的 1~1000 改掉。
**拦截层**：§六 —— `constraints` PRESERVE；对外口径维持 1000（用户 13:12 裁定），档位差异已在 013 的 `card-fields.offScript` 登记。

**反例 6（顺手把次卡表重核一起做、或把发票/广告位/推荐位登记进来）**。
**拦截层**：§五 明列为"不做"；次卡重核属下一批，发票/广告位/推荐位用户明示"没必要用"。

**反例 7（给新功能另立第二真源，比如直接抄 MCP 能力文档）**。
**拦截层**：§三 全部条目均以 **applet 源码 `文件:行号` + 逐字原话** 取证；外部能力文档仅作交叉印证（微信卡包一条与 MCP 逐字吻合，作为可信度佐证而非来源）。

## 十一、Real Output Verification

**声明（二选一，机器可读，必填）**：本事务到底需要什么真实产物，由本事务自己声明，机器不猜。

```text
- Real Output 声明：`not-applicable`
- 理由：本事务只新增/订正 Product Truth 与组合视角的真值登记，不产出、不修改任何视频画面 / 分镜 / Remotion 组件 / 渲染产物。
```

- 真实关键帧/短片：不适用
- 人工验收判据：四份 JSON 合法；新表条目可逐条回溯到 `文件:行号`；`gate-all` 判定与红项构成零变化
- 结果：PASS（not-applicable）

## 十二、Closure Report

- 已修改：`spec/point-fields.json`（新建，14 条字段）、`spec/member-fields.json`（新建，10 条字段）、`spec/coupon-fields.json`（5 处过期修正 + `fields` ＋2 行 + `wecard` 节 + `linkages` ＋2 + `unverified` ＋3 + `lastVerified` 前推 2026-09-17）、`spec/facts.json`（`features` ＋ `point/member/wecard/mass` 四键）、`knowledge/玩法版图.md`（⑥族 ＋3 条、新增 ⑦发放承载族 ⑧新客圈定族）、`docs/changes/active/CHANGE-20260917-015-*.md`
- 已废止：无
- 已保留：`facts.constraints` 全部数值（次卡 1~1000 维持，为对外口径上限）；`card-fields.json`（本轮不动，完整重核留下一批）；`redlines.json`、`scripts/`、`spec/product-truth/` 快照零改动；`R2`/`R6` 等其余 Owner 零改动
- 影响面：`9 / 9`
- 旧口径扫描：PASS —— 新表全部以 `applet` 源码 `文件:行号` ＋ 逐字原话取证，未抄外部能力文档当来源；三处新条目明写「外部能力文档仅作交叉印证」不适用（本轮未引用 MCP 文本作证据，仅用作可信度对照）
- 机械检查：PASS —— 四份 JSON 合法；`facts.features` 键序含 `point/member/wecard/mass`；`coupon-fields.fields` 55→57、`linkages` 9→11、新增顶层 `wecard` 节；`check-facts` / `check-redlines` exit 0；`check-change-contract` PASS；`gate-all` 最终 `2/15` 且红项构成逐项一致（迁移中一度 3/15，当场修掉，见 §九）
- 负向测试：PASS —— **上屏真实性闸门当场抓到一处真错**（`createGroups` 分组行名残留旧名「开启核销活码」，源码已改「开启动态核销码」；其中一处是列表裸字符串，第一版递归替换漏掉）→ 修正后 `真值表自证 ✅ 76 个字段名 + 68 个分组行名逐字命中`。这条证明"改表必须让闸门复跑"不是形式要求
- 语义反例：PASS —— §十 七个反例逐条对照本轮实现：① 版本门禁写进内容 —— **未发生**（门禁只落在真值层 `versionGate`/`limits`，两份新表明写"对外不提"）；② 会员等级讲成常规体系 —— **未发生**（`notThis` 五条 ＋ `hardRules`"没有任何升级条件"）；③ 积分讲成积分商城 —— **未发生**（`hardRules`/`notThis` 双保险）；④ 两种群发混讲 —— **未发生**（`mass` 键明写"两种，不可混讲"）；⑤ 把 1~1000 改掉 —— **未发生**（constraints PRESERVE，实体核对仍为原值）；⑥ 顺手做次卡重核/登记发票广告位推荐位 —— **未发生**（§五 明列）；⑦ 另立第二真源 —— **未发生**（全部以源码 `文件:行号` 取证）
- 真图/成片：N/A（not-applicable，见 §十一）
- 本次新增红：**0** —— 最终 `gate-all` 为 `2/15` 且红项构成逐项一致；迁移中的第 3 道红系本人写入的字段名错误，属**闸门正常拦截**，已当场修正

**结论：NOT CLOSED**

**未做（下一批，已留证据）**：
1. **`spec/card-fields.json` 完整重核**：本轮实证需补「仅新客户可领」「券内容图片上传（≤9 张）」「通卡/权益卡版本门禁与角标」「使用须知清空按钮」，且「每张包含次数」「有效期」上限已随版本档位动态化；另 2 条需实测（转赠默认值、到期提醒默认值）。
2. `coupon-fields.createGroups` / `fields[].src` 的**行号漂移**重跑机检（新增行导致整体后移）。
3. `knowledge/爆款文案技能包/knowledge/cases.jsonl` 是否需按新能力补充语料（属传播研究 Owner，另案）。
4. 对账顺手发现的 spec 内部命名不一致（另案）。

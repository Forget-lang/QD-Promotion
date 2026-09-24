# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260924-048`
- 标题：证据型引用体检（① 部分执行）＋ archive 规范残留收口（② 完成）＋ S3 立项（③ 登记）
- 负责人：用户（方向）／AI-B（侦察、契约、迁移、验证）
- 范围：`project`
- 状态：`CLOSED`
- 触发：用户 2026-09-24「① 那三项做吧」（三项＝证据型 src 32 处／archive 规范残留／S3）

## 二、Goal

一句话：清掉三项挂账里**可安全执行**的部分——archive 规范残留收口（完成）、证据型引用体检并修正**可确证**的漂移（部分，方法经实测校正）、S3 登记为下一笔独立事务。

## 三、新口径 New Policy

1. **证据型引用不自动改写**：`spec/coupon-fields.json` 的 `linkages[]`／`verifyPageKeyInfo`／`statPageKeyInfo`／`messageReminders`／`customerSidePhrases`／`offScript` 内的 `src` 是**多段/跨文件/带散文**的人工引用（含简写路径与 `+ facts.*` 等非源码指向）。**实测结论：045 的机械回写法不适用**（会让范围膨胀到数百行或误命中）⇒ 一律**逐条人工定位**（锚点＝源码真实 watch／模板条件行），改前必核、改后记 `_meta`。
2. **archive 规范残留的收口方式（沿用 034 判定）**：去规范框架（"长期有效／成文在此／固定机制／每片照做"）＋一句边界声明＋指向唯一 Owner；**历史正文保留不回填**。

## 四、Replace

| # | 位置 | 旧 | 新 |
|---|---|---|---|
| 1 | `spec/coupon-fields.json` `linkages[0..7,9,10]` 的 `src` | 09-15 版行号（如 `594-603,701-706`／`269-270`／`190-195`…） | 按源码实际锚点重定位（如 `703-718`〔issueType watch〕／`313,331-334`／`215-226` 等 10 条） |
| 2 | 同上 `_meta` | 无 | 增 `lastEvidenceSweep` 溯源（本轮已修 10／待人工 1／未展开 21） |
| 3 | `outputs/archive/官网资源库落地规划.md` 头部 | "本文只记当前官网现状与**固定机制**"＋"**三层采信用法（长期有效，成文在此）**" | 加**边界声明**（archive 只作历史证据、不承担当前规则）＋"三层采信用法**属主＝`docs/internal/内容资源调用协议.md` §3**，此处为当时的记录" |
| 4 | 同上 §4 标题与内文 | "（每片开工的官网动作 · **固定机制** · 自片 2 起执行）"／"每片固定清单照跑" | "（当时记录的开工动作 · 历史）"＋指针行（现行属主＝协议 §2／§4）；"（当时约定：每片照清单跑）" |

## 五、Remove

**Remove**：上述旧行号与规范框架措辞。

**不并入本事务（登记为独立事务）**：
- **① 剩余 22 条**：`linkages[8]`（候选池逻辑未定位）＋ `verifyPageKeyInfo{,.items}`／`statPageKeyInfo{,.labels}`／`messageReminders`／`customerSidePhrases{,.items}`／`offScript.items` 21 条——按 §三.1 的逐条人工法续做。
- **③ S3 批**（扫描面分层＋`§X~§Y` 范围解析＋正向防回流）：检查器能力建设，**下一笔独立事务**（含正负向测试；解开"旧话头登记 ↔ archive 正文互斥"）。

## 六、Preserve

- `outputs/archive/**` 历史正文（本轮只去规范框架，不删不填）；`docs/changes/**`；`spec/` 其余字段与引文；爆款语料。
- 协议 §3（三层采信的现行属主）零改动。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 归属阶段 |
|---|---|---|---|---|
| `spec/coupon-fields.json`（10 条 src ＋ `_meta`） | 真值表引用 | REPLACE | 逐条对源码实测行＋JSON 校验＋闸门 | 批 1 |
| `outputs/archive/官网资源库落地规划.md`（头部＋§4） | 历史证据 | REPLACE（去规范框架） | 复扫"长期有效／固定机制"归零＋引用闸门 | 批 2 |
| ①剩余 22 条／③ S3 | 挂账 | PRESERVE（登记） | 本契约 §五 | 登记 |

## 八、Migration Plan

1. 批 1：逐条定位 `linkages` 锚点（源码 watch／v-if 实测）→ 改 `src` → 补 `_meta`。
2. 批 2：archive 头部与 §4 收口。
3. 复跑 `check-doc-references`／`check-change-contract`／`gate-all`。

## 九、Mechanical Checks

- 引用保真：10 条新范围逐条与源码实测行核对（`703-718` issueType watch／`719-726,545` isMobileLimit→isGetMobile＋禁用开关／`811-818` onTransferChange／`578-580` 仅公开领取显示／`313,331-334` 三行显隐／`178,200-215` 有效期类型与起止行／`215-226` 可用时段定制块／`569,801` 转发封面第一张／`703-718,884-891` 券包联动／`428-430` 卡包开启后转置灰）。
- archive 复扫：`长期有效`／`固定机制` → **0**。
- `check-doc-references` 0 硬失败；`check-change-contract` PASS；`gate-all` 与 048 前逐行一致。

## 十、Negative / Semantic Counterexample

- **负向（度量不可靠已实证）**：首轮自动改写把 `linkages[6]` 判成漂移（实测原范围 `190-195` 仍含"有效期"标签）——**度量噪声**；而 `linkages[4]` 判"建议 313"经人工核对**确为真漂移**。⇒ 拦截：本事务放弃自动改写，只做人工确证后修改；修改后逐条复核。
- **语义反例**：把 archive 的规范框架去掉时顺手"修历史"（回填当年读数）——违反"历史正文不回填"。拦截：只动框架措辞与指针，数据零改动。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务范围＝引用体检与 archive 框架收口，不产出关键帧或成片。
```

## 十二、Closure Report

- 已修改：`spec/coupon-fields.json`（`linkages` 10 条 `src` 重定位＋`_meta.lastEvidenceSweep`）、`outputs/archive/官网资源库落地规划.md`（头部边界声明＋§4 去"固定机制"＋指针）
- 已废止：`linkages` 旧行号（09-15 版）；archive 的"长期有效／成文在此／固定机制"规范框架
- 已保留：archive 历史正文与数据零改动；其余 22 条证据型引用与 S3 保持挂账；协议 §3 零改动
- 影响面：`3 / 3 已处理`（§七 逐行）
- 旧口径扫描：**PASS**（archive 内 `长期有效`／`固定机制` 复扫 0；`评分器`／`拆零件` 仍仅存废止注记）
- 机械检查：**PASS**（`check-doc-references` 0 硬失败；`check-change-contract` PASS(49)；`gate-all` 13/15、2 项跳过、无红灯、与 047 基线行级零漂移；`git diff --stat` ＝ `spec/coupon-fields.json` 10 行替换＋`_meta` 1 处）
- 负向测试：**PASS**（度量不可靠的双向实证已留在 §十：`linkages[6]` 假阳性 vs `linkages[4]` 真漂移；本轮改为"人工确证才改"，10 条均附实测锚点）
- 语义反例：**PASS**（archive 只改框架与指针，历史数据零改动——diff 逐行核对）
- 真图/成片：N/A（Real Output 声明为 `not-applicable`）
- 本次新增红：**0**

**结论：CLOSED**

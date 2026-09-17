# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260917-021`
- 标题：deprecatedTerms 消费端接入（旧口径防回流机检）
- 负责人：AI（用户 2026-09-17 17:58 拍板：020 保持 VERIFYING，拆事务补消费端）
- 范围：`global`
- 状态：`CLOSED`

## 二、Goal

为 `scripts/check-doc-references.mjs` 接入 `ref-registry.json` 的 `deprecatedTerms` 消费端——使"已登记旧口径话头在扫描面回流"成为可机检的硬失败，补齐 CHANGE-20260917-020 §九 负向验收（T1/T2）的前提。

## 三、新口径 New Policy

1. 扫描面（`registry.extraDocs` ＋ `docs/docsDir` 下的 md）内正文出现**已登记旧话头**＝**硬失败**，归入文档引用闸门①类输出，并附登记理由（`desc`）。
2. **匹配带边界**：term 前后不得紧邻拉丁字母/数字（`(?<![A-Za-z0-9])…(?![A-Za-z0-9])`）——防子串误伤（判例：`docs/internal/整改作战总纲.md`「典型反例：合法 `R10-产品事实源解析协议.md` 被旧正则误识别为 `10-...`。此时应修检查器，而不是改掉合法文件名」）。
3. **代码围栏内不扫**（与既有各层一致）。
4. 登记表 `term` 必须**足够精确**（中文无字符级边界，须以更长的旧话头原文作 term，例如不得以「痛点一句话」拦「核心痛点一句话」这类合法栏位名）。
5. `deprecatedTerms` 自此成为"清旧"的**机器强制**层（原仅有登记、无消费端——CHANGE-020 §十三 实测记录）。

## 四、Replace

| 旧口径 | 位置 | 新口径 |
|---|---|---|
| `deprecatedTerms` 只登记、无消费（"把清旧从自觉变脚本强制"名不副实） | `scripts/` 全仓（020 §十三 实测） | 由 `check-doc-references.mjs` 新增扫描段消费，回流即硬失败 |

## 五、Remove

- 无删除；**不改变**任何既有检查层的判定（引用断链 / 退役文件名 / 宪法铁律 / 高危口径重复），只新增一层。

## 六、Preserve

- `check-doc-references.mjs` 既有四类检查逻辑与其输出结构（新增层并入①硬失败，不新起分类）。
- `ref-registry.json` 其余键（`extraDocs` / `aliases` / `caliberOwners` / 各豁免表）与全部既有登记项（除 §七 所列一处 term 精确化）。
- CHANGE-020 已完成的迁移内容及其余全部资产。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `scripts/check-doc-references.mjs` | 检查器 | ADD（新增扫描段） | 负向测试：写入登记话头即硬失败；代码围栏内不误报 | DONE |
| `scripts/ref-registry.json` `deprecatedTerms[「痛点一句话」]` | 检查器数据 | REPLACE（term 精确化为「痛点一句话 + 选功能点」） | 全扫描面 0 误报（「核心痛点一句话」合法栏位名不再命中） | DONE |
| `docs/changes/template.md` | 契约结构 Owner | PRESERVE | 核查结论：本事务不改契约结构（仅新增闸门扫描层），无同步事项 | DONE |
| CHANGE-20260917-020 契约 §九/§十二 | 变更事务 | REPLACE（回填 T1/T2/T3 实测） | 020 重跑负向测试后 §十二「负向测试」由 PARTIAL 改 PASS | DONE |
| 全闸门基线 | 机制 | PRESERVE | `gate-all` 红灯构成不超迁移前状态（文档引用 2 处 g11 生产未完成项） | DONE |

## 八、Migration Plan

1. 接入消费端：`check-doc-references.mjs` 新增 `deprecatedTerms` 扫描段（边界匹配 + 跳过代码围栏）。
2. 数据精确化：`deprecatedTerms` 的「痛点一句话」→「痛点一句话 + 选功能点」（消除中文子串误报）。
3. 全扫描面回归：确认 26 条既有 term 零误报、零新增红。
4. 负向测试实测（见 §九），记录退出码。
5. 回填 CHANGE-020：重跑 T1/T2/T3 并更新其 §九/§十二 结论。

## 九、Mechanical Checks

- 旧术语/旧口径扫描：本事务即该层的实现与验证（自指闭环），以负向测试为准。
- 旧组件/旧布局扫描：不适用（不动视觉）。
- 文档引用检查：`check-doc-references` **0 处非 g11 类命中**（g11 生产未完成项除外）。
- 其他相关闸门：`check-change-contract` PASS；`gate-all` 红灯不超基线。
- **负向测试**：
  - **N1**：扫描面写入「18 条通则全链参与」→ 硬失败（exit 1 且命中该项）。
  - **N2**：扫描面写入「每片至少各落一条」→ 硬失败。
  - **N3（不误报）**：写入「18 条通则作为候选研究索引，按需回查」→ **不**命中。
  - **N4（子串不误伤）**：写入合法引用 `docs/internal/R10-产品事实源解析协议.md` → **不**命中「10-产品事实源解析协议.md」。
  - **N5（代码围栏不扫）**：登记话头写在 ``` 代码块内 → **不**命中。

## 十、Negative / Semantic Counterexample

- **反例**：把旧话头拆字或用同义改写（如「18 条通则全链参与」→「十八条通则全链条参与」）绕过登记表匹配——**本层按 term 字面拦，抓不住**；应由 CHANGE-020 的语义层（产物层《表达形态选择及理由》＋人工判）与后续新增 term 登记共同覆盖。本节如实声明该边界，不声称本层可拦一切变体。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务只改检查器逻辑与闸门注册表数据，不产出、不修改任何内容产物 / 画面 / 分镜 / 渲染件；其真实有效性由负向测试 N1~N5 的实测退出码承担（属 §九 机械检查项），不存在可验收的内容类真实产物。
```

- 真实关键帧/短片：不适用
- 人工验收判据：N1~N5 实测结果与 `gate-all` 红灯构成
- 结果：PASS（not-applicable）

## 十二、Closure Report

- 已修改：`scripts/check-doc-references.mjs`（新增 `deprecatedTerms` 扫描段，含边界匹配与代码围栏跳过）；`scripts/ref-registry.json`（1 条 term 精确化）
- 已废止：无
- 已保留：既有四类检查层、其余全部注册表键与登记项
- 影响面：`5 / 5`
- 旧口径扫描：PASS —— 26 条既有 term 全扫描面零误报（迁移前实测 3 处误报：`R10-…` 子串 ×2、`核心痛点一句话` ×1，均已消除）
- 机械检查：PASS —— `check-change-contract` PASS；`gate-all` 红灯 1 道（文档引用 2 处＝g11 分镜稿与 R9 卡，随 g11 第 4／4.5 步产出后消除），**本次新增红 0**
- 负向测试：PASS —— N1 命中=1（«18 条通则全链参与»，硬失败）／N2 命中=1（«每片至少各落一条»）／N3 命中=0（不误拦候选表述）／N4 命中=0（`R10-…` 子串不误伤）／N5 命中=0（代码围栏内不扫）；基线回归：既有 term 误报 3 处 → **0**
- 语义反例：PASS（边界已如实声明，见 §十）
- 真图/成片：N/A（not-applicable，见 §十一）
- 本次新增红：**0**

**结论：CLOSED**

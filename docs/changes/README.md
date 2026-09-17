# 全局变更事务库

本目录用于记录会影响全局方法、规则、共享组件或跨行业生产方式的变更事务。

## 使用方式

任何全局变更都必须经历：

`提出 → Change Contract → Impact Map → Migration → Verification → Closure`

- `active/`：正在执行、尚未 CLOSED 的变更。
- `closed/`：已经完成并可复核的变更。
- `template.md`：新建变更事务时的模板。
- `legacy-compatibility.json`：历史兼容登记表（本文件为其 Owner）。

## 历史兼容登记表

`legacy-compatibility.json` 只登记「经实测确认、确属旧格式、且不补历史文档」的已归档事务。

- **Owner / 数据 / Checker**：Owner 为本文件；数据在 `docs/changes/legacy-compatibility.json`；检查由 `scripts/check-change-contract.mjs` 执行。
- **条目字段**：`changeId`、`legacyReason`、`legacyFormat`、`scopeOfExemption`，缺一即失败。
- **`scopeOfExemption` 必须逐项列出**，取值限于：`旧口径扫描`、`机械检查`、`负向测试`、`语义反例`、`本次新增红`、`Real Output Verification 章节`。**不支持 blanket 豁免**（空清单直接判失败）。
- **清单自身受检**（由 checker 强制）：`changeId` 必须真实存在于 `closed/`；不得指向 `active/`；不得重复；字段不得为空；豁免项必须在允许取值内。
- **历史兼容 ≠ 当前标准豁免**：未登记的事务一律按当前关闭证据标准判定。
- **新事务不得走豁免**；豁免项一旦补齐须删除对应条目。
- 条数由实测决定，**不预设目标值**。

## 单片整改不进入这里

只影响单条视频的文案、分镜、静帧或专属代码，不改变全局方法时，按现有单片流程处理。

## CLOSED 的最低条件

1. 影响面已经逐项处理。
2. 新口径只有一个权威属主。
3. 被替代口径已经清理或登记为不可回用。
4. 机械检查通过。
5. 至少一个故意违规的负向/反例测试通过。
6. 涉及视觉的变更至少通过一屏真实关键帧或短片验收。
7. 本次变更没有新增未解释的红灯。

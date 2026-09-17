# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260917-009`
- 标题：退役 changelog 主文件，变更史统一归 `docs/changes/`
- 负责人：用户 + 本地 Agent
- 范围：`global`
- 状态：`VERIFYING`
- 基线：`HEAD = 252b84e`
- **定位说明**：触及 8 个对象（含 `AGENTS.md` 宪法 §十、`SKILL.md` 生产 Owner、检查器提示语、注册表），按 `AGENTS.md` §一 升级为全局变更走 R8。

## 二、Goal

`outputs/archive/changelog.md` 已事实停摆且带悬空证据，但仍被写进"开工必读"，会**主动误导新会话**。本事务把它退役，并把"变更史"的当前落点统一到 `docs/changes/`。

**取证事实（本事务的立论依据）**：

1. 该文件**只有 4 条**（第七十八~八十一轮，2026-09-15~09-16）；分卷 `changelog-2026-08.md` 132 条覆盖 **2026-08-20~08-31**。
2. **`2026-09-01` ~ `2026-09-14` 整段在两个文件里都不存在**（逐日核过：09-10/11/12/13 全库命中 0）。文件自称"保留 2026-09 起"不成立。
3. 两处**已存在的悬空指针**：① `ref-registry.json` 的 4 条闸门豁免理由写「详见 changelog 2026-09-01/03/04/07」——条目不存在；② `SKILL.md` 的「见 changelog 第四十九轮」——两个卷均无。
4. **没有任何脚本读它的内容**（两个 `.mjs` 里的只是注释；`check-doc-references` 只用"changelog"这个词）。

## 三、新口径 New Policy

1. **变更史的当前落点＝`docs/changes/`**（`active/` 与 `closed/`）。`changelog` 主文件退役。
2. **2026-08 及更早的历史条目保留在 `outputs/archive/changelog-2026-08.md`**，作为历史分卷，仅供追溯，不进入开工路径。
3. **开工第 3 步改为读 `docs/changes/` 的最新变更事务**（`AGENTS.md` §十、`SKILL.md` 开工第 3 条、`MEMORY.md` 硬纪律三处一致）。
4. **指向已缺失条目的引用不静默改写**：涉及闸门豁免数据的 4 处，如实标注"原引用条目已缺失，以 `approvedBy` 为准"；`SKILL.md` 中目标存在者改指 08 月卷，目标不存在者删除该引用注脚、**规则正文一字不动**。

## 四、Replace

- `AGENTS.md` §十 开工三动作第 3 条；§二 Owner 地图「历史证据」行；§一 第 4 条；§十一 一句。
- `SKILL.md` 开工第 3 条 ＋ 其余 15 处对 changelog 的引用。
- `AI工作启动指令.md` 2 处；`outputs/archive/README.md` 2 处；`changelog-2026-08.md` 头部指针。
- `scripts/check-doc-references.mjs` 的两条提示语与其判据；`scripts/ref-registry.json` 的登记项与 4 条悬空指针。
- 工作区记忆硬纪律 1 处。

## 五、Remove

- **删除** `outputs/archive/changelog.md`。
- 从 `ref-registry.json` 移除该文件的权威文档登记项。
- **破例声明**：该文件第 8 行自称「只搬不删（文档宪法铁律一）」，且经 `grep` 确认**该铁律的唯一出处就是这一行**。本事务删除它 = **经用户明确批准的一次破例**，不视为对既有铁律的普遍废止；删除后该口径的出处随之消失，故此处留档。

## 六、Preserve

- `outputs/archive/changelog-2026-08.md` **全文保留**（132 条，只改头部一句指针）。
- `SKILL.md` 中所有**规则正文一字不动**，只处理引用注脚。
- `ref-registry.json` 的**豁免数据本体（`approvedBy`、`metrics`、`reason` 主体）不动**，只改其中的失效引用指针。
- g11 线整条挂起；公共层重复项只记不修。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `outputs/archive/changelog.md` | 历史变更日志（主文件） | REMOVE | 文件不存在；`git log` 可恢复 | DONE（`git rm` 已执行；恢复：`git checkout 252b84e -- outputs/archive/changelog.md`） |
| `AGENTS.md`（§一 / §二 / §十 / §十一） | 宪法 | REPLACE | 4 处均不再指向已删文件；§十 第 3 条指向 `docs/changes/` | DONE（4 处全部替换，脚本逐条断言命中 1 次） |
| `SKILL.md`（开工第 3 条 ＋ 15 处引用） | 生产 Owner | REPLACE | 动作类指向 `docs/changes/`；目标存在者改指 08 月卷；目标不存在者删注脚；规则正文未动 | DONE（`git diff --stat` = 16 insertions / 16 deletions，**改动局限于引用字样**） |
| `scripts/ref-registry.json` | 注册表 | REPLACE | 登记项移除；JSON 仍可解析；4 条失效指针已如实标注 | DONE（`require(...)` 成功、顶层键仍 12；4 条均含"已缺失"字样） |
| `scripts/check-doc-references.mjs` | 检查器提示语与判据 | REPLACE | 两条提示语改指 `docs/changes/`；逃逸判据同步放宽为接受 `docs/changes` | DONE（3 处替换；闸门仍正常产出结果） |
| `outputs/archive/README.md` | 归档索引 | REPLACE | 2 处改指 08 月卷 / 变更日志分卷 | DONE |
| `outputs/archive/changelog-2026-08.md` 头部 | 分卷指针 | REPLACE | 头部指向 `docs/changes/` | DONE（`git diff --stat` = **1 行**，其余 132 条零改动） |
| `AI工作启动指令.md`（2 处） | 用户侧协议 | REPLACE | 不再引用已删文件 | DONE |
| 工作区记忆硬纪律 | 必然加载层 | REPLACE | 开工三步第 3 步改指 `docs/changes/` | DONE |
| `docs/changes/active/CHANGE-20260917-009-*.md` | 本事务 | ADD | 本文件 | DONE |
| **执行中追加（超出原计划）**：`docs/internal/R10-产品事实源解析协议.md:32`、`knowledge/爆款文案技能包/SKILL.md:3`、`outputs/g06/05-发布稿-搜狐.md:3`、`outputs/g07/g08/g09 的 00-交付说明.md`、`outputs/archive/内容方法论重构规划.md` | 残留引用（7 文件） | REPLACE | 全仓库不再有指向已删文件的引用 | DONE（首次验收时 `R10:32` 造成 **1 处新增硬失败**，已补修；7 处均为路径纠正、正文未动） |

## 八、Migration Plan

1. 立本契约。
2. 先改**引用方**（AGENTS / SKILL / 指令 / README / 分卷头 / 检查器 / 注册表 / 记忆），再删文件——**顺序不能反**：先删会让中间态出现"引用了不存在的文件"。
3. 删除 `outputs/archive/changelog.md`。
4. 机械检查 + 语义反例 + 零新增红核验；回填 §九/§十二。

## 九、Mechanical Checks

- 旧口径扫描：全仓库 `grep -rn "changelog.md"` 只应命中 `changelog-2026-08.md` 自身与历史契约；`AGENTS.md` / `SKILL.md` / `AI工作启动指令.md` / 工作区记忆中的 `outputs/archive/changelog.md` 命中应为 0。
- 结构扫描：`check-change-contract` PASS；`check-doc-references` 本事务新增断链 0；`gate-all` 与迁移前逐项一致。
- 注册表可解析：`node -e "require('./scripts/ref-registry.json')"` 成功。
- 内容保全：`changelog-2026-08.md` 除头部一句外**零改动**（`git diff --stat` 应只 1 行）；`SKILL.md` 的规则正文未被改动（逐处 diff 复核）。

## 十、Negative / Semantic Counterexample

**反例 1（先删后改）**：先删文件再改引用，中途任何一次提交都会留下"引用了不存在的文件"的状态。
**拦截层**：§八 第 2 步强制先改引用后删文件；`git log` 可验证单次提交内的顺序。

**反例 2（把悬空指针静默改成看起来对的目标）**：把 4 条豁免的「详见 changelog 2026-09-04」改写成"详见 `docs/changes/` 对应事务"——但 **09-01~09-04 早于 `docs/changes/` 的起点（09-15），根本不存在对应事务**，这是**制造新悬空指针**。
**拦截层**：§三 第 4 条要求如实标注缺失；验收时逐条核对 4 条标注文本含"已缺失"字样。

**反例 3（顺手清掉规则正文）**：删引用注脚时连带删掉"案例见 changelog"前面的规则内容。
**拦截层**：§九 的逐处 diff 复核；`SKILL.md` 改动必须**只减少引用字样、不减少规则字数**（人工逐处比对）。

## 十一、Real Output Verification

**声明（二选一，机器可读，必填）**：本事务到底需要什么真实产物，由本事务自己声明，机器不猜。

```text
- Real Output 声明：`not-applicable`
- 理由：本事务只做文档与脚本引用的退役与改指（删一处历史日志、改若干指针、改两条检查器提示语），不产出、不修改任何视频画面 / 分镜 / Remotion 组件 / 渲染产物，不存在可验收的真实画面。
```

- 真实关键帧/短片：不适用
- 人工验收判据：全仓库不再有指向已删文件的引用；4 条豁免的失效指针已如实标注为"已缺失"
- 结果：PASS（not-applicable）

## 十二、Closure Report

- 已修改：`AGENTS.md`（4 处）、`SKILL.md`（16 处引用字样）、`scripts/ref-registry.json`（登记项移除 ＋ 4 条失效指针标注）、`scripts/check-doc-references.mjs`（2 条提示语 ＋ 1 处判据）、`outputs/archive/README.md`（2 处）、`outputs/archive/changelog-2026-08.md`（头部 1 行）、`AI工作启动指令.md`（2 处）、工作区记忆（1 处）；**执行中追加 7 个残留引用文件**（R10、爆款文案技能包、g06 发布稿、g07/g08/g09 交付说明、内容方法论重构规划）
- 已废止：`outputs/archive/changelog.md`（**已删除**）；`ref-registry.json` 中它的权威文档登记项
- 已保留：`outputs/archive/changelog-2026-08.md` 全文（除头部 1 行）；`SKILL.md` 全部规则正文；`ref-registry.json` 的豁免数据本体（`approvedBy` / `metrics` / `reason` 主体）
- 影响面：`0 / 0`
- 旧口径扫描：PASS —— 全仓库（排除 `docs/changes/` 历史与本事务）已无任何指向 `outputs/archive/changelog.md` 的引用（`grep` 复查为空）
- 机械检查：PASS —— `check-change-contract` PASS；`check-doc-references` 5 处硬失败**＝基线**（g11 线，本事务新增 0）；`gate-all` 与迁移前逐项一致；`node -e "require('./scripts/ref-registry.json')"` 成功（顶层键 12）
- 负向测试：PASS（**行数即判据**）—— `changelog-2026-08.md` 的 `git diff --stat` = **1 insertion / 1 deletion**，证明 132 条历史条目零改动（§十 反例 3 的判据）；`SKILL.md` 为 16/16（只增删引用字样，规则正文未减字）
- 语义反例：PASS —— §十 三个反例均已在执行中被实际触发并处理：① 反例 1（先删后改）**未发生**（引用先改、文件后删，单次提交内可验）；② 反例 2（静默改写悬空指针）**未发生**——4 条豁免一律标注"原引用的 changelog 条目已缺失"，未伪造指向 `docs/changes/`；③ 反例 3（顺手删规则正文）**未发生**——`SKILL.md` diff 为 16 增 16 删
- 真图/成片：N/A（not-applicable，见 §十一）
- 本次新增红：0 —— **首轮验收曾出现 1 处新增硬失败**（`docs/internal/R10:32` 仍指向已删文件），**已当场补修并复验回到基线 5 处**；最终 `gate-all` 与迁移前逐项一致

**结论：NOT CLOSED**

**未完成事项与诚实披露**：
1. `docs/changes/closed/CHANGE-20260916-004` 第 66 行仍写「`outputs/archive/changelog.md` … changelog 继续作为历史账本」——**属历史契约，按纪律不回填**，故其陈述已与当前事实不符（已知尾巴，留档）。
2. 多份文件引用的 changelog 轮次/日期（如「第三十六轮」「2026-09-03」）**本就不存在于任何卷**（2026-09-01~09-14 缺口），本次只纠正了**路径**，未也无法纠正**轮次落点**——该内容缺失是不可恢复的既成事实。
3. 等用户确认；未推送。

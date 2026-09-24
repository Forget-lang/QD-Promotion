# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260924-056`
- 标题：生产加固——T3 风格产物扫描面 ＋ styleId 声明规范 ＋ Shot 表两列 ＋ 历史片 Legacy 隔离
- 负责人：项目 AI（执行）／用户（方向与拍板）
- 范围：`global`
- 状态：`CLOSED`
- 来源：2026-09-24 全局整改后工程复盘审计（AI-A 架构委员会复核结论：多风格架构 PASS，进入 Production Hardening）

## 二、Goal

055 之后架构文本已收口，但新架构的判据**从未在生产对象上执行过**：`outputs/` 零 `styleId` 声明、零《导演稿》，两道核心闸门对 style 片是**空转绿**；且 `gate-all` 只扫片目录**顶层** mp4 与 `frames/`，风格包的专属产物（白板片落在 `outputs/{dir}/whiteboard/` 子目录）**扫不到**——文档说测了、实际没测。本事务把"新架构片一旦产出就会被真测"变成可执行事实，并把三处会直接产红／静默失效的文本缺陷修掉。

## 三、新口径 New Policy

1. **探针目标按风格认领真实寻址**：片 → 风格由 `ref-registry.styles.items[].piecePatterns` 认领（方案 C 不变）；**非缺省风格**片的产物在「认领命中的产物根」内递归寻址（不只片目录顶层）。缺省风格片维持既有顶层寻址（对 g06–g11 基线零漂移）。
2. **适用性按风格声明取值**：非缺省风格片的 `gate-all-safearea-observation` / `gate-all-motion-observation` 取值改由 `styles.items[].gateApplicability` 提供（`styleAppliesFor`），不再套用行业线默认；缺省风格片沿用线级声明。**教程线 × 非缺省风格 = 硬失败**（该合成规则按 AGENTS §二 须先专项定稿，本事务不发明）。
3. **空转绿必须显形**：探针"跳过"不再是静默绿灯——汇总层新增「未测清单」，逐条写明片、风格、适用性声明源与已搜索路径；且**产物已存在却仍判跳过 = 硬失败**（mp4 存在于产物根内 ⇒ motion 必须真跑；`frames/*.png` 存在 ⇒ safearea 必须真跑）。
4. **styleId 声明唯一格式与唯一值域**：格式＝`styleId: <已登记风格 id>`（内容输入包 `01-内容输入包.md` 声明）；值必须是 `ref-registry.styles.items[].id` 之一——未登记值一律硬失败（防拼写错静默变成一个"新风格"）。
5. **Shot 表模板以属主为准**：`remotion-components` 包 §③B 的 Shot 表字段表补齐 `Visual Metaphor` / `Peak Frame`，与属主 `R9-视觉映射表 §四` 13 字段一致；该表不再自称《视觉导演稿》（《导演稿》属 R9 §十五，唯一）。
6. **历史片隔离声明化**：`outputs/g06–g11` 内容零改动保留，但必须带机器可读的 Legacy 隔离标记，并由声明登记表承载——历史片"保留但不可回用"从口头纪律变为可核对声明。

## 四、Replace

| 被替代 | 说明 |
|---|---|
| `gate-all` 的顶层 mp4 / `frames/` 硬编码寻址 | 改为：缺省风格沿用顶层；非缺省风格按认领产物根递归 |
| `gate-all` 探针适用性只读线级 | 改为：非缺省风格片读风格声明（线×风格合成规则未定稿的线一律硬失败，不猜） |
| 探针静默跳过（`⏭️` 后无审计追索） | 改为：未测清单逐条留痕 ＋ 产物存在却跳过 = 硬失败 |
| `check-style-rotation` / `check-visual-shot-contract` 对 styleId **只做字符串提取不校验值域** | 改为：未登记 id 硬失败 |
| `remotion-components` §③B 11 字段 Shot 表 | 改为：13 字段（补 `Visual Metaphor`／`Peak Frame`） |
| 包内「产出《视觉导演稿》——Shot 表」 | 改为「产出 **Shot 表**」（《导演稿》唯一属主＝R9 §十五，不在风格包产出） |
| `whiteboard` 包 §⑦「批 4 完成前存在时差」陈旧免责句 | 改为：如实记明接线状态与实测消费方 |
| `whiteboard/engine/README.md`「当前为占位」 | 改为：已落地（脚本／许可／一键链在位） |
| `SKILL.md` frontmatter `8.0.1` | 改为与正文 `8.1.0` 一致 |
| 「纯 Remotion 片／实拍素材片／片类判定」 | 登记进 `deprecatedTerms`（SKILL 已宣告废止，此前未登记） |
| `video/src/data/g11.ts` 注释「SKILL §4.5 纯 Remotion 烧烤基准」 | 改为指向现属主（包 §③B「色彩基准」）＋去废止话头 |

## 五、Remove

- `gate-all` 中"找不到产物即打印 ⏭️ 跳过并计入通过"的静默路径（保留跳过语义，但必须进未测清单且与产物存在性对账）。
- `check-style-rotation` / `check-visual-shot-contract` 中"任何 `styleId: xxx` 字符串都算合法声明"的宽松读取。
- 包 §③B 的《视觉导演稿》命名与 11 字段表。

## 六、Preserve

- `outputs/g06–g11` 全部产物**零内容改动**（历史交付，只加一行隔离标记）。
- `outputs/archive/` 历史证据地位不变。
- 缺省风格（`remotion-components`）片与行业线的既有判据、阈值、豁免表全部不动（g11 双豁免照旧生效）。
- `AGENTS.md §九` 视觉隔离规则本体：不新写第二份，只在声明件内引用。
- 教程线方法层：零改动（本事务不为教程线预设任何取值）。
- Runtime Contract / Capability Matrix：**不扩大**（AI-A 明确留待下一阶段平台化）。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
| `scripts/content-lines.mjs` | 共享库（声明消费者） | ADD `scanPieceArtifacts`（按风格认领解析产物根＋产物枚举） | 负向测试 fixture 直调 | DONE |
| `scripts/gate-all.mjs` | 共享闸门（汇总层） | REPLACE 探针寻址与适用性解析；ADD 未测清单 | `gate-all` 实跑无新增红；fixture 负向测试 | DONE |
| `scripts/check-style-rotation.mjs` | 闸门脚本 | REPLACE styleId 值域校验；ADD 历史片隔离标记校验 | 负向测试：未登记 id 必拒 | DONE |
| `scripts/check-visual-shot-contract.mjs` | 闸门脚本 | REPLACE 导演稿节 styleId 值域校验 | 负向测试：未登记 id 必拒 | DONE |
| `scripts/ref-registry.json` | 声明源 | ADD `legacyPieces` 声明 ＋ `deprecatedTerms` 两条 | 契约闸门 | DONE |
| `SKILL.md` | 行业线方法 Owner | REPLACE styleId 声明格式；ADD 第 1 步内容输入包清单补 styleId 行 | 引用闸门 | DONE |
| `video/styles/remotion-components/SKILL.md` | 风格包（表达层） | REPLACE §③B Shot 表 13 字段＋去撞名 | 负向测试：缺列必拒 | DONE |
| `video/styles/whiteboard/SKILL.md` | 风格包 | REPLACE §⑦ 陈旧免责句 | 引用闸门 | DONE |
| `video/styles/whiteboard/engine/README.md` | 引擎说明 | REPLACE 占位描述 | 人工核对 | DONE |
| `outputs/LEGACY-ISOLATION.md` | 隔离声明件 | ADD（唯一属主） | 引用闸门扫描面（`extraDocs`） | DONE |
| `outputs/g06–g11` | 历史交付 | PRESERVE 内容 ＋ ADD 一行标记 | 标记命中 6/6 | DONE |
| `video/src/data/g11.ts` | 历史片源码注释 | REPLACE 失效指针 | 人工核对（该片不回渲） | DONE |
| `docs/internal/整改作战总纲.md`／`docs/AI使用手册.md`（缺风格层行） | 索引/用户面 | **不动（出范围）** | 记入收口报告待办 | DONE |

## 八、Migration Plan

1. 批 0：立契约（本文件）。
2. 批 1：`content-lines.mjs` ADD `scanPieceArtifacts`（纯函数，接受 root）；`gate-all.mjs` 接上（寻址＋适用性＋未测清单＋产物存在却跳过=硬失败）。
3. 批 2：styleId 规范——`SKILL.md` 写格式与第 1 步清单补行；`check-style-rotation` / `check-visual-shot-contract` 加值域校验。
4. 批 3：Shot 表补两列＋去撞名；whiteboard §⑦ 与 engine README 陈旧句；SKILL 版本号；deprecatedTerms 两条。
5. 批 4：Legacy 隔离——`ref-registry.legacyPieces` ＋ `outputs/LEGACY-ISOLATION.md` ＋ g06–g11 标记 ＋ 标记校验。
6. 批 5：验证（机械＋负向＋语义反例＋gate-all 实跑），写 Closure Report，移入 `closed/`，最终状态重跑。

## 九、Mechanical Checks

- 旧术语/旧口径扫描：`check-doc-references`（含 `deprecatedTerms`）＋ 新增两条话头复扫。
- 闸门实跑：`node scripts/gate-all.mjs`（要求相对 055 基线无新增红）。
- 事务契约：`node scripts/check-change-contract.mjs`。
- 风格轮换／视觉契约：`node scripts/check-style-rotation.mjs`、`node scripts/check-visual-shot-contract.mjs`。

## 十、Negative / Semantic Counterexample

**负向（关键词层）**：构造一个"声明了未登记风格 id"的片（`styleId: whitebord`）与一个"产物根存在但探针扫不到"的 fixture，断言：

- `scanPieceArtifacts` 能命中非缺省风格产物根内的 mp4（正例）；
- 未登记 styleId 值 ⇒ `check-style-rotation` / `check-visual-shot-contract` 硬失败（不得静默当成一个"新风格"）。

**语义反例（绕过关键词仍违规）**：把白板片产物放在 `outputs/gXX-行业/whiteboard/` 下、但在片目录顶层**不放** mp4——旧代码会打印"⏭️ 跳过（暂无成片）"并让汇总显示通过，即"文档说测了、实际没测"。判据：**只要产物根内存在 mp4，汇总层就不得出现 motion 跳过行**；由 `scanPieceArtifacts` ＋ 未测清单对账拦截，而不是靠关键词。

## 十一、Real Output Verification

- Real Output 声明：`not-applicable`
- 理由：本事务不改变任何视觉／内容／动效判据的语义，只改闸门的**扫描面与声明格式**；且新架构生产片当前为 0（`outputs/` 零 `styleId`），不可能产出真实关键帧或成片。证据形态＝真实命令输出（`gate-all` 实跑前后对比、fixture 负向测试、契约与引用闸门），可逐条复核。

- 真实关键帧/短片：无（见上）
- 人工验收判据：新架构片产出后，`gate-all` 对白板片必须能报出 motion 实读数而非跳过——留给 g12 首片验收（AI-A 已排为下一阶段）
- 结果：N/A

## 十二、Closure Report

- 已修改：`scripts/content-lines.mjs`（ADD `probeTargetFor`／`declaredStyleIdOf`／`assertRegisteredStyleId`／`INDUSTRY_LINE_ID`）、`scripts/gate-all.mjs`（探针寻址与适用性改走风格认领；ADD 未测清单）、`scripts/check-style-rotation.mjs`（styleId 值域校验；ADD 历史片隔离对账）、`scripts/check-visual-shot-contract.mjs`（导演稿节 styleId 值域与片级一致性校验）、`scripts/ref-registry.json`（ADD `legacyPieces`；`extraDocs` 收 LEGACY-ISOLATION）、`SKILL.md`（styleId 声明唯一格式＋第 1 步清单补 ④；版本戳与 frontmatter 对齐 8.1.1）、`video/styles/remotion-components/SKILL.md`（Shot 表补 `Visual Metaphor`／`Peak Frame` 至 13 字段；去《视觉导演稿》撞名）、`video/styles/whiteboard/SKILL.md`（§⑦ 陈旧免责句 → 如实接线状态＋本风格可测边界）、`video/styles/whiteboard/engine/README.md`（"当前为占位" → 已落地）、`video/src/data/g11.ts:4`（失效指针注释改指现属主）、`outputs/g06–g11` 内容输入包（ADD 隔离标记一行）、`.github/workflows/visual-shot-contract.yml`（ADD 新负向测试步骤）；ADD `outputs/LEGACY-ISOLATION.md`、`scripts/test-style-scan-negative.mjs`。
- 已废止：`gate-all` 顶层硬编码寻址与静默跳过路径；两份闸门对 styleId 的"任意字符串即合法"宽松读取；包 §③B《视觉导演稿》命名与 11 字段 Shot 表；whiteboard §⑦「批 4 完成前存在时差」；engine README「占位」表述。
- 已保留：`outputs/g06–g11` 正文／数据／成片／帧图**零内容改动**（只多一行标记）；`outputs/archive/` 历史证据地位不变；g11 双豁免照旧生效；教程线方法层零改动；Runtime Contract / Capability Matrix **未扩大**（按 AI-A 裁定留待平台化阶段）。
- 影响面：`13 / 13`
- 旧口径扫描：PASS（`check-doc-references` 0 硬失败；扫描面无新增话头；本事务未登记新 `deprecatedTerms`——见报告 §未清项 U8）
- 机械检查：PASS（`gate-all` 14/16＋2 项已裁跳过、exit 0，逐行与 055 基线零漂移；`check-change-contract` PASS，58 事务；`tsc --noEmit` 零错误）
- 负向测试：PASS（新增 `test-style-scan-negative.mjs` 5 项断言；既有两项复跑仍 PASS：`test-change-contract-negative` 81 断言／`test-visual-shot-contract-negative` 缺 Peak Frame 被拒）
- 语义反例：PASS（① 删 g08 隔离标记 → `check-style-rotation` exit 1 并点名文件，按 md5 逐字节还原 YES；② 临时片声明 `styleId: whitebord` → exit 1 且列出合法值 `whiteboard / remotion-components`，临时目录已清理 OK；③ 白板片产物只落 `whiteboard/` 子目录 → 已由 fixture 负向测试证明可扫到，旧口径此处会静默跳过）
- 真图/成片：N/A（Real Output 声明＝`not-applicable`；新架构生产片为 0，无可验收产物，证据形态＝真实命令输出）
- 本次新增红：0

**结论：CLOSED**

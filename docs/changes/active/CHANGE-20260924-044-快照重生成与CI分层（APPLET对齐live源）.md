# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260924-044`
- 标题：APPLET 快照重生成（含工具 bug）＋CI 分层（稳定闸门／手动渲染）＋声明未接线登记＋模板标注
- 负责人：用户（方向）／AI-B（侦察、契约、迁移、验证）
- 范围：`global`
- 状态：`CLOSED`
- 触发：用户 2026-09-24 批复「都开始执行吧」（对 7 项挂账的建议：先做 APPLET 快照与 CI 收敛，其余低成本登记/标注或随生产解锁）

## 二、Goal

一句话：清掉最高风险的结构挂账——**产品事实快照与 live 源脱节**（快照 2026-09-15／298 文件的旧内容 vs live 源 09-22 的 20 处更新）＋**CI 冻结在 g11 且断言写死**；顺带两项低成本登记（声明未接线清单、分镜稿模板标注）。

- 边界：不改任何闸门判据、不改真值表内容（字段/行号回写另行）；不改产品事实本身（只把快照对齐到 live 源）。

## 三、新口径 New Policy

1. **快照重建的两种输入**：`archive` 模式（来源 zip/tar，记 `archive_sha256`）与 **`live` 模式**（本机 live source，记 `source_tree_sha256`＝「相对路径＋内容 SHA-256」排序串摘要，`archive_sha256` 留空并写明 `provenance_note`）——两种都满足 R10 §4「来源可核验」。
2. **manifest 落点唯一**：`spec/product-truth/applet/manifest.json`（含 `files[]` 逐文件 path/sha256/bytes，R10 §4）。
3. **CI 分两层**：`gates`（每次 push/PR：materialize 快照＋负向测试＋视觉契约＋诊断＋`gate-all`，**断言读 manifest 的 `file_count`**）；`renders`（g11 关键帧渲染与上传——**手动触发**，不再挂 push/PR）。

## 四、Replace

| # | 位置 | 旧 | 新 |
|---|---|---|---|
| 1 | `spec/product-truth/applet/{source.tar.xz,manifest.json}` | 2026-09-15 版（archive 输入，摘要式 manifest，无 `files[]`） | 2026-09-24 重生成（live 输入；298 文件集不变、20 个文件内容更新；manifest 含逐文件清单） |
| 2 | `scripts/build-applet-snapshot.mjs` | manifest 写到 `spec/product-truth/manifest.json`（错路径）；无逐文件清单；不能 live 重建；产物含散文件 | manifest 写权威路径＋`files[]`；新增 `--live` 模式（源集摘要）；只落 `source.tar.xz`＋`manifest.json` 两件（GNU tar 时确定性打包） |
| 3 | `spec/product-truth/README.md` | 基准＝09-15 archive 版（archive SHA／快照 SHA／blob SHA／298） | 基准＝09-24 live 版（`source_tree_sha256`／新快照 SHA／新 blob SHA／298＋20 更新）＋版本谱系；提交要求第 3 条改「可追溯回本次来源（archive 或 live 源集摘要）」 |
| 4 | `docs/internal/R10-产品事实源解析协议.md` §4 | 只写「来源 archive 有 SHA-256」 | 补 live 重建条款（改记 `source_tree_sha256`，`archive_sha256` 留空） |
| 5 | `.github/workflows/visual-shot-contract.yml` | 单 job；`npm ci`＋渲染＋上传＋安全区诊断全挂 push/PR；断言写死 `298`（两处分支各一次） | `gates`／`renders` 两 job；渲染与上传仅在 `workflow_dispatch` 跑；断言改读 manifest；触发路径同步（去 g11 源码路径、加 `build-applet-snapshot.mjs`） |
| 6 | `.github/workflows/change-contract-gate.yml` | 触发路径含两个**不存在**的文件（`scripts/materialize-applet-truth.mjs`、`spec/product-truth/applet-snapshot.json`） | 改为 `scripts/build-applet-snapshot.mjs`、`spec/product-truth/**` |
| 7 | `scripts/ref-registry.json` `gateApplicability.note` | 无"声明未接线"登记 | 补一句：已消费声明的闸门／未接线的 4 只（`check-ui-truth`／`check-voice-discipline`／`check-redlines`／`check-facts`）＋接线随教程线首条（f01） |
| 8 | `SKILL.md` 第 4 步分镜稿模板"布局来源"行 | "四锚之一…"（未标风格归属） | 加括注"（当前 Remotion 类字段；风格化片按所选风格包声明）" |

## 五、Remove

**Remove**：09-15 旧快照两件、构建脚本的错 manifest 落点、CI 的两个不存在路径与写死 298、单 job 的 push/PR 渲染链路。

**不并入本事务（保持挂账）**：真值表 `src` **行号回写**（82 处，本轮实测未恶化；属真值表维护）；教程线视觉语言（f01）；风格化机检覆盖；白板 motion 重定标（三项都随首个风格化/教程片）；`archive` 规范残留批；S3 批。

## 六、Preserve

- `outputs/archive/*`、`outputs/g06–g11`、`docs/changes/**`：零改动。
- 真值表（`spec/*-fields.json`）字段与行号：本轮不动。
- 快照范围规则（.vue/.js/.json，排除 node_modules/unpackage/uni_modules/点目录）：不变。
- g11 渲染链路的**能力**保留（移入 `renders` job，可手动跑），不删除。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 归属阶段 |
|---|---|---|---|---|
| `spec/product-truth/applet/*`（两件） | 产品事实快照 | REGENERATE | 与 live 源 298/298 逐字一致（本机实测） | 批 1 |
| `scripts/build-applet-snapshot.mjs` | 工具 | REPLACE | 负向：缺模式报错 EXIT=1；live 重建成功 | 批 1 |
| `spec/product-truth/README.md` ＋ `R10` §4 | 基准/协议 | REPLACE＋ADD | 引用闸门＋数值核对 | 批 1 |
| `.github/workflows/*.yml`（2 个） | CI | REPLACE | YAML 结构校验＋断言逻辑本机等价复现 | 批 1 |
| `scripts/ref-registry.json`（note） | 声明源 | ADD | 复跑闸门 | 批 2 |
| `SKILL.md`（模板一行） | 方法 Owner | ADD | 引用闸门＋复扫 | 批 2 |

## 八、Migration Plan

1. 批 1：重建快照（live 模式）→ 验物化一致性 → 更新 README／R10 → 改两个 workflow → 负向测试。
2. 批 2：注册表 note ＋ SKILL 模板标注。
3. 复跑 `check-ui-truth`／`check-doc-references`／`check-change-contract`／`gate-all` ＋干净检出复跑。

## 九、Mechanical Checks

- 快照保真：新 `source.tar.xz` 解包集合 298、与 live 源**逐字 0 差异**；`manifest.files[]` 298 条；`file_count` = 解包计数。
- 闸门：`check-ui-truth` PASS（真值表自证 158 名字逐字命中；**行号漂移仍 82 处、未恶化**）；`check-doc-references` 0 硬失败；`check-change-contract` PASS；`gate-all` 13/15、2 项跳过、无红灯，与上一基线**行级零漂移**。
- 负向测试：① 构建脚本 archive 模式缺 SHA → EXIT=1 并给出可读指引；② 同款断言逻辑：解包少 1 文件（297 vs manifest 298）→ `test` 判不过（CI 会红）。
- CI：两个 workflow YAML 结构校验通过；旧断言字面 `test "$count" = "298"` 已归零（仅注释提及）；两个不存在的触发路径已修。

## 十、Negative / Semantic Counterexample

- **负向（快照被"改漂亮"）**：为了让 CI 绿而删减快照范围（例如把 20 个更新文件排除）——违反 R10 §10.4。拦截：§九 的"集合一致＋逐字一致"双向校验；范围规则未动。
- **语义反例**：把 live 重建写成"来源 archive＝live source"（拿 `archive_sha256` 塞源集摘要）——字段语义混淆，后续无法区分输入类型。拦截：live 模式显式置 `archive_sha256=null` ＋ `provenance_note`，并写入 R10 §4。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务范围＝产品事实快照重生成＋CI 分层＋登记/标注，不产出关键帧或成片；快照本体与外源回归由 298/298 逐字校验替代。
```

## 十二、Closure Report

- 已修改：`spec/product-truth/applet/{source.tar.xz,manifest.json}`（live 重生成：298 文件集不变／20 文件内容更新／manifest 含逐文件清单）、`scripts/build-applet-snapshot.mjs`（manifest 落点修复＋`--live` 模式＋只落两件产物）、`spec/product-truth/README.md`（基准全面更新＋版本谱系）、`docs/internal/R10-产品事实源解析协议.md`（§4 补 live 重建条款）、`.github/workflows/visual-shot-contract.yml`（gates／renders 分层＋断言读 manifest）、`.github/workflows/change-contract-gate.yml`（两处不存在路径修正）、`scripts/ref-registry.json`（`gateApplicability.note` 登记消费状态）、`SKILL.md`（第 4 步模板"布局来源"行补风格归属括注）
- 已废止：09-15 旧快照两件；构建脚本写到 `spec/product-truth/manifest.json` 的错落点；CI 的写死 `298` 断言与 `materialize-applet-truth.mjs`／`applet-snapshot.json` 两个不存在的触发路径；push/PR 路径上的 g11 渲染链
- 已保留：真值表内容（字段与行号本轮不动）；g11 渲染**能力**（移入 `renders` job，手动可跑）；快照范围规则（.vue/.js/.json，排除 node_modules/unpackage/uni_modules/点目录）；`outputs/archive`、`outputs/g06–g11`、`docs/changes/**` 零改动
- 影响面：`6 / 6 已处理`（§七 逐行）
- Owner/入口冲突：**PASS**（快照 Owner 仍是 `APPLET / spec/`；CI 未新增入口；未接线清单如实登记而非假装已接）
- 旧口径扫描：**PASS**（workflow 内 `298` 仅存注释一处；两个不存在路径归零；`gateApplicability` 声明未接线从"无人知道"变为"表内登记"）
- 机械检查：**PASS**（快照**物化 298/298 与 live 逐字一致**；`check-ui-truth` PASS〔真值表自证 158 名字逐字命中；**行号漂移仍 82 处、未恶化**〕；`check-doc-references` 0 硬失败；`check-change-contract` PASS(46)；`gate-all` 13/15、2 项跳过、无红灯）
- 负向测试：**PASS**（① 构建脚本 archive 模式缺 SHA → **EXIT=1** 且报错可读；② 同款 CI 断言逻辑：解包少 1 文件（297≠manifest 298）→ 判不过、CI 会红）
- 语义反例：**PASS**（live 模式显式 `archive_sha256=null` ＋ `provenance_note`，未把源集摘要塞进 archive 字段；未为过闸删减快照范围）
- 真图/成片：N/A（Real Output 声明为 `not-applicable`）
- 本次新增红：**0**

**结论：CLOSED**

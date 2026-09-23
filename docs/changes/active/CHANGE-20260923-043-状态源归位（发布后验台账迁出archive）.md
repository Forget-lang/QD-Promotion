# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260923-043`
- 标题：状态源归位——发布后验台账迁出 archive（对齐「archive 不得作当前状态源」）
- 负责人：用户（方向）／AI-B（侦察、契约、迁移、验证）
- 范围：`global`
- 状态：`CLOSED`
- 触发：全局审计登记 P0 #1（`check-release-feedback` 读 `outputs/archive/` 台账 ↔ `AGENTS.md` §一/§十一"archive 不得成为当前状态源"）；用户 2026-09-23 批复「按照你建议来执行」（含我建议的落点：`outputs/` 下非 archive 的独立位置）

## 二、Goal

一句话：把一个**当前状态源**（发布后验台账：已发布片的后台四数/三指标回填与复盘结论）从 `outputs/archive/` 迁到 `outputs/` 根部，让 `AGENTS.md` §十一的"archive 只作历史证据、不承担当前状态"在机检层也成立。

- 落点选择（如实说明）：`outputs/发布后验台账.json`——**单文件**形态。`outputs/` 下的**目录**要过内容线归类或 `pieceDirs` 白名单，新增一个"发布后验"目录等于多加一处登记点；**文件不参与目录归类**，且与 `archive/`（证据）在同一父目录下，一眼可辨"当前 vs 历史"。
- 边界：只搬落点与指针，**不改判据**（闸门阈值、字段、状态机一字不动）。

## 三、新口径 New Policy

1. **台账＝当前状态源**，落 `outputs/发布后验台账.json`；`outputs/archive/` 只保留历史快照类文件。
2. 所有活引用（`SKILL.md` 第 7 步、`scripts/check-release-feedback.mjs`、台账自述）指向新落点；archive 侧只留"已迁出"指针（不复制数据，避免双源）。

## 四、Replace

| # | 位置 | 旧 | 新 |
|---|---|---|---|
| 1 | 文件本体 | `outputs/archive/发布后验台账.json` | `outputs/发布后验台账.json`（`git mv`；内容除 `_说明` 外一字不动） |
| 2 | 台账 `_说明` | 未声明落点性质 | 补"本台账是**当前状态源**（不属 archive）；落点＝`outputs/发布后验台账.json`；历史快照/追溯走 git 历史" |
| 3 | `scripts/check-release-feedback.mjs` 头注 :7 | "数据源是 `outputs/archive/发布后验台账.json`" | "数据源是 `outputs/发布后验台账.json`（2026-09-23 CHANGE-043 自 archive 迁出）" |
| 4 | 同上 `LEDGER` 常量 | `join(ROOT,'outputs','archive','发布后验台账.json')` | `join(ROOT,'outputs','发布后验台账.json')` |
| 5 | `SKILL.md` 第 7 步（发布后验闭环 与 各片状态记账 两处） | `outputs/archive/发布后验台账.json` | `outputs/发布后验台账.json` |
| 6 | `outputs/archive/README.md` 目录说明表 | （未提台账） | 补一行："发布后验台账（当前状态源）已于 2026-09-23 迁出至 `outputs/发布后验台账.json`；本目录不再承载当前状态" |

## 五、Remove

**Remove**：`outputs/archive/` 下台账文件本体与其在活引用中的旧路径。

**不并入本事务**：CI 冻结 g11（未获口径指示）；APPLET 快照、教程线视觉语言、风格化机检覆盖、白板 motion 重定标、第 4 步模板参数化——各自独立事务。

## 六、Preserve

- 台账内的**历史行**（g01–g10 历史豁免行、g11 两条待回填行及其变量假设）逐字保留，不重写、不"顺手回填"。
- `docs/changes/**` 里对旧路径的历史引用（已关闭事务）不回填。
- `git mv` 保留文件历史（`git log --follow` 可追）。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 归属阶段 |
|---|---|---|---|---|
| `outputs/archive/发布后验台账.json` → `outputs/发布后验台账.json` | 当前状态源 | MOVE（内容仅 `_说明`） | 新旧路径逐字段 diff＋闸门 | 批 1 |
| `scripts/check-release-feedback.mjs` | 闸门脚本 | REPLACE（路径＋头注） | 复跑闸门：读得到、红绿不变 | 批 1 |
| `SKILL.md` 第 7 步（2 处） | 方法 Owner | REPLACE（路径） | 引用闸门＋关键词复扫 | 批 1 |
| `outputs/archive/README.md` | 目录纪律 | ADD（一行指针） | 人判：不复制数据、不承担状态 | 批 1 |

## 八、Migration Plan

1. `git mv` 台账 → 更新台账 `_说明` → 改脚本路径/头注 → 改 `SKILL.md` 两处 → archive README 补指针。
2. 复跑 `check-release-feedback`（应通过且行数/红绿不变）／`check-doc-references`／`check-change-contract`／`gate-all`。
3. 负向测试：临时移走台账 → 闸门须硬失败（"台账缺失"）→ 还原归位。

## 九、Mechanical Checks

- 闸门：`check-release-feedback` 通过；`check-doc-references` 0 硬失败（SKILL 新路径存在）；`check-change-contract` PASS；`gate-all` 与 043 前逐行一致。
- 关键词复扫：`outputs/archive/发布后验台账.json` 在**现行链**（排除 `docs/changes/` 与 `outputs/` 历史交付物）→ 0 命中。
- **允许残留（登记，不回改）**：`outputs/g08-火锅/00-交付说明.md`、`outputs/g09-宠物店/00-交付说明.md`（2 处）、`outputs/g11-烧烤/03-发布稿-抖音.md`、`outputs/g11-烧烤/06-发布稿-抖音图文.md` 共 5 处旧路径——属 `outputs/g06–g11` **历史交付产物**（PRESERVE），按先例（036 对 g10 口播稿"参考档"残留的处置）保留为历史证据，不回溯改写；现行链（`SKILL.md`／闸门脚本）已全部指向新落点。
- 数据保真：`git show HEAD~1:outputs/archive/发布后验台账.json` 与迁移后文件 **除 `_说明` 外逐字一致**（jq/深比较）。

## 十、Negative / Semantic Counterexample

- **负向（双源并存）**：搬迁后 archive 里留一份旧副本"以防万一"——即成双状态源（改一处漏一处）。拦截：§六 明确不复制；§九 复扫"archive 路径"归零。
- **语义反例**：把台账迁到 `outputs/archive/` 之外但仍在 `outputs/` 的**某个片目录**里（如 `outputs/g11-烧烤/`）——台账是跨片台账，放进单片目录＝归属错误且随片删而丢。拦截：落点＝`outputs/` 根（跨片台账身份）。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务范围＝状态源落点迁移与指针同步，不产出关键帧或成片；台账数据本身逐字保留。
```

## 十二、Closure Report

- 已修改：`outputs/archive/发布后验台账.json` → `outputs/发布后验台账.json`（`git mv`＋`_说明` 补"当前状态源/不属 archive"）、`scripts/check-release-feedback.mjs`（头注＋`LEDGER` 常量）、`SKILL.md` 第 7 步（5 处路径）、`outputs/archive/README.md`（补"已迁出"指针行）
- 已废止：`outputs/archive/发布后验台账.json` 作为机检数据源与 SKILL 指定落点；archive 承载当前状态源的身份
- 已保留：台账内 3 行数据（历史豁免 1／待回填 2）除 `_说明` 外**逐字一致**（深比较通过）；`outputs/g06–g11` 内 5 处历史路径（登记不回改）；`docs/changes/**` 历史引用不回填
- 影响面：`4 / 4 已处理`（§七 逐行）
- Owner/入口冲突：**PASS**（台账是数据落点不是规则 Owner；未新增入口；archive 与 outputs 根的"历史 vs 当前"边界更清晰）
- 旧口径扫描：**PASS**（现行链复扫旧路径 0 命中；5 处命中全为历史交付产物并已在 §九 登记）
- 机械检查：**PASS**（`check-release-feedback` 通过且行数/红绿不变〔3 行：豁免 1／待回填 2〕；`check-doc-references` 0 硬失败；`check-change-contract` PASS(45)；`gate-all` 13/15、2 项跳过、无红灯，与 042 基线**行级零漂移**）
- 负向测试：**PASS**（移走台账 → 闸门硬失败并打印**新路径**〔证明读的是新落点〕；还原 → 通过）
- 语义反例：**PASS**（未在 archive 留副本＝无双源；未迁入任何片目录＝跨片台账身份正确）
- 真图/成片：N/A（Real Output 声明为 `not-applicable`）
- 本次新增红：**0**

**结论：CLOSED**

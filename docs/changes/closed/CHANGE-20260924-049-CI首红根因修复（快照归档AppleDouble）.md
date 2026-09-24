# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260924-049`
- 标题：CI 首红根因——APPLET 快照 tar 混入 macOS AppleDouble 条目（Linux 侧计数翻倍）
- 负责人：用户（方向）／AI-B（侦察、契约、迁移、验证）
- 范围：`project`
- 状态：`CLOSED`
- 触发：用户 2026-09-24 提供 GitHub Actions 截图：`visual-shot-contract` 自 #258（044 推送）起**连续 4 次红**，`change-contract-gate` 全绿

## 二、Goal

一句话：把"本机全绿、CI 连红"的差异定位并修掉——根因是快照 tar 里的 `._*`（AppleDouble）条目，在 Linux 上被解成真文件、使 CI 的文件计数翻倍。

## 三、新口径 New Policy

1. **归档必须跨平台干净**：APPLET 快照 tar 严禁含 `._*` 条目——打包禁用 mac 元数据（`--no-mac-metadata／--no-xattrs／--exclude '._*'` ＋ `COPYFILE_DISABLE=1`），并在构建脚本内**自检**（无 `._*`；源文件计数＝清单条数）。
2. **本地验证要用"异实现"**：跨平台产物（tar 等）的验证不得只用本机同源工具——本机 bsdtar 会隐藏/吸收 `._*`，必须用**独立实现**（如 Python `tarfile`）或等价 Linux 行为复核。

## 四、Replace

| # | 位置 | 旧 | 新 |
|---|---|---|---|
| 1 | `scripts/build-applet-snapshot.mjs` | bsdtar 默认打包（带 `._*`）；无自检 | 禁 mac 元数据 + 打包后自检（`._*` 归零、计数＝清单条数） |
| 2 | `spec/product-truth/applet/source.tar.xz` | 含 `._*`（425 成员中约 127 个为 `._*`） | 重打：425 成员、`._*` **0**、源文件 298 |
| 3 | `spec/product-truth/applet/manifest.json` | 旧 `snapshot_sha256` | 新 `snapshot_sha256`（`source_tree_sha256` 不变＝源集内容未变） |
| 4 | `spec/product-truth/README.md` | 直接写死快照 SHA／blob | 改为"以 `manifest.json` 现取为准"＋新增「归档修订」小节记录本次根因与修法 |

## 五、Remove

**Remove**：含 `._*` 的旧归档；README 里会随归档修订而过期的写死 SHA。

**不并入**：`S3 批`、证据型 `src` 剩 22 条（048 已登记）。

## 六、Preserve

`../applet`（live 源）零改动；快照**源集内容**零改动（`source_tree_sha256` 与首次重打一致）；`outputs/**`、`docs/changes/**`。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 归属阶段 |
|---|---|---|---|---|
| `scripts/build-applet-snapshot.mjs` | 工具 | REPLACE（打包参数＋自检） | 重打无异常；自检通过 | 批 1 |
| `spec/product-truth/applet/{source.tar.xz,manifest.json}` | 产品事实快照 | REGENERATE | Python `tarfile` 独立复核（0 个 `._*`、298 源文件）＋Linux 等价模拟（Python 解包后计数＝298、闸门全绿） | 批 1 |
| `spec/product-truth/README.md` | 基准文档 | REPLACE＋ADD | 引用闸门 | 批 1 |

## 八、Migration Plan

1. 加固构建脚本 → 重打快照 → Python 独立复核 → 更新 README。
2. 提交后**在新 HEAD 上**重跑 Linux 等价模拟（worktree＋Python 解包＋CI 断言＋`gate-all`）。
3. 推送 → 由用户在 GitHub 确认 `visual-shot-contract` 转绿。

## 九、Mechanical Checks

- 归档干净：Python `tarfile` 读成员——`._*` 条目 **0**；`.vue/.js/.json` 计数 **298**；成员总数 425（含目录）。
- Linux 等价：Python（GNU 行为）解包后 `find` 计数 **298 = manifest**；`check-ui-truth` PASS；`gate-all` 13/15 无红灯。
- `check-doc-references` 0 硬失败；`check-change-contract` PASS。
- 源集未变：`source_tree_sha256` ＝ `e99fe68…`（与首次重打一致）。

## 十、Negative / Semantic Counterexample

- **负向（本机绿≠跨平台绿）**：用本机 bsdtar 解包验证旧 tar → 计数 298、假绿；换 Python/GNU 行为 → 596、露馅。⇒ 拦截：本契约 §三.2 把"异实现复核"立为纪律；构建脚本内自检兜底。
- **语义反例**：为让 CI 变绿而把 CI 的计数放宽成"忽略 `._*`"——只是把坏归档藏起来。拦截：修归档本体（本条），CI 断言保持严格。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务范围＝归档工具与快照重打，不产出关键帧或成片。
```

## 十二、Closure Report

- 已修改：`scripts/build-applet-snapshot.mjs`（禁 mac 元数据＋自检）、`spec/product-truth/applet/source.tar.xz`＋`manifest.json`（重打）、`spec/product-truth/README.md`（现取为准＋归档修订小节）
- 已废止：含 `._*` 的旧归档；README 写死 SHA 的写法
- 已保留：`../applet` 与快照源集内容零改动（`source_tree_sha256` 不变）
- 影响面：`3 / 3 已处理`（§七 逐行）
- 旧口径扫描：**PASS**（本事务无口径变更；旧口径复扫不受影响）
- 机械检查：**PASS**（Python 独立复核：`._*`=0、源文件=298、成员=425；Linux 等价模拟：计数 298＝manifest、`check-ui-truth` PASS、`gate-all` 13/15 无红灯；`check-doc-references` 0；`check-change-contract` PASS(51)）
- 负向测试：**PASS**（旧 tar 在 Linux 等价解包下计数 596 → 断言失败〔已复现〕；新 tar 同法 → 298 → 通过）
- 语义反例：**PASS**（修的是归档本体与工具，未放宽 CI 断言）
- 真图/成片：N/A（Real Output 声明为 `not-applicable`）
- 本次新增红：**0**（本机与等价模拟）

**结论：CLOSED**

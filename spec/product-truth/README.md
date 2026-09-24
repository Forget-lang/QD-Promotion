# APPLET Product Truth Snapshot

本目录保存可提交、可追溯的 `APPLET` 产品源码快照。

## 当前已核验基准（2026-09-24 重建 · `CHANGE-20260924-044`）

- 输入：**本机 live source `../applet`**（本次无来源 zip／archive，按 R10 §7「以用户提供的最新产品源码为准重新生成 snapshot」执行）
- 源集摘要 `source_tree_sha256`（＝对「相对路径＋内容 SHA-256」排序串取 SHA-256）：`e99fe68ce1cba67ee071f4f172a0c11f1f4803939bfe1fb42adfad84d6c02dd0`
- Snapshot 文件数：**298**（与上一版文件集**完全一致**：0 增 0 减；其中 **20 个文件内容更新**）
- Snapshot archive SHA-256（`source.tar.xz`）：见下方「归档修订」——当前值以 `manifest.json` 的 `snapshot_sha256` 为准（2026-09-24 第二次修订：清掉 macOS AppleDouble 条目后重打）
- Snapshot Git Blob SHA：以 `git hash-object spec/product-truth/applet/source.tar.xz` 现取为准（同上，归档已二次修订）
- Snapshot 范围：仅 `.vue` / `.js` / `.json`；排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 及 macOS `._*` 元数据。
- 逐文件清单（R10 §4）：`spec/product-truth/applet/manifest.json` 的 `files[]`（`path`／`sha256`／`bytes`）。

**归档修订（2026-09-24 第二次，CHANGE-20260924-049）**：首次重打的 tar 由 macOS bsdtar 生成，未禁用扩展属性 → 归档内含 `._*`（AppleDouble）条目；本机 bsdtar 解包会吸收回 xattr（本机计数仍 298），但 **Linux 的 GNU tar 会解成真文件**，CI 的文件计数翻倍（596≠298）→ CI 红。修法：打包禁用 mac 元数据（`--no-mac-metadata/--no-xattrs/--exclude '._*'`＋`COPYFILE_DISABLE=1`），并在构建脚本内**自检**（不得含 `._*`、源文件计数须等于清单条数）。当前 tar：见 `manifest.json` 的 `snapshot_sha256`；`source_tree_sha256` 未变（源集内容不变）。

**版本谱系**：首版 2026-09-15（输入 `applet.zip`，archive SHA-256 `afb1b038…`，同时修正了误纳入的 `.git` 与生成物目录，确立"298 文件＝干净范围"）→ **2026-09-24 重建**（同一 298 文件集；更新 20 个文件：`pages_coupon/coupon/create.vue`（真值表主锚）、`pages_card/card/create.vue`、`pages_bundle/bundle/create.vue`＋`update.vue`、`pages_coupon/coupon/detail.vue`／`info.vue`／`update.vue`、`pages_coupon/issue/wechat.vue`、`pages_merchant/**` 5 件、`pages_point/point/increase.vue`、`pages_user/coupon/public_receive.vue`、`components/m/m-vip-upgrade/m-vip-upgrade.vue`、`constants/edition.js`、`config.prod.js`、`manifest.json` 等）。重建后本机实测：**物化快照与 live source 298/298 逐字一致**。

## 正式提交要求

正式提交必须满足：

1. Snapshot 与上述 SHA-256 完全一致；
2. 解包后文件数为 298；
3. 每个 materialized 文件保留源路径、内容 SHA-256 与字节数（`manifest.json` 的 `files[]`），并可追溯回本次来源（archive SHA-256 或 live 源集摘要 `source_tree_sha256`）；
4. `spec/coupon-fields.json` 与 `spec/card-fields.json` 的 `src` 行段均能回溯到 materialized APPLET；
5. CI 使用现有 `check-ui-truth.mjs` 验证，不降低验证等级、不跳过、不伪造 source。

## CI 约定

CI 将已提交的完整 Product Truth Snapshot materialize 为逻辑源 `../applet`，再运行 UI Truth 检查。`../applet` 只是执行环境中的物理解析路径，不是项目事实源名称。

在完整 Snapshot 尚未提交前，`check-ui-truth` 必须保持硬失败；不得用 placeholder、partial snapshot、合成内容或 skip 使 Gate 变绿。

## Agent 接续

新的 Agent 不应根据聊天历史猜测 APPLET 状态。先读取：

- `docs/internal/PROJECT-CONSISTENCY-MAP.md`
- `docs/internal/R10-产品事实源解析协议.md`
- 本文件

然后以实际 Snapshot 文件、SHA-256 和 CI 结果为准。

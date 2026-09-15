# APPLET Product Truth Snapshot

本目录保存可提交、可追溯的 `APPLET` 产品源码快照。

## 当前已核验基准

- 原始输入：`applet.zip`
- 原始 archive SHA-256：`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`
- Snapshot 文件数：**298**
- Snapshot archive SHA-256：`d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`
- Snapshot 范围：仅 `.vue` / `.js` / `.json`；排除 `node_modules`、`unpackage`、`uni_modules`、`.git` 及 macOS `._*` 元数据。

本次重建专门修正了先前归档中误纳入的 `.git` 与生成物目录；当前 298 个文件才是可作为产品源码事实源的干净范围。

## 正式提交要求

正式提交必须满足：

1. Snapshot 与上述 SHA-256 完全一致；
2. 解包后文件数为 298；
3. 每个 materialized 文件保留源路径、内容 SHA-256 与字节数，并可追溯回本次 `applet.zip`；
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

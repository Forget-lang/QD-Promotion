# APPLET Product Truth Snapshot

本目录保存可提交、可追溯的 `APPLET` 产品源码快照。

## 约束

- 快照来源必须有源 archive SHA-256。
- 快照必须覆盖用于产品事实验证的完整源码集合，而不是人工摘录的字符串表。
- 每个 materialized 文件必须保留源路径、内容 SHA-256 与字节数。
- CI 必须先 materialize 快照到 `../applet`，再运行 `check-ui-truth.mjs`。
- 快照与本机 live `APPLET` 不一致时，以最新产品源码为准并重新生成快照。
- 禁止用不完整、合成或人工改写的内容冒充源码快照。

当前会话已核验的源 archive SHA-256：
`afb1b0385cf167392eb78b2031d104b714134d72697a1e735d6d4313e6ca1ad7`

当前仓库尚未提交完整源码快照包，因此 CI 在快照 materialize 完成前继续保持 `check-ui-truth` 缺源失败。这是有意保留的硬闸门，不是豁免。

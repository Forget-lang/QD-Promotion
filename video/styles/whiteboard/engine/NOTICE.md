# 出处与许可（NOTICE）

本目录为**适配版实现**，改编自开源项目：

- 上游：https://github.com/geeklee/srt-whiteboard-animation
- 上游提交：696a7243c0e6ffb6827676e539c2ca5ebae2bf6b 2026-07-28
- 许可：MIT（见同目录 `LICENSE`，**必须保留**）

## 本适配做了三件事

1. **去叙事权**：不采用上游 `SKILL.md` 的工作流与"每步强制等用户确认"的流程主张；"建议分镜／每幕核心表达／按语义顺序安排绘制"一律移除——分幕、元素顺序与时间信息由《导演稿》提供（见 `../SKILL.md` ⑧ 与 039 契约 §二十一）。
2. **手部素材去第三方标识**：`assets/drawing-hand.png` 由上游素材经轴向重采样重建笔杆表面，去除原作者标识文字（画面零品牌要求）。
3. **未纳入**：上游的 `parse_srt.py`（含"建议分镜"叙事功能）、`examples/`、`agents/` 与其 `README/SKILL` 文档。

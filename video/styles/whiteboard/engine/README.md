# whiteboard 引擎（待落地 · CHANGE-20260923-039 批 3）

本目录将存放白板手绘风格包的执行引擎（Python）。**当前为占位**——引擎随批 3（首个风格产出）落地。

- 计划来源：适配自 `geeklee/srt-whiteboard-animation`（MIT）；**必须保留其 LICENSE 与版权／出处声明**。
- 依赖：opencv-python ／ numpy ／ av ／ Pillow（独立 `.venv`，见风格包 ⑧ 实现说明）。
- 输入／输出：线稿 PNG ＋ 同名 annotation.json → 无声 MP4。
- 工程边界：本目录不属 npm 工程，不修改 `video/src` 与 Remotion 工程。

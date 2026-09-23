# whiteboard 引擎（待落地 · CHANGE-20260923-039 批 3）

本目录将存放白板手绘风格包的执行引擎（Python）。**当前为占位**——引擎随批 3（首个风格产出）落地。

## 通段（带语音成片 · 2026-09-23 实测可重复）

一键链：`bash build_voiced.sh <片目录>`，四步全自动——逐句 TTS → 语音驱动时间轴 → 渲染无声片 → 合音轨。

- `scripts/build_voiced.sh`：编排入口（调仓库 `scripts/tts.mjs` 与下面的 python）。
- `scripts/make_timeline.py`：量语音时长 → 写 `annotation` 的 `startMs/durationMs` → 合单轨 wav → 渲染 → 合音轨。
- 输入契约 `vo.json`（放片目录）：

```json
{ "sceneId": "demo-voiced", "scenePng": "scene-01-v.png",
  "baseAnnotation": "scene-01-v.annotation.json",
  "outAnnotation": "scene-01-voiced.annotation.json", "outTrack": "voiced-track.wav",
  "outSilent": "demo-voiced-silent.mp4", "outFinal": "demo-30s-voiced.mp4",
  "leadMs": 400, "tailMs": 800,
  "lines": [ { "element": "e1_shop", "text": "……", "wav": "相对片目录的 wav 路径" } ] }
```

- 输出规格（硬）：**1080×1920 @30fps** ＋ aac 24kHz；音画对齐判据＝逐秒 RMS 显示语音落在元素窗口内。
- 已知边界：TTS 每次输出略有差异 ⇒ 时间轴跟随真实语音，成片总长会小幅浮动（属预期）；不烧字幕。

## 纳入边界（2026-09-23 集成审查冻结，硬）

本引擎**只提供实现能力**，不提供叙事或流程主张：

- **保留**：渲染器 ／ 多幕合并 ／ 环境准备 ／ 区域预览 ／ 预览台 ／ 手部素材（**先去第三方标识**）／ annotation 几何与时序字段。
- **不纳入**：原作自带的 `SKILL.md` 工作流与"每步强制等用户确认"的流程主张；其"建议分镜 ＋ 每幕核心表达"；其"按『场景铺垫 → 冲突 → 反应』的语义顺序安排绘制"。**以上一律由《导演稿》提供。**
- **时间字段地位**：`sceneDurationMs` 等**是实现同步参数，不是导演节奏来源**——导演稿决定镜头持续时间／信息释放节奏／情绪停顿；字幕系统只提供同步信息与渲染辅助时间。
- **上游链（冻结）**：`导演稿 → 时间轴 → 字幕 → SRT → 本引擎`；**禁止 SRT → 反推叙事**。
- **调用链（冻结）**：内容层 → R9《导演稿》→ 风格包 → **本引擎** → 视频。引擎不读字幕做叙事判断，也不理解行业内容、故事与营销目标。

## 其他

- 计划来源：适配自 `geeklee/srt-whiteboard-animation`（MIT）；**必须保留其 LICENSE 与版权／出处声明**。
- 依赖：opencv-python ／ numpy ／ av ／ Pillow（独立 `.venv`，见风格包 ⑧ 实现说明）。
- 输入／输出：线稿 PNG ＋ 同名 annotation.json → 无声 MP4。
- 工程边界：本目录不属 npm 工程，不修改 `video/src` 与 Remotion 工程。

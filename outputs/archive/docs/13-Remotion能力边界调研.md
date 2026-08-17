# Remotion 能力边界调研（事实锚点）

> 调研日期：2026-08-14 ｜ 依据：本机实际安装包 + Remotion 官方文档 + 社区实践
> 用途：给后续所有视频制作定「能做什么 / 不能做什么」的真实边界，避免 AI 凭臆测说能力。
> 级别：AI 内部工作文档，无需用户阅读；制作时依此，不确定才查。

---

## 1. 本机实际安装（最硬的事实）

- `remotion@4.0.507` + `@remotion/cli@4.0.507` + `react@18.3.1`（已具备渲染链路）
- 已装 `@remotion` 子包：`bundler / captions / cli / compositor-darwin-arm64 / licensing / media-parser / media-utils / player / renderer / streaming / studio / studio-* / timeline-utils / web-renderer / zod-types`
- **未装**：`@remotion/three`（3D）、`@remotion/shapes`、`@remotion/gif`、`@remotion/effcts`（glow/lightLeak 等滤镜包）、`@remotion/google-fonts`
- 结论：**基础 motion graphics 全可做**；3D / 高级滤镜需额外 `npm install` 才可用，不阻塞当前路线。

---

## 2. 能做到（对应我们的视频需求）

| 能力 | 说明 | 我们怎么用 |
|---|---|---|
| 逐帧动画 | `useCurrentFrame()` + `interpolate()` + `spring()`，像素级控制 | 所有动效基础 |
| 图层合成 | 代码 UI 组件层 + 项目商用字体层 + SVG 图标层 + 关键字大字层 + 角标 多层叠加 | 核心画面结构（新方向以代码 UI 组件为主，原则上不 AI 生图主视觉） |
| Ken Burns | 背景缓慢缩放/平移 | S1/S2 背景呼吸感 |
| 转场 | 淡入 / 擦除 / spring 弹性 | 分镜切换 |
| 逐字符大字弹入 | 打字机 / 错落弹入 | 关键字大字 |
| 数字翻转 | 10 → 9 核销动画 | S3 次卡核销 |
| 图标脉冲 / 滑动 | 箭头降价、分享图标放大 | S2/S3 |
| SVG / Canvas 图标动画 | 招牌、扫码图标 | 扁平插画 |
| 音频轨道合成 | 挂 TTS mp3，无字幕 | 最后一步合成语音 |
| 中文文字 | 必须 bundle 字体文件进 `public/`（用 `商用字体/` 思源等；headless 渲染器无系统 PingFang/雅黑） | 唯一中文正确姿势 |

---

## 3. 做不到 / 受限

- **不能生成真实实拍画面、真人出镜、真实门店视频** → 只能插画/背景图合成的「动画风」。这正好契合我们「不显真实 UI / 不用截图」红线，不构成损失。
- **不是 Sora / Pika 那种文生视频** → Remotion 是代码驱动的 motion graphics，约等于「AE 模板代码版」，不是 AI 生成真实影像。
- **HDR 不支持**（只渲染 sRGB 标准动态范围）。
- **CSS `@keyframes` 在渲染模式不工作** → 所有动效必须用 `useCurrentFrame` 代码驱动（我们已知）。
- **渲染慢 / 吃内存** → 首渲染需下载 headless Chrome，8GB+ RAM 推荐；测试可用 `--frame-range` 只渲片段。
- **质量上限 ≈ 专业演示级宣传短片**，非电影级、非真人广告片。

---

## 4. 对你发那张「鱼皮信息图」参考的对应关系

- 该图是**静态信息图**（长图），Remotion 做的是**它的动态版**：分块叙事 → 每镜一个色块主题；萌系角色 → 原创扁平插画角色；大标题+小关键词 → 关键字大字层级；柔和配色 → CSS 调色。
- 信息图的高信息密度在短视频里要降（前 3 秒抓人、节奏快），不能照搬排版。

---

## 5. 对 G02 分镜规划的影响

- 规划里所有动画（S1 顾客离开、S2 招牌滑入+降价箭头、S3 次卡放大+核销翻转、S4 手机上浮、S5 品牌放大+搜索引导）**全部在能力范围内** ✅
- 若想加 glow / 光晕等氛围，需先 `npm install @remotion/effcts`（非必需）。
- 中文用 `商用字体/` bundle，无坑。

---

## 6. 给用户的一句话边界

> Remotion 能做出「扁平插画 + 文字动画 + 柔和转场」的**专业宣传短视频**（类似你发的鱼皮信息图的动态版）；**做不了真实门店实拍和真人**，只能动画风——这正好符合我们的合规红线。质量约等于「高级 AE 模板宣传片」，不是电影。

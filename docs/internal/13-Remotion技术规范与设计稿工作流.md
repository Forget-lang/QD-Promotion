> ⚠️ AI 内部工作文档，无需阅读；策略以 [战略简报](../战略简报.md) 为准。

# 13 · Remotion 技术规范与设计稿工作流

> 本文档是「券到卡包」Remotion 视频的**技术规范 + 设计稿工作流单一权威**，与 10（视频制作方案）配套。
> 10 定义「做什么内容」，本文档定义「怎么用代码精确实现、设计稿写到什么程度才算可执行」。
> 冲突分层：红线/合规以 `quandao-content` skill 为准，产品事实以 `00` 为准，视频技术实现以本文档为准。
> 建立于 2026-08-17，源于 G02 茶饮咖啡视频专业级评审（10 项技术问题修复）的经验沉淀。

---

## 一、核心原则

### 1.1 设计稿是「可执行规格」，不是「灵感参考」

设计稿的目标读者是**执行 AI**，不是人。每一条描述必须能被无歧义地翻译成代码：

| 模糊写法（禁止） | 精确写法（要求） |
|---|---|
| 「标题柔和淡入」 | 「FadeInUp，delay=6 帧，motion=buttery，dist=50px」 |
| 「节点依次亮起」 | 「节点 i 在 frame 18+i×22 开始，15 帧内 interpolateColors 从 rgba(255,255,255,0.08) 到 #ffffff」 |
| 「转场自然」 | 「wipe({direction:'from-bottom'})，12 帧，springTiming damping=50 stiffness=50」 |
| 「配一张咖啡店图」 | 先按 §4.1 检索本地素材库，再按 §4.3 规格表逐字段填写 |

**AI 在设计稿环节的核心职责**：把内容创意、视觉风格、动画时序、素材需求全部规划到参数级，让人只需要「找图 + 确认」，不需要做创意决策。

### 1.2 架构分层：引擎锁定，内容替换

```
┌─────────────────────────────────────────────┐
│  data/gXX.ts          内容数据 + 风格配置     │  ← 每条视频新建
│  （文案/卡片/节点/指标 + style 五维）         │
├─────────────────────────────────────────────┤
│  scenes/              场景渲染器（7 种积木）  │  ← 锁定，按需扩展
│  HookScene / PainScene / SolutionScene ...  │
├─────────────────────────────────────────────┤
│  components/          原子组件库              │  ← 锁定，不轻易改
│  animations / ui / icons                    │
├─────────────────────────────────────────────┤
│  VTemplate.tsx        编排引擎                │  ← 锁定
│  TransitionSeries + 场景分发                 │
└─────────────────────────────────────────────┘
```

**铁律**：新视频 = 新建 `data/gXX.ts` + （按需）找图片素材。引擎和积木保持锁定，只有在需要新叙事型时才扩展 scene renderer，扩展后回写本文档。

### 1.3 图片素材：AI 规划，本地优先，人找图

视觉素材以**代码 UI 组件为主视觉**，AI 生图不用于主视觉（质感不可控、风格不统一）。素材获取优先级：

1. **代码生成**：DotGrid/GlowOrb 等装饰、内联 SVG 图标、纯 UI 组件（当前多数场景够用）
2. **本地素材库**：按 §4.1 先检索 `背景素材/`、`图标素材/图鱼素材/`、`插图库/`，本地有合适的直接引用
3. **AI 生成补充插画**：仅当代码 UI 和本地素材都不足以表达时，AI 可生成草稿，附 11 §4 可用性声明，人确认后入 `插图库/`
4. **人从外部平台找图**：以上均不满足时，AI 在设计稿中输出规格表（§4.3），人从站酷/创客贴/Dribbble/Envato/Unsplash 等平台找到后放入 `public/` 对应子目录

---

## 二、Remotion 技术硬规则

> 以下规则源于 G02 评审中发现的真实 Bug，全部为强制项，违反即视为技术缺陷。

### 2.1 动画规则

| 规则 | 说明 | 反例（禁止） |
|---|---|---|
| **禁止 CSS animation/transition** | Remotion 逐帧渲染，CSS 动画时间轴与 Remotion 帧不同步，渲染结果不可控 | `style={{animation: 'fadeIn 0.5s'}}` 或 Tailwind `animate-fade-in` |
| **全部用 useCurrentFrame + interpolate/spring** | 唯一合法的动画驱动方式 | — |
| **非 spring 插值必须指定 easing** | 禁止裸 interpolate 不设 easing（默认线性，观感生硬） | `interpolate(f, [0,30], [0,1])` 缺 easing |
| **标准缓动曲线** | 所有非 spring 动画统一用 `EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1)`（expo-out） | 自行发明 bezier 参数 |
| **spring 必须透传 motion** | 所有动画组件的 motion 参数必须从 `style.motion` 读取，禁止硬编码默认值覆盖风格配置 | `<FadeInUp motion='bouncy'>` 写死，应 `<FadeInUp motion={style.motion}>` |
| **禁止嵌套动画时序冲突** | 父容器入场动画期间，子元素不要设独立 delay 超过父动画时长（会导致子元素在不可见期间空跑动画） | `<SlideInRight delay={14}><ScaleIn delay={40}>` 父动画 14-30 帧期间子 opacity=0 |
| **颜色过渡用 interpolateColors** | 涉及颜色变化的动画禁止 boolean 切换 | `const lit = f > threshold; color={lit ? '#fff' : '#333'}` 瞬切 |

### 2.2 转场规则

| 规则 | 说明 |
|---|---|
| **必须用 TransitionSeries** | 场景间禁止 `<Sequence>` 硬切，必须通过 `@remotion/transitions` 的 TransitionSeries + Transition 串联 |
| **转场时长 12 帧（0.4s）** | 专业 MG 标准，不拖沓不突兀。特殊风格可在 8-16 帧范围内调整，设计稿中显式标注 |
| **timing 用 springTiming** | config 对齐当前视频的 motion 风格（buttery→damping50/stiffness50，bouncy→damping14/stiffness100） |
| **presentation 由 style.transition 决定** | 通过 `getPresentation()` 映射，禁止在 VTemplate 里硬编码单一转场型 |

### 2.3 布局规则

| 规则 | 说明 |
|---|---|
| **画幅固定 1080×1920 @30fps** | 9:16 竖版，抖音/小红书通用 |
| **字号/间距用绝对像素** | 当前 1080×1920 固定画幅下直接用 px，不引入 vmin（避免响应式复杂度）；如果未来需要多画幅再引入 |
| **中文字体必须本地加载** | 通过 `@font-face` 注册 `public/fonts/` 下的字体文件，禁止依赖系统字体 |
| **文字安全区** | 标题左右 padding ≥48px，底部元素距底边 ≥120px（避开平台 UI） |

### 2.4 代码结构规则

| 规则 | 说明 |
|---|---|
| **场景内容全部从 scene 数据读取** | 场景渲染器内禁止硬编码文案、颜色、图标名 |
| **风格值全部从 style/palette 读取** | 禁止在场景组件内硬编码色值（语义色 ACCENT_RED/GREEN 等除外） |
| **图标用内联 SVG 组件** | 通过 `<Ico name={color} />` 调用，禁止引用外部图标文件/CDN；新图标优先用 Icon MCP Server（`search_icons`/`generate_icon`）检索或生成 SVG，再转为内联组件加入 `icons.tsx`（见 §8.3） |
| **图片用 `<Img src={staticFile(...)} />`** | 禁止用 `<img>`（Remotion 的 Img 组件有渲染优化） |

---

## 三、风格配置五维（代码可控部分）

> 对应归档文档《视频风格轮换方案》六大维度中的代码可控部分。插画风格维度见 §4。

### 3.1 五维定义与当前支持状态

| 维度 | 字段 | 可选值 | 代码状态 | 说明 |
|---|---|---|---|---|
| 配色 | `style.palette` | `mint-cool` / `warm-orange` / `berry-purple` / `deep-blue` / `caramel` / `ink-green` / `neon` | ✅ 已实现 7 套 | `palette.ts` PALETTES，场景全部读 `p.accent` 等 |
| 动画性格 | `style.motion` | `bouncy` / `snappy` / `buttery` / `heavy` | ✅ 已实现 4 种 | SPRING_CONFIG，全部动画组件已透传 |
| 转场 | `style.transition` | `wipe` / `slide` / `fade` / `dissolve` | ⚠️ 部分实现 | wipe/slide/fade 已映射；dissolve 暂回退 fade；zoom/pop/flip 待按需补 |
| 字体性格 | `style.typography` | `impact` / `clean` / `friendly` | ✅ 已实现 | TYPOGRAPHY 映射（palette.ts），所有场景读取 style.typography；impact=得意黑900/普惠体500正文，clean=普惠体800/普惠体500，friendly=方圆体400/方圆体400（方圆体仅单一字重，层级靠字号） |
| 钩子型 | `style.hookStyle` | `contrast` / `number` / `question` / `story` / `challenge` | ⚠️ 3/5 已实现 | number（数字弹入+Pulse）/ contrast（左右红绿VS）/ question（大问号）已实现；story/challenge 待按需补 |

### 3.2 相似度检查闸门（强制）

新视频启动前，必须与已产出视频逐维对比，**至少 3 个维度不同**才放行：

| 对比维度 | G02 当前值 | 新视频必须不同的条件 |
|---|---|---|
| palette | mint-cool | 换一套 |
| motion | buttery | 换一种 |
| transition | wipe | 换一种 |
| typography | impact（待落地） | 换一种 |
| hookStyle | number | 换一种 |
| 插画风格 | I6 极简线（当前无外部图） | 换一种（见 §4） |
| 场景版式 | 7 屏固定布局 | 至少 2 屏换布局变体 |

检查结果写入设计稿「相似度检查」小节，列出对比表。

### 3.3 品牌记忆锚（固定不变，不参与轮换）

以下元素是品牌「神」，每条视频保持一致：
- 品牌署名「券到卡包」（CTA 屏，得意黑，白色）
- SlideTag 进度指示器（SLIDE XX/XX）
- 语义色体系（红=痛点/绿=解法/橙=强调/青=科技）
- 字体家族（得意黑/普惠体/方圆体，字重可轮换但字体不换）

---

## 四、图片素材规格表（设计稿核心产出物）

### 4.1 本地素材优先检索（前置步骤）

> **设计稿产出时，AI 必须先检索本地素材库，再决定是否输出外部找图规格。** 本地有合适素材时标注源路径直接引用；本地不足时才按 §4.3 输出外部检索规格表。

**本地素材库清单（仓库根目录，与 `docs/` 同级）**：

| 库 | 根路径 | 内容 | 适用场景 | 引入 video/public 路径 |
|---|---|---|---|---|
| 背景素材 | `背景素材/` | 古朴风格 15 张 + 小红书风格 20 张（共 35 张） | 全屏氛围背景（钩子屏/CTA 屏等） | `video/public/backgrounds/gXX/` |
| 图鱼纹理 | `图标素材/图鱼素材/` | 771 个纹理图案（PNG/JPG/GIF，数字命名） | UI 卡片底纹、装饰层、边角纹理 | `video/public/textures/gXX/` |
| 插图库 | `插图库/` | 当前为空；AI 生成经人确认后归档 | 情境插画（代码 UI 不足时补充） | `video/public/illustrations/gXX/` |
| 商用字体 | `商用字体/` | 普惠体/得意黑/方圆体等（已 bundle 6 个到 fonts/） | 全片排版 | 已在 `video/public/fonts/`，无需再引 |

**检索流程（AI 在设计稿 §5.5 中执行）**：

1. **判断是否需要图片素材**：按 §4.2 判断该屏是否纯 UI 组件可表达。当前 7 种积木多数场景不需要外部图。
2. **需要背景图时**：AI 列出需求（风格/色调/构图），由人在 `背景素材/` 子目录中浏览选择。AI 不扫描全库列文件名（库小但避免上下文膨胀），而是输出「从背景素材/古朴风格/ 或 小红书风格/ 中选取 XX 色调 XX 构图的竖版底图」的引导。
3. **需要纹理底纹时**：AI 输出纹理需求（图案类型/颜色/平铺方式），由人在 `图标素材/图鱼素材/` 中浏览选择。因文件全数字命名无标签，当前以人浏览选取为主；AI 不逐文件扫描。代码已内置 `DotGrid`（SVG 点阵）和 `GlowOrb`（CSS 柔光）作为零素材装饰方案，多数场景无需纹理图。
4. **需要情境插画时**：先检查 `插图库/` 是否有已入库可复用素材；为空或不匹配时，AI 可生成草稿（附 11 §4 可用性声明），人确认后入库。
5. **本地无合适素材**：按 §4.3 规格表字段填写外部检索需求，人从设计平台找图。

**路径引入机制（根目录 → video/public/）**：

Remotion 的 `staticFile()` 只能引用 `video/public/` 下的文件。根目录素材库是**源库**，使用时需**复制**（非符号链接）到 `video/public/` 对应子目录：

```
背景素材/小红书风格/3.jpg  → 复制到  video/public/backgrounds/g02/g02-s1-bg.jpg
图标素材/图鱼素材/1186.png → 复制到  video/public/textures/g02/g02-s3-texture.png
插图库/xxx.png             → 复制到  video/public/illustrations/g02/g02-s4-illus.png
```

命名规则：`gXX-s{屏号}-{角色}.{ext}`（如 `g02-s1-bg.jpg`、`g03-s3-texture.png`）。首次使用时由人创建对应 `gXX/` 子目录。

**代码引用示例**：

```tsx
import { Img, staticFile, AbsoluteFill } from 'remotion';

// ① 全屏背景图（来自背景素材/，复制到 public/backgrounds/）
<AbsoluteFill>
  <Img src={staticFile('backgrounds/g02/g02-s1-bg.jpg')}
       style={{width:'100%',height:'100%',objectFit:'cover'}} />
  <AbsoluteFill style={{background:'linear-gradient(160deg,rgba(22,24,42,0.7),rgba(29,32,64,0.85))'}} />
  {/* 文字在上层 */}
</AbsoluteFill>

// ② 纹理底纹平铺（来自图鱼素材/，复制到 public/textures/）
<div style={{
  backgroundImage:`url(${staticFile('textures/g02/g02-s3-texture.png')})`,
  backgroundSize:'200px 200px', backgroundRepeat:'repeat', opacity:0.06,
}} />

// ③ 情境插画（来自插图库/，复制到 public/illustrations/）
<ScaleIn delay={10} motion={style.motion}>
  <Img src={staticFile('illustrations/g02/g02-s4-illus.png')}
       style={{width:400,height:400}} />
</ScaleIn>
```

> 字体无需复制：已 bundle 的 6 个字体文件在 `video/public/fonts/`，通过 `index.tsx` 的 `@font-face` 全局注册，场景中直接用 `FONT_TITLE`/`FONT_BODY`/`TYPOGRAPHY` 常量引用。

### 4.2 什么时候需要图片素材

| 场景 | 是否需要图片 | 说明 |
|---|---|---|
| 纯 UI 组件能表达（卡片/对比/流程/数据面板） | 不需要 | 当前 G02 全部 7 屏均属此类 |
| 钩子屏需要氛围背景（如咖啡店场景照） | 先查本地 | 先查 `背景素材/`，无合适再外部找 |
| 场景需要具象插画（如顾客转赠券的画面） | 先查本地 | 先查 `插图库/`，为空则 AI 生成草稿待人确认 |
| 需要纹理/底纹 | 可选 | 先用代码 DotGrid/GlowOrb；需图片纹理时查 `图标素材/图鱼素材/` |
| 图标 | 不需要 | 内联 SVG 组件库已覆盖；新图标用 Icon MCP Server 检索/生成后转内联组件（§8.3） |

### 4.3 图片素材规格表字段

设计稿中每张需要的图片必须填写以下字段。**本地已有素材填写前 4 项 + 源路径；外部找图填写全部 9 项。**

```yaml
素材编号: IMG-GXX-01
来源: 本地-背景素材 / 本地-图鱼纹理 / 本地-插图库 / 外部找图
使用场景: S1 钩子屏
画面位置: 全屏背景（深色渐变叠加，文字在上层）
尺寸规格: 1080×1920 px，72dpi，JPG/PNG
风格方向: 扁平插画 / 2.5D等距 / 手绘涂鸦 / 写实摄影 / 孟菲斯 / 国潮水墨 / 极简线条 / 像素复古
色调要求: 与 palette:warm-orange 协调，暖橙+米白为主，避免冷色
内容描述: 一家温馨咖啡店的吧台场景，暖色调，有咖啡杯和拉花，画面右侧留白给标题文字
情绪氛围: 温暖、日常、亲切
检索关键词: 咖啡店 插画 暖色 吧台 扁平 风格 商用   # 仅外部找图时填写
版权要求: 可商用（站酷/创客贴/Envato/Unsplash License）  # 仅外部找图时填写
源库路径: 背景素材/小红书风格/3.jpg                    # 仅本地素材时填写
文件命名: g03-s1-bg.jpg
存放路径: video/public/backgrounds/g03/g03-s1-bg.jpg   # 本地素材为复制目标，外部为存放目标
```

### 4.4 字段填写规范

**素材编号**：`IMG-{视频编号}-{序号}`，如 IMG-G03-01。

**使用场景**：标注在哪个 Scene（S1-S7）和什么角色（背景/配图/装饰）。

**画面位置**：精确描述图片在画面中的位置和尺寸关系：
- 全屏背景：说明叠加层（如「深色渐变 60% 透明度叠加」）
- 局部配图：说明 x/y 坐标和宽高（如「画面中部偏右，400×400px」）
- 装饰元素：说明大小和位置（如「左下角，120×120px」）

**尺寸规格**：
- 全屏背景：1080×1920 px
- 局部配图：按实际显示尺寸 ×2（2x 图保证清晰度）
- 纹理底纹：512×512 px 可平铺
- 格式：照片用 JPG，插画/透明用 PNG

**风格方向**：从以下 8 种中选择（对应归档风格轮换方案 I1-I8）：

| 编号 | 风格 | 代码可实现度 | 素材来源建议 |
|---|---|---|---|
| I1 | 扁平几何 | 高（代码可做） | 通常不需要外部图 |
| I2 | 2.5D 等距 | 低 | 创客贴/Envato 搜 isometric |
| I3 | 手绘涂鸦 | 低 | 站酷搜 doodle/手绘 |
| I4 | 孟菲斯 | 中（代码可做几何） | 几何装饰可用代码，复杂图案需素材 |
| I5 | 国潮水墨 | 极低 | 站酷搜 国潮/水墨 |
| I6 | 极简线条 | 高（当前方案） | 内联 SVG 已覆盖 |
| I7 | 3D 黏土 | 极低 | Envato/Dribbble 搜 3D clay |
| I8 | 像素复古 | 中 | 创客贴搜 pixel |

**色调要求**：必须与当前视频的 palette 协调。写出主色 hex 值和禁用色。

**内容描述**：具体到画面元素（有什么物体、什么动作、什么构图），以及留白区域（文字要放在哪里）。

**检索关键词**：给人在设计平台搜索用的词，3-6 个，包含行业+风格+色调+元素。

### 4.5 图片在 Remotion 中的使用规范

```tsx
import { Img, staticFile, AbsoluteFill } from 'remotion';

// 全屏背景图 + 深色叠加（来自背景素材/，复制到 public/backgrounds/）
<AbsoluteFill>
  <Img src={staticFile('backgrounds/g03/g03-s1-bg.jpg')} style={{width:'100%',height:'100%',objectFit:'cover'}} />
  <AbsoluteFill style={{background:'linear-gradient(160deg, rgba(42,26,18,0.75), rgba(58,37,24,0.85))'}} />
  {/* 文字内容在上层 */}
</AbsoluteFill>

// 局部配图（来自插图库/，复制到 public/illustrations/，带入场动画）
<ScaleIn delay={10} motion={style.motion}>
  <Img src={staticFile('illustrations/g03/g03-s3-illus.png')} style={{width:400,height:400}} />
</ScaleIn>

// 纹理底纹平铺（来自图鱼素材/，复制到 public/textures/）
<div style={{
  backgroundImage: `url(${staticFile('textures/g03/g03-s3-texture.png')})`,
  backgroundSize: '200px 200px', backgroundRepeat: 'repeat', opacity: 0.06,
}} />
```

规则：
- 图片必须有入场动画（FadeInUp/ScaleIn/WipeIn 等），禁止裸放
- 背景图必须有叠加层保证文字可读（对比度 ≥4.5:1）
- 图片路径通过 `staticFile()` 引用，禁止硬编码绝对路径
- 三类素材对应三个 public 子目录：`backgrounds/`（背景图）、`textures/`（纹理）、`illustrations/`（插画）
- data 文件中通过 `image?: string` 字段指定图片路径，场景渲染器读取

---

## 五、设计稿模板（每条视频必填）

> 以下为设计稿必须包含的章节。AI 在核心环节产出此文档，人确认后进入代码执行。

### 5.1 视频元信息

```yaml
视频编号: GXX
行业: （如：美业/洗车/餐饮）
标题: （视频主题，≤14字）
总时长: XXs（≤180s）
画幅: 1080×1920 @30fps
目标平台: 抖音/小红书
```

### 5.2 风格配置

```yaml
style:
  palette: warm-orange      # 从 7 套中选
  motion: snappy            # 从 4 种中选
  typography: friendly      # 从 3 种中选（落地后生效）
  transition: slide         # 从已实现的转场中选
  hookStyle: contrast       # 从已实现的钩子型中选
```

### 5.3 相似度检查

| 维度 | G02（上一条） | 本条 | 是否不同 |
|---|---|---|---|
| palette | mint-cool | warm-orange | ✅ |
| motion | buttery | snappy | ✅ |
| transition | wipe | slide | ✅ |
| hookStyle | number | contrast | ✅ |
| 插画风格 | I6 极简线 | I3 手绘涂鸦 | ✅ |
| 场景版式 | 固定布局 | S3 横排变体 | ✅ |

**至少 3 项 ✅ 才可放行。**

### 5.4 分镜表（逐屏填写）

每屏必须包含：

```yaml
屏号: S1
场景类型: hook                    # hook/pain/solution/flow/grid/panel/cta
                                  # 现有积木不够时写 new:xxx（如 new:calendar），
                                  # 须附视觉结构/数据字段/差异说明，见 §7.2.3 步骤1
时长: 5s（150帧）
标题: （主标题文字，≤14字）
副标题: （辅助文字，≤30字）
画面布局: （描述布局结构，如「标题居中偏上，下方副标题，右上角浮动图标」）
动画时序:
  - 帧 0-2: 背景渐入
  - 帧 2-20: 标题 WipeIn（clip-path left，EASE_OUT）
  - 帧 8-30: 数字 ScaleIn（motion=style.motion，startScale=0.3）
  - 帧 20-50: 副标题 FadeInUp（motion=style.motion）
  - 帧 28: 数字 Pulse（intensity=0.08，duration=24）
图片素材: 无 / IMG-GXX-01（本地-背景素材）/ IMG-GXX-02（外部找图）  # 见 §5.5
图标: cup（从图标库选）
备注: （特殊说明）
```

**动画时序要求**：
- 每个动画元素必须标注起止帧、动画组件名、参数
- 帧序号从该 Scene 起始帧（0）开始，不是整片绝对帧
- 转场由 TransitionSeries 自动处理，不在分镜表中描述
- 动画之间避免时序冲突（见 §2.1 嵌套规则）

### 5.5 图片素材清单（含本地检索结果）

按 §4.1 流程**先检索本地素材库**，再按 §4.3 规格逐张填写。每屏的"图片素材"字段必须三选一：

1. **无图片需求**：纯 UI 组件可表达，写"无"（如 G02 全 7 屏）
2. **本地已有素材**：填写素材编号 + 来源库 + 源库路径 + 复制目标路径，示例：
   ```yaml
   素材编号: IMG-G03-01
   来源: 本地-背景素材
   使用场景: S1 钩子屏全屏背景
   源库路径: 背景素材/小红书风格/3.jpg
   存放路径: video/public/backgrounds/g03/g03-s1-bg.jpg
   画面位置/尺寸/色调: （按 §4.4 填写）
   ```
3. **需外部找图**：本地库无合适素材，按 §4.3 填写全部 9 字段（含检索关键词、版权要求），标注"外部找图"

无任何图片需求时写「本视频无外部图片素材，全部由代码 UI 组件渲染」。

### 5.6 口播稿

按 10 §7 规范产出旁白文本。设计稿阶段先出文本，TTS 合成在无声版画面确认后才执行。

### 5.7 合规自查

- [ ] 无极限词（最/第一/顶级）
- [ ] 无微信/小程序/搜索提及
- [ ] 无虚构功能/案例/数据
- [ ] 数字以 00§6 为准
- [ ] 「核销活码」不在宣传中使用
- [ ] CTA 自然收尾，无「关注/收藏/进主页」
- [ ] 「免费使用」未着重强调

---

## 六、工作流程

### 6.1 新视频启动流程

```
① 行业分析与选题
   依据 06（选题库）+ 05（行业场景）确定行业与选题
   写行业泛称画像，不编具体商户名
         ↓
② 设计稿产出（AI 核心工作）
   按 §5 模板填写完整设计稿：
   - 风格配置 + 相似度检查
   - 逐屏分镜表（帧级动画时序）
   - 逐屏判断场景积木：对照 §7.1，现有 7 种够用直接用；
     布局想换排列用版式变体（§7.3）；结构确实不同则标注 new:xxx，
     按 §7.2.3 步骤1 附视觉结构/数据字段/差异说明
   - 图片素材清单（§5.5）：先按 §4.1 检索本地素材库——
     本地有合适的标注源库路径和复制目标；本地不足的才输出外部找图规格
   - 口播稿 + 合规自查
         ↓
③ 设计稿人审（闸门）
   人确认：内容方向/风格选择/素材来源是否认可
   - 本地素材：确认选用的背景/纹理/插画是否合适
   - 外部找图：确认规格表是否准确、是否需要调整关键词
   若有 new:xxx 新积木，确认是否必要（现有积木能替代则回退）
   不认可 → 回 ② 修改
   认可 → 进入 ④
         ↓
④ 素材准备（人执行 + AI 核对）
   分两类处理：
   a) 本地素材：人按 §5.5 标注的源库路径，从根目录素材库
      复制到 video/public/ 对应子目录（backgrounds/ 或 textures/ 或 illustrations/）
   b) 外部找图：人按 §5.5 规格表到设计平台找图，
      放入 video/public/{backgrounds,textures,illustrations}/gXX/
   AI 核对：尺寸/风格/版权是否符合规格；本地素材是否已正确复制
   首次使用时由人创建对应 gXX/ 子目录
         ↓
⑤ 代码执行（AI 执行）
   新建 data/gXX.ts，按设计稿填入 scenes + style
   若设计稿含 new:xxx 新积木，按 §7.2.3 步骤3-5 实现：
   types.ts 加类型 → scenes/ 建组件 → index.tsx 注册
   → 单帧验证 → 回写本文档 §7.1
   如需新动画组件/新图标，同步扩展 components/
   扩展后回写本文档
         ↓
⑥ 无声版渲染 + 单帧验证
   npx tsc --noEmit（类型检查零错误）
   npx remotion still 关键帧（每屏至少验证 1 帧）
   npx remotion render（无声版全片）
         ↓
⑦ 无声版人审（闸门）
   人确认画面质量/动效/节奏
   不通过 → 改 data 或组件，回 ⑥
   通过 → 进入 ⑧（此步前绝不调用 TTS）
         ↓
⑧ TTS 语音合成
   豆包 TTS，先出 5-10s 样片确认语速
   再合成全片 → public/audio/gXX-narration.mp3
         ↓
⑨ 成片合成
   无声版 + 音频压合
   整片时长以音频时长为准
   分镜按音频叙事节点微调
         ↓
⑩ 发布归档
   产出 outputs/gXX-行业/ 全套交付物
   跑 check-redlines 闸门
   写生产回顾（12 §步骤12）
```

### 6.2 AI 在各步骤的职责边界

| 步骤 | AI 做什么 | AI 不做什么 |
|---|---|---|
| ② 设计稿 | 内容创意、分镜规划、逐屏判断场景积木（用现有/版式变体/新建）、动画参数、**按 §4.1 先检索本地素材库**、标注本地源路径或输出外部找图规格 | 不生成图片；不未经判断就新建积木；不跳过本地检索直接输出外部找图 |
| ④ 素材 | 核对素材是否符合规格、确认本地素材已正确复制到 public/、给替代建议 | 不替人找图（人从设计平台选或从本地库选）；不扫描全库 771 个纹理文件列路径 |
| ⑤ 代码 | 写 data、按需新建积木（§7.2.3）、扩展组件、渲染 | 不擅自改锁定层（VTemplate/components 已有组件）；不提前写没被设计稿确认的积木 |
| ⑧ TTS | 调用 API、处理音频 | 不在画面确认前合成 |

### 6.3 设计稿到代码的映射规则

设计稿中的动画时序描述与代码的映射关系：

| 设计稿写法 | 代码实现 |
|---|---|
| `WipeIn, delay=2, duration=18, direction=left` | `<WipeIn delay={2} duration={18} direction="left">` |
| `FadeInUp, delay=20, motion=style.motion` | `<FadeInUp delay={20} motion={style.motion}>` |
| `ScaleIn, delay=8, startScale=0.3` | `<ScaleIn delay={8} startScale={0.3} motion={style.motion}>` |
| `Pulse, delay=28, intensity=0.08` | `<Pulse delay={28} intensity={0.08} duration={24}>` |
| `节点 i 在 frame 18+i×22 平滑点亮` | `interpolate(f, [18+i*22, 18+i*22+15], [0,1], {easing:EASE_OUT})` + `interpolateColors` |
| `箭头方向脉冲` | `interpolate(f, [d, d+12, d+24], [0, dir==='↑'?-14:14, 0])` |
| `转场 wipe from-bottom 12帧` | VTemplate TransitionSeries 自动处理，不在场景内写 |

---

## 七、场景渲染器规格

### 7.1 已实现场景型

| type | 组件 | 数据字段 | 视觉特征 |
|---|---|---|---|
| `hook` | HookScene | title, sub, hookStyle, leftTitle, rightTitle | 深色背景+GlowOrb柔光，大字标题；支持 number（数字弹入+Pulse）/ contrast（左右红绿VS）/ question（大问号）三种钩子型 |
| `pain` | PainScene | title, leftTitle, leftItems, rightTitle, rightSub | 浅底+DotGrid点阵，左红卡痛点+右绿卡解法+VS对比 |
| `solution` | SolutionScene | title, items[], layout | 浅底+DotGrid；layout=vertical（默认，纵向通栏+左侧装饰条）/ horizontal（三卡横排+顶部装饰条） |
| `flow` | FlowScene | title, nodes[], footnote | 深色背景+GlowOrb柔光，横向流程节点+箭头，节点依次平滑点亮 |
| `grid` | GridScene | title, cards[] | 浅底+DotGrid，2×2卡片网格 |
| `panel` | PanelScene | title, metrics[] | 深色背景+GlowOrb柔光，数据指标卡（图标+箭头脉冲+数值+描述） |
| `cta` | CtaScene | title, sub | 全屏accent色+白色GlowOrb柔光，品牌署名+装饰线draw-on+标题微脉冲 |

### 7.2 场景积木扩展：判断标准与步骤

> 场景积木（scene type）不是自动增加的，由 AI 在设计稿阶段判断、人审确认后新建。以下是判断标准和完整步骤。

#### 7.2.1 什么时候用现有积木，什么时候新建

AI 在规划每屏分镜时，必须先对照 §7.1 表格判断：这一屏的叙事结构能否被现有积木承载？

| 情况 | 处理方式 | 示例 |
|---|---|---|
| 内容结构与现有积木一致，只是文案/图标/颜色不同 | 直接用现有积木 | 茶饮咖啡的「次卡锁客」用 solution，美业的「套餐卡」也用 solution |
| 结构一致但布局想换一种排列 | 用版式变体（§7.3），不新建类型 | solution 从纵排列表改为横排卡片 |
| 现有积木的视觉结构无法表达叙事意图 | 新建积木 | 美业需要「日历选日期」、餐饮需要「地图门店」、洗车需要「前后推拉对比」 |

**判断核心**：区分「内容不同」和「结构不同」。换文案、换图标、换颜色是内容不同，用现有积木；画面的信息组织方式根本不同（比如从「卡片列表」变成「日历格子」），才是结构不同，需要新建。

#### 7.2.2 行业常见需新增积木的场景（参考，非穷举）

| 行业 | 可能需要的新积木 | 原因（现有积木为何不够） |
|---|---|---|
| 美业/预约制 | `calendar`（日历选择型） | 现有积木无「日期格子+选中态」结构 |
| 餐饮/到店 | `map`（地图 LBS 型） | 现有积木无「地图+门店标记」结构 |
| 洗车/家政 | `before-after`（前后对比型） | pain 是红绿文字对比，无法表达「图片推拉对比」 |
| 教育/健身 | `timetable`（课程时间表型） | 现有积木无「时间轴+多列排期」结构 |
| 零售/电商 | `carousel`（商品轮播型） | grid 是固定 2×2，无法表达「横向滑动浏览多个商品」 |
| 任何行业 | `testimonial`（评价型） | 现有积木无「引号+头像+评价文字」结构 |

> 以上仅为预判参考，实际是否新建以设计稿阶段的判断为准。不要为了「可能用到」提前写积木——有真实内容验证才写。

#### 7.2.3 新建积木的完整步骤

当判断需要新建积木时，AI 按以下顺序执行：

**步骤 1 · 设计稿阶段标注（AI 做，人审确认）**

在设计稿分镜表中，该屏的 `场景类型` 字段写 `new:xxx`（如 `new:calendar`），并附：
- 新积木名称与用途（一句话）
- 视觉结构描述（画面怎么组织、有哪些元素、什么布局）
- 数据字段定义（需要哪些内容字段，字段名 + 类型 + 说明）
- 与现有积木的差异说明（为什么不能用现有积木或版式变体）
- 动画时序（按 §5.4 帧级规范写）

**步骤 2 · 人审确认（闸门）**

人在审设计稿时确认：这个新积木是否必要？如果现有积木能替代，回退用现有积木。确认后才进入代码阶段。

**步骤 3 · 代码实现（AI 做）**

1. 在 `types.ts` 的 `SceneType` 联合类型中新增类型名
2. 如果有新数据字段，在 `Scene` interface 中加对应可选字段
3. 在 `scenes/` 新建渲染器组件（如 `CalendarScene.tsx`），严格遵守 §2 全部技术硬规则：
   - 动画用 `useCurrentFrame` + `interpolate`/`spring`，禁止 CSS animation
   - 所有 spring 透传 `style.motion`
   - 非 spring 插值用 `EASE_OUT`
   - 颜色变化用 `interpolateColors`，禁止 boolean 瞬切
   - 文案/颜色从 scene 数据和 palette 读取，不硬编码
4. 在 `scenes/index.tsx` 的 `SceneRenderer` switch 中注册新类型
5. 如果需要新图标，先用 Icon MCP Server（`search_icons`/`generate_icon`）检索或生成 SVG，再转内联组件加入 `components/icons.tsx`（见 §8.3）
6. 如果需要新动画模式（现有 6 个动画组件不够），在 `components/animations.tsx` 加新组件

**步骤 4 · 验证（AI 做）**

1. `npx tsc --noEmit` 零错误
2. 至少渲染 1 帧 still 检查布局和动画起始态
3. 如果该积木有复杂时序（如依次点亮、多阶段动画），渲染多帧验证
4. 跑 `check-redlines` 闸门

**步骤 5 · 文档回写（AI 做）**

1. 在本文档 §7.1 表格中新增一行（type / 组件 / 数据字段 / 视觉特征）
2. 如果加了新动画组件，在 §8.1 表格中补充
3. 如果加了新图标，在 §8.3 补充
4. 在当日记忆 `.workbuddy/memory/YYYY-MM-DD.md` 记录新增了什么积木、为什么需要

#### 7.2.4 新积木的质量标准

新积木必须满足：
- **结构独特**：与已有积木在画面信息组织方式上有肉眼可辨的差异，不是换色/换图标/换排列方向
- **可复用**：积木是通用叙事结构，不绑定某行业的具体内容（如 calendar 任何预约制行业都能用，不是「美业日历」）
- **合规**：不画不存在的产品功能界面、不编虚构 UI
- **动画完整**：有入场动画，元素有时序编排，不是静态画面堆元素

### 7.3 版式变体（待实现）

同一 scene type 支持多种布局变体，通过 scene 数据中的 `layout?` 字段控制。例如 SolutionScene 可支持：
- `vertical`（当前）：纵向卡片列表
- `horizontal`：横向滑动卡片
- `split`：左图右文分屏

实现版式变体时，在场景组件内按 `scene.layout` 条件渲染，不新建 scene type。

---

## 八、原子组件库规格

### 8.1 动画组件（components/animations.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `FadeInUp` | delay, dist, motion | 向上淡入（标题/正文/卡片通用） |
| `SlideInLeft` | delay, motion | 从左滑入（痛点卡） |
| `SlideInRight` | delay, motion | 从右滑入（解法卡） |
| `ScaleIn` | delay, motion, startScale | 缩放弹入（数字/卡片/图标） |
| `WipeIn` | delay, duration, direction | clip-path 擦入（标题 reveal） |
| `Pulse` | delay, intensity, duration | 单次脉冲强调（数字/箭头） |

所有组件透传 motion，spring config 从 SPRING_CONFIG 读取。EASE_OUT 为标准缓动常量。

### 8.2 UI 组件（components/ui.tsx）

| 组件 | 用途 |
|---|---|
| `SlideTag` | 进度指示器（SLIDE XX/XX），左上角，12 帧淡入 |
| `SectionTitle` | 段落标题，带下划线 wipe 擦入，宽度按中文字宽估算 |

### 8.3 图标库（components/icons.tsx）

内联 SVG 图标，通过 `Ico[name](color)` 调用。当前覆盖：cup, x, check, gift, clock, users, cash, bolt, search, arrow 等。新增图标需保持单色描边风格统一。

**新增图标流程（Icon MCP Server 已接入）**：

项目根目录 `.mcp.json` 已配置 `icon-mcp-server`（npx 全局安装 v1.4.0）。新增图标时：

1. **先查 `icons.tsx`**：确认现有图标是否够用。
2. **`search_icons`**：用英文关键词（逗号分隔可批量）从 Element Plus + Ant Design 图标库模糊检索，返回 SVG 代码。`search_icons` 无需 API Key。
3. **`generate_icon`**：检索不到时用 AI 生成（需 `DASHSCOPE_API_KEY` 环境变量），传入 description + style（element-plus/ant-design/default）。
4. **转内联组件**：将返回的 `rawSvg` 转为 `icons.tsx` 中的 React 组件，统一改为 `width="100%" height="100%"`、`stroke={c}`（单色描边风格）、`fill="none"`，加入 `IconKey` 类型和 `Ico` 映射表。
5. **禁止直接引用外部 SVG 文件/CDN**：所有图标必须是内联 React 组件，确保 Remotion 渲染时无网络依赖。

---

## 九、质量检查清单

### 9.1 代码提交前

- [ ] `npx tsc --noEmit` 零错误
- [ ] 所有动画组件 motion 参数从 style.motion 读取
- [ ] 所有非 spring interpolate 有 EASE_OUT easing
- [ ] 无 CSS animation/transition
- [ ] 场景间通过 TransitionSeries 连接，无硬切
- [ ] 无硬编码文案/色值（语义色除外）
- [ ] 图片用 `<Img src={staticFile(...)} />`
- [ ] 中文字体通过 @font-face 本地加载

### 9.2 渲染验证

- [ ] 每屏至少渲染 1 帧 still 检查布局
- [ ] 钩子屏前 3s（frame 0-90）静音可懂
- [ ] 文字在安全区内（左右 ≥48px，底部 ≥120px）
- [ ] 背景图叠加后文字对比度 ≥4.5:1
- [ ] 总时长 ≤180s
- [ ] 转场无闪烁/跳帧

### 9.3 合规闸门

- [ ] `node scripts/check-redlines.mjs` code 层零命中
- [ ] 无微信/小程序/搜索
- [ ] 无极限词
- [ ] 无核销活码宣传
- [ ] CTA 自然收尾

---

## 十、命令参考

```bash
cd video

# 安装依赖
npm install

# 类型检查
npx tsc --noEmit

# Studio 实时预览
npm run dev

# 单帧渲染验证（每屏至少验 1 帧）
npx remotion still src/index.tsx GXX-Industry /tmp/frame-s1.png --frame=45 --scale=0.4

# 无声版全片渲染
npm run render

# 4K 超采样终稿（慢，文字更锐利）
npm run render:4k

# 红线闸门
cd .. && node scripts/check-redlines.mjs
```

### 关键帧参考（G02 7 屏，转场后绝对帧）

| 屏 | 大致帧范围 | 建议验证帧 |
|---|---|---|
| S1 hook | 0-138 | 45 |
| S2 pain | 138-400 | 250 |
| S3 solution | 400-650 | 550 |
| S4 flow | 650-950 | 750 |
| S5 grid | 950-1250 | 1100 |
| S6 panel | 1250-1600 | 1450 |
| S7 cta | 1600-1938 | 1850 |

> 不同视频时长不同，帧范围按实际 dur 计算。验证帧选该屏中段（起始帧 + dur×FPS×0.3）。

---

## 十一、与其他文档的关系

- **10（视频制作方案）**：定义内容策略（做什么、为什么、平台规则），本文档定义技术实现（怎么精确做到）
- **12（SOP）**：总流程，本文档是步骤 4-8 的技术细化
- **00（产品事实表）**：功能边界唯一源，设计稿中涉及的功能描述必须以此为准
- **06（选题库）**：视频选题来源
- **07（渠道与执行）**：分平台 CTA 与发布规则
- **11（素材规范）**：素材入库与授权规则
- **quandao-content skill**：红线/合规/SOP 单一权威
- **outputs/archive/视频风格轮换方案-防视觉疲劳-20260813.md**：六大维度的原始构想，本文档 §3 是其代码落地状态

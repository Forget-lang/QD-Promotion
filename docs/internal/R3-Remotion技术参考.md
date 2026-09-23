# R3 · Remotion 技术参考（原理层）

> 最后校验：2026-09-01（变更史见 docs/changes/，本文不复述）。
> 旧 workflow/pipeline、craft、弹药库等文件均已物理删除（git 可查），现行口径以 `SKILL.md` 为准；本文件=原理与 API 参考。
> 这份文档是**参考层**：解释"为什么"和"组件怎么用"。正常做视频**不需要**读它，按 `SKILL.md` 的八步法操作即可；遇到渲染异常、需要新建积木/组件/图标、或想理解声画同步原理时，再查本文件。
> 操作流程（怎么做出片）在 `SKILL.md`（八步法），制作硬规则（动画/转场/布局/代码结构操作版）在本文件「七、制作硬规则」，本文件不重复流程环节。

---

## 一、声画同步原理（J-cut 为什么能帧级同步）

> 这是测试沉淀的核心经验：语音与画面如何做到帧级精确同步。

**核心原理**：`视频 = f(frame)`，frame 从 0 到 N，每一帧独立渲染、结果唯一（Remotion 与传统剪辑器的本质区别——"代码即时间线"）。
- 全片固定 FPS（30），`durationInFrames = 秒数 × 30`，无浮点误差
- 动画参数通过 `interpolate(frame, ...)` 由 frame 直接计算，不依赖"播放了多久"
- 第 150 帧渲染 100 次结果完全一样，不存在播放漂移

**三层同步机制**：
1. `<Audio>` 组件精确时间定位：`startFrom` / `endAt` 单位是帧不是秒；多段音频各自对齐到对应分镜起始帧，音量用 `interpolate(frame, ...)` 做帧级淡入淡出
2. `useCurrentFrame()` 驱动动画：所有动画都是 frame 的函数，`spring({ frame: frame - offset, fps })` 起始帧精确可控，不因性能波动延迟
3. `<Sequence from={from} durationInFrames={dur}>` 嵌套组织时间线：相当于轨道片段，`from` 决定该区块从全局第几帧开始；嵌套 Sequence 可精确控制子动画相对分镜起点的偏移

**渲染管线（双轨并行 + 最终 mux）**：
1. **视频轨**：Headless Chrome 逐帧截图 → FFmpeg 编码视频
2. **音频轨**：解析所有 `<Audio>` 的 `startFrom`/`endAt`/`volume(f)` → FFmpeg `amix` 混合多轨 → AAC 编码
3. **最终合成**：FFmpeg 按精确时间戳封装进 MP4，精度微秒级

→ 结论：`<Audio>` 的 `volume` 是帧级精确的，`startFrom` 是帧级精确的，不存在"大概"或"漂移"。

**J-cut 转场同步法原理**：
```
时间：     ←──── 转场 0.4s（12帧）────→
上屏音频： 正常音量 ─── 1→0 线性淡出 ── 0   （尾音完整说完，最后 0.4s 渐弱）
下屏音频：  满音量 ───── 正常播放 ──────     （第一个字 100% 完整清晰，零淡入）
画面：     上屏渐出 ←────────→ 下屏渐入
```
- 上屏音频从语音实际结束点开始淡出（B 方案：voiceDur 实测回填，尾字零削波；未回填时退回到最后 12 帧固定淡出）
- 下屏音频在转场第 0 帧以满音量进入（首字不丢）

**音频时长精确获取 API**：
```tsx
import { getAudioDurationInSeconds } from '@remotion/media-utils';
const duration = await getAudioDurationInSeconds(staticFile('audio/{视频ID}/s1.wav'));
const frames = Math.round(duration * 30);
```
渲染前用此 API 拿到精确时长（非估算），再决定分镜帧数。

**预览 vs 渲染差异**：Remotion Studio 预览时音频和画面可能因性能有轻微延迟，**最终 `npx remotion render` 渲染结果一定同步——以渲染结果为准，不以预览为准**。

**音频预处理（零裁剪、零淡入，只做响度归一化）**：
- TTS 语速控制：**seed-tts-2.0 的 speed_ratio 参数实测无效**（G04 2026-08-25 实测 0.5~2.0 时长不变），语速一律用 **ffmpeg atempo**（纯变速不变调）；定稿值与语速口径以 SKILL 第 6 步（渲染与量化验收）为准，改值须重测并回写 SKILL
- 仅用 ffmpeg `loudnorm=I=-16:TP=-1.5:LRA=11` 做响度归一化（`scripts/process-audio.sh`）
- 不裁剪首尾静音，不做文件级淡入淡出（淡入淡出在代码层用 `<Audio volume={f}>` 帧级控制）

**为什么是确定性的（不需要反复试）**：
1. TTS 同一模型同一参数，语速波动 ±2% 以内
2. ffprobe 毫秒级精确测量音频时长
3. Remotion 帧级渲染，音量曲线是精确数学函数
4. 所有 dur 从 audioDuration 直接推导，无经验调参
→ **TTS 只生成一次，渲染一次成片，零调试**

---

## 二、动画原理

### 2.1 帧驱动（为什么禁止 CSS 动画）

Remotion 逐帧渲染，**CSS animation/transition 的时间轴与 Remotion 帧不同步，渲染结果不可控**。唯一合法的动画驱动方式是 `useCurrentFrame() + interpolate/spring`。

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
// 例：2 秒内从透明到不透明
const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
  extrapolateRight: 'clamp',
});
```

### 2.2 Spring 物理弹簧

`spring()` 基于真实物理模型，返回值通常为 0→1，可映射到缩放/位移/旋转等属性。

```tsx
spring({ frame: frame - delay, fps, config: { stiffness, damping, mass } });
```

**参数安全带**：`stiffness 80-200`、`damping 20-60`。**damping 过小会导致无限震荡**（如 bouncy 应控制 damping ≥ 12）。本项目 `SPRING_CONFIG` 已有四套预设（bouncy/snappy/buttery/heavy），全部动画组件透传 `style.motion`，一般不需要自调参数。**注意：本段是目标写法，不是已生效机制**——实际消费者与屏内 damping 分派现状以 grep / `list-assets` 为准（文档宪法铁律三，本文不复述快照）。

**使用建议**：
- 用 `measureSpring()` 精确计算弹簧动画持续帧数，不要手估
- 入场/强调用 spring（带过冲更生动）；离场、长距离位移用 easing 更稳

### 2.3 缓动（Easing）

**非 spring 插值必须指定 easing**，禁止裸 `interpolate` 不设 easing（默认线性，观感生硬）。

```tsx
// 标准缓动曲线：全项目统一 EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1)（expo-out）
interpolate(driver, [0, 0.3, 1], [0, 1, 1], {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

**选型参考**：
- 入场：expo-out（快起慢落）通用
- 关键数字/标题强调：`Easing.back(1.2)` 或 spring 轻微过冲
- 数字滚动：easeInOut 或 expo-out + clamp
- 禁止裸线性（唯一例外：匀速滚动字幕等刻意匀速场景）
- **插值必须 `extrapolateRight: 'clamp'` 防越界**

### 2.4 节奏与错峰（为什么动效显得高级）

- 同屏元素 stagger 间隔 **4-8 帧**（太快=齐步走，太慢=拖沓）
- 主体动画时长 **20-40 帧**（0.7-1.3s）：短于 0.5s 生硬，长于 1.5s 拖沓
- 每屏只设一个**主动画时刻（peak frame）**，其余元素围绕它编排（对应"一屏一焦点"）
- **禁止嵌套动画时序冲突**：父容器入场动画期间，子元素不要设独立 delay 超过父动画时长（会导致子元素在不可见期间空跑动画）。例：`<HandIn delay={14}><内联动画 delay={40}>`（各片内联入场包装同理）父动画 14-30 帧期间子元素 opacity=0

### 2.5 颜色过渡

涉及颜色变化的动画**禁止 boolean 切换**（瞬切生硬），必须用 `interpolateColors`：

```tsx
// 错：const lit = f > threshold; color={lit ? '#fff' : '#333'}
// 对：interpolateColors(f, [t, t+15], [rgba(255,255,255,0.08), '#ffffff'])
```

---

## 三、组件 API 规格（video/src/components/）

> 分发器在 `video/src/scenes/index.tsx`（ui 必填、无回退），本片专属屏组件在 `video/src/videos/gXX/`（g06 首条正式片已建：`index.tsx` 全部屏组件内联 + `types.ts` payload 形状；新片另起一个目录），原子组件库在 `video/src/components/`。组件是**原子积木，非成品模板**——每条视频独立设计、组合方式不同。组件靠纪律生长（见四）。

### 3.1 动画原子（components/animations.tsx）

2026-09-02 Q4 零引用件清理后，本文件只留三个被真实消费的原子，**无任何成品入场包装件**：

| 原子 | 说明 |
|---|---|
| `SPRING_CONFIG` | bouncy/snappy/buttery/heavy 四档 spring 参数；VTemplate 转场 timing 与各片手写 spring 都从这里取 |
| `EASE_OUT` / `EASE_IN` | expo-out / expo-in 标准缓动常量，非 spring 插值统一用 |

> **已删的入场包装件**：`FadeInUp / SlideInLeft / SlideInRight / ScaleIn / WipeIn / Pulse`（零消费者，且与「每片入场内联手写」冲突，禁止回建）。**现行入场写法** = 各片 `videos/gXX/index.tsx` 内联一个 `HandIn` 包装（读 `SPRING_CONFIG[style.motion]` + 缓动），新片照此在片内重写，不再往共享层加成品入场件。

### 3.2 UI 组件（components/ui.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `Subtitle` | lines[{text,startFrame,endFrame}]、motion?（MotionKey，缺省 snappy） | 底部多行字幕（帧级精确同步）：白字黑描边，距底 60px，最多同时显示 2 行；2026-09-03 动态字幕升级——入场 spring 上滑落定（透传 motion，分发器从 style.motion 传入）、新行在场时旧行降至 0.72、离场快速淡出；分发器统一挂载 |

> **2026-09-02 Q4 清理**：`CharReveal`（逐字入场）、`AccentWord`（重音词）、`elevation`（投影常量）零消费者已删——逐字入场、重音词、阴影各片按锚稿手写。

> ⚠️ **2026-08-29 删除的 9 个"统一外观"业务组件**：`SectionTitle`、`IconBadge`、`PhoneMockup`、`CouponCard`、`StatCounter`、`StatCard`、`StepFlow`、`CompareCard`、`HighLightText`——它们把券面/手机壳/步骤条外观焊死，违反「外观每片必新」，禁止以任何形式原样恢复；新屏外观一律照质感锚（`outputs/bench/anchor-*.png`）与 ref 底稿样张逐片手写。**沉淀为纪律的口径仍有效**：券面金额右置、全 App 无条形码不画条码、图标不裸放（须有容器）、滚动数字只用于真实可述口径、顶栏/胶囊规格按 R6 §8 真值复刻。

### 3.3 图标库（components/icons.tsx）

内联 SVG 图标，通过 `Ico[name](color)` 调用（映射表，非组件）。当前覆盖：cup, x, check, gift, clock, users, cash, bolt, search, arrow 等。新增图标保持单色描边风格统一。

**新增图标流程（Icon MCP Server 已接入，.mcp.json 配置）**：
1. 先查 `icons.tsx` 是否够用
2. `search_icons`：英文关键词（逗号分隔）从 Element Plus + Ant Design 图标库模糊检索（无需 API Key）
3. `generate_icon`：检索不到时 AI 生成（需 `DASHSCOPE_API_KEY`），传 description + style
4. 转内联组件：`rawSvg` → `icons.tsx` 中 React 组件，统一 `width="100%" height="100%"`、`stroke={c}`、`fill="none"`，加入 `IconKey` 和 `Ico` 映射表
5. **禁止引用外部 SVG 文件/CDN**：所有图标必须是内联组件（保证渲染无网络依赖）

### 3.4 氛围组件（components/background.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `Grain` | opacity=0.035 | 全片颗粒层（VTemplate 挂载）：杀纯色渐变 banding，全片图层质感统一 |
| `Vignette` | strength=0.25 | 全片暗角（VTemplate 挂载）：径向渐变聚焦中部视线 |
| `AccentOverlay` | color/opacity=0.18 | 背景图主色统调（VTemplate 挂载，soft-light 只混下层） |

> **2026-09-02 Q4 清理**：`DotGrid`（浅底点阵）、`GlowOrb`（深底柔光）零消费者已删——需要点阵/光斑的各片在屏内手写。（`KenBurnsBg` 也在本文件、由 VTemplate 挂载做背景图推近，属存活原子。）

> ⚠️ 氛围层三件套（Grain/Vignette/AccentOverlay）是**全片必挂**（VTemplate 统一挂载，场景与设计稿无需处理），是画面"质感"的关键来源。缺失时画面偏平偏黑。
> 注意挂载条件：Grain/Vignette 无条件挂全片；AccentOverlay 仅在 `video.style.bgImage` 存在（有背景图）时挂载（代码条件渲染，无背景图时不挂）。

### 3.5 镜头感组件（已移除，camera.tsx 已删）

~~2026-09-03 动效升级四项新增：`components/camera.tsx` 提供 `Drift` 视差漂移（noise 驱动极慢浮动，背景/中景/前景三层 depth 0.4/1/1.6）与 `PushIn` 重点推近（停留期极慢缩放）。~~ 2026-09-07 经 g08 三案实测双双否决移除：
- `PushIn`：任何缩放（含 0.001 量化步进）在步进点都会重光栅化文字——实测步进帧对 23.7dB（比连续缩放逐帧 36.4dB 单次更大），量化只是把逐帧沸腾改成每 6 帧一次的 5Hz 抽动（补30，g08 五屏文字层包裹已拆）。
- `Drift`：补29 已证亚像素位移/微旋转逐帧重光栅化文字（50.7dB），取整后虽步内=inf，但整像素步进仍是主体元素（卡片/牌匾/角标）停留期持续移动——用户终裁「主体元素停留期不要持续微动」（补31，g08 五屏 Drift 包裹全拆）。
- `camera.tsx` 零引用随删（2026-09-07）。停留期镜头感改由 KenBurnsBg 背景缓推（只动背景图，全片 1→1.04）+ 卡顶流光承担。**文字保锐 + 主体静止红线**详见 `remotion-components` 包 §③C（新增镜头类组件一律先过此红线）。本节仅留移除记录防复述，勿再引用该文件。

### 3.6 语音能量（已移除）

~~2026-09-03 动效升级四项之一：`components/voice.tsx` 的 `useVoiceEnergy()` 取口播能量驱动强调元素微脉动。~~ 2026-09-07 经 g08 实测否决：瞬时波形接线后 hero 行持续高频抖动，加 0.5s 指数衰减平滑后观感仍为"微微颤动"（用户裁决此效果不要），`voice.tsx`、`useVoiceEnergy` 及 VTemplate 的 Provider 挂载已全部移除（2026-09-07 裁决）。动效升级自此为两项（动态字幕/母题转场，镜头感项随 camera.tsx 移除并入 KenBurnsBg 背景缓推，见 §3.5 与补31）。本节仅留移除记录防复述，勿再引用该组件。

### 3.7 风格维度（video/src/palette.ts + data/gXX.ts style）

| 维度 | 字段 | 可选值 | 说明 |
|---|---|---|---|
| 配色 | `style.palette` | mint-cool / warm-orange / berry-purple / deep-blue / caramel / ink-green / neon（7 套） | `palette.ts` PALETTES。注意：主题变量只覆盖部分元素，专属屏内仍有硬编码色值（数量以 grep 现查为准）；是否收口到 `p.accent` 等属未拍板的设计决策 |
| 动画性格 | `style.motion` | bouncy / snappy / buttery / heavy（4 种） | `SPRING_CONFIG` 由转场 timing 消费（VTemplate）；屏内 spring 是否按 motion 分派属代码状态，以 grep 为准——未收口前别把透传当已生效机制 |
| 转场 | `style.transition` | slide / wipe / dissolve / zoom / pop / reveal（6 种） | 自定义呈现组件在 VTemplate.tsx，六种观感真实可见；`reveal` = 母题有机曲边扫过揭示（+ 主色边缘描边），行业边缘形态按母题在骨架上每片扩展（口径见 `remotion-components` 包 §③C） |
| 钩子型 | `style.hookStyle` | 六值均为待本片实现的分派键（旧共享钩子已删，0/6 实现） | 本片实现时照锚稿手写钩子屏 |

> 2026-08-31 删「字体性格」维度：`style.typography` 声明了从未有渲染器消费，TypographyKey/TYPOGRAPHY 表与 g06 的 'friendly' 声明一并删除；字体直接用 `palette.ts` 的 FONT_* 常量。

---

## 四、组件生长机制（靠纪律生长）

> 原则：**不一次性大建**（避免过早优化），**也不无纪律堆砌**（避免重复造轮子）。装饰组件**少而精**：画面主要靠排版层级和内容动效撑，不靠堆装饰件（防"会动的 PPT"感）。

**三条机制（2026-08-29 随"统一外观组件删除"重写——旧版"跨行业结构必须提成通用组件"正是同质化的制度来源，已废止）**：

| 机制 | 规则 | 触发时机 |
|---|---|---|
| 提炼纪律 | 只有**动画/提效原子件**（透传 motion 的入场包装、投影常量、字幕类通用工具）允许进 `ui.tsx`/`animations.tsx`；任何带**行业外观**的成品结构（券面/手机壳/步骤条/对比卡）禁止提成共享组件——外观每片新写，参照锚稿手写进本片 `videos/gXX/` | 写代码时 |
| 回顾收编 | 生产回顾固定加一问：「这次哪些**动画/工具**值得提成原子件？」提出后收编并更新本文件「三、组件 API 规格」；场景级 JSX 一律不收编（它会变成下一条片的皮肤） | 生产回顾时 |
| 禁预建 | 无需求不建组件；**"产品核心物件"外观件永久禁止预建**（券面每片按锚稿重画是纪律不是成本） | 任何时候 |

**写代码时对照判断**：

| 情况 | 做法 | 例子 |
|---|---|---|
| 纯运动/工具包装（不含外观） | ✅ 提成原子件跨片复用 | `SPRING_CONFIG`、`EASE_OUT`、`Subtitle` |
| 带外观的成品结构（券面/步骤条/手机壳） | ❌ 不提成共享组件；本片内手写，下片照锚稿重新手写 | 原 CouponCard/StepFlow 等 9 件已删 |
| 只此一家的场景结构 | ✅ 留在本片场景文件内 | 曲线抬升、撕纸缺口逻辑 |
| 海报风装饰件（窗口容器/吊牌/波浪线） | ⚠️ 默认不建代码；设计稿确需时按需实现（判据是上文「少而精」原则 + 看真图，不设数量配额——2026-08-30 拍板，配额会绑架设计） | 浏览器顶栏容器、吊牌标签 |

✅ 正确：三个行业各照锚稿手写券面，入场基于 `SPRING_CONFIG` / 缓动原子在各片内联 `HandIn` 包
❌ 错误①：把上一片的券面 JSX 原样 import 过来（= 换皮复用，`check-similarity` + 一屏标杆双拦）
❌ 错误：每屏都套浏览器顶栏容器当背景（装饰件滥用，像会动的 PPT）

---

## 五、扩展指南（新建积木/动画/图标）

### 5.1 什么时候新建场景积木

> **2026-08-28 前置铁律（优先于下表，2026-08-30 判据更正）**：一条视频一套专属 UI 语言（`remotion-components` 包 §③A·行业视觉母题）。**与任何已产出视频同结构的屏一律新建**——判据是**一屏标杆：用户逐张看真图**（`node scripts/check-similarity.mjs` 只防"照抄上一片的 ui 名"，换前缀重做同款骨架它永不碰撞，别拿它的绿当"结构没重复"，能力边界见该包 §⑧A）。下表只在"本片还没有同类结构"时用。

| 情况 | 处理方式 |
|---|---|
| 本片要的叙事槽位，已产出视频里有屏用过同一结构 | **新建本片专属组件**（`videos/gXX/` + 屏上 `ui:'名字'`）；确需沿用 → 提出复用例外提案，用户批准并在 `ref-registry.json` `similarityExemptions` 登记 |
| 全库都没有这个结构 | 同样新建本片专属组件——`scenes/` 共享场景已于 2026-08-29 整体删除，**不再往共享层加任何屏级积木**；`scenes/index.tsx` 只剩分发注册 |
| 结构一致但本片想换一种排列 | 仍按上一条判：排列不同 = 视觉结构不同 = 新建；同一组件加 `layout` 变体只用于**该组件在本片第一次出现**时 |
| 只有文案/图标/颜色不同（骨架与已产出某屏一致） | ❌ 这就是"换皮"，不是"用现有积木"——按第一行处理 |

**判断核心**：先问「这条结构在已产出的任何一条里出现过吗」，出现过就要新结构；再问「信息组织方式是否根本不同」。配色/字体/图标不同不构成差异。

### 5.2 新建积木完整步骤

1. **设计稿标注**：分镜表 `场景类型` 写 `new:xxx`，附：名称用途 / 视觉结构 / 数据字段定义 / 与现有积木差异说明 / 帧级动画时序
2. **人审确认**：能替代则回退用现有积木
3. **代码实现**（按顺序，2026-08-29 起全部落在本片目录，共享层冻结）：
   - 本片 `videos/gXX/types.ts` 定义该屏 payload 形状（通用 `types.ts` 的 `Scene` 不再加业务字段；叙事槽位不够用时才给 `SceneType` 加值）
   - `videos/gXX/` 新建屏组件（如 `Calendar.tsx`），严格遵守动画原理（§二）：帧驱动、透传 motion、EASE_OUT、interpolateColors、文案/颜色从 payload 与 palette 读取
   - `scenes/index.tsx` 的 `VIDEO_RENDERERS[视频id]` 注册 `ui 名 → 组件`（一行 import + 一个键）
   - 新图标按 §3.3 流程；新动画模式在 `components/animations.tsx` 加组件
4. **验证**：`npx tsc --noEmit` 零错误 → 至少渲染 1 帧 still → 复杂时序渲染多帧 → 跑红线闸门
5. **文档回写**：本文件组件表补充；组件清单由 `node scripts/list-assets.mjs` 实时生成；当日记忆记录

### 5.3 新积木质量标准

- **结构独特**：与已产出任何一屏在画面信息组织方式上有肉眼可辨差异，不是换色/换图标/换排列方向
- **数据驱动**：文案/颜色/字段全部从本片 payload 读取、零硬编码——复用指"同一片内多屏用同一组件喂不同数据"，跨片复用组件外观一律禁止（§四 禁预建）
- **合规**：不画不存在的产品功能界面、不编虚构 UI
- **动画完整**：有入场动画，元素有时序编排，不是静态画面堆元素

### 5.4 积木规格示例（历史实例：CardFaceScene——组件已删，规格写法保留当范本）

> 按 5.2 步骤 1 的五要素写全（2026-08-25 定规格，G04 S3 曾落地；CardFaceScene 已随共享场景删除，卡面现行参照 = 锚稿 `outputs/bench/anchor-bundle-open.png` 实物特写）。本节留作**新屏规格该写到什么颗粒度**的写法示例——照这个深度给本片专属组件写规格。

**① 名称用途**：`cardface` 次卡磁条卡面屏——展示次卡产品的完整卡面（`spec/facts.json`：次卡=磁条卡面+9 色深色系）。用于方案屏展示"这张卡长什么样、有哪些字段"，是信息密度升级核心（替代 solution 白卡列表，防"换皮同款"）。

**①.5 产品原型参考（2026-08-25 加，必读）**：真实产品卡面在 `../applet/components/m/m-card-magnetic-face/m-card-magnetic-face.vue`（顾客端"我的卡包"次卡磁条卡面组件），旧 CardFaceScene 按此视觉结构重绘；本片专属组件同样照此真值手绘（只参考样式，不截真实界面图，`spec/redlines.json` rules.video_visual）：
- 卡面结构：深色主题底 + 磁卡质感背景图 + 右上角光晕（radial-gradient circle at 88% 6% 白 22%）+ 主题色渐变蒙层（165deg：主题色 15% → 透明 42% → 底部黑 12%）
- 信息层级（真实产品）：**次数大字是焦点**（64rpx/700）> 卡名（44rpx/700）> 单位/总数（30rpx/22rpx 半透明白）> 底部徽章+有效期（22rpx 白 72-88%）
- 底部：左类型徽章（白 88% + 1rpx 白 35% 描边圆角）+ 右有效期文案（右对齐）
- 圆角 24rpx / padding 32rpx / 固定高 296rpx（视频版按 1080 画幅等比放大）
- 9 色主题（`../applet/utils/theme.js`）：尊享红 #8B1A32 / 酒窖红 #6A2432 / 鎏金黄 #786018 / 墨玉绿 #0C453D / 午夜蓝 #212F99 / 赤铜棕 #6B3A2A / 曜石黑 #121216 / 御紫 #3E2060 / 深海蓝 #123448——G04 美业可选「御紫 #3E2060」或「鎏金黄 #786018」与粉紫背景呼应

**② 视觉结构**（1080×1920，浅色背景；卡面按产品原型①.5 重绘，无单独磁条横条——磁感来自光晕+渐变蒙层）：
- 标题区 y:220-400（title + sub）
- 卡面 y:460-1340（660×880 居中，圆角 36，深色主题底，白字）：
  - 磁卡质感（代码模拟，不引外部图）：右上角光晕（radial-gradient circle at 88% 6%，白 22%→透明）+ 主题色渐变蒙层（165deg：主题色 15%→透明 42%→底部黑 12%）
  - 右上角：商户名（merchantName，24px 半透明白，右对齐，行业泛称如"美容院"）
  - 左卡名（cardName）：56px 白 700（等比例放大自产品 44rpx）
  - **次数焦点大字（times）：100px 白 700 + "次" 44px 白 88% + "/ 共 {total} 次" 32px 白 72%**（产品层级：次数是焦点）
  - 字段区（视频信息密度附加，产品卡面主体不显示这些字段——来自 01 卡券制作单）：2 列网格（icon + 字段名 26px 半透明白 + 值 32px 白）：核销间隔 3 天 / 私密发放 / 可转赠（3 项，次数与有效期已在卡面主体）
  - 底部（flex 撑底）：左类型徽章（cardType，30px 白 88% + 2px 白 35% 描边圆角）+ 右有效期（validLabel，28px 白 72% 右对齐）
- 卡面下方副标注：**默认不显示**（2026-08-25 修：原"截图发给顾客，照着做"是规格示例被写死，属设计者注释，观众不明所以，禁止使用）；确需副标注时只写有信息价值的文字（如使用须知要点），且必须来自 01 文案

**③ 数据字段定义**（2026-08-29 起：这类业务字段放**本片 payload**，不再进通用 `types.ts` 的 Scene）：
```ts
// 本片 videos/gXX/types.ts 内定义该屏 payload 形状（示意）
interface CardfacePayload {
  cardName: string;                   // 卡名（如"六次养护卡"）
  cardType: string;                   // 类型徽章（如"次卡"）
  merchantName: string;               // 卡面右上商户名（行业泛称，如"美容院"）
  times: number;                      // 次数焦点大字（如 6）
  total: number;                      // 总次数（"/ 共 {total} 次"）
  validLabel: string;                 // 底部有效期文案（如"有效期 90 天"）
  fields: { icon: IconKey; label: string; value: string }[];  // 附加字段网格（≤4 项）
}
```

**④ 与现有积木差异**：solution 是"白卡列表"（浅色卡片+图标+说明）；cardface 是"产品卡面"（深色磁条卡+字段网格）——信息组织方式根本不同（产品本体 vs 卖点列表），肉眼可辨，满足 5.3 结构独特标准。

**⑤ 帧级动画时序**（参考 · 此示例沿用 Q4 清理前的入场件名 `FadeInUp`/`ScaleIn`，现这些件已删，各片改内联 `HandIn` 同理，见 §3.1）：
- 帧 0-2: 背景渐入
- 帧 2-26: 标题 FadeInUp（motion=style.motion）
- 帧 8-44: 卡面 ScaleIn（motion=style.motion，startScale=0.85）
- 帧 20-50: 商户名/卡名/次数大字依次 FadeInUp（delay=20/26/32）
- 帧 40-80: 附加字段 2 列依次 ScaleIn（delay=40/48/56）
- 帧 70-94: 底部徽章+有效期 FadeIn（delay=70）

**验收标准**：still 截图——深色卡面白字清晰、**次数大字是画面焦点（≥100px）**、光晕+渐变蒙层磁卡质感到位、字段值 ≥32px 可读、与 solution 白卡列表肉眼可辨（深色卡面 vs 白卡列表）；`npx tsc --noEmit` 零错误；红线闸门零命中。

### 5.5 产品 UI 参考指引（2026-08-25 定）

> 目的：AI 设计画面涉及"产品界面展示"（卡面/券面/操作/统计）时，参考真实产品源码的样式重绘，让视频信息与真实产品一致、商家可对照截图。

**原则**：
- 设计稿涉及产品界面展示时，先查 applet 源码对应组件，参考真实样式重绘（结构/配色/层级/质感）
- **灵活取用**：用不用、用多少由设计需要决定；不强制映射、不为每个界面建组件
- **界面一律不提成共享组件**（2026-08-29 修订：原"多行业反复要用才提成组件"条款废止，CardFaceScene 等已删）——产品实物的**结构参照**沉淀在四张锚 + 17 屏型样张，每片按真值重画外观

**高频界面速查表**：

| 界面 | applet 源码路径 | 视频用途 |
|---|---|---|
| 次卡磁条卡面 | `components/m/m-card-magnetic-face/m-card-magnetic-face.vue` | 卡面屏（cardface） |
| 优惠券券面（6 型） | `components/m/m-coupon-tpl/`、`m-coupon-combo/` | 券面展示屏 |
| 领取页（公开/私密/转赠） | `pages_user/coupon/public_receive.vue`、`private_receive.vue`、`pages_user/card/private_receive.vue` | 流程链路屏（顾客视角） |
| 核销页 | `pages_card/verify/verify.vue` | 操作步骤屏 |
| 统计页（指标+排行） | `pages_card/stat/home.vue`、`*_rank.vue` | 数据屏（`spec/facts.json`：无趋势图，指标卡+排行） |
| 9 色主题 | `utils/theme.js`（尊享红 #8B1A32 等） | 卡面/券面配色 |

**统计维度核对规则（2026-08-25 加，防编造指标）**：设计数据屏前**先核对 `spec/facts.json` deep 层真实统计维度**，禁止凭印象编造统计项（G04 教训：S7 编造"转赠数"指标，实际只有"顾客转赠排行"）。真实维度：指标卡=我的业绩（有效发放张数/有效发放且核销次数/在店核销次数；核销率仅优惠券模块作附属指标，2026-08-27 代码核实）/本店数据/券详情即时数据（已领取/已核销/核销率/剩余库存）；排行榜=渠道/门店/员工/顾客转赠/顾客核销排行；数据用途=领取明细、核销明细导出 Excel、筛选（时间/渠道/门店/员工/券码）。

**换算与边界**：
- rpx（750 设计稿）→ px（1080 画幅）按 1:1.44 等比放大（字号/间距/圆角）
- 只参考样式重绘，**不截真实界面图**（`spec/redlines.json` rules.video_visual）
- 界面字段必须 `spec/facts.json` 可查（不虚构 UI）；统计屏不填真实商户数据
- 不出现企微/微信系界面（`spec/redlines.json` rules.platform_diversion）、商户认证/审核类界面（`spec/facts.json`：不提审核）

### 5.6 呈现手法库（2026-08-25 定；2026-08-28 改为「只登记已落地手法」）

> 目的：信息呈现原语多样化。**卡片是容器，手法是信息组织方式**——G03/G04 连续两期"卡片流"（白卡+图标+文字贯穿全片）导致审美疲劳，根因是组件库只有"卡片容器"一种实现原语。设计稿按屏型选择手法、行业之间轮换。
> **本表只作「视觉语法目录」**：登记我们见过的信息组织方式，供设计稿沟通时叫得出名字。**落到代码 = 每片专属组件手写**（2026-08-29 起共享场景组件与 `layout`/`cardVariant` 变体键已全部删除，本表任何一行都没有"现成组件可写进数据文件"）。原表曾把「撕纸笔记 / 大边框分区 / 药丸徽章」三项未落地的写法计入清单，导致 9 屏视频按规则选不到足够的合规手法——教训见 2026-08-28 工作流验证。

**使用规则**：
1. 设计稿每屏可标注「呈现手法」作**沟通参照**（取本表「手法」列原名，用于说明视觉语法；数据写法以 SKILL「布局来源」+ payload 为准，2026-08-30 起不再是强制分类）。**不写数量配额**（2026-08-30 用户拍板：原"相邻屏手法不同／内容屏至少 2 屏手法与上一条不同"已废止——配额会绑架设计，为过闸每屏会被写成同一形状）。判雷同改用 SKILL 第 3 步的自检问句 + 你逐张看真图；`check-similarity` 只能拦"照抄上一片的 ui 名"，结构雷同它拦不住（见 `remotion-components` 包 §⑧A）
2. **判定看视觉语法，不看标签**：每屏都标了手法名 ≠ 达标。若一条视频多数内容屏仍是"白卡 + 图标 + 标题 + 说明"的同一语法，即便标签各不相同，仍按「卡片流」判不合格、回炉
3. 手法落到代码：2026-08-29 起**每片专属组件手写实现**（旧"同 type 用 layout/cardVariant 切共享组件变体"机制随共享场景一并删除）；跑 `node scripts/list-assets.mjs` 核对现有原子件

**手法规格表**（计数真源 = 本表 `| **` 行。⚠️ 2026-08-29：「落地方式」列是旧共享场景的数据写法，实现已删，仅留作**视觉语法说明**——现行写法：手法照 bench 样张/锚稿用手写进本片专属组件，业务数据进 payload，见 §5.2）：

| 手法 | 视觉特征 | 参考图 | 落地方式（数据文件怎么写） | 首用 |
|---|---|---|---|---|
| **编号列表** | 编号（主题色大字）+ 标题红色下划线 + 后果小字，白纸容器承载 | ref-01 重启人生计划 | `type:'pain'` + `layout:'numbered-list'`，配 `leftItems[]` / `leftItemsSub[]`（后果副行）/ 底部红结论条为语法项（旧共享组件"必须显式传 rightSub"规则已随组件废止） | G04 S2 |
| **手写高亮** | 大字 + 半透明高亮条（微倾斜）+ 波浪下划线 | ref-02 暑期实习 | 每片手写（原 `HighLightText` 共享件已删）；现成参照 = `outputs/bench/bench-r02.png` 与锚稿 pain 的涂药块语法 | G04 S1 |
| **多层分区** | 虚线圆角分区 + 丝带横幅标题 + icon/数字锚点区块 | ref-03 CKT 价格表 | `type:'grid'` + `layout:'multi-section'` + `cards[]` | G04 S5 |
| **括号分组** | 左竖排分类标签 + 大括号聚合 + 右明细 + 重点行金底 | ref-05 保险投保思路 | `type:'bracket-group'` + `bracketGroups[]`（`detail` 用 `\|` 分行；`highlight:true` 出金底） | G04 S4 |
| **药丸徽章** | 彩色胶囊承载场景锚点/徽章信息，不占主体 | ref-08 券型都支持 | `type:'hook'` + `hookStyle:'story'`（场景胶囊）或 `'challenge'`（徽章胶囊）+ `hookTag` | G05 S1 |
| **卡面焦点型** | 深色磁条卡面为主体：卡名 → 焦点大字 → 字段行 → 类型徽章 + 有效期 | ref-04（仅借卡片多层分区，不取撕纸） | `type:'cardface'` + `cardName`/`cardType`/`merchantName`/`validLabel`/`cardTheme`（**必须传 hex**）/`cardFields[]` + 卡下 `useTips[]`；焦点块用 `faceFocus:{value,unit,note}`（券包/优惠券）或 `times`+`total`（次卡） | G04 S3 |
| **时间轴曲线型** | 横轴时段曲线 + 关键点亮点 + 券落点抬升 | —（自有组件） | `type:'timeline'` + `timelinePoints[]`/`timelineCoupons[]`/`timelineMode`/`timelineHighlight` | G03 S2 |
| **递进链路型** | A→B 箭头链路 + ①② 编号要点逐条 | —（自有组件） | `type:'transfer'` + `transferFrom`/`transferTo`/`points[]` | G04 S6 |
| **对比双卡型** | 同尺寸两张全宽卡，左边色条分优劣（灰=老做法 / 主题色=本方案） | ref-17 双卡对称语法型 | `type:'solution'` + `items[]`×2，`color` 传对比色（缺省 `border-left` 变体）。**组件无逐卡透明度槽位**，弱化只能靠色彩与图标色 | G05 S3 |
| **节点连线型** | 横向序号圆 + 图标 + 标题 + 小字，节点间连接线逐段 draw-on | ref-11 纵向编号步骤条型（横排实现） | `type:'flow'` + `layout:'horizontal'` + `nodes[]`（`sub` = 节点小字）+ `footnote`；不传 `layout` 即纵向大步骤卡 | G05 S4 |
| **分组清单型** | 图标 + 文字条（无卡片边框）+ 行左上角分组角标 | ref-10 多栏分类清单型 | `type:'usetips'` + `useTips[]`，行内传 `group:'组名'` 即出角标（≤2 组） | G05 S5 |
| **图标锚点逐条型** | 全宽白卡 + 左边色条 + 超大图标底板为锚点 + 机制说明逐条 | ref-03 | `type:'panel'` 默认变体 + `metrics[]`（**不填 `value` 即不出现数字**；`dir:'↓'` 不渲染上升箭头） | G05 S8 |
| **排行条型** | 排名块 1/2/3 + 指标名 + 说明 + 右侧弱图标 | —（自有组件，参照产品统计页排行榜） | `type:'panel'` + `layout:'ranking'` + `metrics[]` | G04 S7 |
| **品牌收尾型** | 品牌名超大居中 + 一句主张 + 上下装饰线 draw-on + 光晕 | ref-06（仅借居中层级，不取边框） | `type:'cta'` + `title`=品牌名 / `sub`=主张 | G02v3 S8 |

**未落地、标进设计稿 = 渲染不出**（要做先建组件，再往本表加行）：撕纸笔记（需容器组件 `PaperSheet`，ref-04 语法）、大边框分区（需 `FrameSection`，ref-06 语法）、独立药丸徽章组件 `PillBadge`（ref-08 药丸语法已在 `video/src/bench/BenchRefsA.tsx` R08 样张实现，可拆用）。

> **组件状态真源**：`node scripts/list-assets.mjs`（项目根运行，从代码实时生成）；本表「落地方式」为 2026-08-28 按组件源码逐条核对后的快照，与脚本输出或源码不一致时以代码为准。⚠️ 2026-08-29 共享场景组件已整体删除（ui 回退旁路一并拆除），本表「落地方式」列的 `type:'xxx'+props` 写法**不再可直接使用**——布局模式种类仍作目录，现行实现参照 = 四张锚 + `outputs/bench/bench-rNN.png` 17 屏型样张（代码 `video/src/bench/`）。

---

## 六、与生产流程的关系

- **操作流程**（视觉语言（由所选风格包定义）/分镜稿/视觉转换/三层运动/渲染验收/发布）→ `SKILL.md`（八步法）
- **制作硬规则**（动画/转场/布局/代码结构操作版）→ 本文件 §七（2026-08-27 由 M2 §三 迁入）
- **本文件**提供：为什么这么做的原理（「一、声画同步原理」/「二、动画原理」）、组件怎么用的 API（「三、组件 API 规格」）、怎么扩展（「四、组件生长机制」/「五、扩展指南」）
- 遇到渲染异常、组件用法疑问、需要新建组件时查本文件；正常生产流程只读 `SKILL.md`

---

## 七、制作硬规则（操作版）

> 2026-08-27 由 M2-视频制作手册 §三 迁入。原理见本文件「一、声画同步原理」/「二、动画原理」。

### 7.1 动画规则

| 规则 | 说明 | 反例（禁止） |
|---|---|---|
| 禁止 CSS animation/transition | Remotion 逐帧渲染，CSS 时间轴与帧不同步 | `style={{animation: 'fadeIn 0.5s'}}` |
| 全部用 useCurrentFrame + interpolate/spring | 唯一合法动画驱动方式 | — |
| 非 spring 插值必须指定 easing | 统一用 `EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1)`（expo-out） | `interpolate(f, [0,30], [0,1])` 缺 easing |
| spring 必须透传 motion | motion 参数从 `style.motion` 读取，禁止硬编码覆盖 | `<HandIn motion='bouncy'>` 写死（各片内联入场包装） |
| 禁止嵌套动画时序冲突 | 父动画期间子元素 delay 超父时长 = 空跑 | `<HandIn delay={14}><内联动画 delay={40}>` |
| 颜色过渡用 interpolateColors | 禁止 boolean 瞬切 | `color={lit ? '#fff' : '#333'}` |

### 7.2 转场规则

- **必须用 TransitionSeries**，场景间禁止 `<Sequence>` 硬切（用 `@remotion/transitions` 的 TransitionSeries + Transition）
- 转场时长 12 帧（0.4s）；特殊风格 8-16 帧，设计稿显式标注
- timing 用 springTiming，config 对齐 `style.motion`
- presentation 由 `style.transition` 决定（VTemplate 的 getPresentation 映射），禁止硬编码单一转场型

### 7.3 布局规则

| 规则 | 值 |
|---|---|
| 画幅 | 1080×1920 @30fps，9:16 竖版（**本值＝交付规格真源**；各风格包 ③ 与通段验收声明同一规格属 CHANGE-20260923-039 明文授权的复述，不另立属主） |
| 字号/间距 | 绝对像素（固定画幅下不用 vmin） |
| 中文字体 | 本地 @font-face 加载 `public/fonts/`，禁止依赖系统字体 |
| 文字安全区 | 标题左右 padding ≥120px（G03 实测：抖音发布后左右会被遮挡，60px 不足，2026-08-25 调；2026-09-11 再调：抖音 20:9 长屏全屏播放按屏比放大 1.18×、左右各实测裁约 82px，iPhone 量级约 100px，80px 余量不足→120px）、顶部 ≥120px、底部 ≥160px |
| 字幕安全区 | 底部距底 60px，白字黑描边 31px（2026-09-11 随 120px 口径同步调小：26 字最长单行卡须在 840px 行宽内单行放下，旧字号破词孤行、旧法已废止），左右 padding 120px，位于 y:1760-1920，不侵入内容区 |
| 活动区硬底线 | y:120-1760，出界 = 不合格 |
| **安全区达标方式（2026-09-18 · CHANGE-20260918-024）** | 安全区**不得靠"整场景缩放"实现**——`sceneScale` 会连带缩放字幕等独立安全区元素（实例：g11 曾用 0.76 把字幕从 y1760-1920 拉到 y≈1580）。**正确做法：主体容器（板/卡）自身落进 x120..960**，共享层 `sceneScale` 保持 1。片内具体尺寸属该片工程参数（写 `videos/gXX/`＋变更事务），**不进本表** |
| **核心内容集中** | 核心内容（标题+卡片/图标/流程）集中在 **y:200-1100**；标题距顶 ≥200px；标题与内容间距 40-60px；多卡片间距 ≥ 卡片高度 20%；卡片内 padding ≥43px。只约束垂直分布，不限制风格 |
| **绝对定位 vs 动画包装（2026-08-28 硬规则）** | 带 `transform` 的入场包装组件（各片内联 `HandIn` 同理）会**成为后代的包含块**。写 `<HandIn><div style="position:absolute; left:80; right:80; bottom:280">` 时，`left+right` 相对一个零尺寸盒解析 → 元素塌缩不可见。**正确写法：外层普通 div 负责 `position:absolute` + 锚点，内层再套动画组件**。教训：`PainScene`（旧共享场景，2026-08-29 已删除）编号列表变体的红色结论条自 G04 起从未渲出来（G04 交付帧已取证），设计稿只写"必须显式传 rightSub"根本抓不到这个缺陷 |
| 浅底字幕可读性（已知短板，待决） | `Subtitle` 无条件白字黑描边 → 浅底背景上全靠描边撑可读，观感偏弱。原 `Scene.darkText` 标注字段因零消费已于 2026-09-08 删除；浅底适配改由背景素材选择 + 前景兼容验证帧人工判。若要给浅底切深字须走组件提案（影响全片所有已渲视频的字幕层） |

### 7.4 代码结构规则

- 场景内容全部从 scene 数据读取（禁止硬编码文案/颜色/图标名；语义色取色走 palette 主题或 `R6` §8 真值，不私设常量——原 `ACCENT_*` 常量 2026-08-30 已删）
- 风格值全部从 style/palette 读取（禁止硬编码色值）
- 图标用内联 SVG 映射 `Ico[name](color)`（禁止外部图标文件/CDN）
- 图片用 `<Img src={staticFile(...)} />`（禁止 `<img>`）
- 字幕用 `<Subtitle>` 组件，接收 `lines: {text, startFrame, endFrame}[]`（数据在 data/gXX.ts 的 subtitles 字段）

### 7.5 三层视觉结构（remotion-components 风格的实现配方）

> 概念与约束层在 `remotion-components` 包 §③B（Layer1 Atmosphere / Layer2 Typography / Layer3 Product + 资产白名单/禁令/色彩基准）；本节只给"怎么搭"的可复用技术配方，适合零实拍素材的产出。

| 层 | 技术实现配方（可复用原子） | 画面目的 |
|---|---|---|
| **Atmosphere 氛围** | `KenBurnsBg`（1→1.04 缓推，只动背景图、不压文字）+ 粒子场（火星：上升漂移 + 横摆 + 明暗呼吸；帧驱动确定性、随机种子固定）+ `Glow`/`Vignette`/`Grain`（明暗呼吸/暗角/胶粒，慢速不抢字） | 帧间差永不归零、背景"活的"、只做情绪 |
| **Typography 排版** | `BigNumber`（超大数字 scale-punch 推近）/ `FocusText`（blur→focus + slight scale，**不是 translateY 飞入**）/ 细线 + 小标签（强弱层级）+ 大留白 | 没实拍后最重要的画面力量：密度靠排版不靠卡片 |
| **Product 产品** | `PhoneMockup`（轻微透视 + 边缘高光 + 阴影 + 环境光，**不画纯 2D 矩形**）+ 券/QR 状态变化（核销→券消失、奖励→新券生成、转赠→券横移、回流光线）+ 金色确认圆环代替大绿勾 | 产品是"证据"：有环境光的真实 UI 重量 |

- **镜头三类运动（对应 `remotion-components` 包 §③B 三层视觉结构"语义动效"的技术实现）**：① **摄影机运动**（慢推/后拉/横移/前后景差速 parallax——给 Atmosphere）；② **真实物理**（轻微惯性 + 微小 overshoot ≤6px 回落 + 重量——给 Product 的手机/券/UI）；③ **强节奏**（硬切 / snap / blur→focus / scale punch——给 Typography 的关键句）。
- **一条叠放纪律**：Atmosphere 是"底"、Typography 是"力量"、Product 是"证据"——三层叠放顺序不可颠倒；产品/文字绝不贴在氛围层之上当壁纸。
- 色彩基准见 `remotion-components` 包 §③B（不在此重复列值）。

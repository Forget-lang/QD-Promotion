# R3 · Remotion 技术参考（原理层）

> 最后校验：2026-08-26（08-25 新增 §5.4 CardFaceScene 规格、§5.5 产品 UI 参考+统计核对、§5.6 呈现手法库、atempo 语速；08-26 atempo 口径对齐——G04 定稿 1.2 后续沿用；08-26 组件状态纠错：§5.4 改为规格示例（CardFaceScene 已实现）、§5.6 手法状态对齐代码 + 真源指向资产盘点脚本）（从原 13 号文档拆分，本文件=原理与 API 参考；08-24 修订语速参数口径）
> 这份文档是**参考层**：解释"为什么"和"组件怎么用"。正常做视频**不需要**读它，按 `M2-视频制作手册.md` 操作即可；遇到渲染异常、需要新建积木/组件/图标、或想理解声画同步原理时，再查本文件。
> 操作步骤（怎么做出片）在 `M2-视频制作手册.md`，本文件不重复操作流程。

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
- TTS 语速控制：**seed-tts-2.0 的 speed_ratio 参数实测无效**（G04 2026-08-25 实测 0.5~2.0 时长不变），语速一律用 **ffmpeg atempo** 达成 5.5-6 字/秒（**G04 定稿 1.2，后续视频沿用**；如需其他值在 1.15~1.2 内选定并回写；纯变速不变调）；详见 M2-视频制作手册 §五 阶段二「TTS 语速实测验证」
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

**参数安全带**：`stiffness 80-200`、`damping 20-60`。**damping 过小会导致无限震荡**（如 bouncy 应控制 damping ≥ 12）。本项目 `SPRING_CONFIG` 已有四套预设（bouncy/snappy/buttery/heavy），全部动画组件透传 `style.motion`，一般不需要自调参数。

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
- **禁止嵌套动画时序冲突**：父容器入场动画期间，子元素不要设独立 delay 超过父动画时长（会导致子元素在不可见期间空跑动画）。例：`<SlideInRight delay={14}><ScaleIn delay={40}>` 父动画 14-30 帧期间子元素 opacity=0

### 2.5 颜色过渡

涉及颜色变化的动画**禁止 boolean 切换**（瞬切生硬），必须用 `interpolateColors`：

```tsx
// 错：const lit = f > threshold; color={lit ? '#fff' : '#333'}
// 对：interpolateColors(f, [t, t+15], [rgba(255,255,255,0.08), '#ffffff'])
```

---

## 三、组件 API 规格（video/src/components/）

> 场景渲染器在 `video/src/scenes/`，原子组件库在 `video/src/components/`。组件是**原子积木，非成品模板**——每条视频独立设计、组合方式不同。组件靠纪律生长（见四）。

### 3.1 动画组件（components/animations.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `FadeInUp` | delay, dist, motion | 向上淡入（标题/正文/卡片通用） |
| `SlideInLeft` | delay, motion | 从左滑入（痛点卡） |
| `SlideInRight` | delay, motion | 从右滑入（解法卡） |
| `ScaleIn` | delay, motion, startScale | 缩放弹入（数字/卡片/图标） |
| `WipeIn` | delay, duration, direction | clip-path 擦入（标题 reveal） |
| `Pulse` | delay, intensity, duration | 单次脉冲强调（数字/箭头） |

所有组件透传 motion，spring config 从 `SPRING_CONFIG` 读取；`EASE_OUT` 为标准缓动常量。

### 3.2 UI 组件（components/ui.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `SectionTitle` | — | 段落标题：逐字 mask 入场 + 下划线 wipe 擦入 |
| `Subtitle` | lines[{text,startFrame,endFrame}] | 底部多行字幕（帧级精确同步）：白字黑描边，距底 60px，最多同时显示 2 行 |
| `CharReveal` | text/delay/stagger/duration/style | 逐字 mask 入场，大标题"贵感"来源 |
| `AccentWord` | text/color/delay/peak | 重音词大字：字号+颜色同时弹入，对齐口播重音帧 |
| `IconBadge` | icon/color/size/pad/radius | 图标容器：squircle 底 + 主色 tint + 内高光，图标不裸放 |
| `PhoneMockup` | children/width/height | 手机样机：bezel+灵动岛+玻璃高光，不使用真实小程序截图 |
| `elevation(level, dark)` | — | 三级投影常量（浅底/深底两套），卡片统一取用，全片光影方向一致 |
| `CouponCard` | — | 券面票券标准件：大字金额+虚线分隔+条码感装饰+可选撕边缺口；文案必须查 R1 事实表，禁止虚构券规则 |
| `StatCounter` | value/suffix/delay/duration/color/size | 数字滚动 0→value；只用于真实可述口径，禁止虚构营销数据 |
| `StatCard` | label/value/suffix/caption/icon/accent | 数据卡：图标+标签+滚动数字+说明，grid/panel 数据屏通用 |
| `StepFlow` | steps[{icon,title,note}]/accent/stagger | 步骤条：连接线擦入+步骤逐个弹入，flow 屏通用 |
| `CompareCard` | left/right{title,items}/accent | 左右对比卡：痛点(红) vs 解法(绿) + 中缝 VS 徽章 |

### 3.3 图标库（components/icons.tsx）

内联 SVG 图标，通过 `<Ico name={color} />` 调用。当前覆盖：cup, x, check, gift, clock, users, cash, bolt, search, arrow 等。新增图标保持单色描边风格统一。

**新增图标流程（Icon MCP Server 已接入，.mcp.json 配置）**：
1. 先查 `icons.tsx` 是否够用
2. `search_icons`：英文关键词（逗号分隔）从 Element Plus + Ant Design 图标库模糊检索（无需 API Key）
3. `generate_icon`：检索不到时 AI 生成（需 `DASHSCOPE_API_KEY`），传 description + style
4. 转内联组件：`rawSvg` → `icons.tsx` 中 React 组件，统一 `width="100%" height="100%"`、`stroke={c}`、`fill="none"`，加入 `IconKey` 和 `Ico` 映射表
5. **禁止引用外部 SVG 文件/CDN**：所有图标必须是内联组件（保证渲染无网络依赖）

### 3.4 氛围组件（components/background.tsx）

| 组件 | 参数 | 用途 |
|---|---|---|
| `DotGrid` | color/spacing/size/opacity | 点阵纹理（浅底屏） |
| `GlowOrb` | x/y/size/color/delay | 柔光圆斑（深底屏） |
| `Grain` | opacity=0.035 | 全片颗粒层（VTemplate 挂载）：杀纯色渐变 banding，全片图层质感统一 |
| `Vignette` | strength=0.25 | 全片暗角（VTemplate 挂载）：径向渐变聚焦中部视线 |
| `AccentOverlay` | color/opacity=0.18 | 背景图主色统调（VTemplate 挂载，soft-light 只混下层） |

> ⚠️ 氛围层三件套（Grain/Vignette/AccentOverlay）是**全片必挂**（VTemplate 统一挂载，场景与设计稿无需处理），是画面"质感"的关键来源。缺失时画面偏平偏黑。
> 注意挂载条件：Grain/Vignette 无条件挂全片；AccentOverlay 仅在 `video.style.bgImage` 存在（有背景图）时挂载（代码条件渲染，无背景图时不挂）。

### 3.5 风格五维（video/src/palette.ts + data/gXX.ts style）

| 维度 | 字段 | 可选值 | 说明 |
|---|---|---|---|
| 配色 | `style.palette` | mint-cool / warm-orange / berry-purple / deep-blue / caramel / ink-green / neon（7 套） | `palette.ts` PALETTES，场景全部读 `p.accent` 等 |
| 动画性格 | `style.motion` | bouncy / snappy / buttery / heavy（4 种） | SPRING_CONFIG，全部动画组件透传 |
| 转场 | `style.transition` | slide / wipe / dissolve / zoom / pop（5 种） | 自定义呈现组件在 VTemplate.tsx，五种观感真实可见 |
| 字体性格 | `style.typography` | impact / clean / friendly（3 种） | impact=得意黑900/普惠体500，clean=普惠体800/500，friendly=方圆体400（单一字重靠字号分层） |
| 钩子型 | `style.hookStyle` | contrast / number / question / clock（4/6 已实现） | story/challenge 待按需补 |

---

## 四、组件生长机制（靠纪律生长）

> 原则：**不一次性大建**（避免过早优化），**也不无纪律堆砌**（避免重复造轮子）。装饰组件**少而精**：画面主要靠排版层级和内容动效撑，不靠堆装饰件（防"会动的 PPT"感）。

**三条机制**：

| 机制 | 规则 | 触发时机 |
|---|---|---|
| 提炼纪律 | 写场景时出现"第二个行业也会用到"的结构（券面/数值/步骤/对比类），必须写成 ui.tsx 组件，禁止场景内联 | 写代码时 |
| 回顾收编 | 生产回顾固定加一问：「这次哪些场景级 JSX 值得提成通用组件？」提出后收编并更新本文件「三、组件 API 规格」组件表 | 生产回顾时 |
| 高频预建 | 只有"产品核心物件 / 全行业刚需"允许无需求预建（如 CouponCard），其余等需求出现 | 需求确认时 |

**写代码时对照判断**：

| 情况 | 做法 | 例子 |
|---|---|---|
| 跨行业通用结构 | ✅ 写成 ui.tsx 组件 | 券面卡片、数字滚动、步骤条、左右对比 |
| 只此一家的场景结构 | ✅ 留在场景文件内 | TimelineScene 的曲线抬升逻辑 |
| 海报风装饰件（窗口容器/吊牌/波浪线） | ⚠️ 默认不建代码；设计稿确需时按需实现，**每条视频装饰件 ≤1-2 处** | 浏览器顶栏容器、吊牌标签 |

✅ 正确：GridScene 数据屏用 StatCard，三个行业复用同一组件
❌ 错误①：FlowScene 手写第三遍步骤条 JSX（该提成 StepFlow）
❌ 错误②：每屏都套浏览器顶栏容器当背景（装饰件滥用，像会动的 PPT）

---

## 五、扩展指南（新建积木/动画/图标）

### 5.1 什么时候新建场景积木

| 情况 | 处理方式 |
|---|---|
| 内容结构与现有积木一致，只是文案/图标/颜色不同 | 直接用现有积木 |
| 结构一致但布局想换一种排列 | 用版式变体（`scene.layout` 字段），不新建类型 |
| 现有积木的视觉结构无法表达叙事意图 | 新建积木（设计稿中写 `new:xxx`，人审确认后实现） |

**判断核心**：区分「内容不同」（换文案/图标/颜色→用现有）和「结构不同」（信息组织方式根本不同→新建）。

### 5.2 新建积木完整步骤

1. **设计稿标注**：分镜表 `场景类型` 写 `new:xxx`，附：名称用途 / 视觉结构 / 数据字段定义 / 与现有积木差异说明 / 帧级动画时序
2. **人审确认**：能替代则回退用现有积木
3. **代码实现**（按顺序）：
   - `types.ts` 的 `SceneType` 联合类型新增类型名 + `Scene` interface 加可选字段
   - `scenes/` 新建渲染器（如 `CalendarScene.tsx`），严格遵守动画原理（§二）：帧驱动、透传 motion、EASE_OUT、interpolateColors、文案/颜色从 scene 数据和 palette 读取
   - `scenes/index.tsx` 的 `SceneRenderer` switch 注册新类型
   - 新图标按 §3.3 流程；新动画模式在 `components/animations.tsx` 加组件
4. **验证**：`npx tsc --noEmit` 零错误 → 至少渲染 1 帧 still → 复杂时序渲染多帧 → 跑红线闸门
5. **文档回写**：M2 场景积木表加一行；本文件组件表补充；当日记忆记录

### 5.3 新积木质量标准

- **结构独特**：与已有积木在画面信息组织方式上有肉眼可辨差异，不是换色/换图标/换排列方向
- **可复用**：通用叙事结构，不绑定某行业具体内容（calendar 任何预约制行业都能用，不是"美业日历"）
- **合规**：不画不存在的产品功能界面、不编虚构 UI
- **动画完整**：有入场动画，元素有时序编排，不是静态画面堆元素

### 5.4 积木规格示例（首个实例：CardFaceScene，G04 已实现）

> 按 5.2 步骤 1 的五要素写全，编码 agent 直接按此实现（2026-08-25 定规格；CardFaceScene 已于 G04 S3 落地，本节留作新积木的规格写法示例）。

**① 名称用途**：`cardface` 次卡磁条卡面屏——展示次卡产品的完整卡面（R1 §3.3：次卡=磁条卡面+9 色深色系）。用于方案屏展示"这张卡长什么样、有哪些字段"，是信息密度升级核心（替代 solution 白卡列表，防"换皮同款"）。

**①.5 产品原型参考（2026-08-25 加，必读）**：真实产品卡面在 `../applet/components/m/m-card-magnetic-face/m-card-magnetic-face.vue`（顾客端"我的卡包"次卡磁条卡面组件），CardFaceScene 按此视觉结构重绘（只参考样式，不截真实界面图，R5 §5）：
- 卡面结构：深色主题底 + 磁卡质感背景图 + 右上角光晕（radial-gradient circle at 88% 6% 白 22%）+ 主题色渐变蒙层（165deg：主题色 15% → 透明 42% → 底部黑 12%）
- 信息层级（真实产品）：**次数大字是焦点**（64rpx/700）> 卡名（44rpx/700）> 单位/总数（30rpx/22rpx 半透明白）> 底部徽章+有效期（22rpx 白 72-88%）
- 底部：左类型徽章（白 88% + 1rpx 白 35% 描边圆角）+ 右有效期文案（右对齐）
- 圆角 24rpx / padding 32rpx / 固定高 296rpx（视频版按 1080 画幅等比放大）
- 9 色主题（`../applet/utils/theme.js`）：尊享红 #8B1A32 / 酒窖红 #6A2432 / 鎏金黄 #786018 / 墨玉绿 #0C453D / 午夜蓝 #212F99 / 赤铜棕 #6B3A2A / 曜石黑 #121216 / 御紫 #3E2060 / 深海蓝 #123448——G04 美业可选「御紫 #3E2060」或「鎏金黄 #786018」与粉紫背景呼应

**② 视觉结构**（1080×1920，浅色背景配 darkText: true；卡面按产品原型①.5 重绘，无单独磁条横条——磁感来自光晕+渐变蒙层）：
- 标题区 y:220-400（title + sub）
- 卡面 y:460-1340（660×880 居中，圆角 36，深色主题底，白字）：
  - 磁卡质感（代码模拟，不引外部图）：右上角光晕（radial-gradient circle at 88% 6%，白 22%→透明）+ 主题色渐变蒙层（165deg：主题色 15%→透明 42%→底部黑 12%）
  - 右上角：商户名（merchantName，24px 半透明白，右对齐，行业泛称如"美容院"）
  - 左卡名（cardName）：56px 白 700（等比例放大自产品 44rpx）
  - **次数焦点大字（times）：100px 白 700 + "次" 44px 白 88% + "/ 共 {total} 次" 32px 白 72%**（产品层级：次数是焦点）
  - 字段区（视频信息密度附加，产品卡面主体不显示这些字段——来自 01 卡券制作单）：2 列网格（icon + 字段名 26px 半透明白 + 值 32px 白）：核销间隔 3 天 / 私密发放 / 可转赠（3 项，次数与有效期已在卡面主体）
  - 底部（flex 撑底）：左类型徽章（cardType，30px 白 88% + 2px 白 35% 描边圆角）+ 右有效期（validLabel，28px 白 72% 右对齐）
- 卡面下方副标注：**默认不显示**（2026-08-25 修：原"截图发给顾客，照着做"是规格示例被写死，属设计者注释，观众不明所以，禁止使用）；确需副标注时只写有信息价值的文字（如使用须知要点），且必须来自 01 文案

**③ 数据字段定义**（types.ts 扩展）：
```ts
// SceneType 新增 'cardface'
cardName?: string;                    // 卡名（如"六次养护卡"）
cardType?: string;                    // 类型徽章（如"次卡"）
merchantName?: string;                // 卡面右上商户名（行业泛称，如"美容院"）
times?: number;                       // 次数焦点大字（如 6）
total?: number;                       // 总次数（如 6；"/ 共 {total} 次"）
validLabel?: string;                  // 底部有效期文案（如"有效期 90 天"）
fields?: { icon: IconKey; label: string; value: string }[];  // 附加字段网格（≤4 项，次数/有效期已在卡面主体，不重复）
```

**④ 与现有积木差异**：solution 是"白卡列表"（浅色卡片+图标+说明）；cardface 是"产品卡面"（深色磁条卡+字段网格）——信息组织方式根本不同（产品本体 vs 卖点列表），肉眼可辨，满足 5.3 结构独特标准。

**⑤ 帧级动画时序**（参考）：
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
- 只有"多行业反复要用"的界面才提成 Remotion 组件（CardFaceScene 即此例）；低频界面设计时按需参考重绘

**高频界面速查表**：

| 界面 | applet 源码路径 | 视频用途 |
|---|---|---|
| 次卡磁条卡面 | `components/m/m-card-magnetic-face/m-card-magnetic-face.vue` | 卡面屏（cardface） |
| 优惠券券面（6 型） | `components/m/m-coupon-tpl/`、`m-coupon-combo/` | 券面展示屏 |
| 领取页（公开/私密/转赠） | `pages_user/coupon/public_receive.vue`、`private_receive.vue`、`pages_user/card/private_receive.vue` | 流程链路屏（顾客视角） |
| 核销页 | `pages_card/verify/verify.vue` | 操作步骤屏 |
| 统计页（指标+排行） | `pages_card/stat/home.vue`、`*_rank.vue` | 数据屏（R1：无趋势图，指标卡+排行） |
| 9 色主题 | `utils/theme.js`（尊享红 #8B1A32 等） | 卡面/券面配色 |

**统计维度核对规则（2026-08-25 加，防编造指标）**：设计数据屏前**先核对 R1 §4.3/§4.4 真实统计维度**，禁止凭印象编造统计项（G04 教训：S7 编造"转赠数"指标，实际只有"顾客转赠排行"）。真实维度：指标卡=我的业绩（有效发放/核销率/在店核销）/本店数据/券详情即时数据（已领取/已核销/核销率/剩余库存）；排行榜=渠道/门店/员工/顾客转赠/顾客核销排行；数据用途=领取明细、核销明细导出 Excel、筛选（时间/渠道/门店/员工/券码）。

**换算与边界**：
- rpx（750 设计稿）→ px（1080 画幅）按 1:1.44 等比放大（字号/间距/圆角）
- 只参考样式重绘，**不截真实界面图**（R5 §5 视频主视觉）
- 界面字段必须 R1 可查（不虚构 UI）；统计屏不填真实商户数据
- 不出现企微/微信系界面（R5 §1）、商户认证/审核类界面（R1：不提审核）

### 5.6 呈现手法库（2026-08-25 定，防审美疲劳）

> 目的：信息呈现原语多样化。**卡片是容器，手法是信息组织方式**——G03/G04 连续两期"卡片流"（白卡+图标+文字贯穿全片）导致审美疲劳，根因是组件库只有"卡片容器"一种实现原语。设计稿按屏型选择手法、行业之间轮换。

**使用规则**：
1. 设计稿每屏标注「呈现手法」字段（7 选 1：卡片 / 编号列表 / 手写高亮 / 多层分区 / 撕纸笔记 / 括号分组 / 药丸徽章）
2. 相邻屏手法不同；内容屏（solution/flow/grid/panel）至少 2 屏手法与上一条视频不同（配合 M2 §2.3 视觉观感比对）
3. 手法组件是**变体优先**（同 type 用 scene.layout 切换，M2 §四），结构差异大的才新建场景组件

**手法规格表**：

| 手法 | 视觉特征 | 参考图 | 落地方式 | 状态 |
|---|---|---|---|---|
| **编号列表** | 编号（主题色/红）+ 标题下划线 + 正文多行；网格纸背景感（与 BG-ABS-003 网格呼应） | ref-01 重启人生计划 | PainScene/SolutionScene layout 变体 `numbered-list` | ✅（G04 S2 首用） |
| **手写高亮** | 大字 + 半透明高亮条（微倾斜 2-3°）+ 波浪下划线 | ref-02 暑期实习 | 文字装饰组件 `HighLightText`（highlight: 色条 / wavy: 波浪线参数） | ✅（G04 S1 首用） |
| **多层分区** | 虚线圆角分区 + 丝带横幅标题 + 区块块（icon+数字锚点） | ref-03 CKT 价格表 | GridScene layout 变体 `multi-section` | ✅（G04 S5 首用） |
| **撕纸笔记** | 白纸质感容器（撕边/阴影）+ 丝带标题 + 手绘装饰（回形针/铅笔） | ref-04 超级学霸 | 容器组件 `PaperSheet` | ⏳ 按需 |
| **括号分组** | 左侧竖排分类标签 + 大括号聚合 + 右侧编号要点 + 重点高亮 | ref-05 保险投保思路 | 场景组件 `BracketGroupScene` | ✅（G04 S4 首用） |
| **大边框分区** | 主题色外框包裹 + 标题区深色底白字 + 内容区浅底深字 | ref-06 准初一衔接 | 容器组件 `FrameSection` | ⏳ 按需 |
| **药丸徽章** | 彩色胶囊标签云（统一色系内变化）+ 投影 | ref-08 券型都支持 | 徽章组件 `PillBadge` | ⏳ 按需 |

**G04 已落地 4 个手法**：S1 手写高亮（装饰）/ S2 编号列表 / S4 括号分组 / S5 多层分区；其余 3 个（撕纸笔记/大边框分区/药丸徽章）按需实现。

> **组件状态真源**：`node scripts/list-assets.mjs`（项目根运行，从代码实时生成）；本表状态为 2026-08-26 快照，与脚本输出不一致时以脚本为准。

---

## 六、与 M2 的关系

- **操作步骤**（设计稿模板/动画硬规则操作版/两阶段生产流程/检查清单/命令）→ `M2-视频制作手册.md`
- **本文件**提供：为什么这么做的原理（「一、声画同步原理」/「二、动画原理」）、组件怎么用的 API（「三、组件 API 规格」）、怎么扩展（「四、组件生长机制」/「五、扩展指南」）
- 遇到渲染异常、组件用法疑问、需要新建组件时查本文件；正常生产流程只读 M2

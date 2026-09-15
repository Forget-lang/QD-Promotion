# R7 · Remotion 原生视觉组件库（目录 + 登记）

> 属主：SKILL 第 4.5 步「视觉转换」产出 Shot 表后，按 Asset 字段回本目录取现成组件；无则登记「待建」、先复用、不每片重新发明。已落地组件的 API 规格在 R3 §三 / §五；本文件只做「有什么、叫什么、归哪层、谁在用」的目录层，不重复写规格。

## 一、复用铁律

- 换行业只换：文案 + 色彩 + UI 内容 + 背景纹理 + 少量行业图形；**不重新发明视觉**。
- 新片取组件顺序：本目录查现成 → R3 §三 看 API → 复用；没有的先在「待建」登记 → 按 R3 §五 扩展指南新建 → 落地后把状态改「已落地」并回填文件位置。
- 组件按三层视觉结构归层（SKILL 第 4.5 步 / R3 §7.5），方便 Shot 表按层取用。

## 二、组件目录（按层分组）

### Atmosphere 氛围层（背景 / 粒子 / 光）

| 组件 | 职责 | 状态 | 实现位置 / 指针 |
|---|---|---|---|
| ParticleField | 粒子场（火星等，帧驱动确定性、随机种子固定） | 部分内联 | g11/index.tsx `EmberParticles` 内联；通用版待建 |
| Smoke | 烟雾 | 待建 | — |
| Glow | 光晕 / 光斑 | 已落地 | components/background.tsx（AccentOverlay 系） |
| BackgroundAtmosphere | 背景氛围封装（KenBurns + 粒子 + 暗角一键） | 部分 | components/background.tsx（KenBurnsBg / Grain / Vignette 分散，未封装） |
| LightBeam | 光束 / 回流光线 | 待建 | — |

### Typography 排版层（字 / 数 / 线）

| 组件 | 职责 | 状态 | 实现位置 / 指针 |
|---|---|---|---|
| BigNumber | 超大数字 scale-punch 推近 | 待建 | — |
| BigKeyword | 超大关键词 | 待建 | — |
| FocusText | blur→focus + slight scale（非 translateY 飞入） | 内联（非 blur 版） | g11/index.tsx `In`/`LandIn`；标准 blur→focus 待建 |
| SplitText | 拆字 / 逐字 | 待建 | — |
| Timer | 倒计时（数字递减） | 待建 | — |
| FlowLine | 流程动态路径（非流程图框） | 待建 | — |

### Product 产品层（手机 / 券 / QR / 控件）

| 组件 | 职责 | 状态 | 实现位置 / 指针 |
|---|---|---|---|
| PhoneMockup | 手机框（透视 + 边缘高光 + 阴影 + 环境光） | 内联 | g11/index.tsx 手机 UI 内联；通用版待建 |
| CouponCard | 券卡 | 内联 | g11/index.tsx 券卡内联；通用版待建 |
| CouponReveal | 券揭示 | 待建 | — |
| CouponRedeem | 券核销（核销→券消失） | 待建 | — |
| CouponReceive | 券领取 | 待建 | — |
| CouponTransfer | 券转赠（券横移到另一台手机） | 待建 | — |
| CouponReward | 券奖励（回流光线） | 待建 | — |
| QRCode | 二维码 | 待建 | — |
| Toggle | 开关 | 待建 | — |
| SettingSlider | 设置项滑入组装 | 待建 | — |

## 三、登记与成长规则

- 「待建」的组件，非本片急需就不建（避免为凑库空转）；本片用到时才按 R3 §五 落地，并把状态改「已落地」+ 回填实现路径。
- 已内联在各片的重组件，若下一片又用同款，先抽成通用版（遵 SKILL C-15 复工隔离：抽的是「做法」，不是搬上一片的组件树/写法）。
# R6 · applet 前端 UI 储备（面向 Remotion 出片）

> 最后校验：2026-09-01（变更史只记 changelog，本文不复述）。
> 定位：把 `applet/`（uni-app + TDesign，8 分包）的**视觉真值**一次性沉淀成可照抄的参考层，让设计稿只做「选界面 + 填数值」，不再回读小程序源码、不再凭印象编造界面。
> 本文件是**快照**，数值以 applet 源码为准；正式引用某个界面前，先对该界面文件做一次 grep 复核。
> 不重复：流程与状态常量看 R2 §7 §8、可说数字看 `promotion/spec/facts.json`、视频版式看 `outputs/bench/` 四锚 + 17 屏型样张、Remotion 工程约定看 R3 §5.5。本文件只补**像素层**。

---

## 0. 一分钟结论

### 0.1 十条反直觉事实（与直觉相反，且会直接影响画面对错）

| # | 直觉会画成 | 真实 | 证据 |
|---|---|---|---|
| 1 | 核销区有二维码 + 条形码 | **全 App 无条形码**。核销码是后端返回的图片 URL + 一行 `No.` 空格分组卡号 | 全库 grep `barcode` 只命中 `uni_modules/wmf-code`；`pages_user/coupon/detail.vue:78-115`。⚠ 同文件 `:603` 的 CSS 注释仍写「使用方式-条形码+核销码」，与 markup 不符——注释是误导源，认代码不认注释 |
| 2 | B 端制券页有实时券预览卡 | **制券全程无预览卡**，纯表单。预览卡只出现在 3 个 C 端领取页 | grep `m-coupon-tpl|m-coupon-flash` → 仅 `pages_user/coupon/public_receive`、`private_receive`、`pages_user/bundle/private_receive` |
| 3 | 统计页有图表/曲线 | **零图表**。`qiun-data-charts` 装了但零业务引用。统计屏 = 日期筛选条 + 白卡数字格 + 排行榜（前三名 CDN 奖牌图） | grep canvas 命中仅海报/裁剪/压缩/验证码 |
| 4 | 「请出示核销码」 | 真实文案是「向店员出示此码完成核销」/「向商家出示此码识别客户身份」 | `pages_user/coupon/detail.vue:84`、`pages/index/index.vue` 客户码弹窗 |
| 5 | 失效券用半透明遮罩 | 失效态是**斜盖章贴图**：详情页 `::after` 160×160rpx 贴 `coupon-used/discard/invalid.png`，列表页改用 `<image class="coupon-stamp">`，再叠 `filter: grayscale(1)`，磁卡面用 `opacity:.82`。`@mask-bg「二维码遮罩」` 这个 token 无任何页面读用 | `pages_user/coupon/detail.vue:670-683`、`pages_user/coupon/index.vue:368`、`:266` |
| 6 | 主按钮是品牌绿 | **全站主按钮是红**。`m-submit` 用 `t-button theme="danger"`，`App.vue` 把 danger 底色改成 `#e2453d`。品牌绿 `#07C160` 只出现在 switch、选中环、协议链接、成功图标 | `components/m/m-submit/m-submit.vue`、`App.vue:69-76` |
| 7 | 头部用红色渐变 | B 端首页头部是**纯色 `#e2453d` + CDN 贴图 cover**，不是渐变。全库唯一品牌红渐变在企微绑定页 | `pages/merchant/index.vue:566-578`、`pages_wecom/wecom/bind.vue:474` |
| 8 | 页面底色用 token | 底色硬编码 `#f6f6f6`（`app.css` 的 `page`）。**不是** `--td-bg-color-page`（`#f3f3f3`），**也不是** globalStyle 的 `#e2453d` | `static/css/app.css` `page{}`、`pages.json:1362-1373` |
| 9 | tabBar 选中态变亮色 | `color:#666` → `selectedColor:#333`，**几乎不变**，选中靠换图标 | `pages.json:1335-1354` |
| 10 | 卡面印卡号 | 磁卡卡面**不渲染卡号也不渲染密码**；卡号只出现在核销码区的 `No.` 行。次卡无任何口令机制，口令只在优惠券 | `m-card-magnetic-face`、`pages_user/card/detail.vue` |

补充两条结构性事实：`m-card-magnetic-face` 是复用王（11 屏调用，B/C 两端都有），而**券包链路完全不用卡面**；9 主题色真值单一来源 `utils/theme.js`，券包与次卡共用 `m-theme-select`。

### 0.2 上片黑名单（画了就是错，或就是红线）

- 条形码、扫码框两侧的「条码感」装饰。
- 任何图表、折线、饼图、柱状图（含统计屏）。
- B 端制券/编辑券流程里的券面预览卡。
- 「请出示」「出示二维码」类自造文案。
- 具体统计指标名、具体教程标题（教程 100% 由后端广告位下发，代码里查不到标题）。
- 企微系界面（含 `CorpID`/`ww-open-data` 员工名/「企业微信」字样）、商户认证与审核界面。
- 真实商户名、真实券数据。
- 直接截真机图 —— 一律按本文件数值重绘。

---

## 1. 换算与设计 token

### 1.1 单位与尺寸基准

`manifest.json` 里 `transformPx:false`，全站尺寸单位是 **rpx**，750rpx = 视口宽。Remotion 竖屏按 1080 宽出图时：

```
1rpx = 1080 / 750 = 1.44 px
换算快查：20rpx=28.8px｜24rpx=34.6px｜28rpx=40.3px｜32rpx=46.1px｜36rpx=51.8px
        40rpx=57.6px｜44rpx=63.4px｜48rpx=69.1px｜64rpx=92.2px｜100rpx=144px
        296rpx=426px｜360rpx=518px
```

**但代码里混着 px**：`.coupon-line` 的 `height:2px` 与两侧 `20px` 圆、`.input-arrow`、`--td-radius-*`、`--td-shadow-*`、`--td-font-size-*`、`m-captcha` 阴影、`.detail-header{min-height:400px}` —— 这些**不要一起乘 1.44**。

### 1.2 page 基础

```css
page{
  background-color:#f6f6f6;
  font-size:28rpx;
  font-family:-apple-system-font, Helvetica Neue, Helvetica, sans-serif;
}
```

`applet.md` 里另记有 `PingFang SC, Microsoft YaHei, Arial`（TDesign 层字体族声明），业务页实际以 `app.css` 这条为准。

### 1.3 App.vue 全量覆盖（只有 26 个 `--td-*`）

```css
/* App.vue:53-104 —— 全站唯二被改写的 TDesign 变量入口 */
--td-brand-color:#07C160;              /* 品牌绿 */
--td-brand-color-active:#06ad56;
--td-brand-color-disabled:#92DAB2FF;
--td-brand-color-light:#e8f8ee;
--td-brand-color-focus:#e8f8ee;

--td-button-danger-bg-color:#e2453d;   /* 主按钮实际走这条 = 红 */
--td-button-danger-border-color:#e2453d;
--td-button-danger-active-bg-color:#b22f2a;
--td-button-danger-active-border-color:#b22f2a;
--td-button-danger-disabled-bg-color:#ffb9af;
--td-button-danger-disabled-border-color:#ffb9af;

--td-search-bg-color:#fff;
--td-navbar-background:transparent;    /* C 端自定义导航压图用 */
--td-tab-border-color:#f2f2f2;
--td-switch-checked-color:#00a870;
```

`App.vue:62-67` 的全局按钮高度块**整段被注释掉**，按钮尺寸走 TDesign 默认 + 页面局部 `custom-style`。`App.vue:80-86` 另有一段 tabs 红底黄字覆盖（仅特定页生效）。

### 1.4 未被覆盖、会走 TDesign 默认的项

- `--td-brand-color-1..10` 整族**仍是默认蓝**，`--td-brand-color-7:#0052d9`。`tabs.css:115` 等组件内部读的是序号变量 → 有漏蓝风险。
- 语义色默认：error `#d54941` / success `#2ba471` / warning `#e37318`。**项目自己用的是另一套**（见 1.6），别照抄 TDesign 默认。
- 灰阶 `--td-gray-color-1..14` = `#f3f3f3 … #181818`。
- 圆角、阴影 token 全部**未被业务引用**，画界面时按本文件 2.3 的实测阴影。

### 1.5 九套主题色板（`utils/theme.js`，单一真源）

```js
/* 深色会员卡主题；默认 value=1。getThemeStyle(t) => { background:color, '--theme-color':color } */
1 尊享红  #8B1A32   经典贵宾礼遇，适合高端会所
2 酒窖红  #6A2432   复古质感，适合精品餐饮
3 鎏金黄  #786018   低调奢华，适合 SPA 美业
4 墨玉绿  #0C453D   沉稳内敛，适合茶咖养生
5 午夜蓝  #212F99   商务信赖，适合轻奢服务
6 赤铜棕  #6B3A2A   温暖质感，适合沙龙理疗
7 曜石黑  #121216   黑金格调，适合私享定制
8 御紫    #3E2060   神秘尊贵，适合奢华美业
9 深海蓝  #123448   宁静高级，适合酒店旅拍
```

`--theme-color` **不在 App.vue**，是运行时按选中主题注入到节点 style。海报浅色版靠本地 `lighten(themeColor, 0.25)` 现算，主题表里每项**只有 `color` 一个色值**。另有一套黑字 tab 覆盖 `tabsThemeBlack`（`utils/theme.js:31-37`）：`--td-tab-item-active-color:#000000`、`--td-tab-track-color:#000000`，用在「我的次卡」页。

### 1.6 并存的红色家族（逐处照抄，绝不合并成"品牌红"）

| 色值 | 用在哪 |
|---|---|
| `#e2453d` | 导航底、主按钮、`.container-search` 红带、B 端首页头部、`.coupon-line` 凹槽在红底上的重绘色 |
| `#e2443d` | `m-coupon-tpl` 的张数胶囊与门槛文字 |
| `#e84c59` | C 端首页券金额、券详情金额区、口令码大字、券包详情数字 |
| `#f14752` | `m-coupon-tpl` 金额数字 |
| `#EB0909` | `.text-danger`、空状态删除钮、alert-error 字色 |
| `#f6380b` / `rgba(246,56,11,·)` | 结束倒计时描边与呼吸光晕 |
| `#ff3a0b` | `m-coupon-flash` 快闪条底色 |
| `#00b359` | 统计筛选条激活字色（**不是**品牌绿） |
| `#00c352` | `m-tag-select` 选中态（**不是**品牌绿） |

---

## 2. 配方库

以下均已按色值组合去重，可整段照抄。

### 2.1 linear-gradient（业务代码）

```css
/* 券虚线分割线（唯一一条 repeating，height:2px） */
repeating-linear-gradient(to right, #f3f3f3 0, #f3f3f3 3px, transparent 3px, transparent 8px)

/* 品牌红渐变（全库仅企微绑定页 —— 不要拿去做 B 端首页头部） */
linear-gradient(135deg, #e2453d 0%, #c0392b 100%)

/* 结束倒计时（红·紧迫）/ 开始倒计时（蓝·期待） */
linear-gradient(135deg, #fff 0%, #fff5f0 100%)
linear-gradient(135deg, #fff 0%, #f0f7ff 100%)

/* 浅蓝底卡（适用门店）/ 浅灰底卡（我的商家列表） */
linear-gradient(135deg, #f8fcff 0%, #f0f7ff 100%)
linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)

/* 图片底部压暗承托文字 */
linear-gradient(to top, rgba(0, 0, 0, 0.18), transparent)

/* 主题色横向淡出装饰条（权益列表） */
linear-gradient(90deg, var(--theme-color), transparent)

/* 磁条卡主题色蒙层（165deg，中段 42% 全透明，尾部压黑） */
linear-gradient(165deg, rgba(theme, 0.15) 0%, transparent 42%, rgba(0, 0, 0, 0.12) 100%)

/* 骨架流光 / 验证成功条 */
linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)
linear-gradient(90deg, #a8e6cf, #52c41a)
```

### 2.2 radial-gradient 与 mask

```css
/* 倒计时呼吸光晕（红 / 蓝两版，配 animation: glow-pulse 3s ease-in-out infinite） */
radial-gradient(circle, rgba(246, 56, 11, 0.06) 0%, transparent 70%)
radial-gradient(circle, rgba(24, 144, 255, 0.05) 0%, transparent 70%)

/* 卡面右上角光晕（磁条卡第 3 层） */
radial-gradient(circle at 88% 6%, rgba(255, 255, 255, 0.22) 0%, transparent 54%)

/* 真·挖空做法（仅核销台输入框两侧半圆），与 4.4 的假凹槽是两套实现 */
-webkit-mask-image: radial-gradient(circle at 9px 50%, transparent 9px, red 9.5px);
```

### 2.3 box-shadow（实测去重 22 条 → 归纳为 3 组）

```css
/* A 浮起卡片：Y 偏移 1–8rpx、alpha 0.04–0.2，整体极克制 */
0 2rpx 8rpx rgba(0, 0, 0, 0.04)     /* 次高频：白色小方钮 / 白卡 */
0 4rpx 12rpx rgba(0, 0, 0, 0.1)     /* 最高频：滚动后的商户信息胶囊 */
0 1rpx 4rpx rgba(0, 0, 0, 0.08)     /* .widget-button:active */
0 2rpx 4rpx rgba(0, 0, 0, .06)      /* 统计排行小卡 */
0 2rpx 8rpx rgba(0, 0, 0, 0.12)     /* 海报主题点 */
0 4rpx 20rpx rgba(0, 0, 0, 0.04)    /* 活动海报列表卡 */
0 4rpx 24rpx rgba(0, 0, 0, 0.08)    /* 海报成图容器 */
0 6rpx 24rpx rgba(0, 0, 0, 0.08)    /* 券包整卡（主题色铺底） */
0 8rpx 24rpx rgba(0, 0, 0, 0.08)    /* 券包详情面板 */
0 8rpx 24rpx rgba(0, 0, 0, 0.2)     /* 活动海报浮动分享钮 */
0 -2rpx 16rpx rgba(0, 0, 0, 0.06)   /* 负 Y：底部固定栏向上投影 */

/* B inset 描边：深色卡面不用阴影，用半透明白内描边 */
inset 0 0 0 4rpx rgba(255, 255, 255, 0.95)
inset 0 0 0 2rpx rgba(255, 255, 255, 0.35)
inset 0 0 0 1rpx rgba(95, 224, 160, 0.35)
inset 0 0 0 1rpx rgba(255, 255, 255, 0.18)

/* C 0 偏移 ring：选中态与柔光圈 */
0 0 0 2rpx #07c160                      /* 主题色板选中环 */
0 0 0 4rpx #ffd666                      /* 金黄色高亮环 */
0 0 0 1rpx var(--theme-color, #07c160)
0 0 0 3rpx rgba(232, 76, 89, 0.12)      /* 红色柔光圈 */
```

px 单位版仅两处（验证码弹层 `0 8px 30px rgba(0,0,0,0.15)`、`0 2px 8px rgba(0,0,0,0.2)`），别当 rpx 换算。

### 2.4 贴图画底（非渐变，复刻必抄）

```css
/* B 端首页头部：红打底 + CDN 照片 cover（不是渐变） */
background: #e2453d url("https://cdn.lenmy.com/quandao/2026-07-06/d95l19db4ek0s9ruhnh0.jpg") no-repeat;
background-size: cover;  padding: 0 20rpx 120rpx;

/* B 端券/券包详情红头：repeat-x 红纹理，注意 min-height 用的是 px */
padding-top: 20rpx;  min-height: 400px;
background: url("https://cdn.lenmy.com/quanketuan/2024/09/23/crodj1ide1heuifummd0.png") repeat-x;

/* 磁条卡纹理层（aspectFill） */
https://cdn.lenmy.com/quandao/2026-07-09/d97i2q5b4ek5e3hu8pn0.png

/* 快闪条右下装饰 */
background: #ff3a0b url("...d87cnr4lbp0t6seglksg.png") no-repeat right bottom;  background-size: 50%;
```

---

## 3. 全站结构件

`static/css/app.css`（1008 行）是骨架唯一来源。拼任何界面先用这些。

### 3.1 容器与栅格

```css
.container{padding-left:24rpx;padding-right:24rpx}
.container-safety{padding-bottom:calc(220rpx + env(safe-area-inset-bottom))}  /* 有 m-submit 必加 */
.container-door{background:#fff;padding:24rpx;border-radius:24rpx 24rpx 0 0;margin-top:-48rpx;z-index:2}
.container-search{background:#e2453d;padding:10rpx 24rpx 24rpx}               /* 核销/明细顶部红带 */
.row{display:grid;gap:20rpx}  .col-2 .col-3 .col-4                            /* 全站数字格栅格 */
.paragraph{margin-top:40rpx;margin-left:24rpx;margin-bottom:20rpx;color:#9a9a9a}
.mt-1/.mt-2/.mt-3/.mt-4/.mt-5 = 10/20/30/40/50rpx（仅这 5 档，.mt-2 带 !important；无 8/16/24）
.flex-shrink{flex-shrink:0}   /* 名字与语义相反 */
```

### 3.2 白卡 section 家族

```css
.section{border-radius:20rpx;background-color:#fff;overflow:hidden}   /* 全站唯一白卡 */
.section-header{display:flex;justify-content:space-between;align-items:center;padding:32rpx 32rpx 20rpx}
.section-title{font-size:32rpx;font-weight:600;color:#000}
.section-more{min-width:80rpx;font-size:24rpx;color:#999}
.section-body{padding:32rpx}
.section-footer{border-top:1px solid #f5f5f5;padding:20rpx 32rpx;display:flex;justify-content:space-between}
.section-alert{border:#eae4dc 1px solid;background-color:#fdf7e7;color:#726c5c}  /* 「作废须知」底色 */
```

### 3.3 弹层 popup 家族

```css
.popup-container{border-radius:24rpx;background-color:#f5f5f5}
.popup-header{height:100rpx}  .popup-header-title{font-size:38rpx;font-weight:600;color:#000}
.popup-body{height:800rpx}
.popup-bottom-cancel{border-top:#f5f5f5 20rpx solid;line-height:90rpx;font-size:32rpx}
.popup-bottom-action{height:110rpx}
/* ⚠ .popup-footer 不在 app.css，是各页 scoped 复制品（12+ 份） */
.popup-footer{display:flex;padding:24rpx 32rpx;padding-bottom:calc(24rpx + env(safe-area-inset-bottom))}
```

### 3.4 按钮与标签

```css
/* 金色弱操作小钮：全站最高频「查看 / 复制 / 调整库存 / 使用」 */
.button-gold{background:#ffeeb2;color:#8d5f37;font-size:24rpx;font-weight:600;padding:10rpx 20rpx;border-radius:20rpx;min-width:80rpx}
/* 领取主胶囊（C 端底部） */
.button-receive{background:#b98f57;color:#fff;font-size:32rpx;font-weight:600;border-radius:999px;padding:0 26rpx;height:100rpx}
.button-receive.disable{background:#888}
/* 底部固定主按钮 = 红 */
.submit{background:#FFF;position:fixed;bottom:0;width:100%;z-index:99;padding-bottom:env(safe-area-inset-bottom)}
.submit-btn{padding:30rpx 30rpx}   /* 内层 t-button theme="danger" size="large" block height="100rpx" */
```

### 3.5 文字与提示

```css
.h2{font-size:32rpx;font-weight:600}  .h3{font-size:28rpx;font-weight:600}
语义字色：#333 正文 / #999 次要 / #ccc 占位 / #888 标签 / #00b359 绿 / #ff7900 橙 / #EB0909 危险 / #007AFF 蓝链 / #576b95 .text-wechat
.cell-helper{background:#fff;font-size:24rpx;color:#999;padding:20rpx 32rpx}   /* 表单下的解释行 */
.note{font-size:24rpx;color:#999;line-height:50rpx}
.tips-card{padding:24rpx;background:#fff7e6;border-radius:12rpx;border:1px solid #ffd591}  /* 内文字 #d46b08 / 标题 #874d00 */
.text-placeholder{color:var(--m-text-color-placeholder,#ccc)}  /* 该变量全库未定义，恒为 #ccc */
.top-line{border-top:1rpx solid #f7f7f7}   /* app.css 里声明两次，生效的是 1rpx 那条 */
.divider-line{border-bottom:2rpx solid #cccccc90}
```

### 3.6 表单行与告警四态

```css
.input{background-color:#fff;padding:30rpx;border-radius:20rpx}
.input-arrow{width:10px;height:10px;border-style:solid;border-width:2px 2px 0 0;border-color:#c0c0c0;
  transform:matrix(0.5,0.5,-0.5,0.5,0,0)}                       /* px 单位 + 45° 矩阵，细尖角 */
.input-custom-label-required::after{content:'*';color:#e2453d;font-size:32rpx;margin-left:4rpx}

/* 四态共用 padding:20rpx 40rpx; border-radius:20rpx; font-size:24rpx; border:色 2px solid */
.alert-success  #37a058 / #daf0e4
.alert-warning  #ff7900 / #fff3e6
.alert-info     #007AFF / #e6f2ff
.alert-error    #EB0909 / #fde8e8
```

### 3.7 券分割线（缺角 illusion 的主角）

```css
.coupon-line{position:relative;margin:20rpx 0;height:2px;
  background-image:repeating-linear-gradient(to right,#f3f3f3 0,#f3f3f3 3px,transparent 3px,transparent 8px)}
.coupon-line::before,.coupon-line::after{content:'';position:absolute;width:20px;height:20px;
  background-color:#f6f6f6;border-radius:50%;top:-20rpx;z-index:2}
.coupon-line::before{left:-10px}  .coupon-line::after{right:-10px}
```

凹槽圆的填充色**必须等于该券卡的父级背景色**，否则穿帮。实测 11 个文件 / 15 处 class 引用；红头页里被重绘成 `#e2453d` + 同一张红纹理（见 5.6）。

### 3.8 页脚 `m-footer`（几乎每个 C 端屏的收尾）

```css
.footer{padding:80rpx 0}
.footer-meta{display:flex;align-items:center;justify-content:center;font-size:28rpx;color:#ababab}
.footer-meta .split{margin:0 20rpx}        /* 分隔符是竖线字符 */
.footer-slogan{margin-top:40rpx;text-align:center;color:#ccc}
.footer-brand{font-size:32rpx;font-weight:600;letter-spacing:2px;margin:0 30rpx}
.footer-desc{font-size:24rpx;margin-top:10rpx}
```

三行内容原样：「意见反馈 | 免责声明 | 我要投诉」→「—— 券到卡包 ——」→「实体店优惠券/券包/次卡免费制作工具」→ 版本号。深色底页面传 `isWhite` 后两处文字色一并转 `#fff`。

---

## 4. 视觉签名：券与卡

### 4.1 磁条卡卡面（视频首选资产）

结构（自下而上 5 层，整卡不用位图除纹理层）：

```
.times-card（纯色 themeColor 打底，高 296rpx / radius 24rpx / padding 32rpx / overflow hidden）
 ├─ image.times-card-deco-bg   CDN 磁条纹理，mode=aspectFill
 ├─ .times-card-deco-glow      radial（2.2 第 3 条）
 ├─ .times-card-deco-fade      linear 165deg（2.1 倒数第 2 条）
 ├─ .times-card-merchant       右上 32rpx：logo 48rpx 圆 + 名称 24rpx rgba(255,255,255,.72)，max-width 200rpx
 ├─ .times-card-focus          padding-right:210rpx
 │   ├─ .times-card-name       44rpx / 700 / #fff / line-height 1.35
 │   └─ .times-card-times      num 64rpx 700 #fff ＋ 单位「次」30rpx .88 ＋「/ 共 N 次」22rpx .72
 └─ .times-card-foot           徽章「通卡/次卡/权益卡」22rpx + border 1rpx rgba(255,255,255,.35) + radius 8rpx ｜ 右侧 validLabel 22rpx .72
```

状态章（可选，仅传入 `statusLabel` 时）：`right:48rpx;top:50%;transform:translateY(-50%) rotate(-18deg)`，文字 28rpx 600 `rgba(255,255,255,.88)`，`border:3rpx solid rgba(255,255,255,.55)`，radius 8rpx，`letter-spacing:4rpx`。
失效：`status>1` → `.is-inactive{opacity:.82}`。通卡改显 `usedTimes` +「/ 已使用」。

### 4.2 券面 A：列表项（两个组件，别混）

**`m-coupon-tpl`（C 端领取页预览）** —— 内容在左、金额在右：

```css
.coupon{background:#fff;border-radius:20rpx;padding:32rpx;display:flex;justify-content:space-between}
.coupon-name{font-size:32rpx;font-weight:600;color:#272727}
.coupon-count{width:58rpx;font-size:20rpx;background:#e2443d;color:#fff;border-radius:10rpx}   /*「N张」*/
.coupon-valid{color:#78797f}
.coupon-fee{max-width:230rpx;text-align:right}
.coupon-amount{color:#f14752;display:flex;align-items:flex-start;justify-content:flex-end}
.coupon-amount-unit{font-size:28rpx;font-weight:600}
.coupon-amount-money{font-size:64rpx;font-weight:600}
.coupon-threshold{font-size:24rpx;color:#e2443d}
```

**首页/「我的优惠券」券票 `.receive`** —— 商户头 + 凹槽线 + 券体，金额同样在右：

```css
.receive{border-radius:24rpx;background:#fff;overflow:hidden}
.merchant{padding:32rpx 32rpx 10rpx}  .merchant-logo{width:50rpx;height:50rpx;border-radius:50%;margin-right:10rpx}
.merchant-header-title{font-size:28rpx;font-weight:600;color:#373737}
.coupon{padding:10rpx 32rpx 32rpx}
.coupon-thumb{width:120rpx;height:120rpx;border-radius:12rpx}
.coupon-content-name{font-size:32rpx;font-weight:600}
.coupon-type{font-size:20rpx;color:#999}
.coupon-content-amount{color:#e84c59}
.coupon-amount-money{font-size:48rpx;font-weight:700;flex-shrink:0}
.coupon-amount-discount{font-size:28rpx;font-weight:600;margin-left:5rpx}
.coupon-threshold{font-size:28rpx;color:#b6b6b6;margin-left:10rpx}
.coupon-content-valid{font-size:28rpx;color:#b6b6b6;margin-top:6rpx}
.exchange-icon{width:68rpx;height:68rpx}   /* 兑换券用图，不用数字 */
```

**六券型的金额区写法**（三处组件一致）：代金/套餐 `¥+faceAmount`｜满减 `¥+reduceAmount`｜折扣 `N` + `折`（数字位、单位 600）｜兑换 图标 68rpx｜手气 `¥` + `min~max`。

### 4.3 券面 B：B 端券详情三段式

```css
.coupon{margin-bottom:30rpx;background:#fff;border-radius:20rpx;overflow:hidden}
.coupon-main{display:flex;align-items:center;padding:32rpx 32rpx 10rpx}
.coupon-header{order:1;max-width:230rpx;flex-shrink:0;text-align:right}   /* order 把金额推到右 */
.coupon-face{color:#e84c59;display:flex;align-items:start;justify-content:flex-end}
.coupon-face-money{font-weight:bold;font-size:60rpx}
.coupon-face-unit{font-size:28rpx;font-weight:600;margin-right:2rpx;margin-top:6rpx}
.coupon-body{flex:1;margin-left:20rpx}
```

主体：名称 32rpx 600 + 类型 `t-tag danger` + validLabel；脚部标签 `issueTypeLabel`（danger light-outline）、状态（发放中→success，其余 warning）、需预约 / 可分享 / 可转赠。往下 `row col-3` 三格（已领取 / 已核销 / 核销率）→ `t-divider` → 剩余库存 `42rpx` + `button-gold「调整库存」` + `t-progress color:#00c553`。

### 4.4 缺角的两种实现

1. **假凹槽（实测 11 个文件在用）**：`.coupon-line::before/after` 两个 20px 圆，填父级背景色。视觉足够，改背景色就要改填充色。
2. **真挖空（仅核销台）**：`-webkit-mask-image: radial-gradient(circle at 9px 50%, transparent 9px, red 9.5px)` + `mask-position:-9px`。Remotion 里若用 SVG/CSS mask，第 2 种更稳；只是画静态图，第 1 种更省事。

### 4.5 快闪券头与领取胶囊

```css
.m-coupon-flash{border-radius:32rpx 32rpx 0 0;margin-top:-30rpx;color:#fff;background:#ff3a0b url(...) no-repeat right bottom}
/* 价格行：unit 48rpx + money 64rpx 600；代金券「抵用￥originalPrice」；套餐券原价带删除线 */
.coupon-flash-type{background:#fff;color:#ff3a0b}                       /* 白胶囊 + gift-filled 图标 + 类型名 */
.coupon-flash-tag{background:rgba(255,255,255,.3)}                      /* 需预约/可转赠/核销有奖/转赠有奖 */
/* 底部固定栏 */
.bottom-fixed-bar{background:#f2f2f2}  /* 左：260×100rpx 白胶囊 radius999px（logo64 + 名称 +「分享好友」#bd9663）；右：.button-receive */
```

### 4.6 状态章与失效表现

```css
/* 详情页：伪元素贴图（每个状态各一条独立规则，此处合并示意） */
.coupon.used::after{content:" ";display:block;position:absolute;width:160rpx;height:160rpx;
  top:0;right:60rpx;z-index:22;background:url("/static/img/coupon-used.png") no-repeat center center;background-size:contain}
/* discard / invalid 同构，只换图 */
.coupon.discard::after{...coupon-discard.png}   .coupon.invalid::after{...coupon-invalid.png}

/* 列表页（我的优惠券）：改用真实 image 元素 */
.coupon-stamp{position:absolute;right:30rpx;top:0;bottom:0;margin:auto 0;
  width:160rpx;height:160rpx;z-index:10;pointer-events:none}
/* 失效 tab 另加 */ .coupon-disabled{filter:grayscale(1)}
/* 绑定 */ :class="{used:status===2, discard:status===3, invalid:status===4}"
/* 未开始 / 已结束 另有 coupon-unstarted.png / coupon-ended.png，源图 250×250 */
```

---

## 5. 屏级骨架

每屏给「自上而下 → 关键数值 → 交互后变什么」。

### 5.1 B 端「电子券制作」首页（结构指纹最强）

```
红头 .header-container{color:#fff;background:#e2453d;padding:0 20rpx 120rpx}   ← 纯色，不是渐变
  └ .dashboard-container 再叠 CDN 照片 cover（2.4）
  └ 自绘导航：.nav-switch 160×60rpx radius30rpx background rgba(255,255,255,0.12)
  └ 四宫格统计 .static-number{font-size:42rpx;letter-spacing:1px;font-weight:600;color:#FFFFFF}（昨日那行 opacity:.6）
上浮工作区 .operation-container{margin-top:-80rpx}    ← 白格压进红块，本屏的灵魂
  └ .widget-button{width:60rpx;height:60rpx;border-radius:16rpx;background:#fff;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04)}
    .widget-button:active{transform:scale(0.95)}
  └ 8 宫格入口，图标为真实文件：3-coupon / 3-wallet / 3-card / 3-page / 3-customer / 3-store / 3-staff / 3-setting.png
```

交互：`onShow` 拉数据；页面 `navigationStyle:"custom"` + 白字 + `enablePullDownRefresh`。**「负 80rpx 叠压」是这套界面唯一的辨识度来源，出片必留。**

### 5.2 C 端「我的卡包」首页

系统导航（非 custom），且 `pages.json` 把它覆盖成 `#f6f6f6` 底 + 黑字 —— 与 globalStyle 的红底白字完全相反。

```
1 .user-header：头像 + 昵称（未登录整块包在授权钮里，文字「登录」）
  右侧 .profile-link{gap:30rpx;font-size:24rpx;color:#9aa4b3}：qrcode（客户码弹窗）+ setting + share-1
2 .wallet-stats = .row.col-4 四格：优惠券 / 券包 / 次卡 / 商家
  .stat-value{font-size:42rpx;color:#181818}  .stat-label{color:#888}
  ⚠ 四格**无卡片底色**（.wallet-stats 只有 margin-bottom:32rpx，直接坐在 #f6f6f6 上）；.user-header 同样 margin-bottom:32rpx
3 次卡横滑 scroll-view：内为 m-card-magnetic-face，单项宽 calc(100vw - 165rpx)、gap 20rpx（仅 1 张时占满）
4 券列表：4.2 的 .receive 券票，点进 pages_user/coupon/detail
5 m-footer（恒有，数值见 §3.8）
```

四态：`m-loading` → `m-empty`「加载失败」+「重新加载」→ `m-empty`「暂无可用优惠券」→ 列表 + `m-loading text="正在加载..."` / `m-nomore`。未登录时第 3、4 块整块换成 `m-empty :height="400"`「暂无优惠券，请先登录」。

### 5.3 公开领取页（最像"广告片"的一屏）

```
m-navigation-bar（滚动前透明浮在封面上；滚过 swiperHeight 转白）
  #title 槽 = .merchant-info 胶囊：logo 48rpx + 名称 28rpx + chevron，backdrop-filter:blur(8px)
  .scrolled{background:rgba(255,255,255,.98);color:#333;box-shadow:0 4rpx 12rpx rgba(0,0,0,.1);transform:scale(.96)}
  胶囊左侧是自绘「返回 + 首页」双 icon（.custom-capsule）
t-swiper 封面，高 = screenWidth * 4/5
m-coupon-flash（4.5 橙条）
倒计时卡：两态（L4/L5 + R1/R2 呼吸光晕）—— .countdown-start{border:2px solid #1890ff} / .countdown-end{border:2px solid #f6380b}
.container → m-coupon-tpl（4.2 预览卡）→ .section（适用门店 + 简介）→ m-coupon-usage → 门头图 → m-footer
固定 .bottom-fixed-bar：左白胶囊 + 右 .button-receive
```

`button-receive` 文案状态机：「活动未开始」/「活动已结束」/「已抢光」/「活动已停止」/「卡券已作废」/「领取卡券」，下方小字 `button-receive-remark` 显示「券类型 × N张」。
私密版差异：无开始倒计时（只有结束、支持"天"）、预览卡张数取 `issueCount`、左胶囊无「分享好友」、状态文案换成「领取已超时」/「查看已领的卡券」。
领取动作弹窗 `m-coupon-receive-profile` 五态：`正在准备中` → 授权/手机号/`领取口令`（placeholder「请输入5位数字口令」）→ `领取中` + 三步 `t-steps`（资料已提交 / 领券中 / 领取成功）→ `领取成功`（`check-circle-filled` 96rpx 主色 +「打开卡包」）→ `领取失败`（`info-circle-filled` 96rpx `#ffc000`）。

### 5.4 核销码区（黑名单级真相，逐条对齐）

```
.section.mt-2 > .section-header/.section-title「核销码」 > .usage-body{padding:0 32rpx}
├ .usage-card-tip「可用时间：{validTimeLabel}」           26rpx / #777 / margin-bottom:32rpx
├（仅未使用且非转赠锁）.usage-qrcode
│   .usage-qrcode-wrap 360rpx×360rpx > image 360×360 mode="aspectFit"（后端图片 URL，非前端出码）
│   .usage-qrcode-tip「向店员出示此码完成核销」
├ .usage-code
│   .usage-card-no-text「No.32f0 … 」34rpx / 700 / #1a1a1a / letter-spacing:4rpx（每 4 位空格）
│   .usage-code-actions：复制卡号 ｜ 1rpx×28rpx #e7e7e7 分隔 ｜ 联系商家（钮 padding 12rpx 28rpx，字 26rpx #595959）
└ .usage-card-action（转赠中→禁用钮「转赠中」+ 红字「取消转赠」；非可用态→钮文字直接是 statusLabel）
再往下：适用门店 / 提前预约 / 核销奖励 / 转赠奖励 / 转赠给好友
```

次卡版同构，多一行 `.usage-count`「已用 N 次」（`text-wechat` `#576b95`）。复制 toast：券「卡券编号已复制到剪切板」，次卡「卡号已复制」。

### 5.5 B 端核销台（最高频操作屏，结构特殊）

```
.container-search 红带（#e2453d，padding 10rpx 24rpx 24rpx）内白底 radius16 输入框
  placeholder「请输入优惠券码」+ 右侧 scan 图标钮
.alert-success 居中「店员使用微信扫一扫顾客出示的核销码，即可核销」
无输入 → .empty-state-container：scan 图标 120rpx #d9d9d9 + 标题「请扫描或输入优惠券码」
        + 描述「点击顶部扫码按钮或直接输入券码进行核销」+ 两条 tip（qrcode #07c160 / edit-1 #07c160）
查到 → 券概览卡（左 .coupon-face 面额 + 类型；右名称、门槛、「有效期 X 至 Y」；脚部「转赠获得」tag + 状态）
     ＋ 领取信息组（领取渠道 / 领取时间 / 发放门店 / 发放员工 / 发放备注）
     ＋ 核销信息组或作废信息组 ＋ 弱操作文字「作废该优惠券」＋ m-submit「确认核销」
核销完 → m-result「核销成功」/「「券名」已核销」；底部钮变「继续核销」
确认弹窗（bottom）：标题「核销优惠券」+ 核销门店 + textarea「请输入核销备注（选填，仅商家可见）」
                  + 「小技巧：使用微信扫一扫，可快速核销」+「确认核销」
```

拦截/异常提示原样：「该券不可核销」、「优惠券转赠中，暂不可核销」、核销码过期条 `qrcodeExpiredTip`。次卡核销台同构，多「核销记录」白卡（最近 5 条，行「第 N 次 · 权益项」+ 时间 + tag + 「门店 / 员工」）。

### 5.6 券详情红头（B 端）

```css
.detail-header{padding-top:20rpx;min-height:400px;background:url(红纹理 CDN) repeat-x}
/* 关键：红底上必须把凹槽重绘成同色同纹理，否则露出 #f6f6f6 */
.detail-header :deep(.detail-coupon-line)::before,
.detail-header :deep(.detail-coupon-line)::after{
  background-color:#e2453d; background-image:url(同一张纹理);
  background-repeat:repeat-x; background-position:center top; background-size:auto 400px;
}
```

红头内是 4.3 的三段式白券卡（`padding-top:20rpx`、`min-height:400px` 都是 px）。固定 `.submit-bar` 主按钮：「发放优惠券 [已暂停]」/ 禁用「请在券包中添加此券」/「您没有发券权限」，左侧 `button-gold`「收款口令码」。

### 5.7 海报（两种画布，别混）

| | 优惠券海报 | 活动海报 |
|---|---|---|
| 画布 | 750×1334 rpx，pixel 2 → 成图 **1500×2668** | 750×1200 rpx，pixel 2 → 成图 **1500×2400** |
| 底 | 位图 `share-canvas-bg.png`（1080×1920） | 主题色渐变 + 3 枚溢出白圆 |
| 主结构 | 封面图 691×508（顶部圆角 40）→ 金额/门槛左列 + 券名/有效期右列 → 标签-值五格 → 小程序码 300×300 | 封面 `{40,40,670,420}` → 白卡 `{40,500,670,660}` → 标题/装饰条/副标题 → 居中码 360×360 |
| 固定文案 | 「类型 / 门店 / 限领 / 须知 / 说明」 | 「精选好券 · 限时领取 · 扫码即得」「长按识别二维码 · 立即参与活动」 |
| 关键色 | 金额 `#FA6120` 48、门店值 `#ef8b3c` bold、标签列灰 `#999` | 底 `themeColor → lighten(0.25)`，圆 α .16/.14/.18 |

```js
/* 活动海报几何（750×1200 基准，可整段照抄） */
canvas={width:750,height:1200,centerX:375}  coverRect={left:40,top:40,width:670,height:420}
whiteCard={left:40,top:500,width:670,height:660}   content={left:60,top:520,width:630,centerX:375}
qrSize=360; qr.left=(750-360)/2=195; qr.top=round((676 + 1140 - 360)/2)
```

优惠券海报的隐形栅格：标签列恒 `left:66 / width:70`，值列恒 `left:136`，行 top 依次 `960 / 1000 / 1040 / 1080 / 1120`（行距 40）。

**⚠ `m-poster` 圆角减半坑**：内部做了 `borderRadius/2`，页面里为此封了 `const R = (visual) => visual * 2`；正圆必须传 `borderRadius = width`。

### 5.8 标准明细列表页（领取/核销/作废/券包/次卡 5 处同构）

```
① .container-search 红带：placeholder「支持优惠券券码搜索」+ search 图标
② .filter-bar 一行：最新/最早 ▾ ｜ 时间 ▾ ｜ 渠道 ▾ ｜ 门店 ▾ ｜ 员工 ▾ ＋ 右侧「重置」（激活色 var(--td-brand-color)）
③ .summary-bar「共 N 条领取记录」
④ 四态；记录行 = 头像（无头像取昵称首字）+ 昵称 + 时间 + chevron-right
   下方 issue-grid 2×2：发放渠道 / 发券门店 / 发券人 / 发放备注（无值「-」或「无」）
⑤ 底部门控 m-submit「导出核销记录 / 导出领取记录」
```

统计屏同理但**只有数字格和排行榜**：日期筛选 5 chip「今天 昨天 本月 上月 累计」（`.stat-filter-item.active{font-weight:bold;color:#00b359}`）、数值 `.ov-value{44rpx 700 #0f172a}` 落在 `#f9fafb`  tile 上；排行榜前三名用 CDN 奖牌 `sort-1/2/3.png`（44rpx），其余灰底圆形序号，核销率字色 `#16a34a`。**画图表即失真。**

---

## 6. 动效原值

全库只有 2 处 `@keyframes` + 8 处 transition —— 视频里给"界面内动效"时不要凭空发明。

```css
/* 1) 权益项入场：逐条点亮（m-card-benefit-list） */
@keyframes cardSlideIn{ from{opacity:.3;transform:translateX(30rpx)} to{opacity:1;transform:translateX(0)} }
.benefit-card{transition:transform 300ms ease-out, opacity 300ms ease-out, box-shadow 300ms ease-out}
.current{animation:cardSlideIn 400ms forwards}
.verified,.discarded{animation:cardSlideIn 300ms backwards}   /* .default 同 300ms backwards */
:style="{'animation-delay': (index * 50) + 'ms'}"             /* 50ms 错峰 */

/* 2) 倒计时呼吸光晕（公开/私密领取页） */
@keyframes glow-pulse{ 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
.countdown-glow{background:radial-gradient(circle,rgba(246,56,11,0.06) 0%,transparent 70%);
  animation:glow-pulse 3s ease-in-out infinite}
```

其余可复用的"动"只有：`:active{transform:scale(0.95)}`（`.widget-button`、媒体图库选项）、`:active{opacity:.7}`（口令码大字）、导航栏滚动态 `transition: background 0.3s, backdrop-filter 0.3s`、`m-cover` 容器 `transition: all 0.3s linear`。
`m-poster` 的出图时序参数（做"正在生成海报"节奏可用）：建 ctx `50ms` → `ctx.draw` → iOS `80ms` / Android·鸿蒙 `300ms` → `canvasToTempFilePath`。页面侧另有 `setTimeout(800)` 等图片资源、领取接口 `1~2s` 随机延迟演"领取中"。

---

## 7. 素材可得性

可直接取用（`applet/static/img/`）：

| 素材 | 尺寸 | 用途 |
|---|---|---|
| `share-canvas-bg.png` | **1080×1920** | 券海报底图；9:16 与竖屏规格天然对齐 |
| `coupon-used/discard/invalid/ended/unstarted/verify.png` | 各 250×250 | 6 枚状态章（4.6） |
| `empty.png` | 320×320 | 空状态插画；`m-empty` 里只占容器 50%×自身 60% ≈ 整屏 30% 宽 |
| `3-*.png` 19 枚 | 128×128 | 工作台宫格图标（`3-staff.png` 400×400、`3-wecom.png` 605×600，尺寸不一致） |
| `exchange.png` | 64×64 | 兑换券符号（CSS 里 68rpx） |
| `index/me(-active).png` | 128×128 | tabBar 四张 |
| `channel/weapp/wechat.png` | 81×81 | 教程渠道标 |

**离线化风险**：磁卡纹理、B 端头部照片、红头纹理、快闪条装饰 4 处走 CDN 外链（2.4）—— 视频工程要把它们下载进本地资产目录，不能直接引外链。
**必须自绘**：`.coupon-line` 虚线与凹槽、口令码大字、`m-result` 图标（走 TDesign icon）、所有数字格与筛选条。

---

## 8. 现有积木校准

> ⚠️ 2026-08-29：本表所有被校准组件（`CouponCard`/`CardFaceScene`/`PhoneMockup` 等共享场景与外观件）**已随架构收口删除**——但"校准结论"列是逐条实测 applet 源码得来的**视觉真值**，永久有效：复刻产品实物时每片专属组件照本表结论手写（金额右置、无条码、顶栏归属、磁卡光晕层序等），本表就是唯一底账。

| 组件（已删，仅留真值） | 校准结论（永久视觉真值，复刻时照此手写） |
|---|---|
| `CouponCard` 布局 | 金额在**右**：4.2 三种真券实现为 `max-width:230rpx; text-align:right` / `order:1`（非左置）；复刻 = 内容左 + 金额右 |
| `CouponCard` 条码装饰 | 真产品全 App 无条码（0.1 第 1 条）；复刻不得画 `BARS` 竖条 |
| `CouponCard` 缺角 | 20px 圆 + `holeColor`，与真 `.coupon-line::before/after` 一致 |
| `CardFaceScene` | 按 R3 §5.4 规格，与 `m-card-magnetic-face` 实测逐条一致；层序与斜章角度见 4.1 |
| `PhoneMockup` | 壳内顶部应有产品顶栏。**归属校正**：红 `#e2453d` + 白字不是"B 端专属"，而是 `pages.json` globalStyle 的**全站默认**；`#f6f6f6` 浅底是 10 个页面显式覆盖（我的卡包 / 我的券包 / 次卡系列 / 券详情 / 我的商家），其中仅 3 页显式写 `navigationBarTextStyle:black`；9 页 `navigationStyle:custom` 走 `m-navigation-bar` 自绘胶囊（174×64rpx：返回 + 1×18rpx 分隔线 + 首页） |

---

## 9. 复刻六坑

1. 别用 `--td-brand-color-7` 推主色 —— 序号变量仍是默认蓝 `#0052d9`，`App.vue` 只覆盖了 `--td-brand-color`。
2. 底色按 `#f6f6f6` 画，不是 `#f3f3f3`（token 值）也不是 `#e2453d`（globalStyle）。
3. `.popup-footer` 在 `app.css` 里**不存在**，要从页面 scoped 抄（含 `env(safe-area-inset-bottom)`）。
4. `.top-line` 实际生效 `1rpx`（app.css 里重复声明被覆盖）。
5. 红色有 7 个近似值 + 2 个近似绿，逐处照抄（1.6）。
6. CDN 纹理 4 张要本地化（第 7 节），否则录制环境断网就白图。
   附：单位混用清单见 1.1 末段 —— `px` 那批不要乘 1.44。

---

## 10. 边界与引用

- 本文件是**参考层**，不是机检真源：数字口径仍以 `promotion/spec/facts.json` 为准，流程与状态常量以 R2 §7 §8 为准。两者本文件只引用不复制。
- 界面里的状态文字（`statusLabel`、`couponTypeLabel`、`issueTypeLabel` 等）**由后端直出，前端不做枚举→文案映射** → 视频里当服务端字符串理解，不要自造映射表。
- 数量级参考（非约束）：8 个分包、169 个页面、54 个 `m-*` 组件。孤儿组件（全库零引用，线上跑不到，不要演示）：`m-merchant-card`、`m-confirm`、`m-notification`、`m-help-link`、`m-card-progress-preview`。
- 需要新界面而本文件没有时：按 §3 结构件 + §2 配方 + §4.2 券面拼装，再回源码确认数值并回填本文件对应小节。

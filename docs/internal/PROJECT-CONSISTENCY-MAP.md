# 项目一致性地图

> 当前主线状态：Product Truth 已入库；CI 尚未闭环。不要把失败闸门包装成完成。

## 当前基线

- Product Truth：`spec/product-truth/applet/source.tar.xz`
- Snapshot：298 个 `.vue/.js/.json` 源文件；SHA-256 `d1248732f77a38c362844e242d3383fce46517f88b3ff75b2c6069694e7bd6d5`
- Git Blob：`ee34f4c2ecf397a6a43e7ecb7aa5eeb9a8f3804a`
- g11 `VTemplate`：`sceneScale=0.76`
- g11 EmberParticles：已约束在像素安全边界
- 当前无 active Change Contract transaction

## 当前未闭环事项

### P0-A：Product Truth / 真值表自证

CI 已成功解包 Product Truth snapshot，但 `check-ui-truth` 仍报告 53 个真值表/画面字段名无法在 APPLET 源码逐字命中。

这不是“为了过 CI 就删字段”的问题。应逐项回到 APPLET 源码判断：

1. 真值表字段名是否确实错误；
2. 是否把说明语句误登记成字段名；
3. 是否应按动态 label / 实际页面原话登记；
4. 修正后再由 CI 重新验证。

**不得跳过、放宽 checker、制造别名。**

### P0-B：g11 安全区

`sceneScale=0.76` 已进入源码，但此前有安全区失败证据是在更早的 checkout 上产生的；必须重新渲染当前主线并跑 `probe-safe-area`。

机械安全区通过后仍需真人复核关键帧，确认缩放没有把画面压成 PPT 式“小卡片”。

### P1：红线人工确认

硬禁层当前为 0 命中；文案层仍有需人工确认项。人工确认完成前不声明全项目 CLOSED。

## 产品口径

“券到卡包”是商家优惠券制作、发券、核销及转赠/裂变等推广工具。

- 不支持付费购券；
- 不收取手续费；
- 客户支付时不会自动抵扣；
- 优惠券是优惠凭证，到店后凭券核销抵扣优惠金额；
- 核销后，客户仍通过门店原有收款渠道支付剩余金额。

例如：20 元优惠券用于 100 元消费，店员先核销 20 元优惠券，顾客再向商家支付 80 元。

“满 100 减 18 元”是合法、正常的满减券示例，不属于产品真实性错误；“消费门槛=0”则表示无门槛。两者必须根据具体券实例分别表达。

## 收口条件

完整 Product Truth → 真值表逐项修正 → `check-ui-truth` 通过 → 当前源码 fresh render → safe-area probe → 真图复核 → gate-all 全绿 → R8 closure。

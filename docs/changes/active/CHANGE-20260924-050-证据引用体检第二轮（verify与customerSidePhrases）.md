# Change Contract

## 一、基本信息

- changeId：`CHANGE-20260924-050`
- 标题：证据型引用体检第二轮——verify／customerSidePhrases 4 条修正、13 条判吻合、4 条登记待人工
- 负责人：用户（方向）／AI-B
- 范围：`project`
- 状态：`CLOSED`
- 触发：用户 2026-09-24「① 那三项做吧」的续做（048 已登记剩 22 条）

## 二、Goal

把 048 登记的剩余证据型引用逐条过完：能确证的修正、吻合的保留、需判断的登记，不留下"没人管的模糊账"。

## 三、新口径 New Policy

沿用 048 §三：**逐条人工定位**（锚点＝源码实际文本行／watch／v-if），**不自动改写**。

## 四、Replace

| # | 位置 | 旧 | 新 | 依据 |
|---|---|---|---|---|
| 1 | `verifyPageKeyInfo.src` | `verify/verify.vue:6,123-125,133-147,38-73,359-371` | `verify/verify.vue:6,133-147,38-73,359-371` | `123-125` 是闭合行与注释，无语义 → 删除该段 |
| 2 | `verifyPageKeyInfo.items[0]`（转赠获得） | `verify/verify.vue:123-125` | `verify/verify.vue:119` | 标签原话在第 119 行 |
| 3 | 同上 `items[1]`（优惠券转赠中，暂不可核销） | `verify.vue:87-91` | `verify.vue:76-84` | 提示块 `<!-- 过期／转赠中提示 -->` 76 起、原话 84 |
| 4 | `customerSidePhrases.items[3]`（转赠给好友） | `pages_user/coupon/detail.vue:131,157` | `pages_user/coupon/detail.vue:131,179` | 原话「好友领取前可多次分享…」实测第 179 行 |

## 五、Remove

**Remove**：上述旧行号与无效段。

**登记待人工（4 条，不在本事务强改）**：`linkages[8]`（候选池逻辑未定位）／`messageReminders`（订阅授权 watch 需重定位；`public_receive.vue:205-220` 现指向广告位）／`offScript.items[0][1]`（需按条目文本重定位）。

## 六、Preserve

`../applet` 零改动；既改条目之外的引用（13 条判吻合）保留原样；`_meta` 其余字段不动。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 归属阶段 |
|---|---|---|---|---|
| `spec/coupon-fields.json`（4 条 src ＋ `_meta.lastEvidenceSweep`） | 真值表引用 | REPLACE | 逐条对源码实测行＋JSON 校验＋闸门 | 批 1 |

## 八、Migration Plan

1. 全量铺出剩余 22 条的"规则＋引用行内容"→ 逐条判定（吻合／漂移／待人工）。
2. 4 条漂移按源码实测行修正；`_meta` 记录本轮结论（修正 4／吻合 13／非源码 1／待人工 4）。
3. 复跑闸门。

## 九、Mechanical Checks

- 4 条新引用逐条对源码：`119`（"转赠获得"）／`76-84`（转赠中提示）／`6,133-147,38-73,359-371`（券码输入＋领取信息＋奖励状态＋成功失败文案）／`131,179`（A 侧入口＋成功提示原话）。
- `check-doc-references` 0 硬失败；`gate-all` 13/15、无红灯；JSON 可解析。

## 十、Negative / Semantic Counterexample

- **负向（保留无效段）**：`123-125` 这种"闭合行引用"看似无害，但会让人误以为那里有内容 → 本事务直接删除该段而非替换成猜测范围。
- **语义反例**：把待人工 4 条随手改成一个"附近范围"充数——会让引用看似完整、实则错位。拦截：§五 明确登记，不猜。

## 十一、Real Output Verification

```text
- Real Output 声明：`not-applicable`
- 理由：本事务范围＝引用行号体检，不产出关键帧或成片。
```

## 十二、Closure Report

- 已修改：`spec/coupon-fields.json`（4 条 `src`＋`_meta.lastEvidenceSweep`）
- 已废止：上述旧行号与 `123-125` 无效段
- 已保留：13 条判为吻合的引用；1 条非源码引用；`../applet` 零改动
- 影响面：`1 / 1 已处理`
- 旧口径扫描：**PASS**（无口径变更）
- 机械检查：**PASS**（`check-doc-references` 0；`gate-all` 13/15、2 项跳过、无红灯；JSON 校验通过）
- 负向测试：**PASS**（`verify.items[0]` 修正前后对照：旧 `123-125` 内容为 `</view></view>`、新 `119` 为"转赠获得"原话）
- 语义反例：**PASS**（待人工 4 条只登记不猜改）
- 真图/成片：N/A
- 本次新增红：**0**

**结论：CLOSED**

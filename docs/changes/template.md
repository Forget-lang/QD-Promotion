# Change Contract

## 一、基本信息

- changeId：`CHANGE-YYYYMMDD-XXX`
- 标题：
- 负责人：
- 范围：`global` / `project` / `experiment`
- 状态：`PROPOSED` / `APPROVED` / `MIGRATING` / `VERIFYING` / `CLOSED`

## 二、Goal

一句话说明为什么要改。

## 三、新口径 New Policy

明确写出变更后的唯一口径。

## 四、Replace

必须明确写出被替代的旧口径、旧模式或旧资产。

## 五、Remove

必须明确写出应删除或停止新产出的内容。

## 六、Preserve

明确哪些历史交付物保留，但不得作为新产出参照。

## 七、Impact Map

| 资产 | 类型 | 动作 | 验收方式 | 状态 |
|---|---|---|---|---|
|  |  | ADD / REPLACE / REMOVE / PRESERVE |  | PENDING |

## 八、Migration Plan

1. 
2. 
3. 

## 九、Mechanical Checks

- 旧术语/旧口径扫描：
- 旧组件/旧布局扫描：
- 文档引用检查：
- 其他相关闸门：

## 十、Negative / Semantic Counterexample

故意构造一个“关键词改了但本质仍然违规”的反例，并说明应由哪一层拦截。

## 十一、Real Output Verification

**声明（二选一，机器可读，必填）**：本事务到底需要什么真实产物，由本事务自己声明，机器不猜。

```text
- Real Output 声明：`applicable`
- 适用证据：
  - 逐条列出本事务所需的真实产物证据，不得留 PENDING

或

- Real Output 声明：`not-applicable`
- 理由：非空一行，说明为何本事务不存在可验收的真实产物
```

- 真实关键帧/短片：
- 人工验收判据：
- 结果：PENDING / PASS / FAIL

## 十二、Closure Report

- 已修改：
- 已废止：
- 已保留：
- 影响面：`0 / 0`
- 旧口径扫描：PENDING
- 机械检查：PENDING
- 负向测试：PENDING
- 语义反例：PENDING
- 真图/成片：PENDING
- 本次新增红：PENDING

> 证据写法：每个 `PASS` 后附证据定位（命令、脚本路径或 CI/提交标识），便于人工核对。该约定属人工判据，机器只校验取值是否为 PASS。
> 字段可与 `R8` §十 的文本块写法互换；两种写法机器都接受。

**结论：NOT CLOSED**

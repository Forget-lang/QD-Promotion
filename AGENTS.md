# 券到卡包 · 内容运营项目（AI 入口）

> 最后校验：2026-09-15（变更史见 `outputs/archive/changelog.md`）。
> 任何 AI 助手在本仓库开工前，先读本文件，然后按「§三 开工三动作」执行。

> **改动权威文档：决策层你拍板，执行层机器自证**。改动对象限本立项的权威文档——`SKILL.md` / `spec/` / `docs/internal/` / `AGENTS.md` / `docs/战略简报.md` / `docs/AI使用手册.md`。
> - **决策层**：凡改方向、换口径、删文件、升级全局、新增规则，先报告方案，用户明确批准后再执行。
> - **执行层**：已批准的机械落实由 AI 一次完成，并提交整改对账单；不再要求用户逐条确认执行过程。
> - **全局变更**：凡涉及 2 个以上权威对象、共享组件、流程、全局规则或跨行业规范，必须遵循 `docs/internal/R8-变更收敛协议.md`：先出 Change Contract + Impact Map，再执行迁移，最后交 Closure Report；没有 CLOSED 不得宣称“已落实”。

## 一、项目是什么

- 产品名：券到卡包（面向实体店的电子券工具：做券→发券→领券→扫码核销→统计）｜ 运营主体：郑州百桨数字科技 ｜ 工作区：`promotion/`
- 阶段：宣传线冷启动（抖音短视频 + 小红书图文 + 搜狐长文），**无真实案例**，正文一律用行业泛称
- 产品源码逻辑身份：`APPLET`。本机默认解析路径为 `../applet/`；跨 Agent / ChatGPT / CI 的路径规则见产品事实源解析协议。不得把任一绝对路径当成跨环境永久路径。

## 二、文档在哪（每类知识只有一个真源）

| 你要什么 | 读 |
|---|---|
| 怎么做一条宣传视频（**唯一作业文档**，八步法） | `SKILL.md` |
| 产品事实 / 平台红线 / 素材登记 | `spec/facts.json` / `spec/redlines.json` / `spec/assets.json` |
| **制券页字段、分组归属、上限与联动** | `spec/coupon-fields.json`——表里没有的字段/组名回 `APPLET` 源码取证并回写该行（带 `src` 行号），不得凭印象编 |
| **次卡设置项** | `spec/card-fields.json`——表里没有的字段/组名回 `APPLET` 源码取证并回写，不得凭印象编 |
| 业务流程说明 | `docs/internal/R2-业务流程.md`（只负责业务链路解释；不是 AI 开工必读入口，也不拥有产品字段真值） |
| Remotion 技术原理 | `docs/internal/R3-Remotion技术参考.md` |
| applet UI 视觉快照 | `docs/internal/R6-applet前端UI储备.md`（视觉参考；事实以 APPLET / Product Truth 为准） |
| **Product Truth / applet 路径解析** | `docs/internal/R10-产品事实源解析协议.md` |
| **全局变更收敛协议** | `docs/internal/R8-变更收敛协议.md` |
| 视觉导演 / 视觉映射 | `docs/internal/R9-视觉导演与审美决策.md` / `docs/internal/R9-视觉映射表.md` |
| 官网玩法蓝本 / 避雷台账 | `outputs/archive/官网资源库落地规划.md`（历史/参考，不是当前作业入口） |
| 平台玩法组合视角 | `knowledge/玩法版图.md`（知识参考，不是规则 Owner） |
| 项目总览 / 人机协作方法 | `docs/战略简报.md` / `docs/AI使用手册.md` |
| 近期决策与踩坑 | `outputs/archive/changelog.md` 顶部约 10 条 |
| 组件 / 素材 / 已产出片实时清单 | `node scripts/list-assets.mjs` |
| 爆款叙事方法 + 语料 + 洞察 | `knowledge/爆款整片解剖.md` / `knowledge/洞察库.md` / `knowledge/爆款文案技能包/` |

### 文档宪法

- **铁律一**：历史只有一个家 = `changelog`；规则正文不写改动史。
- **铁律二**：校验戳只写日期与指针。
- **铁律三**：状态快照以脚本实时输出为准，不写静态规则文档。
- **铁律四**：条款只写“做/不做”+ 一句判据；理由与过程进 changelog。
- **铁律五**：替代型决策必须同时完成：①新口径进入唯一属主；②旧口径登记到 `scripts/ref-registry.json` 的 `deprecatedTerms` / `caliberOwners`；③`check-doc-references` 通过。**新增不等于替代，旧口径没登记就视为未落地。**
- **铁律六（最高危险信号）**：任何整改如果出现“同一概念多个 Owner、多个当前入口、规则正文互相冲突、历史文档被当成当前规则、通过新增文档解决已有规则冲突、或为了迎合检查器而迁就错误语义”，立即停止继续改文档，先回到 Owner/冲突审计；**整改不得增加系统复杂度**。
- **铁律七（唯一作业主干）**：`SKILL.md` 是唯一视频生产作业流程；R2/R3/R6/R9/R10 各自只负责已经定义的领域，不得再创建第二套视频制作流程。R8 只在发生全局变更时作为治理覆盖层，不是第二套生产流程。
- **铁律八（历史与当前彻底分离）**：`outputs/archive/` 与 `changelog` 不得成为当前作业入口；历史材料只能作为证据/参考。当前规则必须回到其唯一 Owner。
- **铁律九（AI 读取顺序）**：正常开工只沿 `AGENTS → SKILL → 当前任务对应 Owner → 输出 → Gate` 主线读取；不要为了“完整”遍历全部内部文档。只有任务确实涉及对应领域时，才读取 R2/R3/R6/R8/R9/R10。发生全局变更时才进入 R8 覆盖流程。
- **铁律十（权威声明最小化）**：只有真正拥有该概念的 Owner 才能使用“以本文为准 / 唯一真源 / 权威 / 必须”等权威表述；非 Owner 文档不得重新定义同一概念，只能引用、解释或指向 Owner。

## 三、开工三动作（每次新会话必执行）

1. `node scripts/gate-all.mjs` —— 红灯不产出、不交付。
2. `node scripts/list-assets.mjs` —— 状态类问题只认脚本输出。
3. 读 `outputs/archive/changelog.md` 顶部约 10 条 —— 不推翻刚拍板的口径。

## 四、三大铁律（不可破）

1. **不虚假宣传**：功能、数字、术语必须能在 `spec/facts.json` 或产品线真值表找到依据；不编店名/案例/数据。冲突即当场改齐。
2. **不触平台红线**：三平台正文、画面、账号资料位一律不写导流；以 `check-redlines` 输出为准。
3. **效果优先于合规表**：成片成败由 `check-motion` 数字 + 用户看真图共同决定；“规范全绿但不好看”= 方法错误。

## 五、协作规则

- AI = 策划者 + 设计者 + 执行者；用户给方向、拍板、最终审美。
- 单片反馈默认只动单片产物；涉及全局方法、共享组件、流程或跨行业规范，必须走 R8 全局变更流程。
- **落点路由**：机器能判的进 `spec/`；人看图/听音判的进 `SKILL.md`；原理进 `docs/internal/`；历史进 `changelog.md`。同一内容只允许一个唯一属主，其余位置只留指针。
- **全局变更强制流程**：
  1. Change Contract：写明目标、新口径、替代项、删除项、保留项、范围、验收条件。
  2. Impact Map：扫描规则、spec、脚本、模板、组件、参考、当前片与旧口径登记，给出 ADD/REPLACE/REMOVE/PRESERVE。
  3. Migration：按影响面迁移，禁止“只新增不清旧”。
  4. Verification：机械扫描 + 至少一次负向测试 + 至少一个语义反例。
  5. Visual/Artifact Check：涉及内容/视觉/动效时，至少给一个真实关键帧或短片。
  6. Closure Report：只有全部验收通过才标记 CLOSED。
- **整改对账单**：必须包含改动文件、自证命令/退出码、负向测试、新引入红、保留旧红、结论。对账单不能证明全局迁移完成，就不算落实。
- **文案清晰度**：口播与画面文字第一遍必须读懂；读不懂即退回。
- **审批必须给真图**：逐屏关键帧/短片，不交纯文字想象稿。
- 改任何权威文档后：跑 `node scripts/gate-all.mjs` + 在 changelog 顶部追加一条。
- 新片不得无理由复用上一条行业的布局架构；由现有 `check-layout-diversity` 约束。
- **APPLET 协作规则**：产品源码的逻辑身份永远是 `APPLET`；本机 live source 优先，CI 使用 committed snapshot materialized 到 `../applet`；snapshot 与最新 live source 不一致时必须重新生成 snapshot，不得静默接受旧快照。

## 六、目录

```text
promotion/
├── AGENTS.md
├── SKILL.md
├── spec/
│   └── product-truth/
├── docs/internal/
│   ├── R2-业务流程.md
│   ├── R3-Remotion技术参考.md
│   ├── R6-applet前端UI储备.md
│   ├── R8-变更收敛协议.md
│   ├── R9-视觉导演与审美决策.md
│   ├── R9-视觉映射表.md
│   └── R10-产品事实源解析协议.md
├── scripts/
├── video/
├── 商用字体/ 图标素材/ 截图素材/ 插图库/ 背景素材/
└── outputs/
```
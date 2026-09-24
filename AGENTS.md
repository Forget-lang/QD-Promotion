# 券到卡包 · 内容运营项目（AI 入口）

> 最后校验：2026-09-24。任何 AI 助手在本仓库开工前先读本文件。
> **本文件是唯一 AI 自动入口与项目级治理 Owner；不拥有具体领域细节。**

## 一、最高戒律：先统筹全局，后局部执行

> **先察全局，后定阵型；先立中军，后分兵执行；先清旧阵，后布新阵。**

- 任何规则必须有明确落点；任何落点只能有一个 Owner。
- 任何引用只能指向 Owner；非 Owner 只能解释、引用、导航或提供证据。
- 任何替代必须清理旧阵：新口径进入唯一 Owner 后，旧口径必须删除或进入明确废止登记；**废止的方法／口径／机制正文不得以"历史留存"为名留在权威／规范／资源文档内**——只在 `docs/changes/` 变更记录、`deprecatedTerms`／废止登记与 `outputs/archive/` 历史快照中出现，正文最多留一句废止注记＋指向变更记录。
- 任何历史必须退出当前指挥链：`outputs/archive/` 只能提供证据与回顾，不得成为当前入口、当前规则或当前状态源。
- **任何改动或产出之前，先做最小定位**：① 这在项目哪一层 ② Owner 是谁 ③ 会牵动谁 ④ 旧口径在哪。**定位的结论决定它是否需要升级为全局变更**；一旦判定为全局，必须先完成资源、Owner、入口、依赖、重复、冲突、断档、当前/历史边界与优先级侦察，再进入 Migration。**定位未完成，不得动手。**
- 发现第二 Owner、第二入口、规则重复、历史越权、新旧并存、或检查器与真实语义冲突时立即 STOP，回到全局审计。

## 二、项目级 Owner 地图

| 概念 | 唯一 Owner | 只负责什么 |
|---|---|---|
| AI 自动入口 / 项目治理 | `AGENTS.md` | 路由、边界、全局纪律 |
| 行业场景视频生产 | `SKILL.md` | 行业线一条视频从开工到发布的完整工作流 |
| 产品功能教程生产 | `docs/internal/产品功能教程作业规范.md` | 教程线方法 Owner（判线与闸门适用性声明源在 `scripts/ref-registry.json`） |
| 贴图宣传策划与制作 | `docs/internal/贴图宣传作业规范.md` | 静态宣传贴图从选题、官网研究、原创攻略、视觉设计到成品验收的方法 Owner；不负责最终发布 |
| 产品能力/字段/数字/限制 | `APPLET / spec/` | Product Truth |
| 产品事实源解析 | `docs/internal/R10-产品事实源解析协议.md` | 如何定位 Product Truth |
| 内容资源职责边界 | `docs/internal/内容资源调用协议.md` | 官网、爆款、玩法版图、Product Truth 的职责边界 |
| 业务流程解释 | `docs/internal/R2-业务流程.md` | 业务链路解释 |
| Remotion 技术 | `docs/internal/R3-Remotion技术参考.md` | 工程原理 |
| UI 视觉证据 | `docs/internal/R6-applet前端UI储备.md` | UI 视觉参考 |
| Remotion 组件 | `docs/internal/R7-Remotion组件库.md` | 公共工程组件与登记 |
| 全局变更治理 | `docs/internal/R8-变更收敛协议.md` | Change Contract / Impact Map / Migration / Verification / Closure |
| 导演层（导演决策 Owner） | `docs/internal/R9-视觉导演与审美决策.md` / `R9-视觉映射表.md` | 为什么这样讲（叙事结构／观看动力／悬念／转折／情绪曲线／信息释放顺序）＋视觉方向与映射 |
| 风格层（表达能力包） | `video/styles/` 下每风格一个自包含目录（清单与逐闸门适用性声明源＝`scripts/ref-registry.json` 的 `styles`） | 用什么视觉语言表达（镜头表现方式／空间／素材／动效／声音）；不拥有内容流程、叙事决策与观看路径；**两线共享**（经各线唯一 Owner 路由——教程线启用风格包前，逐闸门取值合成规则须先专项定稿） |
| 整改前置侦察 | `docs/internal/整改作战总纲.md` | 全局整改前排兵布阵 |
| 组合玩法视角 | `knowledge/玩法版图.md` | 功能原子 × 功能原子组合成生意打法 |
| 传播研究资源 | `knowledge/爆款文案技能包/` / `knowledge/爆款整片解剖.md` / `knowledge/洞察库.md` | Hook、结构、信息增量、教学节奏、反模式、洞察 |
| 历史证据 | `outputs/archive/` | 回顾与审计证据（只作证据，不承担当前规则） |

**`docs/internal/内容资源调用协议.md` 不是第二视频流程；它只定义资源职责边界。**

**两条生产职责共享同一套基建与真值层**（`spec/` 真值与红线、`scripts/` 闸门、`video/` 工程、`docs/changes/` 事务）：共享层不得复制出第二份；方法层不得互相继承（一条规则只写进它所属的 Owner）。判线的唯一声明源是 `scripts/ref-registry.json` 的 `contentLines`。

## 三、内容职责主干

当前项目存在两条视频内容线，以及一条独立的静态贴图宣传生产职责：

- 行业场景视频 → `SKILL.md`
- 产品功能教程 → `docs/internal/产品功能教程作业规范.md`
- 贴图宣传策划与制作 → `docs/internal/贴图宣传作业规范.md`

贴图宣传不是视频 content line，不进入 `scripts/ref-registry.json` 的视频 `contentLines`，不借用行业线/教程线的视频 Gate；它有自己的方法 Owner，但继续共享 Product Truth、内容资源边界与平台红线真源。正常路由：

```text
AGENTS（唯一入口）
→ 行业场景视频：SKILL.md
→ 产品功能教程：docs/internal/产品功能教程作业规范.md
→ 贴图宣传：docs/internal/贴图宣传作业规范.md
→ 当前产物
→ 各自适用的验收
```

原“双内容职责”所描述的视频两线关系继续有效，仅补充第三类静态贴图职责。

正常生产只沿统一入口，并按内容职责分流：

```text
AGENTS（唯一入口）
→ 行业场景视频：SKILL.md
   产品功能教程：docs/internal/产品功能教程作业规范.md
→ 当前产物
→ Gate / 人工验收
```

闸门按内容线取目标（判线声明源见 `scripts/ref-registry.json` 的 `contentLines`）；观察/不适用/未建立三类状态由声明驱动，脚本不得自行推导。

行业线的「画面从哪来」由**风格层**承担：每片先按 `styles` 声明选定风格包并声明 `styleId`；风格包**不构成入口**，经 `SKILL.md`／`R9` 内部路由（清单与逐闸门适用性只认 `scripts/ref-registry.json` 的 `styles`）。

不要为了“完整”遍历全部内部文档。任务只读实际涉及的 Owner。

## 四、内容资源统一口径

一条内容必须同时解决两个问题：

```text
事实问题：产品到底能不能这么做？
传播问题：这个真实问题怎么讲才值得看？
```

统一关系：

```text
Product Truth
    ↓
官网场景 / 玩法理解
    ↓
玩法版图组合
    ↓
确定“这一条到底教什么”
    ↓
爆款同类传播研究
    ↓
SKILL 组织成完整视频
```

禁止：

- 把官网营销话术直接当产品事实；
- 把爆款案例当产品能力、数字或操作依据；
- 先找单篇爆款再反推产品玩法；
- 让官网 archive 文档充当前生产入口；
- 在启动指令里复制 SKILL 的具体步骤。

当前官网调用职责、采信边界和读取方式只认 `docs/internal/内容资源调用协议.md`；官网现网内容是活资源，历史快照只作证据。

## 五、产品真值与红线

- 功能、数字、术语、字段、限制必须回 `APPLET / spec/`。
- 不编店名、案例、经营数据。
- 平台红线按 `spec/redlines.json` 与当前 Gate。
- `check-doc-references`、`gate-all` 通过不等于语义正确；检查器与真实语义冲突时，修检查器或规则落点，不降低正确语义。

## 六、全局变更纪律

凡涉及两个以上权威对象、流程、共享组件、跨行业规范或全局规则，必须走 `docs/internal/R8-变更收敛协议.md`：

1. 先读 `docs/internal/整改作战总纲.md`；
2. 完成全局资源/Owner/入口/冲突/依赖/当前历史审计；
3. 建立 Change Contract + Impact Map；
4. Migration 时执行 ADD / REPLACE / REMOVE / PRESERVE；
5. 机械检查 + 至少一个负向测试 + 至少一个语义反例；
6. 涉及视觉/内容时给真实关键帧或短片；
7. 所有关闭条件均有最终证据后才允许 CLOSED。

**ADD 不是默认动作。** 当前 Owner 能承载时不得新增第二文档/第二流程/第二入口。

## 七、整改专用前置

任何“整改 / 治理 / 收口 / 清理 / 架构整理 / 全局一致性”任务必须先读：

`docs/internal/整改作战总纲.md`

未完成全局排兵布阵不得进入 Migration；不得以局部 Gate 或一份文档的修改代替全局判断。

## 八、新会话工作纪律

`AI工作启动指令.md` 是用户侧复制用的稳定执行协议，不是 Owner。

启动 AI 时必须：

1. 找到当前唯一 Owner；
2. 读取 Owner 当前版本；
3. 动态解析当前 Step → 输入 → 输出 → 完成条件；
4. 从第一个未完成节点继续；
5. 前一节点未完成不得进入下一节点；
6. 用真实证据证明完成；
7. Owner 未定义时报告“当前 Owner 未定义”，不得发明长期规则。

## 九、新会话视觉隔离

进入一个新行业/新片时：

- 历史成片、历史分镜、历史帧图、单片源码只能用于确认过去做过什么和检查重复；
- 不得把旧片构图、镜头关系、视觉母题、字幕布局、动效编排或整套样式当新片模板；
- 跨片仅允许复用真实产品 UI、品牌资产、R7 已登记通用组件和明确批准的长期公共资产；
- 不得无理由复用上一条行业的布局架构；由当前视觉检查约束。
- 视觉隔离的“上一条”以**同一内容线**为基准（行业对行业、教程对教程）；跨内容线默认互不比较（闸门自本事务起均按线取目标）。
- 风格轮换与跨风格验收（行业线）：**同一风格不得连续复用**；跨风格验收＝**导演稿替换测试**——同一份《导演稿》换任一风格包，都不得要求改写叙事结构／信息释放顺序／观看路径／情绪曲线（判据在 `R9` §十五，长期有效；越界即该风格包问题）。
- 历史片清单与隔离标记的登记表＝`outputs/LEGACY-ISOLATION.md`（机器声明源＝`scripts/ref-registry.json` 的 `legacyPieces`，由 `check-style-rotation` 逐片对账）；**隔离规则本体仍属本节**，登记表只登记"哪些片是历史交付、标记长什么样"，不另立规则。

## 十、开工三动作

每次新会话：

1. `node scripts/gate-all.mjs`
2. `node scripts/list-assets.mjs`
3. 读 `docs/changes/active/` 与 `docs/changes/closed/` 的最新变更事务

整改任务先执行“整改前置排兵布阵”，再做这三动作。

## 十一、状态与历史

- 实时状态以脚本输出和当前产物为准。
- `PROJECT-CONSISTENCY-MAP.md` 只用于恢复状态，不是入口。
- `outputs/archive/` 只作历史证据。
- 变更现状以 `docs/changes/{active,closed}/` 与脚本输出为准；`outputs/archive/` 只作历史证据，不承担当前规则。

## 十二、APPLET 协作

产品源码逻辑身份永远是 `APPLET`。本机 live source 优先；CI 使用 committed snapshot materialized 到 `../applet`。snapshot 与最新 live source 不一致时必须重新生成 snapshot，不得静默接受旧快照。

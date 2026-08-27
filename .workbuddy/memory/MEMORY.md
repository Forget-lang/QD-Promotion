# 项目记忆 · 券到卡包（quandao 工作区）

> 最后校验：2026-08-27（文档架构重构阶段 3：指向切换到 spec/ + workflow/ 新结构）
> ⚠️ **本文件是 WorkBuddy 工具便利贴，非权威真源**（工具每次运行可能自动更新，换工具不读取）。项目重要记忆一律在权威层（spec/ + workflow/ + AGENTS.md），本文件只放工具使用经验 + 导航。

---

## 权威记忆去哪看（重要记忆不在此文件）

- 决策/变更历史 → `outputs/archive/changelog.md`（最新在前）
- 待验证课题/经验假设 → `workflow/策划弹药库.md` §6 待验证假设（HYP）
- 红线 → `spec/redlines.json`；速记在 `AGENTS.md` §三铁律
- 产品事实/业务深度 → `spec/facts.json`
- 内容模式/质量标准 → `workflow/pipeline.md`
- 项目规则/协作 → `AGENTS.md`

## 开工必读索引

1. `AGENTS.md` —— 入口卡片（项目/铁律/任务→手册映射/协作规则/闸门）
2. `workflow/pipeline.md` —— 流程唯一主线：策划→视频→发布 + 全部闸门
3. `workflow/craft.md` —— 审美与视觉原则（层级参数/排版参照/布局模式）
4. `workflow/策划弹药库.md` / `workflow/发布弹药库.md` —— 策划与发布弹药
5. `spec/facts.json` / `spec/redlines.json` / `spec/assets.json` —— 事实/红线/素材登记三真源
6. `docs/internal/R2-业务流程.md`、`docs/internal/R3-Remotion技术参考.md` —— 保留参考，按需查
7. `outputs/archive/changelog.md` —— 文档变更日志

> 2026-08-27 文档架构重构阶段 3：旧文档（M1/M2/M3/R0/R1/R4/R5/素材索引表）全量存档 `docs/archive-legacy/`（只读，不引用）。

## 环境/工具知识（WorkBuddy 使用经验）

- `check-redlines.mjs` 分层输出：①画面层/②口播文案层=硬禁（`video/src` 零命中才算过闸门）；④文档层命中=描述红线规则属正常提示，无需处理；子串匹配会误伤（扣一/100%/进主页），改写措辞重跑
- macOS `~/.Trash` 受 TCC 保护：`ls`/`find` 报 Operation not permitted，但 `mv`/`stat` 可正常访问；移文件入回收站后用 `stat -f "%N"` 验证，勿用 `ls`
- Remotion 渲染必带 `NODE_OPTIONS=""` 前缀（通过 Bash 执行渲染时）

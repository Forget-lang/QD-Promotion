# 项目记忆 · 券到卡包（quandao 工作区）

> 最后校验：2026-08-29（文档收敛：`workflow/` 四份 + 模板库 + T03 认可帧归档至 `outputs/archive/20260829-文档收敛归档/`，作业文档收敛为 SKILL 唯一；R4→R6）
> ⚠️ **本文件是 WorkBuddy 工具便利贴，非权威真源**（工具每次运行可能自动更新，换工具不读取）。项目重要记忆一律在权威层（`SKILL.md` + `spec/` + `AGENTS.md`），本文件只放工具使用经验 + 导航。

---

## 权威记忆去哪看（重要记忆不在此文件）

- 决策/变更历史 → `outputs/archive/changelog.md`（最新在前）
- 红线 → `spec/redlines.json`；速记在 `AGENTS.md` §四 三铁律
- 产品事实/业务深度 → `spec/facts.json`
- 内容模式/质量标准 → `SKILL.md`（唯一作业文档，七步法）
- 项目规则/协作 → `AGENTS.md`（入口）
- 旧生产文档（pipeline/craft/两份弹药库/模板库）→ 已归档 `outputs/archive/20260829-文档收敛归档/`，不再作为执行依据

## 开工必读索引

1. `AGENTS.md` —— 入口卡片（项目/真源表/开工三动作/三铁律/协作要点）
2. `SKILL.md` —— 唯一作业文档：一条视频的七步法 + 量化验收线
3. `spec/facts.json` / `spec/redlines.json` / `spec/assets.json` —— 事实/红线/素材登记三真源
4. `docs/internal/R2-业务流程.md`、`docs/internal/R3-Remotion技术参考.md`、`docs/internal/R6-applet前端UI储备.md` —— 保留参考，按需查
5. `outputs/archive/changelog.md` —— 文档变更日志

> 2026-08-27 文档架构重构阶段 3：旧文档（M1/M2/M3/R0/R1/R4/R5/素材索引表）已存档后于同日清理删除，原文在 git 历史（提交 `227e05a` 及之前）可查，新内容一律不引用。2026-08-29 文档收敛：`workflow/` 体系整体归档（见上），原 `R4-applet前端UI储备` 改名 `R6`（避让退役编号）。

## 环境/工具知识（WorkBuddy 使用经验）

- `check-redlines.mjs` 分层输出：①画面层/②口播文案层=硬禁（`video/src` 零命中才算过闸门）；④文档层命中=描述红线规则属正常提示，无需处理；子串匹配会误伤（扣一/100%/进主页），改写措辞重跑
- macOS `~/.Trash` 受 TCC 保护：`ls`/`find` 报 Operation not permitted，但 `mv`/`stat` 可正常访问；移文件入回收站后用 `stat -f "%N"` 验证，勿用 `ls`
- Remotion 渲染必带 `NODE_OPTIONS=""` 前缀（通过 Bash 执行渲染时）

# 项目记忆 · 券到卡包（quandao 工作区）

> 最后校验：2026-08-21（瘦身版：仅便利贴，重要记忆已迁权威层）
> ⚠️ **本文件是 WorkBuddy 工具便利贴，非权威真源**（工具每次运行可能自动更新，换工具不读取）。项目重要记忆一律在 `docs/internal/` 权威层，本文件只放工具使用经验 + 导航。

---

## 权威记忆去哪看（重要记忆不在此文件）

- 决策/变更历史 → `outputs/archive/changelog.md`（最新在前）
- 待验证课题/经验假设 → `docs/internal/R4-最佳实践库.md` §8 待验证假设（HYP-001~005）
- 红线 → `docs/internal/R5-内容红线.md`；速记在 `AGENTS.md` §三铁律
- 内容模式/质量标准 → `docs/internal/M1-内容策划手册.md`
- 项目规则/协作 → `AGENTS.md`

## 开工必读索引

1. `AGENTS.md` —— 入口卡片（项目/铁律/任务→手册映射/协作规则/闸门）
2. `docs/internal/M1-内容策划手册.md` —— 内容策划（行业/玩法/文案/口播）
3. `docs/internal/M2-视频制作手册.md` —— 视频制作（设计稿→无声版→TTS→成片）
4. `docs/internal/M3-平台发布手册.md` —— 平台发布（封面/CTA/三平台规则）
5. `docs/internal/R1~R5` —— 参考层（事实/流程/技术原理/经验/红线），按需查
6. `outputs/archive/changelog.md` —— 文档变更日志

> 2026-08-21 文档体系重构：15 份 → 9 份（旧文档在 `outputs/archive/docs/` 保留历史）。

## 环境/工具知识（WorkBuddy 使用经验）

- `check-redlines.mjs` 分层输出：①画面层/②口播文案层=硬禁（`video/src` 零命中才算过闸门）；④文档层命中=描述红线规则属正常提示，无需处理；子串匹配会误伤（扣一/100%/进主页），改写措辞重跑
- macOS `~/.Trash` 受 TCC 保护：`ls`/`find` 报 Operation not permitted，但 `mv`/`stat` 可正常访问；移文件入回收站后用 `stat -f "%N"` 验证，勿用 `ls`
- Remotion 渲染必带 `NODE_OPTIONS=""` 前缀（通过 Bash 执行渲染时）

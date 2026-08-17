# 券到卡包 · 内容运营项目（Agent 入口）

> 任何 AI 助手（WorkBuddy / Claude Code / Cursor 等）在本仓库开工前，先读本文件。
> 本文件是「入口卡片」：告诉 AI 去哪读权威信息、守什么硬约束。**权威状态永远在 `docs/` + skill，不在此文件重述。**

## 项目一句话
面向实体店的电子券工具（做券→发券→领券→扫码核销→统计）的内容运营项目，当前做宣传推广线冷启动（抖音/小红书短视频 + 搜狐长文）。

## 开工必读（按序）
1. `docs/工作流指引.md` —— **AI 接手手册**：新会话读它即明确如何开工（行业单元端到端范式）
2. `.workbuddy/skills/quandao-content/SKILL.md` —— **红线/核心模型/SOP 单一权威**（§二 铁律红线 / §五 生产 SOP / §六 风格库）
3. `.workbuddy/memory/MEMORY.md` —— **项目长期记忆**（决策锚 / 进度 / 协作准则）
4. `docs/战略简报.md` —— 用户唯一需读的人话简报（AI 也应了解）

## 权威分层（改一处 · 全量对齐）
- **事实唯一源**：`docs/internal/00-产品事实表.md`
- **SOP 唯一源**：`docs/internal/12-宣传产品工作完整操作流程.md`
- **红线唯一源**：`quandao-content` skill §二（`scripts/redlines.json` 为违禁词机器守卫数据源）
- **记忆（工作日志）**：`.workbuddy/memory/YYYY-MM-DD.md` —— **过程记录，非权威**；决策必须回写权威层，不能只留在记忆

## 硬约束（必守）
- **决策回写权威层**：用户拍板的决策/口径/红线，必须同步写进 `docs/` 或 SKILL，不能只留在 `.workbuddy/memory/`（否则其他 agent 读不到，造成记忆与文档不同步）。
- **改红线/CTA/事实口径后必跑闸门**：`node scripts/check-redlines.mjs`，`video/src` 层零命中才算对齐完成。
- **视频 = 代码 + 数据渲染**（Remotion）：内容在 `video/src/data/`、组件库在 `video/src/components/`+`scenes/`；组件库是原子积木非成品模板，每条视频独立设计、风格轮换（相似度检查 ≥3 维不同）。
- **三平台文章/视频绝口不提微信/小程序/搜索**，导流仅限账号资料位。
- **删除文件/改环境配置前先列清单向用户确认**。

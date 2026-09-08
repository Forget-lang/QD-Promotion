# 爆款文案 AI Agent Skill 3.0

> ⚠️ **已废止（2026-09-08 用户拍板）**：本技能包的「拆零件 RAG 方法」（逐篇拆特征 → 模式挖掘 → 评分器当创作闸门）已被否，不再作为内容生产的作业方法。**985 篇语料（`knowledge/cases.jsonl`）保留为查证库/检索源**——写功能点卡壳、出标题/钩子候选时回语料借结构，不搬话术、不搬数字。现行作业方法见 `SKILL.md`（一条闭环故事讲透一套行业攻略）+ `knowledge/爆款整片解剖.md`（整片解剖 18 条通则）+ `knowledge/洞察库.md`（道理弹药库）。被否原因与决策记 `outputs/archive/changelog.md`。

这是针对你的 985 篇抖音文案语料设计的 Agent Skill 3.0。

## 包含

- `SKILL.md`：核心 Agent 行为规则
- `schemas/`：结构化数据协议
- `scripts/`：本地批处理/知识库生成脚本
- `knowledge/`：首批语料统计与候选模式种子

## 使用方式

1. 把你的 985 篇 Markdown 文案作为 Raw Corpus。
2. 使用 `scripts/build_case_library.py` 生成标准化案例库。
3. 使用你的 LLM Agent 根据 `SKILL.md` 对案例做语义特征抽取。
4. 周期性运行 Pattern Mining，生成 `patterns.json`。
5. 创作时调用 Topic/Hook/Pattern 检索。
6. 发布后把真实指标写入 Feedback Library，形成闭环。

## 重要说明

这个 Skill 本身不是模型参数微调。它把“学习”变成可持久、可检索、可更新的知识系统。

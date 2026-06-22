# 假期去哪儿 · Prompt Builder

> 这不是旅行推荐网站。它不直接推荐目的地，而是根据出发地、旅行时长、偏好和候选目的地池，生成一段适合交给 ChatGPT / DeepSeek 搜索的旅行决策 Prompt。

## 这只是一个 Prompt Builder

它**不是**旅行推荐网站。它不查询酒店价格、不查机票、不做本地推荐。

它只做一件事：根据你的输入和候选目的地 JSON，拼成一段高质量 Prompt。

真正的实时搜索（酒店价格、机票价格、交通耗时、景点信息）交给 **ChatGPT / DeepSeek**。

## 快速启动

```bash
cd apps/holiday-where-to-go
npm install
npm run dev
```

## 如何使用

1. 打开网页，输入出发地和旅行时长
2. 点击「生成 Prompt」
3. 点击「复制到剪贴板」
4. 粘贴到 ChatGPT / DeepSeek
5. LLM 会实时搜索并返回 TOP5 推荐

## 工作流

```txt
用户输入 → buildPrompt.ts → 完整 Prompt → 复制 → ChatGPT/DeepSeek → TOP5 推荐
```

## 候选目的地数据

`src/data/destinations.ts` 中内嵌了 131 个精品民宿候选目的地。

数据源：`annual_boutique_homestay_recommendations.json`

```ts
type CandidateDestination = {
  id: string;
  name: string;
  location: string;
};
```

候选目的地数量只用于控制写入 Prompt 的候选池大小，不代表最终推荐数量。最终 TOP5 由 ChatGPT / DeepSeek 搜索后判断。

默认候选生成方式是**智能筛选**，会根据出发地、旅行时长和偏好做轻量编排。智能筛选不是本地推荐，只是让写入 Prompt 的候选池更符合旅行场景。

还提供**随机探索**模式，从全部候选池中随机抽取目的地，适合换一批灵感。

两种模式下，最终 TOP5 都需要 ChatGPT / DeepSeek 搜索实时价格、交通和游玩信息后判断。本地只做轻量候选编排，不做本地推荐。

## Prompt 生成逻辑

`src/lib/buildPrompt.ts` — `buildWhere2GoPrompt(input)`

生成的 Prompt 包含：
- 用户输入（出发地、天数、假期、偏好）
- 候选目的地列表
- 4 条判断标准（酒店涨幅、机票/交通、交通时间、游玩时间）
- 需要搜索的信息
- 输出格式要求

## 为什么不直接查实时价格？

- 实时酒店 / 机票价格需要 OTA 平台授权
- 未经授权的爬虫有法律和合规风险
- ChatGPT / DeepSeek 已经能联网搜索，让它们做更合适

## 以后可以升级为

- ChatGPT Custom GPT（直接把 Prompt 逻辑做成 GPT Action）
- DeepSeek Workflow（自动执行搜索 + 推荐）
- MCP Tool（被 Claude 等工具直接调用）
- 浏览器插件（在旅游平台页面自动生成 Prompt）

## 版本变更

### V0.2

- 新增 smart / random 两种候选生成方式
- 默认使用 smart，根据出发地、旅行时长和偏好轻量编排候选池
- 保留 random 作为随机探索模式
- 偏好同时影响候选池排序和 Prompt 判断口径
- 候选数量仅控制写入 Prompt 的候选池大小，不代表最终推荐数量
- 最终 TOP5 仍由 ChatGPT / DeepSeek 基于实时搜索结果判断

## 项目结构

```
apps/holiday-where-to-go/
  src/
    App.tsx                           # 主应用
    main.tsx                          # 入口
    index.css                         # Tailwind 样式
    lib/
      types.ts                        # 类型定义
      buildPrompt.ts                  # Prompt 生成核心逻辑
    data/
      destinations.ts                 # 131 个候选目的地
    components/
      PromptBuilderForm.tsx           # 输入表单
      CandidatePreview.tsx            # 候选目的地预览
      PromptPreview.tsx               # Prompt 展示
      CopyButton.tsx                  # 复制 / 下载按钮
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  tsconfig.json
```

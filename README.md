# 假期去哪儿 · Prompt Builder v0.2

**这不是旅行推荐网站。** 它不直接推荐目的地，而是根据出发地、出行日期、偏好和候选目的地池，生成一段适合交给 ChatGPT / DeepSeek 搜索的旅行决策 Prompt。

它只做一件事：根据你的旅行计划和候选目的地，生成一段高质量 Prompt，
你可以直接复制给 **ChatGPT / DeepSeek**，让 LLM 帮你做实时搜索和推荐。

## v0.2 核心变化

- **出行日期上下文**：Prompt 开头明确写入具体日期范围（如 `2026-06-25 至 2026-06-27`），要求 LLM 围绕该日期搜索机票、酒店、天气、拥挤度。
- **强制具体日期搜索**：Prompt 禁用「近期」「假期期间」等模糊表述，要求使用具体日期关键词。
- **候选 ID 稳定性修复**：`loadCandidates` 改为基于索引生成稳定 ID（`d1`, `d2`, `d3`...），多次调用 ID 不变，为后续地图可视化打下基础。
- **地图数据字段预留**：`CandidateDestination` 新增 `province`、`city`、`lat`、`lng` 等地理字段（均为 optional），地图 UI 将在 v0.2.1 实现。

## 快速使用

```bash
cd apps/holiday-where-to-go
npm install
npm run dev
```

打开浏览器访问提示的本地地址（默认 `http://localhost:5173`）。

使用流程：
1. 填写出发地城市
2. 选择出发日期和返程日期
3. （可选）填写假期名称，或留空由系统自动检测
4. 选择候选生成方式、数量、偏好
5. 点击「生成 Prompt」
6. 复制 Prompt 发给 ChatGPT / DeepSeek

## 为什么不做网站 / 爬虫 / 本地评分？

- 实时酒店价格、机票价格、交通耗时 → 交给 **ChatGPT / DeepSeek** 实时搜索
- 本地脚本只负责：**读取用户输入 + 候选目的地 + 判断标准 → 拼成 Prompt**
- 不做 OTA 爬虫，不做 mock 价格

## 数据来源

`src/data/destinations.ts` — 131 个精品民宿/酒店候选目的地。

```ts
{ name: "景德镇弗居人文民宿", location: "江西省景德镇市" }
```

## 项目结构

```
apps/holiday-where-to-go/
├── src/
│   ├── components/       # React 组件
│   │   ├── PromptBuilderForm.tsx   # 用户输入表单
│   │   ├── CandidatePreview.tsx    # 候选列表预览
│   │   └── PromptPreview.tsx       # Prompt 预览/复制
│   ├── data/
│   │   └── destinations.ts  # 131 个候选目的地
│   ├── lib/
│   │   ├── types.ts         # 类型定义
│   │   ├── buildPrompt.ts   # Prompt 构建引擎
│   │   ├── selectCandidates.ts  # 候选筛选逻辑
│   │   └── holidays.ts      # 节假日检测
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## 依赖

- Node.js 18+
- React 18 + TypeScript + Vite + Tailwind CSS

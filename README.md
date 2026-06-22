# 假期去哪儿 · Prompt Builder

**这不是旅行推荐网站。** 它不直接推荐目的地，而是根据出发地、旅行时长、偏好和候选目的地池，生成一段适合交给 ChatGPT / DeepSeek 搜索的旅行决策 Prompt。

它只做一件事：根据你的旅行计划和候选目的地，生成一段高质量 Prompt，
你可以直接复制给 **ChatGPT / DeepSeek**，让 LLM 帮你做实时搜索和推荐。

## 为什么不做网站 / 爬虫 / 本地评分？

- 实时酒店价格、机票价格、交通耗时 → 交给 **ChatGPT / DeepSeek** 实时搜索
- 本地脚本只负责：**读取用户输入 + 候选目的地 + 判断标准 → 拼成 Prompt**
- 不做 OTA 爬虫，不做 mock 价格，不做前端

## 快速使用

```bash
python generate_prompt.py \
  --origin 上海 \
  --trip-days 3 \
  --holiday 端午 \
  --candidates annual_boutique_homestay_recommendations.json \
  --limit 30 \
  --output outputs/generated_prompt.md
```

参数：

| 参数 | 说明 |
|------|------|
| `--origin` | 出发地城市，必填 |
| `--trip-days` | 旅行天数，必填 |
| `--holiday` | 假期名称，默认端午 |
| `--candidates` | 候选目的地 JSON 路径，必填 |
| `--limit` | 纳入 prompt 的目的地数量，默认 30 |
| `--output` | 输出路径，默认 `outputs/generated_prompt.md` |

## 工作流

```
① python generate_prompt.py → outputs/generated_prompt.md
② 把 generated_prompt.md 复制给 ChatGPT / DeepSeek
③ LLM 实时搜索价格、交通、游玩信息
④ LLM 返回 TOP5 推荐（含推荐理由和不推荐名单）
```

## 数据来源

`annual_boutique_homestay_recommendations.json` — 131 个精品民宿/酒店候选目的地。

```json
{"name": "景德镇弗居人文民宿", "location": "江西省景德镇市"}
```

## 依赖

仅需 Python 3.8+，无第三方包依赖。

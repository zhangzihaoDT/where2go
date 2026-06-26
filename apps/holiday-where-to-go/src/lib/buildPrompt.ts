import { CandidateDestination, PromptBuilderInput, PREFERENCE_LABELS, Preference, CandidateSelectionMode } from "./types";

function listCandidates(candidates: CandidateDestination[]): string {
  return candidates
    .map((c, i) => `${i + 1}. ${c.name}｜${c.location}`)
    .join("\n");
}

function renderPreference(pref: string): string {
  return PREFERENCE_LABELS[pref as keyof typeof PREFERENCE_LABELS] || pref;
}

function getTrafficTimeRules(tripDays: number): string[] {
  if (tripDays <= 1) {
    return [
      "单天行程只推荐单程交通时间在 2 小时以内的目的地",
      "不推荐中远程目的地",
    ];
  }
  if (tripDays <= 2) {
    return [
      `${tripDays} 天行程不推荐单程交通时间过长的目的地`,
      "建议优先考虑高铁 3 小时圈内的目的地",
    ];
  }
  if (tripDays <= 3) {
    return [
      `${tripDays} 天行程可以接受中等交通距离`,
      "建议优先考虑高铁 4–5 小时圈或短途飞行可达的目的地",
    ];
  }
  if (tripDays <= 5) {
    return [
      `${tripDays} 天行程可以接受较长交通距离`,
      "国内大部分目的地均可考虑，但建议单程交通时间控制在 6 小时内",
    ];
  }
  return [
    `${tripDays} 天行程适合长途旅行`,
    "可以接受较长的交通时间，包括偏远或边疆目的地",
  ];
}

function getPlayTimeRules(tripDays: number): string[] {
  return [
    `如果目的地核心景点需要 ${tripDays + 2} 天以上才能玩好，不要推荐给 ${tripDays} 天行程`,
  ];
}

function getPreferenceInstruction(preference: Preference, tripDays: number): string {
  switch (preference) {
    case "value":
      return [
        "## 偏好补充说明：性价比优先",
        "",
        "用户本次偏好是「性价比优先」。",
        "",
        "请优先推荐酒店涨幅低、交通价格波动小、整体花费稳定的目的地。",
        "",
        "判断时请更严格看待价格涨幅：",
        "",
        "- 酒店涨幅 ≤25% 的目的地优先进入 TOP5",
        "- 酒店涨幅 25%–50% 的目的地，只有在体验明显更强时才可以推荐",
        "- 酒店涨幅 >50% 的目的地默认不推荐",
        "- 如果一个目的地名气一般，但酒店和交通价格稳定，可以优先推荐",
        "",
      ].join("\n");

    case "comfort": {
      const maxHours = tripDays <= 1 ? 2 : tripDays === 2 ? 4 : tripDays === 3 ? 5 : tripDays <= 5 ? 6 : 7;
      return [
        "## 偏好补充说明：短途舒适优先",
        "",
        "用户本次偏好是「短途舒适优先」。",
        "",
        "请优先推荐交通时间短、换乘少、当地景点集中、行程不赶的目的地。",
        "",
        "判断时请更严格看待交通时间：",
        "",
        `- ${tripDays} 天行程，不推荐单程交通时间超过 ${maxHours} 小时的目的地`,
        "- 如果目的地需要频繁换乘，或景点非常分散，应降低推荐优先级",
        "- 不要为了目的地名气牺牲行程舒适度",
        "",
      ].join("\n");
    }

    case "strong_destination":
      return [
        "## 偏好补充说明：强目的地优先",
        "",
        "用户本次偏好是「强目的地优先」。",
        "",
        "如果目的地本身体验足够强，可以适度接受更高的酒店涨幅，但必须说明为什么值得。",
        "",
        "判断时请注意：",
        "",
        "- 酒店涨幅 ≤25% 仍然是最优",
        "- 酒店涨幅 25%–50% 可以进入 TOP5，但必须说明目的地强在哪里",
        "- 酒店涨幅 >50% 默认不推荐，除非有非常强的旅行理由",
        "- 不能只因为目的地热门就推荐，必须同时考虑交通时间和游玩时间是否适配",
        "",
      ].join("\n");

    case "hidden_gem":
      return [
        "## 偏好补充说明：冷门目的地优先",
        "",
        "用户本次偏好是「冷门目的地优先」。",
        "",
        "请优先挖掘假期涨价不明显、游客密度相对低、但体验完整的目的地。",
        "",
        "判断时请注意：",
        "",
        "- 不要只推荐传统热门旅游城市",
        `- 如果小众目的地酒店涨幅低、交通舒适、${tripDays} 天可消化，应优先推荐`,
        "- 请说明它为什么相对冷门，以及核心体验是什么",
        "- 冷门不等于偏远，如果交通时间过长，仍然需要降级",
        "",
      ].join("\n");
  }
}

function getCandidatePoolNote(mode: CandidateSelectionMode): string {
  if (mode === "random") {
    return [
      "## 候选池说明",
      "",
      "以下候选目的地是从全部清单中随机抽取的，适合探索灵感。",
      "",
      "请注意：随机候选可能包含交通距离过远或旅行时长不适配的目的地。最终 TOP5 需要你基于实时价格、交通时间和游玩时间严格筛选。",
      "",
    ].join("\n");
  }
  return [
    "## 候选池说明",
    "",
    "以下候选目的地不是从全部清单中随机抽取的，而是根据出发地、旅行时长和用户偏好做了轻量编排。",
    "",
    "请注意：这一步不是最终推荐，只是为了让搜索范围更符合本次旅行场景。最终 TOP5 仍需要你基于实时价格、交通时间和游玩时间判断。",
    "",
  ].join("\n");
}

export function buildWhere2GoPrompt(input: PromptBuilderInput): string {
  const { originCity, startDate, endDate, tripDays, holidayName, holidayNames, preference, candidates, selectionMode } = input;

  const nights = tripDays - 1;
  const dateRangeStr = `${startDate} 至 ${endDate}`;

  const holidaySection = holidayNames.length > 0
    ? `本次出行时段覆盖以下节假日：${holidayNames.join("、")}，请在搜索时优先参考该时段的实时价格。`
    : "本次出行时段为普通周末，请在搜索时按常规周末价格估算，非节假日调价。";

  const dateInstruction = [
    "## 重要：日期约束",
    "",
    `本次旅行日期范围：${dateRangeStr}，共 ${tripDays} 天 ${nights} 晚。`,
    "",
    "以下所有搜索和判断（机票价格、酒店价格、天气、交通拥挤度、景点开放状态等）都必须围绕该具体日期范围展开。",
    "",
    "禁止使用「近期」「假期期间」「这段时间」「节假日」等模糊时间表述。",
    "请优先使用具体日期（如 6 月 25 日、6 月 26 日等）进行搜索和表述。",
    "如果某个数据源需要以日期为关键词，请直接使用上述日期范围进行搜索。",
    "",
  ].join("\n");

  return [
    "# 假期去哪儿搜索任务",
    "",
    "你是一个旅行价格与行程分析助手。",
    "",
    "请基于实时搜索结果，帮我从候选目的地中筛选适合出行的 TOP5。",
    "",
    "## 用户输入",
    "",
    `- 出发地：${originCity}`,
    `- 出行日期：${dateRangeStr}`,
    `- 旅行时长：${tripDays} 天 ${nights} 晚`,
    `- ${holidaySection}`,
    `- 偏好：${renderPreference(preference)}`,
    "",
    dateInstruction,
    "## 候选目的地",
    "",
    listCandidates(candidates),
    "",
    getCandidatePoolNote(selectionMode),
    "## 判断标准",
    "",
    "请严格按照以下标准判断：",
    "",
    "### 1. 酒店涨幅",
    "",
    "核心指标是：假期价 / 平日价",
    "",
    "判断规则：",
    `- 假期价 / 平日价 ≤ 1.25：可冲`,
    "- 酒店涨幅 25%–50%：只适合强目的地",
    "- 酒店涨幅 >50%：除非特别想去，否则放弃",
    "",
    "### 2. 机票 / 交通价格",
    "",
    "- 机票往返涨幅 ≤20%：可接受",
    "- 如果高铁 / 自驾更合适，可以不使用机票作为主要判断",
    "- 但必须说明主要交通方式、预计交通耗时和价格变化",
    "",
    "### 3. 交通时间",
    "",
    "推荐目的地必须考虑离出发地的距离。",
    "",
    "请判断：",
    ...getTrafficTimeRules(tripDays).map((r) => `- ${r}`),
    "",
    "### 4. 游玩时间",
    "",
    "必须考虑当地核心景点需要多少时间消化。",
    "",
    "请判断：",
    "- 当地核心景点是否集中",
    `- 是否适合 ${tripDays} 天游玩`,
    ...getPlayTimeRules(tripDays).map((r) => `- ${r}`),
    "- 如果景点太分散，也要降低推荐优先级",
    "",
    getPreferenceInstruction(preference, tripDays),
    "## 请搜索并估算以下信息",
    "",
    `请针对候选目的地逐个检索或估算，所有价格和状态判断都必须基于 ${startDate} 至 ${endDate} 这个具体日期段：`,
    "",
    "- 平日酒店价格",
    `- ${dateRangeStr}期间酒店价格`,
    "- 酒店涨幅",
    "- 平日往返机票价格，如高铁更合适可填无",
    `- ${dateRangeStr}期间往返机票价格，如高铁更合适可填无`,
    "- 机票涨幅",
    "- 最合适交通方式",
    "- 单程交通时间",
    "- 推荐游玩天数",
    "- 核心景点 / 核心体验",
    `- 是否适合本次旅行时长（${tripDays} 天）`,
    "",
    "## 输出格式",
    "",
    "请不要只给泛泛推荐，要给出可决策的 TOP5。",
    "",
    "请按以下格式输出：",
    "",
    "```",
    "## TOP5 推荐",
    "",
    "### 1. 城市｜酒店/民宿名",
    "",
    "- 推荐等级：可冲 / 强目的地可冲 / 谨慎",
    "- 酒店涨幅：",
    "- 机票 / 交通涨幅：",
    "- 推荐交通方式：",
    "- 单程交通时间：",
    "- 推荐游玩天数：",
    "- 核心体验：",
    "- 推荐理由：",
    "",
    "## 不推荐但容易误选的目的地",
    "",
    "请列出 3–5 个，并说明为什么不推荐。",
    "",
    "## 数据不足说明",
    "",
    "如果某些目的地缺少价格或交通信息，请说明，不要假装数据准确。",
    "```",
    "",
  ].join("\n");
}

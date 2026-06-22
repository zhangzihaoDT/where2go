#!/usr/bin/env python3
"""
generate_prompt.py — 假期去哪儿 Prompt Builder

根据用户输入的出发地、旅行时长、假期类型，结合候选目的地 JSON，
生成一段可直接复制给 ChatGPT / DeepSeek 的搜索 Prompt。

Usage:
  python generate_prompt.py \
    --origin 上海 \
    --trip-days 3 \
    --holiday 端午 \
    --candidates annual_boutique_homestay_recommendations.json \
    --limit 30 \
    --output outputs/generated_prompt.md
"""

import argparse
import json
import math
import os
import random

# ── Smart Selection Logic ──

ORIGIN_PROFILES = {
    "上海": {"near": ["上海", "江苏", "浙江", "安徽"], "mid": ["江西", "福建", "山东", "河南", "湖北"], "far": ["广东", "湖南", "陕西", "重庆", "四川", "贵州", "广西"], "veryFar": ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"]},
    "北京": {"near": ["北京", "天津", "河北", "山东", "山西", "内蒙古"], "mid": ["河南", "辽宁", "陕西", "江苏", "安徽"], "far": ["浙江", "湖北", "湖南", "四川", "重庆", "广东", "福建"], "veryFar": ["云南", "新疆", "西藏", "青海", "甘肃", "黑龙江", "吉林", "广西", "贵州"]},
    "广州": {"near": ["广东", "广西", "福建", "湖南"], "mid": ["江西", "贵州", "海南", "云南"], "far": ["浙江", "江苏", "安徽", "湖北", "四川", "重庆", "河南"], "veryFar": ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"]},
    "深圳": {"near": ["广东", "广西", "福建", "湖南"], "mid": ["江西", "贵州", "海南", "云南"], "far": ["浙江", "江苏", "安徽", "湖北", "四川", "重庆", "河南"], "veryFar": ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"]},
    "杭州": {"near": ["浙江", "上海", "江苏", "安徽", "江西"], "mid": ["福建", "山东", "河南", "湖北", "湖南"], "far": ["广东", "陕西", "重庆", "四川", "贵州", "广西"], "veryFar": ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"]},
    "成都": {"near": ["四川", "重庆", "贵州", "陕西"], "mid": ["云南", "湖北", "湖南", "广西", "甘肃"], "far": ["广东", "浙江", "江苏", "安徽", "福建", "河南", "江西"], "veryFar": ["新疆", "西藏", "青海", "吉林", "黑龙江", "内蒙古", "辽宁"]},
    "西安": {"near": ["陕西", "四川", "重庆", "河南", "山西", "甘肃"], "mid": ["湖北", "湖南", "贵州", "安徽", "江苏"], "far": ["浙江", "广东", "福建", "江西", "山东", "云南"], "veryFar": ["新疆", "西藏", "青海", "吉林", "黑龙江", "内蒙古", "辽宁"]},
    "武汉": {"near": ["湖北", "湖南", "河南", "江西", "安徽"], "mid": ["江苏", "浙江", "福建", "广东", "重庆", "陕西"], "far": ["四川", "贵州", "广西", "山东", "山西", "云南"], "veryFar": ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"]},
    "南京": {"near": ["江苏", "浙江", "上海", "安徽", "江西"], "mid": ["福建", "山东", "河南", "湖北", "湖南"], "far": ["广东", "陕西", "重庆", "四川", "贵州"], "veryFar": ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"]},
}

DEFAULT_PROFILE = {"near": [], "mid": [], "far": [], "veryFar": ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"]}

HOT_DESTINATIONS = ["大理", "丽江", "香格里拉", "杭州", "苏州", "成都", "西安", "拉萨", "西双版纳", "长白山"]
STRONG_DESTINATIONS = ["大理", "丽江", "香格里拉", "黄山", "张家界", "阿坝", "伊犁", "西双版纳", "长白山", "敦煌", "拉萨", "庐山", "泉州", "景德镇"]
REMOTE_KEYWORDS = ["阿坝", "伊犁", "香格里拉", "迪庆", "怒江", "日喀则", "拉萨", "西藏", "青海", "长白山"]
HIDDEN_GEM_KEYWORDS = ["台州", "丽水", "衢州", "景德镇", "黔东南", "安康", "咸宁", "萍乡", "日照", "南平", "宁德", "随州", "汉中", "商洛", "金华", "湖州"]


def _get_province(location: str) -> str:
    known = [("北京",), ("上海",), ("天津",), ("重庆",)]
    for full in ["新疆维吾尔自治区", "广西壮族自治区", "内蒙古自治区", "宁夏回族自治区", "西藏自治区"]:
        if location.startswith(full):
            return full
    for k in ["北京", "上海", "天津", "重庆"]:
        if location.startswith(k):
            return k
    for p in ["广东", "浙江", "江苏", "福建", "云南", "四川", "贵州", "陕西", "安徽",
              "江西", "湖南", "湖北", "河南", "山东", "山西", "河北", "辽宁", "吉林",
              "黑龙江", "甘肃", "青海", "海南", "西藏", "新疆", "广西", "内蒙古", "宁夏"]:
        if location.startswith(p):
            return p
    return location


def _get_city(location: str) -> str:
    import re
    rest = re.sub(r"^(新疆维吾尔自治区|广西壮族自治区|内蒙古自治区|宁夏回族自治区|西藏自治区)", "", location).strip()
    m = re.search(r"([^省]+?(?:市|州|区|县))", rest)
    return m.group(1) if m else rest


def _get_tier(province: str, origin: str) -> str:
    profile = ORIGIN_PROFILES.get(origin, DEFAULT_PROFILE)
    for tier, provinces in profile.items():
        if any(province.startswith(p) for p in provinces):
            return tier
    return "veryFar"


def _score_candidate(candidate: dict, origin: str, trip_days: int, preference: str) -> int:
    loc = candidate.get("location", "")
    province = _get_province(loc)
    city = _get_city(loc)
    tier = _get_tier(province, origin)
    score = 0

    if trip_days <= 2:
        if tier == "near": score += 40
        elif tier == "mid": score += 10
        elif tier == "far": score -= 30
        else: score -= 80
    elif trip_days <= 3:
        if tier == "near": score += 30
        elif tier == "mid": score += 25
        elif tier == "far": score -= 5
        else: score -= 50
    else:
        if tier == "near": score += 15
        elif tier == "mid": score += 25
        elif tier == "far": score += 20
        else: score -= 10

    if preference == "value":
        if tier in ("near", "mid"): score += 20
        if city in HOT_DESTINATIONS: score -= 15
        if tier == "veryFar": score -= 20
        if city in HIDDEN_GEM_KEYWORDS: score += 10
    elif preference == "comfort":
        if tier == "near": score += 35
        elif tier == "mid": score += 10
        elif tier == "far": score -= 35
        else: score -= 80
        if any(k in loc for k in REMOTE_KEYWORDS): score -= 20
    elif preference == "strong_destination":
        if city in STRONG_DESTINATIONS: score += 35
        if tier == "far": score += 10
        if tier == "veryFar": score += 5
    elif preference == "hidden_gem":
        if city in HOT_DESTINATIONS: score -= 30
        if city in HIDDEN_GEM_KEYWORDS: score += 30
        if tier in ("near", "mid"): score += 10
        if tier == "veryFar": score -= 20

    return score


def _apply_diversity(sorted_candidates: list[dict], limit: int) -> list[dict]:
    max_per_province = max(4, math.ceil(limit * 0.25))
    max_per_city = 2
    province_count: dict[str, int] = {}
    city_count: dict[str, int] = {}
    result: list[dict] = []

    for c in sorted_candidates:
        province = _get_province(c.get("location", ""))
        city = _get_city(c.get("location", ""))
        if province_count.get(province, 0) >= max_per_province:
            continue
        if city_count.get(city, 0) >= max_per_city:
            continue
        province_count[province] = province_count.get(province, 0) + 1
        city_count[city] = city_count.get(city, 0) + 1
        result.append(c)
        if len(result) >= limit:
            break

    if len(result) < limit:
        seen_ids = {id(c) for c in result}
        for c in sorted_candidates:
            if id(c) in seen_ids:
                continue
            result.append(c)
            if len(result) >= limit:
                break

    return result


def select_candidates(candidates: list[dict], origin: str, trip_days: int, preference: str, limit: int, mode: str = "smart") -> list[dict]:
    if mode == "random":
        shuffled = list(candidates)
        random.shuffle(shuffled)
        return shuffled[:min(limit, len(shuffled))]

    scored = [(c, _score_candidate(c, origin, trip_days, preference)) for c in candidates]
    scored.sort(key=lambda x: -x[1])
    sorted_candidates = [s[0] for s in scored]
    return _apply_diversity(sorted_candidates, min(limit, len(sorted_candidates)))


def load_candidates(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


PREFERENCE_LABELS = {
    "value": "性价比优先",
    "comfort": "短途舒适优先",
    "strong_destination": "强目的地优先",
    "hidden_gem": "冷门目的地优先",
}

def _get_traffic_time_rules(trip_days: int) -> list[str]:
    if trip_days <= 1:
        return [
            "单天行程只推荐单程交通时间在 2 小时以内的目的地",
            "不推荐中远程目的地",
        ]
    if trip_days <= 2:
        return [
            f"{trip_days} 天行程不推荐单程交通时间过长的目的地",
            "建议优先考虑高铁 3 小时圈内的目的地",
        ]
    if trip_days <= 3:
        return [
            f"{trip_days} 天行程可以接受中等交通距离",
            "建议优先考虑高铁 4–5 小时圈或短途飞行可达的目的地",
        ]
    if trip_days <= 5:
        return [
            f"{trip_days} 天行程可以接受较长交通距离",
            "国内大部分目的地均可考虑，但建议单程交通时间控制在 6 小时内",
        ]
    return [
        f"{trip_days} 天行程适合长途旅行",
        "可以接受较长的交通时间，包括偏远或边疆目的地",
    ]


def _get_play_time_rules(trip_days: int) -> list[str]:
    return [
        f"如果目的地核心景点需要 {trip_days + 2} 天以上才能玩好，不要推荐给 {trip_days} 天行程",
    ]


def _get_preference_instruction(preference: str, trip_days: int) -> str:
    if preference == "value":
        return (
            "## 偏好补充说明：性价比优先\n"
            "\n"
            "用户本次偏好是「性价比优先」。\n"
            "\n"
            "请优先推荐酒店涨幅低、交通价格波动小、整体花费稳定的目的地。\n"
            "\n"
            "判断时请更严格看待价格涨幅：\n"
            "\n"
            "- 酒店涨幅 ≤25% 的目的地优先进入 TOP5\n"
            "- 酒店涨幅 25%–50% 的目的地，只有在体验明显更强时才可以推荐\n"
            "- 酒店涨幅 >50% 的目的地默认不推荐\n"
            "- 如果一个目的地名气一般，但酒店和交通价格稳定，可以优先推荐\n"
        )

    if preference == "comfort":
        max_hours = 2 if trip_days <= 1 else 4 if trip_days == 2 else 5 if trip_days == 3 else 6 if trip_days <= 5 else 7
        return (
            "## 偏好补充说明：短途舒适优先\n"
            "\n"
            "用户本次偏好是「短途舒适优先」。\n"
            "\n"
            "请优先推荐交通时间短、换乘少、当地景点集中、行程不赶的目的地。\n"
            "\n"
            "判断时请更严格看待交通时间：\n"
            "\n"
            f"- {trip_days} 天行程，不推荐单程交通时间超过 {max_hours} 小时的目的地\n"
            "- 如果目的地需要频繁换乘，或景点非常分散，应降低推荐优先级\n"
            "- 不要为了目的地名气牺牲行程舒适度\n"
        )

    if preference == "strong_destination":
        return (
            "## 偏好补充说明：强目的地优先\n"
            "\n"
            "用户本次偏好是「强目的地优先」。\n"
            "\n"
            "如果目的地本身体验足够强，可以适度接受更高的酒店涨幅，但必须说明为什么值得。\n"
            "\n"
            "判断时请注意：\n"
            "\n"
            "- 酒店涨幅 ≤25% 仍然是最优\n"
            "- 酒店涨幅 25%–50% 可以进入 TOP5，但必须说明目的地强在哪里\n"
            "- 酒店涨幅 >50% 默认不推荐，除非有非常强的旅行理由\n"
            "- 不能只因为目的地热门就推荐，必须同时考虑交通时间和游玩时间是否适配\n"
        )

    if preference == "hidden_gem":
        return (
            "## 偏好补充说明：冷门目的地优先\n"
            "\n"
            "用户本次偏好是「冷门目的地优先」。\n"
            "\n"
            "请优先挖掘假期涨价不明显、游客密度相对低、但体验完整的目的地。\n"
            "\n"
            "判断时请注意：\n"
            "\n"
            "- 不要只推荐传统热门旅游城市\n"
            f"- 如果小众目的地酒店涨幅低、交通舒适、{trip_days} 天可消化，应优先推荐\n"
            "- 请说明它为什么相对冷门，以及核心体验是什么\n"
            "- 冷门不等于偏远，如果交通时间过长，仍然需要降级\n"
        )

    return ""


def build_prompt(
    origin: str,
    trip_days: int,
    holiday: str,
    preference: str,
    candidates: list[dict],
    selection_mode: str = "smart",
) -> str:
    lines: list[str] = []

    # ── Title ──
    lines.append(f"# 假期去哪儿：{origin}出发 {trip_days}天 · {holiday}出行推荐\n")

    # ── User Input ──
    lines.append("## 用户输入\n")
    lines.append(f"- 出发地：{origin}")
    lines.append(f"- 旅行时长：{trip_days} 天")
    lines.append(f"- 假期类型：{holiday}")
    lines.append(f"- 偏好：{PREFERENCE_LABELS.get(preference, preference)}")
    lines.append("")

    # ── Candidate Destinations ──
    lines.append(f"## 候选目的地（共 {len(candidates)} 个）\n")
    lines.append("请搜索以下每个候选目的地的价格、交通、游玩信息：\n")

    for i, dest in enumerate(candidates, 1):
        name = dest.get("name", "未知")
        location = dest.get("location", "")
        lines.append(f"{i}. {name}｜{location}")

    lines.append("")

    # ── Candidate Pool Note ──
    if selection_mode == "random":
        lines.append("## 候选池说明\n")
        lines.append("以下候选目的地是从全部清单中随机抽取的，适合探索灵感。\n")
        lines.append("请注意：随机候选可能包含交通距离过远或旅行时长不适配的目的地。最终 TOP5 需要你基于实时价格、交通时间和游玩时间严格筛选。\n")
    else:
        lines.append("## 候选池说明\n")
        lines.append("以下候选目的地不是从全部清单中随机抽取的，而是根据出发地、旅行时长和用户偏好做了轻量编排。\n")
        lines.append("请注意：这一步不是最终推荐，只是为了让搜索范围更符合本次旅行场景。最终 TOP5 仍需要你基于实时价格、交通时间和游玩时间判断。\n")

    # ── Judgment Criteria ──
    lines.append("## 判断标准\n")
    lines.append("请基于实时搜索结果，筛选 TOP5 适合假期出行的目的地。\n")
    lines.append("判断标准：\n")

    lines.append("### 1. 酒店涨幅")
    lines.append("")
    lines.append(f"- {holiday}价 / 平日价 ≤ 1.25：可冲")
    lines.append("- 酒店涨幅 25%–50%：只适合强目的地")
    lines.append("- 酒店涨幅 >50%：除非特别想去，否则放弃")
    lines.append("")

    lines.append("### 2. 机票 / 交通价格")
    lines.append("")
    lines.append("- 机票往返涨幅 ≤20%：可接受")
    lines.append("- 如果高铁 / 自驾更合适，可以不使用机票作为主要判断")
    lines.append("- 但必须说明主要交通方式和预计交通耗时")
    lines.append("")

    lines.append("### 3. 交通时间")
    lines.append("")
    lines.append("- 推荐目的地必须考虑离出发地的距离")
    for rule in _get_traffic_time_rules(trip_days):
        lines.append(f"- {rule}")
    lines.append("")

    lines.append("### 4. 游玩时间")
    lines.append("")
    lines.append("- 必须考虑当地核心景点需要多少时间消化")
    for rule in _get_play_time_rules(trip_days):
        lines.append(f"- {rule}")
    lines.append("- 如果景点太分散，也要降低推荐优先级")
    lines.append("")

    # ── Preference Instruction ──
    lines.append(_get_preference_instruction(preference, trip_days))

    # ── Required Information ──
    lines.append("## 需要搜索的信息\n")
    lines.append("请对每个候选目的地搜索并估算：\n")
    lines.append("- 平日酒店价格")
    lines.append(f"- {holiday}酒店价格")
    lines.append("- 酒店涨幅")
    lines.append("- 平日往返机票价格（如高铁更合适可填无）")
    lines.append(f"- {holiday}往返机票价格（如高铁更合适可填无）")
    lines.append("- 机票涨幅")
    lines.append("- 最合适交通方式")
    lines.append("- 单程交通时间")
    lines.append("- 推荐游玩天数")
    lines.append("- 核心景点 / 核心体验")
    lines.append("- 是否适合本次旅行时长")
    lines.append("")

    # ── Output Format ──
    lines.append("## 输出格式\n")
    lines.append("请输出 TOP5 推荐，格式如下：\n")
    lines.append("```")
    lines.append("## TOP5 推荐")
    lines.append("")
    lines.append("### 1. 城市｜酒店/民宿名")
    lines.append("")
    lines.append("- 推荐等级：可冲 / 强目的地可冲 / 谨慎")
    lines.append("- 酒店涨幅：")
    lines.append("- 机票 / 交通涨幅：")
    lines.append("- 推荐交通方式：")
    lines.append("- 单程交通时间：")
    lines.append("- 推荐游玩天数：")
    lines.append("- 核心体验：")
    lines.append("- 推荐理由：")
    lines.append("")
    lines.append("## 不推荐但容易误选的目的地")
    lines.append("")
    lines.append("列出 3–5 个，并说明为什么不推荐。")
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="假期去哪儿 Prompt Builder — 生成 LLM 搜索 Prompt"
    )
    parser.add_argument(
        "--origin",
        required=True,
        help="出发地城市，如 上海",
    )
    parser.add_argument(
        "--trip-days",
        type=int,
        required=True,
        help="旅行天数，如 3",
    )
    parser.add_argument(
        "--holiday",
        default="端午",
        help="假期名称，默认端午",
    )
    parser.add_argument(
        "--preference",
        default="value",
        choices=["value", "comfort", "strong_destination", "hidden_gem"],
        help="推荐偏好：value/comfort/strong_destination/hidden_gem，默认 value",
    )
    parser.add_argument(
        "--mode",
        default="smart",
        choices=["smart", "random"],
        help="候选生成方式：smart（智能编排）/ random（随机探索），默认 smart",
    )
    parser.add_argument(
        "--candidates",
        required=True,
        help="候选目的地 JSON 文件路径",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=30,
        help="本次纳入 Prompt 的候选目的地数量，默认 30",
    )
    parser.add_argument(
        "--output",
        default="outputs/generated_prompt.md",
        help="生成的 Prompt 文件路径，默认 outputs/generated_prompt.md",
    )
    args = parser.parse_args()

    all_candidates = load_candidates(args.candidates)

    selected = select_candidates(
        candidates=all_candidates,
        origin=args.origin,
        trip_days=args.trip_days,
        preference=args.preference,
        limit=args.limit,
        mode=args.mode,
    )

    prompt = build_prompt(
        origin=args.origin,
        trip_days=args.trip_days,
        holiday=args.holiday,
        preference=args.preference,
        candidates=selected,
        selection_mode=args.mode,
    )

    os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(prompt)

    pref_label = PREFERENCE_LABELS.get(args.preference, args.preference)
    mode_label = "智能编排" if args.mode == "smart" else "随机探索"
    print(f"✅ Prompt 已生成 → {args.output}")
    print(f"   共 {len(selected)} 个候选目的地")
    print(f"   出发地：{args.origin} ｜ {args.trip_days}天 ｜ {args.holiday} ｜ {pref_label} ｜ {mode_label}")


if __name__ == "__main__":
    main()

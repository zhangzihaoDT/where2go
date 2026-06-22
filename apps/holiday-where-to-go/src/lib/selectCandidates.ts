import { CandidateDestination, Preference, CandidateSelectionMode } from "../lib/types";

const ORIGIN_PROFILES: Record<string, { near: string[]; mid: string[]; far: string[]; veryFar: string[] }> = {
  上海: {
    near: ["上海", "江苏", "浙江", "安徽"],
    mid: ["江西", "福建", "山东", "河南", "湖北"],
    far: ["广东", "湖南", "陕西", "重庆", "四川", "贵州", "广西"],
    veryFar: ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"],
  },
  北京: {
    near: ["北京", "天津", "河北", "山东", "山西", "内蒙古"],
    mid: ["河南", "辽宁", "陕西", "江苏", "安徽"],
    far: ["浙江", "湖北", "湖南", "四川", "重庆", "广东", "福建"],
    veryFar: ["云南", "新疆", "西藏", "青海", "甘肃", "黑龙江", "吉林", "广西", "贵州"],
  },
  广州: {
    near: ["广东", "广西", "福建", "湖南"],
    mid: ["江西", "贵州", "海南", "云南"],
    far: ["浙江", "江苏", "安徽", "湖北", "四川", "重庆", "河南"],
    veryFar: ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"],
  },
  深圳: {
    near: ["广东", "广西", "福建", "湖南"],
    mid: ["江西", "贵州", "海南", "云南"],
    far: ["浙江", "江苏", "安徽", "湖北", "四川", "重庆", "河南"],
    veryFar: ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"],
  },
  杭州: {
    near: ["浙江", "上海", "江苏", "安徽", "江西"],
    mid: ["福建", "山东", "河南", "湖北", "湖南"],
    far: ["广东", "陕西", "重庆", "四川", "贵州", "广西"],
    veryFar: ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"],
  },
  成都: {
    near: ["四川", "重庆", "贵州", "陕西"],
    mid: ["云南", "湖北", "湖南", "广西", "甘肃"],
    far: ["广东", "浙江", "江苏", "安徽", "福建", "河南", "江西"],
    veryFar: ["新疆", "西藏", "青海", "吉林", "黑龙江", "内蒙古", "辽宁"],
  },
  西安: {
    near: ["陕西", "四川", "重庆", "河南", "山西", "甘肃"],
    mid: ["湖北", "湖南", "贵州", "安徽", "江苏"],
    far: ["浙江", "广东", "福建", "江西", "山东", "云南"],
    veryFar: ["新疆", "西藏", "青海", "吉林", "黑龙江", "内蒙古", "辽宁"],
  },
  武汉: {
    near: ["湖北", "湖南", "河南", "江西", "安徽"],
    mid: ["江苏", "浙江", "福建", "广东", "重庆", "陕西"],
    far: ["四川", "贵州", "广西", "山东", "山西", "云南"],
    veryFar: ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古", "辽宁"],
  },
  南京: {
    near: ["江苏", "浙江", "上海", "安徽", "江西"],
    mid: ["福建", "山东", "河南", "湖北", "湖南"],
    far: ["广东", "陕西", "重庆", "四川", "贵州"],
    veryFar: ["云南", "新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"],
  },
};

const DEFAULT_PROFILE = {
  near: [] as string[],
  mid: [] as string[],
  far: [] as string[],
  veryFar: ["新疆", "西藏", "青海", "甘肃", "吉林", "黑龙江", "内蒙古"],
};

const HOT_DESTINATIONS = ["大理", "丽江", "香格里拉", "杭州", "苏州", "成都", "西安", "拉萨", "西双版纳", "长白山"];

const STRONG_DESTINATIONS = ["大理", "丽江", "香格里拉", "黄山", "张家界", "阿坝", "伊犁", "西双版纳", "长白山", "敦煌", "拉萨", "庐山", "泉州", "景德镇"];

const REMOTE_KEYWORDS = ["阿坝", "伊犁", "香格里拉", "迪庆", "怒江", "日喀则", "拉萨", "西藏", "青海", "长白山"];

const HIDDEN_GEM_KEYWORDS = ["台州", "丽水", "衢州", "景德镇", "黔东南", "安康", "咸宁", "萍乡", "日照", "南平", "宁德", "随州", "汉中", "商洛", "金华", "湖州"];

type DistanceTier = "near" | "mid" | "far" | "veryFar";

function getProfile(originCity: string) {
  return ORIGIN_PROFILES[originCity] || DEFAULT_PROFILE;
}

function getProvince(location: string): string {
  const known: [string, string][] = [
    ["新疆维吾尔自治区", "新疆"], ["广西壮族自治区", "广西"],
    ["内蒙古自治区", "内蒙古"], ["宁夏回族自治区", "宁夏"],
    ["西藏自治区", "西藏"],
    ["北京", "北京"], ["上海", "上海"], ["天津", "天津"], ["重庆", "重庆"],
  ];
  for (const [full, _] of known) {
    if (location.startsWith(full)) return full;
  }
  for (const p of ["广东", "浙江", "江苏", "福建", "云南", "四川", "贵州", "陕西", "安徽",
    "江西", "湖南", "湖北", "河南", "山东", "山西", "河北", "辽宁", "吉林", "黑龙江",
    "甘肃", "青海", "海南", "西藏", "新疆", "广西", "内蒙古", "宁夏"]) {
    if (location.startsWith(p)) return p;
  }
  return location;
}

function getCity(location: string): string {
  const parts = location.replace(/^(新疆维吾尔自治区|广西壮族自治区|内蒙古自治区|宁夏回族自治区|西藏自治区)/, "").trim();
  const match = parts.match(/([^省]+?(?:市|州|区|县))/);
  return match ? match[1] : parts;
}

function getDistanceTier(province: string, originCity: string): DistanceTier {
  const profile = getProfile(originCity);
  for (const [tier, list] of Object.entries(profile) as [string, string[]][]) {
    if (list.some((p) => province.startsWith(p))) {
      return tier as DistanceTier;
    }
  }
  return "veryFar";
}

function scoreCandidate(
  candidate: CandidateDestination,
  originCity: string,
  tripDays: number,
  preference: Preference
): number {
  const province = getProvince(candidate.location);
  const city = getCity(candidate.location);
  const tier = getDistanceTier(province, originCity);

  let score = 0;

  // Distance by trip days
  if (tripDays <= 2) {
    if (tier === "near") score += 40;
    else if (tier === "mid") score += 10;
    else if (tier === "far") score -= 30;
    else score -= 80;
  } else if (tripDays <= 3) {
    if (tier === "near") score += 30;
    else if (tier === "mid") score += 25;
    else if (tier === "far") score -= 5;
    else score -= 50;
  } else {
    if (tier === "near") score += 15;
    else if (tier === "mid") score += 25;
    else if (tier === "far") score += 20;
    else score -= 10;
  }

  // Preference scoring
  if (preference === "value") {
    if (tier === "near" || tier === "mid") score += 20;
    if (HOT_DESTINATIONS.includes(city)) score -= 15;
    if (tier === "veryFar") score -= 20;
    if (HIDDEN_GEM_KEYWORDS.includes(city)) score += 10;
  }

  if (preference === "comfort") {
    if (tier === "near") score += 35;
    else if (tier === "mid") score += 10;
    else if (tier === "far") score -= 35;
    else score -= 80;
    if (REMOTE_KEYWORDS.some((k) => candidate.location.includes(k))) score -= 20;
  }

  if (preference === "strong_destination") {
    if (STRONG_DESTINATIONS.includes(city)) score += 35;
    if (tier === "far") score += 10;
    if (tier === "veryFar") score += 5;
  }

  if (preference === "hidden_gem") {
    if (HOT_DESTINATIONS.includes(city)) score -= 30;
    if (HIDDEN_GEM_KEYWORDS.includes(city)) score += 30;
    if (tier === "near" || tier === "mid") score += 10;
    if (tier === "veryFar") score -= 20;
  }

  return score;
}

function applyDiversity(
  sorted: CandidateDestination[],
  limit: number
): CandidateDestination[] {
  const maxPerProvince = Math.max(4, Math.ceil(limit * 0.25));
  const maxPerCity = 2;

  const provinceCount = new Map<string, number>();
  const cityCount = new Map<string, number>();
  const result: CandidateDestination[] = [];

  for (const c of sorted) {
    const province = getProvince(c.location);
    const city = getCity(c.location);

    if ((provinceCount.get(province) || 0) >= maxPerProvince) continue;
    if ((cityCount.get(city) || 0) >= maxPerCity) continue;

    provinceCount.set(province, (provinceCount.get(province) || 0) + 1);
    cityCount.set(city, (cityCount.get(city) || 0) + 1);
    result.push(c);

    if (result.length >= limit) break;
  }

  // If insufficient, fill with remaining sorted candidates ignoring diversity caps
  if (result.length < limit) {
    const usedIds = new Set(result.map((c) => c.id));
    for (const c of sorted) {
      if (usedIds.has(c.id)) continue;
      result.push(c);
      if (result.length >= limit) break;
    }
  }

  return result;
}

export type SelectCandidatesInput = {
  candidates: CandidateDestination[];
  originCity: string;
  tripDays: number;
  preference: Preference;
  limit: number;
  mode?: CandidateSelectionMode;
};

export function selectCandidates(input: SelectCandidatesInput): CandidateDestination[] {
  const { candidates, originCity, tripDays, preference, limit, mode = "smart" } = input;

  if (mode === "random") {
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  }

  const scored = candidates.map((c) => ({
    candidate: c,
    score: scoreCandidate(c, originCity, tripDays, preference),
  }));

  scored.sort((a, b) => b.score - a.score);

  const sorted = scored.map((s) => s.candidate);
  return applyDiversity(sorted, Math.min(limit, sorted.length));
}

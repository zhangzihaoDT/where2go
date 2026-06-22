import { Preference, CandidateSelectionMode } from "../lib/types";

const TRIP_OPTIONS = [2, 3, 4, 5];
const LIMIT_OPTIONS = [10, 20, 30, 50];
const HOLIDAY_OPTIONS = ["端午", "五一", "国庆", "中秋", "春节"];
const PREFERENCE_OPTIONS: { value: Preference; label: string }[] = [
  { value: "value", label: "性价比优先" },
  { value: "comfort", label: "短途舒适优先" },
  { value: "strong_destination", label: "强目的地优先" },
  { value: "hidden_gem", label: "冷门目的地优先" },
];

export function PromptBuilderForm({
  originCity,
  setOriginCity,
  tripDays,
  setTripDays,
  holidayName,
  setHolidayName,
  candidateLimit,
  setCandidateLimit,
  preference,
  setPreference,
  selectionMode,
  setSelectionMode,
  onGenerate,
}: {
  originCity: string;
  setOriginCity: (v: string) => void;
  tripDays: number;
  setTripDays: (v: number) => void;
  holidayName: string;
  setHolidayName: (v: string) => void;
  candidateLimit: number;
  setCandidateLimit: (v: number) => void;
  preference: Preference;
  setPreference: (v: Preference) => void;
  selectionMode: CandidateSelectionMode;
  setSelectionMode: (v: CandidateSelectionMode) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">出发地城市</label>
        <input
          type="text"
          value={originCity}
          onChange={e => setOriginCity(e.target.value)}
          placeholder="例如：上海"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">旅行时长</label>
        <div className="flex gap-1">
          {TRIP_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setTripDays(d)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tripDays === d
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {d}天
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">假期类型</label>
        <div className="flex flex-wrap gap-1">
          {HOLIDAY_OPTIONS.map(h => (
            <button
              key={h}
              onClick={() => setHolidayName(h)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                holidayName === h
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">候选生成方式</label>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectionMode("smart")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectionMode === "smart"
                ? "bg-blue-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            智能筛选
          </button>
          <button
            onClick={() => setSelectionMode("random")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectionMode === "random"
                ? "bg-blue-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            随机探索
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {selectionMode === "smart"
            ? "根据出发地、旅行时长和偏好做轻量编排"
            : "从全部候选池中随机抽取，适合换一批灵感"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">纳入 Prompt 的候选数量</label>
        <div className="flex gap-1">
          {LIMIT_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setCandidateLimit(n)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                candidateLimit === n
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {n}个
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">推荐偏好</label>
        <div className="grid grid-cols-2 gap-1">
          {PREFERENCE_OPTIONS.map(p => (
            <button
              key={p.value}
              onClick={() => setPreference(p.value)}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                preference === p.value
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!originCity.trim()}
        className="w-full bg-blue-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        生成 Prompt
      </button>
    </div>
  );
}

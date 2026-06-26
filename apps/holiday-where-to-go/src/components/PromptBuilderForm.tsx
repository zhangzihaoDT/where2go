import { Preference, CandidateSelectionMode } from "../lib/types";
import { computeTripDays, detectHolidays, formatHolidayLabel } from "../lib/holidays";

const LIMIT_OPTIONS = [10, 20, 30, 50];
const PREFERENCE_OPTIONS: { value: Preference; label: string }[] = [
  { value: "value", label: "性价比优先" },
  { value: "comfort", label: "短途舒适优先" },
  { value: "strong_destination", label: "强目的地优先" },
  { value: "hidden_gem", label: "冷门目的地优先" },
];

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        backgroundColor: active ? "#174A7C" : "#F0F4F8",
        color: active ? "white" : "#4A5A6A",
        boxShadow: active ? "0 1px 3px rgba(23, 74, 124, 0.2)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export function PromptBuilderForm({
  originCity,
  setOriginCity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
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
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
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
  const tripDays = startDate && endDate ? computeTripDays(startDate, endDate) : 0;
  const detected = startDate && endDate ? detectHolidays(startDate, endDate) : [];
  const label = formatHolidayLabel(detected);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>出发地城市</label>
        <input
          type="text"
          value={originCity}
          onChange={e => setOriginCity(e.target.value)}
          placeholder="例如：上海"
          className="zh-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>出行日期</label>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setHolidayName(""); }}
            className="zh-input flex-1 w-full"
          />
          <span className="text-sm" style={{ color: "#8A9AA8" }}>至</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={e => { setEndDate(e.target.value); setHolidayName(""); }}
            className="zh-input flex-1 w-full"
          />
        </div>
        {tripDays > 0 ? (
          <div className="mt-2 flex gap-3 text-xs">
            <span style={{ color: "#174A7C", fontWeight: 500 }}>共 {tripDays} 天 {tripDays - 1} 晚</span>
            <span style={{ color: "#D79A36", fontWeight: 500 }}>{label}</span>
          </div>
        ) : startDate && endDate && new Date(endDate) < new Date(startDate) ? (
          <p className="text-xs mt-1" style={{ color: "#D79A36" }}>返程日期不能早于出发日期</p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "#8A9AA8" }}>请选择出发和返程日期</p>
        )}
      </div>

      {tripDays > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>
            假期名称 <span className="text-xs" style={{ color: "#8A9AA8" }}>（可选，留空则自动检测）</span>
          </label>
          <input
            type="text"
            value={holidayName}
            onChange={e => setHolidayName(e.target.value)}
            placeholder={label || "例如：端午"}
            className="zh-input w-full"
          />
          {!holidayName && label && (
            <p className="text-xs mt-1" style={{ color: "#8A9AA8" }}>自动检测：{label}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>候选生成方式</label>
        <div className="flex gap-1">
          <ToggleBtn active={selectionMode === "smart"} onClick={() => setSelectionMode("smart")}>
            智能筛选
          </ToggleBtn>
          <ToggleBtn active={selectionMode === "random"} onClick={() => setSelectionMode("random")}>
            随机探索
          </ToggleBtn>
        </div>
        <p className="text-xs mt-1" style={{ color: "#8A9AA8" }}>
          {selectionMode === "smart"
            ? "根据出发地、旅行时长和偏好做轻量编排"
            : "从全部候选池中随机抽取，适合换一批灵感"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>纳入 Prompt 的候选数量</label>
        <div className="flex gap-1">
          {LIMIT_OPTIONS.map(n => (
            <ToggleBtn key={n} active={candidateLimit === n} onClick={() => setCandidateLimit(n)}>
              {n}个
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#1F2D3D" }}>推荐偏好</label>
        <div className="grid grid-cols-2 gap-1">
          {PREFERENCE_OPTIONS.map(p => (
            <ToggleBtn key={p.value} active={preference === p.value} onClick={() => setPreference(p.value)}>
              {p.label}
            </ToggleBtn>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!originCity.trim() || !startDate || !endDate}
        className="zh-btn-primary w-full py-3 text-sm"
      >
        生成 Prompt
      </button>
    </div>
  );
}

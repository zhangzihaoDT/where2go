import { useState, useCallback, useMemo } from "react";
import { CandidateDestination, Preference, CandidateSelectionMode } from "./lib/types";
import { buildWhere2GoPrompt } from "./lib/buildPrompt";
import { loadCandidates } from "./data/destinations";
import { selectCandidates } from "./lib/selectCandidates";
import { computeTripDays, detectHolidays, formatHolidayLabel } from "./lib/holidays";
import { PromptBuilderForm } from "./components/PromptBuilderForm";
import { CandidatePreview } from "./components/CandidatePreview";
import { PromptPreview, type PromptSummary } from "./components/PromptPreview";
import { DestinationMap } from "./components/DestinationMap";

const allCandidates = loadCandidates();

export default function App() {
  const [originCity, setOriginCity] = useState("上海");
  const [startDate, setStartDate] = useState("2026-06-25");
  const [endDate, setEndDate] = useState("2026-06-27");
  const [candidateLimit, setCandidateLimit] = useState(30);
  const [preference, setPreference] = useState<Preference>("value");
  const [selectionMode, setSelectionMode] = useState<CandidateSelectionMode>("smart");
  const [selected, setSelected] = useState<CandidateDestination[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [holidayName, setHolidayName] = useState("");

  const tripDays = useMemo(
    () => (startDate && endDate ? computeTripDays(startDate, endDate) : 0),
    [startDate, endDate],
  );

  const effectiveHolidayName =
    holidayName || (startDate && endDate ? formatHolidayLabel(detectHolidays(startDate, endDate)) : "普通周末");

  const selectedIds = useMemo(
    () => new Set(selected.map((c) => c.id)),
    [selected],
  );

  const coveredRegions = useMemo(
    () => new Set(selected.filter((c) => c.lat != null && c.lng != null).map((c) => c.location)).size,
    [selected],
  );

  const detectedHolidayNames = useMemo(
    () => (startDate && endDate ? detectHolidays(startDate, endDate).map((h) => h.name) : []),
    [startDate, endDate],
  );

  const handleGenerate = useCallback(() => {
    const picked = selectCandidates({
      candidates: allCandidates,
      originCity,
      tripDays,
      preference,
      limit: candidateLimit,
      mode: selectionMode,
    });
    setSelected(picked);
    const result = buildWhere2GoPrompt({
      originCity,
      startDate,
      endDate,
      tripDays,
      holidayName: effectiveHolidayName,
      holidayNames: detectedHolidayNames,
      preference,
      candidates: picked,
      selectionMode,
    });
    setPrompt(result);
    setGenerated(true);
  }, [originCity, tripDays, effectiveHolidayName, detectedHolidayNames, preference, candidateLimit, selectionMode]);

  const handleClear = useCallback(() => {
    setPrompt("");
    setSelected([]);
    setGenerated(false);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF9EF" }}>
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/brand/raccoon_avatar_light.png" alt="" className="w-12 h-12 mb-3" />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#174A7C" }}>
            假期去哪儿
          </h1>
          <p className="text-xs mt-1" style={{ color: "#6B7C8F" }}>
            Prompt Builder — 用数据、AI 和一点点常识，研究复杂世界
          </p>
        </div>

        {/* Form Card */}
        <div className="zh-card p-6">
          <PromptBuilderForm
            originCity={originCity}
            setOriginCity={setOriginCity}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            holidayName={holidayName}
            setHolidayName={setHolidayName}
            candidateLimit={candidateLimit}
            setCandidateLimit={setCandidateLimit}
            preference={preference}
            setPreference={setPreference}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Map */}
        <div className="mt-5">
          <DestinationMap
            allCandidates={allCandidates}
            selectedIds={selectedIds}
          />
        </div>

        {/* Candidate List */}
        {selected.length > 0 && (
          <div className="mt-5">
            <CandidatePreview
              candidates={selected}
              limit={candidateLimit}
              total={allCandidates.length}
            />
          </div>
        )}

        {/* Prompt Output */}
        {generated ? (
          <div className="mt-5">
            <PromptPreview
              prompt={prompt}
              onClear={handleClear}
              summary={{
                originCity,
                startDate,
                endDate,
                tripDays,
                selectedCount: selected.length,
                coveredRegions,
                selectionMode,
              }}
            />
          </div>
        ) : (
          <div className="zh-card mt-5 p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
            <img src="/brand/raccoon_avatar_light.png" alt="" className="w-14 h-14 mb-3 opacity-30" />
            <p className="text-sm" style={{ color: "#6B7C8F" }}>填写表单后点击「生成 Prompt」</p>
            <p className="text-xs mt-1.5" style={{ color: "#8A9AA8" }}>
              本站不直接查询实时价格
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
          <img src="/brand/zihao_signature_transparent.png" alt="" className="h-4" />
          <span className="text-xs" style={{ color: "#8A9AA8" }}>
            候选数据来自精品民宿榜单（131 个目的地）
          </span>
        </div>
      </div>
    </div>
  );
}

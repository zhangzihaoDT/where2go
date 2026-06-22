import { useState, useCallback } from "react";
import { CandidateDestination, Preference, CandidateSelectionMode } from "./lib/types";
import { buildWhere2GoPrompt } from "./lib/buildPrompt";
import { loadCandidates } from "./data/destinations";
import { selectCandidates } from "./lib/selectCandidates";
import { PromptBuilderForm } from "./components/PromptBuilderForm";
import { CandidatePreview } from "./components/CandidatePreview";
import { PromptPreview } from "./components/PromptPreview";

const allCandidates = loadCandidates();

export default function App() {
  const [originCity, setOriginCity] = useState("上海");
  const [tripDays, setTripDays] = useState(3);
  const [holidayName, setHolidayName] = useState("端午");
  const [candidateLimit, setCandidateLimit] = useState(30);
  const [preference, setPreference] = useState<Preference>("value");
  const [selectionMode, setSelectionMode] = useState<CandidateSelectionMode>("smart");
  const [selected, setSelected] = useState<CandidateDestination[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);

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
      tripDays,
      holidayName,
      preference,
      candidates: picked,
      selectionMode,
    });
    setPrompt(result);
    setGenerated(true);
  }, [originCity, tripDays, holidayName, preference, candidateLimit, selectionMode]);

  const handleClear = useCallback(() => {
    setPrompt("");
    setSelected([]);
    setGenerated(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-amber-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
            假期去哪儿 <span className="text-blue-600">Prompt Builder</span>
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto text-sm">
            输入出发地和旅行天数，生成一段可以交给 ChatGPT / DeepSeek 搜索的旅行决策 Prompt。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <PromptBuilderForm
                originCity={originCity}
                setOriginCity={setOriginCity}
                tripDays={tripDays}
                setTripDays={setTripDays}
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

            {selected.length > 0 && (
              <div className="mt-4">
                <CandidatePreview
                  candidates={selected}
                  limit={candidateLimit}
                  total={allCandidates.length}
                />
              </div>
            )}
          </div>

          {/* Right: Prompt Output */}
          <div className="lg:col-span-2">
            {generated ? (
              <PromptPreview prompt={prompt} onClear={handleClear} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                <div className="text-5xl mb-4">✏</div>
                <p className="text-sm">填写左侧表单后点击「生成 Prompt」</p>
                <p className="text-xs mt-1 text-gray-300">
                  本站不直接查询实时价格。实时搜索交给 ChatGPT / DeepSeek，本工具只负责把判断标准和候选目的地组织成高质量 Prompt。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pb-4 text-xs text-gray-400">
          假期去哪儿 Prompt Builder · 候选数据来自精品民宿榜单（131 个目的地）
        </div>
      </div>
    </div>
  );
}

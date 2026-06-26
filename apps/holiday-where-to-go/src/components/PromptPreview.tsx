import { CopyButton, DownloadButton } from "./CopyButton";

export type PromptSummary = {
  originCity: string;
  startDate: string;
  endDate: string;
  tripDays: number;
  selectedCount: number;
  coveredRegions: number;
  selectionMode: string;
};

export function PromptPreview({
  prompt,
  onClear,
  summary,
}: {
  prompt: string;
  onClear: () => void;
  summary: PromptSummary;
}) {
  if (!prompt) return null;

  const nights = summary.tripDays - 1;

  return (
    <div className="zh-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "rgba(111,124,143,0.12)" }}>
        <h3 className="font-semibold text-sm" style={{ color: "#1F2D3D" }}>生成的 Prompt</h3>
        <div className="flex items-center gap-2">
          <CopyButton text={prompt} />
          <DownloadButton text={prompt} filename="holiday_search_prompt.md" />
          <button
            onClick={onClear}
            className="zh-btn-ghost px-3 py-2 text-sm"
          >
            清空
          </button>
        </div>
      </div>

      <div className="px-5 py-3 space-y-1 border-b" style={{ borderColor: "rgba(111,124,143,0.08)", backgroundColor: "#F7FAFC" }}>
        <div className="flex gap-6 text-xs">
          <span style={{ color: "#6B7C8F" }}>
            出发地：<span style={{ color: "#1F2D3D", fontWeight: 500 }}>{summary.originCity}</span>
          </span>
          <span style={{ color: "#6B7C8F" }}>
            日期：<span style={{ color: "#1F2D3D", fontWeight: 500 }}>
              {summary.startDate} 至 {summary.endDate}
            </span>
            <span style={{ color: "#174A7C", marginLeft: 4 }}>
              ({summary.tripDays} 天 {nights} 晚)
            </span>
          </span>
        </div>
        <div className="flex gap-6 text-xs">
          <span style={{ color: "#6B7C8F" }}>
            候选目的地：<span style={{ color: "#1F2D3D", fontWeight: 500 }}>{summary.selectedCount} 个</span>
            <span style={{ color: "#8A9AA8", marginLeft: 2 }}>（覆盖 {summary.coveredRegions} 个地区）</span>
          </span>
          <span style={{ color: "#6B7C8F" }}>
            生成方式：<span style={{ color: "#1F2D3D", fontWeight: 500 }}>
              {summary.selectionMode === "smart" ? "智能筛选" : "随机探索"}
            </span>
          </span>
        </div>
        <div className="pt-1 text-xs" style={{ color: "#D79A36" }}>
          候选数量不是最终推荐数量。最终 TOP5 仍由 ChatGPT / DeepSeek 结合实时搜索判断。
        </div>
      </div>

      <pre
        className="p-5 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto"
        style={{ color: "#1F2D3D", backgroundColor: "#F7FAFC" }}
      >
        {prompt}
      </pre>
    </div>
  );
}

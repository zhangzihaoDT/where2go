import { CopyButton, DownloadButton } from "./CopyButton";

export function PromptPreview({ prompt, onClear }: { prompt: string; onClear: () => void }) {
  if (!prompt) return null;

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
      <pre
        className="p-5 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto"
        style={{ color: "#1F2D3D", backgroundColor: "#F7FAFC" }}
      >
        {prompt}
      </pre>
    </div>
  );
}

import { CopyButton, DownloadButton } from "./CopyButton";

export function PromptPreview({ prompt, onClear }: { prompt: string; onClear: () => void }) {
  if (!prompt) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">生成的 Prompt</h3>
        <div className="flex items-center gap-2">
          <CopyButton text={prompt} />
          <DownloadButton text={prompt} filename="holiday_search_prompt.md" />
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            清空
          </button>
        </div>
      </div>
      <pre className="p-5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto bg-gray-50">
        {prompt}
      </pre>
    </div>
  );
}

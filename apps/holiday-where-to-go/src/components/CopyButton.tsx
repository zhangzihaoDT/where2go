import { useCallback, useEffect, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
    }
  }, [text]);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
      className="zh-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-sm"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

export function DownloadButton({ text, filename }: { text: string; filename: string }) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [text, filename]);

  return (
    <button
      onClick={handleDownload}
      className="zh-btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 text-sm"
    >
      下载 .md
    </button>
  );
}

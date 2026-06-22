import { CandidateDestination } from "../lib/types";

export function CandidatePreview({
  candidates,
  limit,
  total,
}: {
  candidates: CandidateDestination[];
  limit: number;
  total: number;
}) {
  if (candidates.length === 0) return null;

  return (
    <div className="zh-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: "#1F2D3D" }}>
          本次纳入 {candidates.length} 个候选目的地
        </h3>
        <span className="text-xs" style={{ color: "#8A9AA8" }}>共 {total} 个可用</span>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-0.5 text-xs font-mono" style={{ color: "#4A5A6A" }}>
        {candidates.map((c, i) => (
          <div key={c.id} className="py-0.5">
            <span style={{ color: "#8A9AA8" }} className="mr-2">{i + 1}.</span>
            {c.name}｜{c.location}
          </div>
        ))}
      </div>
    </div>
  );
}

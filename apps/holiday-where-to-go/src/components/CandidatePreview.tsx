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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">
          本次纳入 {candidates.length} 个候选目的地
        </h3>
        <span className="text-xs text-gray-400">共 {total} 个可用</span>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-0.5 text-xs text-gray-600 font-mono">
        {candidates.map((c, i) => (
          <div key={c.id} className="py-0.5">
            <span className="text-gray-400 mr-2">{i + 1}.</span>
            {c.name}｜{c.location}
          </div>
        ))}
      </div>
    </div>
  );
}

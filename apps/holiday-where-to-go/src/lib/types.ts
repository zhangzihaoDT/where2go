export type CandidateDestination = {
  id: string;
  name: string;
  location: string;
};

export type Preference = "value" | "comfort" | "strong_destination" | "hidden_gem";

export type CandidateSelectionMode = "smart" | "random";

export type PromptBuilderInput = {
  originCity: string;
  tripDays: number;
  holidayName: string;
  preference: Preference;
  candidates: CandidateDestination[];
  selectionMode: CandidateSelectionMode;
};

export const PREFERENCE_LABELS: Record<Preference, string> = {
  value: "性价比优先",
  comfort: "短途舒适优先",
  strong_destination: "强目的地优先",
  hidden_gem: "冷门目的地优先",
};

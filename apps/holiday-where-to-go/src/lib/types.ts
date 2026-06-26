export type CandidateDestination = {
  id: string;
  name: string;
  location: string;
  province?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  geoLevel?: "city" | "exact" | "province" | "unknown";
  geoSource?: string;
  geoConfidence?: "high" | "medium" | "low";
};

export type TravelDateRange = {
  startDate: string;
  endDate: string;
  holidayName?: string;
  dateFlexibility?: "fixed" | "plus_minus_1_day" | "flexible";
};

export type Preference = "value" | "comfort" | "strong_destination" | "hidden_gem";

export type CandidateSelectionMode = "smart" | "random";

export type PromptBuilderInput = {
  originCity: string;
  startDate: string;
  endDate: string;
  tripDays: number;
  holidayName: string;
  holidayNames: string[];
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

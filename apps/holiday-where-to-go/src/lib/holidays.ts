export type ChineseHoliday = {
  name: string;
  start: string;
  end: string;
};

const HOLIDAYS_2026: ChineseHoliday[] = [
  { name: "元旦", start: "2026-01-01", end: "2026-01-03" },
  { name: "春节", start: "2026-02-17", end: "2026-02-23" },
  { name: "清明节", start: "2026-04-04", end: "2026-04-06" },
  { name: "劳动节", start: "2026-05-01", end: "2026-05-05" },
  { name: "端午节", start: "2026-06-19", end: "2026-06-21" },
  { name: "中秋节", start: "2026-09-25", end: "2026-09-27" },
  { name: "国庆节", start: "2026-10-01", end: "2026-10-07" },
];

export function computeTripDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}

export function detectHolidays(start: string, end: string): ChineseHoliday[] {
  const s = new Date(start);
  const e = new Date(end);
  return HOLIDAYS_2026.filter((h) => {
    const hs = new Date(h.start);
    const he = new Date(h.end);
    return s <= he && e >= hs;
  });
}

export function formatHolidayLabel(holidays: ChineseHoliday[]): string {
  if (holidays.length === 0) return "普通周末";
  return holidays.map((h) => h.name).join("/");
}

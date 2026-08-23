"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

// Cyan density ramp, darkest → brightest, matching GitHub's 5 levels.
// Literal hexes rather than tokens: a single token cannot express a scale,
// and each step is tuned so adjacent levels stay distinguishable on carbon.
const LEVEL_COLORS = ["#12151A", "#0B3A47", "#0E7490", "#14A5C4", "#22D3EE"] as const;

/**
 * GitHubHeatmap — real 52-week contribution grid fetched from
 * /api/github/contributions (server-cached proxy). Renders nothing
 * if the API is unreachable so the section never shows a broken state.
 */
export function GitHubHeatmap() {
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github/contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: ContributionsResponse) => {
        if (cancelled) return;
        setDays(data.contributions ?? []);
        setTotal(Object.values(data.total ?? {}).reduce((a, b) => a + b, 0));
      })
      .catch(() => {
        /* keep null — component renders nothing */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!days || days.length === 0) return null;

  // Group days into weeks (columns), Sunday-first like GitHub.
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  for (const day of days) {
    const dow = new Date(day.date + "T00:00:00").getDay();
    if (dow === 0 && week.length > 0) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  }
  if (week.length > 0) weeks.push(week);

  return (
    <Reveal
      className="mb-5"
      dir="ltr"
    >
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] w-max mx-auto">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                  className="w-[10px] h-[10px] rounded-[2px] transition-colors duration-150 hover:ring-1 hover:ring-brand/60"
                  style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground font-mono">
        <span>
          <span className="text-brand font-semibold">{total.toLocaleString()}</span>{" "}
          contributions in the last year
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVEL_COLORS.map((c) => (
            <span
              key={c}
              className="w-[10px] h-[10px] rounded-[2px] inline-block"
              style={{ backgroundColor: c }}
            />
          ))}
          More
        </span>
      </div>
    </Reveal>
  );
}

export default GitHubHeatmap;

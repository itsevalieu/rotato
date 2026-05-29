"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useGarden } from "@/context/GardenContext";

const WEEKS = 26; // ~6 months
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function ActivityHeatmap() {
  const { state } = useGarden();
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const { grid, totalEntries, monthLabels } = useMemo(() => {
    // Count entries per day
    const counts: Record<string, number> = {};
    for (const project of state.projects) {
      for (const entry of project.journalEntries ?? []) {
        const key = entry.createdAt.slice(0, 10);
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }

    const today = startOfDay(new Date());
    // Align to Sunday start — find the Sunday of the current week
    const dayOfWeek = today.getDay(); // 0 = Sun
    const gridEnd = new Date(today.getTime() + (6 - dayOfWeek) * 86400000);
    const totalCells = WEEKS * DAYS_PER_WEEK;
    const gridStart = new Date(gridEnd.getTime() - (totalCells - 1) * 86400000);

    const cells: { date: Date; key: string; count: number }[] = [];
    for (let i = 0; i < totalCells; i++) {
      const date = new Date(gridStart.getTime() + i * 86400000);
      const key = getDateKey(date);
      cells.push({ date, key, count: counts[key] ?? 0 });
    }

    // Group into weeks (columns)
    const weeks: typeof cells[] = [];
    for (let w = 0; w < WEEKS; w++) {
      weeks.push(cells.slice(w * 7, w * 7 + 7));
    }

    // Month labels: track when month changes
    const seenMonths = new Set<string>();
    const labels: { label: string; weekIndex: number }[] = [];
    weeks.forEach((week, wi) => {
      const firstDay = week[0].date;
      const monthKey = `${firstDay.getFullYear()}-${firstDay.getMonth()}`;
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        labels.push({
          label: firstDay.toLocaleDateString(undefined, { month: "short" }),
          weekIndex: wi,
        });
      }
    });

    const total = Object.values(counts).reduce((s, n) => s + n, 0);

    return { grid: weeks, totalEntries: total, monthLabels: labels };
  }, [state.projects]);

  const maxCount = useMemo(
    () => Math.max(1, ...grid.flat().map((c) => c.count)),
    [grid]
  );

  function getCellColor(count: number): string {
    if (count === 0) return "bg-warm-gray-light/20";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "bg-terracotta/25";
    if (intensity < 0.5) return "bg-terracotta/45";
    if (intensity < 0.75) return "bg-terracotta/65";
    return "bg-terracotta/90";
  }

  // Don't render during SSR — the grid depends on local-timezone "today"
  if (!mounted) return null;

  return (
    <div className="mt-6 rounded-2xl border border-warm-gray-light/20 bg-white/30 dark:bg-white/[0.04] dark:border-white/[0.08] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-warm-gray" />
          <h3 className="font-accent text-lg text-soft-brown">Journal Activity</h3>
        </div>
        <span className="text-xs text-warm-gray bg-parchment px-2 py-0.5 rounded-full">
          {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex gap-1 mb-1 pl-6">
            {grid.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="w-3 text-[9px] text-warm-gray/70 leading-none">
                  {label?.label ?? ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-3 text-[9px] text-warm-gray/70 leading-none flex items-center">
                  {label}
                </div>
              ))}
            </div>

            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <motion.div
                    key={cell.key}
                    whileHover={{ scale: 1.3 }}
                    className={`w-3 h-3 rounded-sm cursor-default transition-colors ${getCellColor(cell.count)}`}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      const dateStr = cell.date.toLocaleDateString(undefined, {
                        month: "short", day: "numeric", year: "numeric",
                      });
                      setTooltip({
                        text: cell.count === 0
                          ? `${dateStr} — no entries`
                          : `${dateStr} — ${cell.count} ${cell.count === 1 ? "entry" : "entries"}`,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-[10px] text-warm-gray/60">Less</span>
            {[0, 0.2, 0.5, 0.8, 1].map((v) => (
              <div
                key={v}
                className={`w-3 h-3 rounded-sm ${getCellColor(v === 0 ? 0 : Math.ceil(v * maxCount))}`}
              />
            ))}
            <span className="text-[10px] text-warm-gray/60">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-soft-brown text-cream text-[11px]
            px-2 py-1 rounded-lg shadow-warm-lg whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

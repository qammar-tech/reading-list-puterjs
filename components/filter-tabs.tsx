"use client";

import { cn } from "@/lib/utils";
import type { FilterOption } from "@/lib/types";

interface FilterTab {
  value: FilterOption;
  label: string;
  count: number;
}

interface FilterTabsProps {
  activeFilter: FilterOption;
  counts: Record<FilterOption, number>;
  onFilterChange: (filter: FilterOption) => void;
}

const TABS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "to-read", label: "To Read" },
  { value: "finished", label: "Finished" },
];

/**
 * Horizontal tab strip for filtering the reading list by status.
 */
export function FilterTabs({ activeFilter, counts, onFilterChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter books by status"
      className="flex items-center gap-1 rounded-lg bg-muted p-1"
    >
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={activeFilter === value}
          onClick={() => onFilterChange(value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeFilter === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs tabular-nums leading-none",
              activeFilter === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}

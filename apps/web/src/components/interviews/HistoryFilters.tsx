"use client";

import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { Input } from "@heroui/react";
import {
  historySortOptions,
  historyStatusFilterOptions,
  type HistorySortOption,
  type HistoryStatusFilter,
} from "@/lib/interviewHistoryFilters";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type HistoryFiltersProps = {
  searchQuery: string;
  statusFilter: HistoryStatusFilter;
  sortOption: HistorySortOption;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: HistoryStatusFilter) => void;
  onSortChange: (value: HistorySortOption) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
};

export function HistoryFilters({
  searchQuery,
  statusFilter,
  sortOption,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onClearFilters,
  showClearButton,
}: HistoryFiltersProps) {
  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
        <FiFilter size={16} className="text-[var(--accent)]" />
        Filter and sort
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label htmlFor="history-search" className="text-sm text-[var(--muted)]">
            Search
          </label>
          <div className="relative">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <Input
              id="history-search"
              fullWidth
              variant="secondary"
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="history-status" className="text-sm text-[var(--muted)]">
            Status
          </label>
          <select
            id="history-status"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as HistoryStatusFilter)
            }
            className="w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          >
            {historyStatusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="history-sort" className="text-sm text-[var(--muted)]">
            Sort by
          </label>
          <select
            id="history-sort"
            value={sortOption}
            onChange={(event) =>
              onSortChange(event.target.value as HistorySortOption)
            }
            className="w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
          >
            {historySortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showClearButton && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="w-full cursor-pointer lg:w-auto"
          >
            <FiX size={16} />
            Clear filters
          </Button>
        )}
      </div>
    </Card>
  );
}

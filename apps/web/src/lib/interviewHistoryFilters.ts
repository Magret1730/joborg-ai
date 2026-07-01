import type { InterviewListItem } from "@/types/interview";
import { getDisplayStatus, type DisplayInterviewStatus } from "@/lib/interviewProgress";

export type HistoryStatusFilter = "all" | DisplayInterviewStatus;

export type HistorySortOption =
  | "newest"
  | "oldest"
  | "highest_score"
  | "lowest_score";

export const historyStatusFilterOptions: {
  value: HistoryStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "in_progress", label: "In Progress" },
  { value: "ready_for_report", label: "Ready for Report" },
  { value: "completed", label: "Completed" },
];

export const historySortOptions: {
  value: HistorySortOption;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest_score", label: "Highest score" },
  { value: "lowest_score", label: "Lowest score" },
];

export function filterInterviews(
  interviews: InterviewListItem[],
  searchQuery: string,
  statusFilter: HistoryStatusFilter,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return interviews.filter((interview) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      interview.title.toLowerCase().includes(normalizedQuery) ||
      (interview.companyName ?? "").toLowerCase().includes(normalizedQuery);

    const displayStatus = getDisplayStatus(interview);
    const matchesStatus =
      statusFilter === "all" || displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

export function sortInterviews(
  interviews: InterviewListItem[],
  sortOption: HistorySortOption,
) {
  const sorted = [...interviews];

  sorted.sort((left, right) => {
    switch (sortOption) {
      case "oldest":
        return (
          new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        );
      case "highest_score": {
        const leftScore = left.overallScore ?? -1;
        const rightScore = right.overallScore ?? -1;
        return rightScore - leftScore;
      }
      case "lowest_score": {
        const leftScore = left.overallScore ?? Number.POSITIVE_INFINITY;
        const rightScore = right.overallScore ?? Number.POSITIVE_INFINITY;
        return leftScore - rightScore;
      }
      case "newest":
      default:
        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
    }
  });

  return sorted;
}

export function hasActiveHistoryFilters(
  searchQuery: string,
  statusFilter: HistoryStatusFilter,
  sortOption: HistorySortOption,
) {
  return (
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    sortOption !== "newest"
  );
}

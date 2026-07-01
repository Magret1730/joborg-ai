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

function getCreatedAtTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function compareCreatedAt(
  left: InterviewListItem,
  right: InterviewListItem,
  direction: "asc" | "desc",
) {
  const leftTime = getCreatedAtTime(left.createdAt);
  const rightTime = getCreatedAtTime(right.createdAt);
  const diff = leftTime - rightTime;

  if (diff === 0) {
    return left.title.localeCompare(right.title);
  }

  return direction === "asc" ? diff : -diff;
}

function compareScores(
  left: InterviewListItem,
  right: InterviewListItem,
  direction: "asc" | "desc",
) {
  const leftScore = left.overallScore;
  const rightScore = right.overallScore;

  if (leftScore === null && rightScore === null) {
    return compareCreatedAt(left, right, "desc");
  }

  if (leftScore === null) {
    return 1;
  }

  if (rightScore === null) {
    return -1;
  }

  const diff = leftScore - rightScore;

  if (diff === 0) {
    return compareCreatedAt(left, right, "desc");
  }

  return direction === "asc" ? diff : -diff;
}

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
        return compareCreatedAt(left, right, "asc");
      case "highest_score":
        return compareScores(left, right, "desc");
      case "lowest_score":
        return compareScores(left, right, "asc");
      case "newest":
      default:
        return compareCreatedAt(left, right, "desc");
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

export function formatDeleteSuccessMessage(interview: InterviewListItem) {
  const companyName = interview.companyName?.trim();

  if (companyName) {
    return `${companyName} interview deleted.`;
  }

  return `${interview.title} deleted.`;
}

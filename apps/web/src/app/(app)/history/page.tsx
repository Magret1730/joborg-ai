"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiInbox, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/layout/PageHeader";
import { HistoryFilters } from "@/components/interviews/HistoryFilters";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  filterInterviews,
  formatDeleteSuccessMessage,
  hasActiveHistoryFilters,
  sortInterviews,
  type HistorySortOption,
  type HistoryStatusFilter,
} from "@/lib/interviewHistoryFilters";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { interviewService } from "@/services/interviews";
import type { InterviewListItem } from "@/types/interview";

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<InterviewListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>("all");
  const [sortOption, setSortOption] = useState<HistorySortOption>("newest");
  const [interviewToDelete, setInterviewToDelete] =
    useState<InterviewListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadInterviews = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await interviewService.list();
      setInterviews(data);
    } catch (err) {
      setError(
        getFriendlyErrorMessage(
          err,
          "We couldn't load your interview history. Please try again in a moment.",
        ),
      );
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadInterviews();
  }, [loadInterviews]);

  const filteredInterviews = useMemo(() => {
    const filtered = filterInterviews(interviews, searchQuery, statusFilter);
    return sortInterviews(filtered, sortOption);
  }, [interviews, searchQuery, statusFilter, sortOption]);

  const showClearFilters = hasActiveHistoryFilters(
    searchQuery,
    statusFilter,
    sortOption,
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOption("newest");
  };

  const handleDeleteRequest = (interview: InterviewListItem) => {
    setInterviewToDelete(interview);
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setInterviewToDelete(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!interviewToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await interviewService.delete(interviewToDelete.id);
      setInterviews((previous) =>
        previous.filter((interview) => interview.id !== interviewToDelete.id),
      );
      toast.success(formatDeleteSuccessMessage(interviewToDelete), {
        toastId: `delete-interview-${interviewToDelete.id}`,
      });
      setInterviewToDelete(null);
    } catch (err) {
      toast.error(
        getFriendlyErrorMessage(
          err,
          "We couldn't delete this interview. Please try again in a moment.",
        ),
        {
          toastId: `delete-interview-error-${interviewToDelete.id}`,
        },
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Interview History"
        description="Search, filter, and manage your practice sessions."
        action={
          <Link href="/start" className="cursor-pointer">
            <Button>Start Interview</Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingState label="Loading interview history..." rows={6} />
      ) : error ? (
        <ErrorState title="Could not load history" message={error} />
      ) : interviews.length === 0 ? (
        <EmptyState
          title="No interviews yet"
          description="Your practice sessions will appear here once you complete your first mock interview."
          actionLabel="Start Interview"
          actionHref="/start"
        />
      ) : (
        <>
          <HistoryFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortOption={sortOption}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
            showClearButton={showClearFilters}
          />

          {filteredInterviews.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--muted)]">
                Showing {filteredInterviews.length} of {interviews.length}{" "}
                interview{interviews.length === 1 ? "" : "s"}
              </p>
              <InterviewHistoryTable
                interviews={filteredInterviews}
                onDelete={handleDeleteRequest}
                onRefresh={() => void loadInterviews({ silent: true })}
              />
            </div>
          ) : (
            <EmptyState
              title="No matching interviews"
              description="Try adjusting your search or filters to find the session you're looking for."
              actionLabel="Clear filters"
              onAction={handleClearFilters}
              icon={<FiSearch size={22} />}
            />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(interviewToDelete)}
        title="Delete Interview?"
        description="This will permanently delete this interview session and all of its answers. This action cannot be undone."
        confirmLabel="Delete Interview"
        confirmingLabel="Deleting..."
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

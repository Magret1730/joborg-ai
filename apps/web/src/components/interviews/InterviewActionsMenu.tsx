"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiFileText,
  FiMoreVertical,
  FiPlay,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
} from "@heroui/react";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type { InterviewListItem } from "@/types/interview";

type MenuPlacement = "top end" | "top start" | "bottom end" | "bottom start";

type InterviewActionsMenuProps = {
  interview: InterviewListItem;
  onDelete?: (interview: InterviewListItem) => void;
  onRefresh?: () => void | Promise<void>;
  align?: "left" | "right";
};

const MENU_ESTIMATED_HEIGHT = 220;

function getMenuPlacement(
  trigger: HTMLElement,
  align: "left" | "right",
): MenuPlacement {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openUpward =
    spaceBelow < MENU_ESTIMATED_HEIGHT && spaceAbove > spaceBelow;
  const horizontal = align === "right" ? "end" : "start";

  return openUpward
    ? (`top ${horizontal}` as MenuPlacement)
    : (`bottom ${horizontal}` as MenuPlacement);
}

export function InterviewActionsMenu({
  interview,
  onDelete,
  onRefresh,
  align = "right",
}: InterviewActionsMenuProps) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [placement, setPlacement] = useState<MenuPlacement>(
    align === "right" ? "bottom end" : "bottom start",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const isCompleted = interview.status === "completed";
  const isReadyForReport =
    interview.readyForReport && interview.status !== "completed";

  const updatePlacement = () => {
    if (triggerRef.current) {
      setPlacement(getMenuPlacement(triggerRef.current, align));
    }
  };

  const handleGenerateReport = async (isRegenerate: boolean) => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      await interviewService.generateFinalReport(interview.id);
      toast.success(
        isRegenerate
          ? "Final report regenerated successfully."
          : "Final report generated successfully.",
        { toastId: `generate-report-history-${interview.id}` },
      );
      await onRefresh?.();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to generate final report. Please try again.";

      toast.error(message, {
        toastId: `generate-report-history-error-${interview.id}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = (key: string) => {
    switch (key) {
      case "view-report":
        router.push(`/interview/${interview.id}/report`);
        break;
      case "continue":
        router.push(`/interview/${interview.id}`);
        break;
      case "generate-report":
        void handleGenerateReport(false);
        break;
      case "regenerate-report":
        void handleGenerateReport(true);
        break;
      case "delete":
        onDelete?.(interview);
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      onOpenChange={(isOpen) => {
        if (isOpen) {
          updatePlacement();
        }
      }}
    >
      <DropdownTrigger>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Actions for ${interview.title}`}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <FiMoreVertical size={16} />
        </button>
      </DropdownTrigger>

      <DropdownPopover placement={placement} offset={8} className="min-w-48 p-1.5">
        <DropdownMenu
          aria-label={`Actions for ${interview.title}`}
          onAction={(key) => handleAction(String(key))}
        >
          {isCompleted ? (
            <>
              <DropdownItem
                id="view-report"
                textValue="View Report"
                className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <FiFileText size={15} />
                View Report
              </DropdownItem>
              <DropdownItem
                id="regenerate-report"
                textValue="Regenerate Report"
                isDisabled={isGenerating}
                className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <FiRotateCcw size={15} />
                {isGenerating ? "Regenerating..." : "Regenerate Report"}
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem
                id="continue"
                textValue="Continue Interview"
                className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <FiPlay size={15} />
                Continue Interview
              </DropdownItem>
              {isReadyForReport && (
                <DropdownItem
                  id="generate-report"
                  textValue="Generate Report"
                  isDisabled={isGenerating}
                  className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  <FiFileText size={15} />
                  {isGenerating ? "Generating..." : "Generate Report"}
                </DropdownItem>
              )}
            </>
          )}

          {onDelete && (
            <DropdownItem
              id="delete"
              textValue="Delete"
              className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--danger-text)] data-[hovered=true]:bg-[var(--danger-soft)]"
            >
              <FiTrash2 size={15} />
              Delete
            </DropdownItem>
          )}
        </DropdownMenu>
      </DropdownPopover>
    </Dropdown>
  );
}

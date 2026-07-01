"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  FiFileText,
  FiMoreVertical,
  FiPlay,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import type { InterviewListItem } from "@/types/interview";

type InterviewActionsMenuProps = {
  interview: InterviewListItem;
  onDelete?: (interview: InterviewListItem) => void;
  align?: "left" | "right";
};

export function InterviewActionsMenu({
  interview,
  onDelete,
  align = "right",
}: InterviewActionsMenuProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleGenerateReport = () => {
    closeMenu();
    toast.info("Final report generation is coming in the next task.", {
      toastId: `generate-report-history-${interview.id}`,
    });
  };

  const handleDelete = () => {
    closeMenu();
    onDelete?.(interview);
  };

  const menuItemClass =
    "flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--text)] transition hover:bg-[var(--surface-hover)] focus-visible:bg-[var(--surface-hover)] focus-visible:outline-none";

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        aria-label={`Actions for ${interview.title}`}
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className={`absolute top-full z-20 mt-2 min-w-48 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-[var(--card)] p-1.5 shadow-[var(--card-shadow)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {interview.status === "completed" ? (
            <Link
              href={`/interview/${interview.id}/report`}
              role="menuitem"
              className={menuItemClass}
              onClick={closeMenu}
            >
              <FiFileText size={15} />
              View Report
            </Link>
          ) : (
            <Link
              href={`/interview/${interview.id}`}
              role="menuitem"
              className={menuItemClass}
              onClick={closeMenu}
            >
              <FiPlay size={15} />
              Continue Interview
            </Link>
          )}

          {interview.readyForReport && interview.status !== "completed" && (
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={handleGenerateReport}
            >
              <FiFileText size={15} />
              Generate Report
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              role="menuitem"
              className={`${menuItemClass} text-[var(--danger-text)] hover:bg-[var(--danger-soft)] focus-visible:bg-[var(--danger-soft)]`}
              onClick={handleDelete}
            >
              <FiTrash2 size={15} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

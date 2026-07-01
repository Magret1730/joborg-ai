"use client";

import { useEffect, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "./Button";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  confirmVariant?: "primary" | "secondary" | "ghost";
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  confirmingLabel,
  cancelLabel = "Cancel",
  isConfirming = false,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isConfirming, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={isConfirming ? undefined : onCancel}
        disabled={isConfirming}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="relative z-10 w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--card-shadow)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="confirm-modal-title"
            className="text-lg font-semibold text-[var(--text)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="cursor-pointer rounded-[var(--radius-sm)] p-1 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <p
          id="confirm-modal-description"
          className="text-sm leading-relaxed text-[var(--text-soft)]"
        >
          {description}
        </p>

        {children}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isConfirming}
            className="w-full cursor-pointer sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isConfirming}
            className={`w-full cursor-pointer sm:w-auto ${
              confirmVariant === "primary"
                ? "bg-[var(--danger)] hover:bg-[var(--danger)]/90"
                : ""
            }`}
          >
            {isConfirming ? (confirmingLabel ?? `${confirmLabel}...`) : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

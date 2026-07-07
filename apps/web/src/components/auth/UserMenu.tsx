"use client";

import { useRef, useState } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
} from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { PlanBadge, UserAvatar } from "@/components/auth/UserAvatar";
import type { User } from "@/types/auth";

type MenuPlacement = "top end" | "bottom end";

type UserMenuProps = {
  user: User;
  compactTrigger?: boolean;
  onNavigate?: () => void;
};

function getMenuPlacement(trigger: HTMLElement): MenuPlacement {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;

  return openUpward ? "top end" : "bottom end";
}

export function UserMenu({
  user,
  compactTrigger = false,
  onNavigate,
}: UserMenuProps) {
  const { logout } = useAuth();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [placement, setPlacement] = useState<MenuPlacement>("bottom end");

  const updatePlacement = () => {
    if (triggerRef.current) {
      setPlacement(getMenuPlacement(triggerRef.current));
    }
  };

  const handleLogout = () => {
    onNavigate?.();
    void logout();
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
          aria-label="Open account menu"
          className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-left transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <UserAvatar name={user.name} className="h-8 w-8 text-xs" />
          {!compactTrigger && (
            <span className="hidden max-w-[8rem] truncate text-sm font-medium text-[var(--text)] sm:inline">
              {user.name}
            </span>
          )}
          <FiChevronDown
            size={14}
            className="shrink-0 text-[var(--muted)]"
            aria-hidden="true"
          />
        </button>
      </DropdownTrigger>

      <DropdownPopover placement={placement} offset={8} className="min-w-56 p-0">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="truncate text-sm font-semibold text-[var(--text)]">
            {user.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
            {user.email}
          </p>
          <div className="mt-2">
            <PlanBadge plan={user.plan} />
          </div>
        </div>

        <DropdownMenu
          aria-label="Account menu"
          onAction={(key) => {
            if (key === "logout") {
              handleLogout();
            }
          }}
          className="p-1.5"
        >
          <DropdownItem
            id="logout"
            textValue="Log out"
            className="gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--danger-text)] data-[hovered=true]:bg-[var(--danger-soft)]"
          >
            <FiLogOut size={15} />
            Log out
          </DropdownItem>
        </DropdownMenu>
      </DropdownPopover>
    </Dropdown>
  );
}

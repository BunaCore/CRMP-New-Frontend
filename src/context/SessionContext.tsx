"use client";

// ============================================================
// SESSION CONTEXT — Bridge between Zustand authStore and
// existing components that already use useSession().
//
// Instead of a hardcoded mock user, this now reads from the
// Zustand auth store. All existing sidebar/nav components
// continue to work without modifications.
// ============================================================

import { createContext, type ReactNode, useContext } from "react";

import { useAuthStore } from "@/stores/authStore";

// Re-export UserRole from the canonical source so existing
// imports like `import { UserRole } from "@/context/SessionContext"`
// keep working without changes.
export type { UserRole } from "@/lib/api/auth/types";

import type { UserRole } from "@/lib/api/auth/types";

export interface SessionUser {
  id: string;
  name: string;
  roles: UserRole[];
  email: string;
  avatarUrl?: string;
  department?: string | null;
  permissions?: string[];
}

interface SessionContextType {
  user: SessionUser | null;
  isLoading: boolean;
  setSession: (user: SessionUser | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  // Read directly from Zustand — single source of truth
  const { user: authUser, isLoading, logout } = useAuthStore();

  // Map the Zustand UserProfile shape → the SessionUser shape
  // that existing components expect
  const sessionUser: SessionUser | null = authUser
    ? {
        id: authUser.id,
        name: authUser.fullName,
        roles: (authUser.roles as UserRole[]) ?? null,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl,
        department: authUser.department,
        permissions: authUser.permissions,
      }
    : null;

  const setSession = (user: SessionUser | null) => {
    if (!user) {
      logout();
    }
    // For setting a user, use the Zustand login() action directly
    // from wherever the login flow happens (e.g. SignInForm).
  };

  return (
    <SessionContext.Provider value={{ user: sessionUser, isLoading, setSession }}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

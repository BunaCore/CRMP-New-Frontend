// ============================================================
// ZUSTAND AUTH STORE
// Global auth state — persisted to localStorage automatically.
// ============================================================

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserProfile } from "@/lib/api/auth/types";

interface AuthState {
  // State
  access_token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      access_token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Save token + user after successful login
      login: (token: string, user: UserProfile) =>
        set({ access_token: token, user, isAuthenticated: true, isLoading: false }),

      // Clear everything on logout or 401
      logout: () => set({ access_token: null, user: null, isAuthenticated: false, isLoading: false }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Partial user updates (e.g. after profile save) without re-login
      updateUser: (partial: Partial<UserProfile>) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...partial } });
      },
    }),
    {
      name: "crmp-auth-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential fields — not transient loading state
      partialize: (state) => ({
        access_token: state.access_token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

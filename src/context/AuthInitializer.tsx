"use client";

// ============================================================
// AUTH INITIALIZER
// Invisible component — mounts on app start inside RootLayout.
// Validates the persisted Zustand session and syncs auth cookies
// so Edge Middleware can do fast presence checks.
//
// Flow:
//   App loads → mounts → reads Zustand (from localStorage)
//     → if token exists: calls getCurrentUser() to validate
//     → if valid: syncs access_token + user_permissions cookies
//     → if invalid: calls logout() and clears cookies
// ============================================================

import { useEffect } from "react";

import Cookies from "js-cookie";

import { getCurrentUser } from "@/lib/api/auth/queries";
import { useSocketInitialization } from "@/lib/socket/use-socket";
import { useAuthStore } from "@/stores/authStore";

const COOKIE_TOKEN_KEY = "access_token";
const COOKIE_PERMISSIONS_KEY = "user_permissions";
const COOKIE_TTL_DAYS = 7;

export function AuthInitializer() {
  const { login, logout, setLoading } = useAuthStore();
  const token = useAuthStore((s) => s.access_token);

  // Initialize socket connection whenever we have a valid token
  useSocketInitialization(token);

  useEffect(() => {
    const initSession = async () => {
      // Use getState() to safely read the latest hydrated token,
      // avoiding stale closures where access_token might be null on initial render
      const currentToken = useAuthStore.getState().access_token;

      setLoading(true);

      if (!currentToken) {
        // No token → clear stale cookies
        Cookies.remove(COOKIE_TOKEN_KEY);
        Cookies.remove(COOKIE_PERMISSIONS_KEY);
        setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();

        if (user && currentToken) {
          login(currentToken, user);

          // Sync to cookies (optional but useful for server-side access later).
          Cookies.set(COOKIE_TOKEN_KEY, currentToken, {
            expires: COOKIE_TTL_DAYS,
            path: "/",
            sameSite: "lax",
          });
          Cookies.set(COOKIE_PERMISSIONS_KEY, JSON.stringify(user.permissions ?? []), {
            expires: COOKIE_TTL_DAYS,
            path: "/",
            sameSite: "lax",
          });
        } else {
          logout();
          Cookies.remove(COOKIE_TOKEN_KEY);
          Cookies.remove(COOKIE_PERMISSIONS_KEY);
        }
      } catch (error: unknown) {
        //logout only if 401 response
        const axiosLikeError = error as { response?: { status?: number } };
        if (axiosLikeError.response?.status === 401) {
          logout();
          Cookies.remove(COOKIE_TOKEN_KEY);
          Cookies.remove(COOKIE_PERMISSIONS_KEY);
        }
      } finally {
        setLoading(false);
      }
    };

    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, logout, setLoading]);

  return null; // Invisible — renders nothing
}

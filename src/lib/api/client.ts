import axios from "axios";

// ============================================================
// AXIOS API CLIENT
// Central HTTP instance. Automatically injects JWT token from
// the Zustand store on every request.
// ============================================================

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: inject Bearer token ───────────────
apiClient.interceptors.request.use(
  async (config) => {
    // Lazy ESM import avoids circular dependency while satisfying lint rules.
    const { useAuthStore } = await import("@/stores/authStore");
    const token: string | null = useAuthStore.getState().access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: handle 401 globally ──────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import("@/stores/authStore");
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

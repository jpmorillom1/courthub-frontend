import { create } from "zustand";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:9000";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: authService.hasValidAccessToken(),
  initialize: async () => {
    set({ loading: true });

    try {
      if (authService.isAuthenticated()) {
        const localUser = authService.getCurrentUser();
        if (localUser) {
          set({ user: localUser });
        } else {
          try {
            const profile = await userService.getCurrentUserProfile();
            localStorage.setItem("user", JSON.stringify(profile));
            set({ user: profile });
          } catch (err) {
            const tokenUser = authService.getCurrentUser();
            if (tokenUser) set({ user: tokenUser });
          }
        }
      }
    } catch (e) {
      // Ignore init errors and fall back to unauthenticated state.
    } finally {
      set({
        loading: false,
        isAuthenticated: authService.hasValidAccessToken(),
      });
    }
  },
  checkSession: () => {
    const token = localStorage.getItem("accessToken");
    if (token && !authService.isAuthenticated()) {
      authService.logout();
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isAuthenticated: authService.hasValidAccessToken() });
  },
  login: async (email, password) => {
    try {
      const { user: loggedUser } = await authService.login(email, password);
      set({ user: loggedUser, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  register: async (userData) => {
    try {
      const result = await authService.register(userData);
      return { success: true, user: result.user || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  logout: async () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  startGoogleOAuth: () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  },
  setUser: (user) => {
    set({ user, isAuthenticated: authService.hasValidAccessToken() });
  },
  syncUserFromStorage: () => {
    const localUser = authService.getCurrentUser();
    set({
      user: localUser,
      isAuthenticated: authService.hasValidAccessToken(),
    });
    return localUser;
  },
}));

export const useAuth = useAuthStore;

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { API_ENDPOINTS } from "../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:9000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (authService.isAuthenticated()) {
          const localUser = authService.getCurrentUser();
          if (localUser) {
            setUser(localUser);
            setLoading(false);
            return;
          }
          try {
            const profile = await userService.getCurrentUserProfile();
            localStorage.setItem("user", JSON.stringify(profile));
            setUser(profile);
          } catch (err) {
            // ignore, maybe no profile endpoint
            const tokenUser = authService.getCurrentUser();
            if (tokenUser) setUser(tokenUser);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("accessToken");
      if (token && !authService.isAuthenticated()) {
        authService.logout();
        setUser(null);
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const login = async (email, password) => {
    try {
      const { user: loggedUser } = await authService.login(email, password);
      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      // Do not set user here; backend doesn't return tokens. Caller can redirect to login.
      return { success: true, user: result.user || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
  };

  const startGoogleOAuth = () => {
    // Redirect to API Gateway OAuth2 authorization endpoint
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: authService.hasValidAccessToken(),
    loading,
    startGoogleOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

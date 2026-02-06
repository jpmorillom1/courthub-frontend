import api, { API_ENDPOINTS } from "./api";

/**
 * Auth Service
 * Handles authentication and authorization through the API Gateway
 */

const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const isTokenExpired = (token, clockSkewSeconds = 30) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + clockSkewSeconds;
};

export const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} { accessToken, refreshToken, user }
   */
  async login(email, password) {
    try {
      const resp = await api.post(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken } = resp.data || {};
      if (!accessToken) throw new Error("Invalid login response");

      saveTokens({ accessToken, refreshToken });

      // Get user profile from the profile endpoint
      try {
        const profileResp = await api.get(API_ENDPOINTS.USERS_PROFILE);
        const user = profileResp.data;
        localStorage.setItem("user", JSON.stringify(user));
        return { accessToken, refreshToken, user };
      } catch (err) {
        // Fallback: extract user info from JWT
        const payload = parseJwt(accessToken);
        const user = payload
          ? {
              email: payload.sub || payload.email,
              id: payload.user_id || payload.sub,
            }
          : null;
        if (user) localStorage.setItem("user", JSON.stringify(user));
        return { accessToken, refreshToken, user };
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * OAuth2 login callback handler
   * Called after OAuth2 provider redirects with auth code
   * @returns {Promise<Object>} { accessToken, refreshToken, user }
   */
  async oauthLogin() {
    try {
      // Exchange auth code for tokens
      const resp = await api.post(API_ENDPOINTS.AUTH_LOGIN, {});

      const { accessToken, refreshToken } = resp.data || {};
      if (!accessToken) throw new Error("OAuth2 login failed");

      saveTokens({ accessToken, refreshToken });

      // Get user profile
      try {
        const profileResp = await api.get(API_ENDPOINTS.USERS_PROFILE);
        const user = profileResp.data;
        localStorage.setItem("user", JSON.stringify(user));
        return { accessToken, refreshToken, user };
      } catch (err) {
        // Fallback: extract from JWT
        const payload = parseJwt(accessToken);
        const user = payload
          ? {
              email: payload.sub || payload.email,
              id: payload.user_id || payload.sub,
            }
          : null;
        if (user) localStorage.setItem("user", JSON.stringify(user));
        return { accessToken, refreshToken, user };
      }
    } catch (error) {
      console.error("OAuth2 login error:", error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} { accessToken, refreshToken, user }
   */
  async register(userData) {
    try {
      const payload = {
        ...userData,
        roles:
          Array.isArray(userData.roles) && userData.roles.length > 0
            ? userData.roles
            : ["USER"],
      };

      const resp = await api.post(API_ENDPOINTS.USERS_CREATE, payload);

      const { accessToken, refreshToken, ...rest } = resp.data || {};

      // Case 1: backend returns tokens
      if (accessToken) {
        saveTokens({ accessToken, refreshToken });

        try {
          const profileResp = await api.get(API_ENDPOINTS.USERS_PROFILE);
          const user = profileResp.data;
          localStorage.setItem("user", JSON.stringify(user));
          return { accessToken, refreshToken, user };
        } catch (err) {
          const payload = parseJwt(accessToken);
          const user = payload
            ? {
                email: payload.sub || payload.email,
                id: payload.user_id || payload.sub,
              }
            : null;
          if (user) localStorage.setItem("user", JSON.stringify(user));
          return { accessToken, refreshToken, user };
        }
      }

      // Case 2: backend only returns the created user (no tokens)
      const user = resp.data || {
        email: payload.email,
        name: payload.name,
        faculty: payload.faculty,
        roles: payload.roles,
      };
      localStorage.setItem("user", JSON.stringify(user));
      return { user };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise<Object>} { accessToken, refreshToken }
   */
  async refresh() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const resp = await api.post(API_ENDPOINTS.AUTH_REFRESH, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefresh } = resp.data || {};
      saveTokens({ accessToken, refreshToken: newRefresh });
      return { accessToken, refreshToken: newRefresh };
    } catch (error) {
      console.error("Token refresh error:", error);
      clearTokens();
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    try {
      // Optionally notify backend of logout
      api.post(API_ENDPOINTS.AUTH_LOGOUT).catch(() => {
        // Ignore errors, logout locally anyway
      });
    } finally {
      clearTokens();
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} Cached user object
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if access token exists
   */
  isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    if (isTokenExpired(token)) {
      clearTokens();
      return false;
    }
    return true;
  },

  /**
   * Check if access token exists and is not expired (no side effects)
   * @returns {boolean}
   */
  hasValidAccessToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    return !isTokenExpired(token);
  },

  /**
   * Get token payload without verification
   * Use only for reading non-sensitive data
   * @returns {Object|null} JWT payload
   */
  getTokenPayload() {
    const token = localStorage.getItem("accessToken");
    return token ? parseJwt(token) : null;
  },
};

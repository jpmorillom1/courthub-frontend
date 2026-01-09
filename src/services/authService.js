import api, { userApi } from "./api";

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
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const authService = {
  async login(email, password) {
    const resp = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken } = resp.data || {};
    if (!accessToken) throw new Error("Invalid login response");
    saveTokens({ accessToken, refreshToken });
    // Get profile from user service
    try {
      const profileResp = await userApi.get("/users/me");
      const user = profileResp.data;
      localStorage.setItem("user", JSON.stringify(user));
      return { accessToken, refreshToken, user };
    } catch (err) {
      const payload = parseJwt(accessToken);
      const user = payload ? { email: payload.sub || payload.email } : null;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      return { accessToken, refreshToken, user };
    }
  },

  async oauthLogin() {
    // Try to obtain tokens from server endpoint (called after oauth flow)
    const resp = await api.post("/auth/oauth2/login");
    const { accessToken, refreshToken } = resp.data || {};
    if (!accessToken) throw new Error("OAuth2 login failed");
    saveTokens({ accessToken, refreshToken });
    try {
      const profileResp = await userApi.get("/users/me");
      const user = profileResp.data;
      localStorage.setItem("user", JSON.stringify(user));
      return { accessToken, refreshToken, user };
    } catch (err) {
      const payload = parseJwt(accessToken);
      const user = payload ? { email: payload.sub || payload.email } : null;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      return { accessToken, refreshToken, user };
    }
  },

  async refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");
    const resp = await api.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefresh } = resp.data || {};
    saveTokens({ accessToken, refreshToken: newRefresh });
    return { accessToken, refreshToken: newRefresh };
  },

  logout() {
    clearTokens();
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};

import axios from "axios";

/**
 * API Gateway configuration
 * All services communicate through the API Gateway at port 9000
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:9000";

// Centralized endpoint routes
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",

  // Courts endpoints
  COURTS_GET_ALL: "/courts",
  COURTS_GET_BY_ID: (id) => `/courts/${id}`,

  // Bookings endpoints
  BOOKINGS_CREATE: "/bookings",
  BOOKINGS_GET_MY: "/bookings",
  BOOKINGS_GET_BY_ID: (id) => `/bookings/${id}`,
  BOOKINGS_CANCEL: (id) => `/bookings/${id}`,

  // Users endpoints
  USERS_PROFILE: "/users/me",
  USERS_GET_BY_ID: (id) => `/users/${id}`,
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const resp = await axios.post(
          `${API_BASE}${API_ENDPOINTS.AUTH_REFRESH}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const { accessToken, refreshToken: newRefresh } = resp.data || {};
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (newRefresh) {
          localStorage.setItem("refreshToken", newRefresh);
        }
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

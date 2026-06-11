// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // CRITICAL: Required to send/receive the HttpOnly refresh token cookie
  withCredentials: true,
});

// Request interceptor: Attach the access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Handle token expiration and automatic refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401, we haven't already retried, and it's NOT an auth endpoint failing
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token.
        // Axios will automatically send the HttpOnly cookie with this request.
        const response = await api.post("/auth/refresh/");
        const { access } = response.data;

        // Save the new token
        localStorage.setItem("access_token", access);

        // Update the authorization header and retry the original failed request
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid/expired, log the user out
        console.error("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        // Force redirect to login page (adjust depending on your router setup)
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

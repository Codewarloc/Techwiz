import axios from "axios";

// Base URL of your Django backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle 401 and refresh token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          // Use the same axios instance (not api to avoid recursion)
          const res = await axios.post(`${API_BASE_URL}token/refresh/`, {
            refresh,
          });

          if (res.status === 200) {
            const newAccess = res.data.access;
            localStorage.setItem("access", newAccess);

            // Update default headers
            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;

            return api(originalRequest); // Retry the original request
          }
        }
      } catch (err) {
        console.error("🔴 Refresh token failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // Redirect to login if refresh fails
      }
    }

    return Promise.reject(error);
  }
);

export default api;

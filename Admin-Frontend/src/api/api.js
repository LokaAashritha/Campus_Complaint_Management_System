import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const API = axios.create({
  baseURL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("admin_token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const studentAPI = axios.create({
  baseURL,
});

studentAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("student_token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

studentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("student_token");
      localStorage.removeItem("student_user");

      const isAuthRoute =
        window.location.pathname === "/student/login" ||
        window.location.pathname === "/student/register";

      if (!isAuthRoute) {
        window.location.href = "/student/login";
      }
    }

    return Promise.reject(error);
  }
);

export default studentAPI;

import React, { useState } from "react";
import API from "../api/api";

function Login({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const needsName = mode === "register";

    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      (needsName && !formData.name.trim())
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await API.post("/auth/register", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: "student",
        });
      }

      const res = await API.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      onAuthSuccess(res.data);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Campus Complaint Management System</h1>
        <h3 className="login-subtitle">
          {mode === "login" ? "Student Login" : "Student Registration"}
        </h3>

        <div className="login-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {error && <p className="status-message error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register and Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
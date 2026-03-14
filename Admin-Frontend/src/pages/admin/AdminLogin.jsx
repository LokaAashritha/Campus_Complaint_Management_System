import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../../api/api";

function hasAdminSession() {
  const token = localStorage.getItem("admin_token");
  const rawUser = localStorage.getItem("admin_user");

  if (!token || !rawUser) {
    return false;
  }

  try {
    const user = JSON.parse(rawUser);
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (hasAdminSession()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "register" && (!name.trim() || !adminSecret.trim())) {
      setError("Name and admin registration secret are required.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await API.post("/auth/register", {
          name: name.trim(),
          email: email.trim(),
          password,
          role: "admin",
          adminSecret: adminSecret.trim(),
        });

        setMessage("Admin account created successfully. Signing you in...");
      }

      const res = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (res?.data?.user?.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_user", JSON.stringify(res.data.user));
      navigate("/admin", { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #111827, #1f2937)",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>
          {mode === "login" ? "Admin Login" : "Admin Register"}
        </h2>
        <p style={{ marginTop: 0, marginBottom: "20px", color: "#6b7280" }}>
          {mode === "login"
            ? "Sign in with your admin account to continue."
            : "Create a new admin account using the registration secret."}
        </p>

        <p style={{ marginTop: 0, marginBottom: "14px" }}>
          <Link
            to="/"
            style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
          >
            Back to landing page
          </Link>
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => switchMode("login")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: mode === "login" ? "none" : "1px solid #d1d5db",
              backgroundColor: mode === "login" ? "#2563eb" : "#f3f4f6",
              color: mode === "login" ? "#ffffff" : "#111827",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => switchMode("register")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: mode === "register" ? "none" : "1px solid #d1d5db",
              backgroundColor: mode === "register" ? "#2563eb" : "#f3f4f6",
              color: mode === "register" ? "#ffffff" : "#111827",
              fontWeight: 600,
              cursor: "pointer",
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Admin Registration Secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          )}

          {message && (
            <p
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#166534",
                background: "#dcfce7",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {message}
            </p>
          )}

          {error && (
            <p
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#b91c1c",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign in"
              : "Register and Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

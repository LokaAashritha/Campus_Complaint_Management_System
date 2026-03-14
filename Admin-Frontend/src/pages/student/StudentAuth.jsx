import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import studentAPI from "../../api/studentApi";
import "./student.css";

function hasStudentSession() {
  const token = localStorage.getItem("student_token");
  const rawUser = localStorage.getItem("student_user");

  if (!token || !rawUser) {
    return false;
  }

  try {
    const user = JSON.parse(rawUser);
    return user?.role === "student";
  } catch {
    return false;
  }
}

export default function StudentAuth({ initialMode = "login" }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode]);

  if (hasStudentSession()) {
    return <Navigate to="/student/dashboard" replace />;
  }

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
        await studentAPI.post("/auth/register", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: "student",
        });
      }

      const res = await studentAPI.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res?.data?.user?.role !== "student") {
        setError("This account does not have student access.");
        return;
      }

      localStorage.setItem("student_token", res.data.token);
      localStorage.setItem("student_user", JSON.stringify(res.data.user));
      navigate("/student/dashboard", { replace: true });
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-auth-page">
      <div className="student-auth-card">
        <Link className="student-home-link" to="/">
          Back to landing page
        </Link>

        <h1>Campus Complaint Management System</h1>
        <h3>{mode === "login" ? "Student Login" : "Student Registration"}</h3>

        <div className="student-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => navigate("/student/login", { replace: true })}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => navigate("/student/register", { replace: true })}
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {error && <p className="student-status-message error">{error}</p>}

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

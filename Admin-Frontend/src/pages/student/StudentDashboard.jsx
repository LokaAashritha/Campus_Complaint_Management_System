import { useEffect, useMemo, useState } from "react";
import { FaHome, FaList, FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import studentAPI from "../../api/studentApi";
import "./student.css";

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem("student_user");

    if (!rawUser) {
      return null;
    }

    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function getStatusClass(status) {
  if (status === "Pending") {
    return "pending";
  }

  if (status === "In Progress") {
    return "in-progress";
  }

  if (status === "Resolved") {
    return "resolved";
  }

  return "default";
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(getStoredUser);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [categoriesRes, complaintsRes] = await Promise.all([
        studentAPI.get("/categories"),
        studentAPI.get("/complaints"),
      ]);

      const fetchedCategories = categoriesRes.data || [];

      setCategories(fetchedCategories);

      if (fetchedCategories.length > 0 && !categoryId) {
        setCategoryId(fetchedCategories[0]._id);
      }

      setComplaints(complaintsRes.data || []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addComplaint = async () => {
    setMessage("");
    setError("");

    if (!title.trim() || !description.trim() || !categoryId) {
      setError("Please fill all fields.");
      return;
    }

    setSubmitting(true);

    try {
      await studentAPI.post("/complaints", {
        title: title.trim(),
        description: description.trim(),
        category: categoryId,
      });

      setTitle("");
      setDescription("");
      setMenu("my");
      setMessage("Complaint submitted successfully.");
      await loadData();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_user");
    setUser(null);
    navigate("/", { replace: true });
  };

  const pendingCount = useMemo(
    () => complaints.filter((c) => c.status === "Pending").length,
    [complaints]
  );

  const resolvedCount = useMemo(
    () => complaints.filter((c) => c.status === "Resolved").length,
    [complaints]
  );

  const inProgressCount = useMemo(
    () => complaints.filter((c) => c.status === "In Progress").length,
    [complaints]
  );

  const recentComplaints = useMemo(
    () =>
      [...complaints]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3),
    [complaints]
  );

  const completionRate = useMemo(() => {
    if (complaints.length === 0) {
      return 0;
    }

    return Math.round((resolvedCount / complaints.length) * 100);
  }, [complaints, resolvedCount]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: FaHome },
    { key: "raise", label: "Raise Complaint", icon: FaPlus },
    { key: "my", label: "My Complaints", icon: FaList },
    { key: "profile", label: "Profile", icon: FaUser },
  ];

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  return (
    <div className="student-layout">
      <header className="student-header">
        <div>
          <p className="student-header-kicker">Student Portal</p>
          <h2>Campus Complaint Management System</h2>
        </div>

        <div className="student-header-user">
          <span>Welcome back</span>
          <strong>{user.name}</strong>
        </div>
      </header>

      <div className="student-main-section">
        <aside className="student-sidebar">
          <div className="student-menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  className={`student-menu-tile ${menu === item.key ? "active" : ""}`}
                  onClick={() => setMenu(item.key)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button className="student-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <main className="student-content">
          {menu === "dashboard" && (
            <>
              {error && <p className="student-status-message error">{error}</p>}
              {message && <p className="student-status-message success">{message}</p>}

              <section className="student-hero">
                <div>
                  <p className="student-hero-kicker">Student Space</p>
                  <h3>Track every complaint with complete clarity.</h3>
                  <p>
                    Raise issues in minutes, monitor progress live, and stay informed
                    until resolution.
                  </p>
                </div>

                <div className="student-hero-meta">
                  <span>{todayLabel}</span>
                  <strong>{completionRate}% resolved so far</strong>
                </div>
              </section>

              <div className="student-cards">
                <article className="student-card total">
                  <span className="student-card-label">Total Complaints</span>
                  <p>{complaints.length}</p>
                  <small>All issues submitted by you</small>
                </article>

                <article className="student-card pending">
                  <span className="student-card-label">Pending</span>
                  <p>{pendingCount}</p>
                  <small>Awaiting review by staff</small>
                </article>

                <article className="student-card in-progress">
                  <span className="student-card-label">In Progress</span>
                  <p>{inProgressCount}</p>
                  <small>Currently being worked on</small>
                </article>

                <article className="student-card resolved">
                  <span className="student-card-label">Resolved</span>
                  <p>{resolvedCount}</p>
                  <small>Closed successfully</small>
                </article>
              </div>

              <div className="student-info-grid">
                <section className="student-info-box">
                  <div className="student-section-heading">
                    <h3>Recent Activity</h3>
                    <span>{recentComplaints.length} latest</span>
                  </div>

                  {recentComplaints.length === 0 ? (
                    <p className="student-empty-state">
                      No recent complaints yet. Use Raise Complaint to get started.
                    </p>
                  ) : (
                    <ul className="student-recent-list">
                      {recentComplaints.map((complaint) => (
                        <li key={complaint._id} className="student-recent-item">
                          <div>
                            <p className="student-recent-item-title">{complaint.title}</p>
                            <p>{complaint.category?.name || "General"}</p>
                          </div>

                          <span
                            className={`student-status-pill ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="student-info-box">
                  <h3>About CCMS</h3>
                  <p>
                    Campus Complaint Management System is a transparent platform for
                    students to report and track issues in classrooms, hostels, and
                    facilities. It improves communication and speeds up resolution.
                  </p>
                </section>
              </div>
            </>
          )}

          {menu === "raise" && (
            <section className="student-form-box">
              <div className="student-section-heading">
                <h3>Raise Complaint</h3>
                <span>Share clear details for faster action</span>
              </div>

              {error && <p className="student-status-message error">{error}</p>}
              {message && <p className="student-status-message success">{message}</p>}

              <input
                type="text"
                placeholder="Complaint Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={addComplaint}
                disabled={submitting || categories.length === 0}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </section>
          )}

          {menu === "my" && (
            <section className="student-list-section">
              <div className="student-section-heading">
                <h3>My Complaints</h3>
                <span>{complaints.length} total records</span>
              </div>

              {loading ? (
                <p className="student-empty-state">Loading complaints...</p>
              ) : complaints.length === 0 ? (
                <p className="student-empty-state">No complaints yet.</p>
              ) : (
                <div className="student-table-wrap">
                  <table className="student-complaint-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td>{complaint._id.slice(-6)}</td>
                          <td>{complaint.title}</td>
                          <td>{complaint.category?.name || "N/A"}</td>
                          <td>
                            <span
                              className={`student-status-pill ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
                            </span>
                          </td>
                          <td>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {error && <p className="student-status-message error">{error}</p>}
            </section>
          )}

          {menu === "profile" && (
            <section className="student-profile-box">
              <h3>Profile</h3>

              <div className="student-profile-grid">
                <div className="student-profile-item">
                  <span>Name</span>
                  <strong>{user.name}</strong>
                </div>

                <div className="student-profile-item">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="student-profile-item">
                  <span>Role</span>
                  <strong>{user.role}</strong>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

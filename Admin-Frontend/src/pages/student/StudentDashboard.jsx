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

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  return (
    <div className="student-layout">
      <header className="student-header">
        <h2>Campus Complaint Management System</h2>
        <span>Welcome, {user.name}</span>
      </header>

      <div className="student-main-section">
        <aside className="student-sidebar">
          <div>
            <button className="student-menu-tile" onClick={() => setMenu("dashboard")}> 
              <FaHome /> Dashboard
            </button>
            <button className="student-menu-tile" onClick={() => setMenu("raise")}>
              <FaPlus /> Raise Complaint
            </button>
            <button className="student-menu-tile" onClick={() => setMenu("my")}>
              <FaList /> My Complaints
            </button>
            <button className="student-menu-tile" onClick={() => setMenu("profile")}>
              <FaUser /> Profile
            </button>
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

              <div className="student-cards">
                <article className="student-card blue">
                  <h3>Total Complaints</h3>
                  <p>{complaints.length}</p>
                </article>
                <article className="student-card orange">
                  <h3>Pending</h3>
                  <p>{pendingCount}</p>
                </article>
                <article className="student-card blue">
                  <h3>In Progress</h3>
                  <p>{inProgressCount}</p>
                </article>
                <article className="student-card green">
                  <h3>Resolved</h3>
                  <p>{resolvedCount}</p>
                </article>
              </div>

              <section className="student-info-box">
                <h3>About CCMS</h3>
                <p>
                  Campus Complaint Management System is a structured and transparent
                  platform for students to raise and track issues in college and
                  hostel facilities. The portal reduces manual work, improves
                  communication, and helps administrators resolve complaints faster.
                </p>
              </section>
            </>
          )}

          {menu === "raise" && (
            <section className="student-form-box">
              <h3>Raise Complaint</h3>

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
            <section>
              <h3>My Complaints</h3>

              {loading ? (
                <p>Loading complaints...</p>
              ) : complaints.length === 0 ? (
                <p>No complaints yet.</p>
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
                          <td>{complaint.status}</td>
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
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

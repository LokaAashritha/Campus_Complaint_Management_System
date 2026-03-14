import React, { useEffect, useMemo, useState } from "react";
import {
  FaHome,
  FaPlus,
  FaList,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import API from "../api/api";

function Dashboard({ user, onLogout }) {
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

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [categoriesRes, complaintsRes] = await Promise.all([
        API.get("/categories"),
        API.get("/complaints"),
      ]);

      setCategories(categoriesRes.data || []);

      if ((categoriesRes.data || []).length > 0) {
        setCategoryId(categoriesRes.data[0]._id);
      }

      setComplaints(complaintsRes.data || []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to load dashboard data.");
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
      await API.post("/complaints", {
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
      setError(apiError?.response?.data?.message || "Failed to create complaint.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="layout">

      {/* HEADER */}
      <div className="header">
        <h2>Campus Complaint Management System</h2>
        <span>Welcome, {user.name}</span>
      </div>

      <div className="main-section">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            <div className="menu-tile" onClick={() => setMenu("dashboard")}>
              <FaHome /> Dashboard
            </div>
            <div className="menu-tile" onClick={() => setMenu("raise")}>
              <FaPlus /> Raise Complaint
            </div>
            <div className="menu-tile" onClick={() => setMenu("my")}>
              <FaList /> My Complaints
            </div>
            <div className="menu-tile" onClick={() => setMenu("profile")}>
              <FaUser /> Profile
            </div>
          </div>

          <div className="logout" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* DASHBOARD */}
          {menu === "dashboard" && (
            <>
              {error && <p className="status-message error">{error}</p>}
              {message && <p className="status-message success">{message}</p>}

              <div className="cards">
                <div className="card blue">
                  <h3>Total Complaints</h3>
                  <p>{complaints.length}</p>
                </div>
                <div className="card orange">
                  <h3>Pending</h3>
                  <p>{pendingCount}</p>
                </div>
                <div className="card blue">
                  <h3>In Progress</h3>
                  <p>{inProgressCount}</p>
                </div>
                <div className="card green">
                  <h3>Resolved</h3>
                  <p>{resolvedCount}</p>
                </div>
              </div>

              <div className="info-box">
                <h3>About CCMS</h3>
                <p>
                  Campus Complaint Management System (CCMS) is a web-based application developed to provide a structured and transparent platform for students to raise and track complaints within a college or university campus.
                   The system allows students to log in, submit complaints with relevant details and supporting files, and monitor the status of their requests in real time.
                    It reduces manual paperwork, improves communication between students and administration, and ensures that issues are addressed efficiently. By maintaining digital records of all complaints, CCMS enhances accountability, speeds up resolution processes, and creates a more organized and responsive campus environment.
                </p>
              </div>
            </>
          )}

          {/* RAISE COMPLAINT */}
          {menu === "raise" && (
            <div className="form-box">
              <h3>Raise Complaint</h3>

              {error && <p className="status-message error">{error}</p>}
              {message && <p className="status-message success">{message}</p>}

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

              <button onClick={addComplaint} disabled={submitting || categories.length === 0}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}

          {/* MY COMPLAINTS - ROW WISE */}
          {menu === "my" && (
            <div>
              <h3>My Complaints</h3>

              {loading ? (
                <p>Loading complaints...</p>
              ) : complaints.length === 0 ? (
                <p>No complaints yet</p>
              ) : (
                <table className="complaint-table">
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
                    {complaints.map((c) => (
                      <tr key={c._id}>
                        <td>{c._id.slice(-6)}</td>
                        <td>{c.title}</td>
                        <td>{c.category?.name || "N/A"}</td>
                        <td>{c.status}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {error && <p className="status-message error">{error}</p>}
            </div>
          )}

          {/* PROFILE */}
          {menu === "profile" && (
            <div className="profile-box">
              <h3>Profile</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
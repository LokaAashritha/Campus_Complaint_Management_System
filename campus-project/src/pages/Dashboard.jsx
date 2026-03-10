
import React, { useState } from "react";
import {
  FaHome,
  FaPlus,
  FaList,
  FaUser,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";

function Dashboard({ user, setUser }) {
  const [menu, setMenu] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const addComplaint = () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    const newComplaint = {
      id: Date.now(),
      title,
      description,
      image: preview,
      status: "Pending",
    };

    setComplaints([...complaints, newComplaint]);
    setTitle("");
    setDescription("");
    setPreview(null);
    setMenu("my");
  };

  const deleteComplaint = (id) => {
    setComplaints(complaints.filter((c) => c.id !== id));
  };

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

          <div className="logout" onClick={() => setUser(null)}>
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* DASHBOARD */}
          {menu === "dashboard" && (
            <>
              <div className="cards">
                <div className="card blue">
                  <h3>Total Complaints</h3>
                  <p>{complaints.length}</p>
                </div>
                <div className="card orange">
                  <h3>Pending</h3>
                  <p>{complaints.length}</p>
                </div>
                <div className="card green">
                  <h3>Resolved</h3>
                  <p>0</p>
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

              <input
                type="text"
                placeholder="Complaint Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input type="file" accept="image/*" onChange={handleFileChange} />

              {preview && (
                <img src={preview} alt="preview" className="preview-img" />
              )}

              <button onClick={addComplaint}>Submit</button>
            </div>
          )}

          {/* MY COMPLAINTS - ROW WISE */}
          {menu === "my" && (
            <div>
              <h3>My Complaints</h3>

              {complaints.length === 0 ? (
                <p>No complaints yet</p>
              ) : (
                <table className="complaint-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td>{c.title}</td>
                        <td>{c.description}</td>
                        <td>
                          {c.image && (
                            <img
                              src={c.image}
                              alt="complaint"
                              className="table-img"
                            />
                          )}
                        </td>
                        <td>{c.status}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => deleteComplaint(c.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
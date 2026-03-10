import { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./settings.css";

function Settings() {
  const [enabled, setEnabled] = useState(true);

  const users = [
    { id: 1, name: "Jessy", email: "jessy@gmail.com" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com" },
  ];

  return (
    <AdminLayout>
      <div className="settings-page">
        <h2>Settings</h2>

        {/* Admin Profile */}
        <div className="settings-card">
          <h3>Admin Profile</h3>

          <div className="profile-row">
            <div className="profile-avatar">👤</div>

            <div style={{ flex: 1 }}>
              <div className="form-group">
                <label>Name</label>
                <input value="Admin" readOnly />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input value="admin@college.edu" readOnly />
              </div>

              <button className="primary-btn">Save Changes</button>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="settings-card">
          <h3>User Management</h3>

          <div className="toggle-row">
            <div
              className={`toggle ${enabled ? "active" : ""}`}
              onClick={() => setEnabled(!enabled)}
            >
              <span />
            </div>
            <span>Enable Student Accounts</span>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="user-action">Reset Password</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="primary-btn" style={{ marginTop: "16px" }}>
            View All Users
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Settings;

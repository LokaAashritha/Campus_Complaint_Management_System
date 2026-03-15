import { useEffect, useState } from "react";
import API from "../../api/api";
import AdminLayout from "./AdminLayout";
import "./settings.css";

function getStoredAdmin() {
  try {
    const raw = localStorage.getItem("admin_user");

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function Settings() {
  const [enabled, setEnabled] = useState(true);
  const [adminProfile, setAdminProfile] = useState(getStoredAdmin);
  const [users, setUsers] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettingsData = async () => {
      setError("");
      setLoadingProfile(true);
      setLoadingUsers(true);

      try {
        const [profileRes, usersRes] = await Promise.all([
          API.get("/admin/profile"),
          API.get("/admin/users"),
        ]);

        const fetchedProfile = profileRes.data || null;
        const fetchedUsers = Array.isArray(usersRes.data) ? usersRes.data : [];

        setAdminProfile(fetchedProfile);
        setUsers(fetchedUsers);

        if (fetchedProfile) {
          localStorage.setItem("admin_user", JSON.stringify(fetchedProfile));
        }
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Failed to load settings data.");
      } finally {
        setLoadingProfile(false);
        setLoadingUsers(false);
      }
    };

    fetchSettingsData();
  }, []);

  return (
    <AdminLayout>
      <div className="settings-page">
        <h2>Settings</h2>

        {error && <p className="settings-message error">{error}</p>}

        {/* Admin Profile */}
        <div className="settings-card">
          <h3>Admin Profile</h3>

          <div className="profile-row">
            <div className="profile-avatar">👤</div>

            <div style={{ flex: 1 }}>
              {loadingProfile ? (
                <p className="settings-muted">Loading admin profile...</p>
              ) : (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input value={adminProfile?.name || "N/A"} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input value={adminProfile?.email || "N/A"} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input value={adminProfile?.role || "admin"} readOnly />
                  </div>
                </>
              )}
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

          {loadingUsers ? (
            <p className="settings-muted">Loading registered users...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined On</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="settings-muted">
                      No registered student users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Settings;

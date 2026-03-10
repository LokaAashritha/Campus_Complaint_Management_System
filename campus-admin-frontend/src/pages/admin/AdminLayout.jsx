import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "#1f2937",
          color: "#ffffff",
          padding: "20px",
          flexShrink: 0,
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Admin Panel</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link to="/admin" className="admin-link">Dashboard</Link>
          <Link to="/admin/complaints" className="admin-link">All Complaints</Link>
          <Link to="/admin/assign" className="admin-link">Assign Staff</Link>
          <Link to="/admin/categories" className="admin-link">Categories</Link>
          <Link to="/admin/reports" className="admin-link">Reports</Link>
          <Link to="/admin/settings" className="admin-link">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "24px",
          backgroundColor: "#f4f6f8",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;

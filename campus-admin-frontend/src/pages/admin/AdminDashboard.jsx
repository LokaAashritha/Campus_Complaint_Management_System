import "./AdminDashboard.css";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

const stats = [
  { label: "Total Complaints", value: 128, color: "blue" },
  { label: "Pending Complaints", value: 23, color: "orange" },
  { label: "Resolved Complaints", value: 85, color: "green" },
  { label: "High Priority", value: 12, color: "purple" },
];

const statusData = [
  { name: "Pending", value: 23 },
  { name: "In Progress", value: 20 },
  { name: "Resolved", value: 85 },
];

const categoryData = [
  { name: "Network", value: 30 },
  { name: "Hostel", value: 25 },
  { name: "Infrastructure", value: 40 },
  { name: "Security", value: 33 },
];

const COLORS = ["#2563eb", "#f97316", "#16a34a", "#7c3aed"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h2 className="dashboard-title">Welcome, Admin!</h2>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-top">
              <div className="stat-icon" />
              <span className="stat-label">{s.label}</span>
            </div>
            <h3>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts + Actions */}
      <div className="charts-grid">
        {/* Category */}
        <div className="card">
          <h3>Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={75}
                outerRadius={115}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status */}
        <div className="card">
          <h3>Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions – NOW FUNCTIONAL */}
        <div className="card actions">
          <h3>Quick Actions</h3>

          <button
            className="primary"
            onClick={() => navigate("/admin/complaints/new")}
          >
            ➕ Add New Complaint
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/admin/categories")}
          >
            📂 Manage Categories
          </button>

          <button
            className="outline"
            onClick={() => navigate("/admin/reports")}
          >
            📊 View Reports
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
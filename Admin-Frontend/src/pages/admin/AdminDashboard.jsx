// import "./AdminDashboard.css";
// import AdminLayout from "./AdminLayout";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LabelList,
// } from "recharts";

// const stats = [
//   { label: "Total Complaints", value: 128, color: "blue" },
//   { label: "Pending Complaints", value: 23, color: "orange" },
//   { label: "Resolved Complaints", value: 85, color: "green" },
//   { label: "High Priority", value: 12, color: "purple" },
// ];

// const statusData = [
//   { name: "Pending", value: 23 },
//   { name: "In Progress", value: 20 },
//   { name: "Resolved", value: 85 },
// ];

// const categoryData = [
//   { name: "Network", value: 30 },
//   { name: "Hostel", value: 25 },
//   { name: "Infrastructure", value: 40 },
//   { name: "Security", value: 33 },
// ];

// const COLORS = ["#2563eb", "#f97316", "#16a34a", "#7c3aed"];

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   return (
//     <AdminLayout>
//       <h2 className="dashboard-title">Welcome, Admin!</h2>

//       {/* Stats */}
//       <div className="stats-grid">
//         {stats.map((s) => (
//           <div key={s.label} className={`stat-card ${s.color}`}>
//             <div className="stat-top">
//               <div className="stat-icon" />
//               <span className="stat-label">{s.label}</span>
//             </div>
//             <h3>{s.value}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Charts + Actions */}
//       <div className="charts-grid">
//         {/* Category */}
//         <div className="card">
//           <h3>Complaints by Category</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 dataKey="value"
//                 nameKey="name"
//                 innerRadius={75}
//                 outerRadius={115}
//               >
//                 {categoryData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Status */}
//         <div className="card">
//           <h3>Complaints by Status</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={statusData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]}>
//                 <LabelList dataKey="value" position="top" />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Quick Actions – NOW FUNCTIONAL */}
//         <div className="card actions">
//           <h3>Quick Actions</h3>

//           <button
//             className="primary"
//             onClick={() => navigate("/admin/complaints/new")}
//           >
//             ➕ Add New Complaint
//           </button>

//           <button
//             className="secondary"
//             onClick={() => navigate("/admin/categories")}
//           >
//             📂 Manage Categories
//           </button>

//           <button
//             className="outline"
//             onClick={() => navigate("/admin/reports")}
//           >
//             📊 View Reports
//           </button>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import "./AdminDashboard.css";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/api";

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

const COLORS = ["#2563eb", "#f97316", "#16a34a", "#7c3aed"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/admin/complaints");
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints", error);
      }
    };

    fetchComplaints();
  }, []);

  /* ==============================
     CALCULATE STATS FROM DATABASE
     ============================== */

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  /* ==============================
     DATA FOR CARDS
     ============================== */

  const stats = [
    { label: "Total Complaints", value: totalComplaints, color: "blue" },
    { label: "Pending Complaints", value: pendingComplaints, color: "orange" },
    { label: "Resolved Complaints", value: resolvedComplaints, color: "green" },
    { label: "In Progress", value: inProgressComplaints, color: "purple" },
  ];

  /* ==============================
     DATA FOR CHARTS
     ============================== */

  const statusData = [
    { name: "Pending", value: pendingComplaints },
    { name: "In Progress", value: inProgressComplaints },
    { name: "Resolved", value: resolvedComplaints },
  ];

  const categoryMap = {};

  complaints.forEach((c) => {
    const category = c.category?.name || "Other";

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category]++;
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

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

        {/* Category Chart */}
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
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Chart */}
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

        {/* Quick Actions */}
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
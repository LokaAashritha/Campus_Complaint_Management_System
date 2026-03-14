import "../../styles/Reports.css";
import AdminLayout from "./AdminLayout";
import { REPORTS_DATA } from "../../data/reportsData";
import { useState } from "react";

export default function Reports() {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredReports = REPORTS_DATA.filter((r) => {
    const categoryMatch =
      category === "All" || r.category === category;
    const statusMatch =
      status === "All" || r.status === status;
    return categoryMatch && statusMatch;
  });

  const openCount = filteredReports.filter(
    (r) => r.status === "Open"
  ).length;

  const resolvedCount = filteredReports.filter(
    (r) => r.status === "Resolved"
  ).length;

  const overdueCount = filteredReports.filter(
    (r) => r.status === "Overdue"
  ).length;

  return (
    <AdminLayout>
      <div className="breadcrumb">Admin / Reports</div>

      <h1 className="page-title">Reports</h1>
      <p className="page-subtitle">
        Complaint statistics and detailed report view
      </p>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card yellow">
          <h2>{openCount}</h2>
          <p>Open</p>
        </div>
        <div className="stat-card green">
          <h2>{resolvedCount}</h2>
          <p>Resolved</p>
        </div>
        <div className="stat-card red">
          <h2>{overdueCount}</h2>
          <p>Overdue</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="report-card">
        <h3>Generate Report</h3>

        <div className="filters">
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option>Network</option>
            <option>Hostel</option>
            <option>Infrastructure</option>
            <option>Security</option>
          </select>

          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option>Open</option>
            <option>Resolved</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned Staff</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>
                  <span
                    className={
                      r.status === "Open"
                        ? "badge open"
                        : r.status === "Resolved"
                        ? "badge resolved"
                        : "badge overdue"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.priority}</td>
                <td>{r.assignedStaff}</td>
                <td>{r.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
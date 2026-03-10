import "./AllComplaints.css";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const DATA = [
  { id: 3021, title: "WiFi not working", category: "Network", student: "ST1045", date: "2024-04-24", status: "Pending", priority: "High" },
  { id: 2041, title: "Water leakage in hostel", category: "Hostel", student: "ST2033", date: "2024-04-23", status: "In Progress", priority: "Normal" },
  { id: 3301, title: "Classroom projector issue", category: "Infrastructure", student: "ST3307", date: "2024-04-21", status: "Resolved", priority: "Normal" },
  { id: 1120, title: "Broken door lock", category: "Security", student: "ST1502", date: "2024-04-20", status: "Pending", priority: "High" },
  { id: 2155, title: "No hot water in bathroom", category: "Hostel", student: "ST2871", date: "2024-04-19", status: "Resolved", priority: "Normal" },
];

export default function AllComplaints() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  // 🔍 Filter + Search Logic
  const filtered = useMemo(() => {
    return DATA.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.student.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "All" || c.category === category;
      const matchesStatus = status === "All" || c.status === status;
      const matchesPriority = priority === "All" || c.priority === priority;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [search, category, status, priority]);

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="complaints-header">
        <h2>All Complaints</h2>
        <button
          className="create-btn"
          onClick={() => navigate("/admin/complaints/new")}
        >
          + Create Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <input
          className="search-input"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="filters-row">
          <select onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Network</option>
            <option>Hostel</option>
            <option>Infrastructure</option>
            <option>Security</option>
          </select>

          <select onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select onChange={(e) => setPriority(e.target.value)}>
            <option>All</option>
            <option>High</option>
            <option>Normal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Student</th>
              <th>Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td className="link">{c.category}</td>
                <td>{c.student}</td>
                <td>{new Date(c.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge status ${c.status.replace(" ", "-").toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <span className={`badge priority ${c.priority.toLowerCase()}`}>
                    {c.priority}
                  </span>
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/admin/complaints/${c.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
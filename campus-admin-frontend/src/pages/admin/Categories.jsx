import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    { name: "Network", staff: "IT Team" },
    { name: "Hostel", staff: "Maintenance Team" },
    { name: "Infrastructure", staff: "Admin Team" },
    { name: "Security", staff: "Security Team" },
  ];

  return (
    <AdminLayout>
      <h2>Manage Categories</h2>

      <table style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Assigned Staff</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.staff}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/admin/assign-staff/${c.name}`)
                  }
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
import "../../styles/AssignStaff.css";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import {
  getAssignments,
  saveAssignments,
} from "../../data/staffAssignments";

const STAFF_OPTIONS = [
  { label: "IT Team", icon: "💻" },
  { label: "Maintenance Team", icon: "🛠️" },
  { label: "Admin Team", icon: "🗂️" },
  { label: "Security Team", icon: "🛡️" },
];

const CATEGORY_ICONS = {
  Network: "🌐",
  Hostel: "🏠",
  Infrastructure: "🏗️",
  Security: "🔒",
};

export default function AssignStaff() {
  const [assignments, setAssignments] = useState(getAssignments());
  const [saved, setSaved] = useState(false);

  const handleChange = (category, staff) => {
    setAssignments({ ...assignments, [category]: staff });
    setSaved(false);
  };

  const handleSave = () => {
    saveAssignments(assignments);
    setSaved(true);
  };

  return (
    <AdminLayout>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Manage Categories / Assign Staff
      </div>

      {/* Header */}
      <div className="assign-header">
        <h2>Assign Staff to Categories</h2>
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      {/* Card */}
      <div className="assign-card">
        <div className="assign-row header">
          <span>Category</span>
          <span>Assigned Staff</span>
        </div>

        {Object.entries(assignments).map(
          ([category, staff]) => (
            <div className="assign-row" key={category}>
              <div className="category">
                <span className="icon">
                  {CATEGORY_ICONS[category]}
                </span>
                {category}
              </div>

              <select
                value={staff}
                onChange={(e) =>
                  handleChange(category, e.target.value)
                }
              >
                {STAFF_OPTIONS.map((s) => (
                  <option key={s.label}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>
          )
        )}

        {saved && (
          <div className="success">
            ✔ Changes saved successfully.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
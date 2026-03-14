import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../api/api";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/admin/complaints");
        const found = (res.data || []).find((item) => item._id === id);

        if (!found) {
          setError("Complaint not found.");
          return;
        }

        setComplaint(found);
        setStatus(found.status);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const updateStatus = async () => {
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await API.put(`/admin/complaints/${id}/status`, {
        status,
      });

      setComplaint((previous) => ({
        ...previous,
        status: res.data.status,
      }));

      setMessage("Complaint status updated successfully.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h2>Complaint Details</h2>

      {loading && <p>Loading complaint details...</p>}

      {!loading && error && (
        <p style={{ color: "#b91c1c" }}>{error}</p>
      )}

      {!loading && complaint && (
        <>
          <p><strong>Complaint ID:</strong> {complaint._id}</p>
          <p><strong>Title:</strong> {complaint.title}</p>
          <p><strong>Category:</strong> {complaint.category?.name || "N/A"}</p>
          <p><strong>Student:</strong> {complaint.user?.name || "N/A"}</p>
          <p><strong>Description:</strong> {complaint.description}</p>

          <hr />

          <label>Status</label><br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <br /><br />

          <label>Admin Remark</label><br />
          <textarea
            rows="4"
            style={{ width: "100%" }}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remarks..."
          />

          <br /><br />

          {message && (
            <p style={{ color: "#166534" }}>{message}</p>
          )}

          <button onClick={updateStatus} disabled={saving}>
            {saving ? "Updating..." : "Update Complaint"}
          </button>
        </>
      )}
    </AdminLayout>
  );
}

export default ComplaintDetails;

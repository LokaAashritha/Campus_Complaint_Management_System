import { useParams } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

function ComplaintDetails() {
  const { id } = useParams();

  // Mock complaint data
  const [status, setStatus] = useState("Pending");
  const [remark, setRemark] = useState("");

  return (
    <AdminLayout>
      <h2>Complaint Details</h2>

      <p><strong>Complaint ID:</strong> {id}</p>
      <p><strong>Title:</strong> WiFi not working</p>
      <p><strong>Category:</strong> Network</p>
      <p><strong>Student:</strong> ST1023</p>
      <p><strong>Description:</strong> Internet is not available in hostel block A.</p>

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

      <button onClick={() => alert("Status updated (mock)")}>
        Update Complaint
      </button>
    </AdminLayout>
  );
}

export default ComplaintDetails;

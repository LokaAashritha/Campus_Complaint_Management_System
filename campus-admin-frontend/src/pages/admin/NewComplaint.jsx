import AdminLayout from "./AdminLayout";

export default function NewComplaint() {
  return (
    <AdminLayout>
      <h2>Add New Complaint</h2>

      <form style={{ maxWidth: "500px", marginTop: "20px" }}>
        <label>Title</label>
        <input type="text" style={{ width: "100%", marginBottom: "10px" }} />

        <label>Category</label>
        <select style={{ width: "100%", marginBottom: "10px" }}>
          <option>Network</option>
          <option>Hostel</option>
          <option>Infrastructure</option>
          <option>Security</option>
        </select>

        <label>Description</label>
        <textarea
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit">Submit Complaint</button>
      </form>
    </AdminLayout>
  );
}
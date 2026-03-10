import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewComplaint from "./pages/admin/NewComplaint";
import AllComplaints from "./pages/admin/AllComplaints";
import ComplaintDetails from "./pages/admin/ComplaintDetails";
import AssignStaff from "./pages/admin/AssignStaff";
import Categories from "./pages/admin/Categories";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/complaints/new" element={<NewComplaint />} />
        <Route path="/admin/complaints" element={<AllComplaints />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/admin/assign" element={<AssignStaff />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

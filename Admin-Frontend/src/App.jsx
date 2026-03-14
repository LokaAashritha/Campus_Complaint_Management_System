import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentAuth from "./pages/student/StudentAuth";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewComplaint from "./pages/admin/NewComplaint";
import AllComplaints from "./pages/admin/AllComplaints";
import ComplaintDetails from "./pages/admin/ComplaintDetails";
import AssignStaff from "./pages/admin/AssignStaff";
import Categories from "./pages/admin/Categories";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/AdminLogin";

function hasSession(tokenKey, userKey, expectedRole) {
  const token = localStorage.getItem(tokenKey);
  const rawUser = localStorage.getItem(userKey);

  if (!token || !rawUser) {
    return false;
  }

  try {
    const user = JSON.parse(rawUser);

    return user?.role === expectedRole;
  } catch {
    return false;
  }
}

function hasAdminSession() {
  return hasSession("admin_token", "admin_user", "admin");
}

function hasStudentSession() {
  return hasSession("student_token", "student_user", "student");
}

function RequireAdmin({ children }) {
  if (!hasAdminSession()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function RequireStudent({ children }) {
  if (!hasStudentSession()) {
    return <Navigate to="/student/login" replace />;
  }

  return children;
}

function App() {
  const studentHome = hasStudentSession()
    ? "/student/dashboard"
    : "/student/login";
  const adminHome = hasAdminSession() ? "/admin" : "/admin/login";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/student" element={<Navigate to={studentHome} replace />} />
        <Route
          path="/student/login"
          element={<StudentAuth initialMode="login" />}
        />
        <Route
          path="/student/register"
          element={<StudentAuth initialMode="register" />}
        />
        <Route
          path="/student/dashboard"
          element={
            <RequireStudent>
              <StudentDashboard />
            </RequireStudent>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/complaints/new"
          element={
            <RequireAdmin>
              <NewComplaint />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <RequireAdmin>
              <AllComplaints />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/complaints/:id"
          element={
            <RequireAdmin>
              <ComplaintDetails />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/assign"
          element={
            <RequireAdmin>
              <AssignStaff />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/assign-staff/:name"
          element={
            <RequireAdmin>
              <AssignStaff />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RequireAdmin>
              <Categories />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RequireAdmin>
              <Reports />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RequireAdmin>
              <Settings />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
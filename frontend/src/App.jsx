import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from './components/Layout/DashboardLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import CourseRegistrationPage from './pages/Student/CourseRegistrationPage';
import StudentGradesPage from './pages/Student/StudentGradesPage';
import StudentSchedulePage from './pages/Student/StudentSchedulePage';

import TeacherClassListPage from './pages/Teacher/TeacherClassListPage';
import TeacherClassDetailPage from './pages/Teacher/TeacherClassDetailPage';

import AdminMonHocCRUDPage from './pages/Admin/AdminMonHocCRUDPage';
import AdminLopTinChiCRUDPage from './pages/Admin/AdminLopTinChiCRUDPage';
import AdminApprovePage from './pages/Admin/AdminApprovePage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Set HomePage as the index route for the layout */}
        <Route index element={<HomePage />} />

        {/* --- Route cho Giảng viên --- */}
        <Route path="thong-tin-ca-nhan" element={<ProfilePage />} />
        <Route path="sinh-vien/dang-ky" element={<CourseRegistrationPage />} />
        <Route path="sinh-vien/ket-qua" element={<StudentGradesPage />} />
        <Route path="sinh-vien/lich-hoc" element={<StudentSchedulePage />} />

        {/* --- Route cho Giảng viên --- */}
        <Route path="giang-vien/lop-hoc" element={<TeacherClassListPage />} />
        <Route path="giang-vien/lop/:id/sinh-vien-diem" element={<TeacherClassDetailPage />} />

        {/* --- Route cho Admin --- */}
        <Route path="admin/mon-hoc" element={<AdminMonHocCRUDPage />} />
        <Route path="admin/lop-tin-chi" element={<AdminLopTinChiCRUDPage />} />

        {/* Các route con khác sẽ render bên trong <Outlet /> của DashboardLayout */}
      </Route>

      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}
export default App;
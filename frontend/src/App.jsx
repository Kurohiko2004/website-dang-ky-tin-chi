import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from './components/Layout/DashboardLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import DangKyHocPhanPage from './pages/Student/DangKyHocPhanPage';

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
        <Route path="thong-tin-ca-nhan" element={<ProfilePage />} />
        <Route path="sinh-vien/dang-ky" element={<DangKyHocPhanPage />} />


        {/* --- Thêm các route khác cho Sinh viên --- */}
        {/* <Route path="sinh-vien/lich-hoc" element={<StudentSchedulePage />} /> */}
        {/* <Route path="sinh-vien/ket-qua" element={<StudentGradesPage />} /> */}

        {/* --- Thêm các route cho Giảng viên --- */}
        {/* <Route path="giang-vien/lop-hoc" element={<TeacherClassListPage />} /> */}

        {/* --- Thêm các route cho Admin --- */}
        {/* <Route path="admin/duyet-don" element={<AdminApprovePage />} /> */}
        {/* ... các route quản lý khác ... */}

        {/* Các route con khác sẽ render bên trong <Outlet /> của DashboardLayout */}
      </Route>

      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}
export default App;
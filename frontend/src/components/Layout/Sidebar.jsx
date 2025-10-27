// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling

// Simple example - style with Tailwind
const linkStyle = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
const activeLinkStyle = "bg-blue-800 text-white"; // Style for the active link

function Sidebar({ userRole }) {
    return (
        <aside className="w-64 bg-gray-800 text-gray-100 p-4 space-y-2 hidden md:block"> {/* Hide on small screens */}
            <h2 className="text-xl font-semibold mb-4 text-center">SLINK</h2>
            <nav>
                {/* Common Links */}
                <NavLink
                    to="/"
                    className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}
                    end // 'end' prop ensures it's only active for the exact path '/'
                >
                    Trang chủ
                </NavLink>
                <NavLink
                    to="/thong-tin-ca-nhan" // Define this route later
                    className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}
                >
                    Thông tin cá nhân
                </NavLink>

                {/* Student Links */}
                {userRole === 'sinhvien' && (
                    <>
                        <NavLink to="/sinh-vien/dang-ky" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Đăng ký học phần</NavLink>
                        <NavLink to="/sinh-vien/lich-hoc" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Lịch học</NavLink>
                        <NavLink to="/sinh-vien/ket-qua" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Kết quả học tập</NavLink>
                    </>
                )}

                {/* Teacher Links */}
                {userRole === 'giangvien' && (
                    <>
                        <NavLink to="/giang-vien/lop-hoc" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Lớp giảng dạy</NavLink>
                        {/* Add link for grade entry page */}
                    </>
                )}

                {/* Admin Links */}
                {userRole === 'admin' && (
                    <>
                        <NavLink to="/admin/duyet-don" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Duyệt đơn</NavLink>
                        <NavLink to="/admin/mon-hoc" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Quản lý Môn học</NavLink>
                        <NavLink to="/admin/lop-tin-chi" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Quản lý Lớp tín chỉ</NavLink>
                    </>
                )}

                {/* More links... */}
            </nav>
        </aside>
    );
}

export default Sidebar;
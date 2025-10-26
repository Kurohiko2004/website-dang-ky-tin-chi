// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../lib/api';

function HomePage() {
    // --- State for user info, loading, and errors ---
    const { user, token } = useContext(AuthContext); // Get role and token from context
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Fetch user info when component mounts or user/token changes ---
    useEffect(() => {
        // Don't fetch if user/token isn't ready from context
        if (!user || !token) {
            setLoading(false); // Stop loading if no user context yet
            return;
        }

        const fetchUserInfo = async () => {
            setLoading(true);
            setError(null);
            let apiUrl = '';

            // Determine API endpoint based on user role from context
            switch (user.vaiTro) {
                case 'sinhvien':
                    apiUrl = '/sinh-vien/thong-tin';
                    break;
                case 'giangvien':
                    apiUrl = '/giang-vien/thong-tin';
                    break;
                case 'admin':
                    apiUrl = '/admin/thong-tin';
                    break;
                default:
                    setError('Vai trò người dùng không xác định.');
                    setLoading(false);
                    return;
            }

            try {
                // Use the api utility (which includes the token)
                const response = await api.get(apiUrl);
                setUserInfo(response.data); // Assuming API returns { message: '...', data: {...} }
            } catch (err) {
                console.error("Error fetching user info for homepage:", err);
                setError(err.message || 'Không thể tải thông tin.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user, token]); // Dependencies: re-run if user or token changes

    // --- Render component based on state ---
    if (loading) {
        return <div className="text-center p-4">Đang tải thông tin...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
    }

    if (!userInfo) {
        // This might happen briefly or if the API call fails silently
        return <div className="text-center p-4">Không có thông tin người dùng.</div>;
    }

    // --- Display User Information (Styled with Tailwind) ---
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-xl font-bold mb-4 text-red-700">Thông tin {user.vaiTro === 'sinhvien' ? 'sinh viên' : (user.vaiTro === 'giangvien' ? 'giảng viên' : 'quản trị viên')}</h1>
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2"> {/* Use grid for layout */}
                {/* Use key-value pairs */}
                <div className="col-span-1"><strong className="w-24 inline-block">Mã số:</strong> {userInfo.id}</div>
                <div className="col-span-1"><strong className="w-24 inline-block">Họ tên:</strong> {userInfo.hoTen}</div>
                {userInfo.ngaySinh && (
                    <div className="col-span-1"><strong className="w-24 inline-block">Ngày sinh:</strong> {new Date(userInfo.ngaySinh).toLocaleDateString('vi-VN')}</div>
                )}
                {/* Add Giới tính if available in your model */}
                {/* <div className="col-span-1"><strong className="w-24 inline-block">Giới tính:</strong> {userInfo.gioiTinh || 'N/A'}</div> */}
                <div className="col-span-1"><strong className="w-24 inline-block">Email:</strong> {userInfo.email}</div>
                {/* Add Email 2 if needed */}
                {/* <div className="col-span-1"><strong className="w-24 inline-block">Email 2:</strong> {userInfo.email2 || userInfo.email}</div> */}
                {/* Add Nơi sinh if available */}
                {/* <div className="col-span-1"><strong className="w-24 inline-block">Nơi sinh:</strong> {userInfo.noiSinh || 'N/A'}</div> */}
                {/* Add Hiện diện status if available */}
                {/* <div className="col-span-1"><strong className="w-24 inline-block">Hiện diện:</strong> {userInfo.hienDien || 'N/A'}</div> */}

                {/* Add other fields based on user role and data model */}

            </div>
        </div>
    );
}

export default HomePage;
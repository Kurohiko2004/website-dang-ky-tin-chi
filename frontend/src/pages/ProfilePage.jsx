// src/pages/ProfilePage.jsx (Example)
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../lib/api'; // Assuming you create an api utility (see below)

function ProfilePage() {
    const { user, token } = useContext(AuthContext); // Get role and token
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !token) return; // Wait until user info is available

        const fetchUserInfo = async () => {
            setLoading(true);
            setError(null);
            let apiUrl = '';

            // Determine the correct API endpoint based on role
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
                // Use a utility to make the API call with the token
                const response = await api.get(apiUrl, token);
                setUserInfo(response.data); // Assuming API returns { message: '...', data: {...} }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message || 'Không thể tải thông tin cá nhân.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user, token]); // Re-run if user or token changes

    if (loading) return <div>Đang tải thông tin...</div>;
    if (error) return <div className="text-red-500">Lỗi: {error}</div>;
    if (!userInfo) return <div>Không có thông tin để hiển thị.</div>;

    // Render the user information (similar structure to the image)
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-xl font-bold mb-4">Thông tin cá nhân</h1>
            <div className="border-t pt-4">
                {/* Example: Displaying some fields */}
                <p><strong>Mã số:</strong> {userInfo.id}</p>
                <p><strong>Họ và tên:</strong> {userInfo.hoTen}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                {/* Add more fields as needed based on your user models */}
                {userInfo.ngaySinh && <p><strong>Ngày sinh:</strong> {new Date(userInfo.ngaySinh).toLocaleDateString('vi-VN')}</p>}
                {/* ... etc ... */}
            </div>
        </div>
    );
}

export default ProfilePage;
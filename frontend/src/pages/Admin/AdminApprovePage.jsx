// src/pages/Admin/AdminDuyetDonPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Search, CheckCircle, XCircle, AlertCircle, FileText, Clock } from 'lucide-react';

// Component thông báo (Giả sử bạn đã có, hoặc dùng tạm)
function Notification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    return (<div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white`}><Icon size={20} />{message}<button onClick={onClose} className="ml-2">&times;</button></div>);
}

function AdminDuyetDonPage() {
    const { user } = useContext(AuthContext); // Lấy thông tin Admin nếu cần
    const [registrations, setRegistrations] = useState([]); // Danh sách đơn chờ duyệt
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [processingId, setProcessingId] = useState(null); // ID của đơn đang được xử lý

    // --- Fetch danh sách đơn chờ duyệt ---
    useEffect(() => {
        const fetchPendingRegistrations = async () => {
            setLoading(true);
            setNotification(null);
            try {
                // Gọi API lấy các đơn 'Chờ duyệt'
                const response = await api.get('/admin/duyet-don');
                // setRegistrations(response.data || []); // Lấy mảng data
                setRegistrations(response || []); // bỏ .data
                console.log("Fetched pending registrations:", response);

                // console.log("Full response object:", response);
                console.log("response.data:", response.data);



            } catch (err) {
                console.error("Error fetching pending registrations:", err);
                showNotification(`Lỗi tải danh sách: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchPendingRegistrations();
    }, []); // Chỉ chạy 1 lần

    // --- Lọc danh sách (Client-side) ---
    const filteredRegistrations = registrations.filter(reg =>
        (reg.SinhVien?.hoTen && reg.SinhVien.hoTen.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reg.SinhVien?.id && reg.SinhVien.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reg.LopTinChi?.id && reg.LopTinChi.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reg.LopTinChi?.MonHoc?.ten && reg.LopTinChi.MonHoc.ten.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Hàm hiển thị thông báo ---
    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    // --- Xử lý Duyệt hoặc Từ chối ---
    const handleProcessRegistration = async (id, newStatus) => {
        setProcessingId(id); // Đánh dấu đơn này đang được xử lý (để disable nút)
        showNotification('Đang xử lý...', 'info');

        try {
            // Gọi API PUT để cập nhật trạng thái
            await api.put(`/admin/duyet-don/${id}`, { trangThaiMoi: newStatus });

            // Xóa đơn đã xử lý khỏi danh sách state
            setRegistrations(prev => prev.filter(reg => reg.id !== id));
            showNotification(newStatus === 'Đã duyệt' ? 'Duyệt đơn thành công!' : 'Từ chối đơn thành công!', 'success');

        } catch (err) {
            console.error("Failed to process registration:", err);
            // Hiển thị lỗi từ backend (ví dụ: lỗi hết slot)
            if (err.response && err.response.data && err.response.data.message) {
                showNotification(`Lỗi: ${err.response.data.message}`, 'error');
            } else {
                showNotification(`Lỗi: ${err.message || 'Không thể xử lý đơn.'}`, 'error');
            }
        } finally {
            setProcessingId(null); // Hoàn tất xử lý
        }
    };

    // --- Render ---
    if (loading) return <div className="p-6 text-center">Đang tải danh sách đơn chờ duyệt...</div>;

    return (
        <div className="space-y-6">
            {/* Notification Area */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-7 h-7 text-blue-600" />
                        Duyệt Đơn Đăng Ký
                    </h1>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {registrations.length} đơn chờ duyệt
                    </span>
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên SV, mã SV, mã lớp, tên môn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Results Table - Hiển thị dạng bảng */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">STT</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sinh viên</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mã SV</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mã Lớp HP</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tên Môn học</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Kỳ/Năm</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRegistrations.length === 0 && !loading && (
                                <tr><td colSpan="7" className="text-center p-4 text-gray-500">
                                    <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                                    Không tìm thấy đơn chờ duyệt nào.
                                </td></tr>
                            )}
                            {filteredRegistrations.map((req, index) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3 text-center text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-3 py-3 text-sm font-medium text-gray-900">{req.SinhVien?.hoTen || 'N/A'}</td>
                                    <td className="px-3 py-3 text-sm text-gray-500">{req.SinhVien?.id || 'N/A'}</td>
                                    <td className="px-3 py-3 text-sm font-medium text-blue-700">{req.LopTinChi?.id || 'N/A'}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{req.LopTinChi?.MonHoc?.ten || 'N/A'}</td>
                                    <td className="px-3 py-3 text-center text-sm text-gray-500">
                                        {req.LopTinChi?.kyHoc} / {req.LopTinChi?.namHoc}
                                    </td>
                                    <td className="px-3 py-3 text-center space-x-2">
                                        <button
                                            onClick={() => handleProcessRegistration(req.id, 'Đã duyệt')}
                                            disabled={processingId === req.id} // Vô hiệu hóa nút khi đang xử lý
                                            className="px-2.5 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400"
                                            title="Duyệt đơn"
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleProcessRegistration(req.id, 'Từ chối')}
                                            disabled={processingId === req.id}
                                            className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400"
                                            title="Từ chối đơn"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDuyetDonPage;
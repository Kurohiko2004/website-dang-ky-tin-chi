// src/pages/Admin/AdminClassCRUDPage.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Search, Edit2, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Users, Calendar, Clock, User, BookOpen } from 'lucide-react';

// Component thông báo (Giả sử bạn đã có)
function Notification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const Icon = type === 'success' ? CheckCircle : AlertCircle; // Simplified icon choice
    return (<div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white`}><Icon size={20} />{message}<button onClick={onClose} className="ml-2">&times;</button></div>);
}

// Giá trị khởi tạo cho form
const initialFormState = {
    id: '', // Mã lớp tín chỉ
    kyHoc: '',
    namHoc: '',
    ngayHoc: '',
    kipHoc: '',
    phongHoc: '',
    toaNha: '',
    soLuongToiDa: '',
    MonHoc_id: '',
    GiangVien_id: ''
};

function AdminLopTinChiCRUDPage() {
    // const { user, token } = useContext(AuthContext); // Xác thực Admin đã được xử lý bởi ProtectedRoute/Layout
    const [classes, setClasses] = useState([]); // Danh sách lớp lấy từ API
    const [monHocList, setMonHocList] = useState([]); // Danh sách môn học cho dropdown
    const [giangVienList, setGiangVienList] = useState([]); // Danh sách giảng viên cho dropdown
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editForm, setEditForm] = useState(initialFormState); // State cho form thêm/sửa
    const [formErrors, setFormErrors] = useState(null); // State cho lỗi validation từ BE
    const [notification, setNotification] = useState(null);
    const [saving, setSaving] = useState(false); // Trạng thái loading cho nút Save

    // --- Fetch dữ liệu ban đầu (lớp, môn, giảng viên) ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setNotification(null);
            try {
                // Sử dụng Promise.all để gọi nhiều API song song
                const [lopRes, monHocRes, giangVienRes] = await Promise.all([
                    api.get('/admin/lop-tin-chi'),
                    api.get('/admin/mon-hoc'), // API lấy danh sách môn
                    api.get('/admin/giang-vien') // API lấy danh sách giảng viên
                ]);
                setClasses(lopRes.data || []);
                setMonHocList(monHocRes.data || []);
                setGiangVienList(giangVienRes.data || []);
            } catch (err) {
                console.error("Error fetching initial data:", err);
                showNotification(`Lỗi tải dữ liệu: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Chỉ chạy 1 lần khi mount

    // --- Lọc danh sách lớp dựa trên searchTerm ---
    const filteredClasses = classes.filter(cls =>
        (cls.id && cls.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cls.MonHoc?.ten && cls.MonHoc.ten.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cls.GiangVien?.hoTen && cls.GiangVien.hoTen.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Hàm hiển thị thông báo ---
    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    // --- Xử lý mở Modal (Thêm / Sửa) ---
    const handleOpenModal = (cls = null, isAdd = false) => {
        setIsAddMode(isAdd);
        setFormErrors(null); // Xóa lỗi cũ
        if (isAdd) {
            setEditForm(initialFormState); // Reset form cho chế độ Add
        } else if (cls) {
            // Điền form với dữ liệu lớp hiện tại cho chế độ Edit
            setEditForm({
                id: cls.id,
                kyHoc: cls.kyHoc || '',
                namHoc: cls.namHoc || '',
                ngayHoc: cls.ngayHoc || '',
                kipHoc: cls.kipHoc || '',
                phongHoc: cls.phongHoc || '',
                toaNha: cls.toaNha || '',
                soLuongToiDa: cls.soLuongToiDa || '',
                MonHoc_id: cls.MonHoc?.id || '', // Lấy ID môn học từ object include
                GiangVien_id: cls.GiangVien?.id || '' // Lấy ID giảng viên từ object include
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditForm(initialFormState); // Reset form khi đóng
    };

    // --- Xử lý thay đổi input trong form ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Xử lý Lưu (Thêm / Cập nhật) ---
    const handleSave = async () => {
        setSaving(true);
        setFormErrors(null); // Xóa lỗi cũ
        showNotification('Đang xử lý...', 'info');

        try {
            let response;
            const payload = { ...editForm };
            // Chuyển đổi số lượng về số nguyên nếu nó không rỗng
            if (payload.soLuongToiDa === '') {
                payload.soLuongToiDa = null; // Gửi null nếu admin xóa trống
            } else {
                payload.soLuongToiDa = parseInt(payload.soLuongToiDa, 10);
                if (isNaN(payload.soLuongToiDa)) payload.soLuongToiDa = null; // Đảm bảo là số hoặc null
            }


            if (isAddMode) {
                // Gọi API Tạo mới
                response = await api.post('/admin/lop-tin-chi', payload);
                // Cập nhật lại danh sách lớp ở state
                setClasses(prev => [...prev, response.data]); // Giả sử API trả về data của lớp mới
                showNotification('Thêm lớp tín chỉ thành công!', 'success');
            } else {
                // Gọi API Cập nhật
                response = await api.put(`/admin/lop-tin-chi/${editForm.id}`, payload);
                // Cập nhật lại danh sách lớp ở state
                setClasses(prev => prev.map(cls =>
                    cls.id === editForm.id ? response.data : cls // Giả sử API trả về data đã cập nhật
                ));
                showNotification('Cập nhật lớp tín chỉ thành công!', 'success');
            }
            handleCloseModal(); // Đóng modal sau khi thành công
        } catch (err) {
            console.error("Save failed:", err);
            // Hiển thị lỗi validation từ backend (nếu có)
            if (err.response && err.response.status === 400 && err.response.data.errors) {
                setFormErrors(err.response.data.errors);
                showNotification('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error');
            } else {
                showNotification(`Lỗi: ${err.message || 'Không thể lưu lớp tín chỉ.'}`, 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // --- Xử lý Xóa ---
    const handleDelete = async (cls) => {
        // Hiện confirm dialog
        if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${cls.id}" (${cls.MonHoc?.ten})?`)) {
            showNotification('Đang xóa...', 'info');
            try {
                // Gọi API Xóa
                await api.delete(`/admin/lop-tin-chi/${cls.id}`);
                // Cập nhật lại danh sách lớp ở state
                setClasses(prev => prev.filter(c => c.id !== cls.id));
                showNotification('Xóa lớp tín chỉ thành công!', 'success');
            } catch (err) {
                console.error("Delete failed:", err);
                showNotification(`Lỗi khi xóa: ${err.message || 'Không thể xóa lớp tín chỉ.'}`, 'error');
            }
        }
    };

    // --- Render ---
    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
    // Bỏ qua hiển thị lỗi chính, dùng Notification
    // if (error && !notification) return <div className="p-6 text-center text-red-500">Lỗi: {error}</div>;

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
                        <BookOpen className="w-7 h-7 text-blue-600" />
                        Quản lý Lớp Tín Chỉ
                    </h1>
                    <button
                        onClick={() => handleOpenModal(null, true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                    >
                        <Plus size={18} />
                        Thêm lớp mới
                    </button>
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã lớp, tên môn, giảng viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Results Section - Hiển thị dạng danh sách thẻ */}
            <div className="space-y-4">
                {filteredClasses.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">
                        <Search size={40} className="mx-auto mb-3 text-gray-300" />
                        <p>Không tìm thấy lớp học nào.</p>
                    </div>
                )}
                {filteredClasses.map(cls => {
                    // Tính sĩ số thực tế (nếu backend trả về) hoặc dùng soLuongToiDa
                    const enrolledCount = cls.soLuongDaDangKy ?? '?'; // Ưu tiên số đã ĐK từ API (nếu có)
                    const maxSlotsDisplay = cls.soLuongToiDa ?? '∞';
                    const slotStatus = (cls.soLuongToiDa !== null && enrolledCount !== '?' && enrolledCount >= cls.soLuongToiDa)
                        ? { text: 'Hết slot', color: 'bg-red-100 text-red-700' }
                        : { text: `Đã ĐK: ${enrolledCount}`, color: 'bg-green-100 text-green-700' };

                    return (
                        <div key={cls.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 mr-2">
                                        <h3 className="font-semibold text-base text-blue-700">{cls.id}</h3>
                                        <p className="font-medium text-gray-800 text-sm">{cls.MonHoc?.ten || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">Mã môn: {cls.MonHoc?.id || 'N/A'}</p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleOpenModal(cls)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                                            title="Sửa"
                                        > <Edit2 size={14} /> </button>
                                        <button
                                            onClick={() => handleDelete(cls)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                            title="Xóa"
                                        > <Trash2 size={14} /> </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5 truncate" title={cls.GiangVien?.hoTen || 'N/A'}>
                                        <User size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{cls.GiangVien?.hoTen || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={12} className="text-gray-400 flex-shrink-0" />
                                        <span>{enrolledCount} / {maxSlotsDisplay} SV</span>
                                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${slotStatus.color}`}>{slotStatus.text}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                                        <span>{cls.ngayHoc || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-gray-400 flex-shrink-0" />
                                        <span>{cls.kipHoc || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500">
                                Phòng: {cls.phongHoc || '?'} - {cls.toaNha || '?'} | {cls.kyHoc ? `Kỳ ${cls.kyHoc}` : ''} {cls.namHoc || ''}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal for Add/Edit Class */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {isAddMode ? 'Thêm Lớp Tín Chỉ Mới' : `Chỉnh sửa Lớp Tín Chỉ: ${editForm.id}`}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"> <X size={20} /> </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-6 space-y-4 overflow-y-auto">
                            {/* Display Backend Validation Errors */}
                            {formErrors && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                                    <p className="font-semibold mb-1">Vui lòng sửa các lỗi sau:</p>
                                    <ul className="list-disc list-inside">
                                        {Object.entries(formErrors).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Mã Lớp Tín Chỉ <span className="text-red-500">*</span></label>
                                    <input type="text" name="id" value={editForm.id} onChange={handleInputChange} disabled={!isAddMode} placeholder="VD: IT4409.001" className={`w-full px-3 py-2 border rounded-md text-sm ${!isAddMode ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`} />
                                    {formErrors?.id && <p className="text-red-500 text-xs mt-1">{formErrors.id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Môn Học <span className="text-red-500">*</span></label>
                                    <select name="MonHoc_id" value={editForm.MonHoc_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled={!isAddMode}>
                                        <option value="">-- Chọn Môn Học --</option>
                                        {monHocList.map(mh => <option key={mh.id} value={mh.id}>{mh.ten} ({mh.id})</option>)}
                                    </select>
                                    {formErrors?.MonHoc_id && <p className="text-red-500 text-xs mt-1">{formErrors.MonHoc_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Giảng Viên <span className="text-red-500">*</span></label>
                                    <select name="GiangVien_id" value={editForm.GiangVien_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                        <option value="">-- Chọn Giảng Viên --</option>
                                        {giangVienList.map(gv => <option key={gv.id} value={gv.id}>{gv.hoTen} ({gv.id})</option>)}
                                    </select>
                                    {formErrors?.GiangVien_id && <p className="text-red-500 text-xs mt-1">{formErrors.GiangVien_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Số Lượng Tối Đa</label>
                                    <input type="number" name="soLuongToiDa" value={editForm.soLuongToiDa ?? ''} onChange={handleInputChange} placeholder="Để trống nếu không giới hạn" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                    {formErrors?.soLuongToiDa && <p className="text-red-500 text-xs mt-1">{formErrors.soLuongToiDa}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Kỳ Học <span className="text-red-500">*</span></label>
                                    <input type="number" name="kyHoc" value={editForm.kyHoc} onChange={handleInputChange} placeholder="1 hoặc 2" min="1" max="3" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                    {formErrors?.kyHoc && <p className="text-red-500 text-xs mt-1">{formErrors.kyHoc}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Năm Học <span className="text-red-500">*</span></label>
                                    <input type="text" name="namHoc" value={editForm.namHoc} onChange={handleInputChange} placeholder="VD: 2025-2026" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                    {formErrors?.namHoc && <p className="text-red-500 text-xs mt-1">{formErrors.namHoc}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Ngày Học</label>
                                    <input type="text" name="ngayHoc" value={editForm.ngayHoc} onChange={handleInputChange} placeholder="VD: Thứ 2" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Kíp Học</label>
                                    <input type="text" name="kipHoc" value={editForm.kipHoc} onChange={handleInputChange} placeholder="VD: 7-9" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Phòng Học</label>
                                    <input type="text" name="phongHoc" value={editForm.phongHoc} onChange={handleInputChange} placeholder="VD: A1-301" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tòa Nhà</label>
                                    <input type="text" name="toaNha" value={editForm.toaNha} onChange={handleInputChange} placeholder="VD: A1" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 flex-shrink-0">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"> Hủy </button>
                            <button onClick={handleSave} disabled={saving} className={`flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md font-medium ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {saving ? (
                                    <> <svg className="animate-spin h-4 w-4 text-white" /* ... */></svg> Đang lưu... </>
                                ) : (
                                    <> <Save size={14} /> {isAddMode ? 'Thêm Lớp' : 'Lưu Thay Đổi'} </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminLopTinChiCRUDPage;
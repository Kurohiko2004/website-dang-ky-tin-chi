// src/pages/Admin/AdminCourseCRUDPage.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/common/SearchBar';
import api from '../../lib/api';
import { Search, BookOpen, Edit2, Trash2, Plus, X, Save, AlertCircle, CheckCircle } from 'lucide-react';

// Component thông báo (Giả sử bạn đã có)
function Notification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    return (<div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white`}><Icon size={20} />{message}<button onClick={onClose} className="ml-2">&times;</button></div>);
}

// Giá trị khởi tạo cho form (khớp với backend)
const initialFormState = {
    id: '',         // Tương ứng courseCode
    ten: '',        // Tương ứng courseName
    soTinChi: '',   // Tương ứng credits
    // description: '', // Backend chưa hỗ trợ?
    // department: ''   // Backend chưa hỗ trợ?
};

function AdminMonHocCRUDPage() {
    const [courses, setCourses] = useState([]); // Danh sách môn học từ API
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null); // Chỉ lưu ID của môn đang chọn
    const [editForm, setEditForm] = useState(initialFormState); // State cho form thêm/sửa
    const [formErrors, setFormErrors] = useState(null);
    const [notification, setNotification] = useState(null);
    const [saving, setSaving] = useState(false);

    // --- Fetch danh sách môn học ban đầu ---
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setNotification(null);
            try {
                const response = await api.get('/admin/mon-hoc');
                setCourses(response.data || []); // Lấy mảng data từ response
            } catch (err) {
                console.error("Error fetching courses:", err);
                showNotification(`Lỗi tải danh sách môn học: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []); // Chỉ chạy 1 lần

    // --- Lọc danh sách môn học (Client-side) ---
    const filteredCourses = courses.filter(course =>
        (course.ten && course.ten.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.id && course.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Hàm hiển thị thông báo ---
    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    // --- Xử lý mở Modal ---
    const handleOpenModal = (course = null, isAdd = false) => {
        setIsAddMode(isAdd);
        setFormErrors(null);
        if (isAdd) {
            setSelectedCourseId(null);
            setEditForm(initialFormState);
        } else if (course) {
            setSelectedCourseId(course.id); // Lưu ID để gọi API update
            // Map dữ liệu từ state 'courses' sang 'editForm'
            setEditForm({
                id: course.id || '',
                ten: course.ten || '',
                soTinChi: course.soTinChi || '',
                // description: course.description || '', // Nếu có
                // department: course.department || '' // Nếu có
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourseId(null);
        setEditForm(initialFormState);
    };

    // --- Xử lý thay đổi input ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            // Đảm bảo số tín chỉ là số hoặc chuỗi rỗng
            [name]: name === 'soTinChi' ? (value === '' ? '' : parseInt(value) || 0) : value
        }));
    };

    // --- Xử lý Lưu (Thêm / Cập nhật) ---
    const handleSave = async () => {
        setSaving(true);
        setFormErrors(null);
        showNotification('Đang xử lý...', 'info');

        // Chuẩn bị payload cho backend (khớp tên thuộc tính backend)
        const payload = {
            id: editForm.id,
            ten: editForm.ten,
            soTinChi: editForm.soTinChi === '' ? null : parseInt(editForm.soTinChi, 10) // Gửi null nếu trống
        };

        // Validate cơ bản phía client (Backend sẽ validate kỹ hơn)
        if (!payload.id || !payload.ten || payload.soTinChi === null || payload.soTinChi < 0) {
            showNotification('Mã môn, Tên môn, và Số tín chỉ (không âm) là bắt buộc!', 'error');
            setSaving(false);
            return;
        }


        try {
            let response;
            if (isAddMode) {
                // Gọi API Tạo mới
                response = await api.post('/admin/mon-hoc', payload);
                // Cập nhật state với dữ liệu trả về từ API
                setCourses(prev => [...prev, response.data]);
                showNotification('Thêm môn học thành công!', 'success');
            } else {
                // Gọi API Cập nhật (chỉ gửi tên và số tín chỉ)
                const updatePayload = { ten: payload.ten, soTinChi: payload.soTinChi };
                response = await api.put(`/admin/mon-hoc/${selectedCourseId}`, updatePayload);
                // Cập nhật state với dữ liệu trả về từ API
                setCourses(prev => prev.map(course =>
                    course.id === selectedCourseId ? response.data : course
                ));
                showNotification('Cập nhật môn học thành công!', 'success');
            }
            handleCloseModal();
        } catch (err) {
            console.error("Save failed:", err);
            if (err.response && err.response.data && err.response.data.message) {
                // Hiển thị lỗi cụ thể từ backend (ví dụ: ID đã tồn tại)
                showNotification(`Lỗi: ${err.response.data.message}`, 'error');
                // Nếu có lỗi validation chi tiết từ backend
                if (err.response.status === 400 && err.response.data.errors) {
                    setFormErrors(err.response.data.errors);
                }
            } else {
                showNotification(`Lỗi: ${err.message || 'Không thể lưu môn học.'}`, 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // --- Xử lý Xóa ---
    const handleDelete = async (course) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.ten}" (${course.id})?`)) {
            showNotification('Đang xóa...', 'info');
            try {
                await api.delete(`/admin/mon-hoc/${course.id}`);
                setCourses(prev => prev.filter(c => c.id !== course.id));
                showNotification('Xóa môn học thành công!', 'success');
            } catch (err) {
                console.error("Delete failed:", err);
                showNotification(`Lỗi khi xóa: ${err.message || 'Không thể xóa môn học.'}`, 'error');
            }
        }
    };

    // --- Render ---
    if (loading) return <div className="p-6 text-center">Đang tải danh sách môn học...</div>;

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
                        Quản lý Môn Học
                    </h1>
                    <button
                        onClick={() => handleOpenModal(null, true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                    >
                        <Plus size={18} />
                        Thêm môn mới
                    </button>
                </div>
                {/* Search Bar */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên môn, mã môn..."
                />
            </div>

            {/* Results Section - Hiển thị dạng thẻ */}
            <div className="space-y-4">
                {filteredCourses.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">
                        <Search size={40} className="mx-auto mb-3 text-gray-300" />
                        <p>Không tìm thấy môn học nào.</p>
                    </div>
                )}
                {filteredCourses.map(course => (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 mr-2">
                                    <h3 className="font-semibold text-base text-blue-700">{course.ten}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Mã môn: {course.id}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                        {course.soTinChi} TC
                                    </span>
                                    <button
                                        onClick={() => handleOpenModal(course)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                                        title="Sửa"
                                    > <Edit2 size={14} /> </button>
                                    <button
                                        onClick={() => handleDelete(course)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                        title="Xóa"
                                    > <Trash2 size={14} /> </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Add/Edit Course */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {isAddMode ? 'Thêm Môn Học Mới' : `Chỉnh sửa Môn Học: ${editForm.id}`}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"> <X size={20} /> </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 overflow-y-auto">
                            {/* Display Backend Validation Errors */}
                            {/* {formErrors && ()} */}




                            {/* Form Fields - Khớp với backend */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Mã Môn Học <span className="text-red-500">*</span></label>
                                <input type="text" name="id" value={editForm.id} onChange={handleInputChange} disabled={!isAddMode} placeholder="VD: IT4409" className={`w-full px-3 py-2 border rounded-md text-sm ${!isAddMode ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`} />
                                {formErrors?.id && <p className="text-red-500 text-xs mt-1">{formErrors.id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Tên Môn Học <span className="text-red-500">*</span></label>
                                <input type="text" name="ten" value={editForm.ten} onChange={handleInputChange} placeholder="VD: Lập trình Web" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                {formErrors?.ten && <p className="text-red-500 text-xs mt-1">{formErrors.ten}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Số Tín Chỉ <span className="text-red-500">*</span></label>
                                <input type="number" name="soTinChi" value={editForm.soTinChi ?? ''} onChange={handleInputChange} placeholder="VD: 3" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                {formErrors?.soTinChi && <p className="text-red-500 text-xs mt-1">{formErrors.soTinChi}</p>}
                            </div>
                            {/* Bỏ qua description và department vì backend chưa có */}

                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 flex-shrink-0">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"> Hủy </button>
                            <button onClick={handleSave} disabled={saving} className={`flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-md font-medium ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {saving ? (
                                    <span>Đang lưu...</span>
                                ) : (
                                    <>
                                        <Save size={14} /> {isAddMode ? 'Thêm Môn Học' : 'Lưu Thay Đổi'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

export default AdminMonHocCRUDPage;
// src/pages/Teacher/TeacherClassDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import { AuthContext } from '../../contexts/AuthContext';
import { calculateTotal10, convertGrade, getGradeColor } from '../../utils/gradeUtils.js';
import api from '../../lib/api';
import { ChevronLeft, Save, Search } from 'lucide-react'; // Icons

// Component thông báo (Giả sử bạn đã có hoặc tạo riêng)
function Notification({ message, type, onClose }) {
    // ... (logic Notification component) ...
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    // ... (Thêm icon nếu muốn) ...
    return (<div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white`}><p>{message}</p><button onClick={onClose} className="ml-2">&times;</button></div>);
}

function TeacherClassDetailPage() {
    const { user, token } = useContext(AuthContext);
    const { id: lopTinChiId } = useParams(); // Lấy ID lớp từ URL
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState(null); // Thông tin chi tiết lớp
    const [studentGrades, setStudentGrades] = useState([]); // Danh sách SV và điểm
    const [filteredStudents, setFilteredStudents] = useState([]); // DS SV sau khi lọc
    const [searchTerm, setSearchTerm] = useState(''); // Giá trị tìm kiếm
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Trạng thái đang lưu điểm
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // --- Fetch Class Details and Student List ---
    useEffect(() => {
        if (!user || !token || !lopTinChiId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // TODO: Tạo API riêng để lấy chi tiết lớp HOẶC sửa API layDSSinhVienVaDiem
                // Giả sử gọi API riêng:
                // const classInfoResponse = await api.get(`/giang-vien/lop-hoc-chi-tiet/${lopTinChiId}`); // API giả định
                // setClassInfo(classInfoResponse.data); // Giả sử trả về { message: ..., data: {...} }

                // Gọi API lấy danh sách sinh viên và điểm
                const studentsResponse = await api.get(`/giang-vien/lop-hoc-chi-tiet/${lopTinChiId}`);
                // Khởi tạo state với dữ liệu điểm lấy về
                setStudentGrades(studentsResponse.data.map(item => ({
                    ...item, // Giữ nguyên dangkyhoc_id, sinhVien
                    // Đảm bảo các trường điểm có giá trị mặc định là null hoặc giá trị từ API
                    diemChuyenCan: item.diemChuyenCan ?? null,
                    diemBaiTap: item.diemBaiTap ?? null,
                    diemThiGiuaKy: item.diemThiGiuaKy ?? null,
                    diemThiCuoiKy: item.diemThiCuoiKy ?? null,
                    // Tính toán điểm tổng kết ban đầu
                    ...calculateAndConvertGrades(item)
                })));
                setFilteredStudents(studentsResponse.data.map(item => ({
                    ...item,
                    ...calculateAndConvertGrades(item)
                }))); // Hiển thị tất cả ban đầu

            } catch (err) {
                console.error("Error fetching class details:", err);
                setError(err.message || 'Không thể tải thông tin lớp học.');
                showNotification(`Lỗi: ${err.message || 'Không thể tải thông tin lớp học.'}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token, lopTinChiId]);

    // --- Helper function to recalculate grades ---
    const calculateAndConvertGrades = (grades) => {
        const total10 = calculateTotal10(grades);
        const { total4, grade } = convertGrade(total10);
        return { total10, total4, grade };
    };


    // --- Handle Grade Input Change ---
    const handleGradeChange = (dangkyhoc_id, field, value) => {
        // Chuyển đổi giá trị nhập vào thành số hoặc null
        let numericValue = value === '' ? null : parseFloat(value);
        // Validate điểm (0-10)
        if (numericValue !== null && (isNaN(numericValue) || numericValue < 0 || numericValue > 10)) {
            // Có thể hiển thị cảnh báo nhỏ hoặc không cho nhập giá trị không hợp lệ
            console.warn(`Invalid grade value entered: ${value}`);
            // Hoặc giới hạn giá trị ngay lập tức:
            // numericValue = Math.max(0, Math.min(10, numericValue || 0));
            return; // Tạm thời không cập nhật nếu không hợp lệ
        }


        const updatedStudents = studentGrades.map(student => {
            if (student.dangkyhoc_id === dangkyhoc_id) {
                const updatedGrades = { ...student, [field]: numericValue };
                // Tính lại điểm tổng kết ngay khi điểm thành phần thay đổi
                return { ...updatedGrades, ...calculateAndConvertGrades(updatedGrades) };
            }
            return student;
        });
        setStudentGrades(updatedStudents);
        // Cập nhật cả danh sách lọc
        setFilteredStudents(updatedStudents.filter(student =>
            student.sinhVien.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.sinhVien.id.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    };

    // --- Handle Search ---
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = studentGrades.filter(student =>
            student.sinhVien.hoTen.toLowerCase().includes(lowerCaseSearchTerm) ||
            student.sinhVien.id.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredStudents(filtered);
    }, [searchTerm, studentGrades]);


    // --- Handle Save Scores ---
    const saveScores = async () => {
        setSaving(true);
        setError(null);
        showNotification('Đang lưu điểm...', 'info');

        // Chuẩn bị dữ liệu chỉ gồm những thay đổi cần thiết
        // Hoặc gửi toàn bộ danh sách điểm hiện tại
        const gradesToSubmit = studentGrades.map(s => ({
            dangkyhoc_id: s.dangkyhoc_id,
            diemChuyenCan: s.diemChuyenCan,
            diemBaiTap: s.diemBaiTap,
            diemThiGiuaKy: s.diemThiGiuaKy,
            diemThiCuoiKy: s.diemThiCuoiKy,
        }));

        try {
            // Gọi API nhập điểm hàng loạt
            await api.post(`/giang-vien/lop/${lopTinChiId}/nhap-ket-qua`, { grades: gradesToSubmit });
            showNotification('Lưu điểm thành công!', 'success');
        } catch (err) {
            console.error("Error saving scores:", err);
            setError(err.message || 'Lưu điểm thất bại.');
            showNotification(`Lỗi: ${err.message || 'Lưu điểm thất bại.'}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Notification Helper ---
    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    // --- Render ---
    if (loading) return <div className="p-6 text-center">Đang tải chi tiết lớp học...</div>;
    // Bỏ qua hiển thị lỗi chính ở đây, dùng Notification
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

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
                {/* Sử dụng Link của react-router-dom */}
                <Link to="/giang-vien/lop-hoc" className="text-blue-600 hover:underline">
                    ← Quay lại danh sách lớp
                </Link>
            </div>

            {/* Class Info Card */}
            {classInfo && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-semibold text-blue-600">{classInfo.id}</div>
                            <h1 className="text-xl font-bold text-gray-800">{classInfo.MonHoc?.ten || 'N/A'}</h1>
                        </div>
                        {/* Optionally add actions like export */}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                        <div className="info-item"><span className="font-semibold text-gray-500 w-20 inline-block">Học kỳ:</span> {classInfo.kyHoc}</div>
                        <div className="info-item"><span className="font-semibold text-gray-500 w-20 inline-block">Năm học:</span> {classInfo.namHoc}</div>
                        <div className="info-item"><span className="font-semibold text-gray-500 w-20 inline-block">Số tín chỉ:</span> {classInfo.MonHoc?.soTinChi || '?'}</div>
                        <div className="info-item"><span className="font-semibold text-gray-500 w-20 inline-block">Sĩ số:</span> {classInfo.soLuongToiDa ?? '?'} SV</div>
                        <div className="info-item col-span-2 md:col-span-1"><span className="font-semibold text-gray-500 w-20 inline-block">Lịch học:</span> {classInfo.ngayHoc || 'N/A'}, {classInfo.kipHoc || 'N/A'}</div>
                        <div className="info-item"><span className="font-semibold text-gray-500 w-20 inline-block">Phòng:</span> {classInfo.phongHoc || 'N/A'} - {classInfo.toaNha || 'N/A'}</div>
                    </div>
                </div>
            )}

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mã SV..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    {/* <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Xuất Excel</button> */}
                    <button
                        onClick={saveScores}
                        disabled={saving}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center gap-1 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* ... */ > {/* Spinner */} </svg>
                                Đang lưu...
                            </>
                        ) : (
                            <> <Save size={16} /> Lưu điểm </>
                        )}
                    </button>
                </div>
            </div>


            {/* Student Grades Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-800 text-white sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-10">TT</th>
                            <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider w-24">Mã SV</th>
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-[150px]">Tên sinh viên</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">CC</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">BT</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">GK</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">CK</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">TK (10)</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">TK (4)</th>
                            <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider w-20">TK (Chữ)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.length === 0 && (
                            <tr><td colSpan="10" className="text-center p-4 text-gray-500">Không tìm thấy sinh viên nào khớp hoặc lớp chưa có sinh viên.</td></tr>
                        )}
                        {filteredStudents.map((student, index) => (
                            <tr key={student.dangkyhoc_id} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-center text-sm text-gray-500">{index + 1}</td>
                                <td className="px-2 py-2 text-sm text-gray-500">{student.sinhVien?.id || 'N/A'}</td>
                                <td className="px-3 py-2 text-sm font-medium text-gray-900">{student.sinhVien?.hoTen || 'N/A'}</td>
                                {/* Grade Inputs */}
                                {['diemChuyenCan', 'diemBaiTap', 'diemThiGiuaKy', 'diemThiCuoiKy'].map(field => (
                                    <td key={field} className="px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            min="0" max="10" step="0.1" // Basic HTML5 validation
                                            value={student[field] ?? ''} // Use '' for empty input if value is null
                                            onChange={(e) => handleGradeChange(student.dangkyhoc_id, field, e.target.value)}
                                            className="w-14 px-1 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={saving} // Disable while saving
                                        />
                                    </td>
                                ))}
                                {/* Calculated Grades */}
                                <td className="px-2 py-2 text-center text-sm font-semibold text-gray-800">{student.total10 ?? '-'}</td>
                                <td className="px-2 py-2 text-center text-sm font-semibold text-gray-800">{student.total4 ?? '-'}</td>
                                <td className="px-2 py-2 text-center">
                                    <span className={`inline-block ${getGradeColor(student.grade)} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                        {student.grade}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default TeacherClassDetailPage;
// src/pages/Student/DangKyHocPhanPage.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import api from '../../lib/api'; // Import api utility
import { BookOpen, User, Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'; // Icons

// Component thông báo
function Notification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Tự đóng sau 3 giây
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

    return (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} text-white transition-opacity duration-300`} role="alert">
            <Icon size={20} />
            {message}
            <button onClick={onClose} className="ml-4 text-xl font-bold leading-none">&times;</button>
        </div>
    );
}


function CourseRegistrationPage() {
    const { user, token } = useContext(AuthContext); // Lấy thông tin user và token
    const [availableCourses, setAvailableCourses] = useState([]); // Danh sách lớp lấy từ API
    const [selectedCourses, setSelectedCourses] = useState([]); // Danh sách lớp SV đã chọn
    const [registeredCourses, setRegisteredCourses] = useState([]); // <-- STATE MỚI: Lớp đã đăng ký/chờ duyệt
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false); // State loading riêng cho nút submit
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null); // { message, type }

    const MAX_CREDITS = 16; // Giới hạn tín chỉ - hardcode

    // --- TÁCH HÀM FETCH DATA ---
    // Sử dụng useCallback để hàm này không bị tạo lại mỗi lần render
    const fetchInitialData = useCallback(async () => {
        if (!user || !token) return;

        setLoading(true);
        setError(null);
        // hardcode
        const currentKyHoc = 1;
        const currentNamHoc = '2025-2026';

        try {
            // Gọi song song 2 API
            const [availableRes, registeredRes] = await Promise.all([
                api.get(`/sinh-vien/lop-tin-chi?kyHoc=${currentKyHoc}&namHoc=${currentNamHoc}`),
                api.get(`/sinh-vien/dang-ky-hien-tai?kyHoc=${currentKyHoc}&namHoc=${currentNamHoc}`) // <-- get các đăng ký cũ
            ]);

            // 1. Xử lý danh sách lớp đang mở (như cũ)
            const formattedCourses = availableRes.data.map(lop => (
                // ... (logic format như cũ) ...
                {
                    id: lop.id,
                    classCode: lop.id,
                    courseName: lop.MonHoc?.ten || 'N/A',
                    courseCode: lop.MonHoc?.id || 'N/A',
                    teacher: lop.GiangVien?.hoTen || 'N/A',
                    slots: lop.soSlotConLai,
                    schedule: lop.ngayHoc || 'N/A',
                    shift: lop.kipHoc || 'N/A',
                    credits: lop.MonHoc?.soTinChi || 0
                }
            ));
            setAvailableCourses(formattedCourses);

            // 2. Lưu lại danh sách lớp đã đăng ký
            setRegisteredCourses(registeredRes.data); // Dữ liệu đã được format từ backend

        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu đăng ký.');
            showNotification(`Lỗi: ${err.message || 'Không thể tải dữ liệu.'}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [user, token]); // Phụ thuộc vào user và token



    // --- useEffect chỉ gọi hàm fetch ---
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]); // Chỉ chạy lại khi hàm fetchInitialData thay đổi


    // --- CẬP NHẬT TÍNH TOÁN TÍN CHỈ ---
    const registeredCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    const selectedCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalCredits = registeredCredits + selectedCredits; // <-- TỔNG TÍN CHỈ MỚI

    // --- Fetch danh sách lớp học phần khi component mount ---
    // useEffect(() => {
    //     if (!user || !token) return; // Chỉ fetch khi đã có thông tin user

    //     const fetchAvailableClasses = async () => {
    //         setLoading(true);
    //         setError(null);
    //         // --- TODO: Xác định kyHoc, namHoc hiện tại ---
    //         // hardcode
    //         const currentKyHoc = 1;
    //         const currentNamHoc = '2025-2026';
    //         // ---------------------------------------------
    //         try {
    //             const response = await api.get(`/sinh-vien/lop-tin-chi?kyHoc=${currentKyHoc}&namHoc=${currentNamHoc}`);

    //             // Map lại dữ liệu API cho phù hợp với cấu trúc component mong đợi
    //             const formattedCourses = response.data.map(lop => ({
    //                 id: lop.id, // ID Lớp tín chỉ
    //                 classCode: lop.id, // Dùng ID lớp làm classCode
    //                 courseName: lop.MonHoc?.ten || 'N/A',
    //                 courseCode: lop.MonHoc?.id || 'N/A', // Lấy ID môn học nếu có trong model MonHoc
    //                 teacher: lop.GiangVien?.hoTen || 'N/A',
    //                 slots: lop.soSlotConLai, // Sử dụng slot còn lại đã tính toán
    //                 schedule: lop.ngayHoc || 'N/A',
    //                 shift: lop.kipHoc || 'N/A', // Đảm bảo cột kipHoc tồn tại
    //                 credits: lop.MonHoc?.soTinChi || 0 // Số tín chỉ từ MonHoc
    //             }));

    //             console.log("Formatted Courses:", formattedCourses);

    //             setAvailableCourses(formattedCourses);
    //         } catch (err) {
    //             setError(err.message || 'Không thể tải danh sách lớp tín chỉ.');
    //             showNotification(`Lỗi: ${err.message || 'Không thể tải danh sách lớp tín chỉ.'}`, 'error');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchAvailableClasses();
    // }, [user, token]); // Dependency là user và token


    // Hiển thị thông báo
    const showNotification = (message, type) => {
        setNotification({ message, type });
        // Tự động xóa sau 3 giây đã được xử lý trong component Notification
    };

    // Xử lý khi chọn một lớp
    const handleSelectCourse = (course) => {

        console.log("Selecting course:", course); // Log lớp đang định chọn
        console.log("Currently selected:", selectedCourses); // Log các lớp đã chọn

        // --- Danh sách TẤT CẢ các lớp đã cam kết (đã đăng ký + đang chọn) ---
        const allCommittedCourses = [...registeredCourses, ...selectedCourses];

        // 1. Kiểm tra slot
        if (course.slots === 0) {
            console.log("DEBUG: Check failed - Slots = 0"); // <-- LOG REASON
            showNotification('Lớp này đã hết slot!', 'error');
            return;
        }

        // 2. Kiểm tra đã đăng ký (từ server)
        // (Không cần kiểm tra ID vì nút sẽ bị vô hiệu hóa)

        // 3. Kiểm tra đã chọn (trong giỏ hàng)
        if (selectedCourses.find(c => c.id === course.id)) {
            showNotification('Bạn đã chọn lớp này rồi!', 'warning');
            return;
        }

        // 4. Kiểm tra trùng MÔN HỌC (courseCode)
        // SỬ DỤNG allCommittedCourses
        if (allCommittedCourses.find(c => c.courseCode === course.courseCode)) {
            showNotification(`Bạn đã đăng ký hoặc đã chọn một lớp khác của môn ${course.courseName} rồi!`, 'warning');
            return;
        }

        // 5. Kiểm tra tổng tín chỉ (SỬ DỤNG totalCredits MỚI)
        const newTotalCredits = totalCredits + course.credits;
        if (newTotalCredits > MAX_CREDITS) {
            showNotification(`Không thể đăng ký! Tổng số tín chỉ sẽ vượt quá ${MAX_CREDITS} (${newTotalCredits}/${MAX_CREDITS})`, 'error');
            return;
        }

        // 6. Kiểm tra trùng lịch
        const newSlot = `${course.schedule}_${course.shift}`;
        if (course.schedule && course.shift) {
            // SỬ DỤNG allCommittedCourses
            const conflict = allCommittedCourses.some(selected => {
                const selectedSlot = selected.schedule && selected.shift && `${selected.schedule}_${selected.shift}`;
                return selectedSlot === newSlot;
            });
            if (conflict) {
                showNotification(`Lịch học của lớp ${course.classCode} bị trùng với một lớp bạn đã đăng ký/đã chọn!`, 'error');
                return;
            }
        }

        // 7. Thêm vào giỏ hàng
        setSelectedCourses([...selectedCourses, course]);
        showNotification(`Đã thêm ${course.courseName} vào danh sách đăng ký`, 'success');
    };

    // Xử lý khi xóa một lớp khỏi danh sách chọn
    const handleRemoveCourse = (courseId) => {
        setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
        showNotification('Đã xóa môn học khỏi danh sách', 'info'); // Dùng type 'info' hoặc 'success'
    };



    // Xử lý khi nhấn nút Xác nhận phiếu đăng ký
    const handleConfirmRegistration = async () => {
        if (selectedCourses.length === 0) {
            showNotification('Vui lòng chọn ít nhất một môn học!', 'warning');
            return;
        }
        if (totalCredits > MAX_CREDITS) {
            showNotification(`Tổng tín chỉ (${totalCredits}/${MAX_CREDITS}) vượt quá giới hạn. Vui lòng bỏ bớt môn.`, 'error');
            return;
        }

        setSubmitLoading(true); // Bắt đầu loading submit
        setError(null);

        // Chuẩn bị dữ liệu gửi đến backend (chỉ cần mảng các ID lớp tín chỉ)
        const selectedLopIds = selectedCourses.map(c => c.id);

        try {
            // Gọi API backend
            await api.post('/sinh-vien/dang-ky', { danhSachLopIds: selectedLopIds });
            showNotification('Gửi yêu cầu đăng ký thành công!', 'success');

            // 1. Xóa danh sách đã chọn sau khi gửi thành công
            setSelectedCourses([]);

            // 2. Tải lại dữ liệu từ backend để cập nhật trạng thái đăng ký
            await fetchInitialData();

        } catch (err) {
            console.error('Registration failed:', err);
            // Hiển thị lỗi từ backend (ví dụ: hết slot, trùng lịch server-side, đã đăng ký...)
            showNotification(`Đăng ký thất bại: ${err.message || 'Lỗi không xác định.'}`, 'error');
            setError(err.message); // Lưu lỗi nếu cần
        } finally {
            setSubmitLoading(false); // Kết thúc loading submit
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải danh sách lớp học phần...</div>;

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

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Lỗi!</span> {error}
                </div>
            )}

            {/* Credit Summary - Phần tổng quan tín chỉ (ĐÃ CẬP NHẬT) */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Tổng quan</h3>
                <div className="space-y-2 text-sm">
                    {/* --- CẬP NHẬT NỘI DUNG --- */}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tín chỉ đã đăng ký/chờ duyệt:</span>
                        <span className="font-bold text-green-600">
                            {registeredCredits}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tín chỉ đang chọn (giỏ hàng):</span>
                        <span className="font-bold text-blue-600">
                            {selectedCredits}
                        </span>
                    </div>
                    <hr className="my-1" />
                    <div className="flex justify-between font-bold">
                        <span className="text-gray-600">Tổng cộng:</span>
                        <span className={`font-bold ${totalCredits > MAX_CREDITS ? 'text-red-600' : 'text-gray-800'}`}>
                            {totalCredits}/{MAX_CREDITS}
                        </span>
                    </div>
                    {/* --- KẾT THÚC CẬP NHẬT --- */}
                </div>
                <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full ${totalCredits > MAX_CREDITS ? 'bg-red-500' : 'bg-blue-500'} transition-all`}
                        style={{ width: `${Math.min((totalCredits / MAX_CREDITS) * 100, 100)}%` }}
                    />
                </div>
            </div>

            {/* Available Courses Table - Bảng danh sách lớp tín chỉ */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Danh sách lớp tín chỉ</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã lớp</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên môn học</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã MH</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giảng viên</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slot</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lịch học</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kíp</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TC</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {availableCourses.map(course => {
                                const isSelected = selectedCourses.some(c => c.id === course.id);
                                // Bổ sung kiểm tra đã đăng ký
                                const registeredInfo = registeredCourses.find(c => c.id === course.id);
                                // Cập nhật logic vô hiệu hóa
                                const isDisabled = course.slots === 0 || isSelected || registeredInfo;

                                return (
                                    <tr key={course.id} className={`${isSelected ? 'bg-blue-50' : (registeredInfo ? 'bg-green-50' : 'hover:bg-gray-50')}`}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.classCode}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{course.courseName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{course.courseCode}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                                            <User size={14} />
                                            {course.teacher}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${course.slots === 0 ? 'bg-red-100 text-red-700' :
                                                course.slots < 5 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                <Users size={12} />
                                                {course.slots === null ? '∞' : course.slots}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {course.schedule}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {course.shift ? course.shift.replace('-', 'h-') + 'h' : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.credits}</td>
                                        <td className="px-4 py-3">
                                            {/* --- CẬP NHẬT LOGIC NÚT BẤM --- */}
                                            <button
                                                onClick={() => handleSelectCourse(course)}
                                                disabled={isDisabled}
                                                className={`px-3 py-1 text-sm font-medium text-white rounded focus:outline-none 
                                                    ${isSelected ? 'bg-gray-400 cursor-not-allowed' :
                                                        (registeredInfo?.trangThai === 'Đã duyệt' ? 'bg-green-600 cursor-not-allowed' :
                                                            (registeredInfo?.trangThai === 'Chờ duyệt' ? 'bg-yellow-500 cursor-not-allowed' :
                                                                (course.slots === 0 ? 'bg-red-400 cursor-not-allowed' :
                                                                    'bg-blue-600 hover:bg-blue-700'
                                                                )))} 
                                                    disabled:opacity-70 disabled:cursor-not-allowed`}
                                            >
                                                {isSelected ? 'Đã chọn' :
                                                    (registeredInfo?.trangThai === 'Đã duyệt' ? 'Đã duyệt' :
                                                        (registeredInfo?.trangThai === 'Chờ duyệt' ? 'Chờ duyệt' :
                                                            (course.slots === 0 ? 'Hết chỗ' : 'Chọn')))
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {availableCourses.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        Không có lớp học phần nào mở trong kỳ này hoặc đã hết thời gian đăng ký.
                    </div>
                )}
            </div>

            {/* Selected Courses List - Danh sách lớp đã chọn */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Danh sách đăng ký ({selectedCourses.length} môn)</h2>
                </div>
                {selectedCourses.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Chưa có môn học nào được chọn. Vui lòng chọn môn học từ bảng trên.
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="space-y-3">
                            {selectedCourses.map(course => (
                                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{course.courseName}
                                            <span className="text-sm font-normal text-gray-500">({course.classCode})</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {course.teacher} | {course.schedule} ({course.shift}) | {course.credits} TC
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveCourse(course.id)}
                                        className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none 
                                        focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        aria-label={`Xóa lớp ${course.courseName}`}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button Area */}
                        <div className="mt-6 flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <div>
                                <div className="text-sm text-gray-600">Tổng số tín chỉ (trong giỏ hàng):</div>
                                <div className={`text-2xl font-bold ${totalCredits > MAX_CREDITS ? 'text-red-600' : 'text-blue-600'}`}>
                                    {selectedCredits}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Tổng cộng đã đăng ký: {totalCredits} / {MAX_CREDITS}</div>
                                {totalCredits > MAX_CREDITS && (
                                    <p className="text-xs text-red-600 mt-1">Tổng tín chỉ vượt quá giới hạn!</p>
                                )}
                            </div>
                            <button
                                onClick={handleConfirmRegistration}
                                disabled={selectedCourses.length === 0 || totalCredits > MAX_CREDITS || submitLoading}
                                className={`px-6 py-3 text-white rounded-lg font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(selectedCourses.length === 0 || totalCredits > MAX_CREDITS || submitLoading)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                    } disabled:opacity-50`}
                            >
                                {submitLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Xác nhận phiếu đăng ký
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseRegistrationPage;
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import RegistrationList from '../../components/RegistrationList';
import CreditSummary from '../../components/CreditSummary';
import Notification from '../../components/common/Notification'; 
import AvailableCoursesTable from '../../components/AvailableCoursesTable';
import SearchBar from '../../components/common/SearchBar';

import api from '../../lib/api'; 


function CourseRegistrationPage() {
    const { user, token } = useContext(AuthContext); // Lấy thông tin user và token
    const [availableCourses, setAvailableCourses] = useState([]); // Danh sách lớp lấy từ API
    const [selectedCourses, setSelectedCourses] = useState([]); // Danh sách lớp SV đã chọn
    const [registeredCourses, setRegisteredCourses] = useState([]); // <-- STATE MỚI: Lớp đã đăng ký/chờ duyệt

    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false); // State loading riêng cho nút submit
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null); 

    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    const MAX_CREDITS = 16; // Giới hạn tín chỉ - hardcode

    const fetchInitialData = useCallback(async () => {
        if (!user || !token) return;

        setLoading(true);
        setError(null);

        // hardcode
        const currentKyHoc = 1;
        const currentNamHoc = '2025-2026';

        try {
            const [timeRes, availableRes, registeredRes] = await Promise.all([
                api.get('sinh-vien/thoi-gian-dang-ky'),
                api.get(`/sinh-vien/lop-tin-chi?kyHoc=${currentKyHoc}&namHoc=${currentNamHoc}`),
                api.get(`/sinh-vien/dang-ky-hien-tai?kyHoc=${currentKyHoc}&namHoc=${currentNamHoc}`) // <-- get các đăng ký cũ
            ]);

                console.log("API Response (Lop Tin Chi):", availableRes);
                console.log("API Response (Dang Ky Hien Tai):", registeredRes);

            // 1. Xử lý danh sách lớp đang mở (như cũ)
            const formattedCourses = availableRes.data.map(lop => (
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
            const formattedRegistered = registeredRes.data.map(dk => ({
                ...dk,
                dangkyhoc_id: dk.dangkyhoc_id // API 'dang-ky-hien-tai' trả về 'id' của DangKyHoc
            }));
            setRegisteredCourses(formattedRegistered); // Dữ liệu đã được format từ backend

            // 3. Lưu lại trạng thái thời gian đăng ký
            setIsRegistrationOpen(timeRes.isRegistrationOpen); // <<< LƯU LẠI
            if (!timeRes.isRegistrationOpen) {
                showNotification('Đã hết thời hạn đăng ký/hủy môn học.', 'warning');
            }

        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu đăng ký.');
            showNotification(`Lỗi: ${err.message || 'Không thể tải dữ liệu.'}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [user, token]); // Phụ thuộc vào user và token

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]); // Chỉ chạy lại khi hàm fetchInitialData thay đổi

    // tính tín chỉ
    const registeredCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    const selectedCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalCredits = registeredCredits + selectedCredits;

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    // Xử lý khi chọn một lớp
    const handleSelectCourse = (course) => {
        // check hạn đăng ký
        if (!isRegistrationOpen) {
            showNotification('Đã hết thời hạn đăng ký.', 'error');
            return;
        }

        // --- Danh sách TẤT CẢ các lớp đã cam kết (đã đăng ký + đang chọn) ---
        const allCommittedCourses = [...registeredCourses, ...selectedCourses];

        // 1. Kiểm tra slot
        if (course.slots === 0) {
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

    // Xử lý khi hủy đăng ký môn học đã đăng ký (gọi API DELETE)
    const handleRemoveRegisteredCourse = async (course) => {
        if (!isRegistrationOpen) {
            showNotification('Đã hết thời hạn hủy đăng ký.', 'error');
            return;
        }

        if (!window.confirm(`Bạn có chắc chắn muốn HỦY đăng ký môn học "${course.courseName}"? Thao tác này không thể hoàn tác.`)) {
            return;
        }

        setSubmitLoading(true); 
        setError(null);

        // Lấy ID đơn đăng ký cần xóa
        const DonCanXoaId = course.dangkyhoc_id;
        console.log(DonCanXoaId);

        if (!DonCanXoaId) {
            showNotification('Lỗi: Không tìm thấy ID đơn đăng ký.', 'error');
            setSubmitLoading(false);
            return;
        }

        try {
            // Gọi API DELETE: router.delete('/dang-ky/:id', ...)
            await api.delete(`/sinh-vien/dang-ky/${DonCanXoaId}`); 
            showNotification(`Đã hủy đăng ký môn học "${course.courseName}" thành công!`, 'success');

            // Cập nhật lại danh sách đăng ký sau khi xóa thành công
            await fetchInitialData(); 

        } catch (err) {
            console.error('Registration removal failed:', err);
            // Hiển thị lỗi từ backend (ví dụ: ngoài thời gian đăng ký, đã có điểm,...)
            showNotification(`Hủy đăng ký thất bại: ${err.message || 'Lỗi không xác định.'}`, 'error');
            setError(err.message); 
        } finally {
            setSubmitLoading(false);
        }
    };


    // Xử lý khi nhấn nút Xác nhận phiếu đăng ký
    const handleConfirmRegistration = async () => {
        if (!isRegistrationOpen) {
            showNotification('Đã hết thời hạn đăng ký.', 'error');
            return;
        }

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

    
    // // Tìm kiếm theo Mã lớp (id), Tên môn, Mã môn, hoặc Giảng viên
    const filteredCourses = availableCourses.filter(course =>
        (course.classCode && course.classCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.teacher && course.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

            {/* Error */}
            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Lỗi!</span> {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo mã lớp, tên môn, mã môn hoặc giảng viên..."
                />
            </div>

            {/* Available Courses Table - Bảng danh sách lớp tín chỉ */}
            <AvailableCoursesTable
                availableCourses={filteredCourses}
                selectedCourses={selectedCourses}
                registeredCourses={registeredCourses}
                loading={loading}
                handleSelectCourse={handleSelectCourse}
                isRegistrationOpen={isRegistrationOpen}
            />


            {/* Credit Summary - Phần tổng quan tín chỉ */}
            <CreditSummary
                registeredCredits={registeredCredits}
                selectedCredits={selectedCredits}
                totalCredits={totalCredits}
                maxCredits={MAX_CREDITS}
            />
            
            {/* Selected Courses List - Danh sách lớp đã chọn */}
            <RegistrationList
                registeredCourses={registeredCourses}
                selectedCourses={selectedCourses}
                onRemove={handleRemoveCourse}
                onRemoveRegistered={handleRemoveRegisteredCourse}
                onConfirm={handleConfirmRegistration}
                submitLoading={submitLoading}
                totalCredits={totalCredits}
                selectedCredits={selectedCredits}
                maxCredits={MAX_CREDITS}
                isRegistrationOpen={isRegistrationOpen}
            />
        </div>
    );
}

export default CourseRegistrationPage;
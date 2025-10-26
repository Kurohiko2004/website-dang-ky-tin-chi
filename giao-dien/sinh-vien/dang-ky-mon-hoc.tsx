import React, { useState } from 'react';
import { BookOpen, User, Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CourseRegistration = () => {
  const [availableCourses] = useState([
    { id: 1, classCode: 'CS101-01', courseName: 'Lập trình căn bản', courseCode: 'CS101', teacher: 'TS. Nguyễn Văn A', slots: 5, schedule: 'T2, T4', shift: '7:30-9:30', credits: 3 },
    { id: 2, classCode: 'CS102-02', courseName: 'Cấu trúc dữ liệu', courseCode: 'CS102', teacher: 'PGS. Trần Thị B', slots: 0, schedule: 'T3, T5', shift: '9:30-11:30', credits: 4 },
    { id: 3, classCode: 'MA201-01', courseName: 'Toán rời rạc', courseCode: 'MA201', teacher: 'TS. Lê Văn C', slots: 10, schedule: 'T2, T4', shift: '13:30-15:30', credits: 3 },
    { id: 4, classCode: 'EN101-03', courseName: 'Tiếng Anh 1', courseCode: 'EN101', teacher: 'ThS. Phạm Thị D', slots: 3, schedule: 'T3, T6', shift: '15:30-17:30', credits: 2 },
    { id: 5, classCode: 'CS103-01', courseName: 'Cơ sở dữ liệu', courseCode: 'CS103', teacher: 'TS. Hoàng Văn E', slots: 8, schedule: 'T5, T7', shift: '7:30-9:30', credits: 4 },
    { id: 6, classCode: 'CS104-02', courseName: 'Mạng máy tính', courseCode: 'CS104', teacher: 'PGS. Đỗ Thị F', slots: 2, schedule: 'T2, T5', shift: '9:30-11:30', credits: 3 },
  ]);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [notification, setNotification] = useState(null);

  const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

  const handleSelectCourse = (course) => {
    if (course.slots === 0) {
      showNotification('Lớp này đã hết slot!', 'error');
      return;
    }

    if (selectedCourses.find(c => c.id === course.id)) {
      showNotification('Bạn đã chọn lớp này rồi!', 'warning');
      return;
    }

    const newTotalCredits = totalCredits + course.credits;
    if (newTotalCredits > 15) {
      showNotification(`Không thể đăng ký! Tổng số tín chỉ sẽ vượt quá 15 (${newTotalCredits}/15)`, 'error');
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
    showNotification(`Đã thêm ${course.courseName} vào danh sách đăng ký`, 'success');
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
    showNotification('Đã xóa môn học khỏi danh sách', 'success');
  };

  const handleConfirmRegistration = () => {
    if (selectedCourses.length === 0) {
      showNotification('Vui lòng chọn ít nhất một môn học!', 'warning');
      return;
    }

    // Gửi dữ liệu đến backend
    const registrationData = {
      studentId: 'SV2024001',
      courses: selectedCourses.map(c => ({
        classCode: c.classCode,
        courseCode: c.courseCode,
        courseName: c.courseName,
        credits: c.credits
      })),
      totalCredits: totalCredits,
      timestamp: new Date().toISOString()
    };

    console.log('Dữ liệu gửi đến Backend:', registrationData);
    
    // Giả lập gửi request
    showNotification('Đăng ký thành công! Dữ liệu đã được gửi đến hệ thống.', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen size={28} />
            Hệ thống Đăng ký Môn học
          </h1>
          <p className="text-blue-100 mt-1">Sinh viên: Nguyễn Văn An - MSSV: SV2024001</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-yellow-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle size={20} />}
          {notification.type === 'error' && <XCircle size={20} />}
          {notification.type === 'warning' && <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Dashboard</h2>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                  Đăng ký môn học
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Lịch học
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Kết quả học tập
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Thông tin cá nhân
                </button>
              </nav>

              {/* Credit Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Tổng quan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tín chỉ đã chọn:</span>
                    <span className={`font-bold ${totalCredits > 15 ? 'text-red-600' : 'text-blue-600'}`}>
                      {totalCredits}/15
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Môn đã chọn:</span>
                    <span className="font-bold text-blue-600">{selectedCourses.length}</span>
                  </div>
                </div>
                <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${totalCredits > 15 ? 'bg-red-500' : 'bg-blue-500'} transition-all`}
                    style={{ width: `${Math.min((totalCredits / 15) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Courses */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Danh sách lớp tín chỉ</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã lớp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên môn học</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã MH</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giảng viên</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slot</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lịch học</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kíp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">TC</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {availableCourses.map(course => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.classCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.courseName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{course.courseCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                          <User size={14} />
                          {course.teacher}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            course.slots === 0 ? 'bg-red-100 text-red-700' :
                            course.slots < 5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            <Users size={12} />
                            {course.slots}
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
                            {course.shift}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.credits}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleSelectCourse(course)}
                            disabled={course.slots === 0 || selectedCourses.find(c => c.id === course.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {selectedCourses.find(c => c.id === course.id) ? 'Đã chọn' : 'Chọn'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Courses */}
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
                      <div key={course.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{course.courseName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {course.classCode} - {course.teacher} - {course.schedule} ({course.shift}) - {course.credits} TC
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveCourse(course.id)}
                          className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Tổng số tín chỉ:</div>
                      <div className={`text-2xl font-bold ${totalCredits > 15 ? 'text-red-600' : 'text-blue-600'}`}>
                        {totalCredits} / 15
                      </div>
                    </div>
                    <button
                      onClick={handleConfirmRegistration}
                      className="px-6 py-3 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Xác nhận phiếu đăng ký
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
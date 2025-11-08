import React from "react";
import { User, Calendar, Clock, Users } from "lucide-react";

/**
 * Hiển thị bảng danh sách các lớp tín chỉ có sẵn để đăng ký.
 * Props:
 * - availableCourses: array - Danh sách lớp tín chỉ đang mở.
 * - selectedCourses: array - Danh sách lớp đã chọn (trong giỏ hàng).
 * - registeredCourses: array - Danh sách lớp đã đăng ký/chờ duyệt.
 * - loading: boolean - Trạng thái loading.
 * - handleSelectCourse: function - Hàm xử lý khi chọn một lớp.
 */
function AvailableCoursesTable({
  availableCourses = [],
  selectedCourses = [],
  registeredCourses = [],
  loading = false,
  handleSelectCourse,
  isRegistrationOpen,
}) {
  // Nếu bạn muốn hiển thị thông báo loading/empty state bên trong component này (ngoài full-page loading)
  if (loading && availableCourses.length === 0) {
    return (
      <div className="p-6 text-center">Đang tải danh sách lớp học phần...</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Danh sách lớp tín chỉ
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mã lớp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên môn học
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mã MH
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Giảng viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Slot
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lịch học
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kíp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                TC
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          {availableCourses.map((course) => {
            const isSelected = selectedCourses.some((c) => c.id === course.id);
            const registeredInfo = registeredCourses.find(
              (c) => c.id === course.id
            );
            const isRegistered = !!registeredInfo;
            const isDisabled =
              !isRegistrationOpen ||
              course.slots === 0 ||
              isSelected ||
              isRegistered;

            return (
              <tr
                key={course.id}
                className={`${
                  isSelected
                    ? "bg-blue-50"
                    : registeredInfo
                    ? "bg-green-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {course.classCode}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {course.courseName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {course.courseCode}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                  <User size={14} />
                  {course.teacher}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      course.slots === 0
                        ? "bg-red-100 text-red-700"
                        : course.slots < 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <Users size={12} />
                    {course.slots === null ? "∞" : course.slots}
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
                    {course.shift
                      ? course.shift.replace("-", "h-") + "h"
                      : "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {course.credits}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSelectCourse(course)}
                    disabled={isDisabled}
                    className={`px-3 py-1 text-sm font-medium text-white rounded focus:outline-none 
                        ${
                          isSelected || isRegistered
                            ? "bg-gray-400 cursor-not-allowed"
                            : course.slots === 0
                            ? "bg-red-400 cursor-not-allowed"
                            : !isRegistrationOpen
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                        disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isRegistered
                      ? "Đã ĐK"
                      : isSelected
                      ? "Đã chọn"
                      : course.slots === 0
                      ? "Hết chỗ"
                      : !isRegistrationOpen
                      ? "Hết hạn"
                      : "Chọn"}
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      {availableCourses.length === 0 && !loading && (
        <div className="p-8 text-center text-gray-500">
          Không có lớp học phần nào mở trong kỳ này hoặc đã hết thời gian đăng
          ký.
        </div>
      )}
    </div>
  );
}

export default AvailableCoursesTable;

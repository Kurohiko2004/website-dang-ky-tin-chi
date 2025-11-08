import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

function RegisteredItem({ course, onRemoveRegistered, isRegistrationOpen }) {
    // --- SỬA LOGIC: Quyền hủy phụ thuộc vào isRegistrationOpen ---
    // và (có thể) trạng thái của môn học (ví dụ: đã có điểm thì không được hủy)
    // Giả sử backend (API xóa) sẽ check logic có điểm,
    // frontend chỉ cần check thời gian.
  const isCancellable = isRegistrationOpen;

  // Với logic mới, tất cả các môn đã đăng ký đều là 'Đã duyệt'
  const statusText = 'Đã duyệt';
  const statusColor = 'bg-green-100 text-green-700';

  return (
    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex-1">
        <div className="font-semibold text-gray-900">
          {course.courseName}
          <span className="text-sm font-normal text-gray-500 ml-2">({course.classCode})</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {course.teacher} | {course.schedule} ({course.shift}) | {course.credits} TC
        </div>
      </div>
      <div className="ml-4 text-sm font-medium">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              <CheckCircle size={14} />
              {statusText}
          </span>
      </div>

      {/* NÚT HỦY ĐĂNG KÝ */}
      {/* Vô hiệu hóa nút nếu không trong thời gian đăng ký */}
        <button
            onClick={() => onRemoveRegistered(course)}
            disabled={!isCancellable} // <<< SỬ DỤNG LOGIC MỚI
            title={!isCancellable ? 'Đã hết thời hạn hủy đăng ký.' : 'Hủy đăng ký môn học này.'}
            className={`ml-3 p-1.5 text-white rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isCancellable 
                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                    : 'bg-gray-400 cursor-not-allowed'
            } disabled:opacity-70`}
        >
            <Trash2 size={16} />
        </button>
    </div>
  );
}

function SelectedItem({ course, onRemove }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <div className="font-semibold text-gray-900">
          {course.courseName}
          <span className="text-sm font-normal text-gray-500 ml-2">({course.classCode})</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {course.teacher} | {course.schedule} ({course.shift}) | {course.credits} TC
        </div>
      </div>
      <button
        onClick={() => onRemove(course.id)}
        className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        aria-label={`Xóa lớp ${course.courseName}`}
      >
        Xóa
      </button>
    </div>
  );
}

/**
 * RegistrationList
 * Props:
 * - registeredCourses: array
 * - selectedCourses: array
 * - onRemoveRegistered: function(course)
 * - onRemove: function(courseId)
 * - onConfirm: function()
 * - submitLoading: boolean
 * - totalCredits: number
 * - selectedCredits: number
 * - maxCredits: number
 */

export default function RegistrationList({
  registeredCourses = [],
  selectedCourses = [],
  onRemoveRegistered,
  onRemove,
  onConfirm,
  submitLoading = false,
  totalCredits = 0,
  selectedCredits = 0,
  maxCredits = 16,
  isRegistrationOpen
}) {
  const noItems = registeredCourses.length === 0 && selectedCourses.length === 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Danh sách đăng ký ({selectedCourses.length} môn đang chọn)</h2>
      </div>

      {noItems ? (
        <div className="p-8 text-center text-gray-500">
          Chưa có lớp học phần nào được chọn hoặc đăng ký.
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Registered */}
          {registeredCourses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Các lớp đã đăng ký</h3>
              <div className="space-y-3">
                {registeredCourses.map(course => (
                  <RegisteredItem 
                    key={`reg-${course.id}`} 
                    course={course} 
                    onRemoveRegistered={onRemoveRegistered} 
                    isRegistrationOpen={isRegistrationOpen}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selected */}
          {isRegistrationOpen && selectedCourses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Các lớp đang chọn</h3>
              <div className="space-y-3">
                {selectedCourses.map(course => (
                  <SelectedItem key={`sel-${course.id}`} course={course} onRemove={onRemove} />
                ))}
              </div>
            </div>
          )}

          {/* Confirm area - chỉ hiện khi có selectedCourses */}
          {isRegistrationOpen && selectedCourses.length > 0 && (
            <div className="mt-2">
              <div className="mt-6 flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Tổng số tín chỉ (trong giỏ hàng):</div>
                  <div className={`text-2xl font-bold ${totalCredits > maxCredits ? 'text-red-600' : 'text-blue-600'}`}>
                    {selectedCredits}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Tổng cộng đã đăng ký: {totalCredits} / {maxCredits}</div>
                  {totalCredits > maxCredits && <p className="text-xs text-red-600 mt-1">Tổng tín chỉ vượt quá giới hạn!</p>}
                </div>

                <button
                  onClick={onConfirm}
                  // Vô hiệu hóa nếu không trong thời gian đăng ký
                  disabled={!isRegistrationOpen || selectedCourses.length === 0 || totalCredits > maxCredits || submitLoading}
                  className={`px-6 py-3 text-white rounded-lg font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    (selectedCourses.length === 0 || totalCredits > maxCredits || submitLoading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {submitLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

          {!isRegistrationOpen && (
            <div className="p-4 text-center text-yellow-700 bg-yellow-50 rounded-lg">
                Đã hết thời hạn đăng ký. Bạn chỉ có thể xem các lớp đã đăng ký.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

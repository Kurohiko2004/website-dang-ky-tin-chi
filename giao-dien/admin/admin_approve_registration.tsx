import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle, XCircle, Clock, User, Calendar, FileText, AlertCircle } from 'lucide-react';

const AdminApproveRegistration = () => {
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      studentId: 'SV2024001',
      studentName: 'Nguyễn Văn An',
      email: 'an.nguyen@student.edu.vn',
      submitDate: '2024-10-25 14:30',
      status: 'pending',
      totalCredits: 12,
      courses: [
        { classCode: 'CS101-01', courseName: 'Lập trình căn bản', credits: 3 },
        { classCode: 'MA201-01', courseName: 'Toán rời rạc', credits: 3 },
        { classCode: 'EN101-03', courseName: 'Tiếng Anh 1', credits: 2 },
        { classCode: 'CS103-01', courseName: 'Cơ sở dữ liệu', credits: 4 }
      ]
    },
    {
      id: 2,
      studentId: 'SV2024002',
      studentName: 'Trần Thị Bình',
      email: 'binh.tran@student.edu.vn',
      submitDate: '2024-10-25 15:45',
      status: 'pending',
      totalCredits: 15,
      courses: [
        { classCode: 'CS102-02', courseName: 'Cấu trúc dữ liệu', credits: 4 },
        { classCode: 'CS104-02', courseName: 'Mạng máy tính', credits: 3 },
        { classCode: 'CS101-01', courseName: 'Lập trình căn bản', credits: 3 },
        { classCode: 'PH101-01', courseName: 'Vật lý đại cương', credits: 3 },
        { classCode: 'EN101-03', courseName: 'Tiếng Anh 1', credits: 2 }
      ]
    },
    {
      id: 3,
      studentId: 'SV2024003',
      studentName: 'Lê Văn Cường',
      email: 'cuong.le@student.edu.vn',
      submitDate: '2024-10-25 16:20',
      status: 'approved',
      totalCredits: 11,
      approvedDate: '2024-10-26 09:15',
      courses: [
        { classCode: 'MA201-01', courseName: 'Toán rời rạc', credits: 3 },
        { classCode: 'CS103-01', courseName: 'Cơ sở dữ liệu', credits: 4 },
        { classCode: 'CS104-02', courseName: 'Mạng máy tính', credits: 3 }
      ]
    },
    {
      id: 4,
      studentId: 'SV2024004',
      studentName: 'Phạm Thị Dung',
      email: 'dung.pham@student.edu.vn',
      submitDate: '2024-10-24 10:30',
      status: 'rejected',
      totalCredits: 13,
      rejectedDate: '2024-10-25 14:00',
      rejectionReason: 'Trùng lịch học giữa các môn',
      courses: [
        { classCode: 'CS101-01', courseName: 'Lập trình căn bản', credits: 3 },
        { classCode: 'MA201-01', courseName: 'Toán rời rạc', credits: 3 },
        { classCode: 'CS201-01', courseName: 'Lập trình hướng đối tượng', credits: 4 },
        { classCode: 'EN101-03', courseName: 'Tiếng Anh 1', credits: 3 }
      ]
    },
    {
      id: 5,
      studentId: 'SV2024005',
      studentName: 'Hoàng Văn Em',
      email: 'em.hoang@student.edu.vn',
      submitDate: '2024-10-26 08:45',
      status: 'pending',
      totalCredits: 14,
      courses: [
        { classCode: 'CS102-02', courseName: 'Cấu trúc dữ liệu', credits: 4 },
        { classCode: 'CS103-01', courseName: 'Cơ sở dữ liệu', credits: 4 },
        { classCode: 'MA201-01', courseName: 'Toán rời rạc', credits: 3 },
        { classCode: 'EN101-03', courseName: 'Tiếng Anh 1', credits: 3 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notification, setNotification] = useState(null);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (registration) => {
    setSelectedRegistration(registration);
    setRejectionReason('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
    setRejectionReason('');
  };

  const handleApprove = (registration) => {
    setRegistrations(registrations.map(reg =>
      reg.id === registration.id
        ? { ...reg, status: 'approved', approvedDate: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : reg
    ));
    showNotification(`Đã duyệt đơn đăng ký của ${registration.studentName}`, 'success');
    console.log('Duyệt đơn:', registration);
    handleCloseModal();
  };

  const handleReject = (registration) => {
    if (!rejectionReason.trim()) {
      showNotification('Vui lòng nhập lý do từ chối!', 'error');
      return;
    }

    setRegistrations(registrations.map(reg =>
      reg.id === registration.id
        ? { 
            ...reg, 
            status: 'rejected', 
            rejectedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
            rejectionReason: rejectionReason
          }
        : reg
    ));
    showNotification(`Đã từ chối đơn đăng ký của ${registration.studentName}`, 'success');
    console.log('Từ chối đơn:', { registration, reason: rejectionReason });
    handleCloseModal();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'approved':
        return { text: 'Đã duyệt', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'rejected':
        return { text: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-700', icon: Clock };
    }
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen size={28} />
            Hệ thống Quản lý - Admin
          </h1>
          <p className="text-green-100 mt-1">Quản trị viên: Admin - admin@university.edu.vn</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-yellow-500'
        } text-white animate-fade-in`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Dashboard</h2>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  CRUD Môn học
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Quản lý Lớp học
                </button>
                <button className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
                  Duyệt đơn đăng ký
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Quản lý Sinh viên
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Quản lý Giảng viên
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                  Thống kê
                </button>
              </nav>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Thống kê</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng đơn:</span>
                    <span className="font-bold text-green-600">{registrations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chờ duyệt:</span>
                    <span className="font-bold text-yellow-600">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã duyệt:</span>
                    <span className="font-bold text-green-600">{approvedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã từ chối:</span>
                    <span className="font-bold text-red-600">{rejectedCount}</span>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">Lọc theo trạng thái</h3>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Đã từ chối</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Header Section */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Duyệt đơn đăng ký học</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {pendingCount} đơn chờ duyệt
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sinh viên hoặc MSSV..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="p-6">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Không tìm thấy đơn đăng ký nào</p>
                    <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRegistrations.map(registration => {
                      const statusBadge = getStatusBadge(registration.status);
                      const StatusIcon = statusBadge.icon;
                      
                      return (
                        <div
                          key={registration.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                          onClick={() => handleOpenModal(registration)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{registration.studentName}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}>
                                  <StatusIcon size={14} />
                                  {statusBadge.text}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <User size={14} />
                                  MSSV: {registration.studentId}
                                </span>
                                <span>•</span>
                                <span>{registration.email}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="text-gray-500">Ngày nộp:</span>
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <Calendar size={14} />
                                {registration.submitDate}
                              </p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Số môn đăng ký:</span>
                              <p className="font-medium text-gray-900">{registration.courses.length} môn</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Tổng tín chỉ:</span>
                              <p className="font-medium text-gray-900">{registration.totalCredits} TC</p>
                            </div>
                          </div>

                          {registration.status === 'approved' && (
                            <div className="mt-2 pt-2 border-t text-sm text-green-600">
                              Đã duyệt lúc: {registration.approvedDate}
                            </div>
                          )}

                          {registration.status === 'rejected' && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-sm text-red-600">Từ chối lúc: {registration.rejectedDate}</p>
                              <p className="text-sm text-gray-600 mt-1">Lý do: {registration.rejectionReason}</p>
                            </div>
                          )}

                          {registration.status === 'pending' && (
                            <div className="mt-3 pt-3 border-t flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(registration);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                              >
                                <CheckCircle size={18} />
                                Duyệt đơn
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(registration);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                              >
                                <XCircle size={18} />
                                Từ chối
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedRegistration.studentName}</h3>
                  <p className="text-sm text-gray-600 mt-1">MSSV: {selectedRegistration.studentId} • {selectedRegistration.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(selectedRegistration.status).color}`}>
                  {React.createElement(getStatusBadge(selectedRegistration.status).icon, { size: 14 })}
                  {getStatusBadge(selectedRegistration.status).text}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Ngày nộp đơn</p>
                  <p className="font-semibold text-gray-900">{selectedRegistration.submitDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số môn đăng ký</p>
                  <p className="font-semibold text-gray-900">{selectedRegistration.courses.length} môn</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng tín chỉ</p>
                  <p className="font-semibold text-gray-900">{selectedRegistration.totalCredits} TC</p>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Danh sách môn học đăng ký:</h4>
              <div className="space-y-2 mb-6">
                {selectedRegistration.courses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">{course.courseName}</p>
                      <p className="text-sm text-gray-600">Mã lớp: {course.classCode}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {course.credits} TC
                    </span>
                  </div>
                ))}
              </div>

              {selectedRegistration.status === 'pending' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do từ chối (nếu từ chối)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nhập lý do từ chối đơn đăng ký..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {selectedRegistration.status === 'rejected' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">Lý do từ chối:</p>
                  <p className="text-sm text-red-700">{selectedRegistration.rejectionReason}</p>
                  <p className="text-xs text-red-600 mt-2">Từ chối lúc: {selectedRegistration.rejectedDate}</p>
                </div>
              )}

              {selectedRegistration.status === 'approved' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Đơn đã được duyệt</p>
                  <p className="text-xs text-green-600 mt-1">Duyệt lúc: {selectedRegistration.approvedDate}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedRegistration.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedRegistration)}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    <XCircle size={18} />
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRegistration)}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <CheckCircle size={18} />
                    Duyệt đơn
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproveRegistration;
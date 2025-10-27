import React, { useState } from 'react';
import { Search, BookOpen, Edit2, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Users, Calendar, Clock, User } from 'lucide-react';

const AdminClassCRUD = () => {
  const [classes, setClasses] = useState([
    { id: 1, classCode: 'CS101-01', courseCode: 'CS101', courseName: 'Lập trình căn bản', teacher: 'TS. Nguyễn Văn A', maxSlots: 40, enrolledSlots: 35, schedule: 'T2, T4', shift: '7:30-9:30', room: 'A101', semester: 'HK1 2024-2025' },
    { id: 2, classCode: 'CS102-02', courseCode: 'CS102', courseName: 'Cấu trúc dữ liệu', teacher: 'PGS. Trần Thị B', maxSlots: 35, enrolledSlots: 35, schedule: 'T3, T5', shift: '9:30-11:30', room: 'B203', semester: 'HK1 2024-2025' },
    { id: 3, classCode: 'MA201-01', courseCode: 'MA201', courseName: 'Toán rời rạc', teacher: 'TS. Lê Văn C', maxSlots: 45, enrolledSlots: 35, schedule: 'T2, T4', shift: '13:30-15:30', room: 'C105', semester: 'HK1 2024-2025' },
    { id: 4, classCode: 'EN101-03', courseCode: 'EN101', courseName: 'Tiếng Anh 1', teacher: 'ThS. Phạm Thị D', maxSlots: 30, enrolledSlots: 27, schedule: 'T3, T6', shift: '15:30-17:30', room: 'D201', semester: 'HK1 2024-2025' },
    { id: 5, classCode: 'CS103-01', courseCode: 'CS103', courseName: 'Cơ sở dữ liệu', teacher: 'TS. Hoàng Văn E', maxSlots: 40, enrolledSlots: 32, schedule: 'T5, T7', shift: '7:30-9:30', room: 'A102', semester: 'HK1 2024-2025' },
    { id: 6, classCode: 'CS104-02', courseCode: 'CS104', courseName: 'Mạng máy tính', teacher: 'PGS. Đỗ Thị F', maxSlots: 38, enrolledSlots: 36, schedule: 'T2, T5', shift: '9:30-11:30', room: 'B105', semester: 'HK1 2024-2025' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editForm, setEditForm] = useState({
    classCode: '',
    courseCode: '',
    courseName: '',
    teacher: '',
    maxSlots: '',
    enrolledSlots: '',
    schedule: '',
    shift: '',
    room: '',
    semester: ''
  });

  const filteredClasses = classes.filter(cls =>
    cls.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (cls, isAdd = false) => {
    setIsAddMode(isAdd);
    if (isAdd) {
      setEditForm({
        classCode: '',
        courseCode: '',
        courseName: '',
        teacher: '',
        maxSlots: '',
        enrolledSlots: 0,
        schedule: '',
        shift: '',
        room: '',
        semester: ''
      });
    } else {
      setSelectedClass(cls);
      setEditForm({ ...cls });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
    setIsAddMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: (name === 'maxSlots' || name === 'enrolledSlots') ? parseInt(value) || '' : value
    }));
  };

  const handleSave = () => {
    if (!editForm.classCode || !editForm.courseCode || !editForm.courseName || !editForm.teacher || !editForm.maxSlots) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
      return;
    }

    if (editForm.enrolledSlots > editForm.maxSlots) {
      showNotification('Số sinh viên đã đăng ký không được vượt quá số slot tối đa!', 'error');
      return;
    }

    if (isAddMode) {
      const newClass = {
        ...editForm,
        id: Math.max(...classes.map(c => c.id)) + 1
      };
      setClasses([...classes, newClass]);
      showNotification('Thêm lớp học thành công!', 'success');
      console.log('Thêm lớp học:', newClass);
    } else {
      setClasses(classes.map(cls =>
        cls.id === selectedClass.id ? { ...cls, ...editForm } : cls
      ));
      showNotification('Cập nhật lớp học thành công!', 'success');
      console.log('Cập nhật lớp học:', editForm);
    }
    
    handleCloseModal();
  };

  const handleDelete = (cls) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${cls.classCode}"?`)) {
      setClasses(classes.filter(c => c.id !== cls.id));
      showNotification('Xóa lớp học thành công!', 'success');
      console.log('Xóa lớp học:', cls);
    }
  };

  const getSlotStatus = (enrolled, max) => {
    const available = max - enrolled;
    if (available === 0) return { text: 'Hết slot', color: 'bg-red-100 text-red-700' };
    if (available < 5) return { text: `Còn ${available}`, color: 'bg-yellow-100 text-yellow-700' };
    return { text: `Còn ${available}`, color: 'bg-green-100 text-green-700' };
  };

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
                <button className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
                  Quản lý Lớp học
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
                    <span className="text-gray-600">Tổng lớp học:</span>
                    <span className="font-bold text-green-600">{classes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kết quả tìm kiếm:</span>
                    <span className="font-bold text-green-600">{filteredClasses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lớp đầy:</span>
                    <span className="font-bold text-red-600">
                      {classes.filter(c => c.enrolledSlots === c.maxSlots).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Header Section */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h2>
                  <button
                    onClick={() => handleOpenModal(null, true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <Plus size={20} />
                    Thêm lớp học
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã lớp hoặc tên môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="p-6">
                {filteredClasses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Không tìm thấy lớp học nào</p>
                    <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredClasses.map(cls => {
                      const slotStatus = getSlotStatus(cls.enrolledSlots, cls.maxSlots);
                      return (
                        <div
                          key={cls.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                          onClick={() => handleOpenModal(cls)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{cls.classCode}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${slotStatus.color}`}>
                                  {slotStatus.text}
                                </span>
                              </div>
                              <p className="font-medium text-gray-700">{cls.courseName}</p>
                              <p className="text-sm text-gray-500">Mã môn: {cls.courseCode}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(cls);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(cls);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User size={16} className="text-gray-400" />
                              <span>{cls.teacher}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users size={16} className="text-gray-400" />
                              <span>{cls.enrolledSlots}/{cls.maxSlots} SV</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} className="text-gray-400" />
                              <span>{cls.schedule}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} className="text-gray-400" />
                              <span>{cls.shift}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                            Phòng: {cls.room} • {cls.semester}
                          </div>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {isAddMode ? 'Thêm lớp học mới' : 'Chỉnh sửa lớp học'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã lớp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="classCode"
                    value={editForm.classCode}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: CS101-01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={editForm.courseCode}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: CS101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={editForm.courseName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Lập trình căn bản"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảng viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={editForm.teacher}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: TS. Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số slot tối đa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxSlots"
                    value={editForm.maxSlots}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 40"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số sinh viên đã đăng ký
                  </label>
                  <input
                    type="number"
                    name="enrolledSlots"
                    value={editForm.enrolledSlots}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 35"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lịch học
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    value={editForm.schedule}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: T2, T4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kíp học
                  </label>
                  <input
                    type="text"
                    name="shift"
                    value={editForm.shift}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 7:30-9:30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={editForm.room}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: A101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Học kỳ
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={editForm.semester}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: HK1 2024-2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <Save size={18} />
                {isAddMode ? 'Thêm lớp học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClassCRUD;
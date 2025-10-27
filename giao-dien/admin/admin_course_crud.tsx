import React, { useState } from 'react';
import { Search, BookOpen, Edit2, Trash2, Plus, X, Save, AlertCircle, CheckCircle } from 'lucide-react';

const AdminCourseCRUD = () => {
  const [courses, setCourses] = useState([
    { id: 1, courseCode: 'CS101', courseName: 'Lập trình căn bản', credits: 3, description: 'Môn học giới thiệu về lập trình cơ bản với C/C++' },
    { id: 2, courseCode: 'CS102', courseName: 'Cấu trúc dữ liệu', credits: 4, description: 'Nghiên cứu các cấu trúc dữ liệu cơ bản và thuật toán' },
    { id: 3, courseCode: 'MA201', courseName: 'Toán rời rạc', credits: 3, description: 'Các khái niệm toán học rời rạc cho khoa học máy tính' },
    { id: 4, courseCode: 'EN101', courseName: 'Tiếng Anh 1', credits: 2, description: 'Tiếng Anh cơ bản cho sinh viên năm nhất' },
    { id: 5, courseCode: 'CS103', courseName: 'Cơ sở dữ liệu', credits: 4, description: 'Thiết kế và quản lý cơ sở dữ liệu quan hệ' },
    { id: 6, courseCode: 'CS104', courseName: 'Mạng máy tính', credits: 3, description: 'Kiến trúc và giao thức mạng máy tính' },
    { id: 7, courseCode: 'PH101', courseName: 'Vật lý đại cương', credits: 3, description: 'Các nguyên lý cơ bản của vật lý' },
    { id: 8, courseCode: 'CS201', courseName: 'Lập trình hướng đối tượng', credits: 4, description: 'Lập trình OOP với Java' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editForm, setEditForm] = useState({
    courseCode: '',
    courseName: '',
    credits: '',
    description: '',
    department: ''
  });

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (course, isAdd = false) => {
    setIsAddMode(isAdd);
    if (isAdd) {
      setEditForm({
        courseCode: '',
        courseName: '',
        credits: '',
        description: '',
        department: ''
      });
    } else {
      setSelectedCourse(course);
      setEditForm({ ...course });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setIsAddMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || '' : value
    }));
  };

  const handleSave = () => {
    if (!editForm.courseCode || !editForm.courseName || !editForm.credits) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
      return;
    }

    if (isAddMode) {
      const newCourse = {
        ...editForm,
        id: Math.max(...courses.map(c => c.id)) + 1
      };
      setCourses([...courses, newCourse]);
      showNotification('Thêm môn học thành công!', 'success');
      console.log('Thêm môn học:', newCourse);
    } else {
      setCourses(courses.map(course =>
        course.id === selectedCourse.id ? { ...course, ...editForm } : course
      ));
      showNotification('Cập nhật môn học thành công!', 'success');
      console.log('Cập nhật môn học:', editForm);
    }
    
    handleCloseModal();
  };

  const handleDelete = (course) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.courseName}"?`)) {
      setCourses(courses.filter(c => c.id !== course.id));
      showNotification('Xóa môn học thành công!', 'success');
      console.log('Xóa môn học:', course);
    }
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
                <button className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
                  CRUD Môn học
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
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
                    <span className="text-gray-600">Tổng môn học:</span>
                    <span className="font-bold text-green-600">{courses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kết quả tìm kiếm:</span>
                    <span className="font-bold text-green-600">{filteredCourses.length}</span>
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
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Môn học</h2>
                  <button
                    onClick={() => handleOpenModal(null, true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <Plus size={20} />
                    Thêm môn học
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên môn học hoặc mã môn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="p-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Không tìm thấy môn học nào</p>
                    <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map(course => (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                        onClick={() => handleOpenModal(course)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{course.courseName}</h3>
                            <p className="text-sm text-gray-500 mt-1">Mã môn: {course.courseCode}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {course.credits} TC
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{course.department}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(course);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {isAddMode ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}
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
                  Số tín chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="credits"
                  value={editForm.credits}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 3"
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoa/Bộ môn
                </label>
                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Khoa Công nghệ Thông tin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả môn học
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả chi tiết về môn học..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
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
                {isAddMode ? 'Thêm môn học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseCRUD;
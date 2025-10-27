import React, { useState } from 'react';
import { Calendar, Printer } from 'lucide-react';

const ScheduleViewer = () => {
  const [selectedSemester, setSelectedSemester] = useState('1-2025-2026');

  const schedule = {
    'Thứ 2': [
      {
        session: 1,
        subject: 'Thị giác máy tính (ELE14104)',
        group: '01',
        room: '305-NT-305 - CS Ngọc Trúc',
        lecturer: 'Nguyễn Minh Tuấn'
      },
      {
        session: 3,
        subject: 'Thị giác máy tính (ELE14104)',
        group: '01',
        room: '305-NT-305 - CS Ngọc Trúc',
        lecturer: 'Nguyễn Minh Tuấn'
      }
    ],
    'Thứ 3': [
      {
        session: 1,
        subject: 'Lập trình game cơ bản (MUL1446)',
        group: '01',
        room: '401-NT-401 - CS Ngọc Trúc',
        lecturer: 'Phạm Vũ Minh Tú'
      },
      {
        session: 3,
        subject: 'Lập trình game cơ bản (MUL1446)',
        group: '01',
        room: '401-NT-401 - CS Ngọc Trúc',
        lecturer: 'Phạm Vũ Minh Tú'
      },
      {
        session: 4,
        subject: 'Chuyên đề phát triển ứng dụng đa phương tiện (MUL1451)',
        group: '02',
        room: '401-NT-401 - CS Ngọc Trúc',
        lecturer: 'Hoàng Đăng Hải'
      }
    ],
    'Thứ 4': [
      {
        session: 1,
        subject: 'Lập trình Web (INT1434)',
        group: '05',
        room: '404-NT-404 - CS Ngọc Trúc',
        lecturer: 'Trần Quý Nam'
      },
      {
        session: 3,
        subject: 'Lập trình Web (INT1434)',
        group: '05',
        room: '404-NT-404 - CS Ngọc Trúc',
        lecturer: 'Trần Quý Nam'
      },
      {
        session: 4,
        subject: 'Xử lý ảnh và video (MUL14125)',
        group: '02',
        room: '404-NT-404 - CS Ngọc Trúc',
        lecturer: 'Vũ Hữu Tiến'
      }
    ],
    'Thứ 5': [],
    'Thứ 6': [],
    'Thứ 7': [
      {
        session: 6,
        subject: 'Lập trình Web (INT1434)',
        group: '05',
        room: '507-2-A3-507-2-A3(HN)',
        lecturer: 'Trần Quý Nam'
      }
    ],
    'Chủ Nhật': []
  };

  const sessions = [
    { id: 1, time: '07:00' },
    { id: 3, time: '09:00' },
    { id: 4, time: '10:00' },
    { id: 5, time: '11:00' },
    { id: 6, time: '12:00' },
    { id: 7, time: '13:00' },
    { id: 8, time: '14:00' },
    { id: 9, time: '15:00' }
  ];

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  const getClassForSession = (day, sessionId) => {
    const classes = schedule[day].filter(c => c.session === sessionId);
    return classes;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-7 h-7" />
            Xem Lịch Học
          </h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Học kỳ - Năm học
              </label>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1-2025-2026">Học kỳ 1 - Năm học 2025 - 2026</option>
                <option value="2-2024-2025">Học kỳ 2 - Năm học 2024 - 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-red-700 text-white p-3 border border-red-800 w-24">
                    Trước
                  </th>
                  {days.map(day => (
                    <th key={day} className="bg-red-700 text-white p-3 border border-red-800 min-w-[160px]">
                      {day}
                    </th>
                  ))}
                  <th className="bg-red-700 text-white p-3 border border-red-800 w-24">
                    Sau
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id}>
                    <td className="bg-red-700 text-white p-3 border border-gray-300 text-center font-semibold">
                      <div>Kíp {session.id}</div>
                      <div className="text-sm">{session.time}</div>
                    </td>
                    {days.map(day => {
                      const classes = getClassForSession(day, session.id);
                      return (
                        <td key={day} className="border border-gray-300 p-2 align-top min-h-[80px]">
                          {classes.map((cls, idx) => (
                            <div 
                              key={idx}
                              className="bg-blue-50 border border-blue-200 rounded p-2 mb-2 last:mb-0 text-sm"
                            >
                              <div className="font-semibold text-blue-900 mb-1">
                                {cls.subject}
                              </div>
                              <div className="text-gray-700">
                                <span className="font-medium">Nhóm:</span> {cls.group}
                              </div>
                              <div className="text-gray-700">
                                <span className="font-medium">Phòng:</span> {cls.room}
                              </div>
                              <div className="text-gray-700">
                                <span className="font-medium">GV:</span> {cls.lecturer}
                              </div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                    <td className="bg-red-700 text-white p-3 border border-gray-300 text-center font-semibold">
                      <div>{session.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewer;
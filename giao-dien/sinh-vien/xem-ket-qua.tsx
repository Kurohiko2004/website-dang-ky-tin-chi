import React, { useState } from 'react';

const StudentResultsView = () => {
  const [results] = useState([
    {
      id: 1,
      code: 'INT3110',
      name: 'Lập trình mạng với C++',
      credits: 3,
      cc: 8.5,
      bt: 9,
      gk: 10,
      ck: 9,
      total10: 9.1,
      total4: 4,
      grade: 'A+'
    },
    {
      id: 2,
      code: 'INT3111',
      name: 'Kỹ thuật đồ họa',
      credits: 3,
      cc: 8,
      bt: 8,
      gk: 6.5,
      ck: 5,
      total10: 6.4,
      total4: 2,
      grade: 'C'
    },
    {
      id: 3,
      code: 'INT3113',
      name: 'Cơ sở dữ liệu',
      credits: 3,
      cc: 9,
      bt: 9.6,
      gk: 5,
      ck: 8.5,
      total10: 8.4,
      total4: 3.5,
      grade: 'B+'
    },
    {
      id: 4,
      code: 'INT3140',
      name: 'Nhập môn công nghệ phần mềm',
      credits: 3,
      cc: 10,
      bt: 6.5,
      gk: 6.5,
      ck: 4.5,
      total10: 5.9,
      total4: 2,
      grade: 'C'
    },
    {
      id: 5,
      code: 'MUL3148',
      name: 'Bản quyền số',
      credits: 2,
      cc: 9,
      bt: 9.2,
      gk: 9.2,
      ck: 8.7,
      total10: 8.9,
      total4: 3.7,
      grade: 'A'
    }
  ]);

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-500',
      'A': 'bg-green-500',
      'B+': 'bg-blue-500',
      'B': 'bg-blue-500',
      'C+': 'bg-orange-500',
      'C': 'bg-orange-500',
      'D+': 'bg-orange-600',
      'D': 'bg-orange-600',
      'F': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-500';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold mb-1">👨‍🎓 Sinh viên</h2>
          <p className="text-sm text-gray-400">Nguyễn Văn A</p>
          <p className="text-xs text-gray-500">MSV: 20210001</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              📊 Dashboard
            </li>
            <li className="px-6 py-3 bg-blue-600 border-l-4 border-blue-400 cursor-pointer">
              📚 Xem kết quả
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              📅 Thời khóa biểu
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              📝 Đăng ký học phần
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              💰 Học phí
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              ⚙️ Cài đặt
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
              🚪 Đăng xuất
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Xem kết quả học tập</h1>
          <p className="text-gray-600">Học kỳ 1 Năm học 2025-2026</p>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Kết quả học tập học kỳ</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-4 text-center text-sm font-semibold" rowSpan={2}>STT</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold" rowSpan={2}>Mã môn học</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold" rowSpan={2}>Tên môn học</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold" rowSpan={2}>Số tín chỉ</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold border-l border-gray-700" colSpan={4}>
                    Điểm thành phần
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold border-l border-gray-700" rowSpan={2}>
                    Tổng kết<br />(hệ 10)
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold" rowSpan={2}>
                    Tổng kết<br />(hệ 4)
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold" rowSpan={2}>
                    Tổng kết<br />(chữ)
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold border-l border-gray-700">CC</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">BT</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">GK</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">CK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-600">
                      {result.id}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-800">
                      {result.code}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {result.name}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {result.credits}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-800 border-l border-gray-200">
                      {result.cc}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-800">
                      {result.bt}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-800">
                      {result.gk}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-800">
                      {result.ck}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-800 border-l border-gray-200">
                      {result.total10}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-800">
                      {result.total4}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block ${getGradeColor(result.grade)} text-white px-3 py-1 rounded font-semibold text-sm`}>
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-8 text-sm">
              <div>
                <span className="text-gray-600">Điểm trung bình học kỳ (hệ 4):</span>
                <span className="ml-2 font-bold text-blue-600 text-lg">3.24</span>
              </div>
              <div>
                <span className="text-gray-600">Số tín chỉ đạt:</span>
                <span className="ml-2 font-bold text-green-600 text-lg">14</span>
              </div>
              <div>
                <span className="text-gray-600">Tổng số tín chỉ:</span>
                <span className="ml-2 font-bold text-gray-800 text-lg">14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResultsView;
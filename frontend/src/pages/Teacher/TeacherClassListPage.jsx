import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { BookOpen } from 'lucide-react'; // Example icon for title

function TeacherClassListPage() {
    const { user, token } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for selected semester/year - Initialize appropriately
    const [selectedKyHoc, setSelectedKyHoc] = useState('1'); // Default or fetch current
    const [selectedNamHoc, setSelectedNamHoc] = useState('2025-2026'); // Default or fetch current
    const [semesterLabel, setSemesterLabel] = useState('Học kỳ 1 Năm học 2025-2026'); // Label for display

    // Example options - Fetch or define these based on your needs
    const semesterOptions = [
        { value: '1-2025-2026', label: 'Học kỳ 1 - Năm học 2025 - 2026', ky: '1', nam: '2025-2026' },
        { value: '2-2025-2026', label: 'Học kỳ 2 - Năm học 2025 - 2026', ky: '2', nam: '2025-2026' },
    ];

    const navigate = useNavigate();

    // Fetch class data
    useEffect(() => {
        if (!user || !token || !selectedKyHoc || !selectedNamHoc) {
            setLoading(false);
            return;
        }

        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            setClasses([]);

            try {
                // Call API: GET /giang-vien/lop-hoc-cua-toi?kyHoc=...&namHoc=...
                const response = await api.get(`/giang-vien/lop-hoc-cua-toi?kyHoc=${selectedKyHoc}&namHoc=${selectedNamHoc}`);
                setClasses(response.data); // Assuming response.data is the array of classes
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError(err.message || 'Không thể tải danh sách lớp học.');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user, token, selectedKyHoc, selectedNamHoc]);

    // Handle semester/year change
    const handleSemesterChange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = semesterOptions.find(opt => opt.value === selectedValue);
        if (selectedOption) {
            setSelectedKyHoc(selectedOption.ky);
            setSelectedNamHoc(selectedOption.nam);
            setSemesterLabel(selectedOption.label); // Update display label
        }
    };

    // Navigate to student list / grade entry
    const viewClassDetail = (classId) => {
        navigate(`/giang-vien/lop/${classId}/sinh-vien-diem`); // Route to student/grade page
    };

    // --- Render Component ---
    return (
        <div className="space-y-6"> {/* Use space-y for consistent spacing */}
            {/* Header section similar to the HTML */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <BookOpen className="w-7 h-7 text-blue-600" />
                    Xem lớp học giảng dạy
                </h1>
                {/* Semester Selector */}
                <div className="max-w-sm mt-4">
                    <label htmlFor="semesterSelectTeacher" className="block text-sm font-medium text-gray-700 mb-1">
                        Chọn Học kỳ - Năm học
                    </label>
                    <select
                        id="semesterSelectTeacher"
                        value={`${selectedKyHoc}-${selectedNamHoc}`}
                        onChange={handleSemesterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={loading}
                    >
                        {semesterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-600 font-medium">
                        Đang xem: {semesterLabel}
                    </p>
                </div>
            </div>

            {/* Loading / Error State */}
            {loading && <div className="text-center p-4">Đang tải danh sách lớp...</div>}
            {error && <div className="text-center p-4 text-red-500">Lỗi: {error}</div>}

            {/* Class Table Container */}
            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700">Danh sách lớp học phần</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-12">STT</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mã Lớp HP</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tên học phần</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Số TC</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Sĩ số</th>
                                    {/* Removed 'Lịch học' column to match HTML example structure */}
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classes.length === 0 && (
                                    <tr><td colSpan="6" className="text-center p-4 text-gray-500">Bạn không được phân công lớp nào trong kỳ này.</td></tr>
                                )}
                                {classes.map((lop, index) => (
                                    <tr key={lop.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-center text-sm text-gray-600 font-medium">{index + 1}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{lop.id}</td>
                                        <td className="px-4 py-4 text-sm text-gray-800">{lop.MonHoc?.ten || 'N/A'}</td>
                                        <td className="px-4 py-4 text-center">
                                            {/* Credits Badge - using Tailwind */}
                                            <span className="inline-block bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                                {lop.MonHoc?.soTinChi || '?'} TC
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {/* Student Count Badge - Placeholder */}
                                            {/* TODO: Replace lop.soLuongToiDa with actual count if available */}
                                            <span className="inline-block bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                                {lop.soLuongToiDa ?? '?'} SV
                                            </span>
                                        </td>
                                        {/* Schedule info can be shown on detail page or added back if needed */}
                                        <td className="px-4 py-4 text-center">
                                            {/* Detail Button - using Tailwind */}
                                            <button
                                                onClick={() => viewClassDetail(lop.id)}
                                                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherClassListPage;
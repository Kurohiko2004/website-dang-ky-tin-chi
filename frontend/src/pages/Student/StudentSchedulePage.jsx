// src/pages/Student/StudentSchedulePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Calendar } from 'lucide-react'; // Removed Printer for now

// Helper function to transform API data into the schedule grid format
const transformScheduleData = (apiData) => {
    const schedule = {
        'Thứ 2': [], 'Thứ 3': [], 'Thứ 4': [], 'Thứ 5': [], 'Thứ 6': [], 'Thứ 7': [], 'Chủ Nhật': []
    };
    if (!Array.isArray(apiData)) return schedule; // Return empty if no data

    apiData.forEach(dangKy => {
        const lop = dangKy.LopTinChi; // Access nested LopTinChi data

        console.log(">>> LopTinChi ngayHoc, kipHoc:", lop?.ngayHoc, lop?.kipHoc);

        if (lop && lop.ngayHoc && lop.kipHoc && Object.prototype.hasOwnProperty.call(schedule, lop.ngayHoc)
        ) {
            schedule[lop.ngayHoc].push({
                // Extract relevant details for display
                id: dangKy.id, // Keep DangKyHoc ID if needed
                subject: lop.MonHoc?.ten ? `${lop.MonHoc.ten} (${lop.id})` : lop.id, // Show name and class ID
                // group: 'N/A', // API doesn't seem to provide group number
                room: `${lop.phongHoc || ''} - ${lop.toaNha || ''}`,
                lecturer: lop.GiangVien?.hoTen || 'N/A', // Assuming GiangVien is included
                shift: lop.kipHoc // Use the kipHoc string
            });
        }
    });



    return schedule;
};

function StudentSchedulePage() {
    const { user, token } = useContext(AuthContext);
    const [scheduleData, setScheduleData] = useState({}); // Stores the transformed schedule
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- State for selected semester/year ---
    // TODO: Initialize with current semester/year dynamically if possible
    const [selectedKyHoc, setSelectedKyHoc] = useState('1');
    const [selectedNamHoc, setSelectedNamHoc] = useState('2025-2026');
    // Example options - you might fetch these from an API later
    const semesterOptions = [
        { value: '1-2025-2026', label: 'Học kỳ 1 - Năm học 2025 - 2026', ky: '1', nam: '2025-2026' },
        { value: '2-2024-2025', label: 'Học kỳ 2 - Năm học 2024 - 2025', ky: '2', nam: '2024-2025' },
    ];
    // ------------------------------------

    // --- Fetch schedule data based on selected semester/year ---
    useEffect(() => {
        if (!user || !token || !selectedKyHoc || !selectedNamHoc) {
            setLoading(false);
            return;
        }

        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            setScheduleData({}); // Clear previous schedule

            try {
                // Call the correct API endpoint with query parameters
                const response = await api.get(`/sinh-vien/lich-hoc?kyHoc=${selectedKyHoc}&namHoc=${selectedNamHoc}`);

                // ✅ Lấy ra mảng thực tế từ response.data
                const rawData = response.data || response.data?.data || response;
                const transformedData = transformScheduleData(rawData);

                setScheduleData(transformedData);
                console.log("Fetched and transformed schedule data:", transformedData);



            } catch (err) {
                console.error("Error fetching schedule:", err);
                setError(err.message || 'Không thể tải lịch học.');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
        // Rerun when selected semester/year changes
    }, [user, token, selectedKyHoc, selectedNamHoc]);


    // --- Data for the grid structure ---
    // Define unique shifts/kips based on *your actual data* or requirements
    // This example uses the kips from your API data structure for simplicity
    const shifts = [
        { id: '7h-9h00', time: '07:00' },
        { id: '9h00-11h00', time: '09:00' },
        { id: '13h00-15h00', time: '13:00' },
        { id: '15h00-17h00', time: '15:00' },
        // Add more kips/shifts as defined in your LopTinChi data
    ];
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    // ------------------------------------

    // --- Helper function to find classes for a specific day and shift ---
    const getClassesForSlot = (day, shiftId) => {
        // Find classes for the given day, then filter by the specific shift/kip
        const daySchedule = scheduleData[day] || [];
        return daySchedule.filter(cls => cls.shift === shiftId);
    };

    // Handle semester/year change
    const handleSemesterChange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = semesterOptions.find(opt => opt.value === selectedValue);
        if (selectedOption) {
            setSelectedKyHoc(selectedOption.ky);
            setSelectedNamHoc(selectedOption.nam);
        }
    };


    // --- Render Component ---
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-7 h-7" />
                Xem Lịch Học
            </h1>

            {/* Semester/Year Filter */}
            <div className="mb-6 max-w-sm">
                <label htmlFor="semesterSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Học kỳ - Năm học
                </label>
                <select
                    id="semesterSelect"
                    value={`${selectedKyHoc}-${selectedNamHoc}`} // Combine ky and nam for value matching
                    onChange={handleSemesterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading} // Disable while loading
                >
                    {semesterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Loading and Error States */}
            {loading && <div className="text-center p-4">Đang tải lịch học...</div>}
            {error && <div className="text-center p-4 text-red-500">Lỗi: {error}</div>}

            {/* Schedule Table */}
            {!loading && !error && (
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-red-700 text-white">
                                <th className="p-3 border-r border-red-800 w-24 text-center">Ca học</th>
                                {days.map(day => (
                                    <th key={day} className="p-3 border-r border-red-800 text-center font-semibold">
                                        {day}
                                    </th>
                                ))}
                                {/* Removed the "Sau" column as it seemed redundant */}
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map(shift => (
                                <tr key={shift.id} className="h-24">
                                    {/* Shift/Time Column */}
                                    <td className="bg-gray-100 p-2 border border-gray-300 text-center font-semibold align-top">
                                        <div>Kíp {shift.id}</div>
                                        <div className="text-sm text-gray-600">{shift.time}</div>
                                    </td>
                                    {/* Day Columns */}
                                    {days.map(day => {
                                        const classes = getClassesForSlot(day, shift.id);
                                        return (
                                            <td key={`${day}-${shift.id}`} className="border border-gray-300 p-1 align-top relative">
                                                {classes.map((cls, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-blue-50 border border-blue-200 rounded p-1.5 mb-1 last:mb-0 text-xs shadow-sm" // Smaller text
                                                    >
                                                        <div className="font-semibold text-blue-800 mb-0.5 break-words">
                                                            {cls.subject}
                                                        </div>
                                                        {/* <div className="text-gray-600">Nhóm: {cls.group}</div> */}
                                                        <div className="text-gray-600">Phòng: {cls.room}</div>
                                                        {/* <div className="text-gray-600">GV: {cls.lecturer}</div> */}
                                                    </div>
                                                ))}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default StudentSchedulePage;
// src/pages/Student/StudentGradesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Book } from 'lucide-react'; // Example icon
import { calculateTotal10, convertGrade, getGradeColor } from '../../utils/gradeUtils.js';

// --- Helper Functions (Move to a utils file later if needed) ---

// Example grade calculation (adjust weights as needed)


function StudentGradesPage() {
    const { user, token } = useContext(AuthContext);
    const [results, setResults] = useState([]); // Stores processed results with calculated grades
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- State for selected semester/year ---
    const [selectedKyHoc, setSelectedKyHoc] = useState('1'); // Default or fetch current
    const [selectedNamHoc, setSelectedNamHoc] = useState('2025-2026'); // Default or fetch current
    const semesterOptions = [ // Example options
        { value: '1-2025-2026', label: 'Học kỳ 1 - Năm học 2025 - 2026', ky: '1', nam: '2025-2026' },
        { value: '2-2024-2025', label: 'Học kỳ 2 - Năm học 2024 - 2025', ky: '2', nam: '2024-2025' },
    ];
    // ------------------------------------

    // --- Fetch grades data ---
    useEffect(() => {
        if (!user || !token || !selectedKyHoc || !selectedNamHoc) {
            setLoading(false);
            return;
        }

        const fetchGrades = async () => {
            setLoading(true);
            setError(null);
            setResults([]); // Clear previous results

            try {
                const response = await api.get(`/sinh-vien/ket-qua?kyHoc=${selectedKyHoc}&namHoc=${selectedNamHoc}`);

                // Process the received data to calculate final grades
                const processedResults = response.data.map((result, index) => {
                    const total10 = calculateTotal10(result);
                    const { total4, grade } = convertGrade(total10);
                    const monHoc = result.DangKyHoc?.LopTinChi?.MonHoc;

                    return {
                        id: result.dangkyhoc_id || index, // Use dangkyhoc_id as unique key
                        code: monHoc?.id || 'N/A',
                        name: monHoc?.ten || 'N/A',
                        credits: monHoc?.soTinChi || 0,
                        cc: result.diemChuyenCan,
                        bt: result.diemBaiTap,
                        gk: result.diemThiGiuaKy,
                        ck: result.diemThiCuoiKy,
                        total10: total10,
                        total4: total4,
                        grade: grade
                    };
                });
                setResults(processedResults);

            } catch (err) {
                console.error("Error fetching grades:", err);
                setError(err.message || 'Không thể tải kết quả học tập.');
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [user, token, selectedKyHoc, selectedNamHoc]); // Rerun on semester/year change

    // --- Calculate Semester Summary (GPA, Credits) ---
    const semesterSummary = results.reduce((acc, result) => {
        if (result.grade !== 'F' && result.grade !== '-') { // Only count passing grades towards total credits
            acc.creditsPassed += result.credits;
        }
        if (result.total4 !== null) { // Only include graded courses in GPA
            acc.totalCreditsForGPA += result.credits;
            acc.weightedScore += (result.total4 * result.credits);
        }
        acc.totalRegisteredCredits += result.credits;
        return acc;
    }, { creditsPassed: 0, totalRegisteredCredits: 0, totalCreditsForGPA: 0, weightedScore: 0 });

    const semesterGPA = semesterSummary.totalCreditsForGPA > 0
        ? (semesterSummary.weightedScore / semesterSummary.totalCreditsForGPA).toFixed(2)
        : 'N/A';
    // ----------------------------------------------------

    // Handle semester/year change
    const handleSemesterChange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = semesterOptions.find(opt => opt.value === selectedValue);
        if (selectedOption) {
            setSelectedKyHoc(selectedOption.ky);
            setSelectedNamHoc(selectedOption.nam);
        }
    };

    // --- Render ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Book className="w-7 h-7" />
                    Xem kết quả học tập
                </h1>
                {/* Semester Selector */}
                <div className="max-w-sm mt-4">
                    <label htmlFor="semesterSelectGrade" className="block text-sm font-medium text-gray-700 mb-1">
                        Học kỳ - Năm học
                    </label>
                    <select
                        id="semesterSelectGrade"
                        value={`${selectedKyHoc}-${selectedNamHoc}`}
                        onChange={handleSemesterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    >
                        {semesterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading / Error State */}
            {loading && <div className="text-center p-4">Đang tải kết quả...</div>}
            {error && <div className="text-center p-4 text-red-500">Lỗi: {error}</div>}

            {/* Results Table */}
            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700">Kết quả học tập học kỳ</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    {/* Header Row 1 */}
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" rowSpan={2}>STT</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" rowSpan={2}>Mã MH</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider" rowSpan={2}>Tên môn học</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" rowSpan={2}>TC</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border-l border-gray-700" colSpan={4}>Điểm thành phần</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border-l border-gray-700" rowSpan={2}>TK (10)</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" rowSpan={2}>TK (4)</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider" rowSpan={2}>TK (Chữ)</th>
                                </tr>
                                <tr>
                                    {/* Header Row 2 */}
                                    <th className="px-2 py-2 text-center text-xs font-semibold border-l border-gray-700">CC</th>
                                    <th className="px-2 py-2 text-center text-xs font-semibold">BT</th>
                                    <th className="px-2 py-2 text-center text-xs font-semibold">GK</th>
                                    <th className="px-2 py-2 text-center text-xs font-semibold">CK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.length === 0 && (
                                    <tr><td colSpan="12" className="text-center p-4 text-gray-500">Chưa có kết quả học tập cho kỳ này.</td></tr>
                                )}
                                {results.map((result, index) => (
                                    <tr key={result.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-3 text-center text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-3 py-3 text-center text-sm font-medium text-gray-800">{result.code}</td>
                                        <td className="px-3 py-3 text-sm text-gray-800">{result.name}</td>
                                        <td className="px-3 py-3 text-center text-sm text-blue-700 font-semibold">{result.credits}</td>
                                        <td className="px-3 py-3 text-center text-sm text-gray-700 border-l border-gray-200">{result.cc ?? '-'}</td>
                                        <td className="px-3 py-3 text-center text-sm text-gray-700">{result.bt ?? '-'}</td>
                                        <td className="px-3 py-3 text-center text-sm text-gray-700">{result.gk ?? '-'}</td>
                                        <td className="px-3 py-3 text-center text-sm text-gray-700">{result.ck ?? '-'}</td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold text-gray-800 border-l border-gray-200">{result.total10 ?? '-'}</td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold text-gray-800">{result.total4 ?? '-'}</td>
                                        <td className="px-3 py-3 text-center">
                                            <span className={`inline-block ${getGradeColor(result.grade)} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                                {result.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    {results.length > 0 && (
                        <div className="bg-gray-50 p-4 border-t border-gray-200 text-right">
                            <div className="inline-flex space-x-6 text-sm pr-4">
                                <div>
                                    <span className="text-gray-600">Điểm TB học kỳ (hệ 4):</span>
                                    <span className="ml-2 font-bold text-blue-600 text-base">{semesterGPA}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Số TC đạt:</span>
                                    <span className="ml-2 font-bold text-green-600 text-base">{semesterSummary.creditsPassed}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Số TC đăng ký:</span>
                                    <span className="ml-2 font-bold text-gray-800 text-base">{semesterSummary.totalRegisteredCredits}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


export default StudentGradesPage;
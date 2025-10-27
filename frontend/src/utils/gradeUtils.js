// src/utils/gradeUtils.js

// --- Helper: Tính điểm hệ 10 ---
export const calculateTotal10 = (grades) => {
    const cc = grades.diemChuyenCan ?? 0;
    const bt = grades.diemBaiTap ?? 0;
    const gk = grades.diemThiGiuaKy ?? 0;
    const ck = grades.diemThiCuoiKy ?? 0;

    if (
        grades.diemChuyenCan === null ||
        grades.diemBaiTap === null ||
        grades.diemThiGiuaKy === null ||
        grades.diemThiCuoiKy === null
    ) {
        return null;
    }

    const total = cc * 0.1 + bt * 0.1 + gk * 0.3 + ck * 0.5;
    return parseFloat(total.toFixed(1));
};

// --- Helper: Quy đổi sang hệ 4 và điểm chữ ---
export const convertGrade = (total10) => {
    if (total10 === null) return { total4: null, grade: '-' };
    if (total10 >= 8.5) return { total4: 4.0, grade: 'A' };
    if (total10 >= 8.0) return { total4: 3.5, grade: 'B+' };
    if (total10 >= 7.0) return { total4: 3.0, grade: 'B' };
    if (total10 >= 6.5) return { total4: 2.5, grade: 'C+' };
    if (total10 >= 5.5) return { total4: 2.0, grade: 'C' };
    if (total10 >= 5.0) return { total4: 1.5, grade: 'D+' };
    if (total10 >= 4.0) return { total4: 1.0, grade: 'D' };
    return { total4: 0.0, grade: 'F' };
};

// --- Helper: Màu sắc theo điểm chữ ---
export const getGradeColor = (grade) => {
    const colors = {
        'A+': 'bg-green-500', 'A': 'bg-green-500',
        'B+': 'bg-blue-500', 'B': 'bg-blue-500',
        'C+': 'bg-yellow-500', 'C': 'bg-yellow-500',
        'D+': 'bg-orange-500', 'D': 'bg-orange-500',
        'F': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-500';
};

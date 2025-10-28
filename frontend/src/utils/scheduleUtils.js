// Helper function to transform API data into the schedule grid format
export const transformScheduleData = (apiData) => {
    const schedule = {
        'Thứ 2': [], 'Thứ 3': [], 'Thứ 4': [], 'Thứ 5': [], 'Thứ 6': [], 'Thứ 7': [], 'Chủ Nhật': []
    };
    if (!Array.isArray(apiData)) return schedule;

    apiData.forEach(dangKy => {
        const lop = dangKy.LopTinChi;
        if (!lop) return;

        // ✅ Chuẩn hoá ngày học: xóa khoảng trắng, dấu phẩy, viết hoa đúng định dạng
        const cleanDay = lop.ngayHoc
            ?.trim()
            ?.replace(',', '')
            ?.replace(/\s+/g, ' ') || '';

        // ✅ Chuẩn hoá kíp học: chuyển "13-15" → "13h00-15h00", "16h-17h" → "15h00-17h00"
        let normalizedShift = lop.kipHoc?.trim() || '';
        if (/^\d{1,2}-\d{1,2}$/.test(normalizedShift)) {
            const [start, end] = normalizedShift.split('-');
            normalizedShift = `${start}h00-${end}h00`;
        }

        if (Object.prototype.hasOwnProperty.call(schedule, cleanDay)) {
            schedule[cleanDay].push({
                id: dangKy.id,
                subject: lop.MonHoc?.ten
                    ? `${lop.MonHoc.ten} (${lop.MaMonHoc || lop.id})`
                    : lop.MaMonHoc || lop.id,

                room: `${lop.phongHoc || ''} - ${lop.toaNha || ''}`,
                teacher: lop.GiangVien?.hoTen || 'N/A',
                shift: normalizedShift,
            });
        }

        console.log(lop.MonHoc)
    });

    return schedule;
};

import React from 'react';

function CreditSummary({ registeredCredits, selectedCredits, totalCredits, maxCredits }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Tổng quan Tín chỉ</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Tín chỉ đã đăng ký/chờ duyệt:</span>
                    <span className="font-bold text-green-600">
                        {registeredCredits}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tín chỉ đang chọn (giỏ hàng):</span>
                    <span className="font-bold text-blue-600">
                        {selectedCredits}
                    </span>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between font-bold">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className={`font-bold ${totalCredits > maxCredits ? 'text-red-600' : 'text-gray-800'}`}>
                        {totalCredits}/{maxCredits}
                    </span>
                </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full ${totalCredits > maxCredits ? 'bg-red-500' : 'bg-blue-500'} transition-all`}
                    style={{ width: `${Math.min((totalCredits / maxCredits) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
}

export default CreditSummary;
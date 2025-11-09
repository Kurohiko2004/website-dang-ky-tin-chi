// src/components/common/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

/**
 * Thanh tìm kiếm chung cho các trang CRUD
 * @param {object} props
 * @param {string} props.searchTerm - Giá trị tìm kiếm hiện tại
 * @param {function} props.onSearchTermChange - Hàm xử lý khi giá trị thay đổi (e => setSearchTerm(e.target.value))
 * @param {string} props.placeholder - Placeholder cho input
 */

function SearchBar({ searchTerm, onSearchTermChange, placeholder = "Tìm kiếm..." }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onSearchTermChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );
}

export default SearchBar;
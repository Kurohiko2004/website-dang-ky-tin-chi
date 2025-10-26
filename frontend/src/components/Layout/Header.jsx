// src/components/Layout/Header.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Import context for logout

function Header({ userName }) {
    const { logout } = useContext(AuthContext); // Get logout function from context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call context logout function (clears token, user state)
        navigate('/login'); // Redirect to login page
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <div>{/* Maybe breadcrumbs or page title here */}</div>
            <div className="flex items-center space-x-4">
                <span>Chào, {userName || 'Người dùng'}!</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}

export default Header;
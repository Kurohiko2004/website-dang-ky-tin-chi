// src/components/Layout/DashboardLayout.jsx
import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // Import Navigate for safety
import Header from './Header';
import Sidebar from './Sidebar';
// import Footer from './Footer'; // Optional
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

function DashboardLayout() {
    const { user, loading } = useContext(AuthContext); // Get user info and loading state

    // --- Protection Logic ---
    // Although ProtectedRoute might wrap this, adding checks here provides defense-in-depth
    if (loading) {
        return <div>Loading layout...</div>; // Or a layout-specific loading state
    }

    if (!user) {
        // Should ideally be handled by ProtectedRoute, but as a fallback:
        return <Navigate to="/login" replace />;
    }
    // --- End Protection Logic ---


    // If loading is done and user exists, render the layout
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Pass user role to Sidebar */}
            <Sidebar userRole={user.vaiTro} />

            <div className="flex flex-col flex-1 overflow-y-auto">
                {/* Pass user name to Header */}
                <Header userName={user.hoTen} />

                <main className="p-4 md:p-6 flex-1">
                    {/* Child route components will render here */}
                    <Outlet />
                </main>

                {/* Optional Footer */}
                {/* <Footer /> */}
            </div>
        </div>
    );
}

export default DashboardLayout;
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path if needed

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation(); // Get current location

    // 1. Show loading indicator while checking auth status
    if (loading) {
        // You can replace this with a more sophisticated spinner component
        return <div>Checking authentication...</div>;
    }

    // 2. If not loading and no user found, redirect to login
    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to in the state. This allows redirecting back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If authenticated, render the child component(s)
    // If used directly around a component: renders children
    // If used in router setup with nested routes: renders <Outlet />
    return children ? children : <Outlet />;
}

export default ProtectedRoute;
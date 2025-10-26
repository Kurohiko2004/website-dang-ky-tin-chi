import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const processToken = useCallback((newToken) => {
        if (newToken) {
            try {
                const decodedUser = jwtDecode(newToken);
                setUser({
                    id: decodedUser.id,
                    hoTen: decodedUser.hoTen,
                    vaiTro: decodedUser.vaiTro
                });
                setToken(newToken);
                localStorage.setItem('accessToken', newToken);
                return decodedUser;
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                localStorage.removeItem('accessToken');
                setUser(null);
                setToken(null);
                return null;
            }
        } else {
            localStorage.removeItem('accessToken');
            setUser(null);
            setToken(null);
            return null;
        }
    }, []);

    useEffect(() => {
        const initialToken = localStorage.getItem('accessToken');
        if (initialToken) processToken(initialToken);
        setLoading(false);
    }, [processToken]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            processToken(response.token);
            return true;
        } catch (error) {
            console.error("AuthContext: Login failed:", error);
            setError(error.message);
            setUser(null);
            setToken(null);
            localStorage.removeItem('accessToken');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('accessToken');
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

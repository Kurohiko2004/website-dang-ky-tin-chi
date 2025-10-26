// src/lib/api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // Your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle common errors (like 401 Unauthorized -> redirect to login)
apiClient.interceptors.response.use(
    (response) => response.data, // Return only the data part of the response
    (error) => {
        if (error.response) {
            // Handle specific status codes if needed
            if (error.response.status === 401 || error.response.status === 403) {
                // Token expired or invalid
                console.error("Authentication error:", error.response.data.message);
                localStorage.removeItem('accessToken'); // Clear bad token
                // Redirect to login using window.location or router's navigate function
                if (window.location.pathname !== '/login') {
                    // window.location.href = '/login'; 
                    alert("Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                }
            }
            // Re-throw a more specific error message
            return Promise.reject(new Error(error.response.data.message || 'Lỗi API'));
        } else if (error.request) {
            // Network error
            console.error("Network error:", error.request);
            return Promise.reject(new Error('Lỗi mạng. Không thể kết nối tới server.'));
        } else {
            // Other errors
            console.error("API call error:", error.message);
            return Promise.reject(new Error(error.message));
        }
    }
);

// Export methods
export default {
    get: (url) => apiClient.get(url),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
};
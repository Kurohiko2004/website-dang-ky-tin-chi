// frontend/src/components/Auth/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthProvider } from '../../contexts/AuthProvider'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
    // Keep state for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 4. Get login function, loading state, and error state from context
    const { login, loading, error: authError } = useContext(AuthContext); // Rename context error to avoid conflict

    // 5. Initialize navigate function
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // 6. Call the login function from context
        const loginSuccess = await login(email, password);

        if (loginSuccess) {
            console.log('Login successful, navigating...');
            // 7. Redirect on successful login
            navigate('/'); // Navigate to the home page or dashboard
        }
        // Error handling is now managed by AuthContext,
        // and the error message is available in 'authError'
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-lg w-96 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>

            {/* 8. Display error message FROM CONTEXT */}
            {authError && <p className="text-red-500 text-xs italic mb-4 text-center">{authError}</p>}

            <div>
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Use loading state FROM CONTEXT
                />
            </div>

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Use loading state FROM CONTEXT
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>

            <button
                type="submit"
                // Use loading state FROM CONTEXT
                className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {/* Use loading state FROM CONTEXT */}
                {loading ? 'Processing...' : 'Login'}
            </button>
        </form>
    );
}
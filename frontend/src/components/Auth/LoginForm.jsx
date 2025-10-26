// frontend/src/components/Auth/LoginForm.jsx
import React, { useState } from 'react'; // 1. Import useState

export default function LoginForm() {
    // 2. Add state for email, password, errors, and loading
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- 2. Add state for password visibility ---
    const [showPassword, setShowPassword] = useState(false);

    // 4. Create the submit handler function
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent page reload on form submit
        setError(null);       // Clear previous errors
        setLoading(true);     // Set loading state

        try {
            // 5. Make the API call to your backend
            const response = await fetch('http://localhost:3000/auth/login', { // Ensure URL is correct
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send state values
            });

            const data = await response.json();

            if (!response.ok) {
                // If response status is not 2xx, throw an error
                throw new Error(data.message || `HTTP error ${response.status}`);
            }

            // 6. Handle successful login
            console.log('Login successful:', data);
            localStorage.setItem('accessToken', data.token); // Save the token
            alert('Đăng nhập thành công!');
            // TODO: Redirect user or update app state
            // Example: window.location.href = '/dashboard';

        } catch (err) {
            // 7. Handle errors
            console.error('Login failed:', err);
            setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Function to toggle password visibility ---
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Flip the boolean state
    };

    return (
        // 3. Attach the onSubmit handler to the form
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-lg w-96 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>

            {/* 8. Display error message if it exists */}
            {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

            <div>
                {/* 9. Connect input to state */}
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2"
                    value={email} // Controlled component
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                    required
                    disabled={loading} // Disable input while loading
                />
            </div>

            <div className="relative"> {/* Thêm relative để định vị icon */}
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2 pr-10" // Thêm pr-10 để tránh text đè lên icon
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button
                    type="button" // Thêm type="button" để tránh submit form
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </div>

            <button
                type="submit"
                // 11. Disable button and change text when loading
                className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Login'}
            </button>
        </form>
    );
}
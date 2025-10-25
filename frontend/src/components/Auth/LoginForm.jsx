export default function LoginForm() {
    return (
        <form className="bg-white rounded-lg shadow-lg w-96 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>

            <div>
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2"
                />
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none p-2"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
                Login
            </button>
        </form>
    );
}

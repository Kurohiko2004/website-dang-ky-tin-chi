const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function authFetch(path, opts = {}) {
    const token = localStorage.getItem("token");
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...opts, headers, credentials: "include" });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Network error' }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true
})

// Attach the token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

async function register({ username, email, password }) {

    try {
        const res = await api.post('/api/auth/register', {
            username,
            email,
            password
        })
        // Store the token in localStorage for cross-domain auth
        if (res.data.token) {
            localStorage.setItem("token", res.data.token)
        }
        return res.data;

    } catch (err) {
        console.log(err);
    }
}

async function login({ email, password }) {

    try {
        const res = await api.post('/api/auth/login', {
            email,
            password
        })
        // Store the token in localStorage for cross-domain auth
        if (res.data.token) {
            localStorage.setItem("token", res.data.token)
        }
        return res.data;

    } catch (err) {
        console.log(err);
    }
}

async function logout() {
    try {
        const res = await api.get('/api/auth/logout')
        // Remove token from localStorage
        localStorage.removeItem("token")
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

async function getMe() {
    try {
        const res = await api.get('/api/auth/get-me')
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export {
    register,
    login,
    logout,
    getMe
}
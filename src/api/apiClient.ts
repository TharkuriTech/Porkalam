import axios from 'axios';
import { getUserData, clearUserData } from '../Util/Util.ts';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Request interceptor (attach token)
apiClient.interceptors.request.use((config) => {
    const userData = getUserData();
    const token = userData?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            clearUserData();
            // redirect to login
            window.location.href = '';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
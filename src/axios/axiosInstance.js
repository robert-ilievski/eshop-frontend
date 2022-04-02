import axios from 'axios';

export const AUTH_TOKEN = 'auth_token';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'+'/api',
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstance;

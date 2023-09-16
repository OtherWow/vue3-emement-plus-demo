import axios from 'axios';
import router from '@/router'; // 确保你的路由实例已经导入

// 定义通用请求拦截器
const requestInterceptor = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const requestInterceptorError = (error) => {
    return Promise.reject(error);
};

// 定义通用响应拦截器
const responseInterceptor = (response) => {
    // 检查响应头是否包含新的token
    const newToken = response.headers['x-new-token'];
    if (newToken) {
        // 更新本地存储的token
        localStorage.setItem('token', newToken);
    }
    return response;
};

const responseInterceptorError = (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
        });
    }
    return Promise.reject(error);
};

// 创建用于连接到第一台服务器的axios实例
const http = axios.create({
    baseURL: 'http://45.159.51.6:7878',
    // baseURL: 'http://localhost:7878',
    timeout: 60000,
});

http.interceptors.request.use(requestInterceptor, requestInterceptorError);
http.interceptors.response.use(responseInterceptor, responseInterceptorError);

// 创建用于连接到第二台服务器的axios实例
const http_tokyo = axios.create({
    // baseURL: 'http://45.159.51.99:8000',
    baseURL: 'http://localhost:8000',
    timeout: 60000,
});

http_tokyo.interceptors.request.use(requestInterceptor, requestInterceptorError);
http_tokyo.interceptors.response.use(responseInterceptor, responseInterceptorError);

export { http, http_tokyo };


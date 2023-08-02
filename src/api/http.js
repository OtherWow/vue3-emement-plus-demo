import axios from 'axios';
import router from '@/router'; // 确保你的路由实例已经导入

const instance = axios.create({
    baseURL: 'http://google.cccx.top:8000', // 设置基本URL
    timeout: 60000, // 设置请求超时时间
});

// 请求拦截器，添加token到请求头
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // 如果请求失败（例如网络错误或请求超时），这里将会被执行
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
    // 如果响应正常，返回响应数据
    return response;
}, error => {
    // 如果响应出错（例如服务器返回非2xx的HTTP状态码），这里将会被执行
    if (error.response) {
        switch (error.response.status) {
            case 401: // 如果是401错误，说明token无效
                // 清除无效的token
                localStorage.removeItem('token');
                // 重定向到登录页面
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath } // 登录成功后跳转回原来的页面
                });
                break;
        }
    }
    return Promise.reject(error);
});

export default instance;

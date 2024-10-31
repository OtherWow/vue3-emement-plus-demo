import router from '@/router'; // 确保你的路由实例已经导入
import axios from 'axios';
import CryptoJS from 'crypto-js';

const base64Key = 'Jd7gK9fJzF3s7Yq0Gb5tF9x4Pkq1Jt2Hv9c5e4s8h1I='; // 与后端一致的 Base64 编码密钥
const key = CryptoJS.enc.Base64.parse(base64Key); // 解码密钥
const dd = (encryptedData) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr); // 返回解析后的对象
    } catch (error) {
        // console.error('数据解密失败:', error);
        throw new Error('数据解密失败');
    }
};
  
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
    // 检查自定义加密标识头
    // console.log('响应头:', response.headers['x-data-encrypted'] );
    const isEncrypted = response.headers['x-data-encrypted'] === '1';
    // console.log('响应数据是否加密:', isEncrypted);
    if (isEncrypted) {
        // 对加密的数据进行解密
        try {
            const encryptedData = response.data.encrypted_data;
            const decryptedData = dd(encryptedData);
            // 将解密后的数据赋值回 response.data
            // console.log('解密后的数据:', decryptedData);
            response.data = decryptedData;
        } catch (error) {
            // console.error('数据解密失败:', error);
            return Promise.reject(new Error('数据解密失败'));
        }
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
    baseURL: 'http://btc.ccccx.buzz/api',
    // baseURL: 'http://localhost:7878',
    timeout: 60000,
});

http.interceptors.request.use(requestInterceptor, requestInterceptorError);
http.interceptors.response.use(responseInterceptor, responseInterceptorError);

// 创建用于连接到第二台服务器的axios实例
const http_tokyo = axios.create({
    baseURL: 'http://btc.ccccx.buzz/api',
    // baseURL: 'http://localhost:7878',
    timeout: 60000,
});

http_tokyo.interceptors.request.use(requestInterceptor, requestInterceptorError);
http_tokyo.interceptors.response.use(responseInterceptor, responseInterceptorError);

export { http, http_tokyo };


import http from './http';

//登录
export const api_登录 = (username, password) => {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);
    return http.post(`/token`, data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};



//登出
export const api_登出 = () => {
    return http.post(`/token`, {
        username: username.value,
        password: password.value,
    });
};
import http from './http';

//获取用户持仓
export const fapi_获取用户持仓 = () => {
    return http.get(`/binance/fapi/user_info`);
};
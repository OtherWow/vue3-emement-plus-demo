import { http } from './http';

//获取所有交易对
export const api_get_binance_api_usdt_symbols = () => {
    return http.get(`/binance/api/get_usdt_symbols`);
};


//获取用户持仓
export const api_获取用户持仓 = () => {
    return http.get(`/binance/api/user_info`);
};


// 获取今日的统计记录
export const api_获取今日的统计记录 = () => {
    return http.post(`/binance/api/today`, [1, 2, 10, 20]);
};

// api_获取现货所有usdt交易对
export const api_获取现货所有usdt交易对 = () => {
    return http.get(`/binance/api/all_usdt_symbols`);
};
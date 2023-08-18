import { http } from './http';

//获取所有交易对
export const api_获取所有交易对 = (use_cache) => {
    return http.get(`/binance/api/exchange_info?use_cache=${use_cache}`);
};


//获取用户持仓
export const api_获取用户持仓 = () => {
    return http.get(`/binance/api/user_info`);
};


// 获取今日的统计记录
export const api_获取今日的统计记录 = () => {
    return http.post(`/binance/api/today`, [1, 2, 10, 20]);
};

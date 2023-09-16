import { http } from './http';






//api_获取用户指定交易所的余额信息
export const api_获取用户指定交易所的余额信息 = async (data) => {
    const response = await http.post(`/user_exchange_balance/get_balance_list`, data);
    return response;
};
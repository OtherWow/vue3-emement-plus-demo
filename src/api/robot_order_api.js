import { http, http_tokyo } from './http';
const model_url = 'robot_order'

//-----------------------------------------------------------------------------base-------------------------------------------------




//api_批量启动交易对
export const api_批量启动交易对 = async (data) => {
    return await http.post(`/${model_url}/symbols/start`, data);
};


//api_批量停止交易对
export const api_批量停止交易对 = async (data) => {
    return await http.post(`/${model_url}/symbols/stop`, data);
};

//    api_监控墙_市价平仓,
export const api_监控墙_市价平仓 = async (symbol,  position_side, exchange_id) => {
    const data = {
        symbol: symbol,
        position_side: position_side,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/one_key_close_market`, data);
    return response;
};
// api_监控墙_重挂止盈
export const api_监控墙_重挂止盈 = async (symbol,  position_side, take_profit_price, exchange_id) => {
    const data = {
        symbol: symbol,
        position_side: position_side,
        take_profit_price: take_profit_price,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/repull_take_profit`, data);
    return response;
};

//api_监控墙_停止
export const api_监控墙_停止 = async (symbol,  exchange_id) => {
    const data = {
        symbol: symbol,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/stop`, data);
    return response;
};


//api_监控墙_启动
export const api_监控墙_启动 = async (data) => {
    const response = await http_tokyo.post(`/${model_url}/monitor/start`, data);
    return response;
};
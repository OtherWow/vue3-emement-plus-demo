import { http } from './http';

//获取用户持仓
export const fapi_获取用户持仓 = () => {
    return http.get(`/binance/fapi/user_info`);
};

//获取当前分钟的振幅排行
export const fapi_获取当前分钟的振幅排行 = () => {
    return http.get(`/binance/fapi/amplitude_1m_top20`);
};


//获取指定币种的所有振幅数据
export const fapi_获取指定币种的所有振幅数据 = (symbol) => {
    return http.get(`/binance/fapi/amplitude_1m_all/${symbol}`);
};

//获取4小时内币种上榜次数排行
export const fapi_获取4小时内币种上榜次数排行 = () => {
    return http.get(`/binance/fapi/amplitude_1m_top20_4h_count`);
};

//获取最新的资金费率排行前20
export const fapi_获取最新的资金费率排行前20 = () => {
    return http.get(`/binance/fapi/funding_rate_top20_now`);
};



//fapi_获取指定币种的24小时数据
export const fapi_获取指定币种的24小时数据 = (symbol) => {
    return http.get(`/binance/fapi/get_symbol_24h/${symbol}`);
};



//fapi_获取指定币种的k线数据
export const fapi_获取指定币种的k线数据 = (symbol) => {
    return http.get(`/binance/fapi/get_symbol_klines/${symbol}`);
};

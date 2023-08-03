import http from './http';

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
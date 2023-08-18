import { http_tokyo } from './http';
const model_url = 'funding_rate_strategy'

//获取资金费率策略列表
export const api_获取资金费率策略列表 = () => {
    return http_tokyo.get(`/${model_url}/list`);
};

//获取交易对列表
export const api_获取交易对列表 = () => {
    return http_tokyo.get(`/${model_url}/symbol_list`);
};

//获取指定id的资金费率策略详情
export const api_获取指定id的资金费率策略详情 = (id) => {
    return http_tokyo.get(`/${model_url}/detail/${id}`);
};


//启动指定id的资金费率策略
export const api_启动指定id的资金费率策略 = (id) => {
    return http_tokyo.post(`/${model_url}/start/${id}`);
};


//停止指定id的资金费率策略
export const api_停止指定id的资金费率策略 = (id) => {
    return http_tokyo.post(`/${model_url}/stop/${id}`);
};


//删除指定id的资金费率策略
export const api_删除指定id的资金费率策略 = (id) => {
    return http_tokyo.delete(`/${model_url}/${id}`);
};

//新增资金费率策略
export const api_新增资金费率策略 = (data) => {
    return http_tokyo.post(`/${model_url}/`, data);
};


//更新指定id的资金费率策略
export const api_更新指定id的资金费率策略 = (id, data) => {
    return http_tokyo.put(`/${model_url}/${id}`, data);
};

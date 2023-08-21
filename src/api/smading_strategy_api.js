import { http, http_tokyo } from './http';
const model_url = 'smading_strategy'

//获取双马丁策略列表
export const api_获取双马丁策略列表 = () => {
    return http.get(`/${model_url}/list`);
};


//获取指定id的双马丁策略详情
export const api_获取指定id的双马丁策略详情 = (id) => {
    return http.get(`/${model_url}/detail/${id}`);
};


//启动指定id的双马丁策略
export const api_启动指定id的双马丁策略 = (id) => {
    return http_tokyo.post(`/${model_url}/start/${id}`);
};


//停止指定id的双马丁策略
export const api_停止指定id的双马丁策略 = (id) => {
    return http_tokyo.post(`/${model_url}/stop/${id}`);
};


//删除指定id的双马丁策略
export const api_删除指定id的双马丁策略 = (id) => {
    return http.delete(`/${model_url}/${id}`);
};

//删除指定id的交易对双马丁策略
export const api_删除指定id的交易对双马丁策略 = (id) => {
    return http.delete(`/${model_url}/symbol/${id}`);
};

//新增双马丁策略
export const api_新增双马丁策略 = (data) => {
    return http.post(`/${model_url}/`, data);
};


//更新指定id的双马丁策略
export const api_更新指定id的双马丁策略 = (id, data) => {
    return http.put(`/${model_url}/${id}`, data);
};

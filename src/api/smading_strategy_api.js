import { http, http_tokyo } from './http';
const model_url = 'smading_strategy'

//获取双马丁策略列表
export const api_获取双马丁策略列表 = async () => {
    const response = await http.get(`/${model_url}/list`);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//获取指定id的双马丁策略详情
export const api_获取指定id的双马丁策略详情 = async (id) => {
    const response = await http.get(`/${model_url}/detail/${id}`);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//启动指定id的双马丁策略
export const api_启动指定id的双马丁策略 = async (data) => {
    const response = await http_tokyo.post(`/${model_url}/symbols/start/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//停止指定id的双马丁策略
export const api_停止指定id的双马丁策略 = async (data) => {
    const response = await http_tokyo.post(`/${model_url}/symbols/stop/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//删除指定id的双马丁策略
export const api_删除指定id的双马丁策略 = async (id) => {
    const response = await http.delete(`/${model_url}/${id}`);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};

//删除指定id的交易对双马丁策略
export const api_删除指定id的交易对双马丁策略 = async (id) => {
    const response = await http.delete(`/${model_url}/symbol/${id}`);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};

//删除指定ids的交易对双马丁策略
export const api_删除指定ids的交易对双马丁策略 = async (ids) => {
    const response = await http.post(`/${model_url}/symbols/delete`, ids);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};

//新增双马丁策略
export const api_新增双马丁策略 = async (data) => {
    const response = await http.post(`/${model_url}/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//更新指定id的双马丁策略
export const api_更新指定id的双马丁策略 = async (id, data) => {
    const response = await http.put(`/${model_url}/${id}`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};

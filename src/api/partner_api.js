import { http } from './http';






//api_获取我的交易合伙人信息
export const api_获取我的交易合伙人信息 = async () => {
    const response = await http.post(`/partner/info`);
    return response;
};

//api_查询我的推荐人交易额明细
export const api_查询我的推荐人交易额明细 = async (data) => {
    const response = await http.post(`/partner/list`,data);
    return response;
};
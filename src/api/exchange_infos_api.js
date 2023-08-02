import http from './http';
const base_url = '/exchange_infos';
//获取当前用户的所有交易所信息，包括交易所的名称、API密钥和API密钥对应的密码，以及是否为主账号
export const 查询当前用户的所有交易所信息 = () => {
    return http.get(`${base_url}/`);
};


// 分页获取当前用户的所有交易所信息，包括交易所的名称、API密钥和API密钥对应的密码，以及是否为主账号



// 创建新的交易所信息，需要传入交易所的名称、API密钥和API密钥对应的密码，以及是否为主账号
export const 新增当前用户的交易所信息 = (currentExchange) => {
    console.log("新增当前用户的交易所信息", currentExchange);
    return http.post(`${base_url}/`, currentExchange);
};

// 获取当前用户的指定交易所信息，需要传入交易所的ID


// 更新指定ID的交易所信息
export const 更新当前用户的指定的交易所信息 = (currentExchange) => {
    return http.put(`${base_url}/${currentExchange.id}`, currentExchange);
};

// 删除指定ID的交易所信息
export const 删除当前用户的指定的交易所信息 = (id) => {
    return http.delete(`${base_url}/${id}`);
};

// 设置主账号 
export const 设置主账号 = (currentExchange) => {
    return http.post(`${base_url}/set_main_account/${currentExchange.id}`);
};
import { http, http_tokyo } from './http';
const model_url = 'smading_strategy'

//-----------------------------------------------------------------------------base-------------------------------------------------

//获取双马丁策略列表
export const api_获取双马丁策略列表 = async (is_deleted) => {
    // 如果is_deleted不是true也不是false，那么就是undefined，此时不传is_deleted参数
    let data = {
    }
    if (is_deleted === true || is_deleted === false) {
        data = {
            'is_deleted': is_deleted
        }
    }
    return await http.post(`/${model_url}/list`, data);
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
    const response = await http.post(`/${model_url}/symbols/start/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//停止指定id的双马丁策略
export const api_停止指定id的双马丁策略 = async (data) => {
    const response = await http.post(`/${model_url}/symbols/stop/`, data);
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


//api_模拟数据
export const api_模拟数据 = async (data) => {
    const response = await http.post(`/${model_url}/mock`, data);
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


//复制交易对信息
export const api_复制交易对信息 = async (ids, data) => {
    const payload = {
        strategy_ids: ids,
        symbols_info: data
    };
    const response = await http.post(`/${model_url}/copy-symbols-info`, payload);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};

//暂停指定id的双马丁策略
export const api_暂停指定id的双马丁策略 = async (data) => {
    const response = await http.post(`/${model_url}/symbols/pause/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};


//恢复指定id的双马丁策略
export const api_恢复指定id的双马丁策略 = async (data) => {
    const response = await http.post(`/${model_url}/symbols/continue/`, data);
    // 使用new Promise与setTimeout结合，等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
};



//-----------------------------------------------------------------------------monitor-------------------------------------------------

//    api_市价平仓,
export const api_市价平仓 = async (symbol, strategy_id, position_side, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        position_side: position_side,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/one_key_close_market`, data);
    return response;
};

//    api_重新启动,
export const api_重新启动 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/start_again`, data);
    return response;
};

// api_切换成对冲双马丁
export const api_切换成对冲双马丁 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/switch_hedge_mading2`, data);
    return response;
};


// api_重挂止盈
export const api_重挂止盈 = async (symbol, strategy_id, position_side, take_profit_price, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        position_side: position_side,
        take_profit_price: take_profit_price,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/repull_take_profit`, data);
    return response;
};


//    api_暂停,
export const api_暂停 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/pause`, data);
    return response;
};

//api_恢复
export const api_恢复 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/continue`, data);
    return response;
};

//api_仓位重启
export const api_仓位重启 = async (symbol, strategy_id, position_side, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        position_side: position_side,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/position_start_again`, data);
    return response;
};

//api_停止
export const api_停止 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/stop`, data);
    return response;
};


//api_启动
export const api_启动 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http_tokyo.post(`/${model_url}/monitor/start`, data);
    return response;
};
//-----------------------------------------------------------------------------home-------------------------------------------------

//api_首页直接启动
export const api_首页直接启动 = async (symbol, strategy_id, exchange_id) => {
    const data = {
        symbol: symbol,
        strategy_id: strategy_id,
        exchange_id: exchange_id
    };
    const response = await http.post(`/${model_url}/home/start`, data);
    return response;
};


//api_首页查询策略列表
export const api_首页查询策略列表 = async (symbol) => {
    const data = {
        'symbol': symbol,
        'is_deleted': false

    }
    return await http.post(`/${model_url}/home/list`, data);
};
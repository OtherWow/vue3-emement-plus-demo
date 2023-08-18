import { http } from './http';

//获取所有马丁机器人
export const api_get_all_md_bots = () => {
    return http.get(`/md_bots/bots`);
};

//获取指定id的马丁机器人
export const api_get_md_bot = (id) => {
    return http.get(`/md_bots/bot/${id}`);
};


//启动指定id的马丁机器人
export const api_start_md_bot = (id) => {
    return http.get(`/md_bots/start_bot/${id}`);
};


//停止指定id的马丁机器人
export const api_stop_md_bot = (id) => {
    return http.get(`/md_bots/stop_bot/${id}`);
};


//删除指定id的马丁机器人
export const api_delete_md_bot = (id) => {
    return http.delete(`/md_bots/delete_bot/${id}`);
};

//新增马丁机器人
export const api_add_md_bot = (data) => {
    return http.post(`/md_bots/add_bot`, data);
};


//更新指定id的马丁机器人
export const api_update_md_bot = (botId, data) => {
    return http.put(`/md_bots/update_bot/${botId}`, data);
};

<template>
    <div class="home">
        <h1>马丁机器人管理列表</h1>
        <el-button type="primary" size="small" @click="createBot">创建机器人</el-button>
        <bot-table :bots="bots" @start="startBot" @stop="stopBot" @edit="editBot" @delete="deleteBot"></bot-table>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import BotTable from './BotTable.vue';
import { useRouter } from 'vue-router';
import { api_get_all_md_bots, api_start_md_bot, api_stop_md_bot, api_delete_md_bot } from '@/api/md_bots';

export default {
    components: {
        BotTable,
    },
    setup() {
        // 使用 vue-router 提供的 useRouter 函数获取 router 实例
        const router = useRouter();
        // 使用 ref 创建响应式数据 bots
        const bots = ref([]);

        // 定义获取机器人数据的函数
        const fetchBots = async () => {
            const response = await api_get_all_md_bots();
            bots.value = response.data;
        };

        // 定义创建机器人的函数
        const createBot = () => {
            router.push('/md_bots/create_bot');
        };

        // 定义启动机器人的函数
        const startBot = async (bot) => {
            await api_start_md_bot(bot.id);
            await fetchBots();
        };

        // 定义停止机器人的函数
        const stopBot = async (bot) => {
            await api_stop_md_bot(bot.id);
            await fetchBots();
        };

        // 定义修改机器人的函数
        const editBot = (bot) => {
            router.push(`/md_bots/edit_bot/${bot.id}`);
        };

        // 定义删除机器人的函数
        const deleteBot = async (bot) => {
            await api_delete_md_bot(bot.id);
            await fetchBots();
        };

        // 在 setup 函数内部调用 fetchBots 函数获取机器人数据
        fetchBots();

        // 返回需要暴露给模板的数据和方法
        return {
            bots,
            createBot,
            startBot,
            stopBot,
            editBot,
            deleteBot,
        };
    },
};
</script>
  
<style lang="less" scoped></style>
  
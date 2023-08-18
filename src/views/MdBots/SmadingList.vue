<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="connectToWebSocket()">重新连接websocket服务器</el-button>
                </el-col>
            </el-row>
            <el-table :data="smading_infos_list">
                <el-table-column prop="name" label="交易所账号名称"></el-table-column>
                <el-table-column prop="symbol" label="交易对"></el-table-column>
                <el-table-column prop="最新价格" label="最新价格"></el-table-column>
                <el-table-column prop="做空仓位数量" label="做空仓位数量"></el-table-column>
                <el-table-column prop="做空仓位价格" label="做空仓位价格"></el-table-column>
                <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏"></el-table-column>
                <el-table-column prop="做多仓位数量" label="做多仓位数量"></el-table-column>
                <el-table-column prop="做多仓位价格" label="做多仓位价格"></el-table-column>
                <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏"></el-table-column>
                <el-table-column prop="总浮动盈亏" label="总浮动盈亏"></el-table-column>
                <el-table-column prop="做空总盈利" label="做空总盈利"></el-table-column>
                <el-table-column prop="做多总盈利" label="做多总盈利"></el-table-column>
                <el-table-column prop="总盈利" label="总盈利"></el-table-column>
                <!-- <el-table-column prop="is_main" label="是否主账号" width="120">
                    <template #default="{ row }">
                        <el-tag :type="row.is_main ? 'success' : 'danger'">{{ row.is_main ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="setMainAccount(row)">设为主账号</el-button>
                        <el-button type="info" size="small" @click="editExchange(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteExchange(row)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-main>
    </el-container>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const message = ref('');
// 储存交易所信息的数组
const smading_infos_list = ref([]);
let ws = null;

onMounted(() => {
    connectToWebSocket();
});

onBeforeUnmount(() => {
    if (ws) {
        ws.close();
    }
});

function connectToWebSocket() {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket("ws://43.163.235.41:8000/ws/smading"); // 请替换为你的服务器IP和端口

    ws.onopen = (event) => {
        console.log("WebSocket opened:", event);
    };

    ws.onmessage = (event) => {
        console.log("WebSocket message:", event.data);
        // 用json解析一下
        const data = JSON.parse(event.data);
        smading_infos_list.value = data; // 显示从服务器收到的消息
    };

    ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
    };

    ws.onerror = (error) => {
        console.log("WebSocket error:", error);
    };
}
</script>
  
<style lang="less" scoped></style>
  
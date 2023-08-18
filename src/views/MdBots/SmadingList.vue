<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="connectToWebSocket()">重新连接websocket服务器</el-button>
                </el-col>
            </el-row>
            <el-table :data="smading_infos_list" stripe style="width: 100%" :fit="false" border highlight-current-row
                :summary-method="getSummaries" show-summary>
                <el-table-column fixed="left" prop="name" label="交易所账号名称" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="left" prop="symbol" label="交易对" width="120" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="运行时间" label="运行时间" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="最新价格" label="最新价格" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="触发对冲单次数" label="触发对冲单次数" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次对冲单" label="第几次对冲单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次补单" label="第几次补单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位数量" label="做空仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位价格" label="做空仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位数量" label="做多仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位价格" label="做多仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总浮动盈亏" label="总浮动盈亏" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="做空总盈利" label="做空总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="做多总盈利" label="做多总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总盈利" label="总盈利" width="80" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="is_run" label="运行" width="60" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">{{ row.is_run ? '是' : '否'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="260" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="startStrategy(row)" plain
                            :disabled="row.is_run">启动</el-button>
                        <el-button type="primary" size="small" @click="stopStrategy(row)" plain
                            :disabled="!row.is_run">停止</el-button>
                        <el-button type="primary" size="small" @click="editStrategy(row)" plain>编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteStrategy(row)"
                            :disabled="row.is_run">删除</el-button>
                    </template>
                </el-table-column>
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

const columnsToSummarize = ['做空仓位浮动盈亏', '做多仓位浮动盈亏', '总浮动盈亏', '做空总盈利', '做多总盈利', '总盈利'];
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (columnsToSummarize.includes(column.property)) {
            const values = data.map((item) => Number(item[column.property]));
            if (!values.every((value) => Number.isNaN(value))) {
                sums[index] = `${values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!Number.isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0).toFixed(2)}`;
            } else {
                sums[index] = '0';
            }
        } else {
            sums[index] = ''; // 不进行统计的列设置为空字符串或其他适当的默认值
        }
    })

    return sums
}
</script>
  
<style lang="less" scoped></style>
  
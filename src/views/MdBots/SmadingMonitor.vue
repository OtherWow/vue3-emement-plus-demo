<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="manualReconnect()">重新连接websocket服务器</el-button>
                </el-col>
            </el-row>
            <el-table id="monitor_table" :data="smading_infos_list" style="width: 100%" :fit="false" border
                highlight-current-row :summary-method="getSummaries" show-summary :height="monitor_table_height"
                :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @filter-change="handleFilterChange"
                scrollbar-always-on>
                <el-table-column prop="name" label="交易所账号名称" width="140" show-overflow-tooltip align="center"
                    :filters="nameFilters" filter-placement="bottom-end" column-key="name"></el-table-column>
                <el-table-column prop="symbol" label="交易对" width="120" show-overflow-tooltip align="center"
                    :filters="symbolFilters" filter-placement="bottom-end" column-key="symbol">
                    <template #default="scope">
                        <el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="启动资金" label="启动资金" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="账户余额" label="账户余额" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="运行时间" label="运行时间" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="最新价格" label="最新价格" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈次数" label="止盈次数" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈总利润" label="止盈总利润" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

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
                <el-table-column prop="做空仓位价值" label="做空仓位价值" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空总盈利" label="做空总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位数量" label="做多仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位价格" label="做多仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位价值" label="做多仓位价值" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="做多总盈利" label="做多总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="仓位手续费" label="仓位手续费" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="总浮盈(已扣手续费)" label="总浮盈(已扣手续费)" width="150" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="仓位浮动盈亏" label="仓位浮动盈亏" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总手续费" label="总手续费" width="85" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总盈利" label="总盈利" width="80" show-overflow-tooltip
                    align="center"></el-table-column>


            </el-table>
        </el-main>
    </el-container>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// ------------------------------------------------------------------------------------------------------------筛选相关功能开始----------------------------------------------------------------------------------------------------
const currentNameFilters = ref([]);  // 默认为空数组，表示没有筛选
const currentSymbolFilters = ref([]);  // 默认为空数组，表示没有筛选
const nameFilters = ref([]);
const symbolFilters = ref([]);

function handleFilterChange(filters) {
    if (filters.hasOwnProperty('name')) {
        currentNameFilters.value = filters.name || [];
    }
    if (filters.hasOwnProperty('symbol')) {
        currentSymbolFilters.value = filters.symbol || [];
    }
}
// ------------------------------------------------------------------------------------------------------------筛选相关功能结束----------------------------------------------------------------------------------------------------



// 储存交易所信息的数组
const smading_infos_list = ref([]);
let ws = null;
const monitor_table_height = ref(0);
const updateHeight = () => {
    if (!document.getElementById('monitor_table')) return;
    monitor_table_height.value = window.innerHeight - 255;
    // console.log(window.innerHeight)
};
onMounted(() => {
    updateHeight()
    connectToWebSocket();
    window.addEventListener('resize', updateHeight);
});

onBeforeUnmount(() => {
    if (ws) {
        ws.close();
    }
    window.removeEventListener('resize', updateHeight);
});

// ------------------------------------------------------------------------------------------------------------websocket相关功能开始----------------------------------------------------------------------------------------------------
// 定义初始等待时间和最大等待时间
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 60000;    // 1 minute
let currentReconnectDelay = ref(INITIAL_RECONNECT_DELAY);
let reconnectTimeout = null;
let name_color_map = {}
const color_list = ['color-yyn1', 'color-yyn2', 'color-yyn3', 'color-yyn5']
function connectToWebSocket() {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket("ws://43.163.235.41:8000/ws/smading");

    ws.onopen = (event) => {
        console.log("WebSocket opened:", event);
        currentReconnectDelay.value = INITIAL_RECONNECT_DELAY; // 重置当前等待时间
    };


    ws.onmessage = (event) => {
        const rawData = JSON.parse(event.data);

        // 直接创建一个排序后的名称数组
        const sortedNames = [...new Set(rawData.map(item => item.name))].sort();

        // 分配颜色到名字
        assignColorToName(sortedNames);

        const symbols = new Set(rawData.map(item => item.symbol));
        nameFilters.value = sortedNames.map(name => ({ text: name, value: name }));
        symbolFilters.value = [...symbols].map(symbol => ({ text: symbol, value: symbol }));

        smading_infos_list.value = rawData.filter(item =>
            (!currentNameFilters.value.length || currentNameFilters.value.includes(item.name)) &&
            (!currentSymbolFilters.value.length || currentSymbolFilters.value.includes(item.symbol))
        );

    };

    ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
        if (!reconnectTimeout) {
            reconnectTimeout = setTimeout(() => {
                connectToWebSocket();
                currentReconnectDelay.value = Math.min(currentReconnectDelay.value * 2, MAX_RECONNECT_DELAY);
            }, currentReconnectDelay.value);
        }
    };

    ws.onerror = (error) => {
        console.log("WebSocket error:", error);
    };
}

function assignColorToName(names) {
    let color_list_copy = [...color_list];
    for (let name of names) {
        // 确保color_list_copy不是空的
        if (!color_list_copy.length) {
            color_list_copy = [...color_list];
        }
        let color = color_list_copy.shift();

        // 如果name_color_map中没有这个name，则添加
        if (!name_color_map[name]) {
            name_color_map[name] = color;
        }

        color_list_copy.push(color);
    }
}
function manualReconnect() {
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
    currentReconnectDelay.value = INITIAL_RECONNECT_DELAY;
    connectToWebSocket();
}
// ------------------------------------------------------------------------------------------------------------websocket相关功能结束----------------------------------------------------------------------------------------------------




// ------------------------------------------------------------------------------------------------------------表格统计相关功能开始----------------------------------------------------------------------------------------------------
const columnsToSummarize = {
    '启动资金': 1,
    '账户余额': 1,
    '止盈次数': 0,
    '仓位手续费': 4,
    '仓位浮动盈亏': 4,
    '总浮盈(已扣手续费)': 4,
    '止盈总利润': 4,
    '做空仓位浮动盈亏': 4,
    '做多仓位浮动盈亏': 4,
    '做空总盈利': 4,
    '做多总盈利': 4,
    '总手续费': 4,
    '总盈利': 4
};
function calculateSum(data, decimalPlaces) {
    const sum = data.reduce((acc, curr) => {
        const value = Number(curr);
        return !Number.isNaN(value) ? acc + value : acc;
    }, 0);

    return sum.toFixed(decimalPlaces);
}

const getSummaries = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计';
            return;
        }
        if (index === 1) {
            sums[index] = '已实现盈亏';
            return;
        }
        if (index === 4) {
            sums[4] = (Number(sums[3]) - Number(sums[2])).toFixed(1);
            console.log(sums[4], sums[3], sums[2]);
            return;
        }
        const decimalPlaces = columnsToSummarize[column.property];
        if (decimalPlaces !== undefined) {
            const values = data.map((item) => item[column.property]);
            sums[index] = calculateSum(values, decimalPlaces);
        } else {
            sums[index] = '';
        }
    });
    // console.log(sums);
    return sums;
};


const tableRowClassName = ({ row }) => {
    // console.log(row.name, name_color_map[row.name], name_color_map);
    return name_color_map[row.name];
}

const cellClassName = ({ row, rowIndex, column, columnIndex }) => {
    if (column.property === '第几次补单' && row['第几次补单'] >= 6) {
        return 'highlight-cell';
    }
    return '';
};
// ------------------------------------------------------------------------------------------------------------表格统计相关功能结束----------------------------------------------------------------------------------------------------


</script>
  
<style >
.el-table .highlight-cell {
    color: red;
    font-weight: bold;
}

.el-table .color-yyn1 {
    background-color: #FFD700;
}

.el-table .color-yyn2 {
    background-color: #f8b1a4;
}

.el-table .color-yyn3 {
    background-color: #d0c3ff;
}

.el-table .color-yyn4 {
    background-color: #b1f8b1;
}

.el-table .color-yyn5 {
    background-color: #b3dbee;
}
</style>
  
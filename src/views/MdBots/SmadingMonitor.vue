<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="3">
                    <el-button type="primary" @click="manualReconnect()">重新连接websocket服务器</el-button>

                </el-col>
                <el-col :span="10" style="margin-left: 20px;">
                    <el-select v-model="选中的交易所账号" @change="更新监控的交易所账号" clearable placeholder="选择要监控的交易所账号"
                        style="width:100%" multiple filterable>
                        <el-option v-for="item in nameFilters" :key="item.value" :label="item.text" :value="item.value" />
                    </el-select>
                </el-col>
            </el-row>
            <el-table id="monitor_table" :data="smading_infos_list" style="width: 100%" :fit="false" border
                highlight-current-row :summary-method="getSummaries" show-summary :height="monitor_table_height"
                :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @filter-change="handleFilterChange"
                scrollbar-always-on show-overflow-tooltip ref="monitorTable">
                <el-table-column fixed="left" prop="name" label="账号名" width="80" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column fixed="left" prop="symbol" label="交易对" width="120" show-overflow-tooltip align="center"
                    :filters="symbolFilters" filter-placement="bottom-end" column-key="symbol">
                    <template #default="scope">
                        <el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55" label="序号" align="center" />

                <el-table-column prop="启动资金" label="启动资金" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="账户余额" label="账户余额" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="运行时间" label="运行时间" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="每小时盈利" label="每小时盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="当前权重" label="当前权重" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="最新价格" label="最新价格" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈次数" label="止盈次数" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈总利润" label="止盈总利润" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空止盈次数" label="做空止盈次数" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空止盈总利润" label="做空止盈总利润" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多止盈次数" label="做多止盈次数" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多止盈总利润" label="做多止盈总利润" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="触发对冲单次数" label="触发对冲单次数" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次对冲单" label="第几次对冲单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次补单" label="第几次补单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位数量" label="做空仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位价格" label="做空仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空总盈利" label="做空总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位数量" label="做多仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位价格" label="做多仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>


                <el-table-column prop="做多总盈利" label="做多总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="仓位手续费" label="仓位手续费" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="总浮盈(已扣手续费)" label="总浮盈(已扣手续费)" width="150" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="做多本轮时间" label="做多本轮时间" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多第几次补单" label="做多第几次补单" width="130" show-overflow-tooltip align="center">
                    <template #header="{ column }">
                        <div class="highlight-title">{{ column.label }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="做多仓位价值" label="做多仓位价值" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column label="多仓操作" width="295" align="center">
                    <template #default="{ row, $index }">
                        <el-row :gutter="0">
                            <el-col :span="13">
                                <el-input v-model="long_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                                    style="width:45px;margin-right: 5px;" />
                                <el-button type="success" size="small" @click="重挂止盈(row, 'LONG', $index)">多仓重挂止盈</el-button>
                            </el-col>
                            <el-col :span="11">
                                <el-button type="success" size="small" @click="市价平仓(row, 'LONG')">多仓市价平仓</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="做空本轮时间" label="做空本轮时间" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空第几次补单" label="做空第几次补单" width="130" show-overflow-tooltip align="center">
                    <template #header="{ column }">
                        <div class="highlight-title">{{ column.label }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="做空仓位价值" label="做空仓位价值" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column label="空仓操作" width="295" align="center">
                    <template #default="{ row, $index }">
                        <el-row :gutter="0">
                            <el-col :span="13">
                                <el-input v-model="short_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                                    style="width:45px;margin-right: 5px;" />
                                <el-button type="danger" size="small" @click="重挂止盈(row, 'SHORT', $index)">空仓重挂止盈</el-button>
                            </el-col>
                            <el-col :span="11">
                                <el-button type="danger" size="small" @click="市价平仓(row, 'SHORT')">空仓市价平仓</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column label="需要确认的操作" width="550" align="center">
                    <template #default="{ row }">
                        <el-button type="success" size="small" @click="仓位重启(row, 'LONG')">多仓重启</el-button>
                        <el-button type="danger" size="small" @click="仓位重启(row, 'SHORT')">空仓重启</el-button>
                        <el-button type="danger" size="small" @click="暂停(row)" v-if="row.是否暂停 === '否'">暂停</el-button>
                        <el-button type="success" size="small" @click="恢复(row)" v-if="row.是否暂停 === '是'">恢复</el-button>
                        <el-button type="danger" size="small" @click="停止(row)" v-if="row.是否停止 === '否'">停止</el-button>
                        <el-button type="success" size="small" @click="启动(row)" v-if="row.是否停止 === '是'">启动</el-button>
                        <el-button type="danger" size="small" @click="重新启动(row)">重新启动</el-button>
                        <el-button type="danger" size="small" @click="切换成对冲双马丁(row)">切换成对冲双马丁</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="是否暂停" label="是否暂停" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="是否停止" label="是否停止" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column fixed="right" prop="仓位浮动盈亏" label="仓位浮动盈亏" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总手续费" label="总手续费" width="85" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" prop="总盈利" label="总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>


            </el-table>
        </el-main>
    </el-container>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import {
    api_市价平仓,
    api_重新启动,
    api_切换成对冲双马丁,
    api_重挂止盈,
    api_暂停,
    api_恢复,
    api_仓位重启,
    api_停止,
    api_启动,
} from "@/api/smading_strategy_api";
import router from '@/router'; // 确保你的路由实例已经导入
// ------------------------------------------------------------------------------------------------------------筛选相关功能开始----------------------------------------------------------------------------------------------------
const currentNameFilters = ref([]);  // 默认为空数组，表示没有筛选
const currentSymbolFilters = ref([]);  // 默认为空数组，表示没有筛选
const nameFilters = ref([]);
const symbolFilters = ref([]);
const 选中的交易所账号 = ref([]);//选中的交易所账号
const short_inputValues = ref({});//空仓重挂止盈的百分比
const long_inputValues = ref({});//多仓重挂止盈的百分比
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
const monitorTable = ref(null)
onMounted(async () => {
    updateHeight()
    connectToWebSocket();
    window.addEventListener('resize', updateHeight);
    setTimeout(() => {
        const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
        monitorTable.value.setScrollLeft(scrollArea.clientWidth + 400);
    }, 300);
});

onBeforeUnmount(() => {
    if (ws) {
        reconnectScheduled = true;
        ws.close();
    }
    window.removeEventListener('resize', updateHeight);
});

// ------------------------------------------------------------------------------------------------------------websocket相关功能开始----------------------------------------------------------------------------------------------------
const INITIAL_RECONNECT_DELAY = 300; // 初始重连延迟：1秒
const MAX_RECONNECT_DELAY = 60000;    // 最大重连延迟：1分钟
let currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 当前的重连延迟
let reconnectScheduled = false;       // 用于跟踪是否已经安排了重连
let name_color_map = {}
const color_list = ['color-yyn1', 'color-yyn2', 'color-yyn3', 'color-yyn5']

function scheduleReconnect() {
    if (reconnectScheduled) return;    // 如果已经安排了重连，则直接返回
    console.log(`计划在 ${currentReconnectDelay}ms 后重连`);
    setTimeout(() => {
        currentReconnectDelay = Math.min(currentReconnectDelay * 2, MAX_RECONNECT_DELAY);
        reconnectScheduled = false;  // 重置重连标志
        connectToWebSocket();
    }, currentReconnectDelay);
    reconnectScheduled = true;       // 设置重连标志
}


function connectToWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
    const token = localStorage.getItem('token');
    ws = new WebSocket(`ws://45.159.51.6:7878/ws/smading/${token}`);

    ws.onopen = (event) => {
        console.log("WebSocket 已连接:", event);
        currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 重置当前的重连延迟
    };

    ws.onmessage = (event) => {
        const rawData = JSON.parse(event.data);
        // console.log("WebSocket 收到消息:", rawData, rawData.error, rawData.error == true);
        // 检查消息中是否有'error'字段
        if (rawData.error) {
            console.error('WebSocket error received:', rawData.error);
            // 根据错误处理，例如：如果token无效或过期，可能需要重新登录
            if (rawData.code === 401) {
                reconnectScheduled = true;
                localStorage.removeItem('token');
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath }
                });
            }

            // 关闭WebSocket连接
            ws.close();
        } else {

            // 直接创建一个排序后的名称数组
            const sortedNames = [...new Set(rawData.map(item => item.name))].sort();

            // 分配颜色到名字
            assignColorToName(sortedNames);

            const symbols = new Set(rawData.map(item => item.symbol));
            nameFilters.value = sortedNames.map(name => ({ text: name, value: name }));
            if (选中的交易所账号.value.length == 0) {
                选中的交易所账号.value = [...sortedNames];
            }
            symbolFilters.value = [...symbols].map(symbol => ({ text: symbol, value: symbol }));

            smading_infos_list.value = rawData.filter(item =>
                (!currentNameFilters.value.length || currentNameFilters.value.includes(item.name)) &&
                (!currentSymbolFilters.value.length || currentSymbolFilters.value.includes(item.symbol)) &&
                选中的交易所账号.value.includes(item.name)
            );
        }

    };

    ws.onclose = (event) => {
        console.log("WebSocket 已关闭:", event);
        scheduleReconnect();  // 调度一个重连
    };

    ws.onerror = (error) => {
        console.log("WebSocket 出错:", error);
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
    const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
    console.log(scrollArea.clientWidth);
    monitorTable.value.setScrollLeft(scrollArea.clientWidth + 1000)
    ws.close();
}
// ------------------------------------------------------------------------------------------------------------websocket相关功能结束----------------------------------------------------------------------------------------------------

const 更新监控的交易所账号 = () => {
    console.log(选中的交易所账号.value)
}

const 重挂止盈 = async (row, position_side, index) => {
    let inputvalues = 0
    if (position_side == 'LONG') {
        inputvalues = long_inputValues.value[index]
    } else {
        inputvalues = short_inputValues.value[index]
    }
    inputvalues = parseFloat(inputvalues);
    // 如果inputvalues不能转化为小数，则提示错误
    if (isNaN(inputvalues)) {
        ElMessage({
            message: "重挂止盈失败：请输入正确的数字",
            type: "error"
        });
        return;
    }

    // console.log(long_inputValues, short_inputValues, index, inputvalues, row.exchange_id, row)
    try {
        const res = await api_重挂止盈(row.symbol, row.strategy_id, position_side, inputvalues, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "重挂止盈成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "重挂止盈失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "重挂止盈失败：" + error,
            type: "error"
        });
    }
};

const 市价平仓 = async (row, position_side) => {
    // console.log(row, position_side);
    try {
        const res = await api_市价平仓(row.symbol, row.strategy_id, position_side, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "市价平仓成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "市价平仓失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "市价平仓失败：" + error,
            type: "error"
        });
    }
};


const 仓位重启 = async (row, position_side) => {
    let 仓位名称 = ''
    if (position_side == 'LONG') {
        仓位名称 = '做多'
    } else {
        仓位名称 = '做空'
    }
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm(`确定要重启 ${仓位名称} 仓位吗？如确定，则会平掉 ${仓位名称} 仓位重新开始！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    console.log(row, position_side);
    try {
        const res = await api_仓位重启(row.symbol, row.strategy_id, position_side, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "仓位重启成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "仓位重启失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "仓位重启失败：" + error,
            type: "error"
        });
    }
};

const 暂停 = async (row) => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停吗？如暂停，等解套后则不继续开单！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_暂停(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "暂停成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "暂停失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "暂停失败：" + error,
            type: "error"
        });
    }
};


const 恢复 = async (row) => {
    // console.log(row, position_side);
    try {
        const res = await api_恢复(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "恢复成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "恢复失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "恢复失败：" + error,
            type: "error"
        });
    }
};


const 停止 = async (row) => {
    // 先弹一个提示框确定是否停止
    const res = await ElMessageBox.confirm('确定要停止吗？建议点击顺序 暂停=>多空仓位市价平仓=>停止 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_停止(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "停止成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止失败：" + error,
            type: "error"
        });
    }
};


const 启动 = async (row) => {
    // 先弹一个提示框确定是否启动
    const res = await ElMessageBox.confirm('确定要启动吗？启动会对当前币种进行平仓撤单操作 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_启动(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "启动成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "启动失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "启动失败：" + error,
            type: "error"
        });
    }
};

const 重新启动 = async (row) => {
    // 先弹一个提示框确定是否重新启动
    const res = await ElMessageBox.confirm('确定要重新启动吗？重新启动会平掉所有仓位！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_重新启动(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "重新启动成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "重新启动失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "重新启动失败：" + error,
            type: "error"
        });
    }
};


const 切换成对冲双马丁 = async (row) => {
    // 先弹一个提示框确定是否重新启动
    const res = await ElMessageBox.confirm('确定要切换成对冲双马丁吗？切换成对冲双马丁会平掉所有仓位！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_切换成对冲双马丁(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "切换成对冲双马丁成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "切换成对冲双马丁失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "切换成对冲双马丁失败：" + error,
            type: "error"
        });
    }
};

// ------------------------------------------------------------------------------------------------------------表格统计相关功能开始----------------------------------------------------------------------------------------------------
const columnsToSummarize = {
    '启动资金': 1,
    '账户余额': 1,
    '止盈次数': 0,
    '每小时盈利': 3,
    '做空止盈次数': 0,
    '做多止盈次数': 0,
    '做多止盈总利润': 2,
    '做空止盈总利润': 2,
    '仓位手续费': 4,
    '仓位浮动盈亏': 4,
    '总浮盈(已扣手续费)': 4,
    '止盈总利润': 4,
    '做空仓位浮动盈亏': 4,
    '做多仓位浮动盈亏': 4,
    '做空总盈利': 4,
    '做多总盈利': 4,
    '总手续费': 4,
    '总盈利': 3
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
        if (index === 5) {
            sums[5] = (Number(sums[4]) - Number(sums[3])).toFixed(1);
            // console.log(sums[4], sums[3], sums[2]);
            return;
        }
        if (index === 6) {
            // 取这一列的最大值
            const values = data.map((item) => item[column.property]);
            sums[index] = Math.max(...values);
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
    if (column.property === '第几次补单') {
        if (row['第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '做空第几次补单') {
        if (row['做空第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '做多第几次补单') {
        if (row['做多第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '是否暂停' && row['是否暂停'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '是否停止' && row['是否停止'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '仓位浮动盈亏' && row['仓位浮动盈亏'] <= -10) {
        return 'highlight-cell';
    }
    return '';
};
// ------------------------------------------------------------------------------------------------------------表格统计相关功能结束----------------------------------------------------------------------------------------------------


</script>
  
<style >
.el-table .highlight-title {
    background-color: #406be4;
    color: rgb(255, 255, 255);
}

.el-table .highlight-cell {
    color: red;
    font-weight: bold;
}

.el-table .bold-cell {
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
  
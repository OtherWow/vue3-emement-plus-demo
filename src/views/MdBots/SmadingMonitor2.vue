<template>
    <el-container>
        <el-main>

            <div style="height:1000px">
                <vxe-table id="monitor_table" border :data="smading_infos_list" align="center" size="medium" round
                    :scroll-x="{ enabled: true }" :scroll-y="{ enabled: true }" show-overflow max-height="1000"
                    height="auto">
                    <vxe-column type="seq" width="60" fixed="left"></vxe-column>
                    <vxe-column fixed=" left" field="name" title="账号名" width="80"></vxe-column>
                    <vxe-column fixed="left" field="symbol" title="交易对" width="120"></vxe-column>
                    <vxe-column field="交易类型" title="交易类型" width="110"></vxe-column>
                    <vxe-column field="启动资金" title="启动资金" width="110"></vxe-column>
                    <vxe-column field="账户余额" title="账户余额" width="110"></vxe-column>
                    <vxe-column fixed="left" field="运行时间" title="运行时间" width="90"></vxe-column>
                    <vxe-column fixed="left" field="每小时盈利" title="每小时盈利" width="100"></vxe-column>
                    <vxe-column field="当前版本" title="当前版本" width="110"></vxe-column>
                    <vxe-column field="做多本轮时间" title="做多本轮时间" width="70"></vxe-column>
                    <vxe-column field="做多第几次补单" title="做多补单次数" width="70">
                        <template #header="{ column }">
                            <div class="highlight-title">{{ column.title }}</div>
                        </template>
                    </vxe-column>
                    <vxe-column field="做多仓位价值" title="做多仓位价值" width="100"></vxe-column>
                    <vxe-column field="做多仓位浮动盈亏" title="做多仓位浮动盈亏" width="100"></vxe-column>

                    <vxe-column field="多仓暂停补单" title="多仓暂停补单" width="70"></vxe-column>
                    <vxe-column title="多仓操作" width="330">
                        <template #default="{ row, $index }">
                            <el-button type="success" size="small" @click="暂停补单(row, 'LONG')"
                                style="margin-left:0;margin-right:3px" v-if="row.多仓暂停补单 === '否'">暂停补单</el-button>





                        </template>
                    </vxe-column>
                    <vxe-column field="做空本轮时间" title="做空本轮时间" width="70"></vxe-column>
                    <vxe-column field="做空第几次补单" title="做空补单次数" width="70">
                        <template #header="{ column }">
                            <div class="highlight-title">{{ column.title }}</div>
                        </template>
                    </vxe-column>

                    <vxe-column field="做空仓位价值" title="做空仓位价值" width="100"></vxe-column>
                    <vxe-column field="做空仓位浮动盈亏" title="做空仓位浮动盈亏" width="100"></vxe-column>
                    <vxe-column field="空仓暂停补单" title="空仓暂停补单" width="70"></vxe-column>
                    <vxe-column title="空仓操作" width="330">
                        <template #default="{ row, $index }">
                            <el-button type="danger" size="small" @click="暂停补单(row, 'SHORT')"
                                style="margin-left:0;margin-right:3px" v-if="row.空仓暂停补单 === '否'">暂停补单</el-button>




                        </template>
                    </vxe-column>

                    <vxe-column title="需要确认的操作" width="550">
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
                    </vxe-column>

                    <vxe-column field="是否暂停" title="是否暂停" width="90"></vxe-column>
                    <vxe-column field="是否停止" title="是否停止" width="90"></vxe-column>
                    <vxe-column :fixed="选择框_仓位浮动盈亏 ? 'right' : undefined" field="仓位浮动盈亏" title="仓位浮动盈亏"
                        width="110"></vxe-column>
                    <vxe-column fixed="right" field="总手续费" title="总手续费" width="85" v-if="show_profit"></vxe-column>
                    <vxe-column fixed="right" field="总盈利" title="总盈利" width="100"></vxe-column>

                </vxe-table>
            </div>
        </el-main>
    </el-container>
</template>
  
<script setup>
import {
    api_仓位重启,
    api_停止,
    api_切换成对冲双马丁,
    api_启动,
    api_市价平仓,
    api_恢复,
    api_暂停,
    api_重挂止盈,
    api_重新启动,
    api_监控墙_暂停补单,
    api_监控墙_恢复补单,
    api_监控墙_所有市价平仓,
    api_监控墙_所有停止,
    api_监控墙_所有暂停,
    api_监控墙_所有重新开始,
    api_监控墙_禁止重开,
} from "@/api/smading_strategy_api";
import router from '@/router'; // 确保你的路由实例已经导入
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
// import { useMonitorStore } from '@/store/monitor';
// const monitorStore = useMonitorStore()

// ------------------------------------------------------------------------------------------------------------告警相关功能----------------------------------------------------------------------------------------------------

let ws = null;

onMounted(async () => {





    connectToWebSocket();

});

onBeforeUnmount(() => {
    if (ws) {
        reconnectScheduled = true;
        ws.close();
    }

});
// ------------------------------------------------------------------------------------------------------------初始化选择框----------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------筛选相关功能开始----------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------筛选相关功能结束----------------------------------------------------------------------------------------------------



const smading_infos_list = ref([])
// ------------------------------------------------------------------------------------------------------------websocket相关功能开始----------------------------------------------------------------------------------------------------
let 计算总盈利 = 0
let 计算仓位浮动盈亏 = 0
const can_show = ref(true)
const keys = [
    "name",
    "symbol",
    "strategy_id",
    "exchange_id",
    "交易类型",
    "当前版本",
    "是否暂停",
    "是否停止",
    "多仓暂停补单",
    "空仓暂停补单",
    "当前权重",
    "启动资金",
    "账户余额",
    "每小时盈利",
    "运行时间",
    "最新价格",
    "止盈次数",
    "止盈总利润",
    "做空止盈次数",
    "做空止盈总利润",
    "做多止盈次数",
    "做多止盈总利润",
    "触发对冲单次数",
    "第几次补单",
    "做空第几次补单",
    "做多第几次补单",
    "第几次对冲单",
    "做空仓位数量",
    "做空仓位价格",
    "做空仓位价值",
    "做空仓位浮动盈亏",
    "做空总盈利",
    "做空本轮时间",
    "做多仓位数量",
    "做多仓位价格",
    "做多仓位价值",
    "做多仓位浮动盈亏",
    "做多总盈利",
    "做多本轮时间",
    "仓位手续费",
    "仓位浮动盈亏",
    "总浮盈(已扣手续费)",
    "总盈利",
    "总手续费",
    "禁止重开",
];

// 定义函数，将二维数组转换为对象数组
const websocket_数组转对象 = (array2d) => {
    return array2d.map((array) => {
        // 判断类型如果是对象则直接返回，如果是数组就进行下面的处理
        if (typeof array === 'object' && !Array.isArray(array)) {
            //添加id属性，id为strategy_id+symbol
            array.id = array.strategy_id + array.symbol
            return array;
        }
        const obj = {};
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = array[i];
        }
        obj.id = obj.strategy_id + obj.symbol
        return obj;
    });
}


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

let 自动重开中 = false
function connectToWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
    const token = localStorage.getItem('token');
    ws = new WebSocket(`ws://54.238.137.72:7878/ws/smading/${token}`);

    ws.onopen = (event) => {
        console.log("WebSocket 已连接:", event);
        currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 重置当前的重连延迟
    };

    ws.onmessage = async (event) => {
        const array2d = JSON.parse(event.data);
        // 调用函数，将二维数组转换为对象数组
        const rawData = websocket_数组转对象(array2d);
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
            // rawData.forEach(item => {
            //     if (can_show.value && !(item['当前版本'].includes('v1.0.20') || item['当前版本'].includes('v1.0.19') || item['当前版本'].includes('v1.0.18') || item['当前版本'].includes('v1.0.17'))) {
            //         can_show.value = false
            //     }
            //     if (item.hasOwnProperty('总盈利') && item.hasOwnProperty('总手续费')) {
            //         item['总盈利'] = (item['总盈利'] - item['总手续费']).toFixed(4);
            //     }
            // });
            // 显示净盈利.value = (计算总盈利 + 计算仓位浮动盈亏).toFixed(2)
            // if (!自动重开中 && can_show.value && 净浮盈 > 0 && 显示净盈利.value > 净浮盈) {
            //     自动重开中 = true
            //     console.log('计算总盈利 + 计算仓位浮动盈亏', 显示净盈利.value, '净浮盈', 净浮盈)
            //     await 所有重新开始()
            //     // 等待2分钟 防止重复提交
            //     setTimeout(() => {
            //         自动重开中 = false
            //     }, 120000);
            // }
            // // 直接创建一个排序后的名称数组
            // const sortedNames = [...new Set(rawData.map(item => item.name))].sort();
            // const sorted = [...new Set(rawData.map(item => item.name + '|' + item.交易类型))].sort();
            // // 分配颜色到名字
            // assignColorToName(sorted);

            // const symbols = new Set(rawData.map(item => item.symbol));
            // nameFilters.value = sortedNames.map(name => ({ text: name, value: name }));
            // if (选中的交易所账号.value.length == 0) {
            //     选中的交易所账号.value = [...sortedNames];
            // }
            // symbolFilters.value = [...symbols].map(symbol => ({ text: symbol, value: symbol }));



            smading_infos_list.value = rawData;


            // console.log('smading_infos_list.value', smading_infos_list.value)

            // 取出最大补单次数
            // let max_long_add_times = 0;
            // let max_short_add_times = 0;
            // smading_infos_list.value.forEach(item => {
            //     if (item.hasOwnProperty('做多第几次补单')) {
            //         max_long_add_times = Math.max(max_long_add_times, item['做多第几次补单']);
            //     }
            //     if (item.hasOwnProperty('做空第几次补单')) {
            //         max_short_add_times = Math.max(max_short_add_times, item['做空第几次补单']);
            //     }
            // });
            // const max_add_times = Math.max(max_long_add_times, max_short_add_times);
            // if (is_playing.value) {
            //     if (open_alarm.value && max_add_times >= alarm_num.value) {
            //         start_alarm.value = true;
            //         show_alarm_stop.value = true;
            //     } else {
            //         audioPlayer.value.pause(); // 暂停音频
            //         start_alarm.value = false;
            //         show_alarm_stop.value = false;
            //     }
            // }
        }
    }



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
    try {

        if (position_side == 'LONG') {
            inputvalues = long_inputValues.value[index]
        } else {
            inputvalues = short_inputValues.value[index]
        }
        inputvalues = parseFloat(inputvalues);
    } catch (error) {
        // 如果inputvalues不能转化为小数，则提示错误
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


const 暂停补单 = async (row, position_side) => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停补单吗？如暂停补单，则下一次补单会暂停直到恢复补单！止盈单不受影响', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_监控墙_暂停补单(row.symbol, row.strategy_id, position_side, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "暂停补单成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "暂停补单失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "暂停补单失败：" + error,
            type: "error"
        });
    }
}


const 恢复补单 = async (row, position_side, index) => {
    let inputvalues = 0
    try {

        if (position_side == 'LONG') {
            inputvalues = long_cover_inputValues.value[index]
        } else {
            inputvalues = short_cover_inputValues.value[index]
        }
        inputvalues = parseInt(inputvalues);
    } catch (error) {
        // 如果inputvalues不能转化为小数，则提示错误
        ElMessage({
            message: "重挂止盈失败：请输入正确的数字",
            type: "error"
        });
        return;
    }
    try {
        const res = await api_监控墙_恢复补单(row.symbol, row.strategy_id, position_side, inputvalues, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "恢复补单成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "恢复补单失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "恢复补单失败：" + error,
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

const 所有市价平仓 = async (position_side) => {
    let 仓位名称 = ''
    if (position_side == 'LONG') {
        仓位名称 = '做多'
    } else {
        仓位名称 = '做空'
    }
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm(`确定要平掉所有币种的 ${仓位名称} 仓位吗？如确定，则会已市价平掉所有 ${仓位名称} 仓位！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }

    let obj_list = []
    smading_infos_list.value.forEach(item => {
        if (item.hasOwnProperty('做多仓位数量') && item.hasOwnProperty('做空仓位数量')) {
            if (position_side == 'LONG') {
                if (item['做多仓位数量'] > 0) {
                    let obj = {
                        symbol: item.symbol,
                        strategy_id: item.strategy_id,
                        position_side: position_side,
                        exchange_id: item.exchange_id
                    }
                    obj_list.push(obj)
                }
            } else {
                if (item['做空仓位数量'] > 0) {
                    let obj = {
                        symbol: item.symbol,
                        strategy_id: item.strategy_id,
                        position_side: position_side,
                        exchange_id: item.exchange_id
                    }
                    obj_list.push(obj)
                }
            }
        }
    });
    try {
        const res = await api_监控墙_所有市价平仓(obj_list);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: `${仓位名称} 所有市价平仓成功`,
                type: "success"
            });
        } else {
            ElMessage({
                message: `${仓位名称} 所有市价平仓失败：` + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: `${仓位名称} 所有市价平仓失败：` + error,
            type: "error"
        });
    }
};


const 所有暂停 = async () => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停所有币种么吗？如暂停，等解套后则不继续开单！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有暂停(obj_list);
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

const 所有停止 = async () => {
    // 先弹一个提示框确定是否停止
    const res = await ElMessageBox.confirm('确定要停止所有币种么吗？建议点击顺序 暂停=>多空仓位市价平仓=>停止 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有停止(obj_list);
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


const 所有重新开始 = async () => {
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有重新开始(obj_list);
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



const 禁止重开 = async (row) => {
    try {
        const _data = {
            'symbol': row.symbol,
            'strategy_id': row.strategy_id,
            'exchange_id': row.exchange_id
        }
        const res = await api_监控墙_禁止重开(_data);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "失败：" + error,
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

.flex-container {
    display: flex;
    align-items: center;
}
</style>
  
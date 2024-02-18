<template>
    <el-form :model="currentStrategy" label-width="150px">


        <el-card class="box-card" style="margin-bottom: 20px; margin-right: 20px; margin-left: 20px; margin-top: 20px">

            <div class="demo-collapse">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template #title>
                            <el-text>辅助下单基础设置</el-text><el-tooltip placement="top" effect="dark" class="box-item">
                                <template #content> 按照提示设置好期望后就可以点击开始下单，会根据配置自动下单，止损或者止盈后停止。<br />
                                    所选的币种如在平台已使用其他策略则无法启动。<br />
                                    20倍杠杆一般支持的最大仓位价值为5000usdt，具体阈值可以在币安查看。
                                </template>
                                <el-icon :span="12" size="20" style="margin-left:3px;margin-right:10px;">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip><el-text tag="b" type="danger">注意：使用前请确认当前开单方向的币种没有正在运行马丁策略,否则会有冲突。</el-text>
                        </template>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="交易所账号" required>
                                    <el-select v-model="exchange_info" clearable placeholder="请选择" style="width: 100%"
                                        filterable value-key="id">
                                        <el-option v-for="item in exchange_options" :key="item.id"
                                            :label="item.exchange_name" :value="item" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="交易类型" required>
                                    <el-radio-group v-model="currentStrategy.trade_type" class="my-radio-group">
                                        <el-radio-button :label="'futures'" class="my-radio-50">
                                            <template #default>合约</template>
                                        </el-radio-button>
                                        <el-radio-button :label="'spot'" class="my-radio-50" :disabled="true">
                                            <template #default>现货</template>
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-row :gutter="20">
                            <el-col :span="12">
                                <!-- 交易对的多选框 -->
                                <el-form-item label="币种" required>
                                    <el-select v-model="currentStrategy.symbols" clearable placeholder="请选择"
                                        style="width: 100%" multiple filterable>
                                        <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol"
                                            :value="item.symbol" />
                                    </el-select>
                                </el-form-item>
                            </el-col>


                            <el-col :span="12">
                                <div>
                                    <el-form-item required>
                                        <template #label>

                                            <el-text>开单方向</el-text><el-tooltip placement="top" effect="dark"
                                                class="box-item">
                                                <template #content> 双向就是同时做多和做空。只支持市价开单，限价开单会有一个方向立即成交。
                                                </template>
                                                <el-icon :span="12" size="20"
                                                    style="margin-left:3px;position: relative; top: 5px;">
                                                    <QuestionFilled />
                                                </el-icon>
                                            </el-tooltip>
                                        </template>
                                        <el-radio-group v-model="currentStrategy.position_side" class="my-radio-group">
                                            <el-radio-button :label="'LONG'" class="my-radio-33">
                                                <template #default>做多(看涨)</template>
                                            </el-radio-button>
                                            <el-radio-button :label="'SHORT'" class="my-radio-33">
                                                <template #default>做空(看跌)</template>
                                            </el-radio-button>
                                            <el-radio-button :label="'BOTH'" class="my-radio-33">
                                                <template #default>双向</template>
                                            </el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>



                                </div>
                            </el-col>

                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div>
                                    <el-form-item label="开单类型" required>
                                        <el-radio-group v-model="currentStrategy.order_type" class="my-radio-group">
                                            <el-radio-button :label="'MARKET'" class="my-radio-50">
                                                <template #default>市价开单</template>
                                            </el-radio-button>
                                            <el-radio-button :label="'LIMIT'" class="my-radio-50"
                                                :disabled="currentStrategy.position_side === 'BOTH'">
                                                <template #default>限价开单</template>
                                            </el-radio-button>


                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12" v-if="currentStrategy.order_type === 'LIMIT'">
                                <el-form-item required>
                                    <template #label>

                                        <el-text>限价开单价格</el-text><el-tooltip placement="top" effect="dark" class="box-item">
                                            <template #content> 限价单的价格不能偏离最新价格太多，一般不能超过当前价格的20%，否则会无法开单，具体规则可以在币安查看。
                                            </template>
                                            <el-icon :span="12" size="20"
                                                style="margin-left:3px;position: relative; top: 5px;">
                                                <QuestionFilled />
                                            </el-icon>
                                        </el-tooltip>

                                    </template>
                                    <el-input v-model.number="currentStrategy.limit_order_price">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>


                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="开单价值" required>
                                    <el-input type="number" v-model.number="currentStrategy.first_position_value">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="止盈设置" required>
                                    <el-input type="number" v-model.number="currentStrategy.take_profit_value">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div>
                                    <el-form-item label="开启止损" required>
                                        <el-radio-group v-model="currentStrategy.open_stop_loss" class="my-radio-group">
                                            <el-radio-button :label="true" class="my-radio-50">
                                                <template #default>开启</template>
                                            </el-radio-button>
                                            <el-radio-button :label="false" class="my-radio-50">
                                                <template #default>关闭</template>
                                            </el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="12" v-if="currentStrategy.open_stop_loss">
                                <el-form-item label="止损设置" required>
                                    <el-input type="number" v-model.number="currentStrategy.stop_loss_value">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">

                            </el-col>
                            <el-col :span="11">

                                <el-button type="primary" @click="submitStrategy" style="width:300px"> 开始下单
                                </el-button>

                            </el-col>


                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template #title>

                            <el-text>监控墙</el-text><el-tooltip placement="top" effect="dark" class="box-item">
                                <template #content> 开始下单后币种会出现在监控墙，币种停止后会在监控墙停留5分钟，可再次开启
                                </template>
                                <el-icon :span="12" size="20" style="margin-left:3px;">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip> </template>
                        <el-table id="monitor_table" :data="robot_order_info_list" style="width: 100%" :fit="false" border
                            highlight-current-row :summary-method="getSummaries" show-summary :height="monitor_table_height"
                            :row-class-name="tableRowClassName" :cell-class-name="cellClassName" scrollbar-always-on
                            show-overflow-tooltip ref="monitorTable" row-key="id">
                            <el-table-column fixed="left" type="index" width="55" label="序号" align="center" />
                            <el-table-column fixed="left" prop="name" label="账号名" width="80" show-overflow-tooltip
                                align="center"></el-table-column>

                            <el-table-column fixed="left" prop="symbol" label="交易对" width="120" show-overflow-tooltip
                                align="center" column-key="symbol">
                                <template #default="scope">
                                    <el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="交易类型" label="交易类型" width="110" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="启动资金" label="启动资金" width="110" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="账户余额" label="账户余额" width="110" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="运行时间" label="运行时间" width="90" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="开单类型" label="开单类型" width="90" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="限价开单价格" label="限价开单价格" width="90" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="开单方向" label="开单方向" width="90" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="开单价值" label="开单价值" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="止损设置" label="止损设置" width="120" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="止盈设置" label="止盈设置" width="130" show-overflow-tooltip
                                align="center"></el-table-column>

                            <el-table-column prop="当前版本" label="当前版本" width="110" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做多本轮时间" label="做多本轮时间" width="70" show-overflow-tooltip align="center">
                                <template #header="{ column }">
                                    <div class="highlight-title">{{ column.label }}</div>
                                </template></el-table-column>
                            <el-table-column prop="做多仓位数量" label="做多仓位数量" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做多仓位价格" label="做多仓位价格" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做多仓位价值" label="做多仓位价值" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="100" show-overflow-tooltip
                                align="center"></el-table-column>


                            <el-table-column label="多仓操作" width="230" align="center">
                                <template #default="{ row, $index }">

                                    <el-button type="success" size="small" @click="市价平仓(row, 'LONG')"
                                        style="margin-left:0;margin-right:3px">市价平仓</el-button>
                                    <el-input v-model="long_inputValues[$index]" class="w-50 m-2" size="small"
                                        placeholder="" style="width:40px;margin-right: 3px;margin-left:0px" />
                                    <el-button type="success" size="small" @click="重挂止盈(row, 'LONG', $index)"
                                        style="margin-left:0;margin-right:0px">重挂止盈</el-button>

                                </template>
                            </el-table-column>
                            <el-table-column prop="做空本轮时间" label="做空本轮时间" width="70" show-overflow-tooltip
                                align="center"><template #header="{ column }">
                                    <div class="highlight-title">{{ column.label }}</div>
                                </template></el-table-column>



                            <el-table-column prop="做空仓位数量" label="做空仓位数量" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做空仓位价格" label="做空仓位价格" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做空仓位价值" label="做空仓位价值" width="100" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="100" show-overflow-tooltip
                                align="center"></el-table-column>

                            <el-table-column label="空仓操作" width="230" align="center">
                                <template #default="{ row, $index }">
                                    <el-button type="danger" size="small" @click="市价平仓(row, 'SHORT')"
                                        style="margin-left:0;margin-right:3px">市价平仓</el-button>
                                    <el-input v-model="short_inputValues[$index]" class="w-50 m-2" size="small"
                                        placeholder="" style="width:45px;margin-right: 3px;margin-left:0px" />
                                    <el-button type="danger" size="small" @click="重挂止盈(row, 'SHORT', $index)"
                                        style="margin-left:0;margin-right:0px">重挂止盈</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="需要确认的操作" width="100" align="center">
                                <template #default="{ row, $index }">
                                    <el-button type="danger" size="small" @click="停止(row)"
                                        v-if="row.是否停止 === '否'">停止</el-button>
                                    <el-button type="success" size="small" @click="启动(row)"
                                        v-if="row.是否停止 === '是'">启动</el-button>
                                </template>
                            </el-table-column>

                            <el-table-column prop="是否停止" label="是否停止" width="60" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column prop="当前状态" label="当前状态" width="310" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column fixed="right" prop="仓位浮动盈亏" label="仓位浮动盈亏" width="110" show-overflow-tooltip
                                align="center"></el-table-column>
                            <el-table-column fixed="right" prop="总手续费" label="总手续费" width="85" show-overflow-tooltip
                                align="center" v-if="show_profit"></el-table-column>
                            <el-table-column fixed="right" prop="总盈利" label="总盈利" width="100" show-overflow-tooltip
                                align="center"></el-table-column>

                        </el-table>

                    </el-collapse-item>

                </el-collapse>





            </div>
        </el-card>

    </el-form>
</template>

<script setup>
import { 查询当前用户的所有交易所信息 } from '@/api/exchange_infos_api'
import { api_获取交易对列表 } from '@/api/funding_rate_strategy_api'
import {
    api_批量启动交易对,
    api_批量停止交易对,
    api_监控墙_启动,
    api_监控墙_停止,
    api_监控墙_重挂止盈,
    api_监控墙_市价平仓,

} from '@/api/robot_order_api'
import { inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";


// -------------------------------------------------------------------页面初始化开始----------------------------------------------------------------------------------------------------
const show_profit = ref(false)
const short_inputValues = ref({});//空仓重挂止盈的百分比
const long_inputValues = ref({});//多仓重挂止盈的百分比
const monitor_table_height = ref(0);
const updateHeight = () => {
    if (!document.getElementById('monitor_table')) return;
    monitor_table_height.value = window.innerHeight - 705;
    // console.log(window.innerHeight)
};
onMounted(() => {
    updateHeight()
    getExchangeInfoList()
    getSymbolList()
    connectToWebSocket();
    if (localStorage.getItem('username') === 'syb' || localStorage.getItem('username') === 'yyn') {
        show_profit.value = true
    } else {
        show_profit.value = false
    }
})

onBeforeUnmount(() => { })
// -------------------------------------------------------------------页面初始化结束----------------------------------------------------------------------------------------------------

const activeNames = ref(['1', '2'])


const currentStrategy = ref({
    trade_type: 'futures', // 交易类型
    symbols: [], // 交易对
    position_side: 'LONG', // 开单方向
    order_type: 'MARKET', // 开单类型
    limit_order_price: 0, // 限价开单价格
    first_position_value: 0, // 开单价值
    take_profit_value: 0, // 止盈设置
    open_stop_loss: true, // 开启止损
    stop_loss_value: 0, // 止损设置
})

// 获取交易所信息
const exchange_options = ref([])
const exchange_info = ref({
    id: '',
    exchange_name: '',
})
const getExchangeInfoList = async () => {
    try {
        const res = await 查询当前用户的所有交易所信息()
        // console.log("res", res);
        if (res.status === 200) {
            // console.log(res.data.data);
            exchange_options.value = res.data.data
            // 如果长度超过1，则默认选中第一个
            if (exchange_options.value.length > 0) {
                exchange_info.value = exchange_options.value[0]
            }
        }
    } catch (error) {
        ElMessage({
            message: '查询当前用户的所有交易所信息失败：' + error,
            type: 'error',
        })
    }
}
// 获取交易对信息
const symbol_options = ref([])
const futures_all_symbols = ref([])
const getSymbolList = async () => {
    try {
        const res = await api_获取交易对列表()
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            futures_all_symbols.value = res.data.data
            symbol_options.value = [...futures_all_symbols.value]
        } else {
            ElMessage({
                message: '查询交易对列表失败：' + res.data.msg,
                type: 'error',
            })
        }
    } catch (error) {
        ElMessage({
            message: '查询交易对列表失败：' + error,
            type: 'error',
        })
    }
}
// --------------------------------------------------------------------------辅助下单方法开始----------------------------------------------------------------------------------------------------
const 转化为大于0的数字类型 = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
};
const submitStrategy = async () => {
    console.log("currentStrategy.value", currentStrategy.value);
    //根据currentStrategy.value.symbols遍历出所有的symbol，重新组装data
    if (currentStrategy.order_value) {

    }
    let data_list = []
    currentStrategy.value.symbols.forEach(symbol => {
        const data = {
            exchange_id: exchange_info.value.id,
            symbol: symbol,
            trade_type: currentStrategy.value.trade_type,
            position_side: currentStrategy.value.position_side,
            order_type: currentStrategy.value.order_type,
            limit_order_price: 转化为大于0的数字类型(currentStrategy.value.limit_order_price),
            first_position_value: currentStrategy.value.first_position_value,
            take_profit_value: currentStrategy.value.take_profit_value,
            open_stop_loss: currentStrategy.value.open_stop_loss,
            stop_loss_value: currentStrategy.value.stop_loss_value,
        }
        console.log("data", data);
        data_list.push(data)
    });
    try {
        const res = await api_批量启动交易对(data_list)
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            ElMessage({
                message: '批量启动交易对成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '批量启动交易对失败：' + res.data.msg,
                type: 'error',
            })
        }
    } catch (error) {
        ElMessage({
            message: '批量启动交易对失败：' + error,
            type: 'error',
        })
    }

    console.log("exchange_info.value", exchange_info.value);
}

// --------------------------------------------------------------------------辅助下单方法结束----------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------websocket方法开始----------------------------------------------------------------------------------------------------
let ws = null;
const robot_order_info_list = ref([])
let 计算总盈利 = 0
let 计算仓位浮动盈亏 = 0
const can_show = ref(true)
const keys = [
    "name",
    "symbol",
    "exchange_id",
    "交易类型",
    "运行时间",
    "启动资金",
    "账户余额",
    "是否停止",
    "开单类型",
    "限价开单价格",
    "开单方向",
    "开单价值",
    "止损设置",
    "止盈设置",
    "当前版本",
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
    "仓位浮动盈亏",
    "总盈利",
    "总手续费",
    "当前状态",
    "开启止损",
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


function connectToWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
    const token = localStorage.getItem('token');
    if (token === null) {
        return;
    }
    ws = new WebSocket(`ws://54.238.137.72:7878/ws/robot_order/${token}`);

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
            const versionCheck = (version) => ['v1.0.24', 'v1.0.23', 'v1.0.22', 'v1.0.21', 'v1.0.20', 'v1.0.19', 'v1.0.18', 'v1.0.17'].some(v => version.includes(v));
            let 计算总盈利 = 0;
            let 计算仓位浮动盈亏 = 0;
            let names = new Set();
            let nameAndTypes = new Set();
            let symbols = new Set();
            // 用于存储符合条件的项目,用于表格展示
            let tempSmadingInfos = [];
            rawData.forEach(item => {
                const { 当前版本, 总盈利, 总手续费, 禁止重开, 仓位浮动盈亏, name, symbol, 交易类型, 做多第几次补单, 做空第几次补单 } = item;
                //版本不符合，新功能不展示
                if (can_show.value && !versionCheck(当前版本)) {
                    can_show.value = false;
                }

                // 计算总盈利
                if (总盈利 !== undefined && 总手续费 !== undefined) {
                    item['总盈利'] = (总盈利 - 总手续费).toFixed(4);

                    计算总盈利 += parseFloat(item['总盈利']);

                }

                if (仓位浮动盈亏 !== undefined) {
                    计算仓位浮动盈亏 += parseFloat(仓位浮动盈亏);
                }

                tempSmadingInfos.push(item);

                // 构建用于过滤和排序的集合
                names.add(name);
                symbols.add(symbol);
                nameAndTypes.add(`${name}|${交易类型}`);
            });
            //表格数据赋值
            robot_order_info_list.value = tempSmadingInfos;



            // 将Set转换为排序后的数组
            const sortedNames = [...names].sort();

            // 根据交易所的名字跟交易类型分配表格颜色
            const sortedNameAndTypes = [...nameAndTypes].sort();
            assignColorToName(sortedNameAndTypes);



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


// --------------------------------------------------------------------------websocket方法结束----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------表格统计相关功能开始----------------------------------------------------------------------------------------------------
const columnsToSummarize = {
    '启动资金': 1,
    '账户余额': 1,
    '仓位浮动盈亏': 4,
    '做多仓位价值': 1,
    '做空仓位价值': 1,
    '做空仓位浮动盈亏': 4,
    '做多仓位浮动盈亏': 4,
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
    // console.log("columns", columns, data)
    const sums = [];
    const sums2 = [];
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
        // if 
        const decimalPlaces = columnsToSummarize[column.property];
        if (decimalPlaces !== undefined) {
            const values = data.map((item) => item[column.property]);
            sums[index] = calculateSum(values, decimalPlaces);
        } else {
            sums[index] = '';
        }
    });

    return sums;
};


const tableRowClassName = ({ row }) => {
    // console.log(row.name, name_color_map[row.name], name_color_map);
    return name_color_map[row.name + '|' + row.交易类型];
}

const cellClassName = ({ row, rowIndex, column, columnIndex }) => {



    if (column.property === '是否停止' && row['是否停止'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '仓位浮动盈亏' && row['仓位浮动盈亏'] <= -10) {
        return 'highlight-cell';
    }
    return '';
};
// --------------------------------------------------------------------------表格统计相关功能结束----------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------监控墙方法开始----------------------------------------------------------------------------------------------------

const 市价平仓 = async (row, position_side) => {
    // console.log(row, position_side);
    try {
        const res = await api_监控墙_市价平仓(row.symbol, position_side, row.exchange_id);
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
        const res = await api_监控墙_重挂止盈(row.symbol, position_side, inputvalues, row.exchange_id);
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


const 停止 = async (row) => {
    // 先弹一个提示框确定是否停止
    const res = await ElMessageBox.confirm('确定要停止吗？建议点击顺序 仓位市价平仓=>停止 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_监控墙_停止(row.symbol, row.exchange_id);
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
    const res = await ElMessageBox.confirm('确定要启动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    const data = {
        exchange_id: row.exchange_id,
        symbol: row.symbol,
        trade_type: row.交易类型 === '合约' ? 'futures' : 'spot',
        position_side: row.开单方向,
        order_type: row.开单类型,
        limit_order_price: row.限价开单价格,
        first_position_value: row.开单价值,
        take_profit_value: row.止盈设置,
        open_stop_loss: row.开启止损,
        stop_loss_value: row.止损设置,
    }
    try {
        const res = await api_监控墙_启动(data);
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
// --------------------------------------------------------------------------监控墙方法结束----------------------------------------------------------------------------------------------------

</script>

<style lang="less" scoped>
.my-radio-group {
    width: 100%;
}

.my-radio-50 {
    width: 50%;

    :deep(.el-radio-button__inner) {
        width: 100%;
    }
}

.my-radio-33 {
    width: 33.33%;

    :deep(.el-radio-button__inner) {
        width: 100%;
    }
}

.el-table:deep(.highlight-title) {
    background-color: #406be4;
    color: rgb(255, 255, 255);
}

.el-table:deep(.highlight-cell) {
    color: red;
    font-weight: bold;
}

.el-table:deep(.bold-cell) {
    font-weight: bold;
}


.el-table:deep(.color-yyn1) {
    background-color: #FFD700;
}

.el-table:deep(.color-yyn2) {
    background-color: #f8b1a4;
}

.el-table:deep(.color-yyn3) {
    background-color: #d0c3ff;
}

.el-table:deep(.color-yyn4) {
    background-color: #b1f8b1;
}

.el-table:deep(.color-yyn5) {
    background-color: #b3dbee;
}
</style>
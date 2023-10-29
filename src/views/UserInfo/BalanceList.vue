<template>
    <el-card class="box-card" style="margin:20px" id="main_card" :style="{ height: cardHeight + 'px' }">
        <template #header>
            <el-form :model="query_form">
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :span="4">
                        <el-form-item label="交易所账号" required>
                            <el-select v-model="exchange_info" clearable placeholder="请选择" style="width:100%" filterable
                                value-key="id" @change="changeExchange">
                                <el-option v-for="item in exchange_options" :key="item.id" :label="item.exchange_name"
                                    :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="余额类型">
                            <el-select v-model="query_form.type" placeholder="请选择余额类型" style="width:100%">
                                <el-option label="合约" value="1" />
                                <!-- <el-option label="现货" value="2" /> -->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="4">
                        <el-form-item label="时间粒度">
                            <el-select v-model="query_form.type" placeholder="请选择时间粒度" style="width:100%">
                                <el-option label="1分钟" value="1" />
                                <el-option label="5分钟" value="2" />
                                <el-option label="30分钟" value="3" />
                                <el-option label="1小时" value="4" />
                                <el-option label="6小时" value="5" />
                                <el-option label="1天" value="6" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="日期范围">
                            <el-date-picker v-model="data_r" type="datetimerange" range-separator="到"
                                start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" /></el-form-item>
                    </el-col>

                    <el-col :span="2">
                        <el-button type="primary" class="grid-content ep-bg-purple" @click="query">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </template>
        <div id="main" style="width: 100%;" :style="{ height: (cardHeight - 200) + 'px' }"></div>
    </el-card>
</template>

<script setup>
import { 查询当前用户的所有交易所信息 } from "@/api/exchange_infos_api";
import { api_获取用户指定交易所的余额信息 } from "@/api/user_info_api";
import { inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";


// 通过 inject 方法获取 $echarts 对象
const $echarts = inject('$echarts');


const query_form = reactive({
    exchange_id: "",
    type: "1",
    start_time: "",
    end_time: "",
    time_type: "1"
});
// ------------------------------------------------------------------------------------------------------------页面初始化开始----------------------------------------------------------------------------------------------------
const cardHeight = ref(0);  // default height
const updateHeight = () => {
    if (!document.getElementById('main_card')) return;
    cardHeight.value = window.innerHeight - 200;
    // console.log(window.innerHeight)
};
onMounted(() => {
    updateHeight();
    getExchangeInfoList();
    window.addEventListener('resize', updateHeight);
    // intervalId.value = setInterval(() => {
    //     if (dialogVisible.value) {
    //         return;
    //     }
    //     getStartegyList();
    // }, 3000); // Run this every second
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateHeight);

});

// ------------------------------------------------------------------------------------------------------------页面初始化结束----------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------日期组件开始----------------------------------------------------------------------------------------------------
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);
const data_r = ref([todayStart, todayEnd]);
const shortcuts = [
    {
        text: '今天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return [start, end]
        },
    },
    {
        text: '昨天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            start.setHours(0, 0, 0, 0);
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            end.setHours(23, 59, 59, 999);
            return [start, end]
        },
    },
    {
        text: '24小时内',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            return [start, end]
        },
    },
    {
        text: '一周内',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '一个月内',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '3个月内',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
// ------------------------------------------------------------------------------------------------------------日期组件结束----------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------获取交易所信息开始----------------------------------------------------------------------------------------------------
const exchange_info = ref({
    id: "",
    exchange_name: ""
});
const exchange_options = ref([]);
// 获取交易所信息
async function getExchangeInfoList() {
    try {
        const res = await 查询当前用户的所有交易所信息();
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            exchange_options.value = res.data.data;
        } else {
            ElMessage({
                message: "查询当前用户的所有交易所信息失败：" + error,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "查询当前用户的所有交易所信息失败：" + error,
            type: "error"
        });
    }
}

// ------------------------------------------------------------------------------------------------------------获取交易所信息结束----------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------按钮方法开始----------------------------------------------------------------------------------------------------

const changeExchange = async () => {
    await query();
}

const balance_list = ref([]);

const formatDateToISOStringWithoutTimeZone = (date) => {
    let tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            let norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

const query = async () => {
    // 所有查询条件为必传 检查

    if (query_form.type === "") {
        ElMessage({
            message: "请选择余额类型",
            type: "error"
        });
        return;
    }
    if (data_r.value[0] === "" || data_r.value[1] === "") {
        ElMessage({
            message: "请选择日期范围",
            type: "error"
        });
        return;
    }
    if (query_form.time_type === "") {
        ElMessage({
            message: "请选择时间粒度",
            type: "error"
        });
        return;
    }
    const data = {
        "type": query_form.type,
        "start_time": formatDateToISOStringWithoutTimeZone(data_r.value[0]),
        "end_time": formatDateToISOStringWithoutTimeZone(data_r.value[1]),
        "time_type": query_form.time_type
    }
    if (exchange_info.value.id !== "") {
        data.exchange_id = exchange_info.value.id;
    }
    try {
        const res = await api_获取用户指定交易所的余额信息(data);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            balance_list.value = res.data.data;
            const x_data = [];
            const y_data = [];
            const y2_data = [];
            const y3_data = [];
            const y4_data = [];
            const y5_data = [];
            const y6_data = [];
            const y7_data = [];
            const y8_data = [];
            const y9_data = [];
            balance_list.value.forEach(item => {
                x_data.push(item[10].replace('T', ' '));
                y_data.push(item[0]);
                y2_data.push(item[1]);
                y3_data.push(item[2]);
                y4_data.push(item[4]);
                y5_data.push(item[5]);
                y6_data.push(item[6]);
                y7_data.push(item[7]);
                y8_data.push(item[8]);
                y9_data.push(item[9]);
            });
            let minY = Math.min(...y3_data);
            let maxY = Math.max(...y3_data);
            let y2_minY = Math.min(...y2_data);
            let y2_maxY = Math.max(...y2_data);
            var myChart = $echarts.init(document.getElementById('main'));
            myChart.setOption({
                title: {
                    text: '余额变化统计',
                    left: 10
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: false
                        },
                        saveAsImage: {
                            pixelRatio: 2
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    bottom: 90
                },
                xAxis: [
                    {
                        data: x_data,
                        silent: false,
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        // 这是左边的Y轴
                        type: 'value',
                        min: minY,
                        max: maxY,
                        axisLabel: {
                            formatter: '合约钱包余额 {value} USDT'
                        }
                    },
                    {
                        // 这是右边的Y轴
                        type: 'value',
                        min: y2_minY,
                        max: y2_maxY,
                        axisLabel: {
                            formatter: '总盈利 {value} USDT'
                        }
                    }
                ],
                series: [
                    {
                        name: '合约钱包余额',
                        type: 'line',
                        yAxisIndex: 0,  // 指定使用左边的Y轴
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }
                            ])
                        },
                        smooth: true,
                        data: y3_data,
                    },
                    // {
                    //     name: '合约钱包余额',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y3_data,
                    //     smooth: true
                    // },
                    {
                        name: '总盈利',
                        type: 'line',
                        yAxisIndex: 1,  // 指定使用右边的Y轴
                        data: y2_data,
                        smooth: true
                    },
                    // {
                    //     name: '订单盈利',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y4_data,
                    //     smooth: true
                    // },
                    // {
                    //     name: '总手续费',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y5_data,
                    //     smooth: true
                    // },
                    // {
                    //     name: '总资金费率金额',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y6_data,
                    //     smooth: true
                    // },
                    // {
                    //     name: '总转出金额',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y7_data,
                    //     smooth: true
                    // },
                    // {
                    //     name: '总转入金额',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y8_data,
                    //     smooth: true
                    // },
                    // {
                    //     name: '返佣金额',
                    //     type: 'line',
                    //     // yAxisIndex: 1,  // 指定使用右边的Y轴
                    //     data: y9_data,
                    //     smooth: true
                    // }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                    },
                    {
                        type: 'slider',
                    }
                ]

            })
        } else {
            ElMessage({
                message: "获取用户指定交易所的余额信息失败：" + error,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "获取用户指定交易所的余额信息失败：" + error,
            type: "error"
        });
    }
}

// ------------------------------------------------------------------------------------------------------------按钮方法结束----------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped></style>
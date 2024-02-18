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


        <el-table :data="tableData" border style="width: 100%;" :style="{ height: (cardHeight - 200) + 'px' }"
            table-layout="fixed">
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column prop="user_id" label="用户id" width="100" />
            <el-table-column prop="exchange_id" label="币安账户id" width="120" />
            <el-table-column prop="exchange_name" label="币安账户名称" width="180" />
            <el-table-column prop="trade_type" label="交易类型" width="120" />
            <el-table-column prop="order_type" label="订单类型" width="100" />
            <el-table-column prop="limit_order_price" label="限价单价格" width="120" />
            <el-table-column prop="symbol" label="交易对" width="120" />
            <el-table-column prop="position_side" label="开单方向" width="120" />
            <el-table-column prop="first_position_value" label="开单价值" width="120" />
            <el-table-column prop="open_stop_loss" label="开启止损" width="100" />
            <el-table-column prop="stop_less_value" label="止损设置" width="120" />
            <el-table-column prop="stop_profit_value" label="止盈设置" width="120" />
            <el-table-column prop="profit_result" label="盈利结果" width="120" />
            <el-table-column prop="fee" label="手续费" width="100" />
            <el-table-column prop="status" label="当前状态" width="120" />
            <el-table-column prop="create_time" label="创建时间" width="180" />
            <el-table-column prop="update_time" label="更新时间" width="180" />
        </el-table>
        <el-pagination v-model:current-page="currentPage4" style="margin-top: 15px;" v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
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
            // 如果长度超过1，则默认选中第一个
            if (exchange_options.value.length > 0) {
                exchange_info.value = exchange_options.value[0]
            }
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



// ------------------------------------------------------------------------------------------------------------按钮方法结束----------------------------------------------------------------------------------------------------
</script>

<style lang="less" scoped></style>
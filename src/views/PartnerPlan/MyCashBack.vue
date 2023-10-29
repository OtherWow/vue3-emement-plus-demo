<template>
    <el-card class="box-card" style="margin:20px" id="main_card" :style="{ height: cardHeight + 'px' }">

        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template #title>
                    <el-text tag="b" size="large">我的信息</el-text>
                </template>
                <el-descriptions class="margin-top" title="" :column="4" :size="size" border>

                    <el-descriptions-item label="当前身份">{{ my_partner_info.user_partner }}</el-descriptions-item>
                    <el-descriptions-item label="交易合伙人状态">
                        <el-tag type="success">{{ my_partner_info.partner_status_name }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="成为交易合伙人日期">
                        {{ my_partner_info.be_partner_date }}
                    </el-descriptions-item>
                    <el-descriptions-item label="返现的币安账户id">
                        {{ my_partner_info.cashback_binance_id }}
                    </el-descriptions-item>
                    <el-descriptions-item label="我的本月总交易额">
                        <el-text> {{ my_partner_info.my_quote_qty }} 万 USDT</el-text>

                    </el-descriptions-item>
                    <el-descriptions-item label="被推荐人本月总交易额">
                        <el-text> {{ my_partner_info.recommend_quote_qty }} 万 USDT</el-text>

                    </el-descriptions-item>
                    <el-descriptions-item label="本月总交易额" span="2">
                        <el-text> {{ my_partner_info.total_quote_qty }} 万 USDT</el-text>

                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <el-text tag="b" type="danger">合伙人权益生效后本月预估总返现</el-text>
                        </template>
                        <el-text tag="b" type="danger">{{ my_partner_info.total_cash_back }} USDT</el-text>
                    </el-descriptions-item>



                </el-descriptions>
            </el-collapse-item>
            <!-- <el-collapse-item name="2">
                <template #title>
                    <el-text tag="b" size="large">我的交易额查询</el-text>
                </template>
            </el-collapse-item> -->
            <el-collapse-item name="3">
                <template #title>
                    <el-text tag="b" size="large">被推荐人交易额查询</el-text>
                </template>
                <el-form :model="query_form">
                    <el-row :gutter="20" style="margin-top:10px">

                        <el-col :span="8">
                            <el-form-item label="日期范围">
                                <el-date-picker v-model="data_r" type="datetimerange" range-separator="到"
                                    start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts"
                                    @change="data_change" /></el-form-item>
                        </el-col>

                        <el-col :span="2">
                            <el-button type="primary" class="grid-content ep-bg-purple" @click="query">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider />
                <el-table ref="singleTableRef" :data="recommend_list" style="width: 100%" :fit="false" border
                    highlight-current-row @current-change="handleSelectionChangeOuter" @expand-change="onExpandChange"
                    :expand-row-keys="expandedRowKeys" row-key="recommend_exchange_id" height="700px"
                    :row-class-name="getRowClass">
                    <el-table-column type="expand">
                        <template #default="props">

                            <el-table :data="props.row.recommend_recommend_list" style="margin-left: 150px; width: 100%">
                                <!-- <el-table-column type="selection" width="55" /> -->
                                <el-table-column type="index" width="55" label="序号" align="center" />
                                <el-table-column label="下级用户名称" prop="recommend_recommend_name" width="250"
                                    align="center" />
                                <el-table-column label="下级交易所名称" prop="recommend_recommend_exchange_name" width="250"
                                    align="center" />
                                <el-table-column label="总交易额(万 USDT)" prop="quote_qty" width="250" align="center" />
                                <el-table-column label="预计返现(USDT)" prop="cash_back" width="250" align="center" />

                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="55" label="序号" align="center" />
                    <el-table-column label="用户名称" prop="recommend_name" width="250" align="center" />
                    <el-table-column label="交易所名称" prop="recommend_exchange_name" width="250" align="center" />
                    <el-table-column label="总交易额(万 USDT)" prop="quote_qty" width="250" align="center" />
                    <el-table-column label="预估返现(USDT)" prop="cash_back" width="250" align="center" />
                    <el-table-column label="下级预估总返现(USDT)" prop="recommend_recommend_cash_back" width="250"
                        align="center" />
                    <el-table-column label="预估总返现(USDT)" prop="all_cash_back" width="250" align="center">
                        <template #header="{ column }">
                            <div class="highlight-title">{{ column.label }}</div>
                        </template>
                    </el-table-column>

                </el-table>
            </el-collapse-item>
        </el-collapse>


    </el-card>
</template>

<script setup>

import {
    api_获取我的交易合伙人信息,
    api_查询我的推荐人交易额明细,
} from "@/api/partner_api";
import { inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const activeNames = ref(['1', '3'])

const query_form = reactive({
    start_time: "",
    end_time: "",
});
// ------------------------------------------------------------------------------------------------------------页面初始化开始----------------------------------------------------------------------------------------------------

onMounted(() => {
    getMyPartnerInfo();
    query();
});

onBeforeUnmount(() => {


});

// ------------------------------------------------------------------------------------------------------------页面初始化结束----------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------日期组件开始----------------------------------------------------------------------------------------------------




const data_change = () => {
    query();
}


const start = new Date();
start.setHours(0, 0, 0, 0);
start.setDate(1);  // 设置为本月第一天
const end = new Date();
// 设置为下个月的第一天减去一毫秒，即本月的最后一天的23:59:59.999
end.setMonth(end.getMonth() + 1);
end.setDate(0);
end.setHours(23, 59, 59, 999);


const data_r = ref([start, end]);
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
        text: '本月',
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(1);  // 设置为本月第一天

            // 设置为下个月的第一天减去一毫秒，即本月的最后一天的23:59:59.999
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);

            return [start, end];
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

// 获取交易所信息
const my_partner_info = ref({})
const recommend_list = ref([])
const getMyPartnerInfo = async () => {
    try {
        const res = await api_获取我的交易合伙人信息();
        if (res.status === 200 && res.data.code === 200) {
            my_partner_info.value = res.data.data;
        } else {
            ElMessage({
                message: "获取我的交易合伙人信息失败：" + error,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "获取我的交易合伙人信息失败：" + error,
            type: "error"
        });
    }
}
const singleTableRef = ref(null)
const setCurrent = (row) => {
    singleTableRef.value.setCurrentRow(row)
}
const selected_partner_info = ref(null) // 被选中的策略

// 选择策略的处理函数
const handleSelectionChangeOuter = (selected) => {
    // console.log(selected);
    selected_partner_info.value = selected
}

//刷新时也保持展开状态
const expandedRowKeys = ref([])
const onExpandChange = (row, expanded) => {
    // console.log(row, expanded);
    expandedRowKeys.value = expanded.value
}

const getRowClass = (row, rowIndex) => {
    console.log(row.row.recommend_recommend_list == null, row);
    if (row.row.recommend_recommend_list == null || row.row.recommend_recommend_list.length == 0) {  //判断当前行是否有子数据或者根据实际情况设置
        return 'row-expand-cover'
    }
}
// ------------------------------------------------------------------------------------------------------------获取交易所信息结束----------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------按钮方法开始----------------------------------------------------------------------------------------------------



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
    if (data_r.value[0] === "" || data_r.value[1] === "") {
        ElMessage({
            message: "请选择日期范围",
            type: "error"
        });
        return;
    }
    const data = {
        "start_time": formatDateToISOStringWithoutTimeZone(data_r.value[0]),
        "end_time": formatDateToISOStringWithoutTimeZone(data_r.value[1]),
    }
    try {
        const res = await api_查询我的推荐人交易额明细(data);
        // console.log("api_查询我的推荐人交易额明细", res);
        if (res.status === 200 && res.data.code === 200) {
            recommend_list.value = res.data.data.partner_recommend_list;
            ElMessage({
                message: "查询我的推荐人交易额明细成功！",
                type: "success"
            });
        } else {
            ElMessage({
                message: "查询我的推荐人交易额明细失败：" + error,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "查询我的推荐人交易额明细失败：" + error,
            type: "error"
        });
    }
}

// ------------------------------------------------------------------------------------------------------------按钮方法结束----------------------------------------------------------------------------------------------------
</script>

<style lang="less" scoped>
:deep(.el-table .row-expand-cover .cell .el-table__expand-icon) {
    display: none;
}

.el-table .highlight-title {
    background-color: #406be4;
    color: rgb(255, 255, 255);
}
</style>
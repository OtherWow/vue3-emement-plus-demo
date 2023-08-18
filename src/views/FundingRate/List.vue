<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="addStrategy()">新增资金费率策略</el-button>
                </el-col>
                <el-col :span="12"></el-col>
                <!-- 居右-->
                <el-col :span="6" style="text-align: right;">
                    <el-button type="primary" @click="getStartegyList()" plain>刷新</el-button>
                </el-col>
            </el-row>

            <el-table :data="funding_rate_strategy_list" stripe style="width: 100%" :fit="false" border
                highlight-current-row>
                <el-table-column type="index" width="50" />
                <el-table-column prop="exchange_name" label="交易所账号名称" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="symbol" label="币种" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="position_value" label="仓位价值(USDT)" width="140" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="take_profit_percent" label="止盈百分比%" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="is_run" label="是否运行中" width="120" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">{{ row.is_run ? '是' : '否'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="funding_rate" label="资金费率%" width="120" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <el-tag type="success" effect="dark">{{ scope.row.funding_rate
                        }}</el-tag>
                    </template></el-table-column>
                <el-table-column prop="next_rate_time" label="倒计时" width="150" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="180" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="update_time" label="更新时间" width="180" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="380">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="startStrategy(row)" plain
                            :disabled="row.is_run">启动</el-button>
                        <el-button type="primary" size="small" @click="stopStrategy(row)" plain
                            :disabled="!row.is_run">停止</el-button>
                        <el-button type="primary" size="small" @click="editStrategy(row)" plain>编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteStrategy(row)"
                            :disabled="row.is_run">删除</el-button>
                        <el-button type="success" size="small" @click="showLog(row)"
                            :disabled="row.is_run">查看操作日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" :before-close="handleClose">
                <el-form label-position="top" :model="currentStartegy">
                    <el-form-item label="交易所账号">
                        <el-select v-model="exchange_info" clearable placeholder="请选择" style="width:100%" filterable
                            value-key="id" :disabled="editDisabled">
                            <el-option v-for="item in exchange_options" :key="item.id" :label="item.exchange_name"
                                :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="币种">
                        <el-select v-model="currentStartegy.symbol" clearable placeholder="请选择" style="width:100%"
                            filterable :disabled="editDisabled">
                            <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol"
                                :value="item.symbol" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仓位价值(USDT) ">
                        <el-input v-model="currentStartegy.position_value" :disabled="currentStartegy.is_run"></el-input>
                    </el-form-item>
                    <el-form-item label="止盈百分比%">
                        <el-input v-model="currentStartegy.take_profit_percent"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitStrategy">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog v-model="logDialogVisible" :title="dialogTitle" width="80%" :before-close="handleClose">
                <el-form label-position="top" :model="currentStartegy">
                    <el-form-item label="交易所账号">
                        <el-select v-model="exchange_info" clearable placeholder="请选择" style="width:100%" filterable
                            value-key="id" :disabled="editDisabled">
                            <el-option v-for="item in exchange_options" :key="item.id" :label="item.exchange_name"
                                :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="币种">
                        <el-select v-model="currentStartegy.symbol" clearable placeholder="请选择" style="width:100%"
                            filterable :disabled="editDisabled">
                            <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol"
                                :value="item.symbol" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仓位价值(USDT) ">
                        <el-input v-model="currentStartegy.position_value" :disabled="currentStartegy.is_run"></el-input>
                    </el-form-item>
                    <el-form-item label="止盈百分比%">
                        <el-input v-model="currentStartegy.take_profit_percent"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitStrategy">确定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import {
    api_获取资金费率策略列表,
    api_获取交易对列表,
    api_获取指定id的资金费率策略详情,
    api_启动指定id的资金费率策略,
    api_停止指定id的资金费率策略,
    api_删除指定id的资金费率策略,
    api_新增资金费率策略,
    api_更新指定id的资金费率策略
} from "@/api/funding_rate_strategy_api";
import { 查询当前用户的所有交易所信息 } from "@/api/exchange_infos_api";





const editDisabled = ref(false);
// 储存资金费率策略列表的数组
const funding_rate_strategy_list = ref([]);
// 控制对话框显示隐藏的变量
const dialogVisible = ref(false)
// 控制日志对话框的显示隐藏
const logDialogVisible = ref(false)
// 存储当前正在编辑的交易所信息
const currentStartegy = ref({
    exchange_id: "",
    exchange_name: "",
    symbol: "",
    position_value: 0,
    take_profit_percent: 0,
    is_run: false,
    id: null
});
const dialogTitle = ref("新增资金费率策略");
const exchange_options = ref([]);
const symbol_options = ref([]);
const exchange_info = ref({
    "id": "",
    "exchange_name": ""
});
const handleClose = (done) => {
    dialogVisible.value = false;
    logDialogVisible.value = false;
    done();
};

let intervalId = ref(null);
// 当组件挂载时获取交易所信息
onMounted(() => {
    getExchangeInfoList();
    getSymbolList();
    getStartegyList();
    // intervalId.value = setInterval(() => {
    //     if (dialogVisible.value) {
    //         return;
    //     }
    //     getStartegyList();
    // }, 3000); // Run this every second
});
// onBeforeUnmount(() => {
//     clearInterval(intervalId.value);
// });

// 获取交易所信息
async function getExchangeInfoList() {
    try {
        const res = await 查询当前用户的所有交易所信息();
        // console.log("res", res);
        if (res.status === 200) {
            // console.log(res.data.data);
            exchange_options.value = res.data.data;
        }
    } catch (error) {
        ElMessage({
            message: "查询当前用户的所有交易所信息失败：" + error,
            type: "error"
        });
    }
}

// 获取交易对信息
async function getSymbolList() {
    try {
        const res = await api_获取交易对列表();
        // console.log("res", res);
        if (res.status === 200) {
            // console.log(res.data.data);
            symbol_options.value = res.data.data;
        }
    } catch (error) {
        ElMessage({
            message: "查询交易对列表失败：" + error,
            type: "error"
        });
    }
}


// 获取策略信息
async function getStartegyList() {
    try {
        const res = await api_获取资金费率策略列表();
        // console.log("res", res);
        if (res.status === 200) {
            // console.log(res.data.data);
            funding_rate_strategy_list.value = res.data.data;

        }
    } catch (error) {
        ElMessage({
            message: "查询资金费率策略列表失败：" + error,
            type: "error"
        });
    }
}

// 新增或编辑交易所信息
async function submitStrategy() {
    console.log(exchange_info.value);
    currentStartegy.value.exchange_id = exchange_info.value.id;
    currentStartegy.value.exchange_name = exchange_info.value.exchange_name;

    console.log(currentStartegy.value);
    if (currentStartegy.value.id) {
        // 如果有id，代表是编辑操作
        try {
            const res = await api_更新指定id的资金费率策略(currentStartegy.value.id, currentStartegy.value);
            if (res.status === 200 && res.data.code === 200) {
                dialogVisible.value = false;
                ElMessage({
                    message: "更新成功!",
                    type: "success"
                });
                getStartegyList();
            } else {
                ElMessage({
                    message: "更新资金费率策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "更新资金费率策略失败：" + error,
                type: "error"
            });
        }
    } else {
        // 如果没有id，代表是新增操作
        try {
            const res = await api_新增资金费率策略(currentStartegy.value);
            if (res.status === 200 && res.data.code === 200) {
                dialogVisible.value = false;
                ElMessage({
                    message: "新增成功!",
                    type: "success"
                });
                getStartegyList();
            } else {
                ElMessage({
                    message: "新增资金费率策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "新增资金费率策略失败：" + error,
                type: "error"
            });
        }

    }
}

// 删除交易所信息
async function deleteStrategy(item) {
    // 弹出确认框
    const confirm = await ElMessageBox.confirm("此操作将永久删除该资金费率策略, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).catch(() => { });
    if (!confirm) {
        return;
    }
    try {
        const res = await api_删除指定id的资金费率策略(item.id);
        if (res.status === 200 && res.data.code === 200) {
            getStartegyList();
            ElMessage({
                message: "删除成功!",
                type: "success"
            });
        } else {
            ElMessage({
                message: "删除资金费率策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "删除资金费率策略失败：" + error,
            type: "error"
        });

    }
}

// 启动交易所信息
async function startStrategy(item) {
    // 弹出确认框
    const confirm = await ElMessageBox.confirm("此操作将开启该资金费率策略, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).catch(() => { });
    if (!confirm) {
        return;
    }
    try {
        const res = await api_启动指定id的资金费率策略(item.id);
        if (res.status === 200 && res.data.code === 200) {
            getStartegyList();
            ElMessage({
                message: "启动成功!",
                type: "success"
            });
        } else {
            ElMessage({
                message: "启动资金费率策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "启动资金费率策略失败：" + error,
            type: "error"
        });

    }
}

// 停止交易所信息
async function stopStrategy(item) {
    // 弹出确认框
    const confirm = await ElMessageBox.confirm("此操作将停止运行中的资金费率策略, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).catch(() => { });
    if (!confirm) {
        return;
    }
    try {
        const res = await api_停止指定id的资金费率策略(item.id);
        if (res.status === 200 && res.data.code === 200) {
            getStartegyList();
            ElMessage({
                message: "停止成功!",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止资金费率策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止资金费率策略失败：" + error,
            type: "error"
        });

    }
}

// 新增资金费率策略
function addStrategy() {
    dialogTitle.value = "新增资金费率策略";
    // 清空currentStartegy
    currentStartegy.value = {
        exchange_id: "",
        exchange_name: "",
        symbol: "",
        position_value: 0,
        take_profit_percent: 0,
        is_run: false,
        id: null
    };
    exchange_info.value = {
        "id": "",
        "exchange_name": ""
    };
    dialogVisible.value = true;
    editDisabled.value = false;
}


// 编辑资金费率策略
function editStrategy(item) {
    dialogTitle.value = "更新资金费率策略";
    currentStartegy.value = item;
    exchange_info.value.id = item.exchange_id;
    // 需要先判断exchange_options是否为空 然后通过exchange_options找到对应的交易所名称 
    const currentExchange = exchange_options.value.find((exchange) => {
        return exchange.id === item.exchange_id;
    });
    exchange_info.value.exchange_name = currentExchange.exchange_name;
    console.log(exchange_info)
    // exchange_info.value.exchange_name = item.exchange_name;
    dialogVisible.value = true;
    editDisabled.value = true;
}

function showLog(item) {
    dialogTitle.value = "查看操作日志";
    logDialogVisible.value = true;

}

// 设为主账号
async function setMainAccount(exchange) {
    try {
        await 设置主账号(exchange);
    } catch (error) {
        ElMessage({
            message: "设置主账号失败：" + error.response.data.detail,
            type: "error"
        });
    }
    getStartegyList();
}

</script>

<style lang="scss" scoped></style>

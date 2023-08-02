<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="dialogVisible = true">新增交易所账号</el-button>
                </el-col>
            </el-row>

            <el-table :data="exchange_infos_list">
                <el-table-column prop="exchange_name" label="交易所账号名称"></el-table-column>
                <el-table-column prop="exchange_api_key" label="api_key"></el-table-column>
                <el-table-column prop="exchange_api_secret" label="api_secret"></el-table-column>
                <el-table-column prop="is_main" label="是否主账号" width="120">
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
                </el-table-column>
            </el-table>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" :before-close="handleClose">
                <el-form label-position="top" :model="currentExchange">
                    <el-form-item label="交易所账号备注">
                        <el-input v-model="currentExchange.exchange_name"></el-input>
                    </el-form-item>
                    <el-form-item label="API Key">
                        <el-input v-model="currentExchange.exchange_api_key"></el-input>
                    </el-form-item>
                    <el-form-item label="API Secret">
                        <el-input v-model="currentExchange.exchange_api_secret"></el-input>
                    </el-form-item>
                    <el-form-item label="是否主账号">
                        <el-switch v-model="currentExchange.is_main"></el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitExchange">确定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
    查询当前用户的所有交易所信息,
    新增当前用户的交易所信息,
    删除当前用户的指定的交易所信息,
    更新当前用户的指定的交易所信息,
    设置主账号
} from "@/api/exchange_infos_api";

// 储存交易所信息的数组
const exchange_infos_list = ref([]);
// 控制对话框显示隐藏的变量
const dialogVisible = ref(false)
// 存储当前正在编辑的交易所信息
const currentExchange = ref({
    exchange_name: "",
    exchange_api_key: "",
    exchange_api_secret: "",
    is_main: false,
    id: null
});
const dialogTitle = ref("新增交易所账号");

// 当组件挂载时获取交易所信息
onMounted(() => {
    getExchangeInfos();
});

// 获取交易所信息
async function getExchangeInfos() {
    try {
        const res = await 查询当前用户的所有交易所信息();
        if (res.status === 200) {
            console.log(res.data.data);
            exchange_infos_list.value = res.data.data;
        }
    } catch (error) {
        ElMessage({
            message: "查询交易所信息失败：" + error.response.data.detail,
            type: "error"
        });
    }
}

// 新增或编辑交易所信息
async function submitExchange() {
    console.log(currentExchange.value);
    if (currentExchange.value.id) {
        // 如果有id，代表是编辑操作
        dialogTitle.value = "编辑交易所账号";
        try {
            const res = await 更新当前用户的指定的交易所信息(currentExchange.value);
            if (res.status === 200) {
                getExchangeInfos();
                dialogVisible.value = false;
            }
        } catch (error) {
            ElMessage({
                message: "修改交易所信息失败：" + error.response.data.detail,
                type: "error"
            });
        }
    } else {
        // 如果没有id，代表是新增操作
        dialogTitle.value = "新增交易所账号";
        try {
            const res = await 新增当前用户的交易所信息(currentExchange.value);
            if (res.status === 201) {
                getExchangeInfos();
                dialogVisible.value = false;
            }
        } catch (error) {
            ElMessage({
                message: "新增交易所信息失败：" + error.response.data.detail,
                type: "error"
            });
        }

    }
}

// 删除交易所信息
async function deleteExchange(exchange) {
    // 弹出确认框
    const confirm = await ElMessageBox.confirm("此操作将永久删除该交易所账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).catch(() => { });
    if (!confirm) {
        return;
    }
    try {
        const res = await 删除当前用户的指定的交易所信息(exchange.id);
        if (res.status === 200) {
            getExchangeInfos();
        }
    } catch (error) {
        ElMessage({
            message: "删除交易所信息失败：" + error.response.data.detail,
            type: "error"
        });
    }
}

// 编辑交易所信息
function editExchange(exchange) {
    dialogTitle.value = "编辑交易所账号";
    currentExchange.value = exchange;
    dialogVisible.value = true;
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
    getExchangeInfos();
}

</script>

<style lang="scss" scoped></style>

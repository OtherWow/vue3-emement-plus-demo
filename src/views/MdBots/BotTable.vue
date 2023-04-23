<!-- frontend/src/components/BotTable.vue -->
<template>
    <div>
        <el-table :data="bots" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="180"></el-table-column>
            <el-table-column prop="symbol" label="交易对" width="120"></el-table-column>
            <el-table-column prop="base_order_size" label="基础订单大小" width="150"></el-table-column>
            <el-table-column prop="safety_order_size" label="安全订单大小" width="150"></el-table-column>
            <el-table-column prop="leverage" label="杠杆" width="120"></el-table-column>
            <el-table-column prop="max_orders" label="最大订单数" width="120"></el-table-column>
            <el-table-column prop="is_running" label="运行中?" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.is_running ? 'success' : 'danger'">{{ row.is_running ? '是' : '否' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="$emit('start', row)">启动</el-button>
                    <el-button type="warning" size="small" @click="$emit('stop', row)">停止</el-button>
                    <el-button type="info" size="small" @click="$emit('edit', row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="$emit('delete', row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ['bots']
}
</script>
<style scoped>
.el-tag {
    font-size: 12px;
}

.el-button {
    font-size: 12px;
    margin-right: 8px;
}
</style>

<template>
    <div>
        <h1>创建机器人</h1>

        <el-form label-width="120px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="交易对">
                        <el-input v-model="form.symbol"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="基础订单大小">
                        <el-input v-model="form.base_order_size"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="安全订单大小">
                        <el-input v-model="form.safety_order_size"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="杠杆">
                        <el-input v-model="form.leverage"></el-input>
                    </el-form-item></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="最大订单数量">
                        <el-input v-model="form.max_orders"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>



            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import { ref, watch, inject } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

export default {

    setup() {
        const store = inject('$store');
        const form = ref({
            symbol: '',
            base_order_size: '',
            safety_order_size: '',
            leverage: '',
            max_orders: ''
        })

        const route = useRoute();
        const router = useRouter();
        watch(route, (to, from) => {
            if (to.path === '/md_bots/list') {
                ctx.$emit('remove-tab', 'create_bot');
            }
        });
        const submitForm = async () => {
            console.log('表单数据：', form.value)

            try {
                const response = await axios.post('http://43.156.110.163:8000/md_bots/bot', form.value)
                console.log('创建成功：', response.data)
                // 弹出提示创建成功，然后返回到列表
                ElMessage.success('创建成功')
                router.push('/md_bots/list')
                store.openTabs = store.openTabs.filter((tab) => tab !== 'md_bots/create_bot');

            } catch (error) {
                console.error('创建失败：', error)
            }
        }

        return {
            form,
            submitForm
        }
    }
}
</script>
<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>
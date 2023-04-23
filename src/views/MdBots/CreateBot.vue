<template>
    <div>
        <h1 v-if="!editMode">创建机器人</h1>
        <h1 v-if="editMode">编辑机器人</h1>

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
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="最大订单数量">
                        <el-input v-model="form.max_orders"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 如果处于编辑模式，显示机器人 ID -->
            <el-row v-if="editMode" :gutter="20">
                <el-col :span="12">
                    <el-form-item label="机器人 ID">
                        <el-input :value="botId" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item>
                <el-button type="primary" @click="submitForm">
                    {{ editMode ? '保存' : '提交' }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import { ref, watch, inject, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

export default {
    props: {
        editMode: {
            type: Boolean,
            default: false,
        },
        botId: {
            type: String,
            default: '',
        },
    },
    setup(props, { emit }) {
        const global = inject('$global');

        const form = ref({
            symbol: '',
            base_order_size: '',
            safety_order_size: '',
            leverage: '',
            max_orders: '',
        });

        const route = useRoute();
        const router = useRouter();

        const { editMode, botId } = props;

        onMounted(async () => {
            if (editMode && botId) {
                try {
                    const response = await axios.get(
                        `http://43.156.110.163:8000/md_bots/bot/${botId}`,
                    );
                    form.value = response.data;
                } catch (error) {
                    console.error('获取机器人数据失败：', error);
                }
            }
        });

        watch(route, (to, from) => {
            if (to.path === '/md_bots/list') {
                emit('remove-tab', editMode ? 'edit_bot' : 'create_bot');
            }
        });

        const submitForm = async () => {
            console.log('表单数据：', form.value);

            try {
                let response;
                if (editMode && botId) {
                    response = await axios.put(
                        `http://43.156.110.163:8000/md_bots/update_bot/${botId}`,
                        form.value,
                    );
                    console.log('更新成功：', response.data);
                    ElMessage.success('更新成功');
                } else {
                    response = await axios.post(
                        'http://43.156.110.163:8000/md_bots/add_bot',
                        form.value,
                    );
                    console.log('创建成功：', response.data);
                    ElMessage.success('创建成功');
                }

                emit('add-tab', {
                    meta: {
                        title: '马丁机器人列表',
                    },
                    path: '/md_bots/list',
                })
                emit('remove-tab', editMode ? '/md_bots/edit_bot/${botId}' : '/md_bots/create_bot');
            } catch (error) {
                console.error(editMode ? '更新失败：' : '创建失败：', error);
            }
        };

        return {
            form,
            submitForm,
        };
    },
};
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


<template >
    <div class="common-layout">
        <el-container>
            <el-main style="padding-right: 15px;">
                <div>
                    <h1 v-if="!editMode" style="margin-bottom: 30px;">创建机器人</h1>
                    <h1 v-if="editMode">编辑机器人</h1>

                    <el-form label-width="120px">

                        <el-card class="box-card">
                            <template #header>
                                <div class="card-header">
                                    <span>主设置</span>

                                </div>
                            </template><el-row :gutter="20">
                                <el-col :span="22">
                                    <el-form-item label="机器人名称">
                                        <el-input v-model="form.safety_order_size"></el-input>
                                    </el-form-item></el-col></el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="交易类型">
                                        <el-select v-model="tread_type_value" class="m-2" placeholder="Select" clearable>
                                            <el-option v-for="item in tread_type_options" :key="item.value"
                                                :label="item.label" :value="item.value" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <el-form-item label="交易对">
                                        <el-select v-model="pairs_value" filterable placeholder="Select">
                                            <el-option v-for="item in pairs_options" :key="item.value" :label="item.label"
                                                :value="item.value" />
                                        </el-select>
                                        <el-button type="primary" v-loading-button="获取最新交易对">获取最新交易对</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-card>


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


            </el-main>
            <el-aside width="550px" style="margin-top: 66px;padding: 20px;padding-left: 15px;">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" class="demo-tabs" style="margin-top: 10px;">
                        <el-tab-pane label="账户详情" name="first"><span style="font-size: 40px;">账户详情</span>asdsa</el-tab-pane>
                        <el-tab-pane label="图表" name="second">Config</el-tab-pane>
                        <el-tab-pane label="表格" name="third">Role</el-tab-pane>
                    </el-tabs>

                </el-card></el-aside>
        </el-container>
    </div>
</template>
  
<script>
import { ref, watch, inject, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { api_get_md_bot, api_add_md_bot, api_update_md_bot } from '@/api/md_bots';
import { api_获取所有交易对 } from '@/api/binance_api'
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
        const activeName = ref('first') //默认激活账户详情
        const tread_type_value = ref('1') //交易类型
        const tread_type_options = [
            {
                value: '1',
                label: '现货马丁',
            },
            {
                value: '2',
                label: '合约马丁',
            }
        ]

        const pairs_value = ref('1') //交易对
        let pairs_options = ref([])

        const 获取最新交易对 = () => {
            api_获取所有交易对(false).then(response => {
                // console.log(response.data)
                pairs_options.value = response.data;
            })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        }
        获取最新交易对()
        const form = ref({
            symbol: '',
            base_order_size: '',
            safety_order_size: '',
            leverage: '',
            max_orders: '',
        });

        const route = useRoute();

        const { editMode, botId } = props;

        onMounted(async () => {
            if (editMode && botId) {
                try {
                    const response = await api_get_md_bot(botId);
                    form.value = response.data;
                } catch (error) {
                    console.error('获取机器人数据失败：', error);
                }
            }
        });



        const submitForm = async () => {
            console.log('表单数据：', form.value);

            try {
                let response;
                if (editMode && botId) {
                    response = await api_update_md_bot(botId, form.value);
                    console.log('更新成功：', response.data);
                    ElMessage.success('更新成功');
                } else {
                    response = api_add_md_bot(form.value);
                    console.log('创建成功：', response.data);
                    ElMessage.success('创建成功');
                }
                // console.log("触发createBot的add-tab事件")
                emit('add-tab', {
                    meta: {
                        title: '马丁机器人列表',
                    },
                    path: '/md_bots/list',
                })
                // console.log("触发createBot的remove-tab事件")
                emit('remove-tab', editMode ? '/md_bots/edit_bot/${botId}' : '/md_bots/create_bot');
            } catch (error) {
                console.error(editMode ? '更新失败：' : '创建失败：', error);
            }
        };

        return {
            form,
            submitForm,
            tread_type_value,
            tread_type_options,
            pairs_value,
            pairs_options,
            activeName,
            获取最新交易对
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

.el-card {
    --el-card-border-radius: 8px;
    --el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.5);


}

/deep/ .el-tabs__item {
    padding-bottom: 20px;
    font-size: 16px;
}
</style>


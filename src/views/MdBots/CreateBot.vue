<template >
    <div class="common-layout">
        <el-container>
            <el-main style="padding-right: 15px;">
                <div>
                    <h1 v-if="!editMode" style="margin-bottom: 30px;"> 创建马丁机器人</h1>
                    <h1 v-if="editMode">编辑马丁机器人</h1>

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
                                <el-col :span="7">
                                    <el-form-item label="交易类型">
                                        <el-select v-model="tread_type_value" class="m-2" placeholder="Select" clearable
                                            style="width: 100%">
                                            <el-option v-for="item in tread_type_options" :key="item.value"
                                                :label="item.label" :value="item.value" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="交易对">
                                        <el-select v-model="pairs_value" filterable placeholder="Select" clearable
                                            style="width: 100%">
                                            <el-option v-for="item in pairs_options" :key="item.value" :label="item.label"
                                                :value="item.value"
                                                style="display: flex;text-align: center;align-items: center;">
                                                <img :src="getIconUrl(item)"
                                                    style="width: 20px;height: 20px; margin-right: 10px;" />
                                                {{ item.label }}


                                            </el-option>
                                        </el-select>


                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <loading-button :action="获取最新交易对">获取最新交易对</loading-button>
                                </el-col>
                            </el-row>
                        </el-card>


                        <el-card class="box-card" style="margin-top: 30px;">
                            <template #header>
                                <div class="card-header">
                                    <span>策略</span>

                                </div>
                            </template><el-row :gutter="20">
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">交易方向 (现货马丁只能做多)</el-row>
                                    <el-radio-group v-model="radio_Strategy" class="my-radio-group">
                                        <el-radio-button label="做多" class="my-radio-50" name="radio_short" />
                                        <el-radio-button label="做空" class="my-radio-50" name="radio_long" />
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单类型</el-row>
                                    <el-radio-group v-model="radio_fisrt_order_type" class="my-radio-group">
                                        <el-radio-button label="市价单" class="my-radio-50" />
                                        <el-radio-button label="限价单" class="my-radio-50" />
                                    </el-radio-group>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-card>


                        <el-card class="box-card" style="margin-top: 30px;">
                            <template #header>
                                <div class="card-header">
                                    <span>止盈止损</span>

                                </div>
                            </template><el-row :gutter="20">
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">止盈条件</el-row>
                                    <el-radio-group v-model="radio_Strategy" class="my-radio-group">
                                        <el-radio-button label="做多" class="my-radio-50" name="radio_short" />
                                        <el-radio-button label="做空" class="my-radio-50" name="radio_long" />
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">止损条件</el-row>
                                    <el-radio-group v-model="radio_fisrt_order_type" class="my-radio-group">
                                        <el-radio-button label="市价单" class="my-radio-50" />
                                        <el-radio-button label="限价单" class="my-radio-50" />
                                    </el-radio-group>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-card>

                        <el-card class="box-card" style="margin-top: 30px;">
                            <template #header>
                                <div class="card-header">
                                    <span>交易启动条件</span>

                                </div>
                            </template><el-row :gutter="20">
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">交易方向 (现货马丁只能做多)</el-row>
                                    <el-radio-group v-model="radio_Strategy" class="my-radio-group">
                                        <el-radio-button label="做多" class="my-radio-50" name="radio_short" />
                                        <el-radio-button label="做空" class="my-radio-50" name="radio_long" />
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单类型</el-row>
                                    <el-radio-group v-model="radio_fisrt_order_type" class="my-radio-group">
                                        <el-radio-button label="市价单" class="my-radio-50" />
                                        <el-radio-button label="限价单" class="my-radio-50" />
                                    </el-radio-group>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="7">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">首单下单金额</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="12">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">补单方式</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-row style="font-size: 10px;margin-bottom: 5px;">倍数补单</el-row>
                                    <el-input v-model="input2" placeholder="20">
                                        <template #append>USDT</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-row :gutter="20" style="margin-top: 30px;">
                            <el-col :span="24">
                                <loading-button size="large" :action="submitForm" class="my-button">
                                    {{ editMode ? '保存' : '提交' }}
                                </loading-button>
                            </el-col>

                        </el-row>

                    </el-form>
                </div>


            </el-main>
            <el-aside width="550px" style="margin-top: 66px;padding: 20px;padding-left: 15px;">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" class="demo-tabs" style="margin-top: 10px;">
                        <el-tab-pane label="账户详情" name="first">
                            <!-- <el-descriptions :column=2>
                                <el-descriptions-item label="余额" align="left">
                                </el-descriptions-item>
                                <el-descriptions-item label="" align="right">
                                    <el-tag size="large">1111111111111111</el-tag></el-descriptions-item>
                                <el-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou,
                                    Jiangsu
                                    Province</el-descriptions-item>
                            </el-descriptions> -->
                            <el-descriptions :column=1 style="margin-bottom:0;padding:0;">
                                <el-descriptions-item label="现货" align="center"><el-tag size="large">{{ user_spot_total_usdt
                                }}</el-tag>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-table :data="user_spot_info_table_data" style="width: 100%">
                                <el-table-column label="资产" width="80" align="center">
                                    <template #default="scope">
                                        <div style="display: flex; align-items: center">
                                            <span style="margin-left: 10px">{{ scope.row.asset }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="余额" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.free }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="冻结" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.locked }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总价值(U)" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.usdtValuation }}</el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>



                            <el-descriptions :column=1 style="margin-top:30px;">
                                <el-descriptions-item label="U本位合约" align="center"><el-tag size="large">{{
                                    user_perp_total_usdt }}</el-tag>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-table :data="user_perp_info_table_data" style="width: 100%">
                                <el-table-column label="资产" align="center">
                                    <template #default="scope">
                                        <div style="display: flex; align-items: center">
                                            <span style="margin-left: 10px">{{ scope.row.asset }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="钱包余额" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.walletBalance }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="未实现盈亏" align="center">
                                    <template #default="scope">
                                        <el-tag :type="scope.row.type" size="large">{{ scope.row.unrealizedProfit
                                        }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="已用保证金" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.initialMargin }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="可用保证金" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.availableBalance }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="保证金余额" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.marginBalance }}</el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>




                        </el-tab-pane>
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
import { api_获取所有交易对, api_获取用户持仓 } from '@/api/binance_api'
import { fapi_获取用户持仓 } from '@/api/binance_fapi'
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
        const radio_Strategy = ref('做多') //默认做空
        const radio_fisrt_order_type = ref('市价单') //默认市价单
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

        const 获取最新交易对 = (use_cache = true) => {
            return api_获取所有交易对(use_cache)
                .then((response) => {
                    pairs_options.value = response.data;
                    pairs_value.value = response.data[0].value
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };

        // 现货获取用户持仓表格数据
        const user_spot_total_usdt = ref(0)
        const user_spot_info_table_data = ref([])
        const 现货获取用户持仓 = () => {
            return api_获取用户持仓()
                .then((response) => {
                    console.log(response.data)
                    user_spot_info_table_data.value = response.data
                    // 遍历user_spot_info_table_data.value,统计usdtValuation
                    user_spot_total_usdt.value = 0
                    user_spot_info_table_data.value.forEach((item) => {
                        user_spot_total_usdt.value += item.usdtValuation
                    })

                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        现货获取用户持仓()

        //合约获取用户资金表格数据
        const user_perp_total_usdt = ref(0)
        const user_perp_info_table_data = ref([])
        const 合约获取用户持仓 = () => {
            return fapi_获取用户持仓()
                .then((response) => {
                    console.log(response.data)
                    user_perp_info_table_data.value = response.data
                    // 遍历user_perp_info_table_data.value,如果unrealizedProfit>0,则type=success,=0为'',否则type=danger
                    user_perp_total_usdt.value = 0
                    user_perp_info_table_data.value.forEach((item) => {
                        user_perp_total_usdt.value += item.marginBalance
                        if (item.unrealizedProfit > 0) {
                            item.type = 'success'
                        } else if (item.unrealizedProfit == 0) {
                            item.type = ''
                        } else {
                            item.type = 'danger'
                        }
                    })
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        合约获取用户持仓()


        const getIconUrl = (item) => {
            // 提取货币符号（例如，从 'BTCUSDT' 中提取 'BTC'）
            const symbol = item.label.slice(0, -5);
            if (symbol == 'USDSB') {
                return 'https://app.3commas.io/currency/icon/BTC';
            }
            // 使用 Cryptoicons 生成图标 URL
            const iconUrl = `https://app.3commas.io/currency/icon/${symbol}`;
            return iconUrl;
        };
        获取最新交易对(false)
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
            获取最新交易对,
            getIconUrl,
            radio_Strategy,
            radio_fisrt_order_type,
            user_spot_info_table_data,
            user_perp_info_table_data,
            user_spot_total_usdt,
            user_perp_total_usdt
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

.my-button {
    //设置圆角跟阴影
    border-radius: 8px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.5);
    width: 100%;
    margin: 0
}

:deep(.el-tabs__item) {
    padding-bottom: 20px;
    font-size: 16px;
}

:deep(.el-descriptions__label) {
    font-size: 16px;
    font-weight: bolder;
    // 修改字体为黑体
    font-family: "Microsoft YaHei";
    color: rgb(192, 199, 204)
}

.my-radio-group {
    width: 100%;
}

.my-radio-50 {
    width: 50%;

    :deep(.el-radio-button__inner) {
        width: 100%;
    }
}
</style>


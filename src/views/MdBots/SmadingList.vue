<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                    <el-button type="primary" @click="addStrategy()">新增策略</el-button>
                    <el-button type="primary" @click="copyStrategy()">复制选中策略</el-button>
                    <el-button type="primary" @click="copySymbolsInfo()">复制币种信息</el-button>
                </el-col>
                <el-col :span="12"></el-col>
                <!-- 居右-->
                <el-col :span="6" style="text-align: right;">
                    <el-button type="primary" @click="getStartegyList()">刷新</el-button>
                </el-col>
            </el-row>
            <el-table ref='singleTableRef' :data="smading_strategy_list" style="width: 100%" :fit="false" border
                highlight-current-row @current-change="handleSelectionChangeOuter" @expand-change="onExpandChange"
                :expand-row-keys="expandedRowKeys" row-key="id">

                <el-table-column type="expand">
                    <template #default="props">
                        <el-row :gutter="20" style="margin-left: 60px; margin-top: 5px;">
                            <el-button type="primary" size="small" @click="selectStartSymbolStrategy(props.row)"
                                effect="dark">选中启动</el-button>
                            <el-button type="primary" size="small" @click="selectStopSymbolStrategy(props.row)"
                                effect="dark">选中停止</el-button>
                            <el-button type="danger" size="small" @click="selectDeleteSymbolStrategy(props.row)"
                                effect="dark">选中删除</el-button>
                        </el-row>
                        <el-table :data="props.row.symbol_infos" style="margin-left: 50px;width:80%"
                            @selection-change="(selectedRows) => handleSelectionChangeInner(selectedRows, props.row.id)">
                            <el-table-column type="selection" width="55" />
                            <el-table-column type="index" width="55" label="序号" align="center" />
                            <el-table-column label="交易对" prop="symbol" align="center" />
                            <el-table-column label="交易对精度" prop="symbol_price_precision" align="center" />
                            <el-table-column label="运行中" width="90" show-overflow-tooltip align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">{{ row
                                        .is_run ? '是' :
                                        '否'
                                    }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="380" align="center">
                                <template #default="{ row }">
                                    <el-button type="primary" size="small" @click="startSymbolStrategy(row)" plain
                                        :disabled="row.is_run">启动</el-button>
                                    <el-button type="primary" size="small" @click="stopSymbolStrategy(row)" plain
                                        :disabled="!row.is_run">停止</el-button>
                                    <el-button type="danger" size="small" @click="deleteSymbolStrategy(row)"
                                        :disabled="row.is_run">删除</el-button>
                                    <el-button type="success" size="small" @click="showLog(row)"
                                        :disabled="row.is_run">查看操作日志</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55" label="序号" align="center" />
                <el-table-column prop="exchange_name" label="交易所账号名称" width="150" show-overflow-tooltip sortable
                    align="center"></el-table-column>
                <el-table-column prop="strategy_note" label="策略备注" width="150" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column label="运行中" width="90" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">{{ row
                            .is_run ? '是' :
                            '否'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="symbol_num" label="交易对数量" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="run_num" label="运行中数量" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column label="持仓情况" width="90" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTagType(row.position_side)" effect="dark">{{ getTagLabel(row.position_side)
                        }}</el-tag>
                    </template>
                </el-table-column>


                <el-table-column prop="pos_value_1st" label="首单价值" width="85" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="cover_order_pos_value_1st" label="补单首单" width="85" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="all_cover_order_count" label="补单次数" width="85" show-overflow-tooltip
                    align="center"></el-table-column>



                <el-table-column label="对冲马丁" width="90" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_hedge_mading ? 'success' : 'danger'">{{ row.open_hedge_mading ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="对冲触发后停止补单" width="160" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_tigger_hedge_mading_stop_cover ? 'success' : 'danger'">{{
                            row.open_tigger_hedge_mading_stop_cover ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="止盈" width="80" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_take_profit ? 'success' : 'danger'">{{
                            row.open_take_profit ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="浮动止盈" width="90" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_float_take_profit ? 'success' : 'danger'">{{
                            row.open_float_take_profit ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="浮动止盈回撤" width="110" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_float_take_profit_back ? 'success' : 'danger'">{{
                            row.open_float_take_profit_back ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="止损" width="80" show-overflow-tooltip align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.open_stop_profit ? 'success' : 'danger'">{{
                            row.open_stop_profit ? '开启' :
                            '关闭'
                        }}</el-tag>
                    </template>
                </el-table-column>


                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template #default="{ row }">

                        <el-button type="primary" size="small" @click="editStrategy(row)" plain>编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteStrategy(row)"
                            :disabled="row.is_run">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="65%" :before-close="handleClose"
                :close-on-click-modal="false">
                <el-form :model="currentStrategy" label-width="150px">
                    <div class="dialog-content">
                        <el-card class="box-card"
                            style="margin-bottom: 20px;margin-right: 20px;margin-left: 20px;margin-top: 20px;">
                            <template #header>
                                <div class="card-header">
                                    <span>马丁策略基础设置</span>
                                </div>
                            </template>
                            <el-form-item label="策略名称(备注)" required>
                                <el-input v-model="currentStrategy.strategy_note" autosize type="textarea"
                                    placeholder="请输入策略的名称或者备注用于区分" />
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交易所账号" required>
                                        <el-select v-model="exchange_info" clearable placeholder="请选择" style="width:100%"
                                            filterable value-key="id" :disabled="currentStrategy.is_run">
                                            <el-option v-for="item in exchange_options" :key="item.id"
                                                :label="item.exchange_name" :value="item" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="18">
                                    <div>
                                        <el-form-item label="主马丁持仓方向" required>
                                            <el-radio-group v-model="currentStrategy.position_side" class="my-radio-group"
                                                :disabled="currentStrategy.is_run">
                                                <el-radio-button :label="'LONG'" class="my-radio-33">
                                                    <template #default>做多</template>
                                                </el-radio-button>
                                                <el-radio-button :label="'SHORT'" class="my-radio-33">
                                                    <template #default>做空</template>
                                                </el-radio-button>
                                                <el-radio-button :label="'BOTH'" class="my-radio-33">
                                                    <template #default>双向</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="6">

                                </el-col>
                            </el-row>
                            <!-- 交易对的多选框 -->
                            <el-form-item label="币种" required>
                                <el-select v-model="currentStrategy.symbols" @change="updateSymbolPrecisionFields" clearable
                                    placeholder="请选择" style="width:100%" multiple filterable>
                                    <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol"
                                        :value="item.symbol" />
                                </el-select>
                            </el-form-item>

                            <!-- 动态的交易对精度编辑框 -->
                            <el-row v-for="(precision, symbol) in symbol_precisions" :key="symbol" :gutter="20">
                                <el-col :span="13">
                                    <el-form-item :label="`${symbol} 价格精度`" required label-width="300px">
                                        <el-input v-model.number="symbol_precisions[symbol]"
                                            placeholder="比如14.0125就填4，代表4位数" style="min-width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>


                        </el-card>

                        <el-card class="box-card" style="margin-right: 20px;margin-left: 20px;"
                            :disabled="currentStrategy.is_run">
                            <template #header>
                                <div class="card-header">
                                    <span>下单设置</span>
                                </div>
                            </template>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="首单价值" required>
                                        <el-input type="number" :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.pos_value_1st"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="补单首单价值" required>
                                        <el-input type="number" :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.cover_order_pos_value_1st"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="补单次数" required>
                                        <el-input :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.all_cover_order_count"><template
                                                #append>次</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="补单波动" required>
                                        <el-input :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.price_pct_trigger_cover" type="number"><template
                                                #append>%</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="补单倍数" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.cover_value_mult"><template
                                                #append>倍</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="加速补单百分比" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.accel_cover_pct"
                                            placeholder="正数加快补单负数放慢补单"><template #append>%</template></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                        </el-card>
                        <el-card class="box-card"
                            style="margin-top: 20px;margin-bottom: 20px;margin-right: 20px;margin-left: 20px;">
                            <template #header>
                                <div class="card-header">
                                    <span>对冲马丁设置</span>
                                </div>
                            </template>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="对冲马丁" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_hedge_mading" class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>

                                </el-col>
                                <el-col :span="12">


                                </el-col>

                            </el-row>
                            <el-row :gutter="20" v-if="currentStrategy.open_hedge_mading">
                                <el-col :span="12">

                                    <el-form-item label="对冲马丁第几单触发" required>
                                        <el-input :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.tigger_hedge_mading_num"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="对冲马丁首单价值" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.hedge_mading_pos_value_1st"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" v-if="currentStrategy.open_hedge_mading">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="对冲触发后停止补单" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_tigger_hedge_mading_stop_cover"
                                                class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>

                                </el-col>
                                <el-col :span="12">


                                </el-col>

                            </el-row>
                            <el-row :gutter="20"
                                v-if="currentStrategy.open_hedge_mading && !currentStrategy.open_tigger_hedge_mading_stop_cover">
                                <el-col :span="12">
                                    <el-form-item label="对冲马丁第几单补单" required>
                                        <el-input :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.tigger_hedge_mading_cover_num"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="补单首单价值" required>
                                        <el-input type="number" :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.hedge_mading_cover_pos_value_1st"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20"
                                v-if="currentStrategy.open_hedge_mading && !currentStrategy.open_tigger_hedge_mading_stop_cover">
                                <el-col :span="12">
                                    <el-form-item label="对冲马丁补单倍数" required>
                                        <el-input type="number" :disabled="currentStrategy.is_run"
                                            v-model.number="currentStrategy.hedge_mading_cover_mult"><template
                                                #append>倍</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">

                                </el-col>
                            </el-row>
                        </el-card>
                        <el-card class="box-card"
                            style="margin-top: 20px;margin-bottom: 20px;margin-right: 20px;margin-left: 20px;">
                            <template #header>
                                <div class="card-header">
                                    <span>止盈止损设置</span>
                                </div>
                            </template>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="止盈" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_take_profit" class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>

                                </el-col>


                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12" v-if="currentStrategy.open_take_profit">
                                    <div>
                                        <el-form-item label="止盈方式" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model="currentStrategy.take_profit_type" class="my-radio-group">
                                                <el-radio-button :label="'price'" class="my-radio-50">
                                                    <template #default>固定止盈</template>
                                                </el-radio-button>
                                                <el-radio-button :label="'percent'" class="my-radio-50">
                                                    <template #default>百分比止盈</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12"
                                    v-if="currentStrategy.open_take_profit && currentStrategy.take_profit_type === 'price'">
                                    <el-form-item label="止盈价格" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.take_profit_price"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12"
                                    v-if="currentStrategy.open_take_profit && currentStrategy.take_profit_type === 'percent'">
                                    <el-form-item label="止盈百分比" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.take_profit_percent"><template
                                                #append>%</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="浮动止盈" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_float_take_profit"
                                                class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>


                                </el-col>
                                <el-col :span="12" v-if="currentStrategy.open_float_take_profit">
                                    <el-form-item label="浮动止盈价格" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.float_take_profit_price"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="浮盈止盈价格回撤" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_float_take_profit_back"
                                                class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12" v-if="currentStrategy.open_float_take_profit_back">
                                    <el-form-item label="浮盈止盈回撤价格" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.float_take_profit_back_price"><template
                                                #append>USDT</template></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div>
                                        <el-form-item label="开启止损" required>
                                            <el-radio-group :disabled="currentStrategy.is_run"
                                                v-model.number="currentStrategy.open_stop_profit" class="my-radio-group">
                                                <el-radio-button :label="true" class="my-radio-50">
                                                    <template #default>开启</template>
                                                </el-radio-button>
                                                <el-radio-button :label="false" class="my-radio-50">
                                                    <template #default>关闭</template>
                                                </el-radio-button>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>


                                </el-col>
                                <el-col :span="12" v-if="currentStrategy.open_stop_profit">
                                    <el-form-item label="止损等待时间" required>
                                        <el-input :disabled="currentStrategy.is_run" type="number"
                                            v-model.number="currentStrategy.stop_profit_wait_time"><template
                                                #append>分钟</template></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                        </el-card>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitStrategy">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog v-model="copyDialogVisible" title="复制交易对信息" width="35%" :before-close="copyHandleClose"
                :close-on-click-modal="false">

                <el-select v-model="target_copy_id" @change="updateSymbolPrecisionFields" clearable placeholder="请选择对应策略的序号"
                    style="width:100%" multiple filterable>
                    <el-option v-for="item in strategy_index_options" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
                <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
                    <el-button @click="copyDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitCopySymbolStrategy">确定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>
  
<script setup>
import { nextTick, ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import {
    api_获取交易对列表,
} from "@/api/funding_rate_strategy_api";
import { 查询当前用户的所有交易所信息 } from "@/api/exchange_infos_api";
import {
    api_获取双马丁策略列表,
    api_获取指定id的双马丁策略详情,
    api_启动指定id的双马丁策略,
    api_停止指定id的双马丁策略,
    api_删除指定id的双马丁策略,
    api_新增双马丁策略,
    api_更新指定id的双马丁策略,
    api_删除指定id的交易对双马丁策略,
    api_删除指定ids的交易对双马丁策略,
    api_复制交易对信息,
} from "@/api/smading_strategy_api";
import { ElMessage } from 'element-plus';



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

onBeforeUnmount(() => {

});


const getTagType = (position_side) => {
    if (position_side === 'LONG') return 'success';
    if (position_side === 'SHORT') return 'danger';
    if (position_side === 'BOTH') return 'warning'; // 或其他 ElementUI tag 的类型
    return ''; // 默认值
}

const getTagLabel = (position_side) => {
    if (position_side === 'LONG') return '做多';
    if (position_side === 'SHORT') return '做空';
    if (position_side === 'BOTH') return '双向'; // 您可以根据需要更改这里的文本
    return ''; // 默认值
}

//刷新时也保持展开状态
const expandedRowKeys = ref([]);
const onExpandChange = (row, expanded) => {
    // console.log(row, expanded);
    expandedRowKeys.value = expanded.value
};


const multipleSelection = ref({})
const handleSelectionChangeInner = (val, parent_row_id) => {
    // console.log(val, parent_row_id)
    // 判断parent_row_id是否在multipleSelection中
    multipleSelection.value[parent_row_id] = val;
}

const selectedStrategy = ref(null);  // 被选中的策略

// 选择策略的处理函数
const handleSelectionChangeOuter = (selected) => {
    // console.log(selected);
    selectedStrategy.value = selected;
};

const handleClose = (done) => {
    dialogVisible.value = false;
    // logDialogVisible.value = false;
    done();
};
const copyHandleClose = (done) => {
    copyDialogVisible.value = false;
    // logDialogVisible.value = false;
    done();
};
const copyDialogVisible = ref(false);
const singleTableRef = ref(null);
const setCurrent = (row) => {
    singleTableRef.value.setCurrentRow(row)
}

const target_copy_id = ref(null);
const strategy_index_options = ref([])
//复制币种信息
const copySymbolsInfo = () => {
    if (!selectedStrategy.value) {
        console.warn('请先选择一个策略!');
        ElMessage.warning('请先选择一个策略!');
        return;
    }
    copyDialogVisible.value = true;
}
//确认复制信息
const submitCopySymbolStrategy = async () => {
    currentStrategy.value = { ...selectedStrategy.value }
    console.log(target_copy_id.value, currentStrategy.value)
    try {
        const res = await api_复制交易对信息(target_copy_id.value, currentStrategy.value.symbol_infos);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            await getStartegyList();
            ElMessage({
                message: "复制交易对信息成功",
                type: "success"
            });
            copyDialogVisible.value = false;
        } else {
            ElMessage({
                message: "复制交易对信息失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "复制交易对信息失败：" + error,
            type: "error"
        });
    }

}

// 复制策略的方法
const copyStrategy = () => {
    //先清空原来的交易所选项
    exchange_info.value = {};
    if (!selectedStrategy.value) {
        console.warn('请先选择一个策略!');
        ElMessage.warning('请先选择一个策略!');
        return;
    }
    currentStrategy.value = { ...selectedStrategy.value }

    dialogTitle.value = "新增双马丁策略";
    exchange_info.value.id = currentStrategy.value.exchange_id;
    // 需要先判断exchange_options是否为空 然后通过exchange_options找到对应的交易所名称 
    const currentExchange = exchange_options.value.find((exchange) => {
        return exchange.id === currentStrategy.value.exchange_id;
    });
    exchange_info.value.exchange_name = currentExchange.exchange_name;
    // 循环 currentStrategy.value.symbol_infos 给symbol_options加入对应的symbol
    currentStrategy.value.symbols = [];
    for (let key in symbol_precisions) {
        delete symbol_precisions[key];
    }
    currentStrategy.value.symbol_infos.forEach(symbol_info => {
        symbol_precisions[symbol_info['symbol']] = symbol_info['symbol_price_precision'];
        currentStrategy.value.symbols.push(symbol_info['symbol']);

    });
    updateSymbolPrecisionFields(currentStrategy.value.symbols);
    currentStrategy.value.id = null;
    currentStrategy.value.is_run = false;
    setCurrent();
    dialogVisible.value = true;
};


const currentStrategy = ref({})
const symbol_precisions = reactive({});
const symbol_options = ref([]);
function updateSymbolPrecisionFields(symbols) {
    // console.log(symbol_precisions)
    const newSymbolPrecisions = {};
    symbols.forEach(symbol => {
        newSymbolPrecisions[symbol] = symbol_precisions[symbol] || ""; // 保留已经填写的精度值，或者初始化为空字符串
    });
    for (const key in symbol_precisions) {
        if (!newSymbolPrecisions[key]) {
            delete symbol_precisions[key];
        }
    }
    for (const key in newSymbolPrecisions) {
        symbol_precisions[key] = newSymbolPrecisions[key];
    }
}
function currentStrategy_init() {
    currentStrategy.value = {
        id: null,  // 唯一标识
        strategy_note: null,  // 策略备注
        exchange_id: null, // 交易所ID
        exchange_name: null,  // 交易所名称
        symbols: [],  // 交易对
        symbol_precisions: {}, // 交易对精度字典
        position_side: "SHORT",  // 持仓方向
        pos_value_1st: null,  // 首单价值
        cover_order_pos_value_1st: null,  // 补单首单价值
        all_cover_order_count: null,  // 补单次数
        price_pct_trigger_cover: null,  // 补单百分比
        cover_value_mult: null,  // 补单倍数
        accel_cover_pct: null,  // 加速补单百分比
        open_hedge_mading: false,  // 是否开启对冲马丁
        tigger_hedge_mading_num: null,  // 对冲马丁第几单触发
        hedge_mading_cover_pos_value_1st: null,  // 对冲马丁首单价值
        open_tigger_hedge_mading_stop_cover: false,  // 是否开启对冲马丁触发后停止补单
        tigger_hedge_mading_cover_num: null,  // 对冲马丁第几单触发补单
        hedge_mading_pos_value_1st: null,  // 对冲马丁补单首单价值
        hedge_mading_cover_mult: null,  // 对冲马丁补单倍数
        open_take_profit: false,  // 是否开启止盈
        take_profit_type: "price",  // 止盈类型
        take_profit_price: null,  // 止盈价格
        take_profit_percent: null,  // 止盈百分比
        open_float_take_profit: false,  // 是否开启浮动止盈
        float_take_profit_price: null,  // 浮动止盈价格
        open_float_take_profit_back: false,  // 是否开启浮动止盈回撤
        float_take_profit_back_price: null,  // 浮动止盈回撤价格
        open_stop_profit: false,  // 是否开启止损
        stop_profit_wait_time: null //止损等待时间

    };
}

const exchange_info = ref({
    id: "",
    exchange_name: ""
});
const dialogVisible = ref(false);
const dialogTitle = ref("新增双马丁策略");
function addStrategy() {
    dialogTitle.value = "新增双马丁策略";
    // 清空currentStrategy
    currentStrategy_init();
    exchange_info.value = {
        id: "",
        exchange_name: ""
    };
    dialogVisible.value = true;
}

// 编辑双马丁策略
function editStrategy(item) {
    console.log(item);
    dialogTitle.value = "编辑双马丁策略";
    currentStrategy.value = item;
    // 需要先判断exchange_options是否为空 然后通过exchange_options找到对应的交易所名称 
    const currentExchange = exchange_options.value.find((exchange) => {
        return exchange.id === item.exchange_id;
    });
    exchange_info.value = currentExchange;
    // 循环 currentStrategy.value.symbol_infos 给symbol_options加入对应的symbol
    currentStrategy.value.symbols = [];
    for (let key in symbol_precisions) {
        delete symbol_precisions[key];
    }
    if (currentStrategy.value.symbol_infos && currentStrategy.value.symbol_infos.length > 0) {
        currentStrategy.value.symbol_infos.forEach(symbol_info => {
            symbol_precisions[symbol_info['symbol']] = symbol_info['symbol_price_precision'];
            currentStrategy.value.symbols.push(symbol_info['symbol']);

        });
        updateSymbolPrecisionFields(currentStrategy.value.symbols);
    }


    // console.log(exchange_info)
    // exchange_info.value.exchange_name = item.exchange_name;
    dialogVisible.value = true;
}

const exchange_options = ref([]);

// 获取交易对信息
async function getSymbolList() {

    try {
        const res = await api_获取交易对列表();
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            symbol_options.value = res.data.data;

        } else {
            ElMessage({
                message: "查询交易对列表失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "查询交易对列表失败：" + error,
            type: "error"
        });
    }

}

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

// 储存双马丁策略列表的数组
const smading_strategy_list = ref([]);
// 获取策略信息
async function getStartegyList() {

    try {
        const res = await api_获取双马丁策略列表();
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            smading_strategy_list.value = res.data.data;
            // 遍历samding_strategy_list
            strategy_index_options.value = [];
            smading_strategy_list.value.forEach((strategy, index) => {
                const _data = {
                    value: strategy.id,
                    label: strategy.exchange_name + "-" + strategy.strategy_note
                }
                strategy_index_options.value.push(_data);
            });

        } else {
            ElMessage({
                message: "查询双马丁策略列表失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "查询双马丁策略列表失败：" + error,
            type: "error"
        });
    }

}

async function submitStrategy() {
    currentStrategy.value.exchange_id = exchange_info.value.id;
    currentStrategy.value.exchange_name = exchange_info.value.exchange_name;
    currentStrategy.value.symbol_precisions = symbol_precisions;

    // console.log(currentStrategy.value);
    if (currentStrategy.value.id) {
        try {
            const res = await api_更新指定id的双马丁策略(currentStrategy.value.id, currentStrategy.value);
            // console.log("res", res);
            if (res.status === 200 && res.data.code === 200) {
                // console.log(res.data.data);

                await getStartegyList();
                ElMessage({
                    message: "更新双马丁策略成功",
                    type: "success"
                });
                dialogVisible.value = false;
            } else {
                ElMessage({
                    message: "更新双马丁策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "更新双马丁策略失败：" + error,
                type: "error"
            });
        }
    } else {
        try {
            const res = await api_新增双马丁策略(currentStrategy.value);
            // console.log("res", res);
            if (res.status === 200 && res.data.code === 200) {
                // console.log(res.data.data);
                await getStartegyList();
                ElMessage({
                    message: "新增双马丁策略成功",
                    type: "success"
                });
                dialogVisible.value = false;
            } else {
                ElMessage({
                    message: "新增双马丁策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "新增双马丁策略失败：" + error,
                type: "error"
            });
        }
    }

}

// 删除策略的处理函数
const deleteStrategy = async (row) => {
    try {
        const res = await api_删除指定id的双马丁策略(row.id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            await getStartegyList();
            ElMessage({
                message: "删除双马丁策略成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "删除双马丁策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "删除双马丁策略失败：" + error,
            type: "error"
        });
    }
}

// 删除交易对策略的处理函数
const deleteSymbolStrategy = async (row) => {
    try {
        const res = await api_删除指定id的交易对双马丁策略(row.id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            await getStartegyList();
            ElMessage({
                message: "删除交易对双马丁策略成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "删除交易对双马丁策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "删除交易对双马丁策略失败：" + error,
            type: "error"
        });
    }
}


const stopSymbolStrategy = async (row) => {
    const _data = []
    _data.push(row)
    try {
        const res = await api_停止指定id的双马丁策略(_data);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            await getStartegyList();
            ElMessage({
                message: "停止交易对双马丁策略成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止交易对双马丁策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止交易对双马丁策略失败：" + error,
            type: "error"
        });
    }
}

const startSymbolStrategy = async (row) => {
    const _data = []
    _data.push(row)
    console.log(_data, row.value)
    try {
        const res = await api_启动指定id的双马丁策略(_data);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            await getStartegyList();
            ElMessage({
                message: "启动交易对双马丁策略成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "启动交易对双马丁策略失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "启动交易对双马丁策略失败：" + error,
            type: "error"
        });
    }
}

const selectStartSymbolStrategy = async (parent_row) => {
    // console.log(parent_row, parent_row.id)
    // console.log(multipleSelection.value[parent_row.id])
    const selected = multipleSelection.value[parent_row.id];
    if (selected && selected.length > 0) {
        try {
            const res = await api_启动指定id的双马丁策略(selected);
            // console.log("res", res);
            if (res.status === 200 && res.data.code === 200) {
                // console.log(res.data.data);
                await getStartegyList();
                ElMessage({
                    message: "启动交易对双马丁策略成功",
                    type: "success"
                });
            } else {
                ElMessage({
                    message: "启动交易对双马丁策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "启动交易对双马丁策略失败：" + error,
                type: "error"
            });
        }
    } else {
        ElMessage({
            message: "请先选择一个交易对策略",
            type: "error"
        });
    }
}

const selectStopSymbolStrategy = async (parent_row) => {
    const selected = multipleSelection.value[parent_row.id];
    if (selected && selected.length > 0) {
        try {
            const res = await api_停止指定id的双马丁策略(selected);
            // console.log("res", res);
            if (res.status === 200 && res.data.code === 200) {
                // console.log(res.data.data);
                await getStartegyList();
                ElMessage({
                    message: "停止交易对双马丁策略成功",
                    type: "success"
                });
            } else {
                ElMessage({
                    message: "停止交易对双马丁策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "停止交易对双马丁策略失败：" + error,
                type: "error"
            });
        }
    } else {
        ElMessage({
            message: "请先选择一个交易对策略",
            type: "error"
        });
    }
}

const selectDeleteSymbolStrategy = async (parent_row) => {
    const ids = [];
    multipleSelection.value[parent_row.id].forEach(item => {
        ids.push(item.id);
    });
    if (ids && ids.length > 0) {
        try {
            const res = await api_删除指定ids的交易对双马丁策略(ids);
            // console.log("res", res);
            if (res.status === 200 && res.data.code === 200) {
                // console.log(res.data.data);
                await getStartegyList();
                ElMessage({
                    message: "删除交易对双马丁策略成功",
                    type: "success"
                });
            } else {
                ElMessage({
                    message: "删除交易对双马丁策略失败：" + res.data.msg,
                    type: "error"
                });
            }
        } catch (error) {
            ElMessage({
                message: "删除交易对双马丁策略失败：" + error,
                type: "error"
            });
        }
    } else {
        ElMessage({
            message: "请先选择一个交易对策略",
            type: "error"
        });
    }
}

</script>
  
<style lang="less" scoped>
.my-radio-group {
    width: 100%;
}

.my-radio-50 {
    width: 50%;

    :deep(.el-radio-button__inner) {
        width: 100%;
    }
}

.my-radio-33 {
    width: 33.33%;

    :deep(.el-radio-button__inner) {
        width: 100%;
    }
}

:deep(.el-dialog__body) {
    padding-top: 0;
}

:deep(.el-dialog) {
    top: -8% !important;
    left: 2% !important;

    .dialog-content {
        max-height: 55vh !important;
        overflow-y: auto !important;
    }

    max-height: 80vh !important;
    overflow-y: auto !important;

}
</style>
  
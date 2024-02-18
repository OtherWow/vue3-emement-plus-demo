<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-button type="primary" @click="addStrategy()">新增策略</el-button>
          <el-button type="primary" @click="copyStrategy()">复制选中策略</el-button>
          <el-button type="primary" @click="copySymbolsInfo()">复制币种信息</el-button>
        </el-col>
        <el-col :span="13"></el-col>
        <!-- 居右-->
        <el-col :span="5" style="text-align: right">
          <el-form>
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <el-form-item label="是否禁用">
                  <el-select @change="change_is_deleted" v-model="strategy_is_deleted" clearable placeholder="请选择"
                    style="width: 100%">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="2">
                <el-button type="primary" @click="getStartegyList(strategy_is_deleted)"> 查询 </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="singleTableRef" :data="smading_strategy_list" style="width: 100%" :fit="false" border
        highlight-current-row @current-change="handleSelectionChangeOuter" @expand-change="onExpandChange"
        :expand-row-keys="expandedRowKeys" row-key="id">
        <el-table-column type="expand">
          <template #default="props">
            <el-form>
              <el-row :gutter="20" style="margin-left: 60px; margin-top: 5px">
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="selectStartSymbolStrategy(props.row)" effect="dark"> 选中启动
                  </el-button>
                  <el-button type="primary" size="small" @click="selectPauseSymbolStrategy(props.row)" effect="dark"> 选中暂停
                  </el-button>
                  <el-button type="primary" size="small" @click="selectContinueSymbolStrategy(props.row)" effect="dark">
                    选中恢复 </el-button>
                  <el-button type="primary" size="small" @click="selectStopSymbolStrategy(props.row)" effect="dark"> 选中停止
                  </el-button>
                  <el-button type="danger" size="small" @click="selectDeleteSymbolStrategy(props.row)" effect="dark"> 选中删除
                  </el-button>
                </el-col>
                <el-col :span="3"></el-col>
              </el-row>
            </el-form>
            <el-table :data="props.row.symbol_infos" style="margin-left: 50px; width: 80%"
              @selection-change="(selectedRows) => handleSelectionChangeInner(selectedRows, props.row.id)">
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" width="55" label="序号" align="center" />
              <el-table-column label="交易对" prop="symbol" width="150" align="center" />
              <el-table-column label="交易对精度" prop="symbol_price_precision" width="120" align="center" />
              <el-table-column label="运行中" width="90" show-overflow-tooltip align="center" :filters="[
                { text: '是', value: true },
                { text: '否', value: false },
              ]" filter-placement="bottom-end" :filter-method="filter_run">
                <template #default="{ row }">
                  <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">
                    {{ row.is_run ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="暂停中" width="90" show-overflow-tooltip align="center">
                <template #default="{ row }">
                  <el-tag :type="!row.is_pause ? 'success' : 'danger'" effect="dark">
                    {{ row.is_pause ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="380" align="center">
                <template #default="{ row }">
                  <el-button type="primary" size="small" @click="startSymbolStrategy(row)" plain :disabled="row.is_run">
                    启动 </el-button>
                  <el-button type="primary" size="small" @click="pauseSymbolStrategy(row)" plain :disabled="row.is_pause">
                    暂停 </el-button>
                  <el-button type="primary" size="small" @click="continueSymbolStrategy(row)" plain
                    :disabled="!row.is_pause"> 恢复 </el-button>
                  <el-button type="primary" size="small" @click="stopSymbolStrategy(row)" plain :disabled="!row.is_run">
                    停止 </el-button>
                  <el-button type="danger" size="small" @click="deleteSymbolStrategy(row)" :disabled="row.is_run"> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="exchange_name" label="交易所" width="100" show-overflow-tooltip sortable
          align="center"></el-table-column>
        <el-table-column prop="trade_type" label="策略类型" width="100" show-overflow-tooltip align="center">
          <template #default="{ row }">
            {{ getTradeTypeName(row.trade_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="strategy_note" label="策略备注" width="450" show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column label="运行中" width="90" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">
              {{ row.is_run ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="symbol_num" label="交易对数量" width="100" show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column prop="run_num" label="运行中数量" width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="持仓情况" width="90" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.position_side)" effect="dark">
              {{ getTagLabel(row.position_side) }}
            </el-tag>
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
            <el-tag :type="row.open_hedge_mading ? 'success' : 'danger'">
              {{ row.open_hedge_mading ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="止盈" width="80" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <el-tag :type="row.open_take_profit ? 'success' : 'danger'">
              {{ row.open_take_profit ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="止损" width="80" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <el-tag :type="row.open_stop_profit ? 'success' : 'danger'">
              {{ row.open_stop_profit ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" prop="exchange_name" label="交易所" width="100" show-overflow-tooltip sortable
          align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editStrategy(row)" plain>编辑</el-button>
            <el-button type="danger" size="small" @click="deleteStrategy(row)" :disabled="row.is_run">
              删除
            </el-button>
            <el-button type="danger" size="small" @click="禁用策略(row, true)" :disabled="row.is_deleted">
              禁用
            </el-button>
            <el-button type="success" size="small" @click="禁用策略(row, false)" :disabled="!row.is_deleted">
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="65%" :before-close="handleClose"
        :close-on-click-modal="false">
        <el-form :model="currentStrategy" label-width="150px">
          <div class="dialog-content">
            <el-card class="box-card"
              style="margin-bottom: 20px; margin-right: 20px; margin-left: 20px; margin-top: 20px">
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
                  <el-form-item label="交易所" required>
                    <el-select v-model="exchange" clearable placeholder="请选择" style="width: 100%" filterable
                      value-key="id" :disabled="currentStrategy.is_run" @change="更新交易所信息()">
                      <el-option v-for="item in buzz_exchange_options" :key="item.id" :label="item.exchange_name"
                        :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="交易所账号" required>
                    <el-select v-model="exchange_info" clearable placeholder="请选择" style="width: 100%" filterable
                      value-key="id" :disabled="currentStrategy.is_run">
                      <el-option v-for="item in exchange_options" :key="item.id" :label="item.exchange_name"
                        :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row :gutter="20">

                <el-col :span="12">
                  <el-form-item label="交易类型" required>
                    <el-radio-group :disabled="currentStrategy.is_run" v-model="currentStrategy.trade_type"
                      class="my-radio-group" @change="选择交易类型()">
                      <el-radio-button :label="'futures'" class="my-radio-50">
                        <template #default>合约</template>
                      </el-radio-button>
                      <el-radio-button :label="'spot'" class="my-radio-50">
                        <template #default>现货</template>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
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
                        <el-radio-button :label="'SHORT'" class="my-radio-33"
                          :disabled="currentStrategy.trade_type === 'spot'">
                          <template #default>做空</template>
                        </el-radio-button>
                        <el-radio-button :label="'BOTH'" class="my-radio-33"
                          :disabled="currentStrategy.trade_type === 'spot'">
                          <template #default>双向</template>
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <!-- 交易对的多选框 -->
              <el-form-item label="币种" required>
                <el-select v-model="currentStrategy.symbols" @change="updateSymbolPrecisionFields" clearable
                  placeholder="请选择" style="width: 100%" multiple filterable>
                  <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol"
                    :value="item.symbol" />
                </el-select>
              </el-form-item>

              <!-- 动态的交易对精度编辑框 -->
              <el-row v-for="(precision, symbol) in symbol_precisions" :key="symbol" :gutter="20">
                <el-col :span="13">
                  <el-form-item :label="`${symbol} 价格精度`" required label-width="300px" v-if="false">
                    <el-input v-model.number="symbol_precisions[symbol]" placeholder="比如14.0125就填4，代表4位数"
                      style="min-width: 250px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" style="margin-right: 20px; margin-left: 20px" :disabled="currentStrategy.is_run">
              <template #header>
                <div class="card-header">
                  <span>下单设置</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="首单价值" required>
                    <el-input type="number" :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.pos_value_1st">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="补单首单价值" required>
                    <el-input type="number" :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.cover_order_pos_value_1st">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="活跃订单数量" required>
                    <el-input :disabled="currentStrategy.is_run" v-model.number="currentStrategy.live_order_num"
                      placeholder="一次性挂多少个补单">
                      <template #append>个</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="补单次数" required>
                    <el-input :disabled="currentStrategy.is_run" v-model.number="currentStrategy.all_cover_order_count">
                      <template #append>次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="补单波动" required>
                    <el-input :disabled="currentStrategy.is_run" v-model.number="currentStrategy.price_pct_trigger_cover"
                      type="number">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="补单倍数" required>
                    <el-input-number :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.cover_value_mult">
                      <template #append>倍</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="加速补单百分比" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.accel_cover_pct" placeholder="正数加快补单负数放慢补单">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div>
                    <el-form-item label="叠加补单" required>
                      <el-radio-group :disabled="currentStrategy.is_run" v-model.number="currentStrategy.open_add_cover"
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
                  <el-form-item label="叠加补单首单价值" required v-if="currentStrategy.open_add_cover">
                    <el-input type="number" :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.add_cover_order_pos_value_1st">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_add_cover">
                <el-col :span="12">
                  <el-form-item label="叠加补单次数" required>
                    <el-input :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.add_all_cover_order_count">
                      <template #append>次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="叠加补单波动" required>
                    <el-input :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.add_price_pct_trigger_cover" type="number">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_add_cover">
                <el-col :span="12">
                  <el-form-item label="叠加补单倍数" required>
                    <el-input-number :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.add_cover_value_mult">
                      <template #append>倍</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="叠加加速补单百分比" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.add_accel_cover_pct" placeholder="正数加快补单负数放慢补单">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="补到多少单停止" required>
                    <el-input type="number" v-model.number="currentStrategy.cover_stop_num"
                      placeholder="比如第30补单挂上后停止挂补单.不填则表示全补"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px"
              v-if="currentStrategy.trade_type === 'futures'">
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
                <el-col :span="12"></el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_hedge_mading">
                <el-col :span="12">
                  <el-form-item label="对冲马丁首单" required>
                    <el-input :disabled="currentStrategy.is_run" v-model.number="currentStrategy.tigger_hedge_mading_num"
                      placeholder="如果想补单第n单补进后就挂对冲首单就填 n+1"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="对冲马丁首单价值" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.hedge_mading_pos_value_1st">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_hedge_mading">
                <el-col :span="12">
                  <div>
                    <el-form-item label="对冲触发后停止补单" required>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_tigger_hedge_mading_stop_cover" class="my-radio-group">
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
                <el-col :span="12"></el-col>
              </el-row>
              <el-row :gutter="20"
                v-if="currentStrategy.open_hedge_mading && !currentStrategy.open_tigger_hedge_mading_stop_cover">
                <el-col :span="12">
                  <el-form-item label="对冲马丁第几单补单" required>
                    <el-input :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.tigger_hedge_mading_cover_num"
                      placeholder="补单第n单补进后对冲开始补单就填 n+1(注意补单必须大于首单 不然不会补)"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="补单首单价值" required>
                    <el-input type="number" :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.hedge_mading_cover_pos_value_1st">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20"
                v-if="currentStrategy.open_hedge_mading && !currentStrategy.open_tigger_hedge_mading_stop_cover">
                <el-col :span="12">
                  <el-form-item label="对冲马丁补单倍数" required>
                    <el-input type="number" :disabled="currentStrategy.is_run"
                      v-model.number="currentStrategy.hedge_mading_cover_mult">
                      <template #append>倍</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
              </el-row>
            </el-card>
            <el-card class="box-card"
              style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px">
              <template #header>
                <div class="card-header">
                  <span>止盈设置</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div>
                    <el-form-item label="止盈" required>
                      <el-radio-group :disabled="currentStrategy.is_run" v-model.number="currentStrategy.open_take_profit"
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
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12" v-if="currentStrategy.open_take_profit">
                  <div>
                    <el-form-item label="止盈方式" required>
                      <el-radio-group :disabled="currentStrategy.is_run" v-model="currentStrategy.take_profit_type"
                        class="my-radio-group">
                        <el-radio-button :label="'price'" class="my-radio-33">
                          <template #default>固定止盈</template>
                        </el-radio-button>
                        <el-radio-button :label="'percent'" class="my-radio-33">
                          <template #default>百分比止盈</template>
                        </el-radio-button>
                        <el-radio-button :label="'mixed'" class="my-radio-33">
                          <template #default>混合止盈(取最小值)</template>
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_take_profit && (currentStrategy.take_profit_type === 'price' || currentStrategy.take_profit_type === 'mixed')
                  ">
                  <el-form-item label="止盈价格" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.take_profit_price">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_take_profit &&
                  (currentStrategy.take_profit_type === 'percent' || currentStrategy.take_profit_type === 'mixed')
                  ">
                  <el-form-item label="止盈百分比" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.take_profit_percent">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_take_profit">
                <el-col :span="12">
                  <div>
                    <el-form-item label="高单重置止盈" required>
                      <el-radio-group v-model.number="currentStrategy.open_high_order_reset_take_profit"
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
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" v-if="currentStrategy.open_high_order_reset_take_profit">
                  <el-form-item label="第几单后重挂止盈" required>
                    <el-input type="number" v-model.number="currentStrategy.when_repull_take_profit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_high_order_reset_take_profit">
                  <el-form-item label="重挂止盈大小" required>
                    <el-input type="number" v-model="currentStrategy.repull_take_profit_num"
                      @change="handle_repull_take_profit_num">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12">
                  <div>
                    <el-form-item label="横盘重挂止盈" required>
                      <el-radio-group v-model.number="currentStrategy.open_hp_order_reset_take_profit"
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

              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">

                  <el-form-item label="0本轮启动" required>
                    <template #label>0本轮启动<el-tooltip placement="top" effect="dark" class="box-item">
                        <template #content> 横盘重挂止盈可以设置3组,0为第一组 1为第二组 2为第三组。比如:<br />
                          第一组设置>=30分钟且补单>=15单，则保本跑就设置30 15 0<br />
                          第二组设置>=60分钟且补单>=18单，则亏1u跑,设置为60 18 -1<br />
                          第三组设置>=90分钟且补单>=20单，则亏2u跑,设置为90 20 -2<br />
                          可以3组都设置也可以只设置1组。<br />
                          序号靠后的条件达成会覆盖之前的止盈价格<br />
                          比如第二组的条件达成了，设置重挂止盈-1，但第三组的条件也达成了，设置重挂止盈-2，那么最终重挂止盈为-2
                        </template>
                        <el-icon :span="12" size="20" style="margin-left:2px;margin-top:6px">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                    <el-input type="number"
                      v-model.number="currentStrategy.when_trigger_hg_order_reset_take_profit"><template
                        #append>分钟后触发</template></el-input>

                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="0第" required>
                    <el-input type="number" v-model.number="currentStrategy.when_hg_repull_take_profit"><template
                        #append>单后横盘重挂止盈</template></el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="0横盘重挂止盈大小" required>
                    <el-input type="number" v-model="currentStrategy.hg_repull_take_profit_num"
                      @change="handle_repull_take_profit_num">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="1本轮启动" required>
                    <el-input type="number"
                      v-model.number="currentStrategy.when_trigger_hg_order_reset_take_profit1"><template
                        #append>分钟后触发</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="1第" required>
                    <el-input type="number" v-model.number="currentStrategy.when_hg_repull_take_profit1"><template
                        #append>单后横盘重挂止盈</template></el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="1横盘重挂止盈大小" required>
                    <el-input type="number" v-model="currentStrategy.hg_repull_take_profit_num1"
                      @change="handle_repull_take_profit_num">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="2本轮启动" required>
                    <el-input type="number"
                      v-model.number="currentStrategy.when_trigger_hg_order_reset_take_profit2"><template
                        #append>分钟后触发</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="currentStrategy.open_take_profit && currentStrategy.position_side === 'BOTH'">
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="2第" required>
                    <el-input type="number" v-model.number="currentStrategy.when_hg_repull_take_profit2"><template
                        #append>单后横盘重挂止盈</template></el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="currentStrategy.open_hp_order_reset_take_profit">
                  <el-form-item label="2横盘重挂止盈大小" required>
                    <el-input type="number" v-model="currentStrategy.hg_repull_take_profit_num2"
                      @change="handle_repull_take_profit_num">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" v-if="currentStrategy.open_take_profit && currentStrategy.trade_type === 'futures'">
                  <div>
                    <el-form-item label="同时止盈" required>
                      <el-radio-group :disabled="currentStrategy.is_run" v-model="currentStrategy.take_profit_together"
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
                <el-col :span="12" v-if="currentStrategy.open_take_profit">
                  <el-form-item label="第几单开始止盈" required>
                    <el-input :disabled="currentStrategy.is_run" type="number"
                      v-model.number="currentStrategy.when_take_profit" placeholder="挂第几个补单的时候开始下限价止盈单">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>



              <el-row :gutter="20"
                v-if="currentStrategy.open_take_profit && currentStrategy.trade_type === 'futures' && currentStrategy.open_hedge_mading">
                <el-col :span="12">
                  <div>
                    <el-form-item label="浮动止盈" required>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_float_take_profit" class="my-radio-group">
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
                      v-model.number="currentStrategy.float_take_profit_price">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20"
                v-if="currentStrategy.open_take_profit && currentStrategy.trade_type === 'futures' && currentStrategy.open_hedge_mading">
                <el-col :span="12">
                  <div>
                    <el-form-item label="浮盈止盈价格回撤" required>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_float_take_profit_back" class="my-radio-group">
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
                      v-model.number="currentStrategy.float_take_profit_back_price">
                      <template #append>USDT</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card"
              style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px">
              <template #header>
                <div class="card-header">
                  <span>止损设置</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div>
                    <el-form-item label="开启止损" required>
                      <el-radio-group :disabled="currentStrategy.is_run" v-model.number="currentStrategy.open_stop_profit"
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
                <el-col :span="12"
                  v-if="currentStrategy.open_stop_profit && !currentStrategy.open_stop_profit_switch_hedge_mading">
                  <el-form-item label="止损后等待时间" required>
                    <el-input type="number" v-model.number="currentStrategy.stop_profit_wait_time">
                      <template #append>分钟</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="currentStrategy.open_stop_profit && currentStrategy.position_side == 'BOTH'">
                <el-col :span="12">
                  <div>
                    <el-form-item label="止损后切换对冲马丁" required>
                      <el-radio-group v-model.number="currentStrategy.open_stop_profit_switch_hedge_mading"
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
                <el-col :span="12" v-if="currentStrategy.open_stop_profit_switch_hedge_mading">
                  <el-form-item label="对冲马丁策略" required>
                    <el-select v-model="对冲马丁策略id" @change="当前策略对应的对冲马丁的策略改变" clearable placeholder="请选择对应策略的序号"
                      style="width: 100%" filterable>
                      <el-option v-for="item in 当前策略对应的对冲马丁的策略列表" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="!currentStrategy.open_stop_profit_switch_hedge_mading">
                <el-col :span="12" v-if="currentStrategy.open_stop_profit">
                  <div>
                    <el-form-item label="止损后自动暂停" required>
                      <el-radio-group v-model.number="currentStrategy.after_stop_profit_auto_pause"
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
                <el-col :span="12" v-if="currentStrategy.open_stop_profit">
                  <el-form-item label="止损前等待时间" required>
                    <el-input type="number" v-model.number="currentStrategy.before_stop_profit_wait_time">
                      <template #append>秒</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>


            </el-card>

            <el-card class="box-card"
              style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px">
              <template #header>
                <div class="card-header">
                  <span>告警设置</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="补到多少单微信告警">
                    <el-input type="number" v-model.number="currentStrategy.cover_alarm_num"
                      placeholder="比如第20补单挂上后触发告警"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="第几单暂停补单">
                    <template #label>第几单暂停补单<el-tooltip placement="top" effect="dark" class="box-item">
                        <template #content> 填数字。不填就不启用该功能，此功能一轮马丁只触发一次，止盈后自动恢复
                        </template>
                        <el-icon :span="12" size="20" style="margin-left:2px;margin-top:6px">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                    <el-input type="number" v-model.number="currentStrategy.cover_order_pause_num"
                      placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div>
                    <el-form-item required>
                      <template #label>防瀑布功能<el-tooltip placement="top" effect="dark" class="box-item">
                          <template #content> 设置示例：2秒内补了6单触发告警。<br />
                            触发后暂停补单的意思：<br />
                            比如触发后补到第15单,那么本来第15单补进正常应该挂16单，开启暂停补单后此时会暂停补第16单<br />
                            也就是第16单不挂（止盈单正常挂）。<br />
                            监控墙上会有一个按钮恢复挂单，点击之后会恢复挂单。正常挂第16单<br />
                            好处：假如做多触发放瀑布，第15单自动暂停补单，此时币价100，暂停后一路下跌跌到60块，<br />
                            正常已经爆仓了，但是因为暂停补单仓位很小，所以没爆仓。当判断趋势可能回弹了，点恢复挂单，<br />
                            因为价格远低于正常补单价了，所有补单会以市价直接补进去瞬间拉低仓位，只要稍微反弹即可止盈。<br />

                          </template>
                          <el-icon :span="12" size="20" style="margin-left:2px;margin-top:6px">
                            <QuestionFilled />
                          </el-icon>
                        </el-tooltip>
                      </template>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_prevent_falls" class="my-radio-group">
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
              <el-row :gutter="2" v-if='currentStrategy.open_prevent_falls'>
                <el-col :span="8">
                  <el-form-item label="触发条件">
                    <el-input type="number" v-model.number="currentStrategy.falls_second_num">
                      <template #append>秒内</template>
                    </el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-input type="number" v-model.number="currentStrategy.falls_cover_num">
                    <template #prepend>补单</template>
                    <template #append>次</template>
                  </el-input>

                </el-col>
              </el-row>
              <el-row v-if='currentStrategy.open_prevent_falls'>
                <el-col :span="12">
                  <div>
                    <el-form-item label="触发后暂停补单" required>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_falls_tigger_pause" class="my-radio-group">
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
                  <div>
                    <el-form-item label="触发后微信告警" required>
                      <el-radio-group :disabled="currentStrategy.is_run"
                        v-model.number="currentStrategy.open_falls_tigger_wx_alarm" class="my-radio-group">
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
            </el-card>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 20px">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitStrategy" :disabled="currentStrategy.is_run"> 确定 </el-button>
            </el-col>
            <el-col :span="3">
              <el-select v-model="mock_symbol" clearable placeholder="请选择" style="width: 100%" filterable>
                <el-option v-for="item in symbol_options" :key="item.symbol" :label="item.symbol" :value="item.symbol" />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="模拟数据">模拟数据</el-button>

            </el-col>
          </el-row>
        </div>
      </el-dialog>

      <el-dialog v-model="copyDialogVisible" title="复制交易对信息" width="35%" :before-close="copyHandleClose"
        :close-on-click-modal="false">
        <el-select v-model="target_copy_id" @change="updateSymbolPrecisionFields" clearable placeholder="请选择对应策略的序号"
          style="width: 100%" multiple filterable>
          <el-option v-for="item in strategy_index_options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div slot="footer" class="dialog-footer" style="margin-top: 20px">
          <el-button @click="copyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCopySymbolStrategy">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog v-model="mockDialogVisible" title="模拟数据" width="65%" :before-close="mockHandleClose"
        :close-on-click-modal="false" v-if="mock_positon_side === 'both' || mock_positon_side === 'long'">
        <el-card class="box-card">
          <template #header>
            <el-text class="mx-1" type="success" size="large" tag="b">做多模拟表格</el-text>
          </template>
          <el-table :data="mock_long_table_list" style="width: 100%" border highlight-current-row height="800px" stripe>
            <el-table-column prop="当前补单次数" label="当前补单次数" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="补单数量" label="补单数量" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="补单价格" label="补单价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="补单价值" label="补单价值" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="价格波动" label="价格波动" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="预估仓位数量" label="预估仓位数量" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估仓位价格" label="预估仓位价格" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估仓位价值" label="预估仓位价值" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估盈利" label="预估盈利" width="100" show-overflow-tooltip align="center"></el-table-column>

            <el-table-column prop="止盈价格" label="止盈价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="价格回调多少解套" label="价格回调多少解套" width="180" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="止损价格" label="止损价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="预估止损亏损" label="预估止损亏损" width="120" show-overflow-tooltip
              align="center"></el-table-column>
          </el-table>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px"
          v-if="mock_positon_side === 'both' || mock_positon_side === 'short'">
          <template #header>
            <el-text class="mx-1" type="danger" size="large" tag="b">做空模拟表格</el-text>
          </template>
          <el-table :data="mock_short_table_list" style="width: 100%" border highlight-current-row height="800px" stripe>
            <el-table-column prop="当前补单次数" label="当前补单次数" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="补单数量" label="补单数量" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="补单价格" label="补单价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="补单价值" label="补单价值" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="价格波动" label="价格波动" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="预估仓位数量" label="预估仓位数量" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估仓位价格" label="预估仓位价格" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估仓位价值" label="预估仓位价值" width="120" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="预估盈利" label="预估盈利" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="止盈价格" label="止盈价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="价格回调多少解套" label="价格回调多少解套" width="180" show-overflow-tooltip
              align="center"></el-table-column>
            <el-table-column prop="止损价格" label="止损价格" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="预估止损亏损" label="预估止损亏损" width="120" show-overflow-tooltip
              align="center"></el-table-column>
          </el-table>
        </el-card>

        <div slot="footer" class="dialog-footer" style="margin-top: 20px">
          <el-button type="primary" @click="mockDialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { api_获取现货所有usdt交易对 } from '@/api/binance_api'
import { 查询当前用户的所有交易所信息 } from '@/api/exchange_infos_api'
import { api_获取交易对列表 } from '@/api/funding_rate_strategy_api'
import {
  api_停止指定id的双马丁策略,
  api_删除指定ids的交易对双马丁策略,
  api_删除指定id的交易对双马丁策略,
  api_删除指定id的双马丁策略,
  api_启动指定id的双马丁策略,
  api_复制交易对信息,
  api_恢复指定id的双马丁策略,
  api_新增双马丁策略,
  api_暂停指定id的双马丁策略,
  api_更新指定id的双马丁策略,
  api_模拟数据,
  api_获取双马丁策略列表,
} from '@/api/smading_strategy_api'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'




const strategy_is_deleted = ref(false)
const change_is_deleted = async () => {
  await getStartegyList(strategy_is_deleted.value)
}
const filter_run = (value, row) => {
  return row.is_run === value
}
const mock_symbol = ref('')
onMounted(() => {
  getExchangeInfoList()
  getSymbolList()
  getStartegyList(strategy_is_deleted.value)
  获取现货所有usdt交易对()
  // intervalId.value = setInterval(() => {
  //     if (dialogVisible.value) {
  //         return;
  //     }
  //     getStartegyList();
  // }, 3000); // Run this every second
})

onBeforeUnmount(() => { })

const getTagType = (position_side) => {
  if (position_side === 'LONG') return 'success'
  if (position_side === 'SHORT') return 'danger'
  if (position_side === 'BOTH') return 'warning' // 或其他 ElementUI tag 的类型
  return '' // 默认值
}

const getTagLabel = (position_side) => {
  if (position_side === 'LONG') return '做多'
  if (position_side === 'SHORT') return '做空'
  if (position_side === 'BOTH') return '双向' // 您可以根据需要更改这里的文本
  return '' // 默认值
}

//刷新时也保持展开状态
const expandedRowKeys = ref([])
const onExpandChange = (row, expanded) => {
  // console.log(row, expanded);
  expandedRowKeys.value = expanded.value
}

const multipleSelection = ref({})
const handleSelectionChangeInner = (val, parent_row_id) => {
  // console.log(val, parent_row_id)
  // 判断parent_row_id是否在multipleSelection中
  multipleSelection.value[parent_row_id] = val
}

const selectedStrategy = ref(null) // 被选中的策略

// 选择策略的处理函数
const handleSelectionChangeOuter = (selected) => {
  // console.log(selected);
  selectedStrategy.value = selected
}

const handleClose = (done) => {
  dialogVisible.value = false
  // logDialogVisible.value = false;
  done()
}
const copyHandleClose = (done) => {
  copyDialogVisible.value = false
  // logDialogVisible.value = false;
  done()
}
const mockHandleClose = (done) => {
  mockDialogVisible.value = false
  // logDialogVisible.value = false;
  done()
}
const copyDialogVisible = ref(false)
const mockDialogVisible = ref(false)
const singleTableRef = ref(null)
const setCurrent = (row) => {
  singleTableRef.value.setCurrentRow(row)
}
const 对冲马丁策略id = ref(null)
const target_copy_id = ref(null)
const strategy_index_options = ref([]) //复制策略信息的列表
const 当前策略对应的对冲马丁的策略列表 = ref([])

//复制币种信息
const copySymbolsInfo = () => {
  if (!selectedStrategy.value) {
    console.warn('请先选择一个策略!')
    ElMessage.warning('请先选择一个策略!')
    return
  }
  copyDialogVisible.value = true
}
//确认复制信息
const submitCopySymbolStrategy = async () => {
  currentStrategy.value = { ...selectedStrategy.value }
  console.log(target_copy_id.value, currentStrategy.value)
  try {
    const res = await api_复制交易对信息(target_copy_id.value, currentStrategy.value.symbol_infos)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '复制交易对信息成功',
        type: 'success',
      })
      copyDialogVisible.value = false
    } else {
      ElMessage({
        message: '复制交易对信息失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '复制交易对信息失败：' + error,
      type: 'error',
    })
  }
}

// 复制策略的方法
const copyStrategy = () => {
  //先清空原来的交易所选项
  exchange_info.value = {}
  if (!selectedStrategy.value) {
    console.warn('请先选择一个策略!')
    ElMessage.warning('请先选择一个策略!')
    return
  }
  currentStrategy.value = { ...selectedStrategy.value }

  dialogTitle.value = '新增双马丁策略'
  exchange_info.value.id = currentStrategy.value.exchange_id
  // 需要先判断exchange_options是否为空 然后通过exchange_options找到对应的交易所名称
  const currentExchange = exchange_options.value.find((exchange) => {
    return exchange.id === currentStrategy.value.exchange_id
  })
  exchange_info.value.exchange_name = currentExchange.exchange_name
  // 循环 currentStrategy.value.symbol_infos 给symbol_options加入对应的symbol
  currentStrategy.value.symbols = []
  for (let key in symbol_precisions) {
    delete symbol_precisions[key]
  }
  currentStrategy.value.symbol_infos.forEach((symbol_info) => {
    symbol_precisions[symbol_info['symbol']] = symbol_info['symbol_price_precision']
    currentStrategy.value.symbols.push(symbol_info['symbol'])
  })
  updateSymbolPrecisionFields(currentStrategy.value.symbols)
  currentStrategy.value.id = null
  currentStrategy.value.is_run = false
  setCurrent()
  dialogVisible.value = true
}

const currentStrategy = ref({})
watch(() => currentStrategy.value.cover_stop_num, (val) => {
  if (val === '') {
    currentStrategy.value.cover_stop_num = null;
  }
});

watch(() => currentStrategy.value.live_order_num, (val) => {
  // 如果是非数字的或者小于等于1的 统一转成1
  if (val === null || isNaN(val) || val <= 1) {
    currentStrategy.value.live_order_num = 1;
  }
  // 求currentStrategy.cover_stop_num跟currentStrategy.all_cover_order_count的最小值
  if (currentStrategy.value.cover_stop_num && currentStrategy.value.all_cover_order_count) {
    let max = Math.min(currentStrategy.value.cover_stop_num, currentStrategy.value.all_cover_order_count)
    if (currentStrategy.value.live_order_num > max) {
      currentStrategy.value.live_order_num = max
    }
  }
});

const symbol_precisions = reactive({})
const symbol_options = ref([])
function updateSymbolPrecisionFields(symbols) {
  // console.log(symbol_precisions)
  const newSymbolPrecisions = {}
  symbols.forEach((symbol) => {
    newSymbolPrecisions[symbol] = symbol_precisions[symbol] || '' // 保留已经填写的精度值，或者初始化为空字符串
  })
  for (const key in symbol_precisions) {
    if (!newSymbolPrecisions[key]) {
      delete symbol_precisions[key]
    }
  }
  for (const key in newSymbolPrecisions) {
    symbol_precisions[key] = newSymbolPrecisions[key]
  }
}
const handle_repull_take_profit_num = () => {
  // 手动处理输入的值 如果可以转成数字就转数字，不能转数字就改成0
  const inputValue = currentStrategy.value.repull_take_profit_num
  console.log(inputValue)
  if (isNaN(inputValue)) {
    currentStrategy.value.repull_take_profit_num = 0
  } else {
    currentStrategy.value.repull_take_profit_num = parseFloat(inputValue)
  }
  console.log(currentStrategy.value.repull_take_profit_num)
}
const 当前策略对应的对冲马丁的策略改变 = () => {
  currentStrategy.value.hedge_mading_strategy_id = 对冲马丁策略id.value
}
function currentStrategy_init() {
  currentStrategy.value = {
    id: null, // 唯一标识
    trade_type: 'futures', //交易类型
    strategy_note: '', // 策略备注
    exchange_id: null, // 交易所ID
    exchange_name: null, // 交易所名称
    symbols: [], // 交易对
    symbol_precisions: {}, // 交易对精度字典
    position_side: 'LONG', // 持仓方向
    pos_value_1st: null, // 首单价值
    cover_order_pos_value_1st: null, // 补单首单价值
    all_cover_order_count: null, // 补单次数
    price_pct_trigger_cover: null, // 补单百分比
    cover_value_mult: null, // 补单倍数
    accel_cover_pct: null, // 加速补单百分比
    //----------------------------------叠加补单
    open_add_cover: false,//是否开启叠加补单
    add_cover_order_pos_value_1st: null, // 叠加补单首单价值
    add_all_cover_order_count: null, // 叠加补单次数
    add_price_pct_trigger_cover: null, //叠加补单百分比
    add_cover_value_mult: null, // 叠加补单倍数
    add_accel_cover_pct: null, // 叠加加速补单百分比
    //------------------------------------横盘重挂止盈
    open_hp_order_reset_take_profit: false,//是否开启横盘重挂止盈
    when_trigger_hg_order_reset_take_profit: null,//本轮开始几分钟后触发横盘重挂止盈
    when_hg_repull_take_profit: null,//第几单后横盘重挂止盈
    hg_repull_take_profit_num: null,//横盘重挂止盈大小
    when_trigger_hg_order_reset_take_profit1: null,//本轮开始几分钟后触发横盘重挂止盈
    when_hg_repull_take_profit1: null,//第几单后横盘重挂止盈
    hg_repull_take_profit_num1: null,//横盘重挂止盈大小
    when_trigger_hg_order_reset_take_profit2: null,//本轮开始几分钟后触发横盘重挂止盈
    when_hg_repull_take_profit2: null,//第几单后横盘重挂止盈
    hg_repull_take_profit_num2: null,//横盘重挂止盈大小
    //------------------------------------防瀑布功能
    open_prevent_falls: false,//是否开启防瀑布功能
    falls_second_num: null,//防瀑布功能-几秒内
    falls_cover_num: null,//防瀑布功能-补单多少次
    open_falls_tigger_pause: false,//防瀑布功能-触发后暂停补单
    open_falls_tigger_wx_alarm: false,//防瀑布功能-触发后微信告警
    cover_order_pause_num: null, //补到多少单暂停补单

    open_hedge_mading: false, // 是否开启对冲马丁
    tigger_hedge_mading_num: null, // 对冲马丁第几单触发
    hedge_mading_cover_pos_value_1st: null, // 对冲马丁首单价值
    open_tigger_hedge_mading_stop_cover: false, // 是否开启对冲马丁触发后停止补单
    tigger_hedge_mading_cover_num: null, // 对冲马丁第几单触发补单
    hedge_mading_pos_value_1st: null, // 对冲马丁补单首单价值
    hedge_mading_cover_mult: null, // 对冲马丁补单倍数
    open_take_profit: false, // 是否开启止盈
    take_profit_type: 'price', // 止盈类型
    take_profit_price: null, // 止盈价格
    take_profit_percent: null, // 止盈百分比
    open_float_take_profit: false, // 是否开启浮动止盈
    float_take_profit_price: null, // 浮动止盈价格
    open_float_take_profit_back: false, // 是否开启浮动止盈回撤
    float_take_profit_back_price: null, // 浮动止盈回撤价格
    open_stop_profit: false, // 是否开启止损
    cover_stop_num: null, // 补到多少单停止
    cover_alarm_num: null, // 补到多少单告警
    stop_profit_wait_time: 0, //止损等待时间
    after_stop_profit_auto_pause: false, // 止损后自动暂停
    before_stop_profit_wait_time: 0, //止损前等待时间
    open_stop_profit_switch_hedge_mading: false, // 打开止损后自动切换到对冲马丁策略
    take_profit_together: false, // 同时止盈
    when_take_profit: null, // 第几单开始止盈
    when_repull_take_profit: null, // 第几单后重挂止盈
    repull_take_profit_num: null, // 重挂止盈大小
    open_high_order_reset_take_profit: false, // 高单重置止盈
  }
}

const exchange_info = ref({
  id: '',
  exchange_name: '',
})
const exchange = ref({
  id: '',
  exchange_name: '',
})
const dialogVisible = ref(false)
const dialogTitle = ref('新增双马丁策略')
function addStrategy() {
  dialogTitle.value = '新增双马丁策略'
  // 清空currentStrategy
  currentStrategy_init()
  exchange_info.value = {
    id: '',
    exchange_name: '',
  }
  dialogVisible.value = true
}

// 编辑双马丁策略
function editStrategy(item) {
  console.log(item)
  dialogTitle.value = '编辑双马丁策略'
  当前策略对应的对冲马丁的策略列表.value = []
  currentStrategy.value = item
  if (currentStrategy.value.trade_type === 'spot') {
    symbol_options.value = [...spot_all_symbols.value]
  } else {
    symbol_options.value = [...futures_all_symbols.value]
  }
  smading_strategy_list.value.forEach((strategy, index) => {
    // console.log(strategy.exchange_name, currentStrategy.value.exchange_name, strategy.position_side, currentStrategy.value.position_side)
    if (
      strategy.exchange_name == currentStrategy.value.exchange_name &&
      currentStrategy.value.position_side == 'BOTH' &&
      strategy.position_side != 'BOTH'
    ) {
      const 持仓方向 = strategy.position_side === 'LONG' ? '做多' : '做空'
      const _data = {
        value: strategy.id,
        label: strategy.exchange_name + '-' + strategy.strategy_note + '-' + 持仓方向,
      }
      当前策略对应的对冲马丁的策略列表.value.push(_data)
    }
  })
  // console.log("当前策略对应的对冲马丁的策略列表", 当前策略对应的对冲马丁的策略列表.value)
  // 需要先判断exchange_options是否为空 然后通过exchange_options找到对应的交易所名称
  const currentExchange = exchange_options.value.find((exchange) => {
    return exchange.id === item.exchange_id
  })
  对冲马丁策略id.value = currentStrategy.value.hedge_mading_strategy_id
  exchange_info.value = currentExchange
  // 循环 currentStrategy.value.symbol_infos 给symbol_options加入对应的symbol
  currentStrategy.value.symbols = []
  for (let key in symbol_precisions) {
    delete symbol_precisions[key]
  }
  if (currentStrategy.value.symbol_infos && currentStrategy.value.symbol_infos.length > 0) {
    currentStrategy.value.symbol_infos.forEach((symbol_info) => {
      symbol_precisions[symbol_info['symbol']] = symbol_info['symbol_price_precision']
      currentStrategy.value.symbols.push(symbol_info['symbol'])
    })
    updateSymbolPrecisionFields(currentStrategy.value.symbols)
  }

  // console.log(exchange_info)
  // exchange_info.value.exchange_name = item.exchange_name;
  dialogVisible.value = true
}
const 选择交易所 = async () => {
  if (currentStrategy.value.exchange == 'binance') {
    symbol_options.value = [...futures_all_symbols.value]
  } else if (currentStrategy.value.exchange == 'gate') {
    symbol_options.value = [...spot_all_symbols.value]

  }
}

const 选择交易类型 = async () => {
  if (currentStrategy.value.trade_type == 'futures') {
    symbol_options.value = [...futures_all_symbols.value]
  } else if (currentStrategy.value.trade_type == 'spot') {
    symbol_options.value = [...spot_all_symbols.value]
    currentStrategy.value.position_side = 'LONG'
  }
}

const futures_all_symbols = ref([])
// 获取交易对信息
async function getSymbolList() {
  try {
    const res = await api_获取交易对列表()
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      futures_all_symbols.value = res.data.data
      symbol_options.value = [...futures_all_symbols.value]
    } else {
      ElMessage({
        message: '查询交易对列表失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '查询交易对列表失败：' + error,
      type: 'error',
    })
  }
}

const getTradeTypeName = (tradeType) => {
  switch (tradeType) {
    case 'futures':
      return '合约'
    case 'spot':
      return '现货'
    case 'leverage':
      return '杠杆'
    // 可以继续添加其他case
    default:
      return ''
  }
}
const spot_all_symbols = ref([])
async function 获取现货所有usdt交易对() {
  try {
    const res = await api_获取现货所有usdt交易对()
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      spot_all_symbols.value = res.data.data
    } else {
      ElMessage({
        message: '获取现货所有usdt交易对失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '获取现货所有usdt交易对失败：' + error,
      type: 'error',
    })
  }
}

const exchange_options = ref([])
const buzz_exchange_options = ref([
  {
    id: 'binance',
    exchange_name: '币安',
  },
  {
    id: 'gate',
    exchange_name: 'Gate',
  }
])
// 更新交易所信息
async function 更新交易所信息() {
  try {
    const res = await 查询当前用户的所有交易所信息()
    // console.log("res", res);
    if (res.status === 200) {
      // console.log(res.data.data);
      exchange_options.value = res.data.data
    }
  } catch (error) {
    ElMessage({
      message: '查询当前用户的所有交易所信息失败：' + error,
      type: 'error',
    })
  }
}
// 获取交易所信息
async function getExchangeInfoList() {
  try {
    const res = await 查询当前用户的所有交易所信息()
    // console.log("res", res);
    if (res.status === 200) {
      // console.log(res.data.data);
      exchange_options.value = res.data.data
    }
  } catch (error) {
    ElMessage({
      message: '查询当前用户的所有交易所信息失败：' + error,
      type: 'error',
    })
  }
}

// 储存双马丁策略列表的数组
const smading_strategy_list = ref([])
// 获取策略信息
async function getStartegyList(is_deleted) {
  try {
    const res = await api_获取双马丁策略列表(is_deleted)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      smading_strategy_list.value = res.data.data
      // 遍历samding_strategy_list
      strategy_index_options.value = []
      smading_strategy_list.value.forEach((strategy, index) => {
        const _data = {
          value: strategy.id,
          label: strategy.exchange_name + '-' + strategy.strategy_note,
        }
        strategy_index_options.value.push(_data)
      })
      ElMessage({
        message: '查询双马丁策略列表成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '查询双马丁策略列表失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '查询双马丁策略列表失败：' + error,
      type: 'error',
    })
  }
}

const 禁用策略 = async (row, tag) => {
  currentStrategy.value = row
  currentStrategy.value.is_deleted = tag
  try {
    const res = await api_更新指定id的双马丁策略(currentStrategy.value.id, currentStrategy.value)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);

      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '更新双马丁策略成功',
        type: 'success',
      })
      dialogVisible.value = false
    } else {
      ElMessage({
        message: '更新双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '更新双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const mock_positon_side = ref('')
const mock_long_table_list = ref([])
const mock_short_table_list = ref([])
const 模拟数据 = async () => {
  currentStrategy.value.exchange_id = exchange_info.value.id
  currentStrategy.value.exchange_name = exchange_info.value.exchange_name
  // 遍历symbol_precisions 如果精度是空字符串的就转成0
  for (const key in symbol_precisions) {
    if (!symbol_precisions[key]) {
      symbol_precisions[key] = 0
    }
  }
  currentStrategy.value.symbol = mock_symbol.value
  currentStrategy.value.symbol_precisions = symbol_precisions
  try {
    const res = await api_模拟数据(currentStrategy.value)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      console.log(res.data.data)
      mock_long_table_list.value = res.data.data.long
      mock_short_table_list.value = res.data.data.short
      if (res.data.data.hasOwnProperty('long') && res.data.data.hasOwnProperty('short')) {
        mock_positon_side.value = 'both'
      } else if (res.data.data.hasOwnProperty('short')) {
        mock_positon_side.value = 'short'
      } else if (res.data.data.hasOwnProperty('long')) {
        mock_positon_side.value = 'long'
      } else {
        mock_positon_side.value = ''
      }
      ElMessage({
        message: '模拟数据成功',
        type: 'success',
      })
      mockDialogVisible.value = true
    } else {
      ElMessage({
        message: '模拟数据失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '模拟数据失败：' + error,
      type: 'error',
    })
  }
}

async function submitStrategy() {
  currentStrategy.value.exchange_id = exchange_info.value.id
  currentStrategy.value.exchange_name = exchange_info.value.exchange_name
  // 遍历symbol_precisions 如果精度是空字符串的就转成0
  for (const key in symbol_precisions) {
    if (!symbol_precisions[key]) {
      symbol_precisions[key] = 0
    }
  }
  currentStrategy.value.symbol_precisions = symbol_precisions
  console.log(currentStrategy.value)
  if (currentStrategy.value.id) {
    try {
      const res = await api_更新指定id的双马丁策略(currentStrategy.value.id, currentStrategy.value)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);

        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '更新双马丁策略成功',
          type: 'success',
        })
        dialogVisible.value = false
      } else {
        ElMessage({
          message: '更新双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '更新双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    try {
      const res = await api_新增双马丁策略(currentStrategy.value)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '新增双马丁策略成功',
          type: 'success',
        })
        dialogVisible.value = false
      } else {
        ElMessage({
          message: '新增双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '新增双马丁策略失败：' + error,
        type: 'error',
      })
    }
  }
}

// 删除策略的处理函数
const deleteStrategy = async (row) => {
  try {
    const res = await api_删除指定id的双马丁策略(row.id)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '删除双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '删除双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '删除双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

// 删除交易对策略的处理函数
const deleteSymbolStrategy = async (row) => {
  try {
    const res = await api_删除指定id的交易对双马丁策略(row.id)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '删除交易对双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '删除交易对双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '删除交易对双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const stopSymbolStrategy = async (row) => {
  const _data = []
  _data.push(row)
  try {
    const res = await api_停止指定id的双马丁策略(_data)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '停止交易对双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '停止交易对双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '停止交易对双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const startSymbolStrategy = async (row) => {
  const _data = []
  _data.push(row)
  console.log(_data, row.value)
  try {
    const res = await api_启动指定id的双马丁策略(_data)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '启动交易对双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '启动交易对双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '启动交易对双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const pauseSymbolStrategy = async (row) => {
  const _data = []
  _data.push(row)
  console.log(_data, row.value)
  try {
    const res = await api_暂停指定id的双马丁策略(_data)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '暂停交易对双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '暂停交易对双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '暂停交易对双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const continueSymbolStrategy = async (row) => {
  const _data = []
  _data.push(row)
  console.log(_data, row.value)
  try {
    const res = await api_恢复指定id的双马丁策略(_data)
    // console.log("res", res);
    if (res.status === 200 && res.data.code === 200) {
      // console.log(res.data.data);
      await getStartegyList(strategy_is_deleted.value)
      ElMessage({
        message: '恢复交易对双马丁策略成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '恢复交易对双马丁策略失败：' + res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    ElMessage({
      message: '恢复交易对双马丁策略失败：' + error,
      type: 'error',
    })
  }
}

const selectStartSymbolStrategy = async (parent_row) => {
  // console.log(parent_row, parent_row.id)
  // console.log(multipleSelection.value[parent_row.id])
  const selected = multipleSelection.value[parent_row.id]
  if (selected && selected.length > 0) {
    try {
      const res = await api_启动指定id的双马丁策略(selected)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '启动交易对双马丁策略成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '启动交易对双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '启动交易对双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请先选择一个交易对策略',
      type: 'error',
    })
  }
}

const selectStopSymbolStrategy = async (parent_row) => {
  const selected = multipleSelection.value[parent_row.id]
  if (selected && selected.length > 0) {
    try {
      const res = await api_停止指定id的双马丁策略(selected)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '停止交易对双马丁策略成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '停止交易对双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '停止交易对双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请先选择一个交易对策略',
      type: 'error',
    })
  }
}

const selectDeleteSymbolStrategy = async (parent_row) => {
  const ids = []
  multipleSelection.value[parent_row.id].forEach((item) => {
    ids.push(item.id)
  })
  if (ids && ids.length > 0) {
    try {
      const res = await api_删除指定ids的交易对双马丁策略(ids)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '删除交易对双马丁策略成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '删除交易对双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '删除交易对双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请先选择一个交易对策略',
      type: 'error',
    })
  }
}

const selectPauseSymbolStrategy = async (parent_row) => {
  const selected = multipleSelection.value[parent_row.id]
  if (selected && selected.length > 0) {
    try {
      const res = await api_暂停指定id的双马丁策略(selected)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '暂停交易对双马丁策略成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '暂停交易对双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '暂停交易对双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请先选择一个交易对策略',
      type: 'error',
    })
  }
}

const selectContinueSymbolStrategy = async (parent_row) => {
  const selected = multipleSelection.value[parent_row.id]
  if (selected && selected.length > 0) {
    try {
      const res = await api_恢复指定id的双马丁策略(selected)
      // console.log("res", res);
      if (res.status === 200 && res.data.code === 200) {
        // console.log(res.data.data);
        await getStartegyList(strategy_is_deleted.value)
        ElMessage({
          message: '恢复交易对双马丁策略成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '恢复交易对双马丁策略失败：' + res.data.msg,
          type: 'error',
        })
      }
    } catch (error) {
      ElMessage({
        message: '恢复交易对双马丁策略失败：' + error,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请先选择一个交易对策略',
      type: 'error',
    })
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

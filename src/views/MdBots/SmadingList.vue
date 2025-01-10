<template>
	<div class="common-layout">
		<el-container>
			<el-header height="120">
				<el-form :model="form_data" label-width="auto">
					<el-row :gutter="20" style="margin-top: 30px">
						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-form-item label="策略名称">
								<el-input v-model="form_data.name" />
							</el-form-item>
						</el-col>

						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-form-item label="创建人">
								<el-input v-model="form_data.username" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-form-item label="是否共享">
								<el-select v-model="form_data.is_share" clearable placeholder="请选择" style="width: 100%">
									<el-option label="是" :value="true" />
									<el-option label="否" :value="false" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-form-item label="是否运行中">
								<el-select v-model="form_data.is_run" clearable placeholder="请选择" style="width: 100%">
									<el-option label="是" :value="true" />
									<el-option label="否" :value="false" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-form-item label="是否禁用">
								<el-select v-model="form_data.is_ban" clearable placeholder="请选择" style="width: 100%">
									<el-option label="是" :value="true" />
									<el-option label="否" :value="false" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
							<el-button type="primary" @click="get_strategy_page()">查询</el-button>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
							<el-button type="primary" @click="addStrategy()" v-if="show">新增策略</el-button>
							<el-button type="primary" @click="copyStrategy()">复制选中策略</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-header>
			<el-main>
				<el-table ref="singleTableRef" :data="strategy_list" table-layout="fixed" border highlight-current-row @current-change="handleSelectionChangeOuter" row-key="id">
					<el-table-column type="index" width="55" label="序号" align="center" />

					<el-table-column prop="name" label="策略名称" :min-width="300" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="username" label="创建人" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column label="持仓方向" width="90" show-overflow-tooltip align="center">
						<template #default="{ row }">
							<el-tag :type="getTagType(row.position_side)" effect="dark">
								{{ getTagLabel(row.position_side) }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="all_count" label="总数量" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="all_profit" label="总盈利(USDT)" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="running_count" label="运行中数量" width="100" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="running_profit" label="运行中盈利" width="100" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="180" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="update_time" label="修改时间" width="180" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column label="是否共享" width="110" show-overflow-tooltip align="center">
						<template #header>
							<span>是否共享</span>
							<el-tooltip placement="top" effect="dark">
								<template #content>
									是否共享:
									<br />
									打开后本策略会公开给所有订阅会员
									<br />
								</template>
								<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
									<QuestionFilled />
								</el-icon>
							</el-tooltip>
						</template>
						<template #default="{ row }">
							{{ row.is_share ? '是' : '否' }}
						</template>
					</el-table-column>
					<el-table-column label="是否禁用" width="90" show-overflow-tooltip align="center">
						<template #default="{ row }">
							{{ row.is_ban ? '是' : '否' }}
						</template>
					</el-table-column>
					<el-table-column label="其他操作" width="220" align="center">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="禁用策略(row, true)" v-if="row.is_share" plain>取消共享</el-button>
							<el-button type="primary" size="small" @click="禁用策略(row, false)" v-if="!row.is_share" plain>共享</el-button>
							<el-button type="danger" size="small" @click="禁用策略(row, true)" v-if="!row.is_ban" plain>禁用</el-button>
							<el-button type="success" size="small" @click="禁用策略(row, false)" v-if="row.is_ban" plain>启用</el-button>
							<el-button type="danger" size="small" @click="deleteStrategy(row)" plain>删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="运行中" width="90" show-overflow-tooltip align="center" fixed="right">
						<template #default="{ row }">
							<el-tag :type="row.is_run ? 'success' : 'danger'" effect="dark">
								{{ row.is_run ? '是' : '否' }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="220" align="center" fixed="right">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="editStrategy(row)" plain>编辑策略</el-button>
							<el-button type="primary" size="small" @click="viewDetail(row)" plain>查看策略明细</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-model:current-page="page" style="margin-top: 20px" v-model:page-size="size" :page-sizes="[10, 20, 50, 100]" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" default-page-size="10" />

				<el-dialog v-model="dialogVisible" :title="dialogTitle" width="65%" :before-close="handleClose" :close-on-click-modal="false" @closed="关闭策略明细弹窗()">
					<el-form :model="current_strategy" label-width="150px">
						<div class="dialog-content">
							<el-card class="box-card" style="margin-bottom: 20px; margin-right: 20px; margin-left: 20px; margin-top: 20px">
								<template #header>
									<div class="card-header">
										<span>马丁策略基础设置</span>
									</div>
								</template>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
										<el-form-item label="策略名称" required>
											<el-input v-model="current_strategy.name" autosize type="textarea" placeholder="请输入策略的名称" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
										<div>
											<el-form-item label="马丁持仓方向" required>
												<el-radio-group v-model="current_strategy.position_side" class="my-radio-group">
													<el-radio-button :label="'LONG'" class="my-radio-33">
														<template #default>做多</template>
													</el-radio-button>
													<el-radio-button :label="'SHORT'" class="my-radio-33" :disabled="current_strategy.trade_type === 'spot'">
														<template #default>做空</template>
													</el-radio-button>
													<el-radio-button :label="'BOTH'" class="my-radio-33" :disabled="current_strategy.trade_type === 'spot'">
														<template #default>双向</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :span="6"></el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<div>
											<el-form-item required>
												<template #label>
													高单重挂止盈
													<el-tooltip placement="top" effect="dark" class="box-item">
														<template #content>
															设置示例：第70单后设置止盈为 -5usdt。
															<br />
															高单重挂止盈的意思：
															<br />
															比如第70单后挂的止盈单，止盈之后会有5u的亏损
															<br />
															好处是更容易解套，但是牺牲了一些利润。
														</template>
														<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
															<QuestionFilled />
														</el-icon>
													</el-tooltip>
												</template>
												<el-radio-group v-model.number="current_strategy.open_high_order_reset_take_profit" class="my-radio-group">
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
									<el-col :span="12" v-if="current_strategy.open_high_order_reset_take_profit">
										<el-form-item label="第几单后重挂止盈" required>
											<el-input type="number" v-model.number="current_strategy.when_repull_take_profit"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12" v-if="current_strategy.open_high_order_reset_take_profit">
										<el-form-item label="重挂止盈大小" required>
											<el-input type="number" v-model="current_strategy.repull_take_profit_num" @change="handle_repull_take_profit_num">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-card>
							<el-card class="box-card" style="margin-right: 20px; margin-left: 20px" v-if="show && (current_strategy.position_side === 'BOTH' || current_strategy.position_side === 'LONG')">
								<template #header>
									<div class="card-header">
										<span>做多下单设置</span>
									</div>
								</template>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="首单" required>
											<el-input type="number" v-model.number="current_strategy.long_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单首单" required>
											<el-input type="number" v-model.number="current_strategy.long_cover_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="活跃订单" required>
											<el-input v-model.number="current_strategy.long_act_order_num" placeholder="一次性挂多少个补单">
												<template #append>个</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单次数" required>
											<el-input v-model.number="current_strategy.long_cover_order_num">
												<template #append>次</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="波动参照" required>
												<el-radio-group v-model.number="current_strategy.long_bdcz" class="my-radio-group">
													<el-radio-button :label="1" class="my-radio-50">
														<template #default>首单</template>
													</el-radio-button>
													<el-radio-button :label="2" class="my-radio-50">
														<template #default>上一单</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单波动" required>
											<el-input v-model.number="current_strategy.long_bdbd" type="number">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单倍数" required>
											<el-input-number type="number" v-model.number="current_strategy.long_cover_value_mult" :precision="4" :step="0.01">
												<template #append>倍</template>
											</el-input-number>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="加速补单" required>
											<el-input type="number" v-model.number="current_strategy.long_accel_cover" placeholder="正数加快补单负数放慢补单">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="24">
										<div>
											<el-form-item label="止盈方式" required>
												<el-radio-group v-model="current_strategy.long_take_profit_type" class="my-radio-group">
													<el-radio-button :label="'price'" class="my-radio-25">
														<template #default>固定止盈</template>
													</el-radio-button>
													<el-radio-button :label="'percent'" class="my-radio-25">
														<template #default>百分比止盈</template>
													</el-radio-button>
													<el-radio-button :label="'mix_min'" class="my-radio-25">
														<template #default>混合止盈(取最小值)</template>
													</el-radio-button>
													<el-radio-button :label="'mix_max'" class="my-radio-25">
														<template #default>混合止盈(取最大值)</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_take_profit_type === 'price' || current_strategy.long_take_profit_type === 'mix_min' || current_strategy.long_take_profit_type === 'mix_max'">
										<el-form-item label="止盈价格" required>
											<el-input type="number" v-model.number="current_strategy.long_take_profit_price">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_take_profit_type === 'percent' || current_strategy.long_take_profit_type === 'mix_min' || current_strategy.long_take_profit_type === 'mix_max'">
										<el-form-item label="止盈百分比" required>
											<el-input type="number" v-model.number="current_strategy.long_take_profit_percent">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="做多止损" required>
											<el-radio-group v-model.number="current_strategy.long_stop_loss" class="my-radio-group">
												<el-radio-button :label="true" class="my-radio-50">
													<template #default>开启</template>
												</el-radio-button>
												<el-radio-button :label="false" class="my-radio-50">
													<template #default>关闭</template>
												</el-radio-button>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_stop_loss">
										<el-form-item label="止损后自动暂停" required>
											<el-radio-group v-model.number="current_strategy.long_after_stop_profit_auto_pause" class="my-radio-group">
												<el-radio-button :label="true" class="my-radio-50">
													<template #default>开启</template>
												</el-radio-button>
												<el-radio-button :label="false" class="my-radio-50">
													<template #default>关闭</template>
												</el-radio-button>
											</el-radio-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_stop_loss">
										<el-form-item label="止损前等待" required>
											<template #label>
												止损前等待
												<el-tooltip placement="top" effect="dark" class="box-item">
													<template #content>
														止损前等待多少秒:
														<br />
														比如设置5秒，则第一次检测到满足止损条件后会等待5秒
														<br />
														等待期间如果有不满足止损条件则退出等待不会触发止损
														<br />
														等待结束后如果依然满足止损条件则触发止损
													</template>
													<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
														<QuestionFilled />
													</el-icon>
												</el-tooltip>
											</template>
											<el-input type="number" v-model.number="current_strategy.long_stop_loss_wait_time">
												<template #append>秒</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_stop_loss">
										<el-form-item label="浮亏多少止损" required>
											<el-input type="number" v-model.number="current_strategy.long_stop_loss_usdt">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-card>

							<el-card class="box-card" style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px" v-if="show && (current_strategy.position_side === 'BOTH' || current_strategy.position_side === 'LONG')">
								<template #header>
									<div class="card-header">
										<span>做多叠加补单设置</span>
									</div>
								</template>

								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="做多叠加补单" required>
												<el-radio-group v-model.number="current_strategy.long_dj_open" class="my-radio-group">
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
								<el-row :gutter="20" v-if="current_strategy.long_dj_open">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单首单" required>
											<el-input type="number" v-model.number="current_strategy.long_dj_cover_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单次数" required>
											<el-input v-model.number="current_strategy.long_dj_cover_order_num">
												<template #append>次</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="波动参照" required>
												<el-radio-group v-model.number="current_strategy.long_dj_bdcz" class="my-radio-group">
													<el-radio-button :label="1" class="my-radio-50">
														<template #default>首单</template>
													</el-radio-button>
													<el-radio-button :label="2" class="my-radio-50">
														<template #default>上一单</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单波动" required>
											<el-input v-model.number="current_strategy.long_dj_bdbd" type="number">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20" v-if="current_strategy.long_dj_open">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单倍数" required>
											<el-input-number type="number" v-model.number="current_strategy.long_dj_cover_value_mult" :precision="4" :step="0.01">
												<template #append>倍</template>
											</el-input-number>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="加速补单" required>
											<el-input type="number" v-model.number="current_strategy.long_dj_accel_cover" placeholder="正数加快补单负数放慢补单">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20" v-if="current_strategy.long_dj_open">
									<el-col :span="24">
										<div>
											<el-form-item label="止盈方式" required>
												<el-radio-group v-model="current_strategy.long_dj_take_profit_type" class="my-radio-group">
													<el-radio-button :label="'price'" class="my-radio-25">
														<template #default>固定止盈</template>
													</el-radio-button>
													<el-radio-button :label="'percent'" class="my-radio-25">
														<template #default>百分比止盈</template>
													</el-radio-button>
													<el-radio-button :label="'mix_min'" class="my-radio-25">
														<template #default>混合止盈(取最小值)</template>
													</el-radio-button>
													<el-radio-button :label="'mix_max'" class="my-radio-25">
														<template #default>混合止盈(取最大值)</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_dj_take_profit_type === 'price' || current_strategy.long_dj_take_profit_type === 'mix_min' || current_strategy.long_dj_take_profit_type === 'mix_max'">
										<el-form-item label="止盈价格" required>
											<el-input v-model.number="current_strategy.long_dj_take_profit_price">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.long_dj_take_profit_type === 'percent' || current_strategy.long_dj_take_profit_type === 'mix_min' || current_strategy.long_dj_take_profit_type === 'mix_max'">
										<el-form-item label="止盈百分比" required>
											<el-input v-model.number="current_strategy.long_dj_take_profit_percent">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-card>

							<el-card class="box-card" style="margin-right: 20px; margin-left: 20px" v-if="show && (current_strategy.position_side === 'BOTH' || current_strategy.position_side === 'SHORT')">
								<template #header>
									<div class="card-header">
										<span>做空下单设置</span>
									</div>
								</template>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="首单" required>
											<el-input type="number" v-model.number="current_strategy.short_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单首单" required>
											<el-input type="number" v-model.number="current_strategy.short_cover_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="活跃订单" required>
											<el-input v-model.number="current_strategy.short_act_order_num" placeholder="一次性挂多少个补单">
												<template #append>个</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单次数" required>
											<el-input v-model.number="current_strategy.short_cover_order_num">
												<template #append>次</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="波动参照" required>
												<el-radio-group v-model.number="current_strategy.short_bdcz" class="my-radio-group">
													<el-radio-button :label="1" class="my-radio-50">
														<template #default>首单</template>
													</el-radio-button>
													<el-radio-button :label="2" class="my-radio-50">
														<template #default>上一单</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单波动" required>
											<el-input v-model.number="current_strategy.short_bdbd" type="number">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单倍数" required>
											<el-input-number type="number" v-model.number="current_strategy.short_cover_value_mult" :precision="4" :step="0.01">
												<template #append>倍</template>
											</el-input-number>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="加速补单" required>
											<el-input type="number" v-model.number="current_strategy.short_accel_cover" placeholder="正数加快补单负数放慢补单">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="24">
										<div>
											<el-form-item label="止盈方式" required>
												<el-radio-group v-model="current_strategy.short_take_profit_type" class="my-radio-group">
													<el-radio-button :label="'price'" class="my-radio-25">
														<template #default>固定止盈</template>
													</el-radio-button>
													<el-radio-button :label="'percent'" class="my-radio-25">
														<template #default>百分比止盈</template>
													</el-radio-button>
													<el-radio-button :label="'mix_min'" class="my-radio-25">
														<template #default>混合止盈(取最小值)</template>
													</el-radio-button>
													<el-radio-button :label="'mix_max'" class="my-radio-25">
														<template #default>混合止盈(取最大值)</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_take_profit_type === 'price' || current_strategy.short_take_profit_type === 'mix_min' || current_strategy.short_take_profit_type === 'mix_max'">
										<el-form-item label="止盈价格" required>
											<el-input type="number" v-model.number="current_strategy.short_take_profit_price">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_take_profit_type === 'percent' || current_strategy.short_take_profit_type === 'mix_min' || current_strategy.short_take_profit_type === 'mix_max'">
										<el-form-item label="止盈百分比" required>
											<el-input type="number" v-model.number="current_strategy.short_take_profit_percent">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="做空止损" required>
											<el-radio-group v-model.number="current_strategy.short_stop_loss" class="my-radio-group">
												<el-radio-button :label="true" class="my-radio-50">
													<template #default>开启</template>
												</el-radio-button>
												<el-radio-button :label="false" class="my-radio-50">
													<template #default>关闭</template>
												</el-radio-button>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_stop_loss">
										<el-form-item label="止损后自动暂停" required>
											<el-radio-group v-model.number="current_strategy.short_after_stop_profit_auto_pause" class="my-radio-group">
												<el-radio-button :label="true" class="my-radio-50">
													<template #default>开启</template>
												</el-radio-button>
												<el-radio-button :label="false" class="my-radio-50">
													<template #default>关闭</template>
												</el-radio-button>
											</el-radio-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_stop_loss">
										<el-form-item label="止损前等待" required>
											<template #label>
												止损前等待
												<el-tooltip placement="top" effect="dark" class="box-item">
													<template #content>
														止损前等待多少秒:
														<br />
														比如设置5秒，则第一次检测到满足止损条件后会等待5秒
														<br />
														等待期间如果有不满足止损条件则退出等待不会触发止损
														<br />
														等待结束后如果依然满足止损条件则触发止损
													</template>
													<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
														<QuestionFilled />
													</el-icon>
												</el-tooltip>
											</template>
											<el-input type="number" v-model.number="current_strategy.short_stop_loss_wait_time">
												<template #append>秒</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_stop_loss">
										<el-form-item label="浮亏多少止损" required>
											<el-input type="number" v-model.number="current_strategy.short_stop_loss_usdt">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-card>

							<el-card class="box-card" style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px" v-if="show && (current_strategy.position_side === 'BOTH' || current_strategy.position_side === 'SHORT')">
								<template #header>
									<div class="card-header">
										<span>做空叠加补单设置</span>
									</div>
								</template>

								<el-row :gutter="20">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="做空叠加补单" required>
												<el-radio-group v-model.number="current_strategy.short_dj_open" class="my-radio-group">
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
								<el-row :gutter="20" v-if="current_strategy.short_dj_open">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单首单" required>
											<el-input type="number" v-model.number="current_strategy.short_dj_cover_1st_pos_val">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单次数" required>
											<el-input v-model.number="current_strategy.short_dj_cover_order_num">
												<template #append>次</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<div>
											<el-form-item label="波动参照" required>
												<el-radio-group v-model.number="current_strategy.short_dj_bdcz" class="my-radio-group">
													<el-radio-button :label="1" class="my-radio-50">
														<template #default>首单</template>
													</el-radio-button>
													<el-radio-button :label="2" class="my-radio-50">
														<template #default>上一单</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单波动" required>
											<el-input v-model.number="current_strategy.short_dj_bdbd" type="number">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20" v-if="current_strategy.short_dj_open">
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="补单倍数" required>
											<el-input-number type="number" v-model.number="current_strategy.short_dj_cover_value_mult" :precision="4" :step="0.01">
												<template #append>倍</template>
											</el-input-number>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
										<el-form-item label="加速补单" required>
											<el-input type="number" v-model.number="current_strategy.short_dj_accel_cover" placeholder="正数加快补单负数放慢补单">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20" v-if="current_strategy.short_dj_open">
									<el-col :span="24">
										<div>
											<el-form-item label="止盈方式" required>
												<el-radio-group v-model="current_strategy.short_dj_take_profit_type" class="my-radio-group">
													<el-radio-button :label="'price'" class="my-radio-25">
														<template #default>固定止盈</template>
													</el-radio-button>
													<el-radio-button :label="'percent'" class="my-radio-25">
														<template #default>百分比止盈</template>
													</el-radio-button>
													<el-radio-button :label="'mix_min'" class="my-radio-25">
														<template #default>混合止盈(取最小值)</template>
													</el-radio-button>
													<el-radio-button :label="'mix_max'" class="my-radio-25">
														<template #default>混合止盈(取最大值)</template>
													</el-radio-button>
												</el-radio-group>
											</el-form-item>
										</div>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_dj_take_profit_type === 'price' || current_strategy.short_dj_take_profit_type === 'mix_min' || current_strategy.short_dj_take_profit_type === 'mix_max'">
										<el-form-item label="止盈价格" required>
											<el-input type="number" v-model.number="current_strategy.short_dj_take_profit_price">
												<template #append>USDT</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="current_strategy.short_dj_take_profit_type === 'percent' || current_strategy.short_dj_take_profit_type === 'mix_min' || current_strategy.short_dj_take_profit_type === 'mix_max'">
										<el-form-item label="止盈百分比" required>
											<el-input type="number" v-model.number="current_strategy.short_dj_take_profit_percent">
												<template #append>%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-card>

							<el-card class="box-card" style="margin-top: 20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px" v-if="false">
								<template #header>
									<div class="card-header">
										<span>告警设置</span>
									</div>
								</template>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="补到多少单微信告警">
											<el-input type="number" v-model.number="current_strategy.cover_alarm_num" placeholder="比如第20补单挂上后触发告警"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="第几单暂停补单">
											<template #label>
												第几单暂停补单
												<el-tooltip placement="top" effect="dark" class="box-item">
													<template #content>填数字。不填就不启用该功能，此功能一轮马丁只触发一次，止盈后自动恢复</template>
													<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
														<QuestionFilled />
													</el-icon>
												</el-tooltip>
											</template>
											<el-input type="number" v-model.number="current_strategy.cover_order_pause_num" placeholder=""></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<div>
											<el-form-item required>
												<template #label>
													防瀑布功能
													<el-tooltip placement="top" effect="dark" class="box-item">
														<template #content>
															设置示例：2秒内补了6单触发告警。
															<br />
															触发后暂停补单的意思：
															<br />
															比如触发后补到第15单,那么本来第15单补进正常应该挂16单，开启暂停补单后此时会暂停补第16单
															<br />
															也就是第16单不挂（止盈单正常挂）。
															<br />
															监控墙上会有一个按钮恢复挂单，点击之后会恢复挂单。正常挂第16单
															<br />
															好处：假如做多触发放瀑布，第15单自动暂停补单，此时币价100，暂停后一路下跌跌到60块，
															<br />
															正常已经爆仓了，但是因为暂停补单仓位很小，所以没爆仓。当判断趋势可能回弹了，点恢复挂单，
															<br />
															因为价格远低于正常补单价了，所有补单会以市价直接补进去瞬间拉低仓位，只要稍微反弹即可止盈。
															<br />
														</template>
														<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 6px">
															<QuestionFilled />
														</el-icon>
													</el-tooltip>
												</template>
												<el-radio-group v-model.number="current_strategy.open_prevent_falls" class="my-radio-group">
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
								<el-row :gutter="2" v-if="current_strategy.open_prevent_falls">
									<el-col :span="8">
										<el-form-item label="触发条件">
											<el-input type="number" v-model.number="current_strategy.falls_second_num">
												<template #append>秒内</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-input type="number" v-model.number="current_strategy.falls_cover_num">
											<template #prepend>补单</template>

											<template #append>次</template>
										</el-input>
									</el-col>
								</el-row>
								<el-row v-if="current_strategy.open_prevent_falls">
									<el-col :span="12">
										<div>
											<el-form-item label="触发后暂停补单" required>
												<el-radio-group v-model.number="current_strategy.open_falls_tigger_pause" class="my-radio-group">
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
												<el-radio-group v-model.number="current_strategy.open_falls_tigger_wx_alarm" class="my-radio-group">
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
								<el-button type="primary" @click="submitStrategy">确定</el-button>
							</el-col>
							<el-col :span="3"></el-col>
							<el-col :span="3">
								<el-select v-model="current_strategy.exchange_type" placeholder="选择交易所">
									<el-option v-for="item in exchange_options" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-col>
							<el-col :span="3">
								<el-input v-model="current_strategy.symbol" placeholder="输入交易对" />
							</el-col>
							<el-col :span="3">
								<el-button type="primary" @click="模拟数据()">模拟数据</el-button>
							</el-col>
						</el-row>
					</div>
				</el-dialog>

				<el-dialog v-model="mockDialogVisible" title="模拟数据" width="85%" :before-close="mockHandleClose" :close-on-click-modal="false">
					<el-card class="box-card" v-if="mock_positon_side === 'both' || mock_positon_side === 'long'">
						<template #header>
							<el-text class="mx-1" type="success" size="large" tag="b">做多模拟表格</el-text>
						</template>
						<el-table :data="mock_long_table_list" style="width: 100%" border highlight-current-row stripe>
							<el-table-column prop="当前补单次数" label="当前补单次数" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单数量" label="补单数量" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单价格" label="补单价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单价值" label="补单价值" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="价格波动" label="价格波动" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="仓位数量" label="仓位数量" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估仓位价格" label="预估仓位价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估仓位价值" label="预估仓位价值" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估盈利" label="预估盈利" width="120" show-overflow-tooltip align="center"></el-table-column>

							<el-table-column prop="止盈价格" label="止盈价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="价格回调多少解套" label="价格回调多少解套" width="180" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="止损价格" label="止损价格" width="100" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估止损亏损" label="预估止损亏损" width="120" show-overflow-tooltip align="center"></el-table-column>
						</el-table>
					</el-card>

					<el-card class="box-card" style="margin-top: 20px" v-if="mock_positon_side === 'both' || mock_positon_side === 'short'">
						<template #header>
							<el-text class="mx-1" type="danger" size="large" tag="b">做空模拟表格</el-text>
						</template>
						<el-table :data="mock_short_table_list" style="width: 100%" border highlight-current-row stripe>
							<el-table-column prop="当前补单次数" label="当前补单次数" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单数量" label="补单数量" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单价格" label="补单价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="补单价值" label="补单价值" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="价格波动" label="价格波动" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="仓位数量" label="仓位数量" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估仓位价格" label="预估仓位价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估仓位价值" label="预估仓位价值" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估盈利" label="预估盈利" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="止盈价格" label="止盈价格" width="120" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="价格回调多少解套" label="价格回调多少解套" width="180" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="止损价格" label="止损价格" width="100" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="预估止损亏损" label="预估止损亏损" width="120" show-overflow-tooltip align="center"></el-table-column>
						</el-table>
					</el-card>

					<div slot="footer" class="dialog-footer" style="margin-top: 20px">
						<el-button type="primary" @click="mockDialogVisible = false">关闭</el-button>
					</div>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
import { api_获取现货所有usdt交易对 } from '@/api/binance_api'
import { 查询当前用户的所有交易所信息 } from '@/api/exchange_infos_api'
import { api_芝麻现货交易对列表, api_获取交易对列表 } from '@/api/funding_rate_strategy_api'
import { api_add_strategy, api_ban_strategy, api_delete_strategy, api_get_strategy_page, api_strategy_mock, api_update_strategy, api_停止指定id的双马丁策略, api_删除指定ids的交易对双马丁策略, api_删除指定id的交易对双马丁策略, api_启动指定id的双马丁策略, api_复制交易对信息, api_恢复指定id的双马丁策略, api_暂停指定id的双马丁策略 } from '@/api/smading_strategy_api'
import * as commonConst from '@/constants/CommonConstant'
import { useMdBotsDetailStore } from '@/store/MdBots_Detail'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// 分页参数
const page = ref(1)
const size = ref(10)
const total = ref(0)

// 表单数据
const form_data = ref({
	name: null,
	username: null,
	is_share: null,
	is_run: null,
	is_ban: false,
})

// 储存双马丁策略列表的数组
const strategy_list = ref([])
const current_strategy = ref({})

const exchange_options = ref([{ value: 'Binance', label: '币安' }])

const router = useRouter()
const detailStore = useMdBotsDetailStore()

const viewDetail = (row) => {
	detailStore.setSelectedItem(row) // 保存选中的数据
	router.push({
		name: commonConst.PATH_MD_BOTS_DETAIL,
		query: { strategy_id: row.strategy_id }, // 将 ID 作为查询参数
	}) // 跳转到详情页
}
const strategy_is_deleted = ref(false)
const show = ref(true)

const filter_run = (value, row) => {
	return row.is_run === value
}
const mock_symbol = ref('')
onMounted(() => {
	get_strategy_page(page.value, size.value, form_data.value)
	// intervalId.value = setInterval(() => {
	//     if (dialogVisible.value) {
	//         return;
	//     }
	//     getStartegyList();
	// }, 3000); // Run this every second
})

onBeforeUnmount(() => {})

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
	current_strategy.value = { ...selectedStrategy.value }
	console.log(target_copy_id.value, current_strategy.value)
	try {
		const res = await api_复制交易对信息(target_copy_id.value, current_strategy.value.symbol_infos)
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
	if (!selectedStrategy.value) {
		console.warn('请先选择一个策略!')
		ElMessage.warning('请先选择一个策略!')
		return
	}
	current_strategy.value = { ...selectedStrategy.value }
	exchange_type.value = current_strategy.exchange_type
	dialogTitle.value = '新增马丁策略'
	// 循环 current_strategy.value.symbol_infos 给symbol_options加入对应的symbol
	current_strategy.value.symbols = []
	for (let key in symbol_precisions) {
		delete symbol_precisions[key]
	}
	current_strategy.value.symbol_infos.forEach((symbol_info) => {
		symbol_precisions[symbol_info['symbol']] = symbol_info['symbol_price_precision']
		current_strategy.value.symbols.push(symbol_info['symbol'])
	})
	updateSymbolPrecisionFields(current_strategy.value.symbols)
	current_strategy.value.id = null
	current_strategy.value.is_run = false
	setCurrent()
	dialogVisible.value = true
}

// watch(
// 	() => current_strategy.value.cover_stop_num,
// 	(val) => {
// 		if (val === '') {
// 			current_strategy.value.cover_stop_num = null
// 		}
// 	}
// )

watch(
	() => current_strategy.value.live_order_num,
	(val) => {
		// 如果是非数字的或者小于等于1的 统一转成1
		if (val === null || isNaN(val) || val <= 1) {
			current_strategy.value.live_order_num = 1
		}
		// 求current_strategy.cover_stop_num跟current_strategy.all_cover_order_count的最小值
		if (current_strategy.value.cover_stop_num && current_strategy.value.all_cover_order_count) {
			let max = Math.min(current_strategy.value.cover_stop_num, current_strategy.value.all_cover_order_count)
			if (current_strategy.value.live_order_num > max) {
				current_strategy.value.live_order_num = max
			}
		}
	}
)

const symbol_precisions = reactive({})
const symbol_options = ref([])
function updateSymbolPrecisionFields(symbols) {
	// console.log(symbol_precisions)
	const newSymbolPrecisions = {}
	symbols.forEach((symbol) => {
		console.log(symbol)
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
	const inputValue = current_strategy.value.repull_take_profit_num
	console.log(inputValue)
	if (isNaN(inputValue)) {
		current_strategy.value.repull_take_profit_num = 0
	} else {
		current_strategy.value.repull_take_profit_num = parseFloat(inputValue)
	}
	console.log(current_strategy.value.repull_take_profit_num)
}
const 当前策略对应的对冲马丁的策略改变 = () => {
	current_strategy.value.hedge_mading_strategy_id = 对冲马丁策略id.value
}
function current_strategy_init() {
	current_strategy.value = {
		id: null, // 唯一标识
		trade_type: 'futures', //交易类型
		strategy_note: '', // 策略备注
		exchange_type: null, // 交易所类型
		exchange_id: null, // 交易所ID
		exchange_name: null, // 交易所名称
		symbols: [], // 交易对
		symbol_precisions: {}, // 交易对精度字典
		position_side: 'LONG', // 持仓方向

		// 做多
		long_1st_pos_val: null, // 首单价值
		long_cover_1st_pos_val: null, // 补单首单价值
		long_act_order_num: null, // 活跃订单数量
		long_cover_order_num: null, // 补单次数
		long_bdcz: 1, // 波动参照
		long_bdbd: null, // 补单波动
		long_cover_value_mult: null, // 补单倍数
		long_accel_cover: null, // 加速补单百分比
		long_take_profit_type: 'price', // 止盈方式
		long_take_profit_price: null, // 固定价格止盈
		long_take_profit_percent: null, // 百分比止盈
		// 做多叠加补单
		long_dj_open: false, //是否开启叠加补单
		long_dj_cover_1st_pos_val: null, // 叠加补单首单价值
		long_dj_cover_order_num: null, // 叠加补单次数
		long_dj_bdcz: 1, // 叠加波动参照
		long_dj_bdbd: null, // 叠加补单波动
		long_dj_take_profit_type: 'price',
		long_dj_cover_value_mult: null, // 叠加补单倍数
		long_dj_accel_cover: null, // 叠加加速补单百分比
		long_stop_loss: false, // 叠加加速补单百分比

		// 做空
		short_1st_pos_val: null, // 首单价值
		short_cover_1st_pos_val: null, // 补单首单价值
		short_act_order_num: null, // 活跃订单数量
		short_cover_order_num: null, // 补单次数
		short_bdcz: 1, // 波动参照
		short_bdbd: null, // 补单波动
		short_cover_value_mult: null, // 补单倍数
		short_accel_cover: null, // 加速补单百分比
		short_take_profit_type: 'price', // 止盈方式
		short_take_profit_price: null, // 固定价格止盈
		short_take_profit_percent: null, // 百分比止盈
		// 做空叠加补单
		short_dj_open: false, //是否开启叠加补单
		short_dj_cover_1st_pos_val: null, // 叠加补单首单价值
		short_dj_cover_order_num: null, // 叠加补单次数
		short_dj_bdcz: 1, // 叠加波动参照
		short_dj_bdbd: null, // 叠加补单波动
		short_dj_take_profit_type: 'price',
		short_dj_cover_value_mult: null, // 叠加补单倍数
		short_dj_accel_cover: null, // 叠加加速补单百分比
		short_stop_loss: false, // 叠加加速补单百分比
		//------------------------------------横盘重挂止盈
		open_high_order_reset_take_profit: false, // 高单重置止盈
	}
}

const exchange_info = ref({
	id: '',
	exchange_name: '',
})
const exchange_type = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增马丁策略')
function addStrategy() {
	dialogTitle.value = '新增马丁策略'
	// 清空current_strategy
	current_strategy_init()
	dialogVisible.value = true
}

// 编辑双马丁策略
const editStrategy = async (item) => {
	dialogTitle.value = '编辑马丁策略'
	current_strategy.value = item
	current_strategy.value.exchange_type = 'Binance'
	current_strategy.value.symbol = 'pepe'
	console.log(item, typeof current_strategy.value.long_bdcz)
	dialogVisible.value = true
}

const 选择交易类型 = async () => {
	if (current_strategy.value.trade_type === 'futures') {
		symbol_options.value = futures_all_symbols.value.map((item) => ({
			value: item.symbol,
			label: item.symbol,
		}))
	} else if (current_strategy.value.trade_type === 'spot') {
		if (current_strategy.value.exchange_type === 'gate') {
			if (gate_spot_all_symbols.value.length !== symbol_options.value.length) {
				symbol_options.value = gate_spot_all_symbols.value.map((item) => ({
					value: item.symbol,
					label: item.symbol,
				}))
			}
		} else {
			if (binance_spot_all_symbols.value.length !== symbol_options.value.length) {
				symbol_options.value = binance_spot_all_symbols.value.map((item) => ({
					value: item.symbol,
					label: item.symbol,
				}))
			}
		}

		current_strategy.value.position_side = 'LONG'
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
			symbol_options.value = futures_all_symbols.value.map((item) => ({
				value: item.symbol,
				label: item.symbol,
			}))
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
const binance_spot_all_symbols = ref([])
const gate_spot_all_symbols = ref([])
async function 获取币安现货所有usdt交易对() {
	try {
		let res = []
		// 默认为币安
		res = await api_获取现货所有usdt交易对()
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			// console.log(res.data.data);
			binance_spot_all_symbols.value = res.data.data
		} else {
			ElMessage({
				message: '获取币安现货所有usdt交易对失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '获取币安现货所有usdt交易对失败：' + error,
			type: 'error',
		})
	}
}

async function 获取gate现货所有usdt交易对() {
	try {
		let res = []
		res = await api_芝麻现货交易对列表()
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			// console.log(res.data.data);
			gate_spot_all_symbols.value = res.data.data
		} else {
			ElMessage({
				message: '获取芝麻现货所有usdt交易对失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '获取芝麻现货所有usdt交易对失败：' + error,
			type: 'error',
		})
	}
}

const buzz_exchange_options = ref(['币安', 'gate'])
// 更新交易所信息
async function 更新交易所信息() {
	current_strategy.value.exchange_type = exchange_type.value
	if (current_strategy.value.exchange_type === 'gate') {
		if (gate_spot_all_symbols.value.length !== symbol_options.value.length) {
			symbol_options.value = gate_spot_all_symbols.value.map((item) => ({
				value: item.symbol,
				label: item.symbol,
			}))
		}
	} else {
		if (binance_spot_all_symbols.value.length !== symbol_options.value.length) {
			symbol_options.value = binance_spot_all_symbols.value.map((item) => ({
				value: item.symbol,
				label: item.symbol,
			}))
		}
	}
	try {
		const res = await 查询当前用户的所有交易所信息(exchange_type.value)
		// console.log("res", res);
		if (res.status === 200) {
			// console.log(res.data.data);
			exchange_options.value = res.data.data
			exchange_info.value = {}
		}
	} catch (error) {
		ElMessage({
			message: '查询当前用户的所有交易所信息失败：' + error,
			type: 'error',
		})
	}
}

const get_strategy_page = async () => {
	// 获取策略信息
	try {
		const res = await api_get_strategy_page(page.value, size.value, form_data.value)
		console.log('res', res)
		if (res.status === 200 && res.data.code === 200) {
			// console.log(res.data.data);
			strategy_list.value = res.data.data.items
			page.value = res.data.data.page
			size.value = res.data.data.size
			total.value = res.data.data.total
			// 遍历samding_strategy_list
			strategy_index_options.value = []
			strategy_list.value.forEach((strategy, index) => {
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

// 监听当前页码改变事件
const handlePageChange = (newPage) => {
	page.value = newPage
	get_strategy_page()
}

// 监听每页条数改变事件
const handleSizeChange = (newSize) => {
	size.value = newSize
	page.value = 1
	get_strategy_page()
}

const 禁用策略 = async (row, tag) => {
	current_strategy.value = row
	try {
		const res = await api_ban_strategy(current_strategy.value.strategy_id)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			// console.log(res.data.data);
			ElMessage({
				message: '更新双马丁策略成功',
				type: 'success',
			})
			get_strategy_page()
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
const keys = ['订单号', '当前补单次数', '价格波动', '补单价格', '补单数量', '仓位数量', '补单价值', '预估仓位价格', '预估仓位价值', '止盈价格', '价格回调多少解套', '预估盈利', '止损价格', '预估止损亏损']
// 定义函数，将二维数组转换为对象数组
const 模拟数据_数组转对象 = (array2d) => {
	return array2d.map((array) => {
		// 判断类型如果是对象则直接返回，如果是数组就进行下面的处理
		if (typeof array === 'object' && !Array.isArray(array)) {
			return array
		}
		const obj = {}
		for (let i = 0; i < keys.length; i++) {
			obj[keys[i]] = array[i]
		}
		return obj
	})
}
const 模拟数据 = async () => {
	if (!current_strategy.value.exchange_type) {
		ElMessage({
			message: '请先选择交易所!',
			type: 'warning',
		})
		return
	}
	if (!current_strategy.value.symbol) {
		ElMessage({
			message: '请先输入交易对!',
			type: 'warning',
		})
		return
	}
	try {
		const res = await api_strategy_mock(current_strategy.value)
		console.log('res', res)
		if (res.status === 200 && res.data.code === 200) {
			console.log(res.data.data)
			if (res.data.data.hasOwnProperty('short_data_list')) {
				mock_short_table_list.value = 模拟数据_数组转对象(res.data.data.short_data_list)
			}
			if (res.data.data.hasOwnProperty('long_data_list')) {
				mock_long_table_list.value = 模拟数据_数组转对象(res.data.data.long_data_list)
			}
			if (res.data.data.hasOwnProperty('long_data_list') && res.data.data.hasOwnProperty('short_data_list')) {
				mock_positon_side.value = 'both'
			} else if (res.data.data.hasOwnProperty('short_data_list')) {
				mock_positon_side.value = 'short'
			} else if (res.data.data.hasOwnProperty('long_data_list')) {
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

const submitStrategy = async () => {
	if (current_strategy.value.strategy_id) {
		try {
			const res = await api_update_strategy(current_strategy.value)
			// console.log("res", res);
			if (res.status === 200 && res.data.code === 200) {
				// console.log(res.data.data);
				await get_strategy_page()
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
			const res = await api_add_strategy(current_strategy.value)
			// console.log("res", res);
			if (res.status === 200 && res.data.code === 200) {
				// console.log(res.data.data);
				await get_strategy_page()
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
		const res = await api_delete_strategy(row.strategy_id)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			// console.log(res.data.data);
			get_strategy_page()
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

const 关闭策略明细弹窗 = async () => {
	// if (gate_spot_all_symbols.value.length !== symbol_options.value.length) {
	//   await nextTick() // 等待DOM更新
	//   symbol_options.value = [...gate_spot_all_symbols.value]
	// }
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

.my-radio-25 {
	width: 25%;

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

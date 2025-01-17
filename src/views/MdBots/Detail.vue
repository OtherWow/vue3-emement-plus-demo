<template>
	<el-row>
		<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
			<el-row>
				<el-col :span="24">
					<el-card>
						<template #header>
							<div class="card-header">
								<span>策略信息</span>
							</div>
						</template>
						<el-row>
							<el-col style="text-align: center">
								<el-tag type="warning" effect="dark" size="large" style="font-weight: bold; font-size: 14px">
									{{ detail.name }}
								</el-tag>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-table :data="detail_table" style="width: 100%" show-header="false" :fit="true" size="small">
									<el-table-column prop="title" align="right" />
									<el-table-column prop="data" align="left" />
								</el-table>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col :span="24" style="margin-top: 10px">
					<el-card>
						<template #header>
							<div class="card-header">
								<span>统计信息</span>
							</div>
						</template>
						<el-row>
							<el-col>
								<el-table :data="statistics_table" style="width: 100%" show-header="false" :fit="true" size="small">
									<el-table-column prop="title" align="right" />
									<el-table-column prop="data" align="left" />
								</el-table>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="18">
			<el-row>
				<el-col :span="24">
					<el-card style="margin-left: 10px" body-style="padding: 0">
						<template #header>
							<div class="card-header">
								<span>操作</span>
							</div>
						</template>

						<el-row>
							<el-col :span="24">
								<el-form :model="form_data" label-width="auto">
									<el-row :gutter="20" style="margin-top: 15px">
										<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
											<el-form-item label="账号">
												<el-select v-model="form_data.exchange_id_list" multiple filterable clearable placeholder="支持多选">
													<template #header>
														<el-text type="primary" style="margin-left: 10px">交易所 | 交易所账号</el-text>
													</template>
													<el-option v-for="item in exchange_options" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
											<el-form-item label="交易类型">
												<el-select v-model="form_data.trade_type" placeholder="请选择">
													<el-option v-for="item in trade_type_options" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
											<el-form-item label="交易对">
												<el-select v-model="form_data.symbol_list" clearable multiple filterable allow-create placeholder="支持多选 现货交易对" v-if="form_data.trade_type === 'spot'">
													<template #header>
														<el-text type="primary" style="margin-left: 10px">交易对 | 最新价格</el-text>
													</template>
													<el-option v-for="item in binance_spot_usdt_symbols" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
												<el-select v-model="form_data.symbol_list" clearable multiple filterable allow-create placeholder="支持多选 合约交易对" v-if="form_data.trade_type === 'features'">
													<template #header>
														<el-text type="primary" style="margin-left: 10px">交易对 | 最新价格</el-text>
													</template>
													<el-option v-for="item in binance_features_usdt_symbols" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
											<el-button type="primary" @click="刷新()" style="margin-left: 20px">查询</el-button>
											<el-button type="primary" @click="确认启动马丁()" style="margin-left: 20px">启动马丁</el-button>
										</el-col>
									</el-row>
								</el-form>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-card style="margin-left: 10px; margin-top: 10px" body-style="padding-top: 0">
						<template #header>
							<div class="card-header">
								<span>运行中的马丁</span>
							</div>
						</template>

						<el-row>
							<el-col>
								<el-table :data="run_table" style="width: 100%" show-header="false" :fit="true" size="small">
									<el-table-column v-for="column in run_dto_columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" show-overflow-tooltip align="center"></el-table-column>
									<el-table-column label="操作" width="250" align="center" fixed="right">
										<template #default="{ row }">
											<el-button type="success" size="small" @click="单个恢复马丁(row)" v-if="row.status == 2">恢复</el-button>
											<el-button type="danger" size="small" @click="单个暂停马丁(row)" v-if="row.status != 2">暂停</el-button>
											<el-button type="danger" size="small" @click="单个停止马丁(row)">停止</el-button>
											<el-button type="primary" size="small" @click="查看运行明细(row)">查看运行明细</el-button>
										</template>
									</el-table-column>
								</el-table>
								<el-pagination v-model:current-page="run_page" style="margin-top: 20px" v-model:page-size="run_size" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="run_total" @size-change="handleRunSizeChange" @current-change="handleRunPageChange" default-page-size="20" />
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col :span="24">
					<el-card style="margin-left: 10px; margin-top: 10px" body-style="padding-top: 0">
						<template #header>
							<div class="card-header">
								<span>未运行的马丁</span>
							</div>
						</template>

						<el-row :gutter="20">
							<el-col>
								<el-table :data="stop_table" style="width: 100%" show-header="false" :fit="true" size="small">
									<el-table-column v-for="column in run_dto_columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" show-overflow-tooltip align="center"></el-table-column>
									<el-table-column label="操作" width="150" align="center" fixed="right">
										<template #default="{ row }">
											<el-button type="primary" size="small" @click="查看运行明细(row)">查看历史明细</el-button>
										</template>
									</el-table-column>
								</el-table>
								<el-pagination v-model:current-page="stop_page" style="margin-top: 20px" v-model:page-size="stop_size" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="stop_total" @size-change="handleStopSizeChange" @current-change="handleStopPageChange" default-page-size="20" />
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
		</el-col>
	</el-row>

	<el-drawer v-model="drawer" direction="ltr" size="85%">
		<template #header>
			<h4>set title by slot</h4>
		</template>
		<template #default>
			<p>set content by slot</p>
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="cancelClick">cancel</el-button>
				<el-button type="primary" @click="confirmClick">confirm</el-button>
			</div>
		</template>
	</el-drawer>

	<el-dialog v-model="dialogVisible" title="重要提示" width="500" :before-close="handleClose" top="45vh">
		<span>确认参数无误后，点击确认按钮即可开启马丁。</span>
		<br />
		<el-text class="mx-1" type="danger" style="font-weight: bolder">请勿多次点击确认按钮，多次点击会开启多个马丁！！</el-text>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="启动马丁()" :loading="start_md_loading">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { api_get_binance_api_usdt_symbols } from '@/api/binance_api'
import { api_get_binance_fapi_usdt_symbols } from '@/api/binance_fapi'
import { api_get_exchanges_all_simple } from '@/api/exchange_infos_api'
import { api_get_run_page, api_get_strategy_by_id, api_get_strategy_page, api_run_info_pause, api_run_info_run, api_run_info_start, api_run_info_stop } from '@/api/smading_strategy_api'
import * as commonConst from '@/constants/CommonConstant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const drawer = ref(false)
const dialogVisible = ref(false)
const router = useRouter()

const start_md_loading = ref(false)
const detail = ref({})
const binance_spot_usdt_symbols = ref([])
const binance_features_usdt_symbols = ref([])
const statistics_table = ref([])
const detail_table = ref([])
const exchange_options = ref([])
const trade_type_options = ref([
	{ value: 'spot', label: '现货' },
	{ value: 'features', label: '合约' },
])
const exchange_dict = ref({})
const run_dto_columns = ref([])
const form_data = ref({
	trade_type: 'spot',
})
const run_table = ref([])
const stop_table = ref([])

// 分页参数
const run_page = ref(1)
const run_size = ref(20)
const run_total = ref(0)

// 分页参数
const stop_page = ref(1)
const stop_size = ref(10)
const stop_total = ref(0)
const strategy_id = router.currentRoute.value.query.strategy_id // 从 URL 的 query 参数中获取 id

onMounted(async () => {
	if (!strategy_id) {
		// 如果没有 ID，可能是非法访问，跳转回列表页
		router.push({ name: commonConst.PATH_MD_BOTS_LIST }) // 假设列表页的路由名称为 'listPage'
	} else {
		// 根据 ID 加载数据
		await get_strategy_by_id(strategy_id)
	}
	await 获取币安usdt交易对()
	await get_strategy_page()
	await get_exchanges_all_simple()
	await get_run_page()
	await get_stop_page()
})

// 监听当前页码改变事件
const handleRunPageChange = (newPage) => {
	run_page.value = newPage
	get_run_page()
}

// 监听每页条数改变事件
const handleRunSizeChange = (newSize) => {
	run_size.value = newSize
	run_page.value = 1
	get_run_page()
}

// 监听当前页码改变事件
const handleStopPageChange = (newPage) => {
	stop_page.value = newPage
	get_stop_page()
}

// 监听每页条数改变事件
const handleStopSizeChange = (newSize) => {
	stop_size.value = newSize
	stop_page.value = 1
	get_stop_page()
}

const 单个恢复马丁 = async (row) => {
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			sync: true,
		},
	]
	恢复马丁(data)
}

const 恢复马丁 = async (data) => {
	try {
		const res = await api_run_info_run(data)
		if (res.status === 200 && res.data.code === 200) {
			// console.log('恢复马丁res', res)
			ElMessage({
				message: `${JSON.stringify(res.data.data)}`,
				type: 'success',
				showClose: true,
			})
			get_run_page()
		} else {
			ElMessage({
				message: '恢复马丁失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '恢复马丁失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
	// 等待1秒
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, 1000)
	})
	刷新()
}

const 单个暂停马丁 = async (row) => {
	const res = await ElMessageBox.confirm('确定要暂停么 ？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			sync: true,
		},
	]
	暂停马丁(data)
}

const 暂停马丁 = async (data) => {
	try {
		const res = await api_run_info_pause(data)
		if (res.status === 200 && res.data.code === 200) {
			// console.log('暂停马丁res', res)
			ElMessage({
				message: `${JSON.stringify(res.data.data)}`,
				type: 'success',
				showClose: true,
			})
			get_run_page()
		} else {
			ElMessage({
				message: '暂停马丁失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '暂停马丁失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
	// 等待1秒
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, 1000)
	})
	刷新()
}

const 单个停止马丁 = async (row) => {
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			sync: true,
		},
	]
	停止马丁(data)
}

const 停止马丁 = async (data) => {
	try {
		const res = await api_run_info_stop(data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: `${JSON.stringify(res.data.data)}`,
				type: 'success',
				showClose: true,
			})
			get_run_page()
		} else {
			ElMessage({
				message: '停止马丁失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '停止马丁失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
	// 等待1秒
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, 1000)
	})
	刷新()
}

const 确认启动马丁 = async () => {
	if (form_data.value.exchange_id_list.length === 0) {
		ElMessage({
			message: '请选择需要运行的账号',
			type: 'error',
			showClose: true,
		})
		return
	}
	if (form_data.value.symbol_list.length === 0) {
		ElMessage({
			message: '请选择需要运行的交易对',
			type: 'error',
			showClose: true,
		})
		return
	}
	if (!form_data.value.trade_type) {
		ElMessage({
			message: '请选择交易类型',
			type: 'error',
			showClose: true,
		})
		return
	}
	dialogVisible.value = true
}

const 启动马丁 = async () => {
	start_md_loading.value = true
	form_data.value.strategy_id = strategy_id
	try {
		const res = await api_run_info_start(form_data.value)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: `${JSON.stringify(res.data.data)}`,
				type: 'success',
				showClose: true,
			})
			get_run_page()
		} else {
			ElMessage({
				message: '启动马丁失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '启动马丁失败：' + error,
			type: 'error',
			showClose: true,
		})
	} finally {
		start_md_loading.value = false
	}
	dialogVisible.value = false
	// 等待1秒
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, 1000)
	})
	刷新()
}

const 刷新 = async () => {
	get_run_page()
	get_stop_page()
	ElMessage({
		message: '查询成功',
		type: 'success',
		showClose: true,
	})
}

const 查看运行明细 = (row) => {
	drawer.value = true
}
const get_exchanges_all_simple = async () => {
	try {
		const res = await api_get_exchanges_all_simple()
		if (res.status === 200 && res.data.code === 200) {
			exchange_options.value = res.data.data.map((item) => {
				return {
					value: item.id,
					label: `${item.exchange_type}  \u00A0|\u00A0  ${item.exchange_name}`,
				}
			})
			exchange_dict.value = res.data.data.reduce((acc, cur) => {
				acc[cur.id] = cur
				return acc
			}, {})
		} else {
			ElMessage({
				message: '查询交易所信息失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询交易所信息失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const get_strategy_page = async () => {
	// 获取策略信息
	try {
		const res = await api_get_strategy_page(1, 1, { strategy_id: strategy_id })
		console.log('res', res)
		if (res.status === 200 && res.data.code === 200) {
			const data = res.data.data.items[0]
			组装统计表格(data)
		} else {
			ElMessage({
				message: '查询双马丁策略列表失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询双马丁策略列表失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const get_strategy_by_id = async (strategy_id) => {
	try {
		const res = await api_get_strategy_by_id(strategy_id)
		if (res.status === 200 && res.data.code === 200) {
			const data = res.data.data
			detail.value = data
			if (data.position_side === 'LONG') {
				form_data.value.trade_type = 'spot'
				if (data.name.includes('合约')) {
					form_data.value.trade_type = 'features'
				}
			} else {
				form_data.value.trade_type = 'features'
				trade_type_options.value = [{ value: 'features', label: '合约' }]
			}
			组装运行列表(data)
			组装展示明细表格(data)
		} else {
			ElMessage({
				message: '查询马丁策略失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询马丁策略失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const 获取币安usdt交易对 = async () => {
	try {
		const res = await api_get_binance_api_usdt_symbols()
		if (res.status === 200 && res.data.code === 200) {
			binance_spot_usdt_symbols.value = Object.entries(res.data.data).map(([symbol, price]) => ({
				label: `${symbol} \u00A0|\u00A0 ${price}`, // 显示内容
				value: symbol, // 选中值
			}))
		} else {
			ElMessage({
				message: '查询币安现货usdt交易对失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询币安现货usdt交易对失败：' + error,
			type: 'error',
			showClose: true,
		})
	}

	try {
		const res = await api_get_binance_fapi_usdt_symbols()
		if (res.status === 200 && res.data.code === 200) {
			binance_features_usdt_symbols.value = Object.entries(res.data.data).map(([symbol, price]) => ({
				label: `${symbol} \u00A0|\u00A0 ${price}`, // 显示内容
				value: symbol, // 选中值
			}))
		} else {
			ElMessage({
				message: '查询币安现货usdt交易对失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询币安现货usdt交易对失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const get_stop_page = async () => {
	form_data.value.status_list = [-1, 0]
	form_data.value.strategy_id = strategy_id
	console.log('form_data', form_data)
	try {
		const res = await api_get_run_page(stop_page.value, stop_size.value, form_data.value)
		if (res.status === 200 && res.data.code === 200) {
			stop_table.value = res.data.data.items
			stop_page.value = res.data.data.page
			stop_size.value = res.data.data.size
			stop_total.value = res.data.data.total
		} else {
			ElMessage({
				message: '查询已停止的运行明细失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询已停止的运行明细失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}
const get_run_page = async () => {
	form_data.value.status_list = [1, 2]
	form_data.value.strategy_id = strategy_id
	try {
		const res = await api_get_run_page(run_page.value, run_size.value, form_data.value)
		if (res.status === 200 && res.data.code === 200) {
			run_table.value = res.data.data.items
			run_page.value = res.data.data.page
			run_size.value = res.data.data.size
			run_total.value = res.data.data.total
		} else {
			ElMessage({
				message: '查询运行中的运行明细失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询运行中的运行明细失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const 组装运行列表 = (data) => {
	let ret = []
	ret.push({ prop: 'exchange_type', label: '交易所', width: '70' })
	ret.push({ prop: 'exchange_name', label: '账号', width: '60' })
	ret.push({ prop: 'trade_type_name', label: '交易类型', width: '70' })
	ret.push({ prop: 'symbol', label: '交易对', width: '120' })
	ret.push({ prop: 'run_time', label: '运行时长', width: '120' })
	if (data.position_side === 'BOTH') {
		ret.push({ prop: 'stop_profit_num', label: '总止盈次数', width: '90' })
		ret.push({ prop: 'total_stop_profit', label: '总止盈利润', width: '100' })
		ret.push({ prop: 'status_name', label: '运行状态', width: '90' })
	}
	if (data.position_side === 'LONG' || data.position_side === 'BOTH') {
		ret.push({ prop: 'long_stop_profit_num', label: '做多止盈次数', width: '90' })
		ret.push({ prop: 'long_total_stop_profit', label: '做多止盈利润', width: '90' })
		ret.push({ prop: 'long_status_name', label: '做多运行状态', width: '90' })
	}
	if (data.position_side === 'SHORT' || data.position_side === 'BOTH') {
		ret.push({ prop: 'short_stop_profit_num', label: '做空止盈次数', width: '90' })
		ret.push({ prop: 'short_total_stop_profit', label: '做空止盈利润', width: '90' })
		ret.push({ prop: 'short_status_name', label: '做空运行状态', width: '90' })
	}
	ret.push({ prop: 'remark', label: '备注', width: '150' })
	ret.push({ prop: 'start_time', label: '开始时间', width: '150' })
	ret.push({ prop: 'end_time', label: '结束时间', width: '150' })
	ret.push({ prop: 'create_time', label: '创建时间', width: '150' })
	ret.push({ prop: 'update_time', label: '更新时间', width: '150' })
	run_dto_columns.value = ret
}

const 组装统计表格 = (data) => {
	let ret = []
	ret.push({ title: '马丁总数量:', data: `${Number(data.all_count)} ` })
	ret.push({ title: '马丁总盈利:', data: `${Number(data.all_profit)} USDT` })
	ret.push({ title: '运行中数量:', data: `${Number(data.running_count)} ` })
	ret.push({ title: '运行中盈利:', data: `${Number(data.running_profit)} USDT` })
	statistics_table.value = ret
}

const 组装展示明细表格 = (data) => {
	let ret = []
	ret.push({ title: '持仓方向:', data: data.position_side === 'LONG' ? '做多' : data.position_side === 'SHORT' ? '做空' : '双向' })
	if (data.position_side === 'LONG' || data.position_side === 'BOTH') {
		ret.push({ title: '========做多', data: '设置========' })
		// 保留2位小数
		ret.push({ title: '首单:', data: `${Number(data.long_1st_pos_val)} USDT` })
		ret.push({ title: '补单首单:', data: `${Number(data.long_cover_1st_pos_val)} USDT` })
		ret.push({ title: '活跃订单:', data: data.long_act_order_num })
		ret.push({ title: '补单次数:', data: data.long_cover_order_num })
		ret.push({ title: '波动参照:', data: data.long_bdcz === 1 ? '首单' : '上一单' })
		ret.push({ title: '补单波动:', data: `${Number(data.long_bdbd)} %` })
		ret.push({ title: '补单倍数:', data: `${Number(data.long_cover_value_mult)} 倍` })
		ret.push({ title: '加速补单:', data: `${Number(data.long_accel_cover)} %` })
		ret.push({ title: '止盈方式:', data: data.long_take_profit_type === 'price' ? '固定止盈' : data.long_take_profit_type === 'percent' ? '百分比止盈' : data.long_take_profit_type === 'mix_min' ? '混合止盈(取最小值)' : '混合止盈(取最大值)' })
		if (data.long_take_profit_type === 'price') {
			ret.push({ title: '止盈价格:', data: `${Number(data.long_take_profit_price)} USDT` })
		} else if (data.long_take_profit_type === 'percent') {
			ret.push({ title: '止盈百分比:', data: `${Number(data.long_take_profit_percent)} %` })
		} else if (data.long_take_profit_type === 'mix_min' || data.long_take_profit_type === 'mix_max') {
			ret.push({ title: '固定止盈价格:', data: `${Number(data.long_take_profit_price)} USDT` })
			ret.push({ title: '百分比止盈百分比:', data: `${Number(data.long_take_profit_percent)} %` })
		}
		if (data.long_stop_loss) {
			ret.push({ title: '止损:', data: '开启' })
			ret.push({ title: '止损后自动暂停:', data: data.long_after_stop_profit_auto_pause ? '开启' : '关闭' })
			ret.push({ title: '止损前等待:', data: `${Number(data.long_stop_loss_wait_time)} 秒` })
			ret.push({ title: '浮亏多少止损:', data: `${Number(data.long_stop_loss_usdt)} USDT` })
		}
		if (data.long_dj_open) {
			ret.push({ title: '====做多叠加补单', data: '设置========' })
			ret.push({ title: '补单首单:', data: `${Number(data.long_dj_cover_1st_pos_val)} USDT` })
			ret.push({ title: '补单次数:', data: data.long_dj_cover_order_num })
			ret.push({ title: '波动参照:', data: data.long_dj_bdcz === 1 ? '首单' : '上一单' })
			ret.push({ title: '补单波动:', data: `${Number(data.long_dj_bdbd)} %` })
			ret.push({ title: '补单倍数:', data: `${Number(data.long_dj_cover_value_mult)} 倍` })
			ret.push({ title: '加速补单:', data: `${Number(data.long_dj_accel_cover)} %` })
			ret.push({ title: '止盈方式:', data: data.long_dj_take_profit_type === 'price' ? '固定止盈' : data.long_dj_take_profit_type === 'percent' ? '百分比止盈' : data.long_dj_take_profit_type === 'mix_min' ? '混合止盈(取最小值)' : '混合止盈(取最大值)' })
			if (data.long_dj_take_profit_type === 'price') {
				ret.push({ title: '止盈价格:', data: `${Number(data.long_dj_take_profit_price)} USDT` })
			} else if (data.long_dj_take_profit_type === 'percent') {
				ret.push({ title: '止盈百分比:', data: `${Number(data.long_dj_take_profit_percent)} %` })
			} else if (data.long_dj_take_profit_type === 'mix_min' || data.long_dj_take_profit_type === 'mix_max') {
				ret.push({ title: '固定止盈价格:', data: `${Number(data.long_dj_take_profit_price)} USDT` })
				ret.push({ title: '百分比止盈百分比:', data: `${Number(data.long_dj_take_profit_percent)} %` })
			}
		}
	}
	if (data.position_side === 'SHORT' || data.position_side === 'BOTH') {
		ret.push({ title: '========做空', data: '设置========' })
		ret.push({ title: '首单:', data: `${Number(data.short_1st_pos_val)} USDT` })
		ret.push({ title: '补单首单:', data: `${Number(data.short_cover_1st_pos_val)} USDT` })
		ret.push({ title: '活跃订单:', data: data.short_act_order_num })
		ret.push({ title: '补单次数:', data: data.short_cover_order_num })
		ret.push({ title: '波动参照:', data: data.short_bdcz === 1 ? '首单' : '上一单' })
		ret.push({ title: '补单波动:', data: `${Number(data.short_bdbd)} %` })
		ret.push({ title: '补单倍数:', data: `${Number(data.short_cover_value_mult)} 倍` })
		ret.push({ title: '加速补单:', data: `${Number(data.short_accel_cover)} %` })
		ret.push({ title: '止盈方式:', data: data.short_take_profit_type === 'price' ? '固定止盈' : data.short_take_profit_type === 'percent' ? '百分比止盈' : data.short_take_profit_type === 'mix_min' ? '混合止盈(取最小值)' : '混合止盈(取最大值)' })
		if (data.short_take_profit_type === 'price') {
			ret.push({ title: '止盈价格:', data: `${Number(data.short_take_profit_price)} USDT` })
		} else if (data.short_take_profit_type === 'percent') {
			ret.push({ title: '止盈百分比:', data: `${Number(data.short_take_profit_percent)} %` })
		} else if (data.short_take_profit_type === 'mix_min' || data.short_take_profit_type === 'mix_max') {
			ret.push({ title: '固定止盈价格:', data: `${Number(data.short_take_profit_price)} USDT` })
			ret.push({ title: '百分比止盈百分比:', data: `${Number(data.short_take_profit_percent)} %` })
		}
		if (data.short_stop_loss) {
			ret.push({ title: '止损:', data: '开启' })
			ret.push({ title: '止损后自动暂停:', data: data.short_after_stop_profit_auto_pause ? '开启' : '关闭' })
			ret.push({ title: '止损前等待:', data: `${Number(data.short_stop_loss_wait_time)} 秒` })
			ret.push({ title: '浮亏多少止损:', data: `${Number(data.short_stop_loss_usdt)} USDT` })
		}
		if (data.short_dj_open) {
			ret.push({ title: '====做空叠加补单', data: '设置========' })
			ret.push({ title: '补单首单:', data: `${Number(data.short_dj_cover_1st_pos_val)} USDT` })
			ret.push({ title: '补单次数:', data: data.short_dj_cover_order_num })
			ret.push({ title: '波动参照:', data: data.short_dj_bdcz === 1 ? '首单' : '上一单' })
			ret.push({ title: '补单波动:', data: `${Number(data.short_dj_bdbd)} %` })
			ret.push({ title: '补单倍数:', data: `${Number(data.short_dj_cover_value_mult)} 倍` })
			ret.push({ title: '加速补单:', data: `${Number(data.short_dj_accel_cover)} %` })
			ret.push({ title: '止盈方式:', data: data.short_dj_take_profit_type === 'price' ? '固定止盈' : data.short_dj_take_profit_type === 'percent' ? '百分比止盈' : data.short_dj_take_profit_type === 'mix_min' ? '混合止盈(取最小值)' : '混合止盈(取最大值)' })
			if (data.short_dj_take_profit_type === 'price') {
				ret.push({ title: '止盈价格:', data: `${Number(data.short_dj_take_profit_price)} USDT` })
			} else if (data.short_dj_take_profit_type === 'percent') {
				ret.push({ title: '止盈百分比:', data: `${Number(data.short_dj_take_profit_percent)} %` })
			} else if (data.short_dj_take_profit_type === 'mix_min' || data.short_dj_take_profit_type === 'mix_max') {
				ret.push({ title: '固定止盈价格:', data: `${Number(data.short_dj_take_profit_price)} USDT` })
				ret.push({ title: '百分比止盈百分比:', data: `${Number(data.short_dj_take_profit_percent)} %` })
			}
		}
	}

	detail_table.value = ret
}
</script>

<style lang="less" scoped>
.margin-top-30 {
	margin-top: 30px;
}
.margin-top-20 {
	margin-top: 20px;
}
.margin-top-10 {
	margin-top: 10px;
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
</style>

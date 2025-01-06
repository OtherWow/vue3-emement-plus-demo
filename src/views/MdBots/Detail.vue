<template>
	<el-row>
		<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
			<el-card>
				<el-row>
					<el-col style="text-align: center">
						<el-tag type="warning" effect="dark" size="large" style="font-weight: bold; font-size: 14px">
							{{ detail.name }}
						</el-tag>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col>
						<el-table :data="detail_table" style="width: 100%" show-header="false" :fit="true" size="small">
							<el-table-column prop="title" align="right" />
							<el-table-column prop="data" align="left" />
						</el-table>
					</el-col>
				</el-row>
			</el-card>
		</el-col>
		<el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="18">
			<el-row>
				<el-col :span="24">
					<el-card style="margin-left: 10px">
						<!-- <el-row>
					<el-col :span="24">
						<el-text class="mx-1" style="font-weight: bold; font-size: 16px">运行马丁策略</el-text>
					</el-col>
				</el-row> -->
						<el-form :model="run_dto" label-width="150px" style="margin-top: 20px">
							<el-row>
								<el-col :span="6">
									<el-form-item label="选择运行账号" required>
										<el-select v-model="selected_exchange_ids" multiple clearable placeholder="支持多选">
											<el-option v-for="item in exchange_options" :key="item.value" :label="item.label" :value="item.value" />
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="交易类型" required>
										<el-radio-group v-model="run_dto.trade_type" class="my-radio-group">
											<el-radio-button :label="'spot'" class="my-radio-50">
												<template #default>现货</template>
											</el-radio-button>
											<el-radio-button :label="'futures'" class="my-radio-50">
												<template #default>合约</template>
											</el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="交易对" required>
										<el-input v-model="run_dto.symbol" placeholder="输入交易对" />
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-button type="primary" @click="模拟数据()" style="margin-left: 80px">启动马丁</el-button>
								</el-col>
							</el-row>
						</el-form>
					</el-card>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-card style="margin-left: 10px; margin-top: 10px">
						<el-collapse v-model="activeNames" @change="handleChange">
							<el-collapse-item name="1">
								<template #title>
									<el-tag type="success" effect="dark" size="large" style="font-weight: bold; font-size: 14px">运行中的马丁</el-tag>
								</template>
								<el-row :gutter="20">
									<el-col>
										<el-table :data="run_table" style="width: 100%" show-header="false" :fit="true" size="small">
											<el-table-column v-for="column in run_dto_columns" :key="column.prop" :prop="column.prop" :label="column.label" show-overflow-tooltip align="center"></el-table-column>
											<el-table-column label="操作" width="150" align="center" fixed="right">
												<template #default="{ row }">
													<el-button type="primary" size="small" @click="editStrategy(row)" plain>查看运行明细</el-button>
												</template>
											</el-table-column>
										</el-table>
										<el-pagination v-model:current-page="run_page" style="margin-top: 20px" v-model:page-size="run_size" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="run_total" @size-change="handleRunSizeChange" @current-change="handleRunPageChange" default-page-size="20" />
									</el-col>
								</el-row>
							</el-collapse-item>
							<el-collapse-item name="2">
								<template #title>
									<el-tag type="danger" effect="dark" size="large" style="font-weight: bold; font-size: 14px">已停止的马丁</el-tag>
								</template>
								<el-row :gutter="20">
									<el-col>
										<el-table :data="stop_table" style="width: 100%" show-header="false" :fit="true" size="small">
											<el-table-column v-for="column in run_dto_columns" :key="column.prop" :prop="column.prop" :label="column.label" show-overflow-tooltip align="center"></el-table-column>
										</el-table>
										<el-pagination v-model:current-page="stop_page" style="margin-top: 20px" v-model:page-size="stop_size" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="stop_total" @size-change="handleStopSizeChange" @current-change="handleStopPageChange" default-page-size="20" />
									</el-col>
								</el-row>
							</el-collapse-item>
						</el-collapse>
					</el-card>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>

<script setup>
import { api_get_exchanges_all_simple } from '@/api/exchange_infos_api'
import { api_get_run_page, api_get_strategy_by_id } from '@/api/smading_strategy_api'
import * as commonConst from '@/constants/CommonConstant'
import { useMdBotsDetailStore } from '@/store/MdBots_Detail'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const activeNames = ref(['1'])
const handleChange = (val) => {
	console.log(val)
}
const detailStore = useMdBotsDetailStore()
const router = useRouter()

const detail = ref({})
const run_dto = ref({
	trade_type: 'spot',
})

const detail_table = ref([])
const exchange_options = ref([])
const exchange_dict = ref({})
const selected_exchange_ids = ref([])
const run_dto_columns = ref([])
const form_data = ref({})
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

onMounted(() => {
	const strategy_id = router.currentRoute.value.query.strategy_id // 从 URL 的 query 参数中获取 id
	if (!strategy_id) {
		// 如果没有 ID，可能是非法访问，跳转回列表页
		router.push({ name: commonConst.PATH_MD_BOTS_LIST }) // 假设列表页的路由名称为 'listPage'
	} else {
		// 根据 ID 加载数据
		get_strategy_by_id(strategy_id)
	}
	get_exchanges_all_simple()
	get_run_page()
	get_stop_page()
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

const get_exchanges_all_simple = async () => {
	try {
		const res = await api_get_exchanges_all_simple()
		if (res.status === 200 && res.data.code === 200) {
			exchange_options.value = res.data.data.map((item) => {
				return {
					value: item.id,
					label: `${item.exchange_type}  \u00A0\u00A0  ${item.exchange_name}`,
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
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询交易所信息失败：' + error,
			type: 'error',
		})
	}
}

const get_strategy_by_id = async (strategy_id) => {
	try {
		const res = await api_get_strategy_by_id(strategy_id)
		if (res.status === 200 && res.data.code === 200) {
			const data = res.data.data
			detail.value = data

			组装运行列表(data)
			组装展示明细表格(data)
		} else {
			ElMessage({
				message: '查询马丁策略失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询马丁策略失败：' + error,
			type: 'error',
		})
	}
}

const get_stop_page = async () => {
	form_data.value = {
		query_not_run: true,
	}
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
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询已停止的运行明细失败：' + error,
			type: 'error',
		})
	}
}
const get_run_page = async () => {
	form_data.value = {
		status: 1,
	}
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
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询运行中的运行明细失败：' + error,
			type: 'error',
		})
	}
}

const 组装运行列表 = (data) => {
	let ret = []
	ret.push({ prop: 'exchange_type', label: '交易所', width: '120' })
	ret.push({ prop: 'exchange_name', label: '账号', width: '120' })
	ret.push({ prop: 'trade_type_name', label: '交易类型', width: '120' })
	ret.push({ prop: 'symbol', label: '交易对', width: '120' })
	if (data.position_side === 'BOTH') {
		ret.push({ prop: 'stop_profit_num', label: '总止盈次数', width: '120' })
		ret.push({ prop: 'total_stop_profit', label: '总止盈利润', width: '120' })
		ret.push({ prop: 'status_name', label: '运行状态', width: '120' })
	}
	if (data.position_side === 'LONG' || data.position_side === 'BOTH') {
		ret.push({ prop: 'long_stop_profit_num', label: '做多止盈次数', width: '120' })
		ret.push({ prop: 'long_total_stop_profit', label: '做多止盈利润', width: '120' })
		ret.push({ prop: 'long_status_name', label: '做多运行状态', width: '120' })
	}
	if (data.position_side === 'SHORT' || data.position_side === 'BOTH') {
		ret.push({ prop: 'short_stop_profit_num', label: '做空止盈次数', width: '120' })
		ret.push({ prop: 'short_total_stop_profit', label: '做空止盈利润', width: '120' })
		ret.push({ prop: 'short_status_name', label: '做空运行状态', width: '120' })
	}
	ret.push({ prop: 'remark', label: '备注', width: '120' })
	ret.push({ prop: 'start_time', label: '开始时间', width: '120' })
	ret.push({ prop: 'end_time', label: '结束时间', width: '120' })
	ret.push({ prop: 'create_time', label: '创建时间', width: '120' })
	ret.push({ prop: 'update_time', label: '更新时间', width: '120' })
	run_dto_columns.value = ret
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

const getTagType_position_side = (position_side) => {
	if (position_side === 'LONG') return 'success'
	if (position_side === 'SHORT') return 'danger'
	if (position_side === 'BOTH') return 'warning' // 或其他 ElementUI tag 的类型
	return '' // 默认值
}

const getTagLabel_position_side = (position_side) => {
	if (position_side === 'LONG') return '做多'
	if (position_side === 'SHORT') return '做空'
	if (position_side === 'BOTH') return '双向' // 您可以根据需要更改这里的文本
	return '' // 默认值
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

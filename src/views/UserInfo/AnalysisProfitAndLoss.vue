<template>
	<el-card style="margin: 20px">
		<template #header>
			<el-text>账号余额组成</el-text>
		</template>
		<el-row>
			<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 20px">
				<div style="height: 300px" id="echarts_account_make_up"></div>
			</el-col>
		</el-row>
	</el-card>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'
// ------------------------------------------------------------------------------------------------------------参数定义----------------------------------------------------------------------------------------------------
// 通过 inject 方法获取 $echarts 对象
const $echarts = inject('$echarts')
// ------------------------------------------------------------------------------------------------------------页面初始化开始----------------------------------------------------------------------------------------------------

onMounted(async () => {
	await 生成账号余额图表()
	// window.addEventListener('resize', function () {
	// 	echarts_账号余额组成.resize()
	// })
})

onBeforeUnmount(() => {})

// ------------------------------------------------------------------------------------------------------------页面初始化结束----------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------图表开始----------------------------------------------------------------------------------------------------

const 生成账号余额图表 = async () => {
	var echarts_account_make_up = $echarts.init(document.getElementById('echarts_account_make_up'))
	const option = {
		title: {
			text: '账户资产分析',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} USDT ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['8_yyn 合约 BTCUSDT', '8_yyn 现货 BTC', '8_yyn 合约 BTCUSDT1', '8_yyn 现货 BTC1', '8_yyn 合约 BTCUSDT2', '8_yyn 现货 BTC2', '8_yyn 合约 BTCUSDT3', '8_yyn 现货 BTC3', '8_yyn 合约 BTCUSDT4', '8_yyn 现货 BTC4'],
		},
		series: [
			{
				name: '资产来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [
					{ value: 2280, name: '8_yyn 合约 BTCUSDT' },
					{ value: 15600, name: '8_yyn 现货 BTC' },
					{ value: 2280, name: '8_yyn 合约 BTCUSDT1' },
					{ value: 15600, name: '8_yyn 现货 BTC1' },
					{ value: 2280, name: '8_yyn 合约 BTCUSDT2' },
					{ value: 15600, name: '8_yyn 现货 BTC2' },
					{ value: 2280, name: '8_yyn 合约 BTCUSDT3' },
					{ value: 15600, name: '8_yyn 现货 BTC3' },
					{ value: 2280, name: '8_yyn 合约 BTCUSDT4' },
					{ value: 15600, name: '8_yyn 现货 BTC4' },
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	}
	echarts_account_make_up.setOption(option)
	let currentIndex = -1

	setInterval(function () {
		var dataLen = option.series[0].data.length
		// 取消之前高亮的图形
		echarts_account_make_up.dispatchAction({
			type: 'downplay',
			seriesIndex: 0,
			dataIndex: currentIndex,
		})
		currentIndex = (currentIndex + 1) % dataLen
		// 高亮当前图形
		echarts_account_make_up.dispatchAction({
			type: 'highlight',
			seriesIndex: 0,
			dataIndex: currentIndex,
		})
		// 显示 tooltip
		echarts_account_make_up.dispatchAction({
			type: 'showTip',
			seriesIndex: 0,
			dataIndex: currentIndex,
		})
	}, 1000)
}
</script>

<style lang="scss" scoped></style>

<template>
	<div class="common-layout">
		<el-container>
			<el-header height="300">
				<el-descriptions title="马丁策略明细" class="margin-top-10" :column="3" border>
					<el-descriptions-item label="Username" label-align="right" align="center" label-class-name="my-label" class-name="my-content" width="150px">kooriookami</el-descriptions-item>
					<el-descriptions-item label="Telephone" label-align="right" align="center">18100000000</el-descriptions-item>
					<el-descriptions-item label="Place" label-align="right" align="center">Suzhou</el-descriptions-item>
					<el-descriptions-item label="Remarks" label-align="right" align="center">
						<el-tag size="small">School</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="Address" label-align="right" align="center">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</el-descriptions-item>
				</el-descriptions>
				<el-descriptions title="运行马丁策略" class="margin-top-30" :column="3" :size="size" :style="blockMargin">
					<el-button type="primary">Operation</el-button>

					<el-descriptions-item label="Username">kooriookami</el-descriptions-item>
					<el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
					<el-descriptions-item label="Place">Suzhou</el-descriptions-item>
					<el-descriptions-item label="Remarks">
						<el-tag size="small">School</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</el-descriptions-item>
				</el-descriptions>
			</el-header>
			<el-main>
				<div class="demo-collapse">
					<el-collapse v-model="activeNames" @change="handleChange">
						<el-collapse-item title="此策略运行中的马丁" name="1">
							<div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
							<div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
						</el-collapse-item>
						<el-collapse-item title="此策略已停止的马丁" name="2">
							<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
							<div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</el-main>
		</el-container>
	</div>
	{{ detail }}
</template>

<script setup>
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

const detail = detailStore.item

onMounted(() => {
	if (!detail) {
		// 如果没有数据，可能是用户直接访问详情页，跳转回列表页或请求数据
		router.push({ name: commonConst.PATH_MD_BOTS_LIST }) // 假设列表页的路由名称为 'listPage'
	}
})
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
</style>

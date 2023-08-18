<template>
    <el-menu :default-active="route.path" class="el-menu-vertical-demo" :collapse="isClose" active-text-color="#ffd04b"
        background-color="rgb(47, 64, 80)" text-color="#fff" router collapse-transition="false">

        <el-menu-item><template #title><span>测试系统</span></template></el-menu-item>
        <el-menu-item index="/"><el-icon>
                <House />
            </el-icon><span>系统首页</span></el-menu-item>
        <el-sub-menu index="/goods">
            <template #title><el-icon>
                    <location />
                </el-icon><span>产品管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/goods/list">产品列表</el-menu-item>
                <el-menu-item index="/goods/category">产品分类</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/FundingRate">
            <template #title><el-icon>
                    <Coin />
                </el-icon><span>资金费率策略管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/FundingRate/list">资金费率策略列表</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/exchange_infos">
            <template #title><el-icon>
                    <Connection />
                </el-icon><span>交易所账号管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/exchange_infos/list">交易所账号列表</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/md_bots">
            <template #title><el-icon>
                    <location />
                </el-icon><span>马丁机器人管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/md_bots/list">马丁机器人列表</el-menu-item>
                <el-menu-item index="/md_bots/smadingList">双马丁机器人列表</el-menu-item>
                <el-menu-item index="/md_bots/detail">马丁明细</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
    </el-menu>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
    props: ['isClose'],
    setup() {

        const route = useRoute()

        return {

            route
        }
    }
}

</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    border-right: none;
}
</style>
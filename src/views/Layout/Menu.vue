<template>
    <el-menu :default-active="route.path" class="el-menu-vertical-demo" :collapse="isClose" active-text-color="#ffd04b"
        background-color="rgb(47, 64, 80)" text-color="#fff" router :collapse-transition="false">

        <el-menu-item><template #title><el-text tag="b" type="warning">Buzz</el-text></template></el-menu-item>
        <el-menu-item index="/"><el-icon>
                <House />
            </el-icon><span>系统首页</span></el-menu-item>
        <el-sub-menu index="/user_info">
            <template #title><el-icon>
                    <User />
                </el-icon><span>用户管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/user_info/balance_list">交易所余额查询</el-menu-item>
                <el-menu-item index="/user_info/transfer_infos">交易所划转记录查询</el-menu-item>
                <!-- <el-menu-item index="/goods/category">产品分类</el-menu-item> -->
            </el-menu-item-group>
        </el-sub-menu>
        <!-- <el-sub-menu index="/FundingRate">
            <template #title><el-icon>
                    <Coin />
                </el-icon><span>资金费率策略管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/FundingRate/list" :disabled="true">资金费率策略列表</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu> -->
        <el-sub-menu index="/rebot_order">
            <template #title><el-icon>
                    <Connection />
                </el-icon><span>辅助下单管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/rebot_order/panel">辅助下单面板</el-menu-item>
                <!-- <el-menu-item index="/rebot_order/his">辅助下单历史记录</el-menu-item> -->
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/md_bots">
            <template #title><el-icon>
                    <Operation />
                </el-icon><span>马丁机器人管理</span></template>
            <el-menu-item-group>
                <!-- <el-menu-item index="/md_bots/list">马丁机器人列表</el-menu-item> -->
                <el-menu-item index="/md_bots/smadingList">双马丁机器人列表</el-menu-item>
                <el-menu-item index="/md_bots/smadingMonitor">双马丁监控墙</el-menu-item>
                <!-- <el-menu-item index="/md_bots/smadingMonitor2">监控墙vxe-table</el-menu-item>
                <el-menu-item index="/md_bots/smadingMonitor3">监控墙虚拟表格</el-menu-item> -->
                <!-- <el-menu-item index="/md_bots/detail">马丁明细</el-menu-item> -->
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/partner_plan">
            <template #title><el-icon>
                    <Paperclip />
                </el-icon><span>推广管理</span></template>
            <el-menu-item-group>
                <el-menu-item index="/partner_plan/partner_plan">交易合伙人计划</el-menu-item>
                <el-menu-item index="/partner_plan/my_cash_back">我的返现</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/disclaimer"><el-icon>
                <Notification />
            </el-icon><span>免责声明</span></el-menu-item>
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
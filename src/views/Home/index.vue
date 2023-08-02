<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <div id="main" style="width: 800px;height:400px;" hidden="true"></div>
            </el-main>
            <el-aside width="450px" style="margin-top: 0px;padding: 20px;padding-left: 15px;">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" class="demo-tabs" style="margin-top: 10px;">
                        <el-tab-pane label="每分钟振幅排行" name="first">
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
                                }}</el-tag> <el-tag :type="现货盈亏tag颜色" size="large" style="margin-left: 5px;">{{
    现货总盈亏
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
                                <el-table-column label="数量" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.free }}</el-tag>
                                    </template>
                                </el-table-column>

                                <el-table-column label="总价值(U)" align="center">
                                    <template #default="scope">
                                        <el-tag size="large">{{ scope.row.usdtValuation }}</el-tag>
                                    </template>
                                </el-table-column>

                                <el-table-column label="相对0点浮动盈亏" align="center">
                                    <template #default="scope">
                                        <el-tag :type="scope.row.type" size="large">{{ scope.row.盈亏
                                        }}</el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>



                            <el-descriptions :column=1 style="margin-top:30px;">
                                <el-descriptions-item label="U本位合约" align="center"><el-tag size="large">{{
                                    user_perp_total_usdt }}</el-tag> <el-tag :type="合约盈亏tag颜色" size="large"
                                        style="margin-left: 5px;">{{ 合约总盈亏
                                        }}</el-tag>
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
                        <el-tab-pane label="4小时振幅上榜数量排行" name="second">Config</el-tab-pane>
                        <el-tab-pane label="表格" name="third">Role</el-tab-pane>
                    </el-tabs>

                </el-card></el-aside>
        </el-container>
    </div>
</template>

<script>
import { inject, onMounted } from 'vue';


export default {
    setup() {
        // 通过 inject 方法获取 $echarts 对象
        const $echarts = inject('$echarts');
        onMounted(() => {
            // 基于准备好的dom，初始化echarts实例
            var myChart = $echarts.init(document.getElementById('main'));
            myChart.setOption({
                xAxis: {
                    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
                },
                yAxis: {},
                series: [
                    {
                        type: 'candlestick',
                        data: [
                            [20, 34, 10, 38],
                            [40, 35, 30, 50],
                            [31, 38, 33, 44],
                            [38, 15, 5, 42]
                        ]
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' },
                    formatter: function (params) {
                        let color = params[0].color;
                        let dataIndex = params[0].dataIndex;
                        let data = params[0].data;
                        let marker = params[0].marker;
                        let circle = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${color};margin-bottom:2px;margin-right:5px;"></span>`;

                        return `
                    ${params[0].name}<br>
                    ${marker}<br>
                    ${circle} 开盘：<strong>${data[0]}</strong><br>
                    ${circle} 收盘：<strong>${data[1]}</strong><br>
                    ${circle} 最低：<strong>${data[2]}</strong><br>
                    ${circle} 最高：<strong>${data[3]}</strong>
                `;
                    }
                }

            })

        })
    }
}
</script>

<style lang="less" scoped></style>
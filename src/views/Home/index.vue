<template>
    <div class="common-layout">
        <el-container>
            <el-main>

                <el-card class="box-card" id="left_card" :style="{ height: cardHeight + 'px' }">
                    <div id="main" style="width: 100%;" :style="{ height: cardHeight - 100 + 'px' }"></div>


                </el-card>
            </el-main>
            <el-aside width="450px" style="margin-top: 0px;padding: 20px;padding-left: 15px;">
                <el-card class="box-card" :style="{ height: cardHeight + 'px' }">
                    <el-tabs v-model="activeTab" class="demo-tabs" style="margin-top: 10px;">
                        <el-tab-pane label="每分钟振幅排行" name="first">
                            <el-table :data="amplitude_1m_20_table_data" style="width: 100%" :max-height="cardHeight - 110">
                                <el-table-column prop="index" label="排名" align="center" width="80"></el-table-column>
                                <el-table-column label="交易对" align="center">
                                    <template #default="scope">
                                        <el-button @click="刷新指定币种的振幅数据(scope.row.symbol)">{{
                                            scope.row.symbol }}</el-button>
                                    </template>

                                </el-table-column>
                                <el-table-column label="振幅" align="center">
                                    <template #default="scope">
                                        <el-tag type="success" effect="dark" size="large">{{ scope.row.amplitude
                                        }}%</el-tag>
                                    </template>
                                </el-table-column>

                            </el-table>




                        </el-tab-pane>
                        <el-tab-pane label="4小时内振幅上榜数量排行" name="second">
                            <el-table :data="amplitude_1m_top20_4h_count_table_data" style="width: 100%"
                                :max-height="cardHeight - 110">
                                <el-table-column prop="index" label="排名" align="center" width="80"></el-table-column>
                                <el-table-column label="交易对" align="center">
                                    <template #default="scope">
                                        <el-button @click="刷新指定币种的振幅数据(scope.row.symbol)">{{
                                            scope.row.symbol }}</el-button>
                                    </template>

                                </el-table-column>
                                <el-table-column label="上榜次数" align="center">
                                    <template #default="scope">
                                        <el-tag type="success" effect="dark" size="large">{{ scope.row.count
                                        }}</el-tag>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-card></el-aside>
        </el-container>
    </div>
</template>

<script setup>
import { inject, onMounted, ref, onBeforeUnmount } from 'vue';
import { fapi_获取当前分钟的振幅排行, fapi_获取指定币种的所有振幅数据, fapi_获取4小时内币种上榜次数排行 } from '@/api/binance_fapi'


let amplitude_1m_20_table_data = ref([]);  // initial empty data
let amplitude_1m_top20_4h_count_table_data = ref([]);  // initial empty data
let amplitude_1m_all_data = ref({});  // initial empty data
let intervalId = ref(null);
const cardHeight = ref(0);  // default height
const activeTab = ref('first');
// 通过 inject 方法获取 $echarts 对象
const $echarts = inject('$echarts');
const updateHeight = () => {
    if (!document.getElementById('left_card')) return;
    cardHeight.value = window.innerHeight - 200;
    console.log(window.innerHeight)
};

const 刷新每分钟振幅排行 = async () => {
    const res = await fapi_获取当前分钟的振幅排行();
    console.log(res.data);
    amplitude_1m_20_table_data.value = res.data;
    return res.data;
};

const 刷新4小时内币种上榜次数排行 = async () => {
    const res = await fapi_获取4小时内币种上榜次数排行();
    console.log("刷新4小时内币种上榜次数排行");
    console.log(res.data);
    amplitude_1m_top20_4h_count_table_data.value = res.data;
    return res.data;
};


const 刷新指定币种的振幅数据 = async (symbol) => {
    const res = await fapi_获取指定币种的所有振幅数据(symbol);
    console.log(res.data);
    amplitude_1m_all_data.value = res.data;
    // 基于准备好的dom，初始化echarts实例
    var myChart = $echarts.init(document.getElementById('main'));
    myChart.setOption({
        title: {
            text: amplitude_1m_all_data.value.symbol + '一天内振幅数据统计',
            left: 10
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            bottom: 90
        },
        xAxis: [
            {
                data: amplitude_1m_all_data.value.x_data,
                silent: false,
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                }
            }
        ],
        yAxis: {
            splitArea: {
                show: false
            }
        },
        series: [
            {
                name: '振幅',
                type: 'bar',
                barWidth: '60%',
                data: amplitude_1m_all_data.value.y_data,
                large: true
            }
        ],
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'slider'
            }
        ]

    })

};

onMounted(async () => {
    updateHeight();
    const data = await 刷新每分钟振幅排行();
    刷新4小时内币种上榜次数排行();
    if (data && data.length > 0) {
        console.log(data[0].symbol);
        const symbol = data[0].symbol;
        await 刷新指定币种的振幅数据(symbol);
    }
    window.addEventListener('resize', updateHeight);
    intervalId.value = setInterval(() => {
        const currentSeconds = new Date().getSeconds();
        if (currentSeconds === 22) {
            刷新每分钟振幅排行();
            刷新4小时内币种上榜次数排行();
        }
    }, 1000); // Run this every second
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateHeight);
    clearInterval(intervalId.value);
});




</script>

<style lang="less" scoped></style>
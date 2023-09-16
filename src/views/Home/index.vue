<template>
    <div class="common-layout">
        <el-container>
            <el-main>

                <el-card class="box-card" id="left_card" :style="{ height: cardHeight + 'px' }">
                    <template #header>
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <p><el-text class="mx-1" tag="b">{{ 选中的币种 }}</el-text></p>
                            </el-col>
                            <el-col :span="5">
                                <p>24小时成交量：<el-text tag="b" type="danger">{{ 选中的币种24小时成交量 }}</el-text></p>
                            </el-col>
                            <el-col :span="6">
                                <p>24小时成交额：<el-text tag="b" type="danger">{{ 选中的币种24小时交易额 }}</el-text> <el-text class="mx-1"
                                        tag="b" type="primary">USDT</el-text>
                                </p>
                            </el-col>
                            <el-col :span="6">
                                <el-row :gutter="20">
                                    <el-col :span="20">
                                        <el-select v-model="双马丁策略id" @change="双马丁策略改变" clearable placeholder="选择双马丁策略"
                                            style="width:100%" filterable>
                                            <el-option v-for="item in 双马丁策略列表" :key="item.value" :label="item.label"
                                                :value="item.value">
                                                <span style="float: left">{{ item.label }}</span>
                                                <span style="
                                                    float: right;
                                                    color: var(--el-text-color-secondary);
                                                    font-size: 13px;
                                                    "><el-tag :type="item.is_run ? 'success' : 'danger'"
                                                        effect="dark">{{
                                                            item.is_run ? '已启动' :
                                                            '停止'
                                                        }}</el-tag></span>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="success" @click="首页直接启动">启动</el-button>
                                    </el-col>
                                </el-row>


                            </el-col>
                        </el-row>

                    </template>
                    <div id="main" style="width: 100%;" :style="{ height: ((cardHeight - 100) / 2 - 100) + 'px' }"></div>

                    <div id="main_kline" style="width: 100%;margin-top: 5px;"
                        :style="{ height: ((cardHeight - 100) / 2 + 100) + 'px' }">
                    </div>
                </el-card>
            </el-main>
            <el-aside width="450px" style="margin-top: 0px;padding: 20px;padding-left: 15px;">
                <el-card class="box-card" :style="{ height: cardHeight + 'px' }">
                    <el-tabs v-model="activeTab" class="demo-tabs" style="margin-top: 10px;">
                        <el-tab-pane label="每分钟振幅排行" name="first">
                            <el-table :data="amplitude_1m_20_table_data" style="width: 100%" :height="cardHeight - 110">
                                <el-table-column prop="index" label="排名" align="center" width="55"></el-table-column>
                                <el-table-column label="交易对" align="center" width="145">
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
                                <el-table-column label="上榜次数" align="center">
                                    <template #default="scope">
                                        <el-tag type="success" effect="dark" size="large">{{ scope.row.count
                                        }}</el-tag>
                                    </template>
                                </el-table-column>

                            </el-table>




                        </el-tab-pane>
                        <el-tab-pane label="4小时内振幅上榜数量排行" name="second">
                            <el-table :data="amplitude_1m_top20_4h_count_table_data" style="width: 100%"
                                :height="cardHeight - 110">
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
                        <el-tab-pane label="资金费率排行" name="three">
                            <el-table :data="funding_rate_top20_now_table_data" style="width: 100%"
                                :height="cardHeight - 110">
                                <el-table-column prop="index" label="排名" align="center" width="80"></el-table-column>
                                <el-table-column prop="symbol" label="交易对" align="center"></el-table-column>
                                <el-table-column label="资金费率" align="center">
                                    <template #default="scope">
                                        <el-tag type="success" effect="dark" size="large">{{ scope.row.funding_rate
                                        }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="next_rate_time" label="倒计时" align="center"
                                    width="80"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-card></el-aside>
        </el-container>
    </div>
</template>

<script setup>
import { inject, onMounted, ref, onBeforeUnmount } from 'vue';
import {
    fapi_获取当前分钟的振幅排行,
    fapi_获取指定币种的所有振幅数据,
    fapi_获取4小时内币种上榜次数排行,
    fapi_获取最新的资金费率排行前20,
    fapi_获取指定币种的24小时数据,
    fapi_获取指定币种的k线数据,
} from '@/api/binance_fapi'
import {
    api_首页查询策略列表,
    api_首页直接启动,
} from '@/api/smading_strategy_api'

const 选中的币种 = ref('');
const 选中的币种24小时成交量 = ref(0);
const 选中的币种24小时交易额 = ref(0);
const amplitude_1m_20_table_data = ref([]);  // initial empty data
const amplitude_1m_top20_4h_count_table_data = ref([]);  // initial empty data
const funding_rate_top20_now_table_data = ref([]);  // initial empty data
const amplitude_1m_all_data = ref({});  // initial empty data
const intervalId = ref(null);
const cardHeight = ref(0);  // default height
const activeTab = ref('first');
// 通过 inject 方法获取 $echarts 对象
const $echarts = inject('$echarts');
const updateHeight = () => {
    if (!document.getElementById('left_card')) return;
    cardHeight.value = window.innerHeight - 200;
    // console.log(window.innerHeight)
};

// ------------------------------------------------------------------------------------------------------------双马丁策略开始----------------------------------------------------------------------------------------------------
const 双马丁策略列表 = ref([]);
const 双马丁策略id = ref(null);
const 获取双马丁策略列表 = async () => {
    const res = await api_首页查询策略列表(选中的币种.value);
    双马丁策略列表.value = [];
    // console.log(res.data);
    res.data.data.forEach((item, index) => {
        双马丁策略列表.value.push({
            value: item.id,
            label: item.exchange_name + "-" + item.strategy_note + "-" + item.position_side,
            is_run: item.is_run,
            exchange_id: item.exchange_id,
        });
    });
    return res.data;
};

const 首页直接启动 = async () => {
    try {
        if (双马丁策略id.value === null) {
            ElMessage({
                message: "请选择双马丁策略",
                type: "error"
            });
            return;
        }
        const exchange_id = 双马丁策略列表.value.find(item => item.value === 双马丁策略id.value).exchange_id;
        const res = await api_首页直接启动(选中的币种.value, 双马丁策略id.value, exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "首页直接启动成功",
                type: "success"
            });
            await 获取双马丁策略列表();
        } else {
            ElMessage({
                message: "首页直接启动失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "首页直接启动失败：" + error,
            type: "error"
        });
    }
};

const 双马丁策略改变 = (val) => {
    // console.log(val);
    双马丁策略id.value = val;
};
// ------------------------------------------------------------------------------------------------------------双马丁策略结束----------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------刷新排行榜开始----------------------------------------------------------------------------------------------------
const 刷新每分钟振幅排行 = async () => {
    const res = await fapi_获取当前分钟的振幅排行();
    // console.log(res.data);
    amplitude_1m_20_table_data.value = res.data;
    return res.data;
};

const 刷新最新的资金费率排行前20 = async () => {
    const res = await fapi_获取最新的资金费率排行前20();
    // console.log(res.data);
    funding_rate_top20_now_table_data.value = res.data;
    return res.data;
};

const 刷新4小时内币种上榜次数排行 = async () => {
    const res = await fapi_获取4小时内币种上榜次数排行();
    // console.log("刷新4小时内币种上榜次数排行");
    // console.log(res.data);
    amplitude_1m_top20_4h_count_table_data.value = res.data;
    return res.data;
};

// ------------------------------------------------------------------------------------------------------------刷新排行榜结束----------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------图表相关开始----------------------------------------------------------------------------------------------------

const 刷新指定币种的振幅数据 = async (symbol) => {
    const promise_res = fapi_获取指定币种的所有振幅数据(symbol);
    const promise_res_24 = fapi_获取指定币种的24小时数据(symbol);
    const promise_res_k = fapi_获取指定币种的k线数据(symbol);
    // console.log(res.data, res_24.data, res_k.data);
    const [res_24, res_k] = await Promise.all([promise_res_24, promise_res_k]);
    let 成交量_24小时 = res_24.data.volume;
    let 成交额_24小时 = res_24.data.quoteVolume;

    成交量_24小时 = 成交量_24小时.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
        });
    });
    // 成交额_24小时 3位之间加逗号 小数点后的内容截断不要
    成交额_24小时 = 成交额_24小时.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
        });
    }).split(".")[0];
    选中的币种.value = symbol;
    选中的币种24小时成交量.value = 成交量_24小时;
    选中的币种24小时交易额.value = 成交额_24小时;
    await 获取双马丁策略列表();
    // 3. 格式化数据
    const formattedData = res_k.data.map(item => {
        const date = new Date(+item[0]);
        // console.log(item[0], date);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        return [
            +item[1], +item[4], +item[3], +item[2], // 开、收、低、高
            (-(+item[1] - +item[4]) / +item[4] * 100).toFixed(2), // 涨幅
            ((+item[2] - +item[3]) / +item[3] * 100).toFixed(2), // 振幅
            (+item[7]).toString().replace(/\d+/, function (n) { // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ",";
                });
            }).split(".")[0],//交易量
            timeStr,
        ]
    });

    //根据res_k生成成交量柱状图需要的数据
    const volumes = res_k.data.map(item => { return item[7] })
    console.log("volumes", volumes);

    // formattedTimeData 为时分格式
    const formattedTimeData = res_k.data.map(item => {
        // 先把item[0]字符串转成时间戳
        const date = new Date(+item[0]);
        // console.log(item[0], date);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        // console.log(timeStr);
        return timeStr;  // 用格式化的时间替换原始的时间戳，并保留其他数据
    });

    var myChart_kline = $echarts.init(document.getElementById('main_kline'));
    // console.log(formattedData);
    myChart_kline.setOption({
        title: {
            text: 选中的币种.value + ' 1m K线数据-4h',
            left: 10
        },
        grid: [{
            // 这是第一个grid，用于K线图
            left: '10%',
            right: '10%',
            bottom: '30%',
            height: '60%', // 设置为80%的高度
        }, {
            // 这是第二个grid，用于柱状图
            left: '10%',
            right: '10%',
            top: '68%',  // 开始于整体高度的85%，与K线图底部有5%的间隔
            height: '22%', // 设置为15%的高度，与K线图底部有5%的间隔，共计100%
        }],
        xAxis: [
            {
                type: 'category',
                data: formattedTimeData,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: formattedTimeData,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [{
            scale: true,
            splitArea: {
                show: true
            }
        }, {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        }],

        tooltip: {
            trigger: 'axis',
            transitionDuration: 0,
            confine: true,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#333',
            backgroundColor: 'rgba(255,255,255,0.9)',
            textStyle: {
                fontSize: 12,
                color: '#333'
            },
            formatter: function (params) {
                // console.log(params[0].data);
                const kData = params.find(p => p.seriesType === 'candlestick').data;
                const [index, open, close, low, high, 涨幅, 振幅, 交易额, 开盘时间] = kData;
                const isRise = close > open;  // 判断是否涨了
                const point = isRise ? '🟢' : '🔴';  // 选择相应的小圆点
                return `
                        ${point}<br>
                        开盘时间: ${开盘时间}<br>
                        开盘: ${open} USDT<br>
                        收盘: ${close} USDT<br>
                        最低: ${low} USDT<br>
                        最高: ${high} USDT<br>
                        涨幅：${涨幅}%<br>
                        振幅：${振幅}%<br>
                        交易额: ${交易额} USDT<br>
                    `;
            }

        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all'
                }
            ],
            label: {
                backgroundColor: '#777'
            }
        },
        series: [{
            type: 'candlestick',
            data: formattedData,
            itemStyle: {
                color: 'green',  // 涨的颜色
                color0: 'red',  // 跌的颜色
                borderColor: 'green',  // 涨的边框颜色
                borderColor0: 'red'  // 跌的边框颜色
            }

        },
        {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumes,
            itemStyle: {
                color: function (params) {
                    // 如果收盘价（索引为1）大于开盘价（索引为0），则为绿色，否则为红色
                    return formattedData[params.dataIndex][1] > formattedData[params.dataIndex][0] ? 'green' : 'red';
                }
            }
        }],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1] // 使两个x轴都与此数据缩放相关联
            },
            {
                type: 'slider',
                xAxisIndex: [0, 1] // 使两个x轴都与此数据缩放相关联
            }
        ]

    });
    // 基于准备好的dom，初始化echarts实例
    var myChart = $echarts.init(document.getElementById('main'));
    const res = await promise_res;
    amplitude_1m_all_data.value = res.data;
    myChart.setOption({
        title: {
            text: 选中的币种.value + ' 一天内振幅数据统计',
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
                type: 'inside',
                start: 83.6,
                end: 100
            },
            {
                type: 'slider',
                start: 83.6,
                end: 100
            }
        ]

    })

};

// ------------------------------------------------------------------------------------------------------------图表相关开始----------------------------------------------------------------------------------------------------
onMounted(async () => {
    updateHeight();
    const data = await 刷新每分钟振幅排行();
    刷新4小时内币种上榜次数排行();
    if (data && data.length > 0) {
        // console.log(data[0].symbol);
        const symbol = data[0].symbol;
        await 刷新指定币种的振幅数据(symbol);
    }
    刷新最新的资金费率排行前20();
    window.addEventListener('resize', updateHeight);
    intervalId.value = setInterval(() => {
        const currentSeconds = new Date().getSeconds();
        if (currentSeconds === 22) {
            刷新每分钟振幅排行();
            刷新4小时内币种上榜次数排行();
            刷新最新的资金费率排行前20();
        }
    }, 1000); // Run this every second
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateHeight);
    clearInterval(intervalId.value);
});




</script>

<style lang="less" scoped></style>
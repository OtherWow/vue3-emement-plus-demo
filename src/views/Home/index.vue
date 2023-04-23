<template>
    <h1>
        系统首页
    </h1>
    <div>
        <div id="main" style="width: 800px;height:400px;"></div>

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

<style lang="scss" scoped></style>
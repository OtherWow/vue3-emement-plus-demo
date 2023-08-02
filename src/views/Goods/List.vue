<template>
    <h1>产品列表</h1>
    <el-container>
        <el-header>
            <el-input v-model="symbol" placeholder="输入交易对，例如：btcusdt"></el-input>
            <el-button type="primary" @click="addSymbol">关注</el-button>
        </el-header>
        <el-main>
            <el-table :data="priceList">
                <el-table-column prop="symbol" label="交易对"></el-table-column>
                <el-table-column prop="price" label="价格"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import { ref, reactive } from "vue";

export default {
    setup() {
        const symbol = ref("");
        const priceList = reactive([]);

        const addSymbol = () => {
            if (symbol.value) {
                const ws = new WebSocket(`ws://google.cccx.top:8000/binance/api/ws/price`);
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    const index = priceList.findIndex((item) => item.symbol === data.symbol);
                    if (index === -1) {
                        priceList.push({ symbol: data.symbol, price: data.price });
                    } else {
                        priceList[index].price = data.price;
                    }
                };
                ws.onerror = (error) => {
                    console.error("WebSocket error: ", error);
                };
                symbol.value = "";
                // 当窗口关闭或刷新时，关闭WebSocket连接
                window.addEventListener('beforeunload', () => {
                    console.log("触发beforeunload")
                    // 发送一个关闭帧，告诉服务器我们打算关闭连接
                    ws.close();
                });
            }
        };

        return { symbol, priceList, addSymbol };
    },
};
</script>

<style lang="scss" scoped></style>
<template>
    <div class="header">
        <div class="icon">
            <el-icon v-if="isClose" @click="change">
                <Expand />
            </el-icon>
            <el-icon v-else @click="change">
                <Fold />
            </el-icon>

        </div>
        <div class="ticker">
            <div style="text-align: center;width: 100px;"><span
                    style="font-size: 12px; font-weight: bold;color: rgb(192,199,204);margin-bottom: 2px;">BTC/USDT</span><br>
                <span :style="{ color: btc_ticker.percentageColor }" style="font-weight: bold;">{{
                    btc_ticker.price
                }}$</span><br>
                <span :style="{ color: btc_ticker.percentageColor }" style="font-weight: bold;font-size: 12px;">{{
                    btc_ticker.percentage }}%</span>
            </div>

        </div>
        <div class="right">

            <div class="line">|</div>
            <div class="time">{{ time }}</div>
            <div class="line">|</div>
            <div class="loginout" @click="loginout">
                <el-icon>
                    <SwitchButton />
                </el-icon>
            </div>
        </div>
    </div>



    <div class="tabs-container">
        <el-tabs v-model="activeTab" type="border-card" closable @tab-remove="removeTab" @tab-click="clickTab">
            <el-tab-pane v-for="tab in global.openTabs" :key="tab.path" :label="tab.label" :name="tab.path"></el-tab-pane>
        </el-tabs>
    </div>

    <div class="wapper">
        <router-view v-slot="{ Component }">
            <component :is="Component" v-bind="Component.props" @remove-tab="removeTab" @add-tab="addTab" />
        </router-view>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'
import { ref, onUnmounted, inject, onMounted } from 'vue'
export default {
    props: ['isClose'],
    emits: ['change'],
    setup(props, { emit }) {
        const global = inject('$global');
        const route = useRoute()
        const router = useRouter()

        let activeTab = ref(route.path);
        let time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

        const clickTab = (tab) => {
            // console.log("触发clickTab", tab.props.name)
            router.push(tab.props.name)
        }

        router.afterEach((to) => {
            // console.log("触发afterEach,调用addTab", to)
            addTab(to);
        });
        const btc_ticker = ref({ price: 0, percentage: 0, percentageColor: 'rgb(0,165,154)' });// 绿色
        const connectWebSocket = () => {
            const ws = new WebSocket("ws://google.cccx.top:8000/binance/api/ws");
            ws.onmessage = (event) => {
                // console.log("接收到消息", event.data);
                const data = JSON.parse(event.data);
                btc_ticker.value.price = parseFloat(data.price).toFixed(2);
                btc_ticker.value.percentage = parseFloat(data.percentage).toFixed(2);
                if (btc_ticker.value.percentage >= 0) {
                    btc_ticker.value.percentageColor = 'rgb(0,165,154)'; // 绿色
                } else {
                    btc_ticker.value.percentageColor = 'rgb(238,125,139)';// 红色
                }
            };
        };


        onMounted(() => {
            // console.log("触发onMounted")
            connectWebSocket();
            const route = useRoute();
            addTab(route);
        });

        const addTab = (route) => {
            // console.log("触发addTab", route.path, route.meta.title, global.openTabs)
            const existingTab = global.openTabs.find((tab) => tab.path === route.path);
            if (!existingTab) {
                global.openTabs.push({
                    label: route.meta.title,
                    path: route.path,
                });
                // console.log("新增tab成功", route.path, route.meta.title, global.openTabs)
            }
            // console.log("设置activeTab", route.path)
            activeTab.value = route.path;
        };

        const removeTab = (targetPath) => {
            // console.log("触发removeTab", targetPath, global.openTabs, route.path)
            targetPath = targetPath.includes('${') ? route.path : targetPath;
            const existingTab = global.openTabs.find((tab) => tab.path === targetPath);
            if (!existingTab) {
                return;
            }
            global.openTabs = global.openTabs.filter((tab) => tab.path !== targetPath);
            // 取出最后一项，然后页面跳转到最后一项。如果没有了就跳转到系统首页
            const lastTab = global.openTabs[global.openTabs.length - 1];
            // console.log("删除tab成功", targetPath, global.openTabs, lastTab)
            if (lastTab) {
                router.push(lastTab.path);
            } else {
                router.push('/');
            }
        };




        const change = () => {
            emit('change')
        }


        // 更新时间的函数
        const updateTime = () => {
            time.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }

        // 设置定时器，每隔 1000 毫秒（1 秒）调用 updateTime 函数
        const timer = setInterval(updateTime, 1000)

        // 当组件销毁时，清除定时器
        onUnmounted(() => {
            clearInterval(timer)
        })


        const loginout = () => {
            localStorage.removeItem('token')
            router.push('/login')
        }



        return {
            change,
            time,
            loginout,
            global,
            removeTab,
            activeTab,
            clickTab, addTab, btc_ticker
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    background-color: #fff;
    color: #000;
    display: flex;
    align-items: center;
    padding: 9px 0px;

    .icon {
        font-size: 24px;

        i {
            cursor: pointer;
        }
    }

    .ticker {
        margin-left: 10px;
        flex: 1;
    }

    .right {
        padding-right: 20px;
        display: flex;
        align-items: center;

        .time {
            font-size: 12px;
            font-weight: bold;
        }

        .line {
            padding-left: 10px;
            padding-right: 10px;
        }

        .loginout {
            margin-top: 2px;
            cursor: pointer;
        }


    }

}

.ticker,
.price,
.percentage {
    font-size: 14px;
    margin: 0;
    padding: 0;
    display: block;
}

.price,
.percentage {
    display: flex;
    flex-direction: column;
    align-items: center;
}


.wapper {
    margin: 10px;
}
</style>
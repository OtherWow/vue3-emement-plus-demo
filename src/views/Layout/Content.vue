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
        <div class="right">
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

        onMounted(() => {
            // console.log("触发onMounted")
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
            clickTab, addTab
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    height: 50px;
    line-height: 50px;
    background-color: #1e78bf;
    color: #fff;
    display: flex;

    .icon {
        font-size: 24px;
        flex: 1;

        i {
            cursor: pointer;
        }
    }

    .right {
        padding-right: 20px;
        display: flex;

        .time {
            font-size: 12px;
            //加粗
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



.wapper {
    margin: 10px;
}
</style>
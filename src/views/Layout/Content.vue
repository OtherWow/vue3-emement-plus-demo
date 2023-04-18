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

    <div class="wapper">
        <router-view></router-view>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { ref, onUnmounted } from 'vue'
export default {
    props: ['isClose'],
    emits: ['change'],
    setup(props, { emit }) {
        const change = () => {
            emit('change')
        }

        let time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
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

        const router = useRouter()
        const loginout = () => {
            localStorage.removeItem('token')
            router.push('/login')
        }
        return {
            change,
            time,
            loginout
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
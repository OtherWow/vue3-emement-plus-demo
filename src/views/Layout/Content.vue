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
    </div>
    <div class="wapper">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    props: ['isClose'],

    setup(props, emit) {
        const change = () => {
            this.$emit('change')
        }

        return {
            change
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

    .icon {
        font-size: 24px;

        i {
            cursor: pointer;
        }
    }
}

.wapper {
    margin: 10px;
}
</style>
<template>
    <div class="menu">
        <Menu :isClose="isClose" />
    </div>
    <div class="content" :class="{ active: isClose }">
        <Content :isClose="isClose" @change="change" />
    </div>
</template>

<script>
import Menu from './Menu'
import { ref } from 'vue'
import Content from './Content'
export default {
    components: {
        Menu,
        Content

    },
    setup() {
        let isClose = ref(false)
        const change = () => {
            isClose.value = !isClose.value
        }
        return {
            isClose,
            change
        }

    }

}
</script>

<style lang="less" scoped>
.menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: rgb(47, 64, 80);
}

.content {
    padding-left: 200px;
}

.active {
    padding-left: 64px;
}
</style>
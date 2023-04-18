<template>
    <div class="menu">
        <Menu :isClose="isClose" />
    </div>
    <div class="content">
        <Content :isClose="isClose" />
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
        return {
            isClose
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
    background-color: #112f50;
}

.content {
    padding-left: 200px;
}
</style>
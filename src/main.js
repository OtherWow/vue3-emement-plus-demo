// 不再需要以下的导入语句
// import { createApp, reactive } from 'vue'
// import ElementPlus from 'element-plus'
// import * as echarts from 'echarts';
// import router from './router'
// import store from './store'

import 'normalize.css'
import './assets/css/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import LoadingButton from '@/components/LoadingButton.vue';
import App from './App.vue'

// 通过 window 对象访问全局的 Vue、ElementPlus、echarts、Vuex 和 VueRouter 实例
const { Vue, ElementPlus, echarts, Vuex, VueRouter } = window;
const app = Vue.createApp(App)
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 创建响应式对象作为全局变量，并设置一个默认的标签
const globalState = Vue.reactive({
    userInfo: {},
    openTabs: [],
});

// 使用 provide 提供全局变量给所有子组件
app.provide('$global', globalState);
app.provide('$echarts', echarts)
app.component('loading-button', LoadingButton);
app.use(Vuex).use(VueRouter).mount('#app')

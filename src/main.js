import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './assets/css/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import echarts from './plugins/Echarts'
import LoadingButton from '@/components/LoadingButton.vue';


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 创建响应式对象作为全局变量，并设置一个默认的标签
const globalState = reactive({
    openTabs: [],
});

// 使用 provide 提供全局变量给所有子组件
app.provide('$global', globalState);
app.provide('$echarts', echarts)
app.component('loading-button', LoadingButton);
app.use(store).use(router).mount('#app')

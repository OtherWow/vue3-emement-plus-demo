import { createApp, reactive } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './assets/css/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import LoadingButton from '@/components/LoadingButton.vue';
import locale from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
    console.error("Captured an error:", err, "Component:", vm, "Info:", info);
    // 你可以在此添加额外的错误处理，例如将错误信息发送到日志服务器
};
app.use(ElementPlus, { locale });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 创建响应式对象作为全局变量，并设置一个默认的标签
const globalState = reactive({
    userInfo: {},
    openTabs: [],
});

// 使用 provide 提供全局变量给所有子组件
app.provide('$global', globalState);
app.provide('$echarts', echarts)
app.component('loading-button', LoadingButton);
app.use(store).use(router).mount('#app')

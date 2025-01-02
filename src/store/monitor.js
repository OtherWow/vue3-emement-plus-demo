import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMonitorStore = defineStore('monitor', () => {
    const 编辑框净浮盈 = ref(0)
    // const doubleCount = computed(() => count.value * 2)
    // function increment() {
    //     count.value++
    // }

    return { 编辑框净浮盈 }
})



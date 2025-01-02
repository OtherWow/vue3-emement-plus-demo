// src/stores/detail.js
import { defineStore } from 'pinia'

export const useMdBotsDetailStore = defineStore('mdbots_detail', {
  state: () => ({
    item: null, // 存储选中的数据项
  }),
  actions: {
    setSelectedItem(item) {
      this.item = item
    },
    clearSelectedItem() {
      this.item = null
    },
  },
})

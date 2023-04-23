import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

import { reactive } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
export const store = reactive({
  openTabs: [{
    label: route.meta.title,
    path: route.path,
  }],
});

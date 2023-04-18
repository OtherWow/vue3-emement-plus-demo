import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout'
import Login from '@/views/Login'
import Home from '@/views/Home'

const Goods = () => import('@/views/Goods')
const GoodsList = () => import('@/views/Goods/List.vue')
const GoodsCategory = () => import('@/views/Goods/Category.vue')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      }, {
        path: '/goods',
        component: Goods,
        children: [
          {
            path: 'list',
            name: 'list',
            component: GoodsList
          },
          {
            path: 'category',
            name: 'category',
            component: GoodsCategory
          }
        ]
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

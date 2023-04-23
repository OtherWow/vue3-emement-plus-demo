import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout'
import Login from '@/views/Login'
import Home from '@/views/Home'


const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: '系统首页' }
      }, {
        path: '/goods',
        component: () => import('@/views/Goods'),
        children: [
          {
            path: 'list',
            name: 'goods_list',
            component: () => import('@/views/Goods/List.vue'),
            meta: { title: '产品列表' }
          },
          {
            path: 'category',
            name: 'goods_category',
            component: () => import('@/views/Goods/Category.vue'),
            meta: { title: '产品分类' }
          }
        ]
      }
      , {
        path: '/md_bots',
        component: () => import('@/views/MdBots'),
        children: [
          {
            path: 'list',
            name: 'md_bots_list',
            component: () => import('@/views/MdBots/List.vue'),
            meta: { title: '马丁机器人列表' }
          },
          {
            path: 'detail',
            name: 'md_bots_detail',
            component: () => import('@/views/MdBots/Detail.vue'),
            meta: { title: '马丁机器人详情' }
          },
          {
            path: 'create_bot',
            name: 'md_bots_create_bot',
            component: () => import('@/views/MdBots/CreateBot.vue'),
            meta: { title: '新建马丁机器人' }
          }, {
            path: 'edit_bot/:botId',
            name: 'md_bots_edit_bot',
            component: () => import('@/views/MdBots/CreateBot.vue'),
            props: (route) => ({ editMode: true, botId: route.params.botId }),
            meta: { title: '修改马丁机器人' }
          }
        ]
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: Login
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

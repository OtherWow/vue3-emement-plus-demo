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
        component: () => import('@/views/Home'),
        meta: { title: '系统首页', requiresAuth: true }, // 需要鉴权的路由
      }, {
        path: '/goods',
        component: () => import('@/views/Goods'),
        children: [
          {
            path: 'list',
            name: 'goods_list',
            component: () => import('@/views/Goods/List.vue'),
            meta: { title: '产品列表', requiresAuth: true }, // 需要鉴权的路由
          },
          {
            path: 'category',
            name: 'goods_category',
            component: () => import('@/views/Goods/Category.vue'),
            meta: { title: '产品分类', requiresAuth: true }, // 需要鉴权的路由
          }
        ]
      }, {
        path: '/exchange_infos',
        component: () => import('@/views/ExchangeInfos'),
        children: [
          {
            path: 'list',
            name: 'exchange_infos_list',
            component: () => import('@/views/ExchangeInfos/List.vue'),
            meta: { title: '交易所账号列表', requiresAuth: true }, // 需要鉴权的路由
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
            meta: { title: '马丁机器人列表', requiresAuth: true }, // 需要鉴权的路由
          },
          {
            path: 'detail',
            name: 'md_bots_detail',
            component: () => import('@/views/MdBots/Detail.vue'),
            meta: { title: '马丁机器人详情', requiresAuth: true }, // 需要鉴权的路由
          },
          {
            path: 'create_bot',
            name: 'md_bots_create_bot',
            component: () => import('@/views/MdBots/CreateBot.vue'),
            meta: { title: '新建马丁机器人', requiresAuth: true }, // 需要鉴权的路由
          }, {
            path: 'edit_bot/:botId',
            name: 'md_bots_edit_bot',
            component: () => import('@/views/MdBots/CreateBot.vue'),
            props: (route) => ({ editMode: true, botId: route.params.botId }),
            meta: { title: '修改马丁机器人', requiresAuth: true }, // 需要鉴权的路由
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

// 全局前置守卫，用于检查路由是否需要鉴权
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('token');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果需要鉴权且用户未登录（无 token），重定向到登录页面
    if (!loggedIn) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router

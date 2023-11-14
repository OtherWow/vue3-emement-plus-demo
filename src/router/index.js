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
        path: '/FundingRate',
        component: () => import('@/views/FundingRate'),
        children: [
          {
            path: 'list',
            name: 'FundingRate_list',
            component: () => import('@/views/FundingRate/List.vue'),
            meta: { title: '资金费率策略列表', requiresAuth: true }, // 需要鉴权的路由
          }
          // ,
          // {
          //   path: 'category',
          //   name: 'goods_category',
          //   component: () => import('@/views/Goods/Category.vue'),
          //   meta: { title: '产品分类', requiresAuth: true }, // 需要鉴权的路由
          // }
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
      }, {
        path: '/user_info',
        component: () => import('@/views/UserInfo'),
        children: [
          {
            path: 'balance_list',
            name: 'balance_list',
            component: () => import('@/views/UserInfo/BalanceList.vue'),
            meta: { title: '交易所余额查询', requiresAuth: true }, // 需要鉴权的路由
          },
          {
            path: 'transfer_infos',
            name: 'transfer_infos',
            component: () => import('@/views/UserInfo/TransferInfos.vue'),
            meta: { title: '交易所划转记录查询', requiresAuth: true }, // 需要鉴权的路由
          }
        ]
      }, {
        path: '/rebot_order',
        component: () => import('@/views/RobotOrder'),
        children: [
          {
            path: 'panel',
            name: 'panel',
            component: () => import('@/views/RobotOrder/Panel.vue'),
            meta: { title: '辅助下单面板', requiresAuth: true }, // 需要鉴权的路由
          },
          {
            path: 'his',
            name: 'his',
            component: () => import('@/views/RobotOrder/His.vue'),
            meta: { title: '辅助下单历史记录', requiresAuth: true }, // 需要鉴权的路由
          }
        ]
      }
      , {
        path: '/md_bots',
        component: () => import('@/views/MdBots'),
        children: [
          {
            path: 'smadingList',
            name: 'smadingList',
            component: () => import('@/views/MdBots/SmadingList.vue'),
            meta: { title: '双马丁机器人列表', requiresAuth: true }, // 需要鉴权的路由
          }, {
            path: 'smadingMonitor',
            name: 'smadingMonitor',
            component: () => import('@/views/MdBots/SmadingMonitor.vue'),
            meta: { title: '双马丁监控墙', requiresAuth: true }, // 需要鉴权的路由
          }, {
            path: 'smadingMonitor2',
            name: 'smadingMonitor2',
            component: () => import('@/views/MdBots/SmadingMonitor2.vue'),
            meta: { title: '双马丁监控墙（多账号）', requiresAuth: true }, // 需要鉴权的路由
          }, {
            path: 'smadingMonitor3',
            name: 'smadingMonitor3',
            component: () => import('@/views/MdBots/SmadingMonitor3.vue'),
            meta: { title: '双马丁监控墙（多账号2）', requiresAuth: true }, // 需要鉴权的路由
          }
        ]
      }
      , {
        path: '/partner_plan',
        component: () => import('@/views/PartnerPlan'),
        children: [
          {
            path: 'partner_plan',
            name: 'partner_plan',
            component: () => import('@/views/PartnerPlan/PartnerPlan.vue'),
            meta: { title: '交易合伙人计划', requiresAuth: true }, // 需要鉴权的路由
          }
          ,{
            path: 'my_cash_back',
            name: 'my_cash_back',
            component: () => import('@/views/PartnerPlan/MyCashBack.vue'),
            meta: { title: '我的返现', requiresAuth: true }, // 需要鉴权的路由
          }
        ]
      }
      ,{
        path: '/disclaimer',
        name: 'disclaimer',
        component: () => import('@/views/Mzsm/Mzsm.vue'),
        meta: { title: '免责声明', requiresAuth: true }, // 需要鉴权的路由
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

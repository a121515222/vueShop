import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) { return savedPosition || { top: 0 } },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/front/FrontPageView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/front/HomeView.vue'),
          meta: { title: 'Home' },
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('../views/front/ProductsView.vue'),
          meta: { title: 'Products' }
        },
        {
          path: 'product/:id',
          component: () => import('../views/front/ProductView.vue'),
          meta: { title: 'Product' }
        },
        {
          path: 'articles',
          name: 'Articles',
          component: () => import('../views/front/ArticlesView.vue'),
          meta: { title: 'Articles' }
        },
        {
          path: 'article/:id',
          component: () => import('../views/front/ArticleView.vue'),
          meta: { title: 'Article' }
        },
        {
          path: 'sendInfo',
          name: 'SendInfo',
          component: () => import('../views/front/SendInfoView.vue'),
          meta: { title: 'SendInfo' }
        },
        {
          path: 'guestOrderPay/:id',
          name: 'GuestOrderPay',
          component: () => import('../views/Front/GuestOrderPayView.vue'),
          meta: { title: 'GuestOrderPay' }
        },
        {
          path: 'guestOrderFinished',
          name: 'GuestOrderFinished',
          component: () => import('../views/Front/GuestOrderFinishedView.vue'),
          meta: { title: 'GuestOrderFinished' }
        },
        {
          path: 'guestOrderLists',
          name: 'GuestOrderLists',
          component: () => import('../views/Front/GuestOrderListsView.vue'),
          meta: { title: 'GuestOrderLists' }
        },
      ]
    },
    {
      path: '/logIn',
      name: 'LogIn',
      component: () => import('../views/admin/LogInView.vue'),
      meta: { title: 'LogIn' }
    },
    {
      path: '/admin',
      name: 'DashBoard',
      component: () => import('../views/admin/DashBoardView.vue'),
      meta: { title: 'DashBoard' },
      children: []
    },
    {
      path: '/:matchPath(.*)*',
      name: 'FindNoPage',
      component: () => import('../views/front/FindNoPage.vue')
    }
  ]
})

export default router

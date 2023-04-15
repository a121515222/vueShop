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
      ]
    }
  ]
})

export default router

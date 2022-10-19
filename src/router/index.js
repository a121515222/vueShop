import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      ]
    }
  ]
})

export default router

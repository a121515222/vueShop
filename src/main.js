import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css'
import App from './App.vue'
import router from './router'
import CKEditor from '@ckeditor/ckeditor5-vue'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/stylesheet/all.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CKEditor)
app.component('VueLoading', VueLoading)
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});
app.mount('#app')

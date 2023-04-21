<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useInfoStore } from '../../stores/useInfoStore';
import loginApi from '../../assets/adminAPI/apiLogin.js'

const { loginCheck, logoutAdmin } = loginApi; 
const logInResult = ref(false);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const router = useRouter();
const isLoadingPage = ref(false);

async function logInspection() {
  const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)myHextoken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  axios.defaults.headers.common.Authorization = myToken;
  isLoadingPage.value = true;
  const res = await loginCheck(myToken);
  if(res.data?.success) {
    isLoadingPage.value = false;
  } else if(res.response.data.success === false) {
    isLoadingPage.value = false;
    alert('請重新登入');
    router.push('/logIn');
  }
}
async function logOut() {
  const res = await logoutAdmin();
  if(res.data.success) {
    document.cookie = `myHextoken= ''; expires= ${new Date()}`;
    addMessage(
      {
        title: '登出結果',
        style: 'success',
        content: `${res.data.message}`
      }
    )
    router.push('/logIn');
  }
}
onMounted(()=>{
  logInspection();
});

</script>
<template>
  <VueLoading :active="isLoadingPage" :z-index="1060"/>
 <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarText"
    aria-controls="navbarText"
    aria-expanded="false"
    aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/admin/adminProducts">管理產品列表</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/admin/adminCoupons">管理優惠券</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/admin/adminOrders">管理訂單</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/admin/adminArticles">管理文章</RouterLink>
        </li>
      </ul>
      <button class="btn btn-primary" type="button" @click="logOut">登出</button>
      <span class="navbar-text">
       後台
      </span>
    </div>
  </div>
  </nav>
  <RouterView v-if="logInResult"/>
</template>



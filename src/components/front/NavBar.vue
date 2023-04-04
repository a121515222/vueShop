<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUtilStore } from '../../stores/useUtilStore';
const utilStore = useUtilStore();
const { scrollY } = storeToRefs(utilStore);

const navBarRef = ref(null);
function removeShow () {
      navBarRef.value.classList.remove('show');
    }
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-primary fixed-top" :class="{'bg-secondary': scrollY > 100}">
        <div class="container-fluid">
          <RouterLink class="logo navbar-brand fs-2 hover-color" to='/'
            :class="{'text-primary': scrollY > 100, 'text-secondary':scrollY < 100}">
            自種自售
          </RouterLink>
          <button class="navbar-toggler hover-color" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarFontPage" aria-controls="navbarFontPage" aria-expanded="false"
            aria-label="Toggle navigation">
            <i class="bi bi-list" style="font-size:26px"
              :class="{'text-primary': scrollY > 100, 'text-secondary':scrollY < 100}">
            </i>
          </button>
          <div class="collapse navbar-collapse" id="navbarFontPage" ref="navBarRef">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li class="nav-item">
                <RouterLink to="/products" class="nav-link hover-color"
                  :class="{'text-primary': scrollY > 100, 'text-secondary':scrollY < 100}" aria-current="page"
                  @click="removeShow()">
                  產品列表
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/articles" class="nav-link hover-color"
                  :class="{'text-primary': scrollY > 100, 'text-secondary':scrollY < 100}" aria-current="page"
                  @click="removeShow()">
                  文章列表
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/guestOrderLists" class="nav-link hover-color"
                  :class="{'text-primary': scrollY > 100, 'text-secondary':scrollY < 100}" aria-current="page"
                  @click="removeShow()">
                  訂單查詢
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
</template>

<style lang="scss" scoped>
@font-face {
      font-family: logo;
      src: url('../../assets/font/kurobara-cinderella.ttf');
    }
  .logo {
      font-family: logo;
  }
  .hover-color,.active {
    &:hover {
      color: #fff !important;
    }
  }
</style>
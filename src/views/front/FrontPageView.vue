<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useGetCartStore } from '../../stores/useGetCartStore';
import { useGetArticlesStore } from '../../stores/useGetArticlesStore';
import { useGetProductsStore } from '../../stores/useGetProductsStore';
import { useUtilStore } from '../../stores/useUtilStore';
import NavBar from '../../components/front/NavBar.vue'
import CartCanvass from '../../components/front/CartCanvass.vue';

const cartStore = useGetCartStore();
const { getCarts } = cartStore;
const { cartData, cartLength, isCartLoading} = storeToRefs(cartStore);

const articleStore = useGetArticlesStore();
const { isArticleLoading } = storeToRefs(articleStore);

const productStore = useGetProductsStore();
const { isProductLoading } = storeToRefs(productStore);

const utilStore = useUtilStore();
const { scrollHandler } = utilStore;
const { scrollY } = storeToRefs(utilStore);


const isLoading =  computed(()=>{
  return isCartLoading.value || isArticleLoading.value || isProductLoading.value;
})


function guestOpenCart() {
  cartRef.value.cartOpen();
}

const cartRef = ref(null);
onMounted(()=>{
  window.addEventListener('scroll', scrollHandler);
  getCarts();
})

</script>
<template>
  <VueLoading :active="isLoading"/>
  <div class="d-flex flex-column" style="min-height:100vh">
    <template v-if="!($route.path === '/' && scrollY < 300)">
      <div class="cart bg-secondary d-flex justify-content-center align-items-center">
        <a href="#" class="cartIcon" @click.prevent="guestOpenCart()">
          <i class="bi bi-cart3 position-relative text-white hover-cart"></i>
        </a>
        <span class="position-absolute start-100 translate-middle badge rounded-pill bg-danger px-2"
          style="font-size:6px; top:0 ;" v-if="cartLength > 0">
          {{cartLength}}
        </span>
      </div>
    </template>
    <div class="from-group">
      
      <NavBar />
      <RouterView />
    </div>
    <div class="from-group footerSticky">
      <div class="container-fluid bg-third d-flex justify-content-center align-items-center gap-3 bottomIconHover">
        <a class="text-white fs-5 fs-sm-3 bottomIconHover" href="tel:+886-8-123123" style="text-decoration: none;">
          聯絡我們:(08)123123
        </a>
        <a class="text-white fs-3 bottomIconHover" href="#"><i class="bi bi-facebook"></i></a>
        <a class="text-white fs-3 bottomIconHover" href="#"><i class="bi bi-twitter"></i></a>
        <a class="text-white fs-3 bottomIconHover" href="#"><i class="bi bi-instagram"></i></a>
        <a class="text-white fs-3 bottomIconHover" href="#"><i class="bi bi-line"></i></a>
      </div>
    </div>
  </div>
  <CartCanvass ref="cartRef" />
  
</template>
<style lang="scss" scoped>
 
  .footerSticky {
    margin-top: auto;
  }
  .cart {
  z-index: 9;
  width:30px;
  height:30px;
  border-radius:7px;
  position: fixed;
  bottom: 10%;
  right: 2%;
  }
  .cartIcon {
    font-size: 25px;
  }
  .hover-cart {
    &:hover {
      color: rgb(216, 12, 12) !important;
    }
  }
  .bottomIconHover {
    &:hover {
      color: rgb(216, 12, 12) !important;
    }
  }
    @media (min-width:768px) {
    .cart {
      width: 60px;
      height: 60px;
      border-radius:15px;
    }
    .cartIcon {
    font-size: 50px;
  }
  }
</style>
<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GuestProductModal from '../../components/front/GuestProductModal.vue';
import ShowProduct from '../../components/front/showProduct.vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore';
const productStore = useGetProductsStore();
const { getProduct } = productStore;
const { dataProduct:product } = storeToRefs(productStore);
const route = useRoute();
const images = ref([]);
const filterProducts = ref([]);
async function getProductData(){
  const { id } = route.params;
  const res = await getProduct(id);
  console.log('singleData', res)
  console.log('image', res.data.product.imageUrl)
  images.value = [res.data.product.imageUrl,...res.data.product.imagesUrl];
  
  
  // this.product = res.data.product
  // this.isLoadingPage = false
  // this.pathId = this.product.id
  // this.images = [this.product.imageUrl, ...this.product.imagesUrl]
  // this.keyWord = [this.product.title, this.product.category]
  // 修改標題,如果沒有標題就用route中index.js內建標題
  document.title = product.title || route.meta.title
}
onMounted(()=>{
  getProductData();
})

</script>
<template>
  <div class="container pt-10">
    <VueLoading :active="isLoadingPage" :z-index="1060"/>
    <div class="row card flex-md-row mx-0">
      <div class="col-12 col-lg-6 ps-0">
        <template v-if="images.length > 2">
          <div class="img-fluid" style="height:360px; overflow:hidden;">
            <img style="object-fit:cover; width:100%; height:100%;"
            :src="images[0]"
            :alt="`${product.title} picture`" >
          </div>
        </template>
        <template v-else-if="images.length <= 2">
          <div class="img-fluid" style="height:360px; overflow:hidden;">
          <img style="object-fit:cover; width:100%; height:100%;"
          :src="product.imageUrl"
          :alt="`${product.title} picture`" >
        </div>
        </template>
      </div>
      <div class="col-12 col-lg-6 d-flex flex-column justify-content-between pe-0 mt-3">
        <div class="from-group pe-2">
          <h2 class="fw-bold fs-2">{{product.title}}</h2>
          <div class="fs-4" v-html="product.description"></div>
        </div>
        <div class="from-group">
          <template v-if="product.origin_price === product.price">
            <div class="d-flex justify-content-end gap-2 pe-2">
              <span>售價{{product.origin_price}}元</span>
              <span>/{{product.unit}}</span>
            </div>
          </template>
          <template v-else-if="product.origin_price > product.price">
            <div class="d-flex justify-content-end gap-2 pe-2">
              <span class="text-decoration-line-through text-middle">原價{{product.origin_price}}</span>
              <span class="text-danger">特價{{product.price}}元</span>
              <span>/{{product.unit}}</span>
            </div>
          </template>
          <div class="d-flex justify-content-end gap-3 ">
            <button type="button" class="btn btn-primary text-secondary text-nowrap"
            @click="qty -= 1" :disabled="qty < 2"
            :class="{buttonDisabledCursor : qty < 2}">
              <i class="bi bi-dash"></i>
            </button>
            <span class="align-self-center px-1" style="min-width:20px"> {{qty}}</span>
            <button type="button" class="btn btn-primary text-secondary text-nowrap"
            @click="qty += 1" :disabled="qty === 100"
            :class="{buttonDisabledCursor : qty === 100}">
              <i class="bi bi-plus"></i>
            </button>
            <button type="button" class="btn btn-primary text-secondary text-nowrap"
            @click="addCart(product.id, product.title)"
            :disabled="isLoading || qty < 1"
            :class="{buttonDisabledCursor : isLoading || qty < 1}">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
              v-show="isLoading"></span>
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 py-3" v-if="images.length > 2">
        <h3 class="fa-2 fw-bold">產品圖片</h3>
        <div class="d-flex flex-row gap-3 customScrollBar" style="overflow-x:scroll">
          <div class="pictureSize" v-for="(i, index) in images" :key="i + index">
            <a href="#" @click.prevent="changePicture(index)">
               <img style="height:100%; width:100%; object-fit: cover"
               :src="i" :alt="product.title + 'picture' + index">
            </a>
         </div>
        </div>
      </div>
      <div class="col-12 my-3" v-if="filterProducts.length > 0">
        <h3 class="fw-bold fa-2">推薦產品</h3>
        <ShowProduct
        :guest-show-product="filterProducts"
        :is-guest-page-loading="isLoadingPage"
        @send-id="guestProductDetail"
        @inspect-id="inspectRouteId"
        @add-cart="guestAddCart"
        />
      </div>
    </div>
  </div>
  <!-- Modal -->
  <GuestProductModal ref="guestModal" @send-id="getId"/>
</template>
<style></style>
<script setup>
import { storeToRefs } from 'pinia';
import { useGetProductsStore } from '../../stores/useGetProductsStore';
import { useInfoStore } from '../../stores/useInfoStore';
import { useGetCartStore } from '../../stores/useGetCartStore';
import { onMounted, ref, watch } from 'vue-demi';
import GuestProductModal from '../../components/front//GuestProductModal.vue';
import { useRouter, useRoute } from 'vue-router';

const productStore = useGetProductsStore();
const { getProducts } = productStore
const { dataProducts, isProductLoading } = storeToRefs(productStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const cartStore = useGetCartStore();
const { addCart } = cartStore;

const showData = ref([]);
const props = defineProps(['guestShowProduct']);

watch(dataProducts,(newValue, oldValue) =>{
  if(newValue !== oldValue && replaceData.value < getProductData.value) {
    showData.value = newValue.products;
  }
})

const favorites = ref(JSON.parse(localStorage.getItem('myFavoritesItem')) || []);
function addFavorites(id, title) {
  favorites.value.push(id)
  localStorage.setItem('myFavoritesItem', JSON.stringify(favorites.value))
  addMessage(
    {
      title: '加入最愛結果',
      style: 'success',
      content: `${title}已加入最愛`
    }
  )
}
function deleteFavorites(id, title) {
  const indexRemove = favorites.value.indexOf(id)
  favorites.value.splice(indexRemove, 1)
  localStorage.setItem('myFavoritesItem', JSON.stringify(favorites.value))
  addMessage(
    {
      title: '移除最愛結果',
      style: 'success',
      content: `${title}已移除最愛`
    }
  )
}
const productModalRef = ref(null);
function guestProductDetail(id){
  productModalRef.value.modalOpen(id)
}
async function showProductsAddCart(id, title, unit){

  const sendData = {
  data: {
    product_id: id,
    qty: 1
  }
  }
  
  const resData = await addCart(sendData);
  cartAddInfo(resData, title, unit);
  
}

function cartAddInfo(res, title, unit){
  switch (res.data.message) {
    case '已加入購物車':
      addMessage(
        {
          title: '加入購物車結果',
          style: 'success',
          content: `${title}1${unit}${res.data.message}`
        }
      )
      break;
    default:
      addMessage(
        {
          title: '加入購物車結果',
          style: 'danger',
          content: '加入失敗'
        }
      )
  }
}

const replaceData = ref(0);
function propsReplaceDataProduct(){
  if(props.guestShowProduct !== undefined) {
    replaceData.value = new Date();
    showData.value = props.guestShowProduct;
  }
}

const getProductData = ref(0);
function initShowProduct(){
  getProductData.value = new Date();
  getProducts();
}

const routers = useRouter();
function goToProduct(path){
  routers.push(path);
}

const route = useRoute();
onMounted(()=>{
  initShowProduct();
  propsReplaceDataProduct();
})

</script>
<template>
  <div class="row pt-3">
    <template v-if="showData.length > 0">
      <template v-for="(item) in showData" :key="item.id">
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
          <a class="text-black" href="#" style="text-decoration:none;"
            @click.prevent="goToProduct(`/product/${item.id}`)">
            <div class="card  px-0 position-relative cardHover" v-if="item.is_enabled === 1 || 4">
              <img class="img-fluid card-img-top" style="max-height:200px;min-height:200px;" :src="item.imageUrl"
                :alt="item.title">
              <p class="position-absolute top-0 end-0 bg-secondary text-primary p-1" v-if="item.is_enabled === 4">
                促銷中
              </p>
              <div class="position-absolute top-33 end-0 bg-third d-flex justify-content-center align-items-center"
                style="border-radius:5px; height:33px; width:33px">
                <a v-if="favorites.indexOf(item.id) === -1" class="text-danger fs-4" title="加入我的最愛" href="#"
                  @click.stop.prevent="addFavorites(item.id, item.title)">
                  <i class="bi bi-suit-heart"></i>
                </a>
                <a class="text-danger fs-4" title="移除我的最愛" href="#" v-else-if="favorites.indexOf(item.id) > -1"
                  @click.stop.prevent="deleteFavorites(item.id, item.title)">
                  <i class="bi bi-suit-heart-fill"></i>
                </a>
              </div>
              <div class="card-body pb-0 border-top">
                <h3 class="fa-3 fw-bold">{{item.title}}</h3>
                <div v-html="item.description" class="lineClamp"></div>
              </div>
              <div class="card-footer bg-transparent border-top-0 pb-2">
                <div v-if="item.origin_price === item.price">
                  <span>售價{{item.origin_price}}元</span>
                  <span>/{{item.unit}}</span>
                </div>
                <div v-else>
                  <span class="text-decoration-line-through text-middle">原價{{item.origin_price}}</span>
                  <span class="text-danger">特價{{item.price}}元</span>
                  <span>/{{item.unit}}</span>
                </div>
                <button class="btn btn-outline-secondary text-primary w-100 mb-1" type="button"
                  @click.stop.prevent="guestProductDetail(item.id)" 
                  :disabled=isProductLoading
                  :class="{buttonDisabledCursor : item.id === isProductLoading}">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-show=isProductLoading>
                  </span>
                  快速商品資訊
                </button>
                <RouterLink class="btn btn-outline-secondary text-primary w-100 mb-1" 
                  :to="`/product/${item.id}`"
                  :disabled=isProductLoading
                  :class="{buttonDisabledCursor : item.id === isProductLoading}">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-show=isProductLoading>
                  </span>商品詳細資訊
                </RouterLink>
                <button class="btn btn-primary w-100 text-secondary" type="button"
                  @click.stop.prevent="showProductsAddCart(item.id, item.title, item.unit)" :disabled=isProductLoading
                  :class="{buttonDisabledCursor : item.id === isProductLoading}">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-show=isProductLoading>
                  </span>
                  加到購物車
                </button>
              </div>
            </div>
          </a>
        </div>
      </template>
    </template>
    <template v-else-if="showData.length === 0">
      <h2 class="mx-auto">搜尋不到東西</h2>
    </template>
  </div>
  <GuestProductModal ref="productModalRef"/> 
</template>
<style>

</style>
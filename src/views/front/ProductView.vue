<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GuestProductModal from '../../components/front/GuestProductModal.vue';
import ShowProduct from '../../components/front/showProduct.vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore';
const productStore = useGetProductsStore();
const { getProduct,getProducts } = productStore;
const { dataProduct:product, dataProducts, isDataLoading } = storeToRefs(productStore);
const route = useRoute();
const images = ref([]);

const keyWords = ref([]);
async function getProductData(){
  const { id } = route.params;
  const res = await getProduct(id);
  getProducts();
  images.value = [res.data.product.imageUrl,...res.data.product.imagesUrl];
  keyWords.value = [res.data.product.title, res.data.product.category];
  console.log('keyWords', keyWords.value)
  console.log('products',dataProducts.value)
  recommendProduct();
  // this.product = res.data.product
  // this.isLoadingPage = false
  // this.pathId = this.product.id
  // this.images = [this.product.imageUrl, ...this.product.imagesUrl]
  // this.keyWord = [this.product.title, this.product.category]
  // 修改標題,如果沒有標題就用route中index.js內建標題
  document.title = product.title || route.meta.title
}
const productNum = ref(0);
async function addCarts(id, title, unit){
  addingProductId.value = id; 
  const sendData = {
  data: {
    product_id: id,
    qty: productNum.value
  }
  }
  
  const resData = await addCart(sendData);
  cartAddInfo(resData, title, unit);
  addingProductId.value = '';
  productNum.value = 0;
  modalClose();
}
watch(dataProducts,(newValue, oldValue)=>{
  if(newValue !== oldValue) {
    recommendProduct();
    console.log('newValue',newValue);
  }
},{deep: true});
const recommendProducts = ref([]);
function recommendProduct() { 
  // 推薦商品功能
  //recommend

  console.log('r',dataProducts.value)
  recommendProducts.value = [];
  keyWords.value.forEach((item) => {
    dataProducts.value.products.forEach((i) => {
      if (i.category.indexOf(item) !== -1 || i.content.indexOf(item) !== -1 || i.description.indexOf(item) !== -1 ||
      i.title.indexOf(item) !== -1) {
        recommendProducts.value.push(i);
        // 去除重複的資料
        recommendProducts.value = [...new Set(recommendProducts.value)];
        console.log('recommendProducts',recommendProducts.value);
      }
    });
  });
}
function cartAddInfo(res, title, unit){
  console.log('add',res.data)
  switch (res.data.message) {
    case '已加入購物車':
      addMessage(
        {
          title: '加入購物車結果',
          style: 'success',
          content: `${title}${productNum.value}${unit}${res.data.message}`
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
onMounted(()=>{
  getProductData();
})

</script>
<template>
  <div class="container pt-10">
    <VueLoading :active="isDataLoading" :z-index="1060"/>
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
            @click="productNum -= 1" :disabled="productNum < 2"
            :class="{buttonDisabledCursor : productNum < 2}">
              <i class="bi bi-dash"></i>
            </button>
            <span class="align-self-center px-1" style="min-width:20px"> {{productNum}}</span>
            <button type="button" class="btn btn-primary text-secondary text-nowrap"
            @click="productNum += 1" :disabled="productNum === 100"
            :class="{buttonDisabledCursor : productNum === 100}">
              <i class="bi bi-plus"></i>
            </button>
            <button type="button" class="btn btn-primary text-secondary text-nowrap"
            @click="addCarts(product.id, product.title)"
            :disabled="isDataLoading || productNum < 1"
            :class="{buttonDisabledCursor : isDataLoading || productNum < 1}">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
              v-show="isDataLoading"></span>
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
      <div class="col-12 my-3" v-if="recommendProducts.length > 0">
        <h3 class="fw-bold fa-2">推薦產品</h3>
        <ShowProduct
        :guest-show-product="recommendProducts"
        />
      </div>
    </div>
  </div>
  <!-- Modal -->
  <GuestProductModal ref="guestModal" />
</template>
<style lang="scss">
  .pictureSize {
    height: 280px;
    min-width: 300px;
  }
  @media (min-width:992px) {
    .pictureSize {
    height: 30vh;
    min-width: 33%;
   }
  }
</style>
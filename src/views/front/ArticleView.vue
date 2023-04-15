<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import readTime from '../../assets/methods/ReadTime'
import showProduct from '../../components/front/showProduct.vue'
import { useGetArticlesStore } from '../../stores/useGetArticlesStore';
import { useGetProductsStore } from '../../stores/useGetProductsStore';

const articleStore = useGetArticlesStore();
const { getArticle } = articleStore;
const { singleArticle } = storeToRefs(articleStore);

const productsStore = useGetProductsStore();
const { getProducts } = productsStore;
const { dataProducts } = storeToRefs(productsStore);

const { getTime:showTime } = readTime;
const recommendProducts = ref([]);

const keyWords = ref([]);
const route = useRoute();
const { id } = route.params;
async function getArticleData() {
  getProducts();
  const res = await getArticle(id);
  keyWords.value = res.data.article.tag;
  recommendProduct();
}

function recommendProduct() { 
  keyWords.value.forEach((keyWord)=>{
    dataProducts.value.forEach((product)=>{
    if(product.category.includes(keyWord)
    || product.content.includes(keyWord)
    || product.description.includes(keyWord)
    ) 
    {
      recommendProducts.value.push(product);
    }
    })
  });
    recommendProducts.value = [...new Set(recommendProducts.value)];
}

onMounted(()=>{
  getArticleData();
})
</script>
<template>
  
  <div class="container pt-10">
  <div class="row my-3">
    <div class="col-12 col-lg-6 px-0" style="min-height:45vh; max-height:45vh;" >
      <img style="width:100%; height:100%; object-fit:cover;"
      :src="singleArticle.article?.image"
      :alt="singleArticle.article?.title + 'picture'">
    </div>
    <div class="col-12 col-lg-6 mt-3">
      <h2 class="fw-bold fa-2 mb-2">{{singleArticle.article?.title}}</h2>
      <p class="fa-4 mb-2">作者:{{singleArticle.article?.author}}</p>
      <p class="fa-4 mb-2">發布時間:{{showTime(singleArticle.article?.create_at || 0)}}</p>
      <p class="mb-2" v-html="singleArticle.article?.content"></p>
    </div>
  </div>
  <div class="row my-3" v-if="recommendProducts.length > 0">
    <h2 class="fw-bold fa-2">推薦產品</h2>
    <showProduct :guest-show-product="recommendProducts"/>
  </div>
  </div>
</template>



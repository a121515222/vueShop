import { defineStore } from "pinia";
import { ref } from 'vue';

import apiProducts from '../assets/getAPI/apiProduct'
const { getData, getSingleData } = apiProducts;

export const useGetProductsStore = defineStore('storeProducts', ()=>{
  const dataProducts = ref([]);
  const dataProduct = ref([]);
  const isProductLoading = ref(false);
  async function getProducts(){
    try {
      isProductLoading.value = true;
      const resData = await getData();
      dataProducts.value = resData.products;
      isProductLoading.value = false;
    } catch (error) {
      console.log(error)
    }
  }
  async function getProduct(id){
    try {
      isProductLoading.value = true;
      const resData = await getSingleData(id);
      dataProduct.value = resData.data.product;
      isProductLoading.value = false;
      return resData
    } catch (error) {
      console.log(error)
    }
  }
function showMyFavorites() {
  const myFavorites = JSON.parse(localStorage.getItem('myFavoritesItem'))
  dataProducts.value = dataProducts.value.filter((product)=>{
    if(myFavorites.includes(product.id)){
      return product
    }
  });
}

function searchKeyWordsResults(keyWords) {
  dataProducts.value = dataProducts.value.filter((product) => {
    for (const keyWord of keyWords) {
      if (product.title.includes(keyWord)
      || product.category.includes(keyWord)
      || product.content.includes(keyWord)
      || product.description.includes(keyWord)) {
        return true;
      }
    }
    return false;
  });
}

function searchByMinPrice(minPrice) {
  dataProducts.value = dataProducts.value.filter((product) =>{
    if(product.price >= minPrice) {
      return true;
    }
  });
}
function searchByMaxPrice(maxPrice) {
  dataProducts.value = dataProducts.value.filter((product) =>{
    if(product.price <= maxPrice) {
      return true;
    }
  });
}
function searchResults(keyWords, minPrice, maxPrice) {
  console.log('search',keyWords)
  if(keyWords){
    searchKeyWordsResults(keyWords);
  }
  if(minPrice){
    searchByMinPrice(minPrice);
  }
  if(maxPrice){
    searchByMaxPrice(maxPrice);
  }
}
function sortResultsHightToLow() {
  dataProducts.value.sort((a, b) => {
    if (a.price < a.origin_price) {
      return b.price - a.price
    } else if (a.price === a.origin_price) {
      return b.price - a.origin_price
    }
  });
}
function sortResultsLowToHight() {
  dataProducts.value.sort((a, b) => {
    if (a.price < a.origin_price) {
      return a.price - b.price
    } else if (a.price === a.origin_price) {
      return a.price - b.origin_price
    }
  });
}
  
return{
  dataProducts,
  dataProduct,
  isProductLoading,
  getProducts,
  getProduct,
  showMyFavorites,
  searchResults,
  sortResultsHightToLow,
  sortResultsLowToHight,
}
})
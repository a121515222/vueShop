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
      dataProducts.value = resData;
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

  // showMyFavorites () {
  //   const myFavorites = JSON.parse(localStorage.getItem('myFavoritesItem'))
  //   this.guestShowProduct = []
  //   this.guestProduct.forEach((i) => {
  //     if (myFavorites.indexOf(i.id) !== -1) {
  //       this.guestShowProduct.push(i)
  //     }
  //   })
  // },
  // sortHightToLow () {
  //   this.guestShowProduct.sort((a, b) => {
  //     if (a.price < a.origin_price) {
  //       return b.price - a.price
  //     } else if (a.price === a.origin_price) {
  //       return b.price - a.origin_price
  //     }
  //   })
  // },
  // sortLowToHight () {
  //   this.guestShowProduct.sort((a, b) => {
  //     if (a.price < a.origin_price) {
  //       return a.price - b.price
  //     } else if (a.price === a.origin_price) {
  //       return a.price - b.origin_price
  //     }
  //   })
  // },
  // infoFilter (info) {
  //   const infoArr = info.split(' ')
  //   this.guestProduct.forEach((item) => {
  //     infoArr.forEach((i) => {
  //       if (item.category.indexOf(i) !== -1 || item.content.indexOf(i) !== -1 || item.description.indexOf(i) !== -1 ||
  //       item.title.indexOf(i) !== -1) {
  //         this.guestShowProduct.push(item)
  //       }
  //     })
  //   })
  // },
  // minFilter (min, max, info) {
  //   if (min) {
  //     if (this.guestShowProduct.length === 0 && !info && !max) {
  //       this.guestShowProduct = this.guestProduct
  //     }
  //     this.guestShowProduct = this.guestShowProduct.filter(item => min <= item.price || min <= item.origin_price)
  //   }
  // },
  // maxFilter (max, min, info) {
  //   if (max) {
  //     if (this.guestShowProduct.length === 0 && !info && !min) {
  //       this.guestShowProduct = this.guestProduct
  //     }
  //     this.guestShowProduct = this.guestShowProduct.filter(item => max >= item.price || max >= item.origin_price)
  //   }
  // },
  // guestShowSearch (info, min, max) {
  //   if (info || min || max) {
  //     this.guestShowProduct = []
  //     this.infoFilter(info)
  //     this.minFilter(min, max, info)
  //     this.maxFilter(max, min, info)
  //   } else {
  //     this.guestShowProduct = this.guestProduct
  //   }
  // }
    
  return{
    dataProducts,
    dataProduct,
    isProductLoading,
    getProducts,
    getProduct
  }
})
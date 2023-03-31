import { defineStore } from "pinia";
import { ref } from 'vue';

import getDataProducts from '../assets/getAPI/apiProduct'
const { getData } = getDataProducts;

export const useGetProductsStore = defineStore('storeProducts', ()=>{
  const dataProducts = ref([]);
  let isDataLoading = false
  async function getProducts(){
    try {
      isDataLoading = true;
      const resData = await getData();
      dataProducts.value = resData;
      isDataLoading = false;
    } catch (error) {
      console.log(error)
    }
  }

  return{
    dataProducts,
    isDataLoading,
    getProducts
  }
})
import { defineStore } from "pinia";
import { ref } from 'vue';

import apiProducts from '../assets/getAPI/apiProduct'
const { getData, getSingleData } = apiProducts;

export const useGetProductsStore = defineStore('storeProducts', ()=>{
  const dataProducts = ref([]);
  const dataProduct = ref([]);
  let isDataLoading = false;
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
  async function getProduct(id){
    try {
      isDataLoading = true;
      const resData = await getSingleData(id);
      dataProduct.value = resData;
      console.log(resData);
    } catch (error) {
      console.log(error)
    }
  }
    
  return{
    dataProducts,
    dataProduct,
    isDataLoading,
    getProducts,
    getProduct
  }
})
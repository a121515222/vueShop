import axios from 'axios';
import { defineStore } from "pinia";
import { ref } from 'vue';

import getDataProducts from '../assets/getAPI/apiProduct.js'
const { getData } = getDataProducts

export const useGetProductsStore = defineStore('storeProducts', ()=>{
  const dataProducts = ref([]);
  let isDataLoading = false
  async function getProducts(){
    try {
      // const resData = await axios.get(`${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/products/all`);
      isDataLoading = true;
      const resData = await getData();
      dataProducts.value = resData;
      isDataLoading = false;
    } catch (error) {
      console.error(error)
    }
  }

  return{
    dataProducts,
    isDataLoading,
    getProducts
  }
})
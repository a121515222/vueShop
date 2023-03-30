import { defineStore } from "pinia";
import { ref } from 'vue';

import getDataArticles from '../assets/getAPI/apiGetData.js'
const { getData } = getDataArticles;

export const useGetArticlesStore = defineStore('storeArticles', ()=>{
  const dataArticles = ref([]);
  async function getArticles(){
    try {
      const resData = await getData();
      dataArticles.value = resData
    } catch (error) {
      console.log(error)
    }
  }

  return{
    dataArticles,
    getArticles
  }
})
import { defineStore } from "pinia";
import { ref } from 'vue';

import apiArticles from '../assets/getAPI/apiArticles'
const { getData } = apiArticles;

export const useGetArticlesStore = defineStore('storeArticles', ()=>{
  const dataArticles = ref([]);
  async function getArticles(){
    try {
      const resData = await getData();
      dataArticles.value = resData;
    } catch (error) {
      console.log(error)
    }
  }

  return{
    dataArticles,
    getArticles,
  }
})
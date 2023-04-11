import { defineStore } from "pinia";
import { ref } from 'vue';

import apiArticles from '../assets/getAPI/apiArticles'
const { getData } = apiArticles;

export const useGetArticlesStore = defineStore('storeArticles', ()=>{
  const dataArticles = ref([]);
  const isArticleLoading = ref(false)
  async function getArticles(){
    try {
      isArticleLoading.value = true;
      const resData = await getData();
      dataArticles.value = resData;
      isArticleLoading.value = false;
    } catch (error) {
      console.log(error)
    }
  }

  return{
    dataArticles,
    isArticleLoading,
    getArticles,
  }
})
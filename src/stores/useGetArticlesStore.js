import axios from 'axios';
import { defineStore } from "pinia";
import { ref } from 'vue';

import getDataArticles from '../assets/getAPI/apiArticles.js'
const { getData } = getDataArticles

export const useGetArticlesStore = defineStore('storeArticles', ()=>{
  const dataArticles = ref([]);
  async function getArticle(){
    try {
      const resData = await getData();
      dataArticles.value = resData
    } catch (error) {
      console.error(error)
    }
  }

  return{
    dataArticles,
    getArticle
  }
})
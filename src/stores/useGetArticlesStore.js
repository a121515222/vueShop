import { defineStore } from "pinia";
import { ref } from 'vue';

import apiArticles from '../assets/getAPI/apiArticles'
const { getData, getSingleData } = apiArticles;

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
      console.log(error);
    }
  }
  const singleArticle = ref([]);
  async function getArticle(id) {
    try {
      isArticleLoading.value = true;
      const resData = await getSingleData(id);
      singleArticle.value = resData.data;
      isArticleLoading.value = false;
      return resData
    } catch (error) {
      console.log(error);
    }
  }
  function sortDateOldToNew() {
    dataArticles.value.articles.sort((a, b) => {
      return  b.create_at - a.create_at
    });
  }
  function sortDateNewToOld() {
    dataArticles.value.articles.sort((a, b) => {
      return  a.create_at - b.create_at
    });
  }
  function searchKeyWordsArticles(keyWords) {
    dataArticles.value.articles = dataArticles.value.articles.filter((article) => {
      for (const keyWord of keyWords) {
        if (article.title.includes(keyWord)
        || article.description.includes(keyWord)
        || article.tag.includes(keyWord)) {
          return true;
        }
      }
      return false;
    });
  }

  return{
    dataArticles,
    singleArticle,
    isArticleLoading,
    getArticles,
    getArticle,
    sortDateOldToNew,
    sortDateNewToOld,
    searchKeyWordsArticles
  }
})
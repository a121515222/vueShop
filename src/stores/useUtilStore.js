import { defineStore } from "pinia";
import { ref } from 'vue';

export const useUtilStore = defineStore('utilStore', ()=>{
  const scrollY = ref(0);
  function scrollHandler() {
    scrollY.value = window.scrollY;
  }
  return{
    scrollY,
    scrollHandler
  }
})
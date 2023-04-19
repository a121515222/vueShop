import { defineStore } from "pinia";
import apiPay  from '../assets/getAPI/apiPay';
import { ref } from 'vue';
const { pay } = apiPay;
export const usePayStore = defineStore('usePayStore',()=>{
  const isPayLoading = ref(false);
  async function payMent(id){
    isPayLoading.value = true;
    try {
      const res = await pay(id);
      isPayLoading.value = false;
      console.log('use',res)
      return res
      
    } catch (error) {
      console.log(error);
      isPayLoading.value = false;
    }
  }
  return{
    payMent,
    isPayLoading
  }
});
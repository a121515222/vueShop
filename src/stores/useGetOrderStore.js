import { defineStore } from "pinia";
import apiOrder from '../assets/getAPI/apiOrder.js';
import { ref } from 'vue';
const { sendOrder, getOrder } = apiOrder;
const order = ref({});

export const useGetOrderStore = defineStore('storeOrder',()=>{
  async function sendOrderList(sendData) {
    try {
      const res = await sendOrder(sendData);
      
      return res
    } catch (error) {
      console.log(error);
    }
  }
  async function getOrderInfo(id) {
    try {
      const res = await apiOrder.getOrder(id);
      order.value = res.data.order;
      return res
    } catch (error) {
      console.log(error);
    }
  }
  return {
    sendOrderList,
    getOrderInfo,
    order
  }

});
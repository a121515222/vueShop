import { defineStore } from "pinia";
import apiOrder from '../assets/getAPI/apiOrder.js';

const { sendOrder } = apiOrder;

export const useGetOrderStore = defineStore('storeOrder',()=>{
  async function sendOrderList(sendData) {
    try {
      const res = await sendOrder(sendData);
      return res
    } catch (error) {
      console.log(error);
    }
  }

  return {
    sendOrderList,
  }

});
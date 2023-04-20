import { defineStore } from "pinia";
import apiOrder from '../assets/getAPI/apiOrder.js';
import { ref } from 'vue';
const { sendOrder, getOrder, getOrders, getOrdersByPage } = apiOrder;
const order = ref({});
const orderList = ref([]);
const pagination = ref({});
const isOrderLoading = ref(false)
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
    isOrderLoading.value = true;
    try {
      const res = await apiOrder.getOrder(id);
      order.value = res.data.order;
      isOrderLoading.value = false;
      return res
    } catch (error) {
      console.log(error);
    }
  }
  async function getOrderLists() {
    isOrderLoading.value = true;
    try {
      const res = await getOrders();
      orderList.value = res.orders;
      pagination.value = res.pagination;
      isOrderLoading.value = false;
      return res
    } catch (error) {
      isOrderLoading.value = false;
      console.log(error);
    }
  }
  async function getOrderListsByPage(page) {
    isOrderLoading.value = true;
    try {
      const res = await getOrdersByPage(page);
      orderList.value = res.orders;
      pagination.value = res.pagination;
      isOrderLoading.value = false;
      return res
    } catch (error) {
      isOrderLoading.value = false;
      console.log(error);
    }
  }
  return {
    sendOrderList,
    getOrderInfo,
    getOrderLists,
    getOrderListsByPage,
    order,
    isOrderLoading,
    orderList,
    pagination
  }
});
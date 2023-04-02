import { defineStore } from 'pinia'
import apiCarts from '../assets/getAPI/apiCarts'
import { ref } from 'vue'
const { getData, deleteAllData, deleteData, editData } = apiCarts;
export const useGetCartsStore = defineStore('storeCarts', ()=>{
  const cartData = ref([]);
  const cartLength = ref(0);
  const isCartLoading = ref(false);
  const isChangeNum = ref(false);

  async function getCarts(){
    try {
      const resData = await getData();
      cartData.value = resData.data.carts;
      cartLength.value = resData.data.carts.length;
      return resData;
    } catch (error) {
      console.error(error);
    }
  }
  async function editCart(id, sendData) {
    try {
      const resData = await editData(id, sendData);
      isChangeNum.value = false;
      isCartLoading.value = false;
      getCarts();
      return resData;
    } catch (error) {
      console.error(error)
      return error.response.data.message;
    }
  }
  async function deleteCart(id) {
    try {
      const resData = await deleteData(id);
      getCarts();
      return resData;
    } catch (error) {
      console.log(error)
      return error.response.data.message;
    }
  }
  async function deleteAllCart() {
    try {
      const resData = await deleteAllData();
      getCarts();
      return resData;
    } catch (error) {
      console.error(error)
      return error.response.data.message;
    }
  }
  function cartIsLoading() {
    isCartLoading.value = true;
  }

  function numIsChanging() {
    isChangeNum.value = true;
  }
  return{
    getCarts,
    editCart,
    deleteCart,
    deleteAllCart,
    cartIsLoading,
    numIsChanging,
    cartData,
    cartLength,
    isCartLoading,
    isChangeNum

  }
});

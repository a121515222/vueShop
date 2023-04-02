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
// export default defineStore('cartStore', {
//   state: () => {
//     return {
//       cartData: [],
//       cartLength: 0,
//       isCartLoading: false,
//       isChangeNum: false
//     }
//   },
//   actions: {
//     getCart () {
//       axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`).then((res) => {
//         this.cartData = res.data.data
//         this.cartLength = res.data.data.carts.length
//       })
//         .catch((err) => { console.dir(err.response.data.message) })
//     },
//     deleteAllCarts () {
//       if (confirm('確定將會刪除所有購物車內容?') === true) {
//         axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`).then((res) => {
//           this.getCart()
//           toast.addMessage(
//             {
//               title: '刪除所有購物車結果',
//               style: 'success',
//               content: res.data.message
//             })
//         }).catch((err) => {
//           toast.addMessage(
//             {
//               title: '刪除所有購物車結果',
//               style: 'success',
//               content: err.response.data.message
//             }
//           )
//         })
//       } else {
//         alert('已取消刪除')
//       }
//     },
//     deleteCart (id, title) {
//       this.isCartLoading = true
//       axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`).then((res) => {
//         this.getCart()
//         toast.addMessage(
//           {
//             title: '刪除購物車結果',
//             style: 'success',
//             content: title + res.data.message
//           })
//         this.isCartLoading = false
//       }).catch((err) => {
//         console.dir(err.response.data.message)
//         toast.addMessage(
//           {
//             title: '刪除購物車結果',
//             style: 'danger',
//             content: err.response.data.message
//           })
//       })
//     },
//     editCart (id, sendCart) {
//       axios.put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`, sendCart).then((res) => {
//         this.isChangeNum = false
//         this.isCartLoading = false
//         this.getCart()
//         toast.addMessage(
//           {
//             title: '編輯購物車結果',
//             style: 'success',
//             content: res.data.message
//           }
//         )
//       }).catch((err) => {
//         console.dir(err.response.data.message)
//         toast.addMessage(
//           {
//             title: '編輯購物車結果',
//             style: 'danger',
//             content: err.response.data.message
//           }
//         )
//       })
//     },
//     isCartLoadingTrue () {
//       this.isCartLoading = true
//     },
//     isChangeNumTrue () {
//       this.isChangeNum = true
//     }
//   }
// })

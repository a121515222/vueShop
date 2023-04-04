<script setup>
import BsModal from 'bootstrap/js/dist/modal'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useGetProductsStore } from '../../stores/useGetProductsStore';
import { useGetCartStore } from '../../stores/useGetCartStore';
import { useInfoStore } from '../../stores/useInfoStore'


const productStore = useGetProductsStore();
const { getProduct } = productStore;
const { dataProduct, isDataLoading } = storeToRefs(productStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const cartStore = useGetCartStore();
const { addCart } = cartStore;

const addingProductId = ref('');
defineExpose({
  modalOpen,
  modalClose
})
function modalOpen(id){
  getProduct(id);
  bsModal.value.show();
}
function modalClose(){
  bsModal.value.hide();
}
async function addCarts(id, title, unit){
  addingProductId.value = id; 
  const sendData = {
  data: {
    product_id: id,
    qty: productNum.value
  }
  }
 const resData = await addCart(sendData);
 cartAddInfo(resData, title, unit);
 addingProductId.value = '';
 productNum.value = 0;
 modalClose();
}
function cartAddInfo(res, title, unit){
  console.log('add',res.data)
  switch (res.data.message) {
    case '已加入購物車':
      addMessage(
        {
          title: '加入購物車結果',
          style: 'success',
          content: `${title}${productNum.value}${unit}${res.data.message}`
        }
      )
      break;
    default:
      addMessage(
        {
          title: '加入購物車結果',
          style: 'danger',
          content: '加入失敗'
        }
      )
  }
}
const productNum = ref(0);

const guestProductModalRef = ref();
const bsModal = ref(null);
onMounted(()=>{
  bsModal.value = new BsModal(guestProductModalRef.value);
})
// export default {
//   data () {
//     return {
//       bsModal: '',
//       product: {},
//       qty: 1,
//       isLoading: ''
//     }
//   },
//   emits: ['sendId', 'getCart'],
//   methods: {
//     ...mapActions(toastStore, ['addMessage']),
//     guestModalOpen (id) {
//       this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`).then((res) => {
//         this.product = res.data.product
//         this.bsModal.show()
//       }).catch((err) => { console.dir(err.response.data.message) })
//     },
//     guestModalClose () {
//       this.bsModal.hide()
//     },
//     addCart (id, title) {
//       const sendCart = {
//         data: {
//           product_id: '',
//           qty: 1
//         }
//       }
//       sendCart.data.product_id = id
//       sendCart.data.qty = this.qty
//       this.$emit('sendId', id)
//       this.isLoading = id
//       this.$http.post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`, sendCart).then((res) => {
//         this.$emit('sendId', '')
//         this.isLoading = ''
//         this.qty = 1
//         this.addMessage(
//           {
//             title: `${title}加入購物車結果`,
//             style: 'success',
//             content: title + res.data.message
//           }
//         )
//       }).catch((err) => { console.dir(err.response.data.message) })
//     }
//   },
//   mounted () {
//     this.bsModal = new BsModal(this.$refs.guestProductModal)
//   }
// }
</script>
<template>
  <div class="modal fade" tabindex="-1" aria-hidden="true" ref="guestProductModalRef">
    <VueLoading :active="isDataLoading"/>
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-middle">
            <h5 class="modal-title fs-3 fw-bold" >{{dataProduct.title}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-sm-6 px-0 px-sm-2">
                <img class="img-fluid guestModalImg px-0 px-sm-2"
                style="width:100%; object-fit: cover;object-position:center center;"
                :src="dataProduct.imageUrl" :alt="`${ dataProduct.title }照片`">
              </div>
              <div class="col-12 col-sm-6 d-flex flex-column justify-content-between">
                <div class="from-group">
                  <div class="d-flex my-2">
                  <p class="mb-0">{{dataProduct.title}}<span class="badge bg-primary ms-1">{{dataProduct.category}}</span></p>
                  </div>
                  <div v-html="dataProduct.description"></div>
                  <p>商品內容:{{dataProduct.content}}</p>
                  
                </div>
                <div class="from-group align-self-end">
                  <div v-if="dataProduct.origin_price === dataProduct.price" class="d-flex gap-2">
                  <span>售價:{{dataProduct.origin_price}}元</span>
                  <span>/{{dataProduct.unit}}</span>
                  </div>
                  <div v-else class="d-flex">
                    <span class="text-decoration-line-through text-middle">原價{{dataProduct.origin_price}}</span>
                    <span class="text-danger">特價{{dataProduct.price}}元</span>
                    <span>/{{dataProduct.unit}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer gap-1 gap-sm-3 bg-middle">
            <button class="btn btn-primary btnHover" type="button"
            @click="productNum -= 1" :disabled="productNum<2"
            :class="{buttonDisabledCursor : productNum <2}"
            >
              <i class="bi bi-dash"></i>
            </button>
            <span style="min-width:20px"> {{productNum}}</span>
            <button type="button" class="btn btn-primary btnHover"
            @click="productNum += 1"
            :disabled="productNum === 100"
            :class="{buttonDisabledCursor : productNum === 100}"
            >
              <i class="bi bi-plus"></i>
            </button>
            <button class="btn btn-secondary btnHover" type="button"
            @click="addCarts(dataProduct.id, dataProduct.title, dataProduct.unit)"
            :disabled="dataProduct.id === addingProductId  || productNum < 1"
            :class="{buttonDisabledCursor : dataProduct.id === addingProductId || productNum < 1}">
              <span  class="spinner-border spinner-border-sm"  role="status" aria-hidden="true"
              v-show="dataProduct.id === addingProductId"></span>
              加入購物車
            </button>
            <button class="d-none-366px btn btn-third btnHover" type="button"
            @click="modalClose()">
              關閉
            </button>
          </div>
        </div>
      </div>
  </div>
</template>



<style lang="scss">
  .guestModalImg {
    max-height: 30vh;
    @media (min-width:576px) {
      max-height: 40vh;
    }
    @media (min-width:992px) {
      max-height: 50vh;
    }
  }
  .d-none-366px {
    display: none;
    @media (min-width:366px) {
      display: block;
    }
  }
  .btnHover {
    &:hover {
      color: #000;
    }
  }
</style>

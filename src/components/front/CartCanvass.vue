<script setup>
import BsOffcanvas from 'bootstrap/js/dist/offcanvas'
import GuestCoupon from './GuestCoupon.vue'
import { storeToRefs } from 'pinia'
import { useGetCartStore } from '../../stores/useGetCartStore'
import { useInfoStore } from '../../stores/useInfoStore'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const cartStore = useGetCartStore();
const { getCarts, editCart, deleteCart, deleteAllCart, cartIsLoading, numIsChanging } = cartStore;
const { cartData, cartLength, isCartLoading, isChangeNum} = storeToRefs(cartStore)
const infoStore = useInfoStore();
const { addMessage } = infoStore;

defineExpose({
  cartOpen,
  cartClose
})

function cartOpen() {
      getCarts()
      bsOffcanvas.value.show();
}
function cartClose() {
      bsOffcanvas.value.hide();
}

const router = useRouter();

function toProducts() {
      router.push('/products');
      cartClose();
    }
function toPayProcess() {
  isChangeNum.value === true ? alert('請完成購物車數量修改') : router.push('/sendInfo')
}

const changeNum = ref(0);
const cartId = ref('');
async function changeCartNum(num, id, productId) {
  if (isChangeNum.value === false) {
    numIsChanging();
      changeNum.value = num;
      cartId.value = id;
  } else if (isChangeNum.value === true) {
    cartIsLoading();
    const sendCart = {
      data: {
        product_id: '',
        qty: 1
      }
    }
    sendCart.data.product_id = productId;
    sendCart.data.qty = changeNum.value;
    const res = await editCart(id, sendCart);
    cartChangeInfo(res);
  }
}
async function deleteCarts(id, title){
  const res = await deleteCart(id);
  cartChangeInfo(res, title);
}
async function deleteAllCarts(){
  const res = await deleteAllCart();
  cartChangeInfo(res);
}
function cartChangeInfo(res, title){
  switch (res) {
    case '已更新購物車':
      addMessage(
        {
          title: '編輯購物車結果',
          style: 'success',
          content: res
        }
      )
      break;
    case '已刪除':
      addMessage(
        {
          title: '編輯購物車結果',
          style: 'success',
          content:`${res} ${title === undefined ? '所有購物車內容' : title}` 
        }
      )
      break;
    default:
      addMessage(
        {
          title: '編輯購物車結果',
          style: 'danger',
          content: res
        }
      )
  }
}
watch(changeNum, (newValue,oldValue)=>{
        if (newValue <= 0) {
        alert('輸入數量不可小於1');
        changeNum.value = oldValue;
      }
});
const rightCartRef = ref();
const bsOffcanvas = ref(null);
onMounted(()=>{
  bsOffcanvas.value = new BsOffcanvas(rightCartRef.value);
  getCarts();
});

</script>
<template>
  <div class="offcanvas offcanvas-end" style="width:700px;" data-bs-scroll="true" data-bs-backdrop="false"
  tabindex="-1" aria-labelledby="offcanvasScrollingLabel" ref="rightCartRef">
    <div class="offcanvas-header">
      <h3 class="offcanvas-title fa-3 fw-bold">購物車</h3>
      <button class="btn-close text-reset" type="button" aria-label="Close"
      @click="cartClose()"
      >
      </button>
    </div>
    <div class="offcanvas-body d-flex flex-column px-sm-3" style="min-width:343px">
      <div class="align-self-end">
        <button class="btn btn-outline-danger" type="button"
        @click="deleteAllCarts()"
        :disabled="cartLength === 0"
        :class="{buttonDisabledCursor : cartLength === 0}"
        >
          刪除所有
        </button>
      </div>
        <table class="table table-hover table-striped text-nowrap">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th class="d-none-576" scope="col"></th>
              <th scope="col">商品名稱</th>
              <th class="d-none-576" scope="col">總價格</th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
              <th scope="col"></th>
              <th class="d-none-576" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="cartLength > 0">
              <tr
              v-for="(item,index) in cartData"
              :key="item.product.title+index">
                <th scope="row">{{index+1}}</th>
                <td class="d-none-576">
                  <img style="min-width:50px;max-width:50px; min-height:30px; max-height:30px;"
                  :src="item.product.imageUrl"
                  :alt="item.product.title"
                  >
                </td>
                <td>{{item.product.title}}</td>
                <td class="d-none-576" style="text-align:center">{{Math.floor(item.final_total)}}</td>
                <td  style="text-align:center;" v-if="!isChangeNum || item.id !== cartId">
                  {{item.qty}}
                </td>
                <td v-if="isChangeNum && item.id === cartId" style="min-width:48px">
                  <input class="form-control specialWidth" type="number" min="1" max="100" v-model="changeNum"></td>
                <td style="text-align:center;">
                  {{item.product.origin_price>item.product.price === false?  item.product.origin_price:item.product.price}}
                </td>
                <td class="d-flex flex-column gap-1">
                  <button type="button" class="btn btn-outline-primary"
                  :disabled="isCartLoading"
                  :class="{buttonDisabledCursor:isCartLoading}"
                  @click="changeCartNum(item.qty, item.id, item.product_id)"
                  >
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-show="isCartLoading"
                    >
                    </span>
                    {{isChangeNum && item.id === cartId?  '確定':'編輯' }}
                  </button>
                  <button class="d-block-576-button btn btn-outline-dark" type="button"
                  @click="deleteCarts(item.id, item.product.title)"
                  :disabled="isCartLoading" :class="{buttonDisabledCursor:isCartLoading}"
                  >
                    刪除
                  </button>
                </td>
                <td class="d-none-576">
                  <button type="button" class=" btn btn-outline-dark"
                  @click="deleteCarts(item.id, item.product.title)"
                  :disabled="isCartLoading" :class="{buttonDisabledCursor:isCartLoading}"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan='8'>目前購物車沒有東西</td>
              </tr>
            </template>
          </tbody>
       </table>
      <div class="align-self-end d-flex gap-5 px-3">
        <p class="text-center fw-bold">小計</p>
        <p class="text-center">{{ cartData[0]?.final_total === undefined ? '0' : Math.floor(cartData[0]?.final_total)}}元</p>
      </div>
      <div class="align-self-end pb-1">
        <button type="button" class="btn btn-primary text-white" @click="toPayProcess(); cartClose()"
        :disabled="cartLength === 0 || isCartLoading" :class="{buttonDisabledCursor : cartLength === 0 || isCartLoading}">確認</button>
      </div>
      <template v-if="cartLength > 0">
        <div style="min-width:342px" class="my-3">
          <GuestCoupon :cart-length="cartLength" :cart-loading="isCartLoading" @getCarts= "getCarts"></GuestCoupon>
        </div>
      </template>
      <template v-else>
        <div style="min-width:342px" class="my-3 d-flex flex-row-reverse">
          <button type="button" class="btn btn-primary text-secondary"  @click="toProducts">來這看看有沒有喜歡的</button>
        </div>
      </template>
      </div>
  </div>
</template>



<style lang="scss">
  .specialWidth {
    max-width:46px;
    @media (min-width:576px) {
    max-width:60px;
    }
  }
  td,th {
    padding: 2px !important;
    @media (min-width:576px) {
    padding: 8px !important;
    }
  }
  .d-block-576-button {
    display: block !important;
    @media (min-width:576px) {
      display: none !important;
    }
  }
  .d-block-576 {
    display: table-cell;
    @media (min-width:576px) {
      display: none;
    }
  }
  .d-none-576 {
    display: none ; 
    @media (min-width:576px) {
      display: table-cell;
    }
  }
</style>

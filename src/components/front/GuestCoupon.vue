<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCouponStore } from '../../stores/useCouponStore';
import { useGetCartStore } from '../../stores/useGetCartStore';
import { useInfoStore } from '../../stores/useInfoStore';

const couponStore = useCouponStore();
const { useCoupon } = couponStore;

const cartStore = useGetCartStore();
const { getCarts } = cartStore;
const { cartLength } = storeToRefs(cartStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const isLoading = ref(false);
const couponCode = ref('');

async function sendCoupon() {
  isLoading.value = true;
  if(couponCode.value === '') {
    alert('優惠券不可輸入空白')
    isLoading.value = false;
  } else {
    const sendData = { data: { code: couponCode.value } }
    try {
      const data = await useCoupon(sendData);
      console.log('sendCoupon', data);
      addMessage(
        {
          title: data.success ? '使用優惠券成功' :'使用優惠券失敗',
          style: data.success ? 'success' :'danger',
          content: `${data.message}`
        }
      );
      getCarts();
      couponCode.value = '';
      isLoading.value = false;
    } catch (error) {
      
      isLoading.value = false;
      console.log(error);
    }
  }
}
</script>

<template>
  <div class="from-group" ref="couponForm">
    <div class="position-relative d-flex flex-row">
      <input type="text" class="form-control" v-model.trim="couponCode" placeholder="請輸入優惠碼">
      <button class="btn btn-primary text-white text-nowrap h-100" type="button"
      @click= "sendCoupon"
      :disabled="cartLength === 0 || couponCode === '' || isLoading"
      :class="{buttonDisabledCursor :cartLength === 0 || couponCode === ''}">
        <span v-if= "isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      送出
      </button>
    </div>
  </div>
</template>



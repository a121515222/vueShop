<script setup>
import { storeToRefs } from 'pinia'
import { useGetOrderStore } from '../../stores/useGetOrderStore';
import { usePayStore } from '../../stores/usePayStore';
import { useInfoStore } from '../../stores/useInfoStore';
import { useRoute, useRouter } from "vue-router";
import GuestPayProcessInspector from '../../components/front/GuestPayProcessInspector.vue'
import { onMounted, ref } from 'vue';

const orderStore = useGetOrderStore();
const { getOrderInfo } = orderStore;
const { order, isOrderLoading } = storeToRefs(orderStore);

const payStore = usePayStore();
const { payMent } = payStore;
const { isPayLoading } = storeToRefs(payStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const route = useRoute();
const { id } = route.params;
const confirmAndPay = 'confirmAndPay';

const paymentStatus = {
  'choosePayment':0,
  'ATM':1,
  'creditCard':2,
  'cashOnDelivery':3
}

const payment = ref(0);
const router = useRouter();

async function toPay() {
  const res = await payMent(id);
  console.log('message')
  addMessage(
    {
      title: '付款結果',
      style: `${res.data.success? 'success' : 'danger'}`,
      content: `${res.data.success? res.data.message : res.response.data.message}`
    }
  )
  router.push('/guestOrderFinished');
}

onMounted(()=>{
  getOrderInfo(id);
});
</script>

<template>
  <div class="container pt-9">
    <VueLoading :active="isOrderLoading" :z-index="1060"/>
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <GuestPayProcessInspector :current-status='confirmAndPay' :payment='order.is_paid' />
        <h2 class="mb-3  border-bottom border-2">已購商品清單</h2>
        <div class="table-responsive">
          <table class="table table-hover ">
            <thead>
              <tr>
                <th>品名</th>
                <th>數量</th>
                <th>單位</th>
                <th>價格</th>
              </tr>
            </thead>
            <tbody v-for="(item) in order.products" :key="item.id">
              <tr>
                <td>{{item.product.title}}</td>
                <td>{{item.qty}}</td>
                <td>{{item.product.unit}}</td>
                <td>{{item.total}}</td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex w-100 flex-row-reverse">
            <span>小計:{{order.total}}元</span>
          </div>
       </div>
        <h2 class="mb-3  border-bottom border-2">訂購者資訊</h2>
        <div class="table-responsive">
          <table class="table table-hover table-striped">
            <tbody>
              <tr>
                <th>姓名</th>
                <td>{{order.user?.name}}</td>
              </tr>
              <tr>
                <th>電話</th>
                <td>{{order.user?.tel}}</td>
              </tr>
              <tr>
                <th>住址</th>
                <td>{{order.user?.address}}</td>
              </tr>
              <tr>
                <th>付款狀態</th>
                <td :class="{'text-success':order.is_paid, 'text-danger':!order.is_paid}">{{order.is_paid? '已付款':'未付款'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <template v-if="!order.is_paid">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <h2 class="mb-3  border-bottom border-2">選擇付款方式</h2>
          <div class="d-flex mb-3">
            <select v-model="payment" class="form-select">
            <option :value="paymentStatus.choosePayment" selected disabled>請選擇付款方式</option>
            <option :value="paymentStatus.ATM" >ATM匯款</option>
            <option :value="paymentStatus.creditCard" >信用卡</option>
            <option :value="paymentStatus.cashOnDelivery" >貨到付款</option>
            </select>
            <button class="btn btn-primary text-white text-nowrap" type="button"
            @click="toPay()"
            :disabled="isOrderLoading || payment === 0"
            :class="{buttonDisabledCursor : isOrderLoading || payment === 0}"
            >
              <span v-show="isOrderLoading" class="spinner-border spinner-border-sm"
              role="status" aria-hidden="true"></span>
              確認付款
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>



<script setup>
import PaginationComponent from '../../components/PaginationComponent.vue'
import readTime from '../../assets/methods/ReadTime'
import { useGetOrderStore } from '../../stores/useGetOrderStore';
import { useInfoStore } from '../../stores/useInfoStore';
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const orderStore = useGetOrderStore();
const { getOrderLists, getOrderListsByPage } = orderStore;
const { orderList, isOrderLoading, pagination, getOrderListErrorMessage } = storeToRefs(orderStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const { getTime : showTime} = readTime;
const router = useRouter();

function goToOrderPage(page) {
  getOrderListsByPage(page);
}

function goToOrder(id) {
  router.push(`/guestOrderPay/${id}`);
}

watch(getOrderListErrorMessage,(newValue, oldValue) =>{
  if(newValue?.success === false) {
    addMessage(
      {
        title: '取得訂單列表結果',
        style: 'danger',
        content: `${newValue.message}`
      }
    )
  }
})
onMounted(()=>{
  getOrderLists();
})
</script>

<template>
  <div class="container pt-10">
    <VueLoading :active="isOrderLoading" :z-index="1060"/>
    <h2>訂單與付款頁</h2>
    <div class="table-responsive">
      <table class="table table-hover table-striped text-nowrap">
        <thead>
          <tr>
            <th scope="col">訂單編號</th>
            <th scope="col">訂購時間</th>
            <th scope="col">姓名</th>
            <th scope="col">電話</th>
            <th scope="col">是否付款</th>
            <th scope="col">詳細資料與付款</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in orderList" :key ="item.id">
            <td>{{item.id}}</td>
            <td>{{showTime(item.create_at || 0)}}</td>
            <td>{{item.user.name}}</td>
            <td>{{item.user.tel}}</td>
            <td :class="{'text-success' : item.is_paid, 'text-danger' : !item.is_paid }">
              {{item.is_paid? '已付款':'未付款'}}
            </td>
            <td>
              <button class="btn btn-primary" type="button"
              @click="goToOrder(item.id)">
                開啟
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent :pagination="pagination"
    @sendPage="goToOrderPage"
    />
  </div>
</template>



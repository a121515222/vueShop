<script setup>
import { storeToRefs } from 'pinia'

// 匯入 vee-validate 主套件
import { defineRule, Form, Field, ErrorMessage, configure } from 'vee-validate'
// 匯入 vee-validate rule
import { required, email } from '@vee-validate/rules'
// 匯入 vee-validate 在地化
import { localize, setLocale } from '@vee-validate/i18n'
// 匯入繁體中文語系檔案
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import { useGetOrderStore } from '../../stores/useGetOrderStore'
import { useInfoStore } from '../../stores/useInfoStore'
import { useGetCartStore } from '../../stores/useGetCartStore'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const getOrderStore = useGetOrderStore();
const { sendOrderList } = getOrderStore;

const getCartStore = useGetCartStore();
const { getCarts } = getCartStore;
const { cartLength } = storeToRefs(getCartStore);

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const formRef = ref(null);

defineRule('required', required)
defineRule('email', email)

configure({ // 用來做一些設定
  generateMessage: localize({ zh_TW: zhTW }), // 啟用 locale
  validateOnInput: true // 調整為：輸入文字時，就立即進行驗證
})
// 設定預設語系
setLocale('zh_TW')

const user = ref({
  name:'',
  tel:'',
  email: '',
  address: ''
});
const messages = ref('');
const isLoading = ref(false);
const router = useRouter();

async function onSubmit(){
  cartCheck();
  const sendData = {
  data: {
    user: user.value,
    message: messages.value,
   }
   }
  const res = await sendOrderList(sendData);
  addMessage(
    {
      title: '使用者資料送出結果',
      style: `${res.data?.success===true ? 'success' : 'danger'}`,
      content: `${res.data?.success===true ? res.data.message : res.response.data.message}`
    }
  );
  if(res.data.orderId){
    router.push(`/guestOrderPay/${res.data.orderId}`)
  }
  formRef.value.resetForm(); 
}


function cartCheck() {
  if(cartLength.value === 0) {
    alert('購物車是空的喔!!,移動至產品頁面。');
    router.push('/products');
  }
}


function phoneCheck (value) {
  const phoneNumber = /^(09)[0-9]{8}$/;
  const space = /\s+/;
  return phoneNumber.test(value) ? true : '需要正確的電話號碼'
}
const inspectInputSpence =  computed(()=>{
  const userInfoKeys = Object.keys(user.value);
  return userInfoKeys.some(key => {
    if(user.value[key] ==='' || /\s+/.test(user.value[key])) {
      return true;
    }
  });
})
onMounted(()=>{
  getCarts();
});
</script>

<template>
  <div class="row">
   <Form  class="d-flex flex-column col-12 col-lg-8 mx-auto" ref="formRef"
   v-slot="{errors}"
   @submit="onSubmit">
    <div class="my-3 position-relative">
      <label class="form-label" for="name">姓名</label>
      <Field
        id="name"
        name="姓名"
        type="text"
        class="form-control"
        :class="{'is-invalid': errors['姓名'], buttonDisabledCursor :Object.keys(errors).length > 0}"
        placeholder="請輸入 姓名"
        rules="required"
        
        v-model="user.name"
        :disabled="isLoading"
      >
      </Field>
      <ErrorMessage name="姓名" class="invalid-feedback" style="position:absolute; left:14px ;bottom:-20px"></ErrorMessage>
    </div>
    <div class="my-3 position-relative">
      <label class="form-label" for="tel">電話</label>
      <Field
        id="tel"
        name="電話"
        type="text"
        class="form-control"
        :class="{'is-invalid': errors['電話'], buttonDisabledCursor :Object.keys(errors).length > 0}"
        placeholder="請輸入電話例如0912123123"
        :rules="phoneCheck"
        v-model="user.tel"
        :disabled="isLoading"
      >
      </Field>
      <ErrorMessage name="電話" class="invalid-feedback" style="position:absolute; left:14px ;bottom:-20px"></ErrorMessage>
    </div>
    <div class="my-3 position-relative">
      <label class="form-label" for="email">信箱</label>
      <Field
        id="email"
        name="信箱"
        type="email"
        class="form-control"
        :class="{'is-invalid': errors['信箱'], buttonDisabledCursor :Object.keys(errors).length > 0}"
        placeholder="信箱" rules="email|required"
        v-model="user.email"
        :disabled="isLoading"
      >
      </Field>
      <ErrorMessage name="信箱" class="invalid-feedback" style="position:absolute; left:14px ;bottom:-20px"></ErrorMessage>
    </div>
    <div class="my-3 position-relative">
      <label class="form-label" for="address">地址</label>
      <Field
        id="address"
        name="地址"
        type="text"
        class="form-control"
        :class="{'is-invalid': errors['地址'], buttonDisabledCursor :Object.keys(errors).length > 0}"
        placeholder="請輸入地址" rules="required"
        v-model="user.address"
        :disabled="isLoading"
      >
      </Field>
      <ErrorMessage name="地址" class="invalid-feedback" style="position:absolute; left:14px ;bottom:-20px"></ErrorMessage>
    </div>
    <div class="my-3 position-relative">
      <label class="form-label" for="message">留言</label>
      <textarea class="form-control" id="message" style="height:100px"
      v-model="messages"
      :class="{buttonDisabledCursor :isLoading}"
      :disabled="isLoading"></textarea>
    </div>
    <button class="btn btn-primary text-white align-self-end" type="submit"
    :disabled="Object.keys(errors).length > 0  || isLoading || Object.keys(errors).length > 0 || inspectInputSpence"
    :class="{buttonDisabledCursor : Object.keys(errors).length > 0 || inspectInputSpence || cartLength === 0}"
    >
      送出表單
    </button>
   </Form>
  </div>
</template>



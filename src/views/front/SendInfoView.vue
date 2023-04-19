<script setup>
import InputForm from '../../components/front/InputForm.vue'
import GuestPayProcessInspector from '../../components/front/GuestPayProcessInspector.vue'

const inputInfo = 'inputInfo';

</script>
<template>
  <div class="container pt-9 mb-3">
    <GuestPayProcessInspector :current-status='inputInfo' />
    <h2 class="mx-auto" style="width:224px">請填寫顧客資料</h2>
    <InputForm/>
  </div>
</template>



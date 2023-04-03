<script setup>
import ShowProductVue from '../../components/front/showProduct.vue';

import { useGetProductsStore } from '../../stores/useGetProductsStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const productStore = useGetProductsStore();

const { isDataLoading } = storeToRefs(productStore);



</script>
<template>
  <ShowProductVue 
  :is-guest-page-loading="isGuestPageLoading"
  />
  
  </template>
<style></style>
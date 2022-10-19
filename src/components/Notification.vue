<script setup>
import { storeToRefs } from 'pinia';
import { useInfoStore } from '../stores/useInfoStore';
const infoStore = useInfoStore();
const { deleteMessage } = infoStore;
const { notification } = storeToRefs(infoStore);
</script>
<template>
  <div class="toast-container position-fixed top-0 end-0" style="z-index:9999">
    <div class="toast show" style="background-color:rgba(255, 255, 255, 1)" role="alert" aria-live="assertive"
      aria-atomic="true" v-for="(item, index) in notification" :key="index">
      <div class="toast-header">
        <span :class="`bg-${item.style}`" class="p-2 rounded me-2 d-inline-block"></span>
        <strong class="me-auto">{{item.title}}</strong>
        <button class="btn-close" type="button" aria-label="Close" @click="deleteMessage(index)"></button>
      </div>
      <div class="toast-body">
        {{item.content}}
      </div>
    </div>
  </div>
</template>
<style>

</style>
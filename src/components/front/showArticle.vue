<script setup>
import { useGetArticlesStore } from '../../stores/useGetArticlesStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue-demi';
const dataArticle = useGetArticlesStore();
const { getArticle } = dataArticle;
const { dataArticles } = storeToRefs(dataArticle);
const showData = ref([]);
getArticle();
showData.value = dataArticles;
</script>
<template>
  article:{{showData}}
</template>
<style>

</style>
<script setup>
import { ref } from 'vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore';
import AutoComplete from './AutoComplete.vue'

const productStore = useGetProductsStore();
const { showMyFavorites, getProducts, searchResults, sortResultsHightToLow, sortResultsLowToHight } = productStore;

const favorites = JSON.parse(localStorage.getItem('myFavoritesItem')) || [];

const isInputFocused = ref(false);

function cleanSearch() {
  minPrice.value = null;
  maxPrice.value = null;
  searchKeyWords.value = '';
  getProducts();
}
const searchKeyWords = ref('');

const minPrice = ref(null);
const maxPrice = ref(null);
function search() {
  const keywords = searchKeyWords.value.trim().split(' ');
  console.log('searchbar min',minPrice.value, 'searchbar max', maxPrice.value);
  searchResults(keywords.value, minPrice.value, maxPrice.value);
}
function writeSearchKeyWord(keyword) {
  searchKeyWords.value = keyword;
}
const searchInput = ref(null);
</script>

<template>
  <div class="input-group pt-10">
    <input  class="form-control w-sm-50 position-relative searchBarPlaceholderStyle" ref="searchInput" type="text"
    @focus="isInputFocused = true; enterCounter = 0 ;"
    @blur="isInputFocused=false"
    v-model="searchKeyWords" placeholder="請輸入關鍵字">
    <AutoComplete
    :search-key-words="searchKeyWords"
    :is-focus="isInputFocused"
    @autoCompleteResult="writeSearchKeyWord"
    />
    <input class="form-control w-sm-25 searchBarPlaceholderStyle" type="number"  placeholder="請輸入最低價格" v-model.number="minPrice">
    <input class="form-control w-sm-25 searchBarPlaceholderStyle" type="number"  placeholder="請輸入最高價格" v-model.number="maxPrice">
  </div>
  <div class="d-flex flex-column flex-sm-row justify-content-sm-end gap-2 pt-3 ">
    <button v-if="favorites.length !== 0" type="button" class="btn btn-primary text-secondary text-nowrap" @click="showMyFavorites()">顯示我的最愛</button>
    <button type="button" class="btn btn-primary text-secondary text-nowrap" @click="sortResultsHightToLow()" >價格由大至小排列</button>
    <button type="button" class="btn btn-primary text-secondary text-nowrap" @click="sortResultsLowToHight()" >價格由小至大排列</button>
    <button type="button" class="btn btn-primary text-secondary text-nowrap" @click="cleanSearch()">清除搜尋</button>
    <button type="button" class="btn btn-primary text-secondary text-nowrap" @click="search()">搜尋</button>
  </div>
</template>

<style lang="scss">

.searchBarPlaceholderStyle {
  &::placeholder{
    font-size: 12px;
  }
}
@media (min-width:576px) {
  .searchBarPlaceholderStyle {
    &::placeholder{
    font-size: 16px;
  }
  }
}
</style>

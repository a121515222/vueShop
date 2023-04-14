<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore'
import { useGetArticlesStore } from '../../stores/useGetArticlesStore';
import { useRoute } from "vue-router";
const productsStore = useGetProductsStore();
const { dataProducts } = storeToRefs(productsStore);

const articlesStore = useGetArticlesStore();
const { dataArticles } = storeToRefs(articlesStore);

const props = defineProps(['searchKeyWords', 'isFocus']);
const emits = defineEmits(['autoCompleteResult', 'removeFocus'])

const isMouseIn = ref(false);

const infoList = ref([]);

const route = useRoute();

function autoComplete(keyWords) {
  if(keyWords?.length > 0) {
    keyWords.forEach((keyWord)=>{
      infoList.value = [];
      switch(route.path){
        case '/products' :
          dataProducts.value.forEach((product)=>{
          if(product.title.includes(keyWord)
          || product.category.includes(keyWord)
          || product.content.includes(keyWord)
          || product.description.includes(keyWord))
          {
            infoList.value.push(product.title);
          }
          });
          break
        case '/articles' :
          dataArticles.value.articles.forEach((article)=>{
          if(article.title.includes(keyWord)
          || article.description.includes(keyWord)
          || article.tag.includes(keyWord)
          )
          {
            infoList.value.push(article.title);
          }
        })
          break
      }
    });
    infoList.value = [...new Set(infoList.value)]
    infoList.value = infoList.value.filter((list)=>{
      if(list !== keyWords[0]) {
        return true;
      }
    });
  }
}
function sendAutoCompleteResults(keyWord) {
  emits('autoCompleteResult', keyWord);
  isMouseIn.value = false;
  infoList.value = [];
}
watch(()=>props.searchKeyWords, (newValue, oldValue) =>{
  if(newValue !== '' && !props.searchKeyWords?.match(/^[ ]*$/)  && newValue !== oldValue) {
    const keysWords = newValue?.trim().split(' ');
    autoComplete(keysWords);
  } else if(newValue === '') {
    infoList.value = [];
  }
})

const keyWordListRef = ref();
function mouseoverHover(index){
  keyWordListRef.value[index].classList.add('autoBackground');
  listIndex.value = index;
  isMouseIn.value = true;
}
function mouseleaveCancelHover(index){
  keyWordListRef.value[index].classList.remove('autoBackground');
  listIndex.value = index;
  isMouseIn.value = false;
}
const listIndex = ref(0);
function keyboardChoose(e) {
  switch(e.code) {
    case 'ArrowDown' :
      if (listIndex.value === infoList.value.length - 1) {
        listIndex.value = infoList.value.length - 1;
      } else { 
        listIndex.value += 1;
      }
      break
    case 'ArrowUp' :
      if (listIndex.value === 0) {
        listIndex.value = 0
      } else { 
        listIndex.value -= 1;
      }
      break
    case 'Enter' || 'NumpadEnter' :
    sendAutoCompleteResults(infoList.value[listIndex.value])
      break
  }
}
onMounted(()=>{
  window.addEventListener('keydown',(e)=>{keyboardChoose(e)})
})
</script>

<template>
  <ul  class="autoUl position-absolute top-100 w-100 w-sm-33 w-sm-50"
  v-if="infoList.length > 0 && (props.isFocus || isMouseIn)"
  >
    <li class="auto py-0" style="height:36px"
    ref="keyWordListRef"
    v-for="(keyWord,index) in infoList"
    :key="keyWord+index"
    :class="{'autoBackground' : (index === listIndex)}"
    @click="sendAutoCompleteResults(keyWord)"
    @mouseover="mouseoverHover(index)"
    @mouseleave="mouseleaveCancelHover(index)">
      <p class="py-1 my-0">{{keyWord}}</p>
    </li>
  </ul>
</template>



<style lang="scss">
  .autoUl {
    background: #fff;
    z-index: 1;
    padding: 0;
    list-style: none ;
  }
  .autoBackground {
    background: rgb(155, 150, 150) !important;
  }
  .auto {
    padding-left: 12px;
    background: rgb(225, 224, 224);
    &:hover {
      cursor:pointer;
    }
  }
</style>

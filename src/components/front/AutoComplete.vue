<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore'

const productsStore = useGetProductsStore();
const { dataProducts } = storeToRefs(productsStore);

const props = defineProps(['searchKeyWords', 'isFocus']);
const emits = defineEmits(['autoCompleteResult', 'removeFocus'])

const isMouseIn = ref(false);

const infoList = ref([]);
function autoComplete(keyWords) {
  if(keyWords?.length > 0) {
    keyWords.forEach((keyWord)=>{
      dataProducts.value.forEach((product)=>{
        if(product.title.includes(keyWord)
        || product.category.includes(keyWord)
        || product.content.includes(keyWord)
        || product.description.includes(keyWord)){
          infoList.value.push(product.title);
        }
      });
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
        // removeFocus();
      }
      break
    case 'ArrowUp' :
      if (listIndex.value === 0) {
        listIndex.value = 0
      } else { 
        listIndex.value -= 1;
        // removeFocus(); 
      }
      break
    case 'Enter' || 'NumpadEnter' :
    sendAutoCompleteResults(infoList.value[listIndex.value])
      break
  }
}
function removeFocus() {
  emits('removeFocus');
}
onMounted(()=>{
  window.addEventListener('keydown',(e)=>{keyboardChoose(e)})
})
// export default {
//   props: ['inputData', 'isFocus'],
//   emits: ['sendAutoCompleteResult', 'sendInfoBlank'],
//   data () {
//     return {
//       inFoList: [],
//       listIndex: 0,
//       isMouseIn: false
//     }
//   },

//   watch: {
//     inputData: {
//       handler (newValue) {
//         if (newValue === '') {
//           this.inFoList = []
//         } else {
//           this.autoComplete(newValue)
//         }
//       }
//     }
//   },
//   methods: {
//     mouseoverHover (index) {
//       this.listIndex = null
//       this.isMouseIn = true
//       const chosen = document.querySelectorAll('.auto')
//       chosen[index].classList.add('autoBackground')
//     },
//     mouseleaveCancelHover (index) {
//       const chosen = document.querySelectorAll('.auto')
//       this.isMouseIn = false
//       chosen[index].classList.remove('autoBackground')
//     },
//     autoComplete (info) {
//       if (info !== '') {
//         const infoArr = info.split(' ')
//         if (this.guestProduct !== undefined) {
//           this.guestProduct.forEach((item) => {
//             infoArr.forEach((i) => {
//               if (item.title.indexOf(i) !== -1 || item.category.indexOf(i) !== -1 || item.content.indexOf(i) !== -1 || item.description.indexOf(i) !== -1) {
//                 this.inFoList.push(item.title)
//                 this.inFoList = [...new Set(this.inFoList)]
//               }
//             })
//           })
//         }
//         // 如果輸入一樣的關鍵字就不顯示
//         if (this.inFoList.length > 0) {
//           this.inFoList = this.inFoList.filter((item) => { return item !== info })
//         }
//       } else if (info === '') {
//         this.$emit('sendInfoBlank')
//       }
//     },
//     sendAutoComplete (info) {
//       if (info === '' || info === undefined) {
//         this.$emit('sendInfoBlank')
//       } else {
//         this.$emit('sendAutoCompleteResult', info)
//         this.inFoList = []
//       }
//     }
//   },
//   mounted () {
//     window.addEventListener('keydown', (e) => {
//       if (this.inputData && this.listIndex !== '') {
//         switch (e.code) {
//           case 'ArrowDown' :
//             if (this.listIndex === this.inFoList.length - 1) {
//               this.listIndex = this.inFoList.length - 1
//             } else { this.listIndex += 1 }
//             break
//           case 'ArrowUp' :
//             if (this.listIndex === 0) {
//               this.listIndex = 0
//             } else { this.listIndex -= 1 }
//             break
//           case 'Enter' || 'NumpadEnter' :
//             this.sendAutoComplete(this.inFoList[this.listIndex])
//             break
//         }
//       } else if (this.inputData === '') { this.listIndex = 0 }
//     })
//   }
// }
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

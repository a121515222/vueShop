<script setup>
import { storeToRefs } from 'pinia'
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useGetProductsStore } from '../../stores/useGetProductsStore'

const productsStore = useGetProductsStore();
const { dataProducts } = storeToRefs(productsStore);

const props = defineProps(['searchKeyWords', 'isFocus']);
const emits = defineEmits(['autoCompleteResult'])

const isMouseIn = ref(false);

const infoList = ref([]);
function autoComplete(keywords) {
  if(keywords.length > 0) {
    keywords.forEach((keyWord)=>{
      dataProducts.value.forEach((product)=>{
        if(product.title.includes(keyWord)
        || product.category.includes(keyWord)
        || product.content.includes(keyWord)
        || product.description.includes(keyWord)){
          infoList.value.push(product.title);
        }
      });
    });
  }
  console.log('infoList',infoList.value)
}
function sendAutoCompleteResults(keyWord) {
  emits('autoCompleteResult', keyWord)
}
watch(()=>props.searchKeyWords, (newValue, oldValue) =>{
  if(newValue !== '' && newValue !== oldValue) {
    console.log('autoKeyWords',newValue)
    const keysWords = newValue.trim().split(' ');
    autoComplete(keysWords);
  } else if(newValue === '') {
    infoList.value = [];
  }
})

const keyWordListRef = ref();
function mouseoverHover(){}
function mouseleaveCancelHover(){}
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
    @click="sendAutoCompleteResults(keyWord);"
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

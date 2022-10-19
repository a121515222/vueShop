import { defineStore } from "pinia";
import { ref } from "vue";
export const useInfoStore = defineStore('infoStore', ()=>{
  const notification = ref([]);
  function addMessage (message) {
    notification.value.push(message)
    setTimeout(() => {
      notification.value.shift()
    }, 5000)
  }
  function deleteMessage (index) {
    notification.value.splice(index, 1)
  }
  return {
    notification,
    addMessage,
    deleteMessage
  }
})
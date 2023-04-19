import { defineStore } from "pinia";
import apiCoupon from "../assets/getAPI/apiCoupon";
const { sendCoupon } = apiCoupon;

export const useCouponStore = defineStore('storeCoupon',()=>{
  async function useCoupon(sendData) {
    try {
      const res = await sendCoupon(sendData);
      return res
    } catch (error) {
      console.log(error);
    }
  }
  return {
    useCoupon,
  }
})
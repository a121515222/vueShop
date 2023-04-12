import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar

const apiCoupon = {
  async sendCoupon(sendData) {
    try {
      const data = await axios.post(`${api}/api/${path}/coupon`, sendData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default apiCoupon
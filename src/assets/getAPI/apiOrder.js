import axios from "axios";
import apiVar from './apiVar.js'
const { api, path } = apiVar

const apiOrder = {
  async sendOrder(sendData) {
    try {
      const res = await axios.post(`${api}/api/${path}/order`, sendData);
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async getOrder(id) {
    try {
      const res = await axios.get(`${api}/api/${path}/order/${id}`);
      console.log('getOrder',res)
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  }
}
export default apiOrder
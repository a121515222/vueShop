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
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async getOrders() {
    try {
      const res = await axios.get(`${api}/api/${path}/orders`);
      return res.data
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async getOrdersByPage(page) {
    try {
      const res = await axios.get(`${api}/api/${path}/orders?page=${page}`);
      return res.data
    } catch (error) {
      console.log(error);
      return error
    }
  }
}
export default apiOrder
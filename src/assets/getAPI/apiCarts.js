import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar

const apiCarts = {
  async getData(){
    try {
      const data = await axios.get(`${api}/api/${path}/cart`);
      return data.data.data.carts;
    } catch (error) {
      console.log(error);
    }
  },
  async deleteAllData(){
    try {
      const data = await axios.delete(`${api}/api/${path}/carts`)
    } catch (error) {
      console.log(error);
    }
  },
  async deleteData(id){
    try {
      const data = await axios.delete(`${api}/api/${path}/cart/${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  async putData(id){
    try {
      const data = await axios.put(`${api}/api/${path}/cart/${id}`)
    } catch (error) {
      console.log(error);
    }
  }
}

export default apiCarts
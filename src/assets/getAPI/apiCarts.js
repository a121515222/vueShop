import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar

const getCarts = {
  async getData(){
    try {
      const data = await axios.get(`${api}/api/${path}/cart`);
    } catch (error) {
      console.log(error);
    }
  }
}

export default gerCarts
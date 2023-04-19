import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar

const apiPay = {
  async pay(id){
    try {
      const res = await axios.post(`${api}/api/${path}/pay/${id}`);
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  } 
}

export default apiPay
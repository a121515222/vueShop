import axios from 'axios';
import apiVar from '../apiVar.js'
const { api, path } = apiVar

const apiProducts = {
 async getData(){
  try {
    const data = await axios.get(`${api}/api/${path}/products/all`);
    return data.data
    
  } catch (error) {
    console.log(error);
  }
  },
  async getSingleData(id) {
    try {
      const data = await axios.get(`${api}/api/${path}/product/${id}`);
      return data
    } catch (error) {
      console.log(error);
    }
  }
}

export default apiProducts 


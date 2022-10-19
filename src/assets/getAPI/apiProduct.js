import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar

const getDataProducts = {
 async getData(){
  try {
    const data = await axios.get(`${api}/api/${path}/products/all`);
    return data.data
  } catch (error) {
    console.log(error)
  }
  },
  
}

export default getDataProducts 


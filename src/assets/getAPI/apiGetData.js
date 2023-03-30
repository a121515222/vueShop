import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar


const getDataArticles = {
  async getData(){
   try {
     const data = await axios.get(`${api}/api/${path}/articles`);
     return data.data

   } catch (error) {
     console.log(error)
   }
   }
 }

 const getDataProducts = {
  async getData(){
   try {
     const data = await axios.get(`${api}/api/${path}/products/all`);
     return data.data
   } catch (error) {
     console.log(error)
   }
   }
 }

 const getCarts = {
  async getData(){
    try {
      const data = await axios.get(`${api}/api/${path}/cart`);
    } catch (error) {
      console.log(error);
    }
  }
}

export default {getDataArticles, getDataProducts, getCarts}

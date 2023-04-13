import axios from 'axios';
import apiVar from './apiVar.js'
const { api, path } = apiVar


const apiArticles = {
  async getData(){
   try {
     const data = await axios.get(`${api}/api/${path}/articles`);
     return data.data

    } catch (error) {
      console.log(error)
    }
  },
  async getSingleData(id) {
    try {
      const data = await axios.get(`${api}/api/${path}/article/${id}`);
      return data
    } catch (error) {
      console.log(error);
    }
  }
 }
 
 export default apiArticles 
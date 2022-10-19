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
   },
   
 }
 
 export default getDataArticles 
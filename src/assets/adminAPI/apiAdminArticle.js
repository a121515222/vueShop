import axios from "axios";
import apiVar from '../apiVar'
const { api, path } = apiVar

const apiAdminArticles = {
  async  getAdminArticles(page = 1) {
    try {
      const res = await axios.get (`${api}/api/${path}/admin/articles?page=${page}`);
      console.log('get article', res)
      return res;
     
    } catch (error) {
      console.log('error')
      return error    
    }
   },
   async  getAdminSingleArticles(id) {
    try {
      const res = await axios.get (`${api}/api/${path}/admin/article/${id}`);
      console.log('get single article', res)
      return res;
     
    } catch (error) {
      console.log('error')
      return error    
    }
   },
  async  addAdminArticle(article) {
    try {
      const res = await axios.post (`${api}/api/${path}/admin/article`, article);
      console.log('post article', res)
      return res;
     
    } catch (error) {
      console.log('error')
      return error    
    }
   },
   async  editAdminArticle(id, article) {
    try {
      const res = await axios.put (`${api}/api/${path}/admin/article/${id}`, article);
      console.log('put article', res)
      return res;
     
    } catch (error) {
      console.log('error')
      return error    
    }
   },
  async  deleteAdminArticle(id) {
   try {
     const res = await axios.delete (`${api}/api/${path}/admin/article/${id}`);
     console.log('delete article', res)
     return res;
    
   } catch (error) {
     console.log('error')
     return error    
   }
  }
}

export default apiAdminArticles

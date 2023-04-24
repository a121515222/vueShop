import axios from "axios";
import apiVar from '../apiVar'
const { api, path } = apiVar

const apiAdminProducts = {
  async getAdminProducts(page = 1) {
    try {
      const res = await axios.get(`${api}/api/${path}/admin/products?page=${page}`);
      console.log('admin get', res);
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async addAdminProduct(product) {
    try {
      const res = await axios.post(`${api}/api/${path}/admin/product`, product);
      console.log('admin post', res)
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async editAdminProduct(id, product) {
    try {
      const res = await axios.put(`${api}/api/${path}/admin/product/${id}`, product);
      console.log('admin put', res);
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  },
  async deleteAdminProduct(id) {
    try {
      const res = await axios.delete(`${api}/api/${path}/admin/product/${id}`);
      console.log('admin delete', res)
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  }
}

export default apiAdminProducts
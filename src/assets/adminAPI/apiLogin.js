import axios from "axios";
import apiVar from '../apiVar'
const { api, path } = apiVar

const loginApi = {
  async loginAdmin(loginUser) {
    try {
      const res = await axios.post(`${api}/admin/signin` , loginUser);
      console.log('login', res);
      return res
    } catch (error) {
      console.log(error)
      return error
    }
  },
  async loginCheck(token) {
    try {
      const res = await axios.post(`${api}/api/user/check`, { api_token : token });
      return res
    } catch (error) {
      console.log(error);
      return error      
    }
  },
  async logoutAdmin() {
    try {
      const res = await axios.post(`${api}/logout`);
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  }
}

export default loginApi
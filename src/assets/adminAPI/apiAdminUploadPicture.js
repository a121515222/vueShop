import axios from "axios";
import apiVar from '../apiVar'
const { api, path } = apiVar

const apiUploadPicture = {
  async pictureUpload(picture) {
    try {
      const res = await axios.post(`${api}/api/${path}/admin/upload`, picture);
      console.log('uploaded picture', res)
      return res
    } catch (error) {
      console.log(error);
      return error
    }
  }
}

export default apiUploadPicture
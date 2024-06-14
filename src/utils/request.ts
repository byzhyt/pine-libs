import { axiosHttpRequest } from "pine-utils";
import routers from '@/router/index'
import axios from 'axios'
import { ElMessage } from 'element-plus';
export const contentType = "application/x-www-form-urlencoded";

export default (option: any) => {
  const webAxios = new axiosHttpRequest({
    type: 'axios',
    request: axios,
    router: routers,
    messageBox: ElMessage,
    getToken() {
      return getToken()
    }
  })
  return webAxios.request(option)
}


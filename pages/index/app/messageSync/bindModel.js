/**
 * Created by TinsFox on 20/04/13.
 */
import { axios } from '../../../../utils/axios'
var api = new axios()
const app = getApp()
class Bind {
  constructor() {
    this.toast = true
  }
  // 系统绑定
  async bindSys(data) {
    return api.axios({
      url: app.API.bind,
      data: data,
      method: 'POST',
    })
  }
  // 系统解绑
  async untieBind(data){
    return api.axios({
      url: app.API.untie,
      data: data,
      method: 'PUT',
    })
  }
}

export { Bind };
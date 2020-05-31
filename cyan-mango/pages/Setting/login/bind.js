/**
 * Created by TinsFox on 20/04/13.
 */
const app = getApp()
class Bind {
  constructor() {
    this.toast = true
  }
  // 系统绑定
  async bindSys(data) {
    return app.http.axios({
      url: app.API.bind,
      data: data,
      method: 'POST',
    })
  }
  async wxinfo(data) {
    return app.http.axios({
      url: app.API.wxinfo,
      data: data,
      method: 'POST',
    })
  }
  // 系统解绑
  async untieBind(data){
    return app.http.axios({
      url: app.API.untie,
      data: data,
      method: 'PUT',
    })
  }
  wxUserInof(data){
    console.log('云用户信息')
    const db = wx.cloud.database()
    db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: data
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  }
}

export { Bind };
import env from 'env.js'
import { Token } from 'token'
import errHander from './errorHander'
class axios {

  constructor() {

  }

  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler, toast) {
    this._errorHandler = handler;
    console.log(handler);
    this.showToast(toast);
  }

  async _refetch(params) {
    var token = new Token()
    await token.getTokenFromServer()
    // 延迟两秒重试
    setTimeout(() => {
      this.axios(params, true)
    }, 3000);
  }
  /**
   * 
   * @param {显示Loading} flag 
   */
  toast(flag){
    flag?wx.showLoading({
      title: '请稍后！',
    }):setTimeout(() => {
      wx.hideLoading()
    }, 500);
  }
  /**
   * 调用requestAll
   * @param {参数体} param 
   */
  axios(param) {
    return this.requestAll(param)
  }
  /**
   * 网络请求
   * @param {*} param 
   */
  requestAll(param, noRefetch) {
    // console.log(param)
    return new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: env.host.baseUrl + param.url,
        data: param.data,
        header: { 'content-type': 'application/json', 'Authorization': 'Bearer '+token },
        method: param.method ? param.method : 'GET',
        success: (res => {
          // console.log(res)
          // console.log(res.statusCode)
          // console.log(res.data)
          // console.log(res.data.error_code)
          let statusCode = res.statusCode
          if (statusCode === 200) {
           let  errCode = res.data.error_code
            if(errCode===0){
              resolve(res.data)
            }else if(errCode===5040||errCode===5050){
              errHander(res.data)
              if (!noRefetch) {
                this._refetch(param)
              }
            }else if(errCode===5000){
              // 这里是服务器500了
              wx.showToast({
                title: '网络错误！',
              })
              resolve(res.data)
            }else if(errCode===5020){
              // 系统未绑定
              // 这里不使用拦截处理
              // wx.showToast({
              //   title:'登录过期',
              //   duration:'3000'
              // })
              // setTimeout(() => {
              //   wx.navigateTo({
              //     url: '/pages/index/app/messageSync/messageSync',
              //   })
              // }, 2000);
            }
            else{
              resolve(res.data)
            }
          }
        }),
        fail: (res => {
          console.log(res)
          reject(res)
        }),
        complete:(res => {
          // this.toast(false)
        })
      })
    })
  }
}
export { axios } 
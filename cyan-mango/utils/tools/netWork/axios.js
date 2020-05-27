import env from 'env.js'
import { Token } from 'token'
import {redis_get_token} from './redis.js'
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
  // 重新请求
  async _refetch(params) {
    var token = new Token()
    await token._refresh_token()
    setTimeout(() => {
      console.log('重新请求')
      this.axios(params, true)
    }, 3000);
  }

  
  axios(param,noRefetch) {
    return this.requestAll(param,noRefetch)
  }
  /**
   * 网络请求
   * @param {*} param 
   * @param {*} noRefetch 当noRefech为true时，不做未授权重试机制
   */
  requestAll(param, noRefetch) {

    return new Promise((resolve, reject) => {
      var token = redis_get_token('token')
      wx.request({
        url: env.host.baseUrl + param.url,
        data: param.data,
        header: { 'content-type': 'application/json', 'Authorization': 'Bearer '+token },
        method: param.method ? param.method : 'GET',
        success: (res => {
          // console.log(res)
          let statusCode = res.statusCode
          if (statusCode === 200) {
            // console.log(res)
            if(res.data.error_code==5040){
              this._refetch(param,true)
            }
            resolve(res.data)
          }else{
            console.log(res)
            reject(res.data)
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
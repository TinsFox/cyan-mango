import env from 'env.js'
import { Token } from 'token'
import {redis_get_token} from './redis.js'
var log = require('../../log') // 引用上面的log.js文件
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
    await token.getTokenFromServer()
    setTimeout(() => {
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
            if(res.data.error_code==5040){
              // this._refetch(param)
              if(!noRefetch){
                this._refetch(param)
              }
              console.log('token expired')
            }else if(res.data.error_code===5000){
              wx.showToast({
                title: '网络异常，请稍后再试',
                icon:"none",
                duration:3000
              })
            }else{

            }
            resolve(res.data)
          }else{
            log.error(res)
            wx.reportMonitor('0', 1)
            console.log(res)
            resolve(res.data)
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
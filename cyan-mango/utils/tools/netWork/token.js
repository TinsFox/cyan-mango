import env from 'env.js'
import API from './apiMap'
import { encrypt, decrypt } from '../Encrypt/main'
var fun_md5 = require('../../tools/Encrypt/md5')
import { redis_set_token, redis_get_token } from './redis.js'
// import  {Encrypt,Decrypt}  from '../encryption/main'
class Token {

  constructor() {
    this.tokenUrl = env.host.baseUrl + API.token,
    this.tokenRefreshUrl = env.host.baseUrl + API.refresh
  }

  /**
   * 调用 API 接口，校验 token 是否有效
   */
  verify() {
    var token = redis_get_token('token')
    if (token == 'needLogin') {
      this.getTokenFromServer()
    }
    else if (token) {
      // token有效，什么都不干
      return
    } else {
      // 不存在，就去服务器请求token
      this._refresh_token()
    }
  }

  /**
   * 请求API接口，校验token的合法性
   * 如果不合法，会自动调用 getTokenFromServer 方法请求 token
   */
  _refresh_token() {
    var that = this
    // console.log('token失效,刷新中')
    var Retoken = wx.getStorageSync('refresh_token')
    // console.log(Retoken)
    return new Promise((resolve,reject)=>{
      wx.request({
        url: that.tokenRefreshUrl,
        method: 'POST',
        header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + Retoken },
        success: function (res) {
          // console.log(res)
          var flag = res.statusCode === 200 ? true : false
          if (flag&&res.data.error_code==0) {
            let newToken=that.getToken(Retoken,res.data.data.access_token)
            redis_set_token('token', newToken)
            resolve (newToken)
          } else if(res.data.error_code==5040){
            that.getTokenFromServer()
          }
          else {
            reject(res.data)
            wx.showToast({
              title: '网络错误，请重试',
            })
          }
        }, complete(e) {
          // console.log(e)
        }
      })
    }) 
  }

  getToken(ket,text) {
    var str_md5 = fun_md5.hex_md5(ket)
    var tmp = str_md5.split('')
    var str1 = ""
    for (var i = 0; i < tmp.length; i++) {
      if (i % 2 != 0) {
        str1 = str1.concat(tmp[i])
      }
    }
    let token = decrypt(str1, text)
    return token
  }

  /**
   * 请求API接口，获取新的token
   */
  getTokenFromServer() {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            js_code: res.code,
            type: 2
          },
          success: function (res) {
            if (res.statusCode === 200) {
              try {
                const { access_token, refresh_token } = res.data.data
                let token = that.getToken(refresh_token,access_token)
                // console.log("toekn:" + token)
                redis_set_token('token', token)
                wx.setStorageSync('refresh_token', refresh_token)
              } catch (err) {
                console.log(err)
              }
            } else {
              wx.showToast({
                title: '网络错误，请重试',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  }
}


export { Token };
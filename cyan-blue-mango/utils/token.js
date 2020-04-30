import  env from 'env.js'
import API from './apiMap'
import  {Encrypt,Decrypt}  from './main'
class Token {

  constructor() {
    this.tokenUrl = env.host.baseUrl + API.token
  }

  /**
   * 调用 API 接口，校验 token 是否有效
   */
  verify() {
    var token = wx.getStorageSync('refresh_token');
    if (token) {
      // 本地存在refresh_token
      // 存在，就向服务器获取新的token
      this._refresh_token(token)
    } else {
      // 不存在，就去服务器请求token
      this.getTokenFromServer()
    }
  }

  /**
   * 请求API接口，校验token的合法性
   * 如果不合法，会自动调用 getTokenFromServer 方法请求 token
   */
  _refresh_token(token) {
    var that = this
    wx.request({
      url: that.verifyUrl,
      method: 'GET',
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' +token },
      success: function (res) {
        var flag = res.statusCode === 200 ? true : false
        var valid = flag;
        if (valid) {
          wx.setStorageSync('token', res.data.access_token)
        }else{
          wx.showToast({
            title: '网络错误，请重试',
          })
        }
      }
    })
  }

  /**
   * 请求API接口，获取新的token
   */
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            js_code: res.code,
            type:2
          },
          success: function (res) {
            // console.log('login')
            if(res.statusCode===200){
              // console.log(Encrypt('我是加密明文'))
              // console.log(Decrypt('76B1A6C8374178799AA829EEE825021DAB42C6158025E67080AF44E1C90BA169'))
              const { access_token, refresh_token } = res.data.data
              wx.setStorageSync('token', access_token)
              wx.setStorageSync('refresh_token', refresh_token)
            }else{
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
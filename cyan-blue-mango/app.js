//app.js
import { Token } from 'utils/token.js';
import { check,checkBindStatus } from './utils/checkBind'
import API from './utils/apiMap'
require("/utils/wx.js")
import { axios } from './utils/axios'
App({
  api : new axios(),
  onLaunch: function () {
    var token = new Token();
    token.verify();
    this.getAuthStatus()
    if(wx.cloud){
      wx.cloud.init({
        env:'rc-qrqw6',
        traceUser:true
      })
    }
  },
  API,
  check,
  checkBindStatus,
  getAuthStatus(data = {}) {
    let that=this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.isAuthorized = true
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      complete:res=>{
        // 检查缓存，判断系统绑定状态
        wx.getStorage({
          key: 'bindStatus',
          success: function (res) {
            that.globalData.bindStatus = res.data
          },
          fail: function (res) {
           
          }
        })

      }
    })
  },
  globalData: {
    userInfo: null,
    bindStatus:false, // 教务系统绑定
    lirBindStatus:false, // 图书馆绑定
    isAuthorized:false // 微信授权
  }
})
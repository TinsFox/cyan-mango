//app.js
import {Token} from './utils/tools/netWork/token'

import {axios} from "./utils/tools/netWork/axios"
import API from './utils/tools/netWork/apiMap'
require("./utils/tools/app_param")
var Config = require("./utils/config")
var token= new Token()
require("./utils/tools/wx")
App({
  API,
  http:new axios(),
  Config,
  globalData:{
    isAuthorized:false,
    bindStatus:undefined,
    nav:[]
  },
  onLaunch: function () {
    wx.setEnableDebug({
      enableDebug: true
    })
    token.verify()
    if (wx.cloud) {
      wx.cloud.init({
        env: 'rc-qrqw6',
        traceUser: true
      })
    }
    Config.init()
    this.getAuthStatus()
    this.getAppParam()
  },
  getAppParam() {
    let that=this
    wx.cloud.callFunction({
      name: 'getAppParam',
      data: {},
    })
    .then(res => {
      if(res.result.errMsg=='collection.get:ok'){
        let param = res.result.data[0].data
        wx.setStorageSync("app_param", param)
        Config.set('param',param)
      }
    })
  },
  // 获取认证状态
  getAuthStatus(data = {}) {
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权微信", res)
          wx.getUserInfo({
            complete: (res) => {
              wx.setStorageSync('wxInfo', res.userInfo)
            },
          })
          this.globalData.isAuthorized = true
          wx.checkSession({
            fail() {
              wx.login() // 重新登录
            }
          })
        }
        // console.log("微信未授权",res)
      },
      // 检测授权状态后 检测绑定状态
      complete(res) {
        wx.getStorage({
          key: 'permission',
          success: function (res) {
            console.log('绑定',res.data)
            that.globalData.bindStatus = res.data
          },
          fail: function (res) {
            console.error(res)
          }
        })
      }
    })
  }
})
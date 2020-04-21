//app.js
import { Token } from 'utils/token.js';
import { check } from './utils/checkBind'
import API from './utils/apiMap'
App({
  onLaunch: function () {
    var token = new Token();
    token.verify();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    this.getAuthStatus()
  },
  API,
  check,
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
            // console.log(res)
            // console.log("已绑定教务系统")
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
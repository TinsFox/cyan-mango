var app = getApp()
import { Bind } from './bind'
var bind = new Bind()
import {checkPermission} from "../../../utils/tools/permission"
Page({
  data: {
    hideLoginBtn1: false,
    hideLoginBtn2: true,
    hideLogin: false,
    hideSuccess: true,
    checked: true,
    JWC: true,
    LIR: false,
    showGuide: false,
    bindStatus: !wx.$getPermission("education"),
    isAuthorized: app.globalData.isAuthorized,
    dialog: false
  },
  async untieBind() {
    let res = await bind.untieBind({ type: 1 })
    console.log(res)
    if(res.error_code==0){
      wx.showToast({
        title: '解绑成功',
        icon:"success"
      })
      checkPermission()
      this.setData({
        bindStatus:true
      })
    }
  },
  onLoad: function (options) {
    console.log(app.globalData.isAuthorized)
    this.setData({
      show: !app.globalData.isAuthorized
    })
  },

  navToAgreement() {
    wx.navigateTo({
      url: '/pages/index/setting/agreement/agreement',
    })
  },
  agree() {
    this.setData({
      checked: !this.data.checked
    })
  },
  JWC() {
    this.setData({
      JWC: !this.data.JWC,
      LIR: !this.data.LIR
    })
  },
  LIR() {
    this.setData({
      JWC: !this.data.JWC,
      LIR: !this.data.LIR
    })
  },

  // 提交登录表单
  async formSubmit(e) {
    let that = this
    if (!that.data.checked) {
      wx.showToast({
        title: '请同意用户协议',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let account = {
      sid: e.detail.value.username,
      pwd: e.detail.value.password,
      type: this.data.JWC === true ? 1 : 2
    }

    if (account.sid == "" || account.pwd == "") {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      // 执行登录
      that.login(account)
    }
  },
  // 获取微信用户信息
  async userInfoHandler(data) {
    console.log(data)
    let that = this
    wx.showLoading({
      title: '授权中...',
    })
    if (data.detail.errMsg == "getUserInfo:ok") {
      app.globalData.isAuthorized = true
      let userinfo= data.detail.userInfo
      let wxInfo=await bind.wxinfo(userinfo)
      wx.setStorageSync('wxInfo', userinfo)
      console.log(wxInfo)
      that.setData({
        show: false
      })
    } else {
      wx.showToast({
        title: '授权失败，可退出重试',
        icon: "none"
      })
      that.setData({
        show: false,
        showGuide: true
      })
    }
    wx.hideLoading()
  },
  onConfirmTap(e) {
    // console.log(e)
    this.setData({
      dialog: false
    })
  },
  // 登录绑定学号
  async login(data) {
    let that = this
    that.dialogHander()
    let res = await bind.bindSys(data)
    console.log(res)
    let code = res.error_code
    if (code === 0 || code ===5200) {
      //绑定成功
      this.dialogHander()
      wx.showToast({
        title: '绑定成功',
      })
      checkPermission()
      this.setData({
        bindStatus:false
      })
      // wx.setStorageSync('token', res.data.access_token)
      // 教务处已登录
      // this.back() // 返回上一页
    } else if (code === 5020) {
      // 密码错误
      that.setData({
        dialog: true,
        msg: res.msg
      })
      this.dialogHander()
    }
  },
  // dialog 控制
  dialogHander() {
    let that = this
    setTimeout(() => {
      that.setData({
        loading: !that.data.loading,
        hideLoginBtn1: !that.data.hideLoginBtn1,
        hideLoginBtn2: !that.data.hideLoginBtn2
      }, 200);
    })
  },
  back() {
    setTimeout(() => {
      wx.navigateBack()
    }, 2000);
  }
})
var app = getApp()
import { Bind } from './bindModel'
var bind = new Bind()
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
    bindStatus: !app.checkBindStatus(),
    isAuthorized: app.globalData.isAuthorized,
    dialog: false
  },
  async untieBind() {
    let res = await bind.untieBind({ type: 1 })
    console.log(res)

  },
  onLoad: function (options) {
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

  userInfoHandler(data) {
    wx.showLoading({
      title: '授权中...',
    })
    wx.hideLoading()
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
  userInfoHandler(data) {
    let that = this
    wx.showLoading({
      title: '授权中...',
    })
    if (data.detail.errMsg == "getUserInfo:ok") {
      app.globalData.isAuthorized = true
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
    let code = res.error_code
    if (code === 0) {
      //绑定成功
      this.dialogHander()
      wx.showToast({
        title: '绑定成功',
      })
      wx.setStorageSync('bindStatus', true)
      wx.setStorageSync('token', res.data.access_token)
      // 教务处已登录
      app.globalData.bindStatus=true
      this.back() // 返回上一页
    } else if (code === 5020) {
      // 密码错误
      that.setData({
        dialog: true,
        msg: res.msg
      })
      this.dialogHander()
    }
    console.log(res)
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
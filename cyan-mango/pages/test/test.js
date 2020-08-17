// cyan-mango/pages/test/test.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  code(){
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          console.log(res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  debug(){
    wx.setEnableDebug({
      enableDebug: false
    })
  },
bt(){
  wx.requestSubscribeMessage({
    tmplIds: ['qLHNGkbqbElfJWcdohnaZpvGAtuFGiqNnDmi-Cgrs6w'],
    success (res) {
      console.log(res)
     }
  })
},
b(){
  wx.requestSubscribeMessage({
    tmplIds: ['iHZMpUOhDi9WilzmFBHKtgVq09Uc-RF4aoA1XqqO6Ik'],
    success (res) {
      console.log(res)
     }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.http.axios({
      url: "/publish/user/wx-info"
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
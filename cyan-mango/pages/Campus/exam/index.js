// pages/index/app/exam/exam.js

import {
  examModel
} from './exam'
const app = getApp()
var exam = new examModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideNotice: true,
    loading: false,
    msg: '',
    list: {},
    title_color: ["gradual-red", "gradual-orange", "gradual-green", "gradual-blue", "gradual-purple", "gradual-pink"],
    bg_color: ['bg-pink', 'bg-brown', 'bg-yellow', 'bg-mauve', 'bg-cyan', 'bg-green', 'bg-blue', 'bg-red', 'bg-orange'],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.$getPermission("education")) {
      wx.showModal({
        title: '提示',
        content: '教务系统未绑定',
        confirmText: '去绑定',
        cancelText: '返回',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Setting/login/index',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        }
      })
    } else {
      this._init()
    }
  },
  async _init() {
    this.setData({
      loading: true,
    })
    let res = await exam.getInfo()
    console.log(res)
    if (res.error_code == 0) {
      this.setData({
        hideNotice: true,
        list: res.data,
        loading: false,
      })
    } else if (res.error_code == 1) {
      this.setData({
        hideNotice: false,
        loading: false,
        msg: '暂时无法查询学期考试信息'
      })
    } else {
      this.setData({
        hideNotice: false,
        loading: false,
        msg: res.msg
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loading: false,
    })
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
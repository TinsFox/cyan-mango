// pages/index/app/exam/exam.js
import { examModel } from './exam'
const app = getApp()
var exam = new examModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideNotice: true,
    list: {
      "exam": [
        {
          "address": "教室",
          "class": "课程",
          "code": "课程代码",
          "date": "2019-10-25",
          "seat": "座位号",
          "time": "09:00-11:00",
          "weekday": "第9周周5"
        }
      ],
      "xnd": "2018-2019",
      "xqd": "1"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.$getPermission("education")){
      wx.showModal({
        title: '提示',
        content: '教务系统未绑定',
        confirmText:'去绑定',
        cancelText:'返回',
        success (res) {
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
    }else{
      this._init()
    }
  },
  async _init() {
    let res = await exam.getInfo()
    console.log(res)
    if (res.error_code == 1) {
      this.setData({
        hideNotice: !this.data.hideNotice,
        msg: res.msg
      })
    }else{
      this.data({
        hideNotice: !this.data.hideNotice,
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
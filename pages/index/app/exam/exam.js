// pages/index/app/exam/exam.js
import { check } from '../../../../utils/checkBind'
import { examModel } from './examModel'
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
    this.setData({
      exam:this.data.list.exam
    })
    app.check({bind:app.globalData.bindStatus,type:1})
    this._init()
    // this.getExamHistory()
  },
  async _init() {
    let res = await exam.getInfo()
    if (res.error_code == 1) {
      this.setData({
        hideNotice: !this.data.hideNotice,
        msg: res.msg
      })
      
    }
  },
  // 获取历史考试安排
  async getExamHistory() {
    let res = await exam.getExamHistory()
    this.setData({
      list: res.data[0],
      exam: res.data[0].exam
    })
    console.log(res)

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
    if (!app.globalData.bindStatus) {
      wx.showToast({
        title: '请绑定学号',
        icon: "none",
        duration: 1500
      })
    }
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
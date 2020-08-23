let config = require('../config.js')
let gcu = require('../resources/gcu')
var app = getApp();
import {schoolModel} from "./schoolMessage"
var School = new schoolModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    building: {},
    title:'华工广州学院'
  },
  async getData(){
    let res = await School.getSchool()
    this.setData({
      test:res
    })
  },
  route(){
    wx.navigateTo({
      url: '/pages/Campus/map/attractionMap/attractionMap',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(Object.keys(options).length==0){
      this.setData({
        building: gcu.introduce
      });
    }else{
      this.setData({
        building: JSON.parse(options.data)
      });
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
  onShow: function (options) {

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
  onShareAppMessage: function (res) {
    var title, path;
    if (this.data.introduce){
      title = app.globalData.introduce.name + '校园导览';
      path = "/pages/map/details";
    } else {
      title = this.data.building.name + ' - ' + app.globalData.introduce.name + '校园导览'
      path = "/pages/map/details?tid=" + this.data.tid + "&bid=" + this.data.bid
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: path,
      imageUrl: app.imgCDN + this.data.building.img[0],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
//获取应用实例
import {introduce, map} from '../resources/gcu'
var app = getApp();
Page({
  data: {
    fullscreen: false,
    latitude: 23.433793,
    longitude: 113.172041,
    buildlData: '',
    windowHeight: "",
    windowWidth: "",
    isSelectedBuild: 0,
    isSelectedBuildType: 0,
    imgCDN: app.imgCDN,
    islocation: true
  },
  onLoad: function () {
    console.log(map)
    console.log(introduce)
    wx.showShareMenu({
      withShareTicket: true
    })
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        //获取当前设备宽度与高度，用于定位控键的位置
        _this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          buildlData:map
        })
      }
    })
    //载入更新后的数据
    this.setData({
      buildlData: app.globalData.map
    })
  },
  regionchange(e) {
    // 视野变化
    // console.log(e.type)
  },
  markertap(e) {
    // 选中 其对应的框
    this.setData({
      isSelectedBuild: e.markerId
    })
    // console.log("e.markerId", e.markerId)
  },
  navigateSearch() {
    wx.navigateTo({
      url: 'search'
    })
  },
  location: function () {
    var _this = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  clickButton: function (e) {
    //打印所有关于点击对象的信息
    this.setData({ fullscreen: !this.data.fullscreen })
  },
  changePage: function (event) {
    this.setData({
      isSelectedBuildType: event.currentTarget.id,
      isSelectedBuild: 0
    });
  }
})
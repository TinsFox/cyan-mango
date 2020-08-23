//获取应用实例
import {introduce, map} from '../resources/gcu'
var app = getApp();
Page({
  data: {
    fullscreen: false,
    latitude: 23.433793,
    longitude: 113.172041,
    buildlData: [],
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
  },
  regionchange(e) {
    // 视野变化
    // console.log(e.type)
  },
  markertap(e) {
    console.log(e)
    // 选中 其对应的框
    this.setData({
      isSelectedBuild: e.markerId
    })
    console.log("e.markerId", e.markerId)
  },
  navigateSearch() {
    wx.navigateTo({
      url: 'search'
    })
  },
  route(){
    let plugin = requirePlugin('routePlan');
    let key = '2WHBZ-BAGKF-PJOJE-NZOQ4-5LCL7-SNFU2';//使用在腾讯位置服务申请的key;
    let referer = '青芒派'; //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': gcu.introduce.name,
        'latitude': gcu.introduce.latitude,
        'longitude': gcu.introduce.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
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
    console.log(event)
    this.setData({
      isSelectedBuildType: event.currentTarget.id,
      isSelectedBuild: 0
    });
  }
})
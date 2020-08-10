//获取应用实例
var app = getApp();
Page({
  data: {
    imgCDN: app.imgCDN
  },
  onLoad: function (options) {

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '华广 - 校园导览',
      path: '/pages/Campus/map/map',
      imageUrl: app.imgCDN + app.globalData.introduce.share,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
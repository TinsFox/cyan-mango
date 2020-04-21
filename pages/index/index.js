import param from '../../utils/param'

Page({

  data: {
    gridCol: 4,
    nav: []
  },

  clickGrids(e) {
    // console.log(e.currentTarget.dataset.url)
    const url  = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
      complete:res=>{
        console.log(res)
      }
    })
  },


  onLoad: function(options) {
    this.setData({nav:param.nav})
    console.log(param.nav)
  },

  onReady: function() {

  },

  onShow: function() {

  },


  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})
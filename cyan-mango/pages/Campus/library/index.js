Page({

  data: {
    disabled:false
  },

  onLoad: function(options) {
    var time = new Date()
    if (time.getHours() >= 23 || time.getHours() < 7) {
      wx.showToast({
        title: '当前时间段不可用~',
        icon: "none"
      })
      this.setData({
        disabled:true
      })
      return
    }
  },

  formSubmit(e) {
    var time = new Date()
    console.log(time.getHours())
    

    let query = e.detail.value.query
    if (query == "") {
      wx.showToast({
        title: '请输入书名',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: "/pages/Campus/library/list/index?query=" + query,
    })
  },
  onShareAppMessage: function() {

  },

  nav(e) {
    let id = e.currentTarget.id
    if (e.currentTarget.id == "") return
    wx.navigateTo({
      url: '/pages/Campus/library/item/index?id=' + id,
    })
  }
})
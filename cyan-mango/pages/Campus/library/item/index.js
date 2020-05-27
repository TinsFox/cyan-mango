// import { ToolModel } from './toolModel'
// var tool = new ToolModel()
Page({

  data: {
    id: "open",
    title: "开放时间",
    listData:[
      {"code":"文艺书库   社科书库    经济书库   自然数据","text":"周一至周日 08:30-22:00"},
      {"code":"电子阅览室 报刊阅览室","text":"周一至周五 8:30-12:00 14:30-17:30 "},
      {"code":"自修室","text":"周一至周日 07-00-22:00"},
    ]
  },

  onLoad: function(options) {
    let title = {
      room: "库室分布",
      open: "开放时间",
      visit: "进馆数据",
      record: "借阅记录",
      favorite: "我的收藏"
    }
    this.setData({
      id: options.id,
      title: title[options.id]
    })
    wx.setNavigationBarTitle({
      title: title[options.id]
    })

    if (options.id == "visit") this.getVisit()

    if (options.id == "favorite") this.getFav()
    if (options.id == "record") this.getRecord()
  },

  onShareAppMessage: function() {

  },
  async getRecord(){
    let res= await tool.record()
    console.log(res)
  },

  getFav() {
    let fav = wx.getStorageSync("fav_books")
    let favourite
    if (fav == "" || fav.length == 0) fav = []
    this.setData({
      fav: fav
    })
  },

  navToDetail(e) {
    let index = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/Campus/library/detail?id=' + index,
    })
  },

  getVisit() {
    let that = this
    // 更新图书馆进馆信息
    wx.request({
      url: 'https://myapi.iego.net:5000/library',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          lib: res.data
        })
      }
    })
  },

  preview() {
    let imgurl = "https://cos.ifeel.vip/gzhu-pi/images/resource/qrcode.jpg"
    wx.previewImage({
      urls: [imgurl]
    })
  }

})
import{ libraryModel } from '../../library'
const library = new libraryModel()
Page({

  data: {
    noCover: "cloud://gzhu-pi-f63be3.677a-gzhu-pi-f63be3/images/icon/book.svg",
    holdings: [],
    loading:true
  },

  onLoad: function(options) {
    console.log(options.param)
    let data=JSON.parse(options.param)
    console.log(data)
    this.getHoldings(data)
  },
  // 获取馆藏信息
  async getHoldings(data) {
    let that = this
    var time = new Date()
    if (time.getHours() >= 0 && time.getHours() < 7) {
      wx.showToast({
        title: '当前数据馆藏查询不可用~',
        icon: "none"
      })
      return
    }
    let res=await library.getDetail(data)
    console.log(res.data)
    that.setData({
      book:res.data,
      info:data,
      loading:!that.data.loading
    })
  }
})
// cyan-mango/pages/Setting/admin/flea_market/index.js
import {FleaMarketModel} from "./flea_market_action"
var FleaMarket = new FleaMarketModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {name:"跳蚤市场"},
      {name:"表白墙"}
    ],
    article: [],
    TabCur: 0,
    scrollLeft:0
  },
  onTapWall(event){
    wx.navigateTo({
      url: '/pages/Life/wall/detail/index?itemId=' + event.currentTarget.dataset.id,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    switch(this.data.TabCur){
      case 0 :{
        this.setData({
          article:[]
        })
        this.getList()
        break
      }
      case 1:{
        this.setData({
          article:[]
        })
        this.getWallList()
        break
      }
      default:
        console.log('err')
    }
  },
  onTap: function (event) {
    console.log("商品ID：", event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/Life/fleaMarket/detail/index?itemId=' + event.currentTarget.dataset.id,
    })
  },
   async getList(){
    let res=await FleaMarket.getList()
    console.log(res.data)
    this.setData({
      article:res.data
    })
  },

  async getWallList(){
    let res=await FleaMarket.getWallList()
    console.log(res)
    if(res.error_code=0){
      this.setData({
        article:res.data
      })
    }else{
      this.setData({
        article:[]
      })
    }
    console.log(this.data.article.length)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
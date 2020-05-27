// cyan-mango/pages/Life/fleaMarket/mine/index.js
import { FleaMarketModel } from '../fleaMarket'
var FleaMarket = new FleaMarketModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    article:[]
  },
  onTap: function (event) {
    console.log("商品ID：", event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/Life/fleaMarket/detail/index?itemId=' + event.currentTarget.dataset.id,
    })
  },
  async getList() {
    let that = this
    let res=await FleaMarket.myGood()
    console.log(res)
    if(res.error_code==0){
      that.setData({
        article:res.data.records,
        loading: false
      })
    }else{
      this.setData({
        loading: false,
      })
    }
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
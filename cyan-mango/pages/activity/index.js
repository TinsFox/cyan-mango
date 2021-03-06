// cyan-mango/pages/activity/index.js
import{ActivityModel} from "./activity"
var activity=new ActivityModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async getList(){
    let res=await activity.getList()
    console.log(res) 
    console.log(res.data.activities) 
    if(res.error_code==0){
      this.setData({
        activities:res.data.activities
      })
    }
  },
  navToPost(){
    wx.navigateTo({
      url: '/pages/activity/post/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getList()
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
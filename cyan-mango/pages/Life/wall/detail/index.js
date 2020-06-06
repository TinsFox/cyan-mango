// cyan-mango/pages/Life/wall/detail/index.js
import { WallModel} from "../wall"
var Wall = new WallModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "华广墙",
  },
  // ==============管理=============
  async verify(value) {
    let res=await Wall.verify(value)
    if(res.error_code==0){
      // console.log('s')
      wx.showToast({
        title: '操作成功',
        icon:"success"
      })
      this.getDetail()
    }
    console.log(res)
  },
  manage(e) {
    let that = this
    // console.log(e.target.dataset.op)
    switch (e.target.dataset.op) {
      case "审核s":{
        // console.log("过审")
        let data={
          itemId:this.data.itemId,
          state:1
        }
        this.verify(data)
        wx.navigateBack()
        break
      }
      case "审核d":{
        console.log("违规内容")
        let data={
          itemId:this.data.itemId,
          state:-1
        }
        this.verify(data)
        break
      }
      case "删除":
        wx.showModal({
          title: '删除提示',
          content: '确定删除该二手物品吗？',
          success(res) {
            if (res.confirm) {
              if (that.data.detail.info.file_ids) {
                that.delFile(that.data.detail.info.file_ids)
              }
              that.delGoods(that.data.id)
            }
          }
        })
        break
      default:
        return
    }
    this.getDetail()
  },
  async getDetail(){
    let res=await Wall.getDetail({itemId:this.data.itemId})
    console.log(res)
    if(res.error_code==0){
      this.setData({
        detail:res.data
      })
      this.setTitle(this.data.detail.type)
    }
  },
  setTitle(type = "华广墙") {
    switch (type) {
      case "情墙":
        type = "华广情墙"
        break
      case "悄悄话":
      case "树洞":
        type = "悄悄话-心情树洞"
        break
      case "日常":
        type = "日常唠嗑"
        break
      default:
        type = "华广墙"
    }
    this.setData({
      navTitle: type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      itemId:options.itemId,
      wait: true,
    })
    this.getDetail()
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
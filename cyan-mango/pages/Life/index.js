// cyan-mango/pages/Life/index.js
var Config=require("../../utils/config")
import { WallModel} from "./wall/wall"
var Wall = new WallModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInit:false,
    mode:'verify',
    gridCol: 2,
    navTitle:"华广墙",
    page:1,
    dataSet:[],
    iconList: [{
      icon: 'https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/tmp/WechatIMG200.png',
      name: '华广墙'
    }, {
      icon: 'https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/tmp/WechatIMG1971.png',
      name: '华广情墙'
    }, {
      icon: 'https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/tmp/WechatIMG201.png',
      name: '悄悄话'
    }, {
      icon: 'https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/tmp/WechatIMG202.png',
      name: '跳蚤市场'
    }],
  },
  async search() {
    this.setData({
      categoryIndex: -1
    })
    let res=await Wall.searchKey({"q":this.data.queryStr})
    console.log(res)
    if(res.error_code==0){
      this.setData({
        // dataSet:that.data.dataSet.concat(res.data.records),
        dataSet:res.data.records,
        loading: false,
        max_page:res.data.max_page
      })
    }else{
      this.setData({
        loading: false,
      })
    }
  },
   // 读取搜索内容
   searchInput: function (e) {
    this.data.queryStr = e.detail.value
  },
  async getList() {
    let that = this
    this.setData({
      loading: true
    })
    let data={
      page:this.data.page
    }
    let res=await Wall.getList(data)
    console.log(res)
    if(res.error_code==0){
      that.setData({
        dataSet:that.data.dataSet.concat(res.data.records),
        loading: false,
        max_page:res.data.max_page
      })
    }else{
      this.setData({
        loading: false,
      })
    }
  },
  // 切换分类
  switchCategory(e) {
    let id = Number(e.currentTarget.id)
    switch (this.data.iconList[id].name) {
      case "华广墙":
        this.setData({
          "brick_option.columns": 2,
          navTitle: "华广墙"
        })
        this.data.type = "日常"
        break
      case "华广情墙":
        this.data.type = "情墙"
        this.setData({
          "brick_option.columns": 1,
          navTitle: "华广情墙"
        })
        break
      case "悄悄话":
        this.setData({
          "brick_option.columns": 1,
          navTitle: "悄悄话"
        })
        this.data.type = "悄悄话"
        break
      case "跳蚤市场":
        wx.navigateTo({
          url: '/pages/Life/fleaMarket/index',
        })
        return
      default:
        console.error("unknown type")
        return
    } 

    this.setData({
      page: 0, //恢复页数
      loadDone: false, //加载完毕
      queryStr: "",
      dataSet: [],
      // loading: true
    })
    // console.log(this.data.type)
    this.getTopics({type:this.data.type})

  },
  async getTopics(data){
    let res= await Wall.Topics(data)
    console.log(res)
    if(res.error_code==0){
      this.setData({
        dataSet:this.data.dataSet.concat(res.data.records)
      })
    }

  },
  navToPost() {
    wx.$navTo('/pages/Life/wall/post/index')
  },
 // 点击卡片，获取id，转跳详情页面
 detail: function (event) {
  console.log("ID：", event.currentTarget.dataset.id)
  wx.$navTo('/pages/Life/wall/detail/index',  {itemId:event.currentTarget.dataset.id})
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
    this.setData({
      mode:wx.$getParam('mode'),
      isInit:true
    })
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
    this.setData({
      loadDone: false, //加载完毕
      queryStr: "",
      page:1,
      max_page:undefined
    })
    this.getList()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000)
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
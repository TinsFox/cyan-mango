import {FleaMarketModel} from './fleaMarket'
import { nav, brick_option, category } from './data.js';
var Config=require("../../../utils/config")
var FleaMarket = new FleaMarketModel()
Page({

  data: {
    dropScreenH:0,
    loadDone: false, //加载完毕
    queryStr: "", //搜索的字符串
    loading: false,
    category: category,
    categoryIndex: 0,
    dataSet: [],
    brick_option: brick_option,
    gridCol: 4,
    iconList: nav,
    mode:wx.$getParam('mode'),
    page:1
  },


  onLoad: function (options) {
   console.log(wx.$getParam('mode'))
    this.getGoods()
  },

  onShareAppMessage: function () {

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      loadDone: false, //加载完毕
      queryStr: "",
      page:1,
      max_page:undefined,
      dataSet:[]
    })
    this.getGoods()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000)
  },

  // 点击卡片，获取商品id，转跳详情页面
  detail: function (event) {
    console.log("商品ID：", event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/Life/fleaMarket/detail/index?itemId=' + event.currentTarget.dataset.id,
    })
  },


  navToPost() {
    wx.navigateTo({
      url: '/pages/Life/fleaMarket/post/index',
    })
    wx.requestSubscribeMessage({
      tmplIds: ['qLHNGkbqbElfJWcdohnaZpvGAtuFGiqNnDmi-Cgrs6w'],
      success (res) {
        console.log(res)
       }
    })
  },

  // 读取搜索内容
  searchInput: function (e) {
    this.data.queryStr = e.detail.value
  },

  async search() {
    this.setData({
      categoryIndex: -1
    })
    let res=await FleaMarket.searchKey({"q":this.data.queryStr})
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

  // 触底加载更多，需改变offset，判断有无更多
  onReachBottom: function () {
    if (this.data.loadDone) return
    console.log('加载更多')
    this.setData({
      page:this.data.page+1
    })
    if(this.data.page>=this.data.max_page){
      this.setData({
        loadDone:true
      })
      return
    }
    this.getGoods()
  },

  // 切换分类
  switchCategory(e) {
    let id = Number(e.currentTarget.id)
    if (this.data.iconList[id].name == "我的发布") {
      wx.navigateTo({
        url: '/pages/Life/fleaMarket/mine/index'
      })
      return
    }
    if (id == this.data.categoryIndex) return
    if(id==0){
      this.setData({
        dataSet:[],
        categoryIndex: id,
      })
      this.getGoods()
    }else{
      this.setData({
        loadDone: false, //加载完毕
        queryStr: "",
        categoryIndex: id,
        dataSet:[]
      })
      this.searchGoods(id-1)
    }
  },
// 分类搜索
async searchGoods(type) {
  let that = this
  this.setData({
    loading: true
  })
  let res=await FleaMarket.searchGood({"affiliation":type})
  console.log(res.data)
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
  // 获取商品
  async getGoods() {
    let that = this
    this.setData({
      loading: true
    })
    let data={

      page:this.data.page
    }
    let res=await FleaMarket.getList(data)
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
    console.log(res.data)

  }
})
// import dateUtil from '../../../../../utils/setting/date'
import { FleaMarketModel } from '../fleaMarket'
var FleaMarket = new FleaMarketModel()
import {checkPermission}from "../../../../utils/tools/permission"
let app = getApp()
Page({

  data: {
    mode: "prod",
    bindStatus: app.globalData.bindStatus,
    loading: true,
    isOwner: false, //物品发布者
    refreshable: false, //是否可以刷新
    isAdmin:wx.$getPermission("admin")
  },

  fake() {
    let mode = "prod"
    this.setData({
      mode: mode
    })
    if (mode == "prod") {
      return false
    } else return true
  },

  onLoad: async function (options) {

    if (this.fake()) return
    this.setData({
      itemId: options.itemId
    })
    this.getDetail()
  },

  onShow(options) {
    this.checkAdmin()
    let that = this
    setTimeout(function () {
      that.setData({
        bindStatus: app.globalData.bindStatus
      })
    }, 1000)
  },


  // 获取单个商品全部信息
  async getDetail() {
    console.log(this.data.itemId)
   let res=await FleaMarket.getGoodDetail({itemId:this.data.itemId})
   console.log(res)
   if(res.error_code==0){
        this.setData({
          loading:false,
          detail:res.data
      })
   }else{
     this.setData({
      loading:false
     })
   }
  },

  // 原子性更新计数器
  updateCounter(id) {
    let table = new wx.BaaS.TableObject(tableName)
    let record = table.getWithoutData(id)
    record.incrementBy('viewed', 1)
    record.update()
  },

  // 复制内容到剪贴板
  onCopy(e) {
    wx.setClipboardData({
      data: e.target.dataset.copy,
    })
  },

  // 页面转跳
  navTo(e) {
    console.log("转跳", e.target.id)
    switch (e.target.id) {
      case "bind":
        wx.navigateTo({
          url: '/pages/Setting/login/bindStudent',
        })
    }
  },

  viewImage(e) {
    wx.previewImage({
      urls: this.data.detail.image,
      current: e.currentTarget.dataset.url
    });
  },

  // 分享页面带上商品id
  onShareAppMessage: function () {
    this.setData({
      shareModal: false
    })
    return {
      title: '跳蚤市场:' + this.data.detail.goodTitle,
      desc: '',
      path: '/pages/Life/oldthings/detail?id=' + this.data.itemId,
      imageUrl: this.data.detail.image[0]?this.data.detail.image[0]:'',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      }
    }
  },

  // ==============管理=============

  manage(e) {
    let that = this
    console.log(e.target.dataset.op)
    switch (e.target.dataset.op) {
      case "擦亮":
        if (!this.data.refreshable) {
          wx.showToast({
            title: '明天再来😯',
            icon: "none"
          })
          return
        }
        // 刷新时间，秒级时间戳
        this.update("refresh_time", Date.parse(new Date()) / 1000)
        wx.showToast({
          title: '今日擦亮成功😝',
          icon: "none"
        })
        break
      case "上架":
        this.update({"status":0})
        break
      case "下架":
        this.update({"status":-1})
        break
      case "改价":
        this.setData({
          changePrice: true
        })
        break
      case "审核s":{
        console.log("过审")
        let data={
          itemId:this.data.itemId,
          state:1
        }
        this.verify(data)
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
  },

  changePrice() {
    this.update({"price":this.data.newPrice})
  },

  priceInput(e) {
    this.data.newPrice = Number(e.detail.value)
  },

  delFile(fileIDs = []) {
    if (!fileIDs) return
    let MyFile = new wx.BaaS.File()
    MyFile.delete(fileIDs).then()
  },

  delGoods(recordID) {
    if (!recordID) return
    let Product = new wx.BaaS.TableObject(tableName)
    Product.delete(recordID).then(res => {
      wx.showToast({
        title: '删除成功！',
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/Life/oldthings/index',
        })
      }, 1000)
    }, err => {
      wx.showToast({
        title: '删除失败',
        icon: 'none',
      })
    })
  },

  async update(value) {
    let itemId=this.data.itemId
    value.itemId=itemId
    console.log(value)
    let res=await FleaMarket.patchGood(value)
    if(res.error_code==0){
      console.log('s')
      wx.showToast({
        title: '修改成功',
        icon:"success"
      })
      this.getDetail()
    }
    console.log(res)
  },

  async verify(value) {
    let res=await FleaMarket.verify(value)
    if(res.error_code==0){
      console.log('s')
      wx.showToast({
        title: '操作成功',
        icon:"success"
      })
      this.getDetail()
    }
    console.log(res)
  },


  // ===============管理员检查============

  // 判断当前用户是否管理员
  checkAdmin() {
    checkPermission().then(res=>{
      console.log(res)
      that.setData({
        isAdmin: res.admin
      })
    })
  },
})
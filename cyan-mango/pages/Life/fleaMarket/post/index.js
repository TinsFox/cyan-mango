import { uploadFile, delFile } from '../../filePost'
import { FleaMarketModel } from '../../fleaMarket/fleaMarket'
import { product } from "../data"
var Config=require("../../../../utils/config")
var FleaMarket = new FleaMarketModel()
import {checkPermission}from "../../../../utils/tools/permission"

let app = getApp()
Page({

  data: {
    success: false, //用于发布超时检测
    loading: false,
    imgList: [], //临时图片地址
    label: [],
    category: ["图书文具", "生活用品", "电子产品", "化妆用品", "服装鞋包", "其它"],
    categoryIndex: 5,
    isBuy: false, //是否求购
    hasPhone: false, //是否绑定手机号码
    debounce: false, //防抖
    mode:wx.$getParam('mode'),
  },


  onLoad: function (options) {
    // console.log(product)
  },

  // 不同意，返回上一页
  navBack() {
    wx.navigateBack()
  },

  // 获取用户信息
  userInfoHandler(data) {
    let that = this
  },

  // 添加标签
  labelAdd: function () {
    if (this.data.inputValue == "" || this.data.inputValue == undefined) return
    if (this.data.label.length == 3) {
      wx.showToast({
        title: '最多加3个标签',
        icon: "none"
      })
      return
    }
    this.setData({
      label: this.data.label.concat(this.data.inputValue),
      inputValue: ""
    })
  },
  // 删除标签
  labelDel(e) {
    let id = Number(e.target.id)
    this.data.label.splice(id, 1)
    this.setData({
      label: this.data.label
    })
  },
  // 读取标签内容
  labelInput: function (e) {
    this.data.inputValue = e.detail.value
  },

  // 求购开关
  switchBuy(e) {
    this.setData({
      isBuy: e.detail.value
    })
    if (e.detail.value) {
      wx.showToast({
        title: '发布求购',
        icon: "none"
      })
      this.setData({
        label: this.data.label.concat("求购")
      })
    } else {
      wx.showToast({
        title: '发布二手',
        icon: "none"
      })

      // 删除求购标签
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      this.data.label.remove("求购")
      this.setData({
        label: this.data.label
      })
    }
  },

  // 选择分类
  selectCategory() {
    let that = this
    wx.showActionSheet({
      itemList: this.data.category,
      success(res) {
        that.setData({
          categoryIndex: res.tapIndex
        })
      }
    })
  },
  checkItem(v){
    let that=this
    if (v.title == "" || v.content == "" || v.price == "" || v.phone == "" || v.wechat == "") {
      wx.showToast({
        title: '信息不完整',
        icon: "none"
      })
      return false
    }
    else if (that.data.imgList.length == 0) {
      wx.showToast({
        title: '至少上传一张图片',
        icon: "none"
      })
      return false
    }

   else if (v.phone != "" && !(/^1\d{10}$/.test(v.phone))) {
      wx.showToast({
        title: '手机号格式不正确，请检查！',
        icon: 'none',
        duration: 1500
      })
      return false
    }else{
      return true
    }
  },
  // 违规检测
  formSubmit(e) {
    var that = this
    let v = e.detail.value
    let check=that.checkItem(e.detail.value)
    console.log('信息完整性',check)
    let text = v.title + v.content + v.price + v.phone + v.wechat
    if(check){
      wx.cloud.callFunction({
        name: 'ContentCheck',
        data: {
          msg: text,
        },
        success(res) {
          if (res.result.errCode == 87014) {
            wx.showModal({
              title: '警告',
              content: '您的发布内容包含违规内容',
            })
            return
          }
          that.submit(e)
        }
      })
    }
  },

  // 表单校验提交
  submit: function (e) {
    console.log('学号绑定' , wx.$getPermission("education"))
    if (!wx.$getPermission("education")) {
      wx.showToast({
        title: '未绑定学号',
        icon: "none"
      })
      return
    }

    var that = this
    wx.showModal({
      title: '提示',
      content: '确认立即发布',
      success(res) {
        if (res.confirm) {
          that.setData({
            debounce: true
          })
          let recordData = {
            goodTitle: e.detail.value.title,
            description: e.detail.value.content,
            image: that.data.imgList,
            price: Number(e.detail.value.price),
            phone:e.detail.value.phone,
            wechat: e.detail.value.wechat,
            purchase: that.data.isBuy,
            label: that.data.label,
            affiliation: that.data.categoryIndex,
          }
          console.log(recordData)
          that.saveRecord(recordData)
          // that.saveRecord(product)
        }
      }
    })
  },

  // 保存记录到数据库
  async saveRecord (data) {
    let that = this
    that.setData({
      loading: true
    })
    console.log('发布中')
    let res= await FleaMarket.postGood(data)
    console.log(res)
    if(res.error_code===0){
      that.setData({
        loading: false,
        success: true,
        debounce:false
      })
      wx.showToast({
        title: '发布成功',
      })
      wx.redirectTo({
        url: '/pages/Life/fleaMarket/detail/index?itemId=' + res.data.itemId,
      })
    }else{
      wx.showToast({
        title: '发布失败',
      })
      that.setData({
        loading: false,
        debounce:false
      })
    }
  },

  chooseImage() {
    var that = this
    wx.chooseImage({
      // count: 3 - this.data.imgList.length, //默认9
      count: 1 - this.data.imgList.length, //默认9
      sizeType: ['compressed'],
      sourceType: ['album', "camera"],
      success: (res) => {
        console.log(res)
        // 检查图片是否违规
        res.tempFilePaths.forEach(element => {
          that.checkImage(element)
        })
        res.tempFilePaths.forEach(element => {
          uploadFile('fleaMarket/' + new Date().getTime() + element.match(/\.[^.]+?$/)[0], element).then(res => {
            console.log('成功', res)
            that.setData({
              imgList: that.data.imgList.concat(res)
            })
          }).catch(err => {
            console.log('err', err)
          })
        });
      }
    });
  },

  checkImage(tempFilePaths) {
    var that = this
    wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        img: tempFilePaths,
      },
      success(res) {
        if (res.result.msgR.errCode == 87014) {
          wx.showModal({
            title: '警告',
            content: '您的发布图片包含违规内容',
          })
          that.setData({
            imgList: []
          })
        }
      }
    })
  },

  viewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  deleteImg(e) {
    let index = e.currentTarget.dataset.index
    let file = this.data.imgList[index]
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '留着',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          delFile(file).then(res => {
            console.log(res)
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList
            })
          })
        }
      }
    })
  },
  checkAdmin() {
    var that=this
    checkPermission().then(res=>{
      if(!res.education){
        wx.showModal({
          title:"提示",
          content:"请先绑定教务系统",
          confirmText:"去绑定",
          cancelText:'返回',
          success(res){
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/Setting/login/index',
              })
            }else{
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  checkTimeout(files) {
    let that = this
    setTimeout(function () {
      if (!that.data.success) {
        that.delFile(files)
        that.setData({
          loading: false,
          debounce: false
        })
        wx.showToast({
          title: '响应超时，请检查网络',
          icon: "none"
        })
      } else {
        console.log("发布未超时")
      }
    }, 60 * 1000)
  },
  onShow(){
    this.checkAdmin()
  }

})
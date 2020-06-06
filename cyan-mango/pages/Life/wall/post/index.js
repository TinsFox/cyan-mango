const iconCamera = "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/xiangji.svg"
const avatar = "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/anonmous_avatar.png"
import { uploadFile, delFile, tabs } from '../../filePost'
import { WallModel} from "../wall"
var Wall = new WallModel()
Page({
  data: {
    mode: "prod",
    tabs: tabs,
    currentTab: 0,
    iconCamera: iconCamera,
    avatar: avatar,
    title: "",
    content: "",
    anonymous: false,
    anonymity: "",
    imgList: [],
    label: [],
    addi: {
      file_ids: [],
      contact: "",
      remark: ""
    },
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

  onLoad: function (options) {

    if (this.fake()) return

    // 切换Tab
    let name = options.id
    let e = {
      detail: {
        index: 0
      }
    }
    for (let i in tabs) {
      if (tabs[i].name == name) {
        e.detail.index = i
      }
    }
    this.tabChange(e)
  },

  // true 说明在防抖期间，应该停止执行
  isDebounce(timeout = 2000) {
    let that = this
    if (this.data.debounce) {
      console.log("触发防抖")
      wx.showToast({
        title: '请勿重复提交',
      })
      return true
    }
    this.data.debounce = true
    setTimeout(() => {
      that.data.debounce = false
    }, timeout)
    return false
  },

  post() {
    if (this.isDebounce(5000)) return
    this.checkAndSave()
  },

  checkAndSave() {
    let form = {
      type: this.data.tabs[this.data.currentTab].name,
      title: this.data.title,
      content: this.data.content,
      image: this.data.imgList,
      label: this.data.label,
      anonymous: this.data.anonymous,
      addi: this.data.addi,
    }

    if (form.anonymous) {
      form.anonymity = this.data.anonymity
      if (form.anonymity == "") {
        form.anonymity = "匿名童鞋"
      }
    }
    if (form.title == "" || form.content == "") {
      wx.showToast({
        title: '标题/内容不能为空',
        icon: "none",
      })
      return
    }
    console.log(form)

    this.setData({
      loading: true
    })

    // if (this.data.imgList.length == 0) {
      
    //   return
    // }
    this.saveRecord(form)
  },

  async saveRecord(form = {}) {
    console.log('save')
    if (typeof form != "object") {
      console.error("error in form type")
      return
    }
    // prest 不能直接处理jsonb需要转字符串
    form.addi = JSON.stringify(form.addi)
    console.log("表单数据", form)
    // 保存数据
    let res=await Wall.postWall(form)
    console.log(res)
    if(res.error_code==0){
      wx.showToast({
        title: '发布成功',
        icon:"success"
      })
      this.setData({
        loading:false
      })
      // Todo:跳转详情
      wx.navigateTo({
        url: '/pages/Life/wall/detail/index?itemId='+res.data.itemId,
      })
    }else{
      this.setData({
        loading:false
      })
    }
  },


  // 添加标签
  labelAdd: function () {
    if (this.data.labelInput == "" || this.data.labelInput == undefined) {
      wx.showToast({
        title: '请先输入标签内容',
        icon: "none"
      })
      return
    }
    if (this.data.label.length == 3) {
      wx.showToast({
        title: '最多加3个标签',
        icon: "none"
      })
      return
    }
    this.setData({
      label: this.data.label.concat(this.data.labelInput),
      labelInput: ""
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
    this.data.labelInput = e.detail.value
  },

  /*
   * 伪双向绑定
   * wxml input 定义属性：data-field="field1.field2" value="{{field1.field2}}"
   * 输入内容将绑定到：this.data.field1.field2 = e.detail.value
   */
  inputBind(e) {
    if (typeof e.currentTarget.dataset.field != "string") return
    let field = e.currentTarget.dataset.field
    // console.log("数据绑定：key：", field, " value:", e.detail.value)

    let data = {}
    data[field] = e.detail.value
    this.setData(data)
  },

  tabChange(e) {
    if (this.data.tabs[e.detail.index].name == "二手") {
      wx.requestSubscribeMessage({
        tmplIds: ['qLHNGkbqbElfJWcdohnaZpvGAtuFGiqNnDmi-Cgrs6w'],
        success (res) {
          console.log(res)
         }
      })
      wx.$navTo("/pages/Life/fleaMarket/post/index")
      return
    }

    // 切换tab，删除多余的图片
    if (this.data.imgList.length >= this.data.tabs[e.detail.index].imageNum) {
      this.data.imgList = this.data.imgList.slice(0, this.data.tabs[e.detail.index].imageNum)
    }

    this.setData({
      currentTab: e.detail.index,
      anonymous: this.data.tabs[e.detail.index].anonymous,
      imgList: this.data.imgList,
      hideAddBtn: this.data.imgList.length >= this.data.tabs[e.detail.index].imageNum ? true : false,
      curImgIndex: 0,
    })
  },

  anonymousSwitch(e) {
    this.setData({
      anonymous: e.detail.value
    })
  },
  tapMore() {
    this.setData({
      openMore: this.data.openMore ? false : true
    })
  },


  chooseImage() {
    let that=this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'],
      sourceType: ['album', "camera"],
      success: (res) => {
        that.checkImage(res.tempFilePaths)
        res.tempFilePaths.forEach(element => {
          that.checkImage(element)
        })
        // TODO:修改图片上传的时机
        res.tempFilePaths.forEach(element => {
          uploadFile('wall/' + new Date().getTime() + element.match(/\.[^.]+?$/)[0], element).then(res => {
            console.log('成功', res)
            that.setData({
              imgList: that.data.imgList.concat(res)
            })
          }).catch(err => {
            console.log('err', err)
          })
        })
      }
    });
  },

  checkImage(tempFilePaths = []) {
    var that = this
    for (let i = 0; i < tempFilePaths.length; i++) {
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
    }
  },

  viewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  deleteImage(e) {
    let that=this
    let file = that.data.imgList[e.currentTarget.dataset.index]
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '留着',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          wx.showLoading()
          delFile(file).then(res=>{
            wx.hideLoading()
            that.data.imgList.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              imgList: that.data.imgList,
              curImgIndex: (e.currentTarget.dataset.index - 1) < 0 ? 0 : (e.currentTarget.dataset.index - 1),
              hideAddBtn: that.data.imgList.length >= that.data.tabs[that.data.currentTab].imageNum ? true : false
            })
          })
        }
      }
    })
  },

})
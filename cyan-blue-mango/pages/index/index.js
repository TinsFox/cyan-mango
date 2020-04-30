import param from '../../utils/param'
var Config = require("../../utils/config")
var Setting = require("../../utils/setting")
const app = getApp()
Page({

  data: {
    gridCol: 4,
    nav: [],
    schedule: false,
    navColor: "rgba(255, 255, 255, 0.8)",
    showDrawer: false,
    arrowUrl: "https://cos.ifeel.vip/gzhu-pi/images/icon/right-arrow.svg",
    out: "ami",
    showUpdate: false
  },
  switchModel() {
    if (this.data.schedule) {
      this.setData({
        schedule: !this.data.schedule,
        navColor: "",
      })
    } else {
      this.setData({
        schedule: !this.data.schedule,
        navColor: "rgba(221, 221, 221, 0.7)",
      })
    }

  },
  // 打开抽屉弹窗
  openDrawer() {
    this.setData({
      showDrawer: true,
      // userInfo: wx.getStorageSync("ifx_baas_userinfo")
    })
  },
  // 抽屉选项
  tapDrawer(e) {
    let drawerItem = e.currentTarget.id
    const schedule = this.selectComponent('#schedule')
    switch (drawerItem) {
      case "changeBg":
      case "changeMode":
        this.setData({
          drawerItem: drawerItem == this.data.drawerItem ? null : drawerItem,
          checkedBlur: Config.get("blur"),
          mode: Config.get("schedule_mode")
        })
        break
      case "selectImg":
        Setting.setBg().then(res => {
          Config.set("schedule_bg", res)
          schedule.updateBg()
        })
        break
      case "white,white":
      case "#ddd,#ddd":
      case "#d299c2,#fef9d7":
      case "#a8edea,#fed6e3":
        Config.set("schedule_bg", drawerItem)
        schedule.updateBg()
        break
      case "navToAbout":
        wx.navigateTo({
          url: '/pages/about/about',
        })
        break
      case "navToSync":
        wx.navigateTo({
          url: "/pages/Setting/login/sync",
        })
        break
      case "navToHelp":
        wx.navigateTo({
          url: "/pages/Setting/help/help",
        })
        break
      case "navToBind":
        wx.navigateTo({
          url: "/pages/index/setting/login",
        })
        break
    }
  },
  clickGrids(e) {
    // console.log(e.currentTarget.dataset.url)
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
      complete: res => {
        console.log(res)
      }
    })
  },


  onLoad: function (options) {
    this.setData({ nav: param.nav })
  },

  onReady: function () {

  },

  onShow: function () {

  },


  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})
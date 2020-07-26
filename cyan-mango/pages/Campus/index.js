// cyan-mango/Campus/index.js
var Config = require("../../utils/config");
var Setting = require("../../utils/setting");
var app = getApp();
import {
  checkPermission
} from "../../utils/tools/permission";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconList: [],
    schedule: Config.get("schedule_mode") == "week" ? true : false,
    navColor: Config.get("schedule_mode") == "week" ?
      "rgba(221, 221, 221, 0.7)" :
      "rgba(255, 255, 255, 0.8)",
    showDrawer: false,
    arrowUrl: "https://cos.ifeel.vip/gzhu-pi/images/icon/right-arrow.svg",
    permission: "",
  },

  switchModel() {
    if (this.data.schedule) {
      this.setData({
        schedule: !this.data.schedule,
        navColor: "",
      });
    } else {
      /**
       * 详细的课程表--周
       */
      this.setData({
        schedule: !this.data.schedule,
        navColor: "rgba(221, 221, 221, 0.7)",
      });
    }
  },
  // 打开抽屉弹窗
  openDrawer() {
    this.setData({
      showDrawer: true,
    });
  },
  tapDrawer(e) {
    let drawerItem = e.currentTarget.id;
    const schedule = this.selectComponent("#schedule");
    switch (drawerItem) {
      case "changeBg":
      case "changeMode":
        this.setData({
          drawerItem: drawerItem == this.data.drawerItem ? null : drawerItem,
          checkedBlur: Config.get("blur"),
          mode: Config.get("schedule_mode"),
        });
        break;
      case "selectImg":
        Setting.setBg().then((res) => {
          Config.set("schedule_bg", res);
          schedule.updateBg();
        });
        break;
      case "white,white":
      case "#ddd,#ddd":
      case "#d299c2,#fef9d7":
      case "#a8edea,#fed6e3":
        Config.set("schedule_bg", drawerItem);
        schedule.updateBg();
        break;
      case "navToAbout":
        wx.navigateTo({
          url: "/pages/about/about",
        });
        break;
      case "navToSync":
        wx.navigateTo({
          url: "/pages/index/setting/sync/sync",
        });
        break;
      case "navToHelp":
        wx.navigateTo({
          url: "/pages/Setting/help/help",
        });
        break;
      case "navToBind":
        wx.navigateTo({
          url: "/pages/Setting/login/index",
        });
        break;
      case "navToControl":
        wx.navigateTo({
          url: "/pages/Setting/admin/flea_market/index",
        });
    }
  },
  // 开启关闭高斯模糊
  switchChange(e) {
    if (e.detail.value) Config.set("blur", 8);
    else Config.set("blur", 0);
    const schedule = this.selectComponent("#schedule");
    schedule.updateBg();
  },
  // 切换课表模式
  radioChange(e) {
    Config.set("schedule_mode", e.detail.value);

    if (e.detail.value == "day") this.data.schedule = true;
    else this.data.schedule = false;
    this.switchModel();
  },
  getAppParam() {
    let that = this;
    wx.cloud
      .callFunction({
        name: "getAppParam",
        data: {},
      })
      .then((res) => {
        // console.log(res.result.errMsg)
        if (res.result.errMsg == "collection.get:ok") {
          let param = res.result.data[0].data;
          this.setData({
            iconList: param.nav,
          });
        }
      })
      .catch(console.error);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.getAppParam();
    that.setData({
      permission: app.globalData.auth,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      schedule: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  navBack(e) {
    this.setData({
      schedule: false,
      navColor: "",
    })
  }
});
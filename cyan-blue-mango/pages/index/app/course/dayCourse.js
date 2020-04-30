var utils = require("../../../../utils/util")
var showTimes = 0
const app = getApp()
Component({

  properties: {

  },

  data: {
    todayCourse: utils.getTodayCourse(),
    week: utils.getSchoolWeek(), //周数
    schoolWeek: utils.getSchoolWeek(), //校历周
    weekDays: ['日', '一', '二', '三', '四', '五', '六', ],
    weekday: new Date().getDay()
  },

  methods: {
    nav() {
      wx.navigateTo({
        url: '/pages/index/setting/login',
      })
    },


  },

  lifetimes: {
    attached: function() {
      // console.log(app.checkBindStatus())
      let that = this
      that.setData({
        account: app.checkBindStatus()
      })
    },
  },
  pageLifetimes: {
    show() {
      // 初次onshow不执行
      if (showTimes) {
        this.setData({
          todayCourse: utils.getTodayCourse()
        })
      }
      showTimes++
    }
  }
})
var utils = require("../../../../../utils/util")
const amap = require('../../../../../utils/tools/amap-wx')
var showTimes = 0
const app = getApp()
Component({
  properties: {
    bind: {
      type: Boolean,
      value: false
    }
  },

  data: {
    todayCourse: utils.getTodayCourse(),
    week: utils.getSchoolWeek(), //周数
    schoolWeek: utils.getSchoolWeek(), //校历周
    weekDays: ['日', '一', '二', '三', '四', '五', '六', ],
    weekday: new Date().getDay(),
    amapPlugin: null,
    key: "6799b5f6f88d3d9fb52ac244855a8759",
    obj: {}
  },

  methods: {
    nav() {
      wx.navigateTo({
        url: '/pages/Setting/login/index',
      })
    },
    //获取天气数据
    getWeather: function () {
      this.data.amapPlugin.getWeather({
        success: (data) => {
          this.setData({
            obj: data
          })
        },
        fail: function (info) {
          console.log(info)
        }
      })
    },
  },

  lifetimes: {
    attached: function () {
      let that = this
      that.setData({
        todayCourse: utils.getTodayCourse(),
        hasCourse: utils.getTodayCourse().length == 0 ? false : true
      })
      // console.log('课？',this.data.hasCourse)
      that.setData({
        amapPlugin: new amap.AMapWX({
          key: this.data.key
        })
      }, () => {
        this.getWeather()
      })
    },
  },
  pageLifetimes: {
    show() {
      this.setData({
        todayCourse: utils.getTodayCourse()
      })
      console.log(this.data)
      // console.log('今日课程',this.data.todayCourse)
      // 初次onshow不执行
      // if (showTimes) {
      //   this.setData({
      //     todayCourse: utils.getTodayCourse()
      //   })
      //   console.log('今日课程',this.data.todayCourse)
      // }
      // showTimes++
    }
  }
})
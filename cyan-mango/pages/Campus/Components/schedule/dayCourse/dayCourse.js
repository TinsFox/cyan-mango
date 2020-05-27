var utils = require("../../../../../utils/util")
const amap = require('../../../../../utils/tools/amap-wx')
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
    weekday: new Date().getDay(),
    amapPlugin: null,
    key: "6799b5f6f88d3d9fb52ac244855a8759",
    obj:{}
  },

  methods: {
    nav() {
      wx.navigateTo({
        url: '/pages/Setting/login/index',
      })
    },
      //获取天气数据
  getWeather:function(){
    wx.showLoading({
      title: '请稍候...'
    })

    // type：天气的类型。默认是live（实时天气），可设置成forecast（预报天气）。
    // city：城市对应的adcode，非必填。为空时，基于当前位置所在区域。 如：440300，返回深圳市天气
    // success(data) ：调用成功的回调函数。
    // fail(info) ：调用失败的回调函数。
    this.data.amapPlugin.getWeather({
      success: (data) =>{
        //成功回调
        //console.log(data)
        wx.hideLoading()
        this.setData({
          obj:data
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },


  },

  lifetimes: {
    attached: function() {
      let that = this
      that.setData({
        account: wx.$getPermission('education'),
        todayCourse: utils.getTodayCourse(),
        hasCourse:utils.getTodayCourse().length==0?false:true
      })
      // console.log('课？',this.data.hasCourse)
      that.setData({
        amapPlugin: new amap.AMapWX({
          key: this.data.key
        })
      },()=>{
        this.getWeather()
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
        console.log(this.data.todayCourse)
      }
      showTimes++
    }
  }
})
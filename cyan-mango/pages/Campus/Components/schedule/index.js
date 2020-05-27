var utils = require("../../../../utils/util")
var Data = require("./data")
var Config = require("../../../../utils/config")
var showTimes = 0
import { courseModel } from './scheduleModel'
var course = new courseModel()
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },

  data: {
    hideTimeLine: true,
    showDetail: false,
    current: 1,
    dis: "none",
    today: new Date().getDate(), //日期
    week: utils.getSchoolWeek(), //周数
    schoolWeek: utils.getSchoolWeek(), //校历周
    weekDate: utils.setWeekDate(), //一周日期
    bg: Config.get("schedule_bg"), // 获取背景
    blur: Config.get("blur"), //高斯模糊

    weekDays: Data.weekDays,
    timeLine: Data.timeLine,
    colors: Data.colors,
    kbList: Data.course_sample
  },

  methods: {
    async getCourse(week) {
      let postWeek = week?week:utils.getSchoolWeek()
      let res = await course.getCourse({week:postWeek})
      // console.log(res)
      if(res.error_code==0){
        this.setData({
          kbList: res.data.schedule
        })
        wx.setStorageSync('course', this.data.kbList)
        if (!res.data) {
          try {
            let w = wx.getStorageSync('course')
            this.setData({
              kbList: w ? w : Data.course_sample
            })
          } catch (e) {
  
          }
        }
      }
    },
    // 恢复校历周
    resetWeek() {
      let week = utils.getSchoolWeek()
      this.setData({
        week: week,
        weekDate: utils.setWeekDate(),
      })
      wx.showToast({
        title: "校历 " + String(week) + " 周",
        icon: "none",
        duration: 1000
      })
    },
    // 左右滑动切换周数
    switchWeek(e) {
      let value = e.detail.current - this.data.current
      let week
      if (value == 1 || value == -2) {
        // 下一周
        if (this.data.week + 1 > 20) {
          week = 0
        } else if (this.data.week < 0) {
          week = 1
        } else {
          week = this.data.week + 1
        }
      } else {
        // 上一周
        if (this.data.week - 1 < 0) {
          week = 20
        } else {
          week = this.data.week - 1
        }
      }

      if (week < 1 && this.data.schoolWeek < 1) {
        console.log(1)
        this.setData({
          week: week,
          current: e.detail.current,
        })
      } else if (this.data.schoolWeek < 1) {
        console.log(2)
        this.setData({
          weekDate: utils.setWeekDate(week),
          week: week,
          current: e.detail.current,
        })
      } else {
        console.log(3)
        this.setData({
          weekDate: utils.setWeekDate(week - this.data.schoolWeek),
          week: week==0?utils.getSchoolWeek():week,
          current: e.detail.current,
        })
      }

      wx.showToast({
        title: "第 " + String(week) + " 周",
        icon: "none",
        duration: 1000
      })
      this.getCourse(week)
    },
    // 展开时间轴
    tapSlideBar() {
      this.setData({
        hideTimeLine: !this.data.hideTimeLine,
      })

      // 修改时间轴不展开
      let tips = Config.get("tips")
      tips.time_line = false
      Config.set("tips", tips)
    },

    // 课程详情弹窗
    showDetail(e) {
      let that = this
      let id = Number(e.currentTarget.id)
      let day = this.data.kbList[id].weekday
      let start = this.data.kbList[id].start
      let detail = [this.data.kbList[id]]
      // 遍历课表，找出星期和开始节相同的课程
      this.data.kbList.forEach(function (item) {
        if (item.weekday == day && item.start == start) {
          if (that.data.kbList.indexOf(item) != id) detail.push(item)
        }
      })
      this.setData({
        detail: detail,
        showDetail: true,
        currentIndex: 0 //恢复滑动视图索引
      })
      this.showCourseId(0)
    },
    // 左右滑动切换课程
    switchCourse(e) {
      this.showCourseId(e.detail.current)
    },
    // 打开或者切换时更新显示的课程数组索引
    showCourseId(current) {
      let course = this.data.detail[current]
      for (let i = 0; i < this.data.kbList.length; i++) {
        if (course == this.data.kbList[i]) {
          this.data.openTarget = i
        }
      }
    },

    // 关闭课程详情弹窗
    cancelModal() {
      this.setData({
        showDetail: false,
      })
    },

    // 编辑课表
    navTo(e) {
      switch (e.currentTarget.id) {
        case "0": //编辑
          wx.navigateTo({
            url: '/pages/Campus/home/addCourse/addCourse',
          })
          break
        case "1": //添加
          wx.navigateTo({
            url: '/pages/Campus/evaluation/evaluation',
          })
          break
        case "2": //删除
          this.deleteCourse()
          break
      }
    },

    // 删除课程
    deleteCourse() {
      let that = this
      let id = this.data.openTarget
      let obj = wx.getStorageSync('course')
      if (obj == "") return
      obj.course_list.splice(id, 1)
      wx.showModal({
        title: '提醒',
        content: '是否删除当前课程?',
        success: function (e) {
          if (e.confirm) {
            wx.setStorage({
              key: 'course',
              data: obj,
              success: function () {
                that.setData({
                  kbList: obj.course_list,
                  showDetail: false,
                })
              }
            })
          }
        }
      })
    },

    // 更新背景视图使用
    updateBg() {
      this.setData({
        bg: Config.get("schedule_bg"),
        blur: Config.get("blur"),
      })
    },
    viewUpdate() {
      let course = wx.getStorageSync('course')
      let exp = wx.getStorageSync('exp')
      if (course != "" || exp != "") {
        let kbList = course == "" ? [] : course.course_list
        if (Config.get("showExp")) {
          kbList = kbList.concat(exp)
        }
        this.setData({
          kbList: kbList,
          sjkList: course == "" ? [] : course.sjk_course_list
        })
      }
    }
  },

  lifetimes: {
    created: function () {
    },

    attached: function () {
      this.getCourse()
      // this.viewUpdate()
    },

    ready: function () { }
  },

  pageLifetimes: {
    show() {
      // 初次onshow不执行
      if (showTimes) {
        this.viewUpdate()
      }
      showTimes++
    }
  }

})
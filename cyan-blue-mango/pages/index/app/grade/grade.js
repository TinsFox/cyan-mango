import { GradeModel } from './gradeModel'
var Data = require("../../../../utils/data")
const app = getApp()
var grade = new GradeModel()
let height = 360
Page({

  data: {
    hideSyncTip: true,
    refleshTimes: 0,
    showTips: false,
    current_term:true,
    colors: Data.colors,
    current:0
  },

  onLoad: function (options) {

    wx.showLoading({
      title: 'loading...',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 2000);
    // this.getGrade()
    // this.putExamHistory()
    // this.getExamHistory()
    this.postExamHistory()
  },
  showDetail(e) {
      let that = this
      let id = Number(e.currentTarget.id)
      if(that.data.current_term){
        let detail = [this.data.grade.score[id]]
        that.setData({
          detail: detail,
          showDetail: true
        })
      }else{
        console.log('历史成绩')
        let detailList = [this.data.grade[this.data.current]]
        let detail = [detailList[0].score[id]]
        console.log(this.data.current)
        console.log(detailList[0].score[id])
        that.setData({
          detail: detail,
          showDetail: true
        })
      }
    },
  getGrade(){
    let that = this
    // 从缓存读取成绩
    wx.getStorage({
      key: 'grade',
      success: function (res) {
        console.log("成绩", res)
        let height = 350
        if (!res.data.sem_list[0] || !res.data.sem_list[0].grade_list) return
        if (res.data.sem_list[0].grade_list.length) {
          height = height + res.data.sem_list[0].grade_list.length * 175
        }
        that.setData({
          grade: res.data,
          height: height
        }, () => {
          wx.hideLoading()
        })
      },
      fail: function (res) {
        that.updateGrade()
      }
    })
  },

  onShow: function () {
    this.data.account = wx.getStorageSync("account")
    var time = new Date()
    if (time.getHours() >= 0 && time.getHours() < 7) {
      this.setData({
        hideSyncTip: false
      })
    }
  },

  // 切换学期
  swiperChange(e) {
    let current = e.detail.current
    let length = this.data.grade[current].score.length
    this.setData({
      height: length * 170 + 350,
      all_credit:this.data.grade[current].all_credit,
      ave_point:this.data.grade[current].ave_point,
      current:current
    })
  },

  // 更新成绩
  updateGrade() {
    var time = new Date()
    if (time.getHours() >= 0 && time.getHours() < 7) {
      wx.showToast({
        title: '当前时间段不可用~',
        icon: "none"
      })
      return
    }
    // 防止频繁刷新
    if (this.data.refleshTimes) {
      setTimeout(function () {
        wx.stopPullDownRefresh()
      }, 2000)

      wx.showToast({
        title: '刚刚更新过啦~',
        icon: "none",
        duration: 1800,
      })
      return
    }
    this.data.refleshTimes++;
    this.syncData()
  },

  // 获取历史成绩数据
  async getExamHistory(){
    let res = await grade.getExamHistory()
    console.log(res.data)
    
      this.setData({
        grade:res.data,
        current_term:!this.data.current_term,
        height : height + res.data[0].score.length * 170,
        all_credit:res.data[0].all_credit,
        ave_point:res.data[0].ave_point
      })
  },
  // 更新成绩数据
  async putExamHistory(){
    console.log('putExamHistory')
    let res = await grade.putExamHistory()
    console.log(res)
  },
  // 获取某一学期数据
  async postExamHistory(){
    console.log('postExamHistory')
    let data = {
      'start':'2019',
      'end':'2020',
      'term':1
    }
    let res = await grade.postExamHistory(data)
    console.log(res.data)
    this.setData({
      grade:res.data,
      height : height + res.data.score.length * 170+50
    })
  },

  // 同步数据
  async syncData() {
    let that = this
    this.iconAnimation()
    this.setData({
      loading: true
    })
    let res = await grade.score()
    console.log(res)
    that.setData({
      loading: false,
      grade: res.data,
    })
    clearInterval(that.data.num)
  },

  // 图标旋转动画
  iconAnimation() {
    let that = this
    let n = 1

    function ami(n) {
      let animation = wx.createAnimation({
        duration: 1500,
        timingFunction: 'linear'
      })
      animation.rotate(18 * n).step()
      that.setData({
        animation: animation.export()
      })
    }
    this.setData({
      num: setInterval(function () {
        ami(n)
        n++
      }, 150)
    })
  },

  onShareAppMessage: function () {
    return {
      title: '成绩查询',
      desc: '',
      // path: '路径',
      imageUrl: "https://cos.ifeel.vip/gzhu-pi/images/pic/grade.png",
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: "none"
        })
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.updateGrade()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000)
  },

})
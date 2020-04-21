import { GradeModel } from './gradeModel'
const app = getApp()
var grade = new GradeModel()
Page({

  data: {
    hideSyncTip: true,
    refleshTimes: 0,
    showTips: false,
  },

  onLoad: function (options) {

    wx.showLoading({
      title: 'loading...',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 2000);
    this.getGrade()
    // this.putExamHistory()
    // this.getExamHistory()
    // this.postExamHistory()
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
          height = height + res.data.sem_list[0].grade_list.length * 170
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
    // console.log(e)
    let current = e.detail.current
    // console.log(current)
    let length = this.data.grade[current].score.length
    this.setData({
      height: length * 170 + 350
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

  async getExamHistory(){
    let res = await grade.getExamHistory()
    console.log(res.data)
    let height = 350
      this.setData({
        grade:res.data,
        height : height + res.data[0].score.length * 170
      })
  },
  async putExamHistory(){
    console.log('putExamHistory')
    let res = await grade.putExamHistory()
    console.log(res)
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
    // wx.$ajax({
    //     url: "/jwxt/grade",
    //     data: this.data.account,
    //   })
    //   .then(res => {
    //     if (res.data.sem_list) {
    //       // 缓存成绩信息
    //       wx.setStorage({
    //         key: "grade",
    //         data: res.data,
    //       })
    //       let height = 350
    //       if (res.data.sem_list[0].grade_list.length) {
    //         height = height + res.data.sem_list[0].grade_list.length * 170
    //       }
    //       that.setData({
    //         loading: false,
    //         grade: res.data,
    //         height: height
    //       })
    //     } else {
    //       that.setData({
    //         loading: false
    //       })
    //     }
    //     wx.showToast({
    //       title: '更新完成 ~~ ',
    //       icon: "success",
    //       duration: 1500,
    //     })
    //     clearInterval(that.data.num) // 停止动画
    //     wx.stopPullDownRefresh()
    //   })
    //   .catch((e) => {
    //     clearInterval(that.data.num) // 停止动画
    //     wx.stopPullDownRefresh()
    //     this.setData({
    //       loading: false
    //     })
    //   })
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
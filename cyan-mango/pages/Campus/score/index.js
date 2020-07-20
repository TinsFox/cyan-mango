import {
  GradeModel
} from './score'
import {
  config
} from '../../../utils/config'
// var Data = require("../../../../utils/setting/data")
const app = getApp()
var grade = new GradeModel()
let height = 360

Page({
  data: {
    modal_title: '',
    grade_index: '',
    showDrawer: false,
    loading: false,
    hasGrade: false,
    refleshTimes: 0,
    showTips: false,
    current_term: true,
    current: 0,
    showDetail: false,
    showModal: false,
    grade: '',
    sem_list: [],
    bg_color: ['bg-grey', 'bg-brown', 'bg-yellow', 'bg-mauve', 'bg-cyan', 'bg-green'],
    color: ["gradual-red", "gradual-orange", "gradual-green", "gradual-blue", "gradual-purple", "gradual-pink"],
    // flagColor: ["#f43f3b", "#FA8072", "#FFFBE5", "#D8BFD8", "#AFEEEE", "#AFEEEE"]
  },
  confirm() {
    this.setData({
      showDrawer: true
    })
  },
  showDetail(e) {
    let index = e.currentTarget.id
    this.setData({
      showDetail: true,
      detail: this.data.grade.score[index]

    })
  },
  showModal(e) {
    this.setData({
      index: this.data.grade_index,
      showModal: true,
      grade: this.data.grade,
    })
  },
  // 打开侧边栏
  showItem() {
    this.setData({
      showDrawer: true
    })
    let semester = wx.getStorageSync('semester')
    if(semester){
      this.setData({
        sem_list:semester
      })
      return
    }else{
      this.putExamHistory()
    } 
  },
  cancelModal() {

  },
  navBack() {
    wx.navigateBack()
  },
  async getGradeDatail(e) {

    let str = e.currentTarget.dataset.xnd.split("-")
    let data = {
      start: str[0],
      end: str[1],
      term: e.currentTarget.dataset.xqd
    }
    let res = await grade.postGrade(data)

    this.setData({
      grade_index: e.currentTarget.id,
      grade: this.score_sort(res.data),
      hasGrade: true,
      loading: false,
      showDrawer: false
    })
  },
  async updateGrade() {
    // 获取本学期的成绩信息
    this.setData({
      loading: true,
    })
    let res = await grade.score()
    if (res.error_code == 0) {
      this.setData({
        grade: this.score_sort(res.data),
        loading: false,
        hasGrade: true,
      })
    } else if (res.error_code == 1) {
      this.setData({
        current_term: false,
        modal_title: '暂时还未查询到本学期成绩',
        loading: false
      })
    } else if (res.error_code == 4003) {
      /* 权限校验失败 */
      this.setData({
        loading: false
      })
      wx.showModal({
        title: '提示',
        content: res.msg,
        confirmText: '去绑定',
        cancelText: '返回',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Setting/login/index',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        }
      })
    } else {
      let msg = '';
      if(res.error_code == 5250) msg = '暂时无法查询学期成绩';
      else msg = res.msg;
      this.setData({
        loading: false,
        current_term: false,
        modal_title: msg
      })

      
    }
  },
  // 更新数据库
  async putExamHistory() {
    // 所有学期的数据
    this.setData({
      loading: true
    })
    var res = await grade.getExamHistory()
    if (res.error_code == 0) {
      let semester = await grade.semester()
      this.setData({
        loading: false,
        sem_list: semester.data.sort((a,b)=>{
          return a.xnd == b.xnd ? parseInt(b.xqd) - parseInt(a.xqd): parseInt(b.xnd.split('-')[0]) - parseInt(a.xnd.split('-')[0])  
        })
      })
      wx.setStorageSync('semester', this.data.sem_list)
    } else {
      this.setData({
        loading: false
      })
      wx.showModal({
        title: '提示',
        content: res.msg,
        cancelText: '返回',
        success(res) {
          
            wx.navigateBack({
              complete: (res) => {},
            })
          
        }

      })
    }
  },
  score_sort(data) {
    let score = data.score;
    for (var i = 0; i < score.length; i++) {
      let min = i;

      for (var j = i + 1; j < score.length; j++) {
        let n = Number(score[min].grade);
        let m = Number(score[j].grade)
        if (isNaN(n)) {
          if (score[min].grade == '不及格') n = 50;
          else if (score[min].grade == '及格') n = 65;
          else if (score[min].grade == '中等') n = 75;
          else if (score[min].grade == '良好') n = 85;
          else if (score[min].grade == '优秀') n = 95;
          else n = 0;
        }
        if (isNaN(m)) {
          if (score[j].grade == '不及格') m = 50;
          else if (score[j].grade == '及格') m = 65;
          else if (score[j].grade == '中等') m = 75;
          else if (score[j].grade == '良好') m = 85;
          else if (score[j].grade == '优秀') m = 95;
          else m = 0;
        }
        if (n > m) {
          min = j;
        }

      }
      let temp = score[i];
      score[i] = score[min];
      score[min] = temp;
    }
    return data;
  },
  onLoad: function (options) {

  },
  onHide() {
    this.setData({
      loading: false
    })

  },
  onShow: function () {
    var time = new Date()
    if (time.getHours() >= 0 && time.getHours() < 7) {
      this.setData({
        hideSyncTip: false
      })
    }
    this.updateGrade()
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
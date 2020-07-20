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
    // access: true,

    modal_title: '成绩查询',
    tip_content: '',
    tip_error: 0,

    grade_index: '',
    showDrawer: false,
    loading: false,
    hasGrade: false,
    // hideSyncTip: true,
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
  },
  /**
   * 变量放在页面内，页面注销变量也会被注销，全局则保留
   */
  access: true,
  hide_page:false,
  load_semester: false,

  // 绑定的模态弹窗
  confirm() {
    this.putExamHistory()
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
  showItem() {
    if (this.data.hide_page || !this.load_semester){
      this.putExamHistory()
    }
    else{
      this.setData({
        showDrawer: true
      })
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

  /**
   * 对于未使用过该功能的新用户有效。
   * 其它则是获取历史记录。
   * 数据更新，将抓取教务系统的成绩信息并存到数据库
   */
  async putExamHistory() {
    /**
     * 弹窗提示数据加载
     */
    this.setData({
      loading: true
    })

    let res = await grade.semester();
    if(res.error_code == 0){
      /**
       * 数据获取成功，但存在空数据的可能性，新用户
       */
      if(!res.data){
        /**
         * 数据库没有成绩的数据，将抓取教务系统
         */
        let spider = await grade.putExamHistory();
        if(spider.error_code == 0){
          /**
           * 数据获取成功
           */
          let semester = await grade.semester();
          if(semester.error_code == 0){
            /**
             * 重新获取用户的成绩记录
             */
            this.setData({
              loading: false,
              sem_list:this.drawer_sort(semester.data),
              showDrawer: true,
            });
            this.load_semester = true;
          }
          else{
            this.setData({
              loading: false,
              current_term: false,
              tip_error: 500,
              tip_content: "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。"
            })
          }
        }
        else if(spider.error_code == 1){
          /**
           * 大一新生，未产生任何数据的情况
           */
          this.setData({
            loading: false,
            tip_error: 1,
            current_term: false,
            tip_content: "你还未参加任何的考试项目，无法获取到成绩信息。"
          })
        }
        else{
          this.setData({
            loading: false,
            tip_error: 500,
            current_term: false,
            tip_content: "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。"
          })
        }
      }
      else{
        this.setData({
          sem_list: this.drawer_sort(res.data),
          loading: false,
          showDrawer: true,
        });
        this.load_semester = true;
      }
    }
    else{
      /**
       * 异常情况
       */
      this.setData({
        loading: false,
        current_term: false,
        tip_error: 500,
        tip_content: res.msg,
      });
    }
  },

  /**
   * 小程序页面生命周期函数
   */

  onLoad: function (options) {
    /**
     * 页面加载时执行，判断权限
     */

    let rv = wx.getStorageSync('permission');
    if (!rv.education) {
      this.access = false;
    } 
    else {
      this.access = true;
      this.setData({
        loading: true,
      });
      this.getScore();
    }
  },

  onHide() {
    /**
     * 页面隐藏时执行
     */
    this.hide_page = true;
    this.setData({
      loading: false
    })

  },

  onShow: function () {
    if(this.hide_page && !this.access){
      this.hide_page = true;
      this.redirect();
    }
  },
  onReady: function () {
    /**
     * 页面初次渲染被执行
     */
    if (!this.access){
      this.redirect();
    }
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
    // this.updateGrade()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000)
  },


  /**
   * 获取学期的记录
   */
  async getSemester(show_drawer=false) {
    let res = await grade.semester();
    if (res.error_code == 0) {
      this.setData({
        loading: false,
        showDrawer: show_drawer,
        sem_list: this.drawer_sort(res.data),
      });
      this.load_semester = true;
    } else {
      this.load_semester = false;
      this.setData({
        loading: false,
      })
    }
  },

  /**
   * 获取期末成绩信息
   */
  async getScore(){
    let res = await grade.score();
    if(res.error_code == 0){
      this.setData({
        grade: this.score_sort(res.data),
        hasGrade: true,
      })
    }
    else if (res.error_code == 1) {
      this.setData({
        current_term: false,
        tip_content: '教务系统暂时还未发布本学期的成绩信息，暂时无法查询。',
        tip_error: 1,
      })
    } 
    else if(res.error_code == 5250){
      /**
       * 发生重定向，教务系统关闭成绩查询功能
       */
      this.setData({
        current_term: false,
        tip_content: '教务系统成绩查询功能已经被关闭，暂时无法查询。',
        tip_error: 302,
      })
    }
    else{
      this.setData({
        current_term: false,
        tip_content: "服务器发生异常，查询失败，请联系管理员处理。",
        tip_error: 1,
      })
      this.getSemester();
    }
    this.setData({
      loading: false,
    });
  },

  redirect(){
    wx.showModal({
      title: '提示',
      content: '未绑定教务系统，无法访问',
      confirmText: '去绑定',
      cancelText: '返回',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/Setting/login/index',
          })
        } else if (res.cancel) {
          wx.switchTab({
            url: "/pages/Campus/index",
          })
        }
      }
    })
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

  drawer_sort(arry){
    return arry.sort((a, b) => {
      return a.xnd == b.xnd ? parseInt(b.xqd) - parseInt(a.xqd) : parseInt(b.xnd.split('-')[0]) - parseInt(a.xnd.split('-')[0])
    });
  }

})
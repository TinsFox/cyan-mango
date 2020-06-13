import { GradeModel } from './score'
import { config } from '../../../utils/config'
// var Data = require("../../../../utils/setting/data")
const app = getApp()
var grade = new GradeModel()
let height = 360
Page({

  data: {
    showDrawer:false,
    loading:true,
    hasGrade:false,
    hideSyncTip: true,
    refleshTimes: 0,
    showTips: false,
    current_term:true,
    current:0,
    showDetail:false,
    grade:'',
    sem_list:[],
    color:["gradual-red", "gradual-orange", "gradual-green", "gradual-blue", "gradual-purple", "gradual-pink", "gradual-d","gradual-c"],
    flagColor: ["#DCDCDC", "#FA8072", "#FFFBE5", "#D8BFD8", "#AFEEEE","#98FB98"]
  },
  confirm(){
    this.putExamHistory()
    this.setData({
      showDrawer:true
    })
  },
  showDetail(e){
    let index=e.currentTarget.id
    this.setData({
      showDetail:true,
      detail:this.data.grade.score[index]

    })
  },
  showItem(){
    this.setData({
      showDrawer:!this.data.showDrawer
    })
    this.putExamHistory()
  },
  cancelModal(){
    this.setData({
      showDrawer:!this.data.showDrawer
    })
  },
  navBack() {
    wx.navigateBack()
  },
  async getGradeDatail(e){
    let str= e.currentTarget.dataset.xnd.split("-")
    let data={
      start:str[0],
      end:str[1],
      term:e.currentTarget.dataset.xqd
    }
    let res=await grade.postGrade(data)
    console.log('成绩',res)
    this.setData({
      grade:this.score_sort(res.data),
      hasGrade:true,
      loading:false,
      showDrawer:false
    })
  },
  async updateGrade(){
    let res=await grade.score()
    console.log(res)
    if(res.error_code==1){
      this.setData({
        current_term:false,
        loading:false
      })
    }else if(res.error_code==5010){
      this.setData({
        loading: false
      })
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2500,
        mask: true
      })
    }else if(res.error_code==0){
      console.log('本学期成绩',res.data)
      this.setData({
        grade:this.score_sort(res.data),
        loading:false,
        hasGrade:true,
      })
    }
    else if(res.error_code == 4003){
      /* 权限校验失败 */
      this.setData({
        loading: false
      })
      wx.showModal({
        title: '提示',
        content:  res.msg,
        confirmText:'去绑定',
        cancelText:'返回',
        success (res) {
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
    }
    else{
      this.setData({
        loading:false
      })      
    }
  },
  // 更新数据库
  async putExamHistory(){
    this.setData({
      loading:true
    })
    let res = await grade.putExamHistory()
    console.log(res)
    if(res.error_code==0){
      let semester=await grade.semester()
      console.log(semester)
      this.setData({
        loading:false,
        sem_list:semester.data
      })
      wx.setStorageSync('semester', semester.data)
    }else{
      this.setData({
        loading:false
      })
    }
  },
  score_sort(data) {
    let score = data.score;
    for(var i=0; i < score.length; i++){
      let min = i;
      
      for(var j = i+1; j < score.length; j++){
        let n = Number(score[min].grade);
        let m = Number(score[j].grade)
        if(isNaN(n)){
          if (score[min].grade == '不及格') n = 50;
          else if (score[min].grade == '及格') n = 65;
          else if (score[min].grade == '中等') n = 75;
          else if (score[min].grade == '良好') n = 85;
          else if (score[min].grade == '优秀') n = 95;
          else n = 0;
        }
        if(isNaN(m)){
          if (score[j].grade == '不及格') m = 50;
          else if (score[j].grade == '及格') m = 65;
          else if (score[j].grade == '中等') m = 75;
          else if (score[j].grade == '良好') m = 85;
          else if (score[j].grade == '优秀') m = 95;
          else m = 0;
        }
        if ( n > m) {
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
onHide(){

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
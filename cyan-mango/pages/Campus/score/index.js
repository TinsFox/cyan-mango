import { GradeModel } from './score'
import { config } from '../../../utils/config'
// var Data = require("../../../../utils/setting/data")
const app = getApp()
var grade = new GradeModel()
let height = 360
Page({

  data: {
    showDrawer:false,
    showDetail:false,
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
    flagColor:["#666666","#e54d42","#fbbd08","#8dc63f","#0081ff","#39b54a"]
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
      grade:res.data,
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
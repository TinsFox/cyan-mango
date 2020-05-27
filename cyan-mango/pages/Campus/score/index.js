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
    this.setData({
      loading:true
    })
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
      loading:false
    })
  },
  async updateGrade(){
    let res=await grade.score()
    if(res.error_code==1){
      this.setData({
        current_term:false
      })
    }
    console.log(res)
  },
  // 更新数据库
  async putExamHistory(){
    console.log('更新数据库')
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
    }
  },

  onLoad: function (options) {
    this.setData({
      loading:true
    })
    this.updateGrade()
    let flag=wx.getStorageSync('semester')
    if(flag==''){
      this.putExamHistory()
    }else
    this.setData({
      sem_list:flag,
      loading:false
    })
  },
onHide(){
  console.log('hide')
  this.putExamHistory()
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
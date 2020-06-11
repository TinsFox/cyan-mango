// cyan-mango/pages/activity/post/formDesign/index.js
let formTmp = {
  0: '姓名',
  1: '学号',
  2: '学院',
  3: '年级班级',
  4: '联系电话',
  5:'',
  6:'',
  7:'',
  8:''
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: true,
    formTmp: formTmp,
    formLine: 0
  },
  submit(e) {
    console.log(e.detail.value)
    var inputForm = e.detail.value
    console.log('input',inputForm)
    if(this.data.edit==true){
      this.setData({
        edit:!this.data.edit,
        formTmp:inputForm
      })
    }else{
      this.setData({
        edit:!this.data.edit,
        formTmp:this.data.formTmp
      })
    }
  },
  generateForm(){
    try{
      let form=this.clean(this.data.formTmp)
      wx.setStorageSync('collection', form)
    }catch(res){
      console.error(res)
    }finally{
      wx.navigateBack()
    }
  },
  addLine() {
    if (this.data.formLine < 6) {
      this.setData({
        formLine: this.data.formLine + 1
      })
    } else {
      wx.showToast({
        title: '表单过长，请联系管理员定制',
        icon: "none",
        duration: 5000
      })
    }
  },
  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var value = wx.getStorageSync('collection')
      if (value) {
        this.setData({
          formTmp:value
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
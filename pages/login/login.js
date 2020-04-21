// pages/components/form/pages/form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginForm: {
      code:'',
      loginId: '',
      password: '',
      loginIdRules:{
        type: 'email',
        required: true,
        message: '邮箱地址不合法',
        trigger: 'change'
      },
      passwordRules: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 8, max: 20, message: '密码长度在8-20个字符之间', trigger: 'blur' },
        { pattern: '^[A-Za-z0-9]+$', message: '密码必须由数字字母组成',trigger: 'blur'}
      ],
    },
  },
  code(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success (res) {
        // wx.getClipboardData({
        //   success (res) {
        //     console.log(res.data) // data
        //   }
        // })
      }
    })
  },
  submit(data){
    console.log(data.detail.values)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.lin.initValidateForm(this)
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
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        this.setData({
          code:res.code
        })
      }
    })
  },
  re(){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        this.setData({
          code:res.code
        })
      }
    })
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

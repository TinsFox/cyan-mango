import { uploadFile, delFile, tabs } from '../../Life/filePost'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['编辑', '发布', '结束'],
    collectionEdit:false,
    formLine:4,
    imgList: [],
    start_date: '2020-6-25',
    end_date: '2020-6-25',
    action_date: '2020-6-25',
  },
  DateChange(e) {
    // console.log(e.currentTarget.dataset.type)
    switch(e.currentTarget.dataset.type){
      case 'start':{
        this.setData({
          start_date: e.detail.value
        }) ;break;
      }
      case 'end':{
        this.setData({
          end_date: e.detail.value
        }) ;break;
      }
      case 'action':{
        this.setData({
          action_date: e.detail.value
        }) ;break;
      }
      default:console.error('date error')
    }
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  addLine(){
    if(this.data.formLine<10){
      this.setData({
        formLine:this.data.formLine+1
      })
    }else{
      wx.showToast({
        title: '表单过长，请联系管理员定制',
        icon:"none",
        duration:5000
      })
    }
  },
  focus(e){
    console.log(e)
    wx.navigateTo({
      url: './formDesign/index',
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  submit(e){
    let info=e.detail.value
    // TODO:状态先默认为1
    info.status=this.data.index?this.data.index:1
    info.start_date=this.data.start_date
    info.end_date=this.data.end_date
    info.action_date=this.data.action_date
    info.imgList=this.data.imgList
    info.collection=wx.getStorageSync('collection')
    this.checkData(info)
    console.log(info)
    // TODO:信息检查通过，进行发布
    
  },
  checkData(data){
    if(data.name===''||data.club_name	===''||data.desc===''){
      wx.showToast({
        title: '请填写完整',
        icon:'none'
      })
      return
    }
    if(data.imgList.length===0){
      wx.showToast({
        title: '请上传海报',
        icon:'none'
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
import {
  libraryModel
} from '../library'
const library = new libraryModel()
Page({

  data: {
    noCover: "https://cos.ifeel.vip/gzhu-pi/images/icon/book.svg",
    page: 1,
    pages: 1,
    books: [],
    tip: false,
  },
  /**
   * 页面生命周期--页面加载
   */
  onLoad: function (options) {
    this.getBooks({
      keyword: options.query
    })
    this.setData({
      query: options.query
    })
  },
  /**
   * 页面生命周期--页面显示
   */
  onShow: function () {
    let h = 20;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mtop: parseInt((750 * 40) / res.windowWidth) + h,
          nav_height: res.statusBarHeight + 45,
        })
      },
    })
    
  },

  /**
   * 上拉加载数据
   */
  onReachBottom(e) {
    let page = this.data.page + 1
    if (page > this.data.pages) {
      wx.showToast({
        title: '没有更多啦！',
        icon: "none"
      })
    }
    else {
      this.getBooks({
        'keyword': this.data.query,
        'page': page
      })

    }
  },
  /**
   * 表单提交
   * @param {*} e 
   */
  formSubmit(e) {
    var time = new Date()
    if (time.getHours() >= 23 && time.getHours() < 7) {
      wx.showToast({
        title: '当前时间段不可用~',
        icon: "none"
      })
      return
    }
    let query = e.detail.value.query
    if (query == "") {
      wx.showToast({
        title: '请输入书名',
        icon: "none"
      })
      return
    }
    this.setData({
      query: query,
      books: [],
      page: 1
    })
    this.getBooks({
      'keyword': query
    })
  },

  /**
   * 详情页面跳转
   * @param {*} e 
   */
  navToDetail(e) {
    let param = {
      image: e.currentTarget.dataset.image,
      primary_id: e.currentTarget.dataset.primary_id,
      wl_id: e.currentTarget.dataset.wl_id
    }
    wx.navigateTo({
      url: '/pages/Campus/library/list/detail/index?param=' + JSON.stringify(param),
    })
  },

  /**
   * 数据加载
   */
  loadMore() {
    // console.log('下一页')
    let page = this.data.page + 1
    // console.log(page)
    if (page > this.data.pages) {
      wx.showToast({
        title: '没有更多啦！',
        icon: "none"
      })
      return
    }
    this.getBooks({
      'keyword': this.data.query,
      'page': page
    })
  },

  // 发送GET请求
  async getBooks(query, page = 1) {
    let that = this
    that.setData({
      loading: true,
    })
    let res = await library.getBooks(query, page)
    console.log(res)
    if (res.error_code == 0) {
      that.setData({
        loading: false,
        tip: false,
        books: that.data.books.concat(res.data.search),
        pages: res.data.max_page,
        page: res.data.current_page ? res.data.current_page : page,

      })
    } else if (res.error_code == 1) {
      this.setData({
        loading: false,
        tip_error: 0,
        tip: true,
        tip_content: "检索失败，图书馆没有相关书籍。",
      })
    }else if(res.error_code == 5030) {
      this.setData({
        loading: false,
        tip: true,
        tip_error: 1,
        tip_content: res.msg,
        tip_msg: '图书馆的检索页面可能出现故障，请过段时间再来检索。',
      })
    } 
    else {
      this.setData({
        loading: false,
        tip_error: 500,
        tip: true,
        tip_content: res.msg,
        tip_msg: '服务器发生异常，检索失败，请联系管理员处理。',
      })
    }
  },

  /**
   * 跳转顶部
   * @param {*} e 
   */
  scrollPageToTop(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 250,
    })
  },
  /**
   * 跳转到页面底部
   * 存在小bug，跳转的同时加载数据
   * @param {*} e 
   */
  scrollPageToBottom(e) {
    const query = wx.createSelectorQuery();
    query.select('#book-list').boundingClientRect();
    query.exec(function (res) {
      wx.pageScrollTo({
        duration: 250,
        scrollTop: res[0].height,
      })
    })
  },
  redirectToLibrary(e){
    wx.navigateBack()
    // wx.navigateTo({
      // url: '/pages/Campus/library/index',
    // })
  }
})
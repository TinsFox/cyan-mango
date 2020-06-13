import { libraryModel} from '../library'
const library = new libraryModel()
Page({

  data: {
    noCover: "https://cos.ifeel.vip/gzhu-pi/images/icon/book.svg",
    page: 1,
    pages: 1,
    books: []
  },

  onLoad: function(options) {
    this.getBooks({keyword:options.query})
    this.setData({
      query: options.query
    })
  },

  formSubmit(e) {
    var time = new Date()
    if (time.getHours() >= 0 && time.getHours() < 7) {
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
    this.getBooks({'keyword':query})
  },


  navToDetail(e) {
    let param = {
      image:e.currentTarget.dataset.image,
      primary_id:e.currentTarget.dataset.primary_id,
      wl_id:e.currentTarget.dataset.wl_id
    }
    wx.navigateTo({
      url: '/pages/Campus/library/list/detail/index?param=' + JSON.stringify(param),
    })
  },

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
    this.getBooks({'keyword':this.data.query,'page':page})
  },

  // 发送GET请求
  async getBooks(query, page = 1) {
    let that=this
    that.setData({
      loading:true
    })
    let res= await library.getBooks(query,page)
    if(res.error_code==0){
      console.log(res)
      console.log(res.data.current_page)
      that.setData({
        loading:false,
        books: that.data.books.concat(res.data.search),
        pages:res.data.max_page,
        page: res.data.current_page?res.data.current_page:page
      })
    }
    else if (res.error_code == 1){
      this.setData({
        loading: false,
      })
      wx.showToast({
        title: "检索失败，图书馆没有相关书籍",
        icon: "none",
        mask: 2500
      })
    }
    else{
      this.setData({
        loading:false,
      })
      wx.showToast({
        title: "服务异常",
        icon:"none"
      })
    }
  },

})
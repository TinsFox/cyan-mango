const app = getApp();
import apirequest from '../extra'
var api = new apirequest()
Page({
  data: {
    hidden: true,
    list:[]
  },
  onLoad() {
    wx.getSystemInfo({
      success: e => {
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.setData({
            CustomBar:e.statusBarHeight
          })
        } else {
          this.setData({
            CustomBar:e.statusBarHeight
          })
        }
      }
    })
    this.getList()
  },
  getList() {
    api.getRequest("/logistics/type/list", {}, true).then(res => {
      console.log(res)
      this.setData({
        expressList: res.data,
        list:res.data,
        listCur: res.data[0]
      })
    })
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  }
});
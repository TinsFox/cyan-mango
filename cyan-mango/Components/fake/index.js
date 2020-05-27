// components/fake/fake.js
var app=getApp()
Component({

  options: {
    addGlobalClass: true
  },

  properties: {

    type: {
      type: String,
      value: "default"
    },
    mode:{
      type:String,
      value:''
    }

  },


  data: {

    article: [{
      src: "https://mp.weixin.qq.com/s/C5wG5lEnfAAmjcxTvnJbCA",
      cover: "https://mmbiz.qpic.cn/mmbiz_jpg/CzgeOwvINuNbI1rSxibztsq6ibQPdicOD8H8un4g5VSJyNicXmeFEDAh1eHicf1x9ow8icuNVqSa9XqPXGeiaWcDOZp4w/0?wx_fmt=jpeg",
      desc: "想限流？不可以！我要和车速最快的那个在一起！",
      title: "网盘评测",
      date: "2020年2月11日"
    }, {
      src: "https://mp.weixin.qq.com/s/juCFtJ10MWpvpmHuER1-MA",
      cover: "https://mmbiz.qpic.cn/mmbiz_jpg/CzgeOwvINuNZtUD8mogicAeaYzJZnKiaqfmCHrYLpibpxBwN72iaFsLD2nlXicrf7zELUkZkJe5UzDd66jbPKicbiaUKQ/0?wx_fmt=jpeg",
      desc: "不管距离多远 作业永不失联",
      title: "作业1s召唤术",
      date: "2019年10月21日"
    }, {
      src: "https://mp.weixin.qq.com/s/c918S_dMrTGp7LeirODfLg",
      cover: "https://mmbiz.qpic.cn/mmbiz_png/CzgeOwvINuNC4reqGRQFFicdAdxZJhaE6iaWxkqibCYLOUBBBmGSeicULQNK1IiccESticSEZ9NiaME8RPuKTBoaGHLLw/0?wx_fmt=png",
      desc: "看你骨骼惊奇 这有本武功秘籍",
      title: "你要的全拿走",
      date: "2019年8月27日"
    }]

  },

  methods: {

    onTapAdd() {
      wx.showToast({
        title: '请联系派派！',
        icon: "none"
      })
    },

    onTap(e) {
      console.log(e)
      let url = "/pages/Setting/webview/index?src=" + e.currentTarget.dataset.src
      wx.$navTo(url)
    },
    getAppParam() {
      const db = wx.cloud.database()
      db.collection('control').where({
        _id: 'aa9f906d5ec12bfd00f5dc6f4ab2bd32'
      }).get().then(res => {
        console.log(res.data[0].data.mode)
        this.setData({
          mode:res.data[0].data.mode
        })
      })
    },
  },

  // 生命周期方法
  lifetimes: {
    attached: function () {
      switch (this.data.type) {
        case "nav1":
          break
        case "nav1":
          break
        case "nav1":
          break
        default:
      }
    },
    
  },

  pageLifetimes: {
    show() {
      this.setData({
        // fake: wx.$param.mode != "prod" ? true : false //非生产模式启用
        fake: true //非生产模式启用
      })
    },
  }
})
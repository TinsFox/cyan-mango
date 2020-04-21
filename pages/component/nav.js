// pages/component/nav.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    indexmenu: [],
  },
  lifetimes: {
    ready:function() {
      let role = wx.getStorageSync('role')
      this.setData({
        role: role
      })
      this.role()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    role: function () {
      var that = this;
      this.fetchData();
      if (that.data.role !='visitor') {
        var list = that.data.indexmenu;
        list.push({
          'icon': '/images/icon3.png',
          'text': '订单中心',
          'type': 'manage',
          'url': 'order'
        }, {
          'icon': '/images/icon7.png',
          'text': '值班管理',
          'type': 'manage',
          'url': 'duty'
        },
        {
          'icon': '/images/address.png',
          'text': '通讯录',
          'type': 'manage',
          'url': 'address'
        })
        that.setData({
          indexmenu: list
        })
      }
      if (that.data.role ==='leader'|| that.data.role ==='admin') {
        var list = that.data.indexmenu;
        list.push({
          'icon': '/images/icon8.png',
          'text': '系统管理',
          'type': 'manage',
          'url': 'system',
          'value': 'type=manage'
        })
        that.setData({
          indexmenu: list
        })
      }
    },
    fetchData: function () {
      this.setData({
        indexmenu: [{
          'icon': '/images/icon10.png',
          'text': '课室地图',
          'type': 'app',
          'url': 'map'
        },
        {
          'icon': '/images/icon1.png',
          'text': '设备报修',
          'type': 'app',
          'url': 'apply'
        },
        {
          'icon': '/images/icon2.png',
          'text': '我的报修',
          'type': 'app',
          'url': 'myapply'
        },
        {
          'icon': '/images/icon5.png',
          'text': '排障手册',
          'type': 'q2a',
          'url': 'q2a'
        },
        {
          'icon': '/images/icon5.png',
          'text': '小程序指引',
          'type': 'user',
          'url': 'guide'
        }
        ]
      })
    }
  }
})
import {nav} from "./navDate"
Component({

  options: {
    addGlobalClass: true
  },

  properties: {
    iconList:{
      type:Array,
      value:''
    }
  },

  /**
   * Component initial data
   */
  data: {
    gridCol: 4,
    iconList: [],
  },

  /**
   * Component methods
   */
  methods: {
    navTo(e) {
      wx.$navTo(e)
    },
    getAppParam() {
      let that=this
      wx.cloud.callFunction({
        name: 'getAppParam',
        data: {},
      })
      .then(res => {
        // console.log(res.result.errMsg)
        if(res.result.errMsg=='collection.get:ok'){
          let param = res.result.data[0].data
          console.log("nav",param)
          this.setData({
            iconList:param.nav
          })
        }
      })
      .catch(console.error)
    },
  },

  lifetimes: {
    attached: function() {

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
    ready: function() {
      // this.getAppParam()
    }
  },
})
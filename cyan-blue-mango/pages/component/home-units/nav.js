// pages/Components/home-units/nav.js
import param from '../../../utils/param'
Component({

  options: {
    addGlobalClass: true
  },

  properties: {

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
  },

  lifetimes: {
    ready: function() {
      this.setData({iconList:param.nav})
    }
  }
})
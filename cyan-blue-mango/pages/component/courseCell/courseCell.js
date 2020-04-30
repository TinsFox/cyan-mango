var Data = require("../../../utils/data")
Component({

  properties: {
    course: {
      type: Object,
      value: {
        "color": 0,
        "weekday": 2,
        "start": 1,
        "last": 3,
        "weeks": "1-16周",
        "course": "传入course数据"
      }
    }
  },

  data: {
    colors: Data.colors
  },

  methods: {
  },

  lifetimes: {
    created: function() {},
    attached: function() {},
  }

})
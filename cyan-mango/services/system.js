/**
 * 系统设置
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');
function navMenu(){
    return new Promise((resolve, reject) => {
    wx.cloud.callFunction({name: 'getAppParam',data: {},}).then(res => {
      if(res.result.errMsg=='collection.get:ok'){
        let param = res.result.data[0].data
       resolve(param)
      }
    })
    .catch(console.error)
  })
}


module.exports = {
  navMenu,
};
wx.$App=require("../config").appParam
/**
 * 页面转跳封装
 * @method wx.$navTo
 * @param {object|string}  e    如果是字符串，直接跳转；对象，就解析到e.target.dataset.url
 * @param {object} args         页面参数
 */
wx.$navTo = function (e, args) {
  if (e == undefined && arg == undefined) return
  console.log('fun: navTo', e, args)
  let args_str = []
  if (typeof args === 'object') {
    for (let i in args) {
      args_str.push(i + '=' + encodeURIComponent(args[i]))
    }
    args_str = '?' + args_str.join("&")
  } else {
    args_str = ''
  }
  if (typeof e == 'object') {
    if (e.target.dataset && e.target.dataset.url) {
      console.log(e.target.dataset)
      wx.navigateTo({
        url: e.target.dataset.url + args_str,
        fail: err => {
          console.warn(err)
          wx.switchTab({
            url: e.target.dataset.url + args_str,
            fail: err => {
              console.error(err)
            }
          })
        }
      })
    } else if (e.currentTarget.dataset && e.currentTarget.dataset.url) {
      console.log(e.currentTarget.dataset)
      const mode = e.currentTarget.dataset.mode || 'prod'
      console.log(mode)
      if(e.currentTarget.dataset.type =='map'){
        let plugin = requirePlugin("subway");
        let key = '2WHBZ-BAGKF-PJOJE-NZOQ4-5LCL7-SNFU2';//使用在腾讯位置服务申请的key;
        let referer = '青芒派'; //调用插件的app的名称
        wx.navigateTo({
        url: 'plugin://subway/index?key=' + key + '&referer=' + referer
        });
        return ;
      }
      wx.navigateTo({
        url: mode==='dev'?'/pages/Setting/dev/dev':e.currentTarget.dataset.url + args_str,
        fail: err => {
          console.warn(err)
          wx.switchTab({
            url: e.currentTarget.dataset.url + args_str,
            fail: err => {
              console.error(err)
            }
          })
        }
      })
    }
  } else {
    wx.navigateTo({
      url: e + args_str,
      fail: err => {
        console.warn(err)
        wx.switchTab({
          url: e + args_str,
          fail: err => {
            console.error(err)
          }
        })
      }
    })
  }
}
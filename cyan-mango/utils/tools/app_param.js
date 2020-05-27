wx.$getParam = function (key){
  if(!key){
    wx.showToast({
      title: '参数丢失',
    })
    return
  }
  let app_param=wx.getStorageSync('app_param')
  return app_param[key]
}

wx.$getPermission = function (key){
  if(!key){
    wx.showToast({
      title: '参数丢失',
    })
    return
  }
  let permission=wx.getStorageSync('permission')
  return permission[key]
}


wx.$bindStatus = function (key){
  if(!key){
    wx.showToast({
      title: '参数丢失',
    })
    return
  }
  let app_param=wx.getStorageSync('permission')
  return app_param[key]
}
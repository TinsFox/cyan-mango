// 检查是否绑定系统
/**
 * 检查是否绑定，未绑定则拉起登录页
 * @param {*} bind 
 */
const check =()=>{
  let flag=wx.getStorageSync('bindStatus')
  if(!flag){
    setTimeout(() => {
      wx.navigateTo({
        url: "/pages/index/setting/login",
      })
    }, 200);
  }
}
const checkBindStatus =()=>{
  let flag=wx.getStorageSync('bindStatus')
  return flag
}
export{
  check,
  checkBindStatus
}
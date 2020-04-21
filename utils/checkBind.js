// 检查是否绑定系统
const NaUrl={
  '1':'/pages/index/app/messageSync/messageSync',
  '2':'/pages/login/login'
}
/**
 * 检查是否绑定，未绑定则拉起登录页
 * @param {*} bind 
 */
const check =(param)=>{
  console.log('绑定状态:'+param.bind)
  if(!param.bind){
    setTimeout(() => {
      wx.navigateTo({
        url: NaUrl[param.type],
      })
    }, 200);
  }
}
export{
  check
}
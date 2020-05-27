export const redis_get_token =(key)=>{
  let current_time= new Date()
  let rv = wx.getStorageSync(key)
  if(!rv){
    // token 不存在，发起登录
    return 'needLogin'
  }else{
    // token 存在，比对时间
    if(current_time.getTime()-rv.start_time > (rv.expire_time * 1000)){
      // 差大于过期时间说明已经超时了，token无效
      return null
    }else{
      return rv.data
    }
  }
}
// 1.5小时失效
export const redis_set_token = (key, value,expire_time = 60*60*1.5)=>{
  let current_time = new Date()
  let data = {
    'data':value,
    'expire_time':expire_time,
    'start_time':current_time.getTime() // 毫秒时间戳
  }
  wx.setStorageSync(key, data)
}
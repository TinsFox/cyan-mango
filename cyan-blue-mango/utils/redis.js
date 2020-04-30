import {Token } from './token'
/**
 * 
 * @param {获取缓存} key 
 */

export const redis_get_token =(key)=>{
  let current_time= new Date()
  let rv = wx.getStorageSync(key)
  if(!rv){
    return null
  }else{
    if(current_time.getTime()-rv.start_time()>(rv.expire_time * 1000)){
      var token=new Token()
      token._refresh_token()
    }else{
      return rv.data
    }
  }
}

export const redis_set_token = (key, value,expire_time=1500)=>{
  let current_time = new Date()
  let data = {
    'data':value,
    'expire_time':expire_time,
    'start_time':current_time.getTime()
  }
  wx.setStorageSync(key, data)
}